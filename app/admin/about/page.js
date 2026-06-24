'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const DEFAULT_POSTS = [
  { id: 1, title: "Why The ParkQueen Hotel Is Rohtak's Premier Destination", excerpt: '', image: { url: '/assets/img/home-2/news/01.jpg' }, category: 'Hospitality', author: 'Admin', publishedAt: '2025-04-17', ctaText: 'READ MORE', ctaLink: '/news' },
  { id: 2, title: 'Discover Our Signature Dining Experience in Rohtak',         excerpt: '', image: { url: '/assets/img/home-2/news/02.jpg' }, category: 'Dining',      author: 'Admin', publishedAt: '2025-04-20', ctaText: 'READ MORE', ctaLink: '/news' },
  { id: 3, title: '5 Reasons to Host Your Next Event at The ParkQueen Hotel',   excerpt: '', image: { url: '/assets/img/home-2/news/03.jpg' }, category: 'Events',      author: 'Admin', publishedAt: '2025-04-25', ctaText: 'READ MORE', ctaLink: '/news' },
]

export default function AdminAbout() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [openCard, setOpenCard] = useState(null) // which card is expanded: 0 | 1 | 2 | null

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        const about = data.about || {}
        // Ensure featuredPosts always has 3 entries
        const fp = Array.isArray(about.featuredPosts) && about.featuredPosts.length === 3
          ? about.featuredPosts
          : DEFAULT_POSTS.map((def, i) => ({ ...def, ...(about.featuredPosts?.[i] || {}) }))
        setForm({ ...about, featuredPosts: fp })
      })
      .catch(() => setForm({ featuredPosts: DEFAULT_POSTS }))
  }, [])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setPost(index, key, val) {
    setForm(f => {
      const posts = [...(f.featuredPosts || DEFAULT_POSTS)]
      posts[index] = { ...posts[index], [key]: val }
      return { ...f, featuredPosts: posts }
    })
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'about', data: form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  const CARD_LABELS = ['Card 1', 'Card 2', 'Card 3']

  return (
    <>
      <div className="pg-header">
        <h1>About Page Editor</h1>
        <p>Edit the about page hero image, main image, content, and featured news cards.</p>
      </div>

      <form onSubmit={save}>
        {/* ── Images ───────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-panorama" style={{ color: '#cda434' }}></i>
              Breadcrumb / Banner
            </div>
            <div className="card-bd">
              <ImageUploader
                label="Breadcrumb Background Image"
                value={form.breadcrumbBg?.url || form.breadcrumbBg}
                publicId={form.breadcrumbBg?.public_id}
                onChange={v => set('breadcrumbBg', v)}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-image" style={{ color: '#cda434' }}></i>
              Main About Image
            </div>
            <div className="card-bd">
              <ImageUploader
                label="About Section Image"
                value={form.mainImage?.url || form.mainImage}
                publicId={form.mainImage?.public_id}
                onChange={v => set('mainImage', v)}
              />
            </div>
          </div>
        </div>

        {/* ── About Text ───────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-hd">
            <i className="fa-solid fa-pen" style={{ color: '#cda434' }}></i>
            About Content
          </div>
          <div className="card-bd">
            <div className="mb-3">
              <label className="flabel">Sub Title</label>
              <input className="finput" value={form.subTitle || ''} onChange={e => set('subTitle', e.target.value)} placeholder="e.g. The Heart of Hospitality" />
            </div>
            <div className="mb-3">
              <label className="flabel">Main Heading</label>
              <input className="finput" value={form.heading || ''} onChange={e => set('heading', e.target.value)} placeholder="e.g. Welcome To a World of Warmth & Elegance Hotel" />
            </div>
            <div>
              <label className="flabel">Description Text</label>
              <textarea className="finput" rows={4} value={form.text || ''} onChange={e => set('text', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── News Section Labels ──────────────────────────── */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-hd">
            <i className="fa-solid fa-heading" style={{ color: '#cda434' }}></i>
            News Section — Heading &amp; Button
          </div>
          <div className="card-bd">
            <div className="grid-2 mb-3">
              <div>
                <label className="flabel">Section Subtitle <span style={{ fontWeight: 400, color: '#9ca3af' }}>(small tag above heading)</span></label>
                <input className="finput" value={form.newsSection?.subtitle || ''} onChange={e => set('newsSection', { ...form.newsSection, subtitle: e.target.value })} placeholder="e.g. news & blog" />
              </div>
              <div>
                <label className="flabel">Section Heading</label>
                <input className="finput" value={form.newsSection?.heading || ''} onChange={e => set('newsSection', { ...form.newsSection, heading: e.target.value })} placeholder="e.g. Latest News & Articles" />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="flabel">Button Text</label>
                <input className="finput" value={form.newsSection?.buttonText || ''} onChange={e => set('newsSection', { ...form.newsSection, buttonText: e.target.value })} placeholder="e.g. VIEW ALL ARTICLES" />
              </div>
              <div>
                <label className="flabel">Button Link</label>
                <input className="finput" value={form.newsSection?.buttonLink || ''} onChange={e => set('newsSection', { ...form.newsSection, buttonLink: e.target.value })} placeholder="e.g. /news" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Featured News Cards ──────────────────────────── */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-hd">
            <i className="fa-solid fa-newspaper" style={{ color: '#cda434' }}></i>
            Featured News Cards
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: '#6b7280' }}>
              3 fixed cards — edit title, image, date, category and more for each
            </span>
          </div>
          <div className="card-bd" style={{ padding: 0 }}>
            {(form.featuredPosts || DEFAULT_POSTS).map((post, i) => {
              const isOpen = openCard === i
              return (
                <div key={post.id || i} style={{ borderBottom: i < 2 ? '1px solid #f0f2f5' : 'none' }}>
                  {/* Card header / toggle */}
                  <button
                    type="button"
                    onClick={() => setOpenCard(isOpen ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: 56, height: 42, flexShrink: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f3f4f6' }}>
                      {(post.image?.url || post.image) && (
                        <img
                          src={post.image?.url || post.image}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {CARD_LABELS[i]}: {post.title || <span style={{ color: '#9ca3af' }}>Untitled</span>}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        {post.category || '—'} · {post.author || 'Admin'} · {post.publishedAt || '—'}
                      </div>
                    </div>
                    <i
                      className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}
                      style={{ color: '#9ca3af', fontSize: 12, flexShrink: 0 }}
                    ></i>
                  </button>

                  {/* Expanded form */}
                  {isOpen && (
                    <div style={{ padding: '4px 18px 20px', borderTop: '1px solid #f0f2f5' }}>
                      {/* Image */}
                      <div className="mb-3" style={{ marginTop: 16 }}>
                        <ImageUploader
                          label="Card Image *"
                          value={post.image?.url || post.image}
                          publicId={post.image?.public_id}
                          onChange={img => setPost(i, 'image', img)}
                          folder="parkqueen/about/news"
                        />
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                          This image appears as the card thumbnail in the "Latest News" section on the About page.
                        </div>
                      </div>

                      {/* Title */}
                      <div className="mb-3">
                        <label className="flabel">Title *</label>
                        <input
                          className="finput"
                          value={post.title || ''}
                          onChange={e => setPost(i, 'title', e.target.value)}
                          placeholder="e.g. Why The ParkQueen Hotel Is Rohtak's Premier Destination"
                        />
                      </div>

                      {/* Excerpt */}
                      <div className="mb-3">
                        <label className="flabel">Excerpt / Short Description</label>
                        <textarea
                          className="finput"
                          rows={2}
                          value={post.excerpt || ''}
                          onChange={e => setPost(i, 'excerpt', e.target.value)}
                          placeholder="Brief description shown below the title…"
                        />
                      </div>

                      {/* Row: category + author */}
                      <div className="grid-2 mb-3">
                        <div>
                          <label className="flabel">Category</label>
                          <input
                            className="finput"
                            value={post.category || ''}
                            onChange={e => setPost(i, 'category', e.target.value)}
                            placeholder="e.g. Hospitality"
                          />
                        </div>
                        <div>
                          <label className="flabel">Author</label>
                          <input
                            className="finput"
                            value={post.author || ''}
                            onChange={e => setPost(i, 'author', e.target.value)}
                            placeholder="e.g. Admin"
                          />
                        </div>
                      </div>

                      {/* Row: date + slug */}
                      <div className="grid-2 mb-3">
                        <div>
                          <label className="flabel">Publish Date</label>
                          <input
                            className="finput"
                            type="date"
                            value={post.publishedAt || ''}
                            onChange={e => setPost(i, 'publishedAt', e.target.value)}
                          />
                          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Shown as the date stamp on the card corner.</div>
                        </div>
                        <div>
                          <label className="flabel">Slug <span style={{ fontWeight: 400, color: '#9ca3af' }}>(for URL)</span></label>
                          <input
                            className="finput"
                            value={post.slug || ''}
                            onChange={e => setPost(i, 'slug', e.target.value)}
                            placeholder="e.g. hotel-news-rohtak"
                          />
                        </div>
                      </div>

                      {/* Row: CTA text + CTA link */}
                      <div className="grid-2">
                        <div>
                          <label className="flabel">Button Text</label>
                          <input
                            className="finput"
                            value={post.ctaText || ''}
                            onChange={e => setPost(i, 'ctaText', e.target.value)}
                            placeholder="e.g. READ MORE"
                          />
                        </div>
                        <div>
                          <label className="flabel">Button Link</label>
                          <input
                            className="finput"
                            value={post.ctaLink || ''}
                            onChange={e => setPost(i, 'ctaLink', e.target.value)}
                            placeholder="e.g. /news or /news-details/my-article"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Save Bar ─────────────────────────────────────── */}
        <div className="card">
          <div className="save-bar">
            {saved && (
              <div className="alert-ok">
                <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }}></i>
                About page saved! Changes are live on the website.
              </div>
            )}
            <button type="submit" className="btn-gold ms-auto" disabled={saving}>
              {saving ? 'Saving…' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
