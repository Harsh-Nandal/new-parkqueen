'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const EMPTY = {
  title: '',
  cardTitle: '',
  description: '',
  image: null,
  cardImage: null,
  status: 'active',
  featured: false,
  order: 0,
}

export default function AdminOffers() {
  const [items, setItems] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    fetch('/api/offers?all=true&limit=50')
      .then(r => r.json())
      .then(d => setItems(d.data || []))
      .catch(() => setItems([]))
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function openAdd() { setForm(EMPTY); setEditId(null); setModal('add'); setFeedback(null) }

  function openEdit(item) {
    setForm({
      title: item.title || '',
      cardTitle: item.cardTitle || '',
      description: item.description || '',
      image: item.image || null,
      cardImage: item.cardImage || null,
      status: item.status || 'active',
      featured: !!item.featured,
      order: item.order ?? 0,
    })
    setEditId(item._id)
    setModal('edit')
    setFeedback(null)
  }

  function closeModal() { setModal(null); setEditId(null); setFeedback(null) }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) { setFeedback({ type: 'err', msg: 'Title is required.' }); return }
    setSaving(true)
    setFeedback(null)
    try {
      const res = editId
        ? await fetch(`/api/offers/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: editId ? 'Offer updated.' : 'Offer created.' })
        load()
        setTimeout(() => closeModal(), 1000)
      } else {
        const d = await res.json().catch(() => ({}))
        setFeedback({ type: 'err', msg: d.error || 'Save failed.' })
      }
    } catch { setFeedback({ type: 'err', msg: 'Network error.' }) }
    setSaving(false)
  }

  async function toggleStatus(item) {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    await fetch(`/api/offers/${item._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    load()
  }

  async function doDelete(id) {
    await fetch(`/api/offers/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    load()
  }

  if (!items) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Special Offers</h1>
        <p>Manage the "Our Latest Special Offer's" section on the home page. Active offers replace the default content.</p>
      </div>

      {/* Info box */}
      <div className="card" style={{ marginBottom: 16, background: '#fffbeb', border: '1px solid #fde68a' }}>
        <div style={{ padding: '12px 16px', fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
          <strong>How it works on the home page:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            <li><strong>Title</strong> → shown on the left panel of each offer card</li>
            <li><strong>Card Title</strong> → shown as overlay text on the right card image</li>
            <li><strong>Main Image</strong> → left panel background image</li>
            <li><strong>Card Image</strong> → right card overlay image</li>
            <li>Set status to <strong>Active</strong> to show on the website. Add at least 1 offer to replace the default content.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <i className="fa-solid fa-tag me-2" style={{ color: '#cda434' }}></i>
          All Offers
          <span style={{ marginLeft: 8, background: '#f3f4f6', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 600 }}>{items.length}</span>
          <button className="btn-gold btn-sm ms-auto" onClick={openAdd}>+ Add Offer</button>
        </div>
        <div className="card-bd" style={{ padding: 0 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
              <i className="fa-solid fa-tag" style={{ fontSize: 28, marginBottom: 10, display: 'block' }}></i>
              No offers yet. Click "+ Add Offer" to create one.
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Main Image</th>
                  <th>Card Image</th>
                  <th>Title</th>
                  <th>Card Title</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    <td>
                      {item.image?.url
                        ? <img src={item.image.url} alt="" className="tbl-img" />
                        : <div style={{ width: 48, height: 36, background: '#f3f4f6', borderRadius: 5, border: '1px solid #e5e7eb' }} />}
                    </td>
                    <td>
                      {item.cardImage?.url
                        ? <img src={item.cardImage.url} alt="" className="tbl-img" />
                        : <div style={{ width: 48, height: 36, background: '#f3f4f6', borderRadius: 5, border: '1px solid #e5e7eb' }} />}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 160 }}>{item.title}</td>
                    <td style={{ color: '#6b7280', maxWidth: 140, fontSize: 12 }}>{item.cardTitle || <em style={{ color: '#d1d5db' }}>same as title</em>}</td>
                    <td>
                      <span className={item.status === 'active' ? 'badge-active' : 'badge-inactive'}>{item.status}</span>
                    </td>
                    <td>{item.order ?? 0}</td>
                    <td>
                      {deleteConfirm === item._id ? (
                        <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#dc2626' }}>Delete?</span>
                          <button className="btn-danger btn-sm" onClick={() => doDelete(item._id)}>Yes</button>
                          <button className="btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                        </span>
                      ) : (
                        <span style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-outline btn-sm" onClick={() => toggleStatus(item)}>
                            {item.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn-outline btn-sm" onClick={() => openEdit(item)}>Edit</button>
                          <button className="btn-danger btn-sm" onClick={() => setDeleteConfirm(item._id)}>Del</button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box" style={{ maxWidth: 620 }}>
            <div className="modal-hd">
              <h3>{modal === 'add' ? 'Add New Offer' : 'Edit Offer'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-bd">
                {feedback && (
                  <div className={feedback.type === 'ok' ? 'alert-ok mb-3' : 'alert-err mb-3'}>{feedback.msg}</div>
                )}

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Offer Title *
                      <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>(shown on left panel)</span>
                    </label>
                    <input className="finput" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Rohtak Heritage Tour" />
                  </div>
                  <div>
                    <label className="flabel">Card Title
                      <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>(overlay on right card image)</span>
                    </label>
                    <input className="finput" value={form.cardTitle} onChange={e => set('cardTitle', e.target.value)} placeholder="e.g. Celebrating Freedom" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Description
                    <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>(optional details)</span>
                  </label>
                  <textarea className="finput" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional offer description…" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <ImageUploader
                      label="Main Image (left panel)"
                      value={form.image?.url}
                      publicId={form.image?.public_id}
                      onChange={img => set('image', img)}
                      folder="parkqueen/offers"
                    />
                  </div>
                  <div>
                    <ImageUploader
                      label="Card Image (right overlay)"
                      value={form.cardImage?.url}
                      publicId={form.cardImage?.public_id}
                      onChange={img => set('cardImage', img)}
                      folder="parkqueen/offers"
                    />
                  </div>
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Status</label>
                    <select className="finput" value={form.status} onChange={e => set('status', e.target.value)}>
                      <option value="active">Active (shows on website)</option>
                      <option value="inactive">Inactive (hidden)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flabel">Display Order</label>
                    <input className="finput" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} placeholder="0 = first" />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 15, height: 15 }} />
                  <span className="flabel" style={{ margin: 0 }}>Featured Offer</span>
                </label>
              </div>

              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Create Offer' : 'Update Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
