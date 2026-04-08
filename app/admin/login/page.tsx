'use client'
import { useState } from 'react'

export default function AdminLogin() {
  const [inputPin, setInputPin] = useState('')
  const [error, setError] = useState(false)

  const handleVerify = () => {
    const masterPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '102014'

    if (inputPin === masterPin) {
      window.location.href = '/admin/dashboard' 
    } else {
      setError(true)
      alert("Incorrect Pin. Access Denied.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl w-80">
        <h2 className="text-2xl font-bold mb-2 text-center">Admin Access</h2>
        <p className="text-slate-400 text-sm mb-6 text-center">Enter your 6-digit manual code</p>
        
        <input 
          type="password" 
          maxLength={6}
          placeholder="· · · · · ·"
          className="w-full p-4 bg-slate-800 rounded text-center text-2xl tracking-[1em] focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          onChange={(e) => setInputPin(e.target.value)}
        />

        <button 
          onClick={handleVerify}
          className="w-full bg-green-600 hover:bg-green-500 transition-colors py-3 rounded-lg font-bold"
        >
          Confirm Identity
        </button>

        {error && <p className="text-red-500 text-xs mt-4 text-center italic">Invalid authorization code.</p>}
      </div>
    </div>
  )
}