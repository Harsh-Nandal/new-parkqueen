'use client'
import { useState, useEffect } from 'react'

const EMPTY = {
  question: '',
  answer: '',
  category: '',
  status: 'active',
  order: 0,
}

export default function AdminFaqs() {
  const [items, setItems] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { load() }, [])

  function load() {
    fetch('/api/faqs?all=true&limit=100')
      .then(r => r.json())
      .then(d => setItems(d.data || d.faqs || d || []))
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
      question: item.question || '',
      answer: item.answer || '',
      category: item.category || '',
      status: item.status || 'active',
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
    if (!form.question.trim()) {
      setFeedback({ type: 'err', msg: 'Question is required.' })
      return
    }
    if (!form.answer.trim()) {
      setFeedback({ type: 'err', msg: 'Answer is required.' })
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      const res = editId
        ? await fetch(`/api/faqs/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })
        : await fetch('/api/faqs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: editId ? 'FAQ updated.' : 'FAQ created.' })
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
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
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
        <h1>FAQs</h1>
        <p>Manage frequently asked questions.</p>
      </div>

      <div className="card">
        <div className="card-hd">
          <i className="fa-solid fa-circle-question me-2" style={{ color: '#cda434' }}></i>
          All FAQs
          <span style={{ marginLeft: 8, background: '#f3f4f6', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 600 }}>{items.length}</span>
          <button className="btn-gold btn-sm ms-auto" onClick={openAdd}>
            + Add FAQ
          </button>
        </div>
        <div className="card-bd" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No FAQs yet.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id || item.id}>
                  <td style={{ maxWidth: 340 }}>
                    <span title={item.question}>
                      {item.question?.length > 60 ? item.question.slice(0, 60) + '…' : item.question}
                    </span>
                  </td>
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
              <h3>{modal === 'add' ? 'Add FAQ' : 'Edit FAQ'}</h3>
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
                  <label className="flabel">Question *</label>
                  <input className="finput" value={form.question} onChange={e => set('question', e.target.value)} placeholder="Enter the question" />
                </div>

                <div className="mb-3">
                  <label className="flabel">Answer *</label>
                  <textarea className="finput" rows={5} value={form.answer} onChange={e => set('answer', e.target.value)} placeholder="Enter the answer…" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Category</label>
                    <input className="finput" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Booking" />
                  </div>
                  <div>
                    <label className="flabel">Order</label>
                    <input className="finput" type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} />
                  </div>
                </div>

                <div>
                  <label className="flabel">Status</label>
                  <select className="finput" value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : (modal === 'add' ? 'Create FAQ' : 'Update FAQ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
