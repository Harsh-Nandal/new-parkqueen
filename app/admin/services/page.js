'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const EMPTY = {
  title: '',
  description: '',
  icon: '',
  category: '',
  image: null,
  status: 'active',
  featured: false,
  order: 0,
}

export default function AdminServices() {
  const [items, setItems] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    fetch('/api/services?all=true&limit=50')
      .then(r => r.json())
      .then(d => setItems(d.data || d.services || d || []))
      .catch(() => setItems([]))
  }

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function openAdd() {
    setForm(EMPTY)
    setEditId(null)
    setModal('add')
    setFeedback(null)
  }

  function openEdit(item) {
    setForm({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || '',
      category: item.category || '',
      image: item.image || null,
      status: item.status || 'active',
      featured: !!item.featured,
      order: item.order ?? 0,
    })
    setEditId(item._id || item.id)
    setModal('edit')
    setFeedback(null)
  }

  function closeModal() {
    setModal(null)
    setEditId(null)
    setFeedback(null)
  }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setFeedback({ type: 'err', msg: 'Title is required.' })
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      const res = editId
        ? await fetch(`/api/services/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })
        : await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: editId ? 'Service updated.' : 'Service created.' })
        load()
        setTimeout(() => closeModal(), 1200)
      } else {
        const d = await res.json().catch(() => ({}))
        setFeedback({ type: 'err', msg: d.message || d.error || 'Save failed.' })
      }
    } catch {
      setFeedback({ type: 'err', msg: 'Network error.' })
    }
    setSaving(false)
  }

  async function confirmDelete(id) {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDeleteConfirm(null)
        load()
      } else {
        alert('Delete failed.')
      }
    } catch {
      alert('Network error.')
    }
  }

  if (!items) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Services</h1>
        <p>Manage hotel services and amenities.</p>
      </div>

      <div className="card">
        <div className="card-hd">
          <i className="fa-solid fa-star me-2" style={{ color: '#cda434' }}></i>
          All Services
          <span style={{ marginLeft: 8, background: '#f3f4f6', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 600 }}>{items.length}</span>
          <button className="btn-gold btn-sm ms-auto" onClick={openAdd}>
            + Add Service
          </button>
        </div>
        <div className="card-bd" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No services yet.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id || item.id}>
                  <td>
                    <i
                      className={`fa-solid ${item.icon || 'fa-circle'}`}
                      style={{ fontSize: 18, color: '#cda434', width: 28, textAlign: 'center' }}
                    ></i>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                  <td>
                    <span className={item.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                      {item.status || 'active'}
                    </span>
                  </td>
                  <td>{item.order ?? 0}</td>
                  <td>
                    {deleteConfirm === (item._id || item.id) ? (
                      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#dc2626' }}>Delete?</span>
                        <button className="btn-danger btn-sm" onClick={() => confirmDelete(item._id || item.id)}>Yes</button>
                        <button className="btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                      </span>
                    ) : (
                      <span style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-outline btn-sm" onClick={() => openEdit(item)}>Edit</button>
                        <button className="btn-danger btn-sm" onClick={() => setDeleteConfirm(item._id || item.id)}>Delete</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-hd">
              <h3>{modal === 'add' ? 'Add Service' : 'Edit Service'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-bd">
                {feedback && (
                  <div className={feedback.type === 'ok' ? 'alert-ok mb-3' : 'alert-err mb-3'}>
                    {feedback.msg}
                  </div>
                )}

                <div className="mb-3">
                  <label className="flabel">Title *</label>
                  <input className="finput" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Service title" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Icon</label>
                    <input className="finput" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="e.g. fa-utensils" />
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>FontAwesome icon class, e.g. fa-utensils</div>
                  </div>
                  <div>
                    <label className="flabel">Category</label>
                    <input className="finput" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Dining" />
                  </div>
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Order</label>
                    <input className="finput" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="flabel">Status</label>
                    <select className="finput" value={form.status} onChange={e => set('status', e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Description</label>
                  <textarea className="finput" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Service description…" />
                </div>

                <div className="mb-3">
                  <ImageUploader
                    label="Service Image"
                    value={form.image?.url}
                    publicId={form.image?.public_id}
                    onChange={img => set('image', img)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="svc-featured"
                    checked={form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="svc-featured" className="flabel" style={{ margin: 0 }}>Featured Service</label>
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : (modal === 'add' ? 'Create Service' : 'Update Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
