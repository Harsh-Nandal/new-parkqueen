'use client'
import { useState, useEffect } from 'react'

const STATUS_LABELS = { new: 'New', read: 'Read', replied: 'Replied' }
const STATUS_COLORS = { new: '#ef4444', read: '#f59e0b', replied: '#10b981' }

export default function AdminContacts() {
  const [items, setItems] = useState(null)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => { load() }, [filter])

  async function load() {
    const q = filter ? `?status=${filter}&limit=50` : '?limit=50'
    const res = await fetch(`/api/admin/contacts${q}`)
    const d = await res.json()
    setItems(d.data || [])
  }

  async function updateStatus(id, status) {
    setUpdating(true)
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(false)
    if (selected?._id === id) setSelected(s => ({ ...s, status }))
    load()
  }

  async function doDelete(id) {
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    if (selected?._id === id) setSelected(null)
    load()
  }

  function fmt(d) {
    return d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
  }

  const counts = items ? {
    total: items.length,
    new: items.filter(i => i.status === 'new').length,
  } : {}

  if (!items) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Contact Messages</h1>
        <p>All enquiries submitted through the contact form.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[['Total', counts.total, '#6366f1'], ['New / Unread', counts.new, '#ef4444']].map(([label, val, color]) => (
          <div key={label} className="card" style={{ padding: '14px 20px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{val ?? '…'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 16 }}>
        {/* List */}
        <div className="card">
          <div className="card-hd" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-envelope" style={{ color: '#cda434' }}></i>
            Messages
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {['', 'new', 'read', 'replied'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: '4px 12px', fontSize: 12, borderRadius: 20, border: '1px solid',
                    cursor: 'pointer',
                    borderColor: filter === s ? '#cda434' : '#e5e7eb',
                    background: filter === s ? '#cda434' : '#fff',
                    color: filter === s ? '#fff' : '#374151',
                  }}
                >
                  {s ? STATUS_LABELS[s] : 'All'}
                </button>
              ))}
            </div>
          </div>
          <div className="card-bd" style={{ padding: 0 }}>
            {items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
                <i className="fa-solid fa-inbox" style={{ fontSize: 28, marginBottom: 10, display: 'block' }}></i>
                No messages found.
              </div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr
                      key={item._id}
                      style={{ cursor: 'pointer', background: selected?._id === item._id ? '#fffbeb' : '' }}
                      onClick={() => { setSelected(item); updateStatus(item._id, item.status === 'new' ? 'read' : item.status) }}
                    >
                      <td>
                        <span style={{
                          background: `${STATUS_COLORS[item.status]}20`,
                          color: STATUS_COLORS[item.status],
                          borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600
                        }}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td style={{ fontWeight: item.status === 'new' ? 700 : 400 }}>{item.name}</td>
                      <td style={{ fontSize: 12, color: '#6b7280' }}>{item.email}</td>
                      <td style={{ fontSize: 12, color: '#9ca3af' }}>{fmt(item.createdAt)}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {deleteConfirm === item._id ? (
                          <span style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-danger btn-sm" onClick={() => doDelete(item._id)}>Yes</button>
                            <button className="btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                          </span>
                        ) : (
                          <button className="btn-danger btn-sm" onClick={() => setDeleteConfirm(item._id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Message Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>×</button>
            </div>
            <div className="card-bd">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{selected.name}</div>
                <a href={`mailto:${selected.email}`} style={{ color: '#cda434', fontSize: 13, textDecoration: 'none' }}>{selected.email}</a>
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>{fmt(selected.createdAt)}</div>
              <div style={{ background: '#f9fafb', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', borderLeft: '3px solid #cda434' }}>
                {selected.message}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['new', 'read', 'replied'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected._id, s)}
                    disabled={updating || selected.status === s}
                    style={{
                      padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid',
                      cursor: selected.status === s ? 'default' : 'pointer',
                      borderColor: selected.status === s ? STATUS_COLORS[s] : '#e5e7eb',
                      background: selected.status === s ? `${STATUS_COLORS[s]}15` : '#fff',
                      color: selected.status === s ? STATUS_COLORS[s] : '#374151',
                      fontWeight: selected.status === s ? 700 : 400,
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Enquiry — The ParkQueen Hotel`}
                  className="btn-gold btn-sm"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onClick={() => updateStatus(selected._id, 'replied')}
                >
                  <i className="fa-solid fa-reply"></i> Reply
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
