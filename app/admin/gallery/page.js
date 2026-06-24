'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const CATEGORIES = ['rooms', 'dining', 'events', 'facilities', 'about', 'exterior', 'other']

export default function AdminGalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | itemObject
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/gallery?all=true&limit=100')
    const data = await res.json()
    setItems(data.data || [])
    setLoading(false)
  }

  function openCreate() { setForm({ status: 'active', category: 'rooms' }); setModal('create'); setMsg({}) }
  function openEdit(item) { setForm({ ...item }); setModal(item); setMsg({}) }
  function closeModal() { setModal(null); setForm({}) }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const isEdit = modal && modal._id
    const url = isEdit ? `/api/gallery/${modal._id}` : '/api/gallery'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) {
      setMsg({ type: 'ok', text: 'Saved!' })
      load()
      setTimeout(closeModal, 800)
    } else {
      setMsg({ type: 'err', text: data.error || 'Error saving gallery item' })
    }
    setSaving(false)
  }

  async function doDelete(item) {
    await fetch(`/api/gallery/${item._id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    load()
  }

  return (
    <>
      {/* Page Header */}
      <div className="pg-header">
        <div>
          <h1>Gallery</h1>
          <p>Manage hotel photo gallery images and categories.</p>
        </div>
        <button className="btn-gold ms-auto" onClick={openCreate}>+ Add Image</button>
      </div>

      {/* Gallery Grid Card */}
      <div className="card">
        <div className="card-hd">
          All Images <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>({items.length})</span>
        </div>
        <div className="card-bd">
          {loading ? (
            <p style={{ color: '#6b7280', padding: 20 }}>Loading…</p>
          ) : items.length === 0 ? (
            <p style={{ color: '#9ca3af', padding: 20, textAlign: 'center' }}>No records yet. Click &quot;+ Add&quot; to create one.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 12,
              }}
            >
              {items.map(item => (
                <div
                  key={item._id}
                  style={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {item.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.title || 'Gallery image'}
                      style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: 120,
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d1d5db',
                        fontSize: 28,
                      }}
                    >
                      <i className="fa-solid fa-image" />
                    </div>
                  )}
                  <div style={{ padding: '8px 10px' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title || 'Untitled'}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'capitalize' }}>
                      {item.category}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, padding: '0 10px 10px' }}>
                    <button className="btn-outline btn-sm" onClick={() => openEdit(item)}>Edit</button>
                    <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(item)}>Del</button>
                  </div>
                  {/* Status indicator dot */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: item.status === 'active' ? '#22c55e' : '#9ca3af',
                      border: '1.5px solid #fff',
                    }}
                    title={item.status === 'active' ? 'Active' : 'Inactive'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-hd">
              <span>{modal === 'create' ? 'Add Gallery Image' : `Edit: ${modal.title || 'Image'}`}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-bd">
              {msg.text && (
                <div className={msg.type === 'ok' ? 'alert-ok' : 'alert-err'} style={{ marginBottom: 12 }}>
                  {msg.text}
                </div>
              )}

              {/* Title + Category */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Title</label>
                  <input
                    className="finput"
                    placeholder="e.g. Swimming Pool"
                    value={form.title || ''}
                    onChange={e => set('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="flabel">Category</label>
                  <select
                    className="finput"
                    value={form.category || 'rooms'}
                    onChange={e => set('category', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload (required) */}
              <div className="mb-3">
                <label className="flabel">Image *</label>
                <ImageUploader
                  value={form.image?.url}
                  publicId={form.image?.public_id}
                  onChange={(img) => set('image', img || null)}
                />
              </div>

              {/* Status + Order */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Status</label>
                  <select className="finput" value={form.status || 'active'} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="flabel">Order</label>
                  <input
                    className="finput"
                    type="number"
                    placeholder="0"
                    value={form.order ?? ''}
                    onChange={e => set('order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="modal-ft">
              <button className="btn-outline me-2" onClick={closeModal}>Cancel</button>
              <button className="btn-gold" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-bg" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-hd">
              <span>Delete Image</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="modal-bd">
              <p style={{ margin: 0, color: '#374151' }}>
                Are you sure you want to delete{' '}
                <strong>{confirmDelete.title || 'this image'}</strong>? This action cannot be undone.
              </p>
              {confirmDelete.image?.url && (
                <img
                  src={confirmDelete.image.url}
                  alt="preview"
                  style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginTop: 12 }}
                />
              )}
            </div>
            <div className="modal-ft">
              <button className="btn-outline me-2" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => doDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
