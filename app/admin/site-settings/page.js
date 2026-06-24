'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

const TABS = ['General', 'Contact', 'Social', 'Footer', 'SEO']

export default function AdminSiteSettings() {
  const [form, setForm] = useState(null)
  const [tab, setTab] = useState('General')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setForm(d.data || d.settings || d || {}))
      .catch(() => setForm({}))
  }, [])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function setNested(section, key, val) {
    setForm(f => ({ ...f, [section]: { ...(f[section] || {}), [key]: val } }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setFeedback({ type: 'ok', msg: 'Settings saved successfully.' })
        setTimeout(() => setFeedback(null), 3500)
      } else {
        const d = await res.json().catch(() => ({}))
        setFeedback({ type: 'err', msg: d.message || d.error || 'Save failed.' })
      }
    } catch {
      setFeedback({ type: 'err', msg: 'Network error.' })
    }
    setSaving(false)
  }

  if (!form) return <p style={{ color: '#6b7280', padding: 28 }}>Loading…</p>

  return (
    <>
      <div className="pg-header">
        <h1>Site Settings</h1>
        <p>Manage global site configuration, contact details, and SEO.</p>
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: tab === t ? 'none' : '1px solid #e5e7eb',
              background: tab === t ? '#cda434' : '#fff',
              color: tab === t ? '#fff' : '#374151',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={save}>
        {/* ── GENERAL ─────────────────────────────────── */}
        {tab === 'General' && (
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-gear me-2" style={{ color: '#cda434' }}></i>
              General Settings
            </div>
            <div className="card-bd">
              <div className="mb-3" style={{ maxWidth: 400 }}>
                <ImageUploader
                  label="Site Logo"
                  value={form.logo?.url}
                  publicId={form.logo?.public_id}
                  onChange={img => set('logo', img)}
                />
              </div>

              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Site Name</label>
                  <input
                    className="finput"
                    value={form.siteName || ''}
                    onChange={e => set('siteName', e.target.value)}
                    placeholder="e.g. ParkQueen Hotel"
                  />
                </div>
                <div>
                  <label className="flabel">Tagline</label>
                  <input
                    className="finput"
                    value={form.tagline || ''}
                    onChange={e => set('tagline', e.target.value)}
                    placeholder="e.g. Your Home Away from Home"
                  />
                </div>
              </div>

              <div style={{ maxWidth: 320 }}>
                <label className="flabel">WhatsApp Number</label>
                <input
                  className="finput"
                  value={form.whatsapp || ''}
                  onChange={e => set('whatsapp', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>
            <SaveBar saving={saving} feedback={feedback} />
          </div>
        )}

        {/* ── CONTACT ─────────────────────────────────── */}
        {tab === 'Contact' && (
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-address-book me-2" style={{ color: '#cda434' }}></i>
              Contact Details
            </div>
            <div className="card-bd">
              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Phone 1</label>
                  <input
                    className="finput"
                    value={form.phone?.[0] || ''}
                    onChange={e => set('phone', [e.target.value, form.phone?.[1] || ''])}
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div>
                  <label className="flabel">Phone 2</label>
                  <input
                    className="finput"
                    value={form.phone?.[1] || ''}
                    onChange={e => set('phone', [form.phone?.[0] || '', e.target.value])}
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Email 1</label>
                  <input
                    className="finput"
                    type="email"
                    value={form.email?.[0] || ''}
                    onChange={e => set('email', [e.target.value, form.email?.[1] || ''])}
                    placeholder="info@parkqueen.com"
                  />
                </div>
                <div>
                  <label className="flabel">Email 2</label>
                  <input
                    className="finput"
                    type="email"
                    value={form.email?.[1] || ''}
                    onChange={e => set('email', [form.email?.[0] || '', e.target.value])}
                    placeholder="bookings@parkqueen.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="flabel">Address</label>
                <textarea
                  className="finput"
                  rows={3}
                  value={form.address || ''}
                  onChange={e => set('address', e.target.value)}
                  placeholder="Street address…"
                />
              </div>

              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">City</label>
                  <input className="finput" value={form.city || ''} onChange={e => set('city', e.target.value)} />
                </div>
                <div>
                  <label className="flabel">State</label>
                  <input className="finput" value={form.state || ''} onChange={e => set('state', e.target.value)} />
                </div>
              </div>

              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Country</label>
                  <input className="finput" value={form.country || ''} onChange={e => set('country', e.target.value)} />
                </div>
                <div>
                  <label className="flabel">Pincode / ZIP</label>
                  <input className="finput" value={form.pincode || ''} onChange={e => set('pincode', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="flabel">Google Maps Embed URL</label>
                <textarea
                  className="finput"
                  rows={3}
                  value={form.mapEmbed || ''}
                  onChange={e => set('mapEmbed', e.target.value)}
                  placeholder="Paste the Google Maps embed URL here…"
                />
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Google Maps embed URL</div>
              </div>
            </div>
            <SaveBar saving={saving} feedback={feedback} />
          </div>
        )}

        {/* ── SOCIAL ──────────────────────────────────── */}
        {tab === 'Social' && (
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-share-nodes me-2" style={{ color: '#cda434' }}></i>
              Social Media Links
            </div>
            <div className="card-bd">
              {[
                { key: 'facebook', icon: 'fa-facebook', label: 'Facebook' },
                { key: 'twitter', icon: 'fa-twitter', label: 'Twitter / X' },
                { key: 'instagram', icon: 'fa-instagram', label: 'Instagram' },
                { key: 'linkedin', icon: 'fa-linkedin', label: 'LinkedIn' },
                { key: 'youtube', icon: 'fa-youtube', label: 'YouTube' },
              ].map(({ key, icon, label }) => (
                <div className="mb-3" key={key}>
                  <label className="flabel">
                    <i className={`fa-brands ${icon} me-2`} style={{ color: '#cda434' }}></i>
                    {label}
                  </label>
                  <input
                    className="finput"
                    value={form.social?.[key] || ''}
                    onChange={e => setNested('social', key, e.target.value)}
                    placeholder={`https://${key}.com/yourpage`}
                  />
                </div>
              ))}
            </div>
            <SaveBar saving={saving} feedback={feedback} />
          </div>
        )}

        {/* ── FOOTER ──────────────────────────────────── */}
        {tab === 'Footer' && (
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-layer-group me-2" style={{ color: '#cda434' }}></i>
              Footer Settings
            </div>
            <div className="card-bd">
              <div className="mb-3" style={{ maxWidth: 420 }}>
                <ImageUploader
                  label="Footer Background Image"
                  value={form.footer?.backgroundImage?.url}
                  publicId={form.footer?.backgroundImage?.public_id}
                  onChange={img => setNested('footer', 'backgroundImage', img)}
                />
              </div>

              <div className="mb-3">
                <label className="flabel">Footer Tagline</label>
                <textarea
                  className="finput"
                  rows={3}
                  value={form.footer?.tagline || ''}
                  onChange={e => setNested('footer', 'tagline', e.target.value)}
                  placeholder="Short tagline shown in footer…"
                />
              </div>

              <div className="mb-3">
                <label className="flabel">Copyright Text</label>
                <input
                  className="finput"
                  value={form.footer?.copyright || ''}
                  onChange={e => setNested('footer', 'copyright', e.target.value)}
                  placeholder="© 2024 ParkQueen Hotel. All rights reserved."
                />
              </div>

              <div className="grid-2 mb-3">
                <div>
                  <label className="flabel">Check-In Time</label>
                  <input
                    className="finput"
                    value={form.footer?.checkIn || ''}
                    onChange={e => setNested('footer', 'checkIn', e.target.value)}
                    placeholder="e.g. 2:00 PM"
                  />
                </div>
                <div>
                  <label className="flabel">Check-Out Time</label>
                  <input
                    className="finput"
                    value={form.footer?.checkOut || ''}
                    onChange={e => setNested('footer', 'checkOut', e.target.value)}
                    placeholder="e.g. 12:00 PM"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="flabel">Weekday Hours</label>
                  <input
                    className="finput"
                    value={form.footer?.weekdayHours || ''}
                    onChange={e => setNested('footer', 'weekdayHours', e.target.value)}
                    placeholder="e.g. Mon–Fri: 8am–10pm"
                  />
                </div>
                <div>
                  <label className="flabel">Saturday Hours</label>
                  <input
                    className="finput"
                    value={form.footer?.saturdayHours || ''}
                    onChange={e => setNested('footer', 'saturdayHours', e.target.value)}
                    placeholder="e.g. Sat: 9am–8pm"
                  />
                </div>
              </div>
            </div>
            <SaveBar saving={saving} feedback={feedback} />
          </div>
        )}

        {/* ── SEO ─────────────────────────────────────── */}
        {tab === 'SEO' && (
          <div className="card">
            <div className="card-hd">
              <i className="fa-solid fa-magnifying-glass me-2" style={{ color: '#cda434' }}></i>
              SEO Settings
            </div>
            <div className="card-bd">
              <div className="mb-3">
                <label className="flabel">Meta Title</label>
                <input
                  className="finput"
                  value={form.seo?.title || ''}
                  onChange={e => setNested('seo', 'title', e.target.value)}
                  placeholder="ParkQueen Hotel — Luxury Stay"
                />
              </div>

              <div className="mb-3">
                <label className="flabel">Meta Description</label>
                <textarea
                  className="finput"
                  rows={3}
                  value={form.seo?.description || ''}
                  onChange={e => setNested('seo', 'description', e.target.value)}
                  placeholder="Brief description for search engines…"
                />
              </div>

              <div className="mb-3">
                <label className="flabel">Keywords</label>
                <input
                  className="finput"
                  value={form.seo?.keywords || ''}
                  onChange={e => setNested('seo', 'keywords', e.target.value)}
                  placeholder="hotel, luxury, park queen, accommodation"
                />
              </div>

              <div style={{ maxWidth: 420 }}>
                <ImageUploader
                  label="OG / Social Share Image"
                  value={form.seo?.ogImage?.url}
                  publicId={form.seo?.ogImage?.public_id}
                  onChange={img => setNested('seo', 'ogImage', img)}
                />
              </div>
            </div>
            <SaveBar saving={saving} feedback={feedback} />
          </div>
        )}
      </form>
    </>
  )
}

function SaveBar({ saving, feedback }) {
  return (
    <div className="save-bar">
      {feedback && (
        <div className={feedback.type === 'ok' ? 'alert-ok' : 'alert-err'}>
          {feedback.msg}
        </div>
      )}
      <button type="submit" className="btn-gold ms-auto" disabled={saving}>
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}
