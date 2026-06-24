'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

function StarDisplay({ rating }) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  return (
    <span style={{ color: '#cda434', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(n)}
      <span style={{ color: '#e5e7eb' }}>{'★'.repeat(5 - n)}</span>
    </span>
  )
}

export default function AdminTestimonialsPage() {
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
    const res = await fetch('/api/testimonials?all=true&limit=100')
    const data = await res.json()
    setItems(data.data || [])
    setLoading(false)
  }

  function openCreate() { setForm({ status: 'active', rating: 5 }); setModal('create'); setMsg({}) }
  function openEdit(item) { setForm({ ...item }); setModal(item); setMsg({}) }
  function closeModal() { setModal(null); setForm({}) }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const isEdit = modal && modal._id
    const url = isEdit ? `/api/testimonials/${modal._id}` : '/api/testimonials'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) {
      setMsg({ type: 'ok', text: 'Saved!' })
      load()
      setTimeout(closeModal, 800)
    } else {
      setMsg({ type: 'err', text: data.error || 'Error saving testimonial' })
    }
    setSaving(false)
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    await fetch(`/api/testimonials/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    load()
  }

  async function doDelete(item) {
    await fetch(`/api/testimonials/${item._id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    load()
  }

  return (
    <>
      {/* Page Header */}
      <div className="pg-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage guest reviews and ratings displayed on the website.</p>
        </div>
        <button className="btn-gold ms-auto" onClick={openCreate}>+ Add Testimonial</button>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-hd">
          All Testimonials <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>({items.length})</span>
        </div>
        <div className="card-bd">
          {loading ? (
            <p style={{ color: '#6b7280', padding: 20 }}>Loading…</p>
          ) : items.length === 0 ? (
            <p style={{ color: '#9ca3af', padding: 20, textAlign: 'center' }}>No records yet. Click &quot;+ Add&quot; to create one.</p>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#d1d5db',
                            fontSize: 18,
                          }}
                        >
                          <i className="fa-solid fa-user" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td style={{ color: '#6b7280' }}>{item.role || '—'}</td>
                    <td><StarDisplay rating={item.rating} /></td>
                    <td>
                      <span className={item.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                        {item.status || 'inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-outline btn-sm me-2"
                        onClick={() => toggleStatus(item)}
                        title="Toggle status"
                      >
                        {item.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn-outline btn-sm me-2" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-hd">
              <span>{modal === 'create' ? 'Add New Testimonial' : `Edit: ${modal.name}`}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-bd">
              {msg.text && (
                <div className={msg.type === 'ok' ? 'alert-ok' : 'alert-err'} style={{ marginBottom: 12 }}>
                  {msg.text}
                </div>
              )}

              {/* Name, Role, Rating */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Guest Name *</label>
                  <input
                    className="finput"
                    placeholder="e.g. John Smith"
                    value={form.name || ''}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="flabel">Role / Title</label>
                  <input
                    className="finput"
                    placeholder="e.g. Business Traveller"
                    value={form.role || ''}
                    onChange={e => set('role', e.target.value)}
                  />
                </div>
                <div>
                  <label className="flabel">Rating (1 – 5)</label>
                  <input
                    className="finput"
                    type="number"
                    min={1}
                    max={5}
                    placeholder="5"
                    value={form.rating ?? ''}
                    onChange={e => set('rating', Number(e.target.value))}
                  />
                  {form.rating ? (
                    <div style={{ marginTop: 4 }}>
                      <StarDisplay rating={form.rating} />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Content */}
              <div className="mb-3">
                <label className="flabel">Review Content *</label>
                <textarea
                  className="finput"
                  rows={4}
                  placeholder="Guest's review text…"
                  value={form.content || ''}
                  onChange={e => set('content', e.target.value)}
                />
              </div>

              {/* Avatar Image */}
              <div className="mb-3">
                <label className="flabel">Avatar / Photo</label>
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
                {saving ? 'Saving…' : 'Save Testimonial'}
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
              <span>Delete Testimonial</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="modal-bd">
              <p style={{ margin: 0, color: '#374151' }}>
                Are you sure you want to delete the review by <strong>{confirmDelete.name}</strong>? This action cannot be undone.
              </p>
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
