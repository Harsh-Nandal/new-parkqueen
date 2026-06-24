'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const sections = [
  { href: '/admin/hero', label: 'Hero Sections', icon: 'fa-image', desc: 'Page banners & backgrounds', color: '#8b5cf6', api: null },
  { href: '/admin/home', label: 'Home Content', icon: 'fa-house', desc: 'Hero text, about, dining, features', color: '#0ea5e9', api: null },
  { href: '/admin/rooms', label: 'Rooms', icon: 'fa-bed', desc: 'Room listings & pricing', color: '#cda434', apiKey: 'rooms' },
  { href: '/admin/services', label: 'Services', icon: 'fa-star', desc: 'Hotel services & amenities', color: '#10b981', apiKey: 'services' },
  { href: '/admin/offers', label: 'Special Offers', icon: 'fa-tag', desc: 'Packages & deals', color: '#f59e0b', apiKey: 'offers' },
  { href: '/admin/gallery', label: 'Gallery', icon: 'fa-images', desc: 'Photo gallery management', color: '#ec4899', apiKey: 'gallery' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'fa-quote-left', desc: 'Guest reviews', color: '#6366f1', apiKey: 'testimonials' },
  { href: '/admin/blog', label: 'Blog / News', icon: 'fa-newspaper', desc: 'Articles & updates', color: '#14b8a6', apiKey: 'blog' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'fa-circle-question', desc: 'Frequently asked questions', color: '#f97316', apiKey: 'faqs' },
  { href: '/admin/about', label: 'About Page', icon: 'fa-circle-info', desc: 'About content', color: '#64748b', api: null },
  { href: '/admin/contact', label: 'Contact Page', icon: 'fa-envelope', desc: 'Contact details & map', color: '#ef4444', api: null },
  { href: '/admin/site-settings', label: 'Site Settings', icon: 'fa-gear', desc: 'Global config & SEO', color: '#374151', api: null },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')
  const [dbStatus, setDbStatus] = useState('checking')

  useEffect(() => {
    loadCounts()
  }, [])

  async function loadCounts() {
    try {
      const res = await fetch('/api/admin/seed')
      const d = await res.json()
      if (d.success) {
        setCounts(d.data)
        setDbStatus('connected')
      } else {
        setDbStatus('error')
      }
    } catch {
      setDbStatus('error')
    }
  }

  async function runSeed() {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const d = await res.json()
      if (d.success) {
        setSeedMsg('✅ Database seeded successfully! All content migrated from frontend.')
        loadCounts()
      } else {
        setSeedMsg(`❌ Seed failed: ${d.error}`)
      }
    } catch (e) {
      setSeedMsg(`❌ Error: ${e.message}`)
    }
    setSeeding(false)
  }

  const statMap = { rooms: counts.rooms, services: counts.services, offers: counts.offers, gallery: counts.gallery, testimonials: counts.testimonials, blog: counts.blog, faqs: counts.faqs }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="pg-header" style={{ marginBottom: 0 }}>
          <h1>Dashboard</h1>
          <p>Welcome back — manage all hotel content from here.</p>
        </div>
        <a href="/" target="_blank" style={{ fontSize: 12, color: '#cda434', textDecoration: 'none', marginTop: 6 }}>
          <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: 6 }}></i>View Live Site
        </a>
      </div>

      {/* DB Status + Seed */}
      <div className="card" style={{ marginBottom: 20, borderLeft: `4px solid ${dbStatus === 'connected' ? '#10b981' : dbStatus === 'error' ? '#ef4444' : '#f59e0b'}` }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: dbStatus === 'connected' ? '#10b981' : dbStatus === 'error' ? '#ef4444' : '#f59e0b' }}></div>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                MongoDB: {dbStatus === 'connected' ? 'Connected' : dbStatus === 'error' ? 'Connection Failed — check MONGODB_URI password in .env.local' : 'Checking…'}
              </span>
            </div>
            {dbStatus === 'connected' && (
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(' · ')}
              </div>
            )}
            {seedMsg && <div style={{ fontSize: 12, marginTop: 6, color: seedMsg.startsWith('✅') ? '#065f46' : '#dc2626' }}>{seedMsg}</div>}
          </div>
          {dbStatus === 'connected' && (
            <button
              onClick={runSeed}
              disabled={seeding}
              className="btn-gold"
              style={{ marginLeft: 'auto', whiteSpace: 'nowrap', fontSize: 12, padding: '8px 16px' }}
            >
              {seeding ? '⏳ Seeding…' : '🌱 Seed Database'}
            </button>
          )}
        </div>
        {dbStatus === 'connected' && (
          <div style={{ padding: '0 18px 12px', fontSize: 11, color: '#9ca3af' }}>
            <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>
            "Seed Database" inserts all existing frontend content into MongoDB. Safe to run — existing records are never overwritten or duplicated.
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10, marginBottom: 24 }}>
        {sections.filter(s => s.apiKey).map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '12px 14px', textAlign: 'center', transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{statMap[s.apiKey] ?? '…'}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* All sections grid */}
      <div className="pg-header" style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 15 }}>All Sections</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {sections.map(s => (
          <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ transition: 'transform .15s, box-shadow .15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ padding: '14px 16px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
                  <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 14 }}></i>
                </div>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: 12, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.desc}</div>
              </div>
              <div style={{ padding: '8px 16px', borderTop: '1px solid #f3f4f6', fontSize: 11, color: s.color, fontWeight: 600 }}>
                {s.apiKey && statMap[s.apiKey] !== undefined ? `${statMap[s.apiKey]} records · ` : ''}Edit →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
