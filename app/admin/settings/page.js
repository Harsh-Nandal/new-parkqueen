'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

export default function GlobalSettings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => setForm(data.global || {}))
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
      body: JSON.stringify({ page: 'global', data: form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <p style={{ color: '#6b7280' }}>Loading…</p>

  return (
    <>
      <div className="page-header">
        <h1>Global Settings</h1>
        <p>These values appear across all pages — header, footer, and contact info.</p>
      </div>

      <form onSubmit={save}>
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-image me-2" style={{ color: '#cda434' }}></i>
                Logo
              </div>
              <div className="card-body">
                <ImageUploader
                  label="Site Logo"
                  value={form.logo}
                  onChange={v => set('logo', v)}
                />
                <div className="mb-3">
                  <label className="form-label">Site Name</label>
                  <input
                    className="form-control"
                    value={form.siteName || ''}
                    onChange={e => set('siteName', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-address-book me-2" style={{ color: '#cda434' }}></i>
                Contact Info
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    value={form.phone || ''}
                    onChange={e => set('phone', e.target.value)}
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
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.address || ''}
                    onChange={e => set('address', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <i className="fa-solid fa-rectangle-ad me-2" style={{ color: '#cda434' }}></i>
                Footer
              </div>
              <div className="card-body">
                <ImageUploader
                  label="Footer Background Image"
                  value={form.footerBg}
                  onChange={v => set('footerBg', v)}
                />
                <div className="mb-0">
                  <label className="form-label">Footer Tagline</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.footerTagline || ''}
                    onChange={e => set('footerTagline', e.target.value)}
                  />
                </div>
              </div>
              <div className="save-bar">
                {saved && (
                  <div className="alert-success-custom">
                    <i className="fa-solid fa-circle-check me-2"></i>
                    Global settings saved!
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
