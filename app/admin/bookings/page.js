'use client'
import { useState, useEffect } from 'react'

const STATUS_LABELS = { pending: 'Pending', confirmed: 'Confirmed', cancelled: 'Cancelled', completed: 'Completed' }
const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', cancelled: '#ef4444', completed: '#6366f1' }

export default function AdminBookings() {
  const [items, setItems] = useState(null)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => { load() }, [filter])

  async function load() {
    const q = filter ? `?status=${filter}&limit=50` : '?limit=50'
    const res = await fetch(`/api/admin/bookings${q}`)
    const d = await res.json()
    setItems(d.data || [])
  }

  async function updateStatus(id, status) {
    setUpdating(true)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(false)
    if (selected?._id === id) setSelected(s => ({ ...s, status }))
    load()
  }

  async function saveNote(id) {
    setUpdating(true)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: note }),
    })
    setUpdating(false)
    if (selected?._id === id) setSelected(s => ({ ...s, adminNote: note }))
  }

  async function doDelete(id) {
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    if (selected?._id === id) setSelected(null)
    load()
  }

  function fmt(d) {
    return d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
  }

  const counts = items ? {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    confirmed: items.filter(i => i.status === 'confirmed').length,
  } : {}

  if (!items) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Booking Requests</h1>
        <p>All room booking requests submitted through the website.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[['Total', counts.total, '#6366f1'], ['Pending', counts.pending, '#f59e0b'], ['Confirmed', counts.confirmed, '#10b981']].map(([label, val, color]) => (
          <div key={label} className="card" style={{ padding: '14px 20px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color }}>{val ?? '…'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 440px' : '1fr', gap: 16 }}>
        {/* List */}
        <div className="card">
          <div className="card-hd" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bed" style={{ color: '#cda434' }}></i>
            Bookings
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: '4px 12px', fontSize: 11, borderRadius: 20, border: '1px solid', cursor: 'pointer',
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
                <i className="fa-solid fa-bed" style={{ fontSize: 28, marginBottom: 10, display: 'block' }}></i>
                No bookings found.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr
                        key={item._id}
                        style={{ cursor: 'pointer', background: selected?._id === item._id ? '#fffbeb' : '' }}
                        onClick={() => { setSelected(item); setNote(item.adminNote || '') }}
                      >
                        <td style={{ fontWeight: 700, color: '#cda434', fontSize: 12 }}>{item.bookingRef}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.email}</div>
                        </td>
                        <td style={{ fontSize: 12 }}>{item.roomType}</td>
                        <td style={{ fontSize: 12 }}>{item.checkIn}</td>
                        <td style={{ fontSize: 12 }}>{item.checkOut}</td>
                        <td>
                          <span style={{
                            background: `${STATUS_COLORS[item.status]}20`,
                            color: STATUS_COLORS[item.status],
                            borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600
                          }}>
                            {STATUS_LABELS[item.status]}
                          </span>
                        </td>
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
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ height: 'fit-content' }}>
            <div className="card-hd" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#cda434', fontWeight: 700 }}>{selected.bookingRef}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af' }}>×</button>
            </div>
            <div className="card-bd">
              {/* Guest info */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{selected.name}</div>
                <a href={`mailto:${selected.email}`} style={{ color: '#cda434', fontSize: 13 }}>{selected.email}</a>
                {selected.phone && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>📞 {selected.phone}</div>}
              </div>

              {/* Booking details table */}
              <table style={{ width: '100%', marginBottom: 16, fontSize: 13 }}>
                <tbody>
                  {[
                    ['Room Type', selected.roomType],
                    ['Guests', selected.guests],
                    ['Check In', selected.checkIn],
                    ['Check Out', selected.checkOut],
                    ['Submitted', fmt(selected.createdAt)],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td style={{ padding: '5px 0', color: '#6b7280', width: '40%' }}>{label}</td>
                      <td style={{ padding: '5px 0', fontWeight: 600, color: '#111827' }}>{val || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selected.message && (
                <div style={{ background: '#f9fafb', borderLeft: '3px solid #cda434', padding: '10px 14px', borderRadius: 4, fontSize: 13, color: '#374151', marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: '#6b7280', fontSize: 11 }}>SPECIAL REQUESTS</div>
                  {selected.message}
                </div>
              )}

              {/* Status update */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase' }}>Update Status</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected._id, s)}
                      disabled={updating || selected.status === s}
                      style={{
                        padding: '6px 12px', fontSize: 11, borderRadius: 6, border: '1px solid', cursor: 'pointer',
                        borderColor: selected.status === s ? STATUS_COLORS[s] : '#e5e7eb',
                        background: selected.status === s ? `${STATUS_COLORS[s]}15` : '#fff',
                        color: selected.status === s ? STATUS_COLORS[s] : '#374151',
                        fontWeight: selected.status === s ? 700 : 400,
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin note */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase' }}>Admin Note</div>
                <textarea
                  className="finput"
                  rows={3}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Internal notes about this booking…"
                  style={{ resize: 'vertical', fontSize: 13 }}
                />
                <button
                  onClick={() => saveNote(selected._id)}
                  disabled={updating}
                  className="btn-gold btn-sm"
                  style={{ marginTop: 6 }}
                >
                  Save Note
                </button>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Your Booking [${selected.bookingRef}] — The ParkQueen Hotel`}
                className="btn-gold"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}
                onClick={() => updateStatus(selected._id, 'confirmed')}
              >
                <i className="fa-solid fa-envelope"></i> Email Guest
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
