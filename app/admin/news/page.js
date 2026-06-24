'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

// ── Defaults ──────────────────────────────────────────────────────────────────
const PAGE_DEFAULTS = {
  breadcrumbBg: '/assets/img/breadcrumb.jpg',
  breadcrumbTitle: 'Blog & News',
  recentPostsTitle: 'Recent Posts',
  popularTagsTitle: 'Popular Tags',
  tags: ['HotelBooking', 'LuxuryStay', 'RoomWithAView', 'HotelOffers', 'TravelInspiration', 'CityBreak', 'HolidayPlanning', 'Staycation', 'BookNow'],
}

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Hospitality',
  tags: '',
  image: null,
  author: 'Admin',
  publishedAt: new Date().toISOString().split('T')[0],
  status: 'published',
  featured: false,
  ctaText: '',
  ctaLink: '',
  seo: { title: '', description: '', keywords: '', ogImage: null },
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  // Page settings
  const [pageForm, setPageForm] = useState(null)
  const [tagsInput, setTagsInput] = useState('')
  const [pageSaving, setPageSaving] = useState(false)
  const [pageSaved, setPageSaved] = useState(false)

  // Blog posts
  const [posts, setPosts] = useState(null)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [postForm, setPostForm] = useState(EMPTY_POST)
  const [editId, setEditId] = useState(null)
  const [postSaving, setPostSaving] = useState(false)
  const [postFeedback, setPostFeedback] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Default cards open state
  const [openCard, setOpenCard] = useState(null)

  // Active section tab
  const [section, setSection] = useState('posts') // 'posts' | 'cards' | 'settings'

  useEffect(() => {
    loadPosts()
    loadPageSettings()
  }, [])

  // ── Page Settings ────────────────────────────────────────────────────────────
  function loadPageSettings() {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        const news = { ...PAGE_DEFAULTS, ...(data.news || {}) }
        setPageForm(news)
        setTagsInput(Array.isArray(news.tags) ? news.tags.join(', ') : '')
      })
      .catch(() => {
        setPageForm(PAGE_DEFAULTS)
        setTagsInput(PAGE_DEFAULTS.tags.join(', '))
      })
  }

  function setPage(key, val) {
    setPageForm(f => ({ ...f, [key]: val }))
  }

  function setStaticPost(index, key, val) {
    setPageForm(f => {
      const posts = [...(f.staticPosts || [])]
      posts[index] = { ...posts[index], [key]: val }
      return { ...f, staticPosts: posts }
    })
  }

  async function savePageSettings(e) {
    e.preventDefault()
    setPageSaving(true)
    const payload = {
      ...pageForm,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    }
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'news', data: payload }),
    })
    setPageSaving(false)
    setPageSaved(true)
    setTimeout(() => setPageSaved(false), 3000)
  }

  function removeTag(tag) {
    const updated = tagsInput.split(',').map(t => t.trim()).filter(t => t && t !== tag)
    setTagsInput(updated.join(', '))
  }

  function addTagOnEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = e.target.value.trim()
      if (!val) return
      const existing = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : []
      if (!existing.includes(val)) setTagsInput([...existing, val].join(', '))
      e.target.value = ''
    }
  }

  const currentTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

  // ── Blog Posts ───────────────────────────────────────────────────────────────
  function loadPosts() {
    fetch('/api/blog?all=true&limit=100')
      .then(r => r.json())
      .then(d => setPosts(d.data || []))
      .catch(() => setPosts([]))
  }

  function setPost(key, val) {
    setPostForm(f => ({ ...f, [key]: val }))
  }

  function openAdd() {
    setPostForm({ ...EMPTY_POST, publishedAt: new Date().toISOString().split('T')[0] })
    setEditId(null)
    setPostFeedback(null)
    setModal('add')
  }

  function openEdit(item) {
    setPostForm({
      title: item.title || '',
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || 'Hospitality',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      image: item.image || null,
      author: item.author || 'Admin',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '',
      status: item.status || 'draft',
      featured: !!item.featured,
      ctaText: item.ctaText || '',
      ctaLink: item.ctaLink || '',
      seo: {
        title: item.seo?.title || '',
        description: item.seo?.description || '',
        keywords: item.seo?.keywords || '',
        ogImage: item.seo?.ogImage || null,
      },
    })
    setEditId(item._id)
    setPostFeedback(null)
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setEditId(null)
    setPostFeedback(null)
  }

  async function savePost(e) {
    e.preventDefault()
    if (!postForm.title.trim()) {
      setPostFeedback({ type: 'err', msg: 'Title is required.' })
      return
    }
    setPostSaving(true)
    setPostFeedback(null)
    const payload = {
      ...postForm,
      tags: postForm.tags ? postForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    try {
      const res = editId
        ? await fetch(`/api/blog/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (res.ok) {
        setPostFeedback({ type: 'ok', msg: editId ? 'Post updated successfully.' : 'Post created and published.' })
        loadPosts()
        setTimeout(() => closeModal(), 1200)
      } else {
        const d = await res.json().catch(() => ({}))
        setPostFeedback({ type: 'err', msg: d.error || d.message || 'Save failed.' })
      }
    } catch {
      setPostFeedback({ type: 'err', msg: 'Network error. Please try again.' })
    }
    setPostSaving(false)
  }

  async function deletePost(id) {
    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null)
    loadPosts()
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
  const published = posts?.filter(p => p.status === 'published').length ?? 0
  const drafts = posts?.filter(p => p.status === 'draft').length ?? 0

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="pg-header">
        <h1>News / Blog Manager</h1>
        <p>Manage everything on the <strong>/news</strong> page — articles, images, page title, breadcrumb, and sidebar tags.</p>
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'posts',    label: 'Blog Posts & Images', icon: 'fa-newspaper' },
          { key: 'cards',    label: 'Default Cards',       icon: 'fa-cards-blank' },
          { key: 'settings', label: 'Page Settings',       icon: 'fa-sliders' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSection(tab.key)}
            style={{
              padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              border: '1px solid', transition: 'all .15s',
              borderColor: section === tab.key ? '#cda434' : '#e5e7eb',
              background: section === tab.key ? '#cda434' : '#fff',
              color: section === tab.key ? '#fff' : '#374151',
            }}
          >
            <i className={`fa-solid ${tab.icon}`} style={{ marginRight: 7 }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════ SECTION: BLOG POSTS ════════════════════ */}
      {section === 'posts' && (
        <>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {[
              ['Total Posts', posts?.length ?? '…', '#6366f1'],
              ['Published', published, '#10b981'],
              ['Drafts', drafts, '#f59e0b'],
            ].map(([label, val, color]) => (
              <div key={label} className="card" style={{ padding: '14px 20px', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 12, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-circle-info"></i>
            Only posts with status <strong>Published</strong> appear on the public <strong>/news</strong> page. Draft posts are hidden from visitors.
          </div>

          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-newspaper" style={{ color: '#cda434' }}></i>
              All Posts
              <span style={{ marginLeft: 8, background: '#f3f4f6', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 600 }}>{posts?.length ?? 0}</span>
              <button className="btn-gold btn-sm ms-auto" onClick={openAdd}>
                <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>Add New Post
              </button>
            </div>
            <div className="card-bd" style={{ padding: 0 }}>
              {!posts ? (
                <p style={{ color: '#9ca3af', padding: 28, textAlign: 'center' }}>Loading…</p>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
                  <i className="fa-solid fa-newspaper" style={{ fontSize: 32, marginBottom: 12, display: 'block', opacity: .4 }}></i>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>No posts yet</div>
                  <div style={{ fontSize: 12, marginBottom: 16 }}>Click "Add New Post" to create your first article.</div>
                  <button className="btn-gold btn-sm" onClick={openAdd}>Add New Post</button>
                </div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr>
                      <th style={{ width: 64 }}>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(item => (
                      <tr key={item._id}>
                        <td>
                          {item.image?.url
                            ? <img src={item.image.url} alt="" className="tbl-img" />
                            : <div style={{ width: 52, height: 38, background: '#f3f4f6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-image" style={{ color: '#d1d5db', fontSize: 16 }}></i>
                              </div>
                          }
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', maxWidth: 260 }}
                               title={item.title}>
                            {item.title?.length > 50 ? item.title.slice(0, 50) + '…' : item.title}
                          </div>
                          {item.excerpt && (
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, maxWidth: 260 }}
                                 title={item.excerpt}>
                              {item.excerpt?.length > 60 ? item.excerpt.slice(0, 60) + '…' : item.excerpt}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 12, color: '#6b7280' }}>{item.category || '—'}</td>
                        <td>
                          <span style={{
                            background: item.status === 'published' ? '#d1fae5' : '#fef3c7',
                            color: item.status === 'published' ? '#065f46' : '#92400e',
                            borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600
                          }}>
                            {item.status === 'published' ? '● Published' : '○ Draft'}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmt(item.publishedAt)}</td>
                        <td>
                          {deleteConfirm === item._id ? (
                            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 11, color: '#dc2626' }}>Delete?</span>
                              <button className="btn-danger btn-sm" onClick={() => deletePost(item._id)}>Yes</button>
                              <button className="btn-outline btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                            </span>
                          ) : (
                            <span style={{ display: 'flex', gap: 5 }}>
                              <button className="btn-gold btn-sm" onClick={() => openEdit(item)}>
                                <i className="fa-solid fa-pen" style={{ marginRight: 4 }}></i>Edit
                              </button>
                              <button className="btn-danger btn-sm" onClick={() => setDeleteConfirm(item._id)}>Delete</button>
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
        </>
      )}

      {/* ════════════════════ SECTION: DEFAULT CARDS ════════════════════ */}
      {section === 'cards' && pageForm && (
        <form onSubmit={savePageSettings}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-hd">
              <i className="fa-solid fa-cards-blank" style={{ color: '#cda434' }}></i>
              Default Cards
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: '#6b7280' }}>
                3 fixed cards — shown when no published blog posts exist in the database
              </span>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 16px', margin: '0 18px 0', fontSize: 12, color: '#1d4ed8' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>
              These 3 cards appear on the <strong>/news</strong> page when there are no published blog posts in the database.
              Once you publish blog posts via <strong>Blog Posts &amp; Images</strong>, those replace these cards automatically.
              Edit these cards below to customise the placeholder content shown to visitors.
            </div>
            <div className="card-bd" style={{ padding: 0 }}>
              {(pageForm.staticPosts || []).map((post, i) => {
                const isOpen = openCard === i
                return (
                  <div key={post.id || i} style={{ borderTop: '1px solid #f0f2f5' }}>
                    {/* Accordion header */}
                    <button
                      type="button"
                      onClick={() => setOpenCard(isOpen ? null : i)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ width: 56, height: 42, flexShrink: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f3f4f6' }}>
                        {post.image && (
                          <img src={post.image?.url || post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Card {i + 1}: {post.title || <span style={{ color: '#9ca3af' }}>Untitled</span>}
                        </div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                          {post.category || '—'} · {post.author || 'Admin'} · {post.publishedAt || '—'}
                        </div>
                      </div>
                      <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: '#9ca3af', fontSize: 12, flexShrink: 0 }}></i>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 18px 20px', borderTop: '1px solid #f0f2f5' }}>
                        {/* Image */}
                        <div className="mb-3" style={{ marginTop: 16 }}>
                          <ImageUploader
                            label="Card Image"
                            value={post.image?.url || post.image}
                            publicId={post.image?.public_id}
                            onChange={img => setStaticPost(i, 'image', img)}
                            folder="parkqueen/news/static"
                          />
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                            Shown as the post thumbnail. Displayed in both the main list and the Recent Posts sidebar.
                          </div>
                        </div>

                        {/* Title */}
                        <div className="mb-3">
                          <label className="flabel">Title *</label>
                          <input className="finput" value={post.title || ''} onChange={e => setStaticPost(i, 'title', e.target.value)} placeholder="Post title" />
                        </div>

                        {/* Excerpt */}
                        <div className="mb-3">
                          <label className="flabel">Excerpt / Description</label>
                          <textarea className="finput" rows={2} value={post.excerpt || ''} onChange={e => setStaticPost(i, 'excerpt', e.target.value)} placeholder="Short summary shown below the title on the listing page…" />
                        </div>

                        {/* Category + Author */}
                        <div className="grid-2 mb-3">
                          <div>
                            <label className="flabel">Category</label>
                            <input className="finput" value={post.category || ''} onChange={e => setStaticPost(i, 'category', e.target.value)} placeholder="e.g. Hospitality" />
                          </div>
                          <div>
                            <label className="flabel">Author</label>
                            <input className="finput" value={post.author || ''} onChange={e => setStaticPost(i, 'author', e.target.value)} placeholder="e.g. Admin" />
                          </div>
                        </div>

                        {/* Date + Views */}
                        <div className="grid-2 mb-3">
                          <div>
                            <label className="flabel">Publish Date</label>
                            <input className="finput" type="date" value={post.publishedAt || ''} onChange={e => setStaticPost(i, 'publishedAt', e.target.value)} />
                          </div>
                          <div>
                            <label className="flabel">Views Count</label>
                            <input className="finput" type="number" value={post.views || 0} onChange={e => setStaticPost(i, 'views', parseInt(e.target.value) || 0)} placeholder="0" />
                          </div>
                        </div>

                        {/* Slug */}
                        <div className="mb-3">
                          <label className="flabel">Slug <span style={{ fontWeight: 400, color: '#9ca3af' }}>(used in URL)</span></label>
                          <input className="finput" value={post.slug || ''} onChange={e => setStaticPost(i, 'slug', e.target.value)} placeholder="e.g. luxury-hotel-rohtak" />
                        </div>

                        {/* CTA */}
                        <div className="grid-2">
                          <div>
                            <label className="flabel">Button Text</label>
                            <input className="finput" value={post.ctaText || ''} onChange={e => setStaticPost(i, 'ctaText', e.target.value)} placeholder="e.g. VIEW MORE" />
                          </div>
                          <div>
                            <label className="flabel">Button Link</label>
                            <input className="finput" value={post.ctaLink || ''} onChange={e => setStaticPost(i, 'ctaLink', e.target.value)} placeholder="e.g. /news or /news-details/my-slug" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <div className="save-bar">
              {pageSaved && <div className="alert-ok">✓ Default cards saved — changes are live on /news.</div>}
              <button type="submit" className="btn-gold ms-auto" disabled={pageSaving}>
                {pageSaving ? 'Saving…' : 'Save Default Cards'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ════════════════════ SECTION: PAGE SETTINGS ════════════════════ */}
      {section === 'settings' && pageForm && (
        <form onSubmit={savePageSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

            {/* Breadcrumb Image */}
            <div className="card">
              <div className="card-hd">
                <i className="fa-solid fa-panorama" style={{ color: '#cda434' }}></i>
                Breadcrumb Background Image
              </div>
              <div className="card-bd">
                <ImageUploader
                  label="Banner / Breadcrumb Image"
                  value={pageForm.breadcrumbBg?.url || pageForm.breadcrumbBg}
                  publicId={pageForm.breadcrumbBg?.public_id}
                  onChange={v => setPage('breadcrumbBg', v)}
                  folder="parkqueen/news"
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                  This image appears behind the page title at the top of the /news page.
                </p>
              </div>
            </div>

            {/* Text Labels */}
            <div className="card">
              <div className="card-hd">
                <i className="fa-solid fa-heading" style={{ color: '#cda434' }}></i>
                Page Titles & Labels
              </div>
              <div className="card-bd">
                <div className="mb-3">
                  <label className="flabel">Page Heading / Breadcrumb Title</label>
                  <input className="finput" value={pageForm.breadcrumbTitle} onChange={e => setPage('breadcrumbTitle', e.target.value)} placeholder="e.g. Blog & News" />
                </div>
                <div className="mb-3">
                  <label className="flabel">Sidebar: Recent Posts Heading</label>
                  <input className="finput" value={pageForm.recentPostsTitle} onChange={e => setPage('recentPostsTitle', e.target.value)} placeholder="e.g. Recent Posts" />
                </div>
                <div>
                  <label className="flabel">Sidebar: Popular Tags Heading</label>
                  <input className="finput" value={pageForm.popularTagsTitle} onChange={e => setPage('popularTagsTitle', e.target.value)} placeholder="e.g. Popular Tags" />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-hd">
              <i className="fa-solid fa-tags" style={{ color: '#cda434' }}></i>
              Sidebar Tags
            </div>
            <div className="card-bd">
              <div className="mb-3">
                <label className="flabel">Tags (comma-separated)</label>
                <textarea className="finput" rows={2} value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="HotelBooking, LuxuryStay, Staycation, …" />
              </div>
              {currentTags.length > 0 && (
                <div className="mb-3">
                  <label className="flabel">Tag Preview — click × to remove</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {currentTags.map(tag => (
                      <span key={tag} style={{ background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, padding: '4px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="flabel">Add a tag — type and press Enter</label>
                <input className="finput" placeholder="Type a tag and press Enter…" onKeyDown={addTagOnEnter} style={{ maxWidth: 300 }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="save-bar">
              {pageSaved && <div className="alert-ok">✓ Page settings saved.</div>}
              <button type="submit" className="btn-gold ms-auto" disabled={pageSaving}>
                {pageSaving ? 'Saving…' : 'Save Page Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ════════════════════ MODAL: Add / Edit Post ════════════════════ */}
      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <div className="modal-hd">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-pen" style={{ color: '#cda434' }}></i>
                {modal === 'add' ? 'Add New Blog Post' : 'Edit Blog Post'}
              </h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={savePost}>
              <div className="modal-bd">
                {postFeedback && (
                  <div className={postFeedback.type === 'ok' ? 'alert-ok mb-3' : 'alert-err mb-3'}>
                    {postFeedback.msg}
                  </div>
                )}

                {/* Image — most prominent since that's what the user wants */}
                <div className="mb-3" style={{ background: '#f9fafb', borderRadius: 8, padding: 14, border: '1px solid #e5e7eb' }}>
                  <ImageUploader
                    label="Post Image *"
                    value={postForm.image?.url}
                    publicId={postForm.image?.public_id}
                    onChange={img => setPost('image', img)}
                    folder="parkqueen/blog"
                  />
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                    This image appears as the card thumbnail on the /news page and at the top of the article.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Post Title *</label>
                  <input className="finput" value={postForm.title}
                    onChange={e => setPost('title', e.target.value)}
                    placeholder="e.g. 5 Reasons to Stay at The ParkQueen Hotel" />
                </div>

                <div className="mb-3">
                  <label className="flabel">Excerpt / Summary</label>
                  <textarea className="finput" rows={2} value={postForm.excerpt}
                    onChange={e => setPost('excerpt', e.target.value)}
                    placeholder="Short description shown on the news listing page…" />
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>This text appears below the title on the /news page card.</div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Full Article Content</label>
                  <textarea className="finput" rows={6} value={postForm.content}
                    onChange={e => setPost('content', e.target.value)}
                    placeholder="Full article text shown on the individual post page…" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Category</label>
                    <input className="finput" value={postForm.category}
                      onChange={e => setPost('category', e.target.value)}
                      placeholder="e.g. Hospitality, Events, Dining" />
                  </div>
                  <div>
                    <label className="flabel">Author</label>
                    <input className="finput" value={postForm.author}
                      onChange={e => setPost('author', e.target.value)} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="flabel">Tags (comma-separated)</label>
                  <input className="finput" value={postForm.tags}
                    onChange={e => setPost('tags', e.target.value)}
                    placeholder="e.g. hotel, luxury, dining" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Publish Date</label>
                    <input className="finput" type="date" value={postForm.publishedAt}
                      onChange={e => setPost('publishedAt', e.target.value)} />
                  </div>
                  <div>
                    <label className="flabel">Status</label>
                    <select className="finput" value={postForm.status}
                      onChange={e => setPost('status', e.target.value)}>
                      <option value="published">Published — visible on /news</option>
                      <option value="draft">Draft — hidden from visitors</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fffbeb', borderRadius: 7, border: '1px solid #fde68a' }}>
                  <input type="checkbox" id="post-featured"
                    checked={postForm.featured}
                    onChange={e => setPost('featured', e.target.checked)}
                    style={{ width: 15, height: 15, cursor: 'pointer' }} />
                  <label htmlFor="post-featured" className="flabel" style={{ margin: 0, cursor: 'pointer' }}>
                    Featured Post <span style={{ fontWeight: 400, color: '#92400e', fontSize: 11 }}>(pinned at top of news page)</span>
                  </label>
                </div>

                {/* CTA Button */}
                <div style={{ marginTop: 14, padding: 14, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#065f46', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    <i className="fa-solid fa-arrow-pointer" style={{ marginRight: 6 }}></i>CTA Button (Optional)
                  </div>
                  <div className="grid-2">
                    <div>
                      <label className="flabel">Button Text</label>
                      <input className="finput" value={postForm.ctaText}
                        onChange={e => setPost('ctaText', e.target.value)}
                        placeholder="e.g. Book Now, Learn More" />
                    </div>
                    <div>
                      <label className="flabel">Button Link</label>
                      <input className="finput" value={postForm.ctaLink}
                        onChange={e => setPost('ctaLink', e.target.value)}
                        placeholder="e.g. /contact" />
                    </div>
                  </div>
                </div>

                {/* SEO Section */}
                <div style={{ marginTop: 14, padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 6, color: '#cda434' }}></i>SEO Settings
                  </div>
                  <div className="mb-3">
                    <label className="flabel">SEO Title <span style={{ fontWeight: 400, color: '#9ca3af' }}>(overrides post title in search results)</span></label>
                    <input className="finput" value={postForm.seo?.title || ''}
                      onChange={e => setPost('seo', { ...postForm.seo, title: e.target.value })}
                      placeholder="Leave blank to use post title" />
                    <div style={{ fontSize: 11, color: postForm.seo?.title?.length > 60 ? '#dc2626' : '#9ca3af', marginTop: 3 }}>
                      {postForm.seo?.title?.length || 0}/60 chars recommended
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="flabel">Meta Description <span style={{ fontWeight: 400, color: '#9ca3af' }}>(shown in Google search results)</span></label>
                    <textarea className="finput" rows={2} value={postForm.seo?.description || ''}
                      onChange={e => setPost('seo', { ...postForm.seo, description: e.target.value })}
                      placeholder="Leave blank to use excerpt" />
                    <div style={{ fontSize: 11, color: postForm.seo?.description?.length > 160 ? '#dc2626' : '#9ca3af', marginTop: 3 }}>
                      {postForm.seo?.description?.length || 0}/160 chars recommended
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="flabel">Keywords <span style={{ fontWeight: 400, color: '#9ca3af' }}>(comma-separated)</span></label>
                    <input className="finput" value={postForm.seo?.keywords || ''}
                      onChange={e => setPost('seo', { ...postForm.seo, keywords: e.target.value })}
                      placeholder="e.g. luxury hotel Rohtak, hotel stay Haryana" />
                  </div>
                  <ImageUploader
                    label="OG Image (Social Share Image)"
                    value={postForm.seo?.ogImage?.url}
                    publicId={postForm.seo?.ogImage?.public_id}
                    onChange={img => setPost('seo', { ...postForm.seo, ogImage: img })}
                    folder="parkqueen/blog/og"
                  />
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    Recommended: 1200×630px. Shown when article is shared on social media.
                  </div>
                </div>
              </div>

              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={postSaving}>
                  {postSaving ? 'Saving…' : modal === 'add' ? 'Create & Publish' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
