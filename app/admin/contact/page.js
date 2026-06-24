'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

export default function AdminContact() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => setForm(data.contact || {}))
  }, [])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'contact', data: form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <p style={{ color: '#6b7280' }}>Loading…</p>

  return (
    <>
      <div className="page-header">
        <h1>Contact Page Editor</h1>
        <p>Update address, phone, email, and the Google Maps embed.</p>
      </div>

      <form onSubmit={save}>
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-panorama me-2" style={{ color: '#cda434' }}></i>
                Breadcrumb Banner
              </div>
              <div className="card-body">
                <ImageUploader
                  label="Banner Background"
                  value={form.breadcrumbBg?.url || form.breadcrumbBg}
                  publicId={form.breadcrumbBg?.public_id}
                  onChange={v => set('breadcrumbBg', v)}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-address-card me-2" style={{ color: '#cda434' }}></i>
                Contact Details
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Address / Location</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.location || ''}
                    onChange={e => set('location', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email || ''}
                    onChange={e => set('email', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    value={form.phone || ''}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-map me-2" style={{ color: '#cda434' }}></i>
                Google Maps Embed
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Map Embed URL</label>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                    Go to{' '}
                    <a href="https://www.google.com/maps" target="_blank" rel="noreferrer">
                      Google Maps
                    </a>
                    , search your hotel, click Share → Embed a map → copy the{' '}
                    <code>src</code> URL only.
                  </p>
                  <input
                    className="form-control"
                    value={form.mapEmbed || ''}
                    onChange={e => set('mapEmbed', e.target.value)}
                    placeholder="https://maps.google.com/maps?q=..."
                  />
                </div>
                {form.mapEmbed && (
                  <div style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <iframe
                      src={form.mapEmbed}
                      width="100%"
                      height="220"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen
                      loading="lazy"
                      title="Map Preview"
                    ></iframe>
                  </div>
                )}
              </div>
              <div className="save-bar">
                {saved && (
                  <div className="alert-success-custom">
                    <i className="fa-solid fa-circle-check me-2"></i>
                    Contact page saved!
                  </div>
                )}
                <button type="submit" className="btn-gold ms-auto" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
