'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const STAT_KEYS = ['rooms', 'facilities', 'clients', 'staff']

const DEFAULTS = {
  serviceBoxes: {
    subtitle: 'OUR SERVICES',
    heading: 'Premium Hotel Services & Amenities',
    description: 'Discover the comprehensive range of services at The ParkQueen Hotel — crafted for comfort, convenience, and a memorable stay in Rohtak.',
  },
  offersSubtitle: 'our special offer',
  offersHeading: "Our Latest Special Offer's",
  statsBg: '/assets/img/home-2/feature/02.jpg',
  stats: {
    rooms:      { value: '4',   suffix: 'k+', label: 'Rooms' },
    facilities: { value: '200', suffix: '+',  label: 'Facilities' },
    clients:    { value: '2',   suffix: 'k',  label: 'Clients' },
    staff:      { value: '150', suffix: '+',  label: 'Staff' },
  },
  seo: { title: '', description: '', keywords: '', ogImage: null },
}

export default function AdminServicePage() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [section, setSection] = useState('boxes') // 'boxes' | 'offers' | 'stats' | 'seo'

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => {
        const svc = data.service || {}
        setForm({
          serviceBoxes: { ...DEFAULTS.serviceBoxes, ...(svc.serviceBoxes || {}) },
          offersSubtitle: svc.offersSubtitle || DEFAULTS.offersSubtitle,
          offersHeading:  svc.offersHeading  || DEFAULTS.offersHeading,
          statsBg: svc.statsBg || DEFAULTS.statsBg,
          stats: {
            rooms:      { ...DEFAULTS.stats.rooms,      ...(svc.stats?.rooms || {}) },
            facilities: { ...DEFAULTS.stats.facilities, ...(svc.stats?.facilities || {}) },
            clients:    { ...DEFAULTS.stats.clients,    ...(svc.stats?.clients || {}) },
            staff:      { ...DEFAULTS.stats.staff,      ...(svc.stats?.staff || {}) },
          },
          seo: { ...DEFAULTS.seo, ...(svc.seo || {}) },
        })
      })
      .catch(() => setForm(DEFAULTS))
  }, [])

  function setBoxes(key, val) {
    setForm(f => ({ ...f, serviceBoxes: { ...f.serviceBoxes, [key]: val } }))
  }

  function setStat(statKey, field, val) {
    setForm(f => ({
      ...f,
      stats: { ...f.stats, [statKey]: { ...f.stats[statKey], [field]: val } },
    }))
  }

  function setSeo(key, val) {
    setForm(f => ({ ...f, seo: { ...f.seo, [key]: val } }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'service', data: form }),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else { const d = await res.json(); setError(d.error || 'Save failed') }
    } catch { setError('Network error') }
    setSaving(false)
  }

  if (!form) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  const tabs = [
    { key: 'boxes',  label: 'Service Boxes',    icon: 'fa-grid-2' },
    { key: 'offers', label: 'Offers Section',    icon: 'fa-tag' },
    { key: 'stats',  label: 'Stats & Counter',   icon: 'fa-chart-bar' },
    { key: 'seo',    label: 'SEO',               icon: 'fa-magnifying-glass' },
  ]

  return (
    <>
      <div className="pg-header">
        <h1>Service Page Settings</h1>
        <p>Control all editable content on the <strong>/service</strong> page from here.</p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { href: '/admin/hero',     label: 'Edit Banner / Hero',      icon: 'fa-image' },
          { href: '/admin/services', label: 'Edit Service Icon Cards',  icon: 'fa-star' },
          { href: '/admin/home',     label: 'Edit Offer Images',        icon: 'fa-gift' },
        ].map(l => (
          <a key={l.href} href={l.href}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
            <i className={`fa-solid ${l.icon}`} style={{ color: '#cda434' }}></i>{l.label}
          </a>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setSection(tab.key)}
            style={{
              padding: '9px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              border: '1px solid', transition: 'all .15s',
              borderColor: section === tab.key ? '#cda434' : '#e5e7eb',
              background:  section === tab.key ? '#cda434' : '#fff',
              color:        section === tab.key ? '#fff'    : '#374151',
            }}>
            <i className={`fa-solid ${tab.icon}`} style={{ marginRight: 6 }}></i>{tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={save}>

        {/* ── SERVICE BOXES HEADING ───────────────────────── */}
        {section === 'boxes' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-hd">
              <i className="fa-solid fa-grid-2" style={{ color: '#cda434' }}></i>
              Service Boxes Section Heading
            </div>
            <div className="card-bd">
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1d4ed8' }}>
                <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>
                These labels appear above the 6 service icon cards on the /service page.
                The actual icon cards are managed in <a href="/admin/services" style={{ color: '#1d4ed8', fontWeight: 700 }}>Admin → Services</a>.
              </div>
              <div className="mb-3">
                <label className="flabel">Section Subtitle <span style={{ fontWeight: 400, color: '#9ca3af' }}>(small text above heading)</span></label>
                <input className="finput" value={form.serviceBoxes.subtitle}
                  onChange={e => setBoxes('subtitle', e.target.value)}
                  placeholder="e.g. OUR SERVICES" />
              </div>
              <div className="mb-3">
                <label className="flabel">Section Heading</label>
                <input className="finput" value={form.serviceBoxes.heading}
                  onChange={e => setBoxes('heading', e.target.value)}
                  placeholder="e.g. Premium Hotel Services & Amenities" />
              </div>
              <div>
                <label className="flabel">Section Description <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
                <textarea className="finput" rows={3} value={form.serviceBoxes.description}
                  onChange={e => setBoxes('description', e.target.value)}
                  placeholder="Short paragraph below the heading…" />
              </div>
            </div>
          </div>
        )}

        {/* ── OFFERS SECTION ──────────────────────────────── */}
        {section === 'offers' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-hd">
              <i className="fa-solid fa-tag" style={{ color: '#cda434' }}></i>
              Special Offers Section Labels
            </div>
            <div className="card-bd">
              <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#92400e' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 6 }}></i>
                The offer images and titles are shared with the Home page.
                Edit them in <a href="/admin/home" style={{ color: '#92400e', fontWeight: 700 }}>Admin → Home Content → Offers Section</a>.
              </div>
              <div className="mb-3">
                <label className="flabel">Offers Subtitle <span style={{ fontWeight: 400, color: '#9ca3af' }}>(small tag above heading)</span></label>
                <input className="finput" value={form.offersSubtitle}
                  onChange={e => setForm(f => ({ ...f, offersSubtitle: e.target.value }))}
                  placeholder="e.g. our special offer" />
              </div>
              <div>
                <label className="flabel">Offers Heading</label>
                <input className="finput" value={form.offersHeading}
                  onChange={e => setForm(f => ({ ...f, offersHeading: e.target.value }))}
                  placeholder="e.g. Our Latest Special Offer's" />
              </div>
            </div>
          </div>
        )}

        {/* ── STATS COUNTER ───────────────────────────────── */}
        {section === 'stats' && (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-hd">
                <i className="fa-solid fa-image" style={{ color: '#cda434' }}></i>
                Stats Section Background Image
              </div>
              <div className="card-bd">
                <ImageUploader
                  label="Counter Section Background"
                  value={form.statsBg?.url || form.statsBg}
                  publicId={form.statsBg?.public_id}
                  onChange={v => setForm(f => ({ ...f, statsBg: v }))}
                  folder="parkqueen/service"
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                  The image behind the counter numbers on the /service page.
                </p>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-hd">
                <i className="fa-solid fa-chart-bar" style={{ color: '#cda434' }}></i>
                Counter Numbers
              </div>
              <div className="card-bd">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {STAT_KEYS.map(key => (
                    <div key={key} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 8 }}>
                        <div style={{ flex: 2 }}>
                          <label className="flabel">Number</label>
                          <input className="finput" value={form.stats[key].value}
                            onChange={e => setStat(key, 'value', e.target.value)}
                            placeholder="e.g. 200" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="flabel">Suffix</label>
                          <input className="finput" value={form.stats[key].suffix}
                            onChange={e => setStat(key, 'suffix', e.target.value)}
                            placeholder="k+" />
                        </div>
                      </div>
                      <div>
                        <label className="flabel">Label</label>
                        <input className="finput" value={form.stats[key].label}
                          onChange={e => setStat(key, 'label', e.target.value)}
                          placeholder="e.g. Rooms" />
                      </div>
                      {/* Live preview */}
                      <div style={{ marginTop: 10, textAlign: 'center', background: '#1a1c2e', borderRadius: 8, padding: '10px 0' }}>
                        <div style={{ color: '#cda434', fontSize: 22, fontWeight: 700 }}>
                          {form.stats[key].value}{form.stats[key].suffix}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11 }}>{form.stats[key].label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SEO ─────────────────────────────────────────── */}
        {section === 'seo' && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-hd">
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#cda434' }}></i>
              SEO Settings
            </div>
            <div className="card-bd">
              <div className="mb-3">
                <label className="flabel">Meta Title</label>
                <input className="finput" value={form.seo.title}
                  onChange={e => setSeo('title', e.target.value)}
                  placeholder="e.g. Our Services — The ParkQueen Hotel, Rohtak" />
                <div style={{ fontSize: 11, color: form.seo.title.length > 60 ? '#dc2626' : '#9ca3af', marginTop: 3 }}>
                  {form.seo.title.length}/60 chars
                </div>
              </div>
              <div className="mb-3">
                <label className="flabel">Meta Description</label>
                <textarea className="finput" rows={3} value={form.seo.description}
                  onChange={e => setSeo('description', e.target.value)}
                  placeholder="Shown in Google search results…" />
                <div style={{ fontSize: 11, color: form.seo.description.length > 160 ? '#dc2626' : '#9ca3af', marginTop: 3 }}>
                  {form.seo.description.length}/160 chars
                </div>
              </div>
              <div className="mb-3">
                <label className="flabel">Keywords <span style={{ fontWeight: 400, color: '#9ca3af' }}>(comma-separated)</span></label>
                <input className="finput" value={form.seo.keywords}
                  onChange={e => setSeo('keywords', e.target.value)}
                  placeholder="hotel services Rohtak, banquet Rohtak, spa hotel…" />
              </div>
              <ImageUploader
                label="OG / Social Share Image (1200×630px)"
                value={form.seo.ogImage?.url}
                publicId={form.seo.ogImage?.public_id}
                onChange={img => setSeo('ogImage', img)}
                folder="parkqueen/service/seo"
              />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                Shown when the /service page is shared on social media. Recommended: 1200×630px.
              </p>
            </div>
          </div>
        )}

        {/* Save bar */}
        <div className="card">
          <div className="save-bar">
            {saved  && <div className="alert-ok">✓ Service page settings saved successfully.</div>}
            {error  && <div className="alert-err">✗ {error}</div>}
            <button type="submit" className="btn-gold ms-auto" disabled={saving}>
              {saving ? 'Saving…' : 'Save Service Page Settings'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
