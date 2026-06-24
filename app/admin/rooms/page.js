'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

export default function AdminRoomsPage() {
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
    const res = await fetch('/api/rooms?all=true&limit=100')
    const data = await res.json()
    setItems(data.data || [])
    setLoading(false)
  }

  function openCreate() { setForm({ size: '1500 SQ.FT', status: 'active', featured: false, amenities: [], images: [] }); setModal('create'); setMsg({}) }
  function openEdit(item) { setForm({ ...item }); setModal(item); setMsg({}) }
  function closeModal() { setModal(null); setForm({}) }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const isEdit = modal && modal._id
    const url = isEdit ? `/api/rooms/${modal._id}` : '/api/rooms'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) {
      setMsg({ type: 'ok', text: 'Saved!' })
      load()
      setTimeout(closeModal, 800)
    } else {
      setMsg({ type: 'err', text: data.error || 'Error saving room' })
    }
    setSaving(false)
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    await fetch(`/api/rooms/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    load()
  }

  async function doDelete(item) {
    await fetch(`/api/rooms/${item._id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    load()
  }

  const thumbnail = (item) => item.images?.[0]?.url || null

  return (
    <>
      {/* Page Header */}
      <div className="pg-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage hotel room listings, pricing and availability.</p>
        </div>
        <button className="btn-gold ms-auto" onClick={openCreate}>+ Add Room</button>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-hd">
          All Rooms <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400, marginLeft: 6 }}>({items.length})</span>
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>
                      {thumbnail(item) ? (
                        <img src={thumbnail(item)} alt={item.name} className="tbl-img" />
                      ) : (
                        <div className="tbl-img" style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: 18 }}>
                          <i className="fa-solid fa-image" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{item.category || '—'}</td>
                    <td>{item.price || '—'}</td>
                    <td>{item.capacity || '—'}</td>
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
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-hd">
              <span>{modal === 'create' ? 'Add New Room' : `Edit: ${modal.name}`}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-bd">
              {msg.text && (
                <div className={msg.type === 'ok' ? 'alert-ok' : 'alert-err'} style={{ marginBottom: 12 }}>
                  {msg.text}
                </div>
              )}

              {/* Row 1: name, category, price */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Room Name *</label>
                  <input className="finput" placeholder="e.g. Deluxe Suite" value={form.name || ''} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="flabel">Category</label>
                  <input className="finput" placeholder="e.g. Standard, Deluxe" value={form.category || ''} onChange={e => set('category', e.target.value)} />
                </div>
                <div>
                  <label className="flabel">Price</label>
                  <input className="finput" placeholder="e.g. $99 / Night" value={form.price || ''} onChange={e => set('price', e.target.value)} />
                </div>
              </div>

              {/* Row 2: size, capacity, order */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Size</label>
                  <input className="finput" placeholder="e.g. 1500 SQ.FT" value={form.size || ''} onChange={e => set('size', e.target.value)} />
                </div>
                <div>
                  <label className="flabel">Capacity</label>
                  <input className="finput" type="number" placeholder="e.g. 2" value={form.capacity || ''} onChange={e => set('capacity', Number(e.target.value))} />
                </div>
                <div>
                  <label className="flabel">Order</label>
                  <input className="finput" type="number" placeholder="0" value={form.order ?? ''} onChange={e => set('order', Number(e.target.value))} />
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="flabel">Description</label>
                <textarea
                  className="finput"
                  rows={3}
                  placeholder="Short room description…"
                  value={form.description || ''}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              {/* First Image */}
              <div className="mb-3">
                <label className="flabel">Primary Image</label>
                <ImageUploader
                  value={form.images?.[0]?.url}
                  publicId={form.images?.[0]?.public_id}
                  onChange={(img) => set('images', img ? [img, ...(form.images || []).slice(1)] : (form.images || []).slice(1))}
                />
              </div>

              {/* Amenities */}
              <div className="mb-3">
                <label className="flabel">Amenities <span style={{ fontWeight: 400, color: '#9ca3af' }}>(one per line)</span></label>
                <textarea
                  className="finput"
                  rows={4}
                  placeholder={"Free WiFi\nAir Conditioning\nFlat Screen TV"}
                  value={(form.amenities || []).join('\n')}
                  onChange={e => set('amenities', e.target.value.split('\n').filter(Boolean))}
                />
              </div>

              {/* Featured + Status */}
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Status</label>
                  <select className="finput" value={form.status || 'active'} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 26 }}>
                  <input
                    type="checkbox"
                    id="rm-featured"
                    checked={!!form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: '#cda434', cursor: 'pointer' }}
                  />
                  <label htmlFor="rm-featured" className="flabel" style={{ margin: 0, cursor: 'pointer' }}>Featured Room</label>
                </div>
              </div>
            </div>

            <div className="modal-ft">
              <button className="btn-outline me-2" onClick={closeModal}>Cancel</button>
              <button className="btn-gold" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save Room'}
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
              <span>Delete Room</span>
              <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
            </div>
            <div className="modal-bd">
              <p style={{ margin: 0, color: '#374151' }}>
                Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.
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
