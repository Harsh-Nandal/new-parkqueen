'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const HERO_PAGES = ['home', 'about', 'contact', 'facilities', 'service', 'news']

const EMPTY_FORM = {
  page: '',
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  backgroundImage: null,
  overlayColor: '',
  status: 'active',
}

export default function AdminHero() {
  const [heroes, setHeroes] = useState(null)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    Promise.all(
      HERO_PAGES.map(p =>
        fetch(`/api/hero/${p}`)
          .then(r => r.json())
          .then(d => ({ page: p, ...(d.data || d) }))
          .catch(() => ({ page: p }))
      )
    ).then(setHeroes)
  }, [])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function openEdit(hero) {
    setForm({
      page: hero.page || '',
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      buttonText: hero.buttonText || '',
      buttonLink: hero.buttonLink || '',
      backgroundImage: hero.backgroundImage || null,
      overlayColor: hero.overlayColor || '',
      status: hero.status || 'active',
    })
    setModal(true)
    setFeedback(null)
  }

  function closeModal() {
    setModal(false)
    setFeedback(null)
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/hero/${form.page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: `Hero for "${form.page}" saved.` })
        // Refresh this page's data in the heroes list
        setHeroes(prev =>
          prev.map(h => (h.page === form.page ? { ...h, ...form } : h))
        )
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

  if (!heroes) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Hero Sections</h1>
        <p>Manage the hero banner for each page of the website.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        {heroes.map(hero => (
          <div className="card" key={hero.page}>
            <div className="card-hd" style={{ textTransform: 'capitalize' }}>
              <i className="fa-solid fa-image me-2" style={{ color: '#cda434' }}></i>
              {hero.page}
            </div>
            <div className="card-bd">
              {hero.backgroundImage?.url ? (
                <img
                  src={hero.backgroundImage.url}
                  alt={hero.page}
                  style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 10, border: '1px solid #e5e7eb' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 80, background: '#f3f4f6', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9ca3af', fontSize: 12, marginBottom: 10, border: '1px solid #e5e7eb',
                }}>
                  No image set
                </div>
              )}
              <div style={{ fontSize: 12, color: '#374151', fontWeight: 600, marginBottom: 4 }}>
                {hero.title ? (hero.title.length > 40 ? hero.title.slice(0, 40) + '…' : hero.title) : <span style={{ color: '#9ca3af' }}>No title</span>}
              </div>
              {hero.subtitle && (
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>
                  {hero.subtitle.length > 50 ? hero.subtitle.slice(0, 50) + '…' : hero.subtitle}
                </div>
              )}
              <button className="btn-gold btn-sm" style={{ width: '100%', marginTop: 4 }} onClick={() => openEdit(hero)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box" style={{ maxWidth: 600 }}>
            <div className="modal-hd">
              <h3 style={{ textTransform: 'capitalize' }}>Edit Hero — {form.page}</h3>
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
                  <label className="flabel">Page</label>
                  <input
                    className="finput"
                    value={form.page}
                    readOnly
                    style={{ background: '#f9fafb', color: '#6b7280', cursor: 'default', textTransform: 'capitalize' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="flabel">Title</label>
                  <input className="finput" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Hero heading" />
                </div>

                <div className="mb-3">
                  <label className="flabel">Subtitle</label>
                  <input className="finput" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Hero subtitle" />
                </div>

                <div className="mb-3">
                  <label className="flabel">Description</label>
                  <textarea className="finput" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description below the title…" />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Button Text</label>
                    <input className="finput" value={form.buttonText} onChange={e => set('buttonText', e.target.value)} placeholder="e.g. Book Now" />
                  </div>
                  <div>
                    <label className="flabel">Button Link</label>
                    <input className="finput" value={form.buttonLink} onChange={e => set('buttonLink', e.target.value)} placeholder="e.g. /contact" />
                  </div>
                </div>

                <div className="mb-3">
                  <ImageUploader
                    label="Background Image"
                    value={form.backgroundImage?.url}
                    publicId={form.backgroundImage?.public_id}
                    onChange={img => set('backgroundImage', img)}
                  />
                </div>

                <div className="grid-2 mb-3">
                  <div>
                    <label className="flabel">Overlay Color</label>
                    <input
                      className="finput"
                      value={form.overlayColor}
                      onChange={e => set('overlayColor', e.target.value)}
                      placeholder="e.g. rgba(0,0,0,0.4)"
                    />
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>e.g. rgba(0,0,0,0.4)</div>
                  </div>
                  <div>
                    <label className="flabel">Status</label>
                    <select className="finput" value={form.status} onChange={e => set('status', e.target.value)}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Hero'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
