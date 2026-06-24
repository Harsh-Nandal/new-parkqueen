'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: '',
  image: null,
  author: 'Admin',
  publishedAt: '',
  status: 'draft',
  featured: false,
}

export default function AdminBlog() {
  const [items, setItems] = useState(null)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null) // {type:'ok'|'err', msg}
  const [deleteConfirm, setDeleteConfirm] = useState(null) // id to confirm

  useEffect(() => { load() }, [])

  function load() {
    fetch('/api/blog?all=true&limit=50')
      .then(r => r.json())
      .then(d => setItems(d.data || d.blogs || d || []))
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
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      image: item.image || null,
      author: item.author || 'Admin',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
      status: item.status || 'draft',
      featured: !!item.featured,
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
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    try {
      const res = editId
        ? await fetch(`/api/blog/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: editId ? 'Post updated.' : 'Post created.' })
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
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
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
        <h1>Blog / News</h1>
        <p>Manage blog posts and news articles.</p>
      </div>

      <div className="card">
        <div className="card-hd">
          <i className="fa-solid fa-newspaper me-2" style={{ color: '#cda434' }}></i>
          All Posts
          <span style={{ marginLeft: 8, background: '#f3f4f6', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 600 }}>{items.length}</span>
          <button className="btn-gold btn-sm ms-auto" onClick={openAdd}>
            + Add Post
          </button>
        </div>
        <div className="card-bd" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No posts yet.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id || item.id}>
                  <td>
                    {item.image?.url
                      ? <img src={item.image.url} alt="" className="tbl-img" />
                      : <div style={{ width: 48, height: 36, background: '#f3f4f6', borderRadius: 5 }} />}
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <span title={item.title}>
                      {item.title?.length > 40 ? item.title.slice(0, 40) + '…' : item.title}
                    </span>
                  </td>
                  <td>{item.category || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                  <td>
                    <span className={item.status === 'published' ? 'badge-published' : 'badge-draft'}>
                      {item.status || 'draft'}
                    </span>
                  </td>
                  <td>
                    <input type="checkbox" checked={!!item.featured} readOnly style={{ cursor: 'default' }} />
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'}
                  </td>
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
              <h3>{modal === 'add' ? 'Add Post' : 'Edit Post'}</h3>
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
                  <input className="finput" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title" />
                </div>

                <div className="mb-3">
                  <label className="flabel">Slug</label>
                  <input className="finput" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="Leave blank to auto-generate" />
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Leave blank to auto-generate</div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Excerpt</label>
                  <textarea className="finput" rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary…" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Category</label>
                    <input className="finput" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. News" />
                  </div>
                  <div>
                    <label className="flabel">Author</label>
                    <input className="finput" value={form.author} onChange={e => set('author', e.target.value)} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Tags</label>
                  <input className="finput" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="comma-separated, e.g. hotel, luxury, spa" />
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Comma-separated</div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Content</label>
                  <textarea className="finput" rows={7} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Full article content…" />
                </div>

                <div className="mb-3">
                  <ImageUploader
                    label="Featured Image"
                    value={form.image?.url}
                    publicId={form.image?.public_id}
                    onChange={img => set('image', img)}
                  />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Published Date</label>
                    <input className="finput" type="date" value={form.publishedAt} onChange={e => set('publishedAt', e.target.value)} />
                  </div>
                  <div>
                    <label className="flabel">Status</label>
                    <select className="finput" value={form.status} onChange={e => set('status', e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="blog-featured"
                    checked={form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="blog-featured" className="flabel" style={{ margin: 0 }}>Featured Post</label>
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : (modal === 'add' ? 'Create Post' : 'Update Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
