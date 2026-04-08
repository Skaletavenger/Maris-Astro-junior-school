'use client'
import { useMemo, useState, type DragEvent } from 'react'

type UploadItem = {
  id: string
  fileName: string
  previewUrl?: string
  type: 'IMAGE' | 'DOCUMENT'
  status: 'pending' | 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}

const uploadEndpoint = (file: File) => (file.type.startsWith('image/') ? 'galleryImage' : 'schoolDocument')

export default function AdminDashboard() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Drop files or click to upload gallery images and documents.')

  const galleryItems = useMemo(() => items.filter((item) => item.type === 'IMAGE'), [items])
  const documentItems = useMemo(() => items.filter((item) => item.type === 'DOCUMENT'), [items])

  const createUploadItem = (file: File): UploadItem => ({
    id: `${file.name}-${file.size}-${Date.now()}`,
    fileName: file.name,
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    type: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
    status: 'pending',
  })

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (!fileArray.length) return

    const newItems = fileArray.map(createUploadItem)
    setItems((prev) => [...newItems, ...prev])
    setStatusMessage(`Queued ${newItems.length} file${newItems.length === 1 ? '' : 's'} for upload.`)

    for (const file of fileArray) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    const endpoint = uploadEndpoint(file)
    setItems((prev) =>
      prev.map((item) =>
        item.fileName === file.name && item.status === 'pending'
          ? { ...item, status: 'uploading' }
          : item
      )
    )

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/uploadthing/${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Upload failed')
      }

      const responseData = await response.json()
      const uploaded = Array.isArray(responseData) ? responseData[0] : responseData
      setItems((prev) =>
        prev.map((item) =>
          item.fileName === file.name && item.status === 'uploading'
            ? {
                ...item,
                status: 'done',
                url: uploaded?.fileUrl || uploaded?.url || item.url,
              }
            : item
        )
      )
      setStatusMessage(`Uploaded ${file.name}`)
    } catch (error) {
      setItems((prev) =>
        prev.map((item) =>
          item.fileName === file.name && item.status === 'uploading'
            ? { ...item, status: 'error', error: (error as Error).message }
            : item
        )
      )
      setStatusMessage(`Upload failed for ${file.name}`)
    }
  }

  const handleDragEvents = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    handleDragEvents(event)
    setIsDragging(false)
    if (event.dataTransfer.files.length) {
      await handleFiles(event.dataTransfer.files)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#FFD700]">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-2">Upload gallery images and school documents directly from the admin portal.</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-full border border-[#FFD700] bg-[#000080] px-5 py-2 text-sm font-medium text-[#FFD700] transition hover:bg-[#001070]"
          >
            Sign Out
          </button>
        </header>

        <section className="space-y-6">
          <div
            onDragEnter={(event) => { handleDragEvents(event); setIsDragging(true) }}
            onDragLeave={(event) => { handleDragEvents(event); setIsDragging(false) }}
            onDragOver={handleDragEvents}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 ${isDragging ? 'border-[#FFD700] bg-[#000080]/20' : 'border-dashed border-[#FFD700]/40 bg-slate-950/70'} p-10 text-center transition-all`}
          >
            <div className="mx-auto max-w-2xl">
              <p className="text-lg font-semibold text-[#FFD700]">Drag & Drop Files Here</p>
              <p className="mt-3 text-sm text-slate-400">
                Drop multiple files at once. Image uploads are stored as gallery images, and PDFs/Word/Excel files are stored as documents.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#FFD700] bg-[#000080] px-5 py-3 text-sm font-medium text-[#FFD700]">
                Drop files or click to select from your computer
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#FFD700]/30 bg-slate-950/80 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#FFD700]">Upload Status</h2>
                <p className="mt-1 text-sm text-slate-400">{statusMessage}</p>
              </div>
              <button
                onClick={() => document.getElementById('file-input')?.click()}
                className="rounded-full bg-[#000080] px-5 py-2 text-sm font-medium text-[#FFD700] transition hover:bg-[#001070]"
              >
                Select Files
              </button>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              title="Select files to upload"
              placeholder="Select files"
              className="hidden"
              onChange={(event) => event.target.files && handleFiles(event.target.files)}
            />
          </div>

          <div className="grid gap-8">
            <div className="rounded-3xl border border-[#FFD700]/30 bg-slate-950/80 p-6">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-5">Instagram Mode</h3>
              {galleryItems.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="group overflow-hidden rounded-3xl border border-[#FFD700]/20 bg-slate-900/80">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.previewUrl}
                          alt={item.fileName}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-200">
                          <span className="truncate">{item.fileName}</span>
                          <span className={`rounded-full px-2 py-1 text-[11px] ${item.status === 'done' ? 'bg-[#FFD700]/20 text-[#FFD700]' : item.status === 'uploading' ? 'bg-slate-700 text-slate-100' : item.status === 'error' ? 'bg-red-500/10 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#FFD700]/20">
                          <div className={`h-full rounded-full bg-[#FFD700] ${item.status === 'uploading' ? 'w-1/2 animate-pulse' : item.status === 'done' ? 'w-full' : item.status === 'error' ? 'w-1/3' : 'w-0'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#FFD700]/30 bg-[#000080]/10 p-12 text-center text-slate-500">
                  No gallery images uploaded yet.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#FFD700]/30 bg-slate-950/80 p-6">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-5">Document Mode</h3>
              {documentItems.length ? (
                <div className="space-y-4">
                  {documentItems.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 rounded-3xl border border-[#FFD700]/20 bg-slate-900/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">{item.fileName}</p>
                        <p className="text-sm text-slate-400">{item.status === 'done' ? 'Upload complete' : item.status === 'uploading' ? 'Uploading…' : item.error ? `Error: ${item.error}` : 'Pending upload'}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-[#FFD700] bg-[#000080] px-4 py-2 text-sm font-medium text-[#FFD700] transition hover:bg-[#001070]"
                          >
                            View
                          </a>
                        ) : null}
                        <span className="rounded-full bg-[#FFD700]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#FFD700]/90">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#FFD700]/30 bg-[#000080]/10 p-12 text-center text-slate-500">
                  No documents uploaded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
