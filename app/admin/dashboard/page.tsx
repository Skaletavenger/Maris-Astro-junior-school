'use client'
import { useEffect, useMemo, useState, type DragEvent } from 'react'

type UploadItem = {
  id: string
  fileName: string
  previewUrl?: string
  type: 'IMAGE' | 'DOCUMENT'
  status: 'pending' | 'uploading' | 'done' | 'error'
  url?: string
  error?: string
}

type GalleryImage = {
  id: string
  url: string
  name: string | null
  createdAt: string
}

type SchoolDocument = {
  id: string
  url: string
  name: string
  createdAt: string
}

type Toast = {
  id: string
  message: string
  type: 'success' | 'error'
}

export default function AdminDashboard() {
  const [items, setItems] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Drop files or click to upload gallery images and documents.')
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [documents, setDocuments] = useState<SchoolDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const galleryItems = useMemo(() => items.filter((item) => item.type === 'IMAGE'), [items])
  const documentItems = useMemo(() => items.filter((item) => item.type === 'DOCUMENT'), [items])

  useEffect(() => {
    fetchGalleryImages()
    fetchDocuments()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/admin/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data)
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
  }

  const addToast = (message: string, type: 'success' | 'error') => {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
    }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, 5000)
  }

  const deleteGalleryImage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== id))
        addToast('Gallery image deleted successfully', 'success')
      } else {
        addToast('Failed to delete gallery image', 'error')
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      addToast('Failed to delete gallery image', 'error')
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id))
        addToast('Document deleted successfully', 'success')
      } else {
        addToast('Failed to delete document', 'error')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      addToast('Failed to delete document', 'error')
    }
  }

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

    setIsUploading(true)
    for (const file of fileArray) {
      await uploadFile(file)
    }
    setIsUploading(false)
  }

  const uploadFile = async (file: File) => {
    const type = file.type.startsWith('image/') ? 'image' : 'document';
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
      formData.append('type', type)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Upload failed')
      }

      const responseData = await response.json()
      setItems((prev) =>
        prev.map((item) =>
          item.fileName === file.name && item.status === 'uploading'
            ? {
                ...item,
                status: 'done',
                url: responseData.url,
              }
            : item
        )
      )
      setStatusMessage(`Uploaded ${file.name}`)

      // Refresh the lists
      if (type === 'image') {
        fetchGalleryImages()
      } else {
        fetchDocuments()
      }

      addToast(`${file.name} uploaded successfully`, 'success')
    } catch (error) {
      setItems((prev) =>
        prev.map((item) =>
          item.fileName === file.name && item.status === 'uploading'
            ? { ...item, status: 'error', error: (error as Error).message }
            : item
        )
      )
      setStatusMessage(`Upload failed for ${file.name}`)
      addToast(`Upload failed for ${file.name}`, 'error')
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
                disabled={isUploading}
                className="rounded-full bg-[#000080] px-5 py-2 text-sm font-medium text-[#FFD700] transition hover:bg-[#001070] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Select Files'}
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
              <h3 className="text-lg font-semibold text-[#FFD700] mb-5">Gallery Images</h3>
              {galleryItems.length > 0 || galleryImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Show uploaded items first */}
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
                  {/* Show existing gallery images */}
                  {galleryImages.map((image) => (
                    <div key={image.id} className="group overflow-hidden rounded-3xl border border-[#FFD700]/20 bg-slate-900/80">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.name || 'Gallery image'}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <button
                          onClick={() => deleteGalleryImage(image.id)}
                          className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          title="Delete image"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-200">
                          <span className="truncate">{image.name || 'Unnamed image'}</span>
                          <span className="rounded-full px-2 py-1 text-[11px] bg-[#FFD700]/20 text-[#FFD700]">
                            Uploaded
                          </span>
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
              <h3 className="text-lg font-semibold text-[#FFD700] mb-5">School Documents</h3>
              {documentItems.length > 0 || documents.length > 0 ? (
                <div className="space-y-4">
                  {/* Show uploaded items first */}
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
                  {/* Show existing documents */}
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col gap-3 rounded-3xl border border-[#FFD700]/20 bg-slate-900/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-100">{doc.name}</p>
                        <p className="text-sm text-slate-400">Uploaded on {new Date(doc.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#FFD700] bg-[#000080] px-4 py-2 text-sm font-medium text-[#FFD700] transition hover:bg-[#001070]"
                        >
                          View
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="rounded-full bg-red-500/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                          title="Delete document"
                        >
                          Delete
                        </button>
                        <span className="rounded-full bg-[#FFD700]/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#FFD700]/90">
                          DOCUMENT
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

        {/* Toast notifications */}
        {toasts.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`rounded-lg p-4 shadow-lg ${
                  toast.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {toast.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
