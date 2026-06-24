'use client'
import { useRef, useState } from 'react'

export default function ImageUploader({ label, value, publicId, onChange, folder = 'parkqueen' }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok && data.success) {
      if (publicId) {
        await fetch('/api/admin/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: publicId }),
        }).catch(() => {})
      }
      onChange({ url: data.url, public_id: data.public_id })
    } else {
      setError(data.error || 'Upload failed')
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete() {
    if (!publicId) { onChange(null); return }
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId }),
    }).catch(() => {})
    onChange(null)
  }

  const url = typeof value === 'string' ? value : value?.url

  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', display: 'block', marginBottom: 6 }}>
          {label}
        </label>
      )}
      {url ? (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <img
            src={url}
            alt="preview"
            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, border: '2px solid #e5e7eb', display: 'block' }}
          />
          <button
            type="button"
            onClick={handleDelete}
            style={{
              position: 'absolute', top: 6, right: 6, background: 'rgba(220,53,69,.85)',
              color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28,
              cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <div style={{
          width: '100%', height: 140, background: '#f9fafb', border: '2px dashed #e5e7eb',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', color: '#9ca3af', fontSize: 13, gap: 6,
        }}>
          <i className="fa-solid fa-image" style={{ fontSize: 24 }}></i>
          <span>No image</span>
        </div>
      )}
      <input type="file" ref={ref} accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        style={{
          display: 'block', width: '100%', marginTop: 6, background: '#f9fafb',
          border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px',
          fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? .7 : 1,
        }}
      >
        {uploading ? '⏳ Uploading to Cloudinary…' : url ? '🔄 Replace Image' : '☁️ Upload Image'}
      </button>
      {url && (
        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3, wordBreak: 'break-all' }}>{url}</div>
      )}
      {error && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  )
}
