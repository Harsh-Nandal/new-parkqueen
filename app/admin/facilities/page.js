'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

export default function AdminFacilities() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => setForm(data.facilities || {}))
  }, [])

  function setItem(id, key, val) {
    setForm(f => ({
      ...f,
      items: f.items.map(item => (item.id === id ? { ...item, [key]: val } : item)),
    }))
  }

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'facilities', data: form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <p style={{ color: '#6b7280' }}>Loading…</p>

  return (
    <>
      <div className="page-header">
        <h1>Facilities Page Editor</h1>
        <p>Update each facility card — image, title, and description.</p>
      </div>

      <form onSubmit={save}>
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-panorama me-2" style={{ color: '#cda434' }}></i>
            Breadcrumb Banner
          </div>
          <div className="card-body" style={{ maxWidth: 400 }}>
            <ImageUploader
              label="Banner Background"
              value={form.breadcrumbBg}
              onChange={v => set('breadcrumbBg', v)}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <i className="fa-solid fa-star me-2" style={{ color: '#cda434' }}></i>
            Facility Cards{' '}
            <span className="badge-section ms-2">6 items</span>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {(form.items || []).map(item => (
                <div key={item.id} className="col-md-6">
                  <div
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      padding: 16,
                      background: '#fafafa',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#cda434',
                        marginBottom: 10,
                        textTransform: 'uppercase',
                      }}
                    >
                      Facility #{item.id}
                    </div>
                    <ImageUploader
                      value={item.image}
                      onChange={v => setItem(item.id, 'image', v)}
                    />
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Title
                      </label>
                      <input
                        className="form-control form-control-sm"
                        value={item.title || ''}
                        onChange={e => setItem(item.id, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Description
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={item.text || ''}
                        onChange={e => setItem(item.id, 'text', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="save-bar">
            {saved && (
              <div className="alert-success-custom">
                <i className="fa-solid fa-circle-check me-2"></i>
                Facilities page saved!
              </div>
            )}
            <button type="submit" className="btn-gold ms-auto" disabled={saving}>
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
