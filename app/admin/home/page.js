'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '../_components/ImageUploader'

export default function AdminHome() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(data => setForm(data.home || {}))
  }, [])

  function setHero(key, val) {
    setForm(f => ({ ...f, hero: { ...f.hero, [key]: val } }))
  }

  function setAbout(key, val) {
    setForm(f => ({ ...f, about: { ...f.about, [key]: val } }))
  }

  function setRoom(id, key, val) {
    setForm(f => ({
      ...f,
      rooms: f.rooms.map(r => (r.id === id ? { ...r, [key]: val } : r)),
    }))
  }

  function setNewsItem(index, key, val) {
    setForm(f => {
      const items = [...(f.newsItems || [
        { id: 1, date: '', category: '', title: '' },
        { id: 2, date: '', category: '', title: '' },
        { id: 3, date: '', category: '', title: '' },
        { id: 4, date: '', category: '', title: '' },
      ])]
      items[index] = { ...items[index], [key]: val }
      return { ...f, newsItems: items }
    })
  }

  function setNewsImage(index, val) {
    setForm(f => {
      const imgs = [...(f.newsImages || [
        '/assets/img/home-1/news/news-1.jpg',
        '/assets/img/home-1/news/news-2.jpg',
        '/assets/img/home-1/news/news-3.jpg',
        '/assets/img/home-1/news/news-4.jpg',
      ])]
      imgs[index] = val
      return { ...f, newsImages: imgs }
    })
  }

  function setOfferItem(index, key, val) {
    setForm(f => {
      const items = [...(f.offerItems || [
        { id: 1, title: '', cardTitle: '', image: null, cardImage: null },
        { id: 2, title: '', cardTitle: '', image: null, cardImage: null },
        { id: 3, title: '', cardTitle: '', image: null, cardImage: null },
        { id: 4, title: '', cardTitle: '', image: null, cardImage: null },
        { id: 5, title: '', cardTitle: '', image: null, cardImage: null },
      ])]
      items[index] = { ...items[index], [key]: val }
      return { ...f, offerItems: items }
    })
  }

  function setDiningImage(index, val) {
    setForm(f => {
      const imgs = [...(f.diningImages || [
        '/assets/img/home-1/dining/01.jpg',
        '/assets/img/home-1/dining/02.jpg',
        '/assets/img/home-1/dining/03.jpg',
        '/assets/img/home-1/dining/04.jpg',
      ])]
      imgs[index] = val
      return { ...f, diningImages: imgs }
    })
  }

  function setHotelImage(index, val) {
    setForm(f => {
      const imgs = [...(f.hotelImages || [
        '/assets/img/home-1/dining/05.jpg',
        '/assets/img/home-1/dining/06.jpg',
        '/assets/img/home-1/dining/07.jpg',
        '/assets/img/home-1/dining/08.jpg',
      ])]
      imgs[index] = val
      return { ...f, hotelImages: imgs }
    })
  }

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'home', data: form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <p style={{ color: '#6b7280' }}>Loading…</p>

  return (
    <>
      <div className="page-header">
        <h1>Home Page Editor</h1>
        <p>Edit the hero section, about section, and room listings.</p>
      </div>

      <form onSubmit={save}>
        {/* ── HERO ──────────────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-image me-2" style={{ color: '#cda434' }}></i>
            Hero Section
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <ImageUploader
                  label="Hero Background Image"
                  value={form.hero?.backgroundImage?.url || form.hero?.backgroundImage}
                  publicId={form.hero?.backgroundImage?.public_id}
                  onChange={v => setHero('backgroundImage', v)}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Main Heading</label>
                  <input
                    className="form-control"
                    value={form.hero?.heading || ''}
                    onChange={e => setHero('heading', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sub Heading</label>
                  <input
                    className="form-control"
                    value={form.hero?.subheading || ''}
                    onChange={e => setHero('subheading', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Hero Subtext</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.hero?.subtext || ''}
                    onChange={e => setHero('subtext', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ABOUT ─────────────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-circle-info me-2" style={{ color: '#cda434' }}></i>
            About Section
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <ImageUploader
                  label="About Image"
                  value={form.about?.image?.url || form.about?.image}
                  publicId={form.about?.image?.public_id}
                  onChange={v => setAbout('image', v)}
                />
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Sub Title</label>
                  <input
                    className="form-control"
                    value={form.about?.subTitle || ''}
                    onChange={e => setAbout('subTitle', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Heading</label>
                  <input
                    className="form-control"
                    value={form.about?.heading || ''}
                    onChange={e => setAbout('heading', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description Text</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={form.about?.text || ''}
                    onChange={e => setAbout('text', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROOMS ─────────────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-bed me-2" style={{ color: '#cda434' }}></i>
            Rooms Slider
          </div>
          <div className="card-body">
            <div className="mb-3 row g-3">
              <div className="col-md-6">
                <ImageUploader
                  label="Rooms Section Background"
                  value={form.roomsBg?.url || form.roomsBg}
                  publicId={form.roomsBg?.public_id}
                  onChange={v => set('roomsBg', v)}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Section Heading</label>
                  <input
                    className="form-control"
                    value={form.roomsHeading || ''}
                    onChange={e => set('roomsHeading', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Section Subtext</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.roomsSubtext || ''}
                    onChange={e => set('roomsSubtext', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <hr />
            <label className="form-label">
              Room Cards <span className="badge-section ms-2">5 rooms</span>
            </label>
            <div className="row g-3">
              {(form.rooms || []).map(room => (
                <div key={room.id} className="col-md-6 col-lg-4">
                  <div
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      padding: 14,
                      background: '#fafafa',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#cda434',
                        marginBottom: 8,
                        textTransform: 'uppercase',
                      }}
                    >
                      Room #{room.id}
                    </div>
                    <ImageUploader
                      value={room.image?.url || room.image}
                      publicId={room.image?.public_id}
                      onChange={v => setRoom(room.id, 'image', v)}
                    />
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Category
                      </label>
                      <input
                        className="form-control form-control-sm"
                        value={room.category || ''}
                        onChange={e => setRoom(room.id, 'category', e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Room Name
                      </label>
                      <input
                        className="form-control form-control-sm"
                        value={room.name || ''}
                        onChange={e => setRoom(room.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>
                        Price
                      </label>
                      <input
                        className="form-control form-control-sm"
                        value={room.price || ''}
                        onChange={e => setRoom(room.id, 'price', e.target.value)}
                        placeholder="e.g. $69 / NIGHT"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NEWS SECTION ─────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-newspaper me-2" style={{ color: '#cda434' }}></i>
            Latest News Feed Section
          </div>
          <div className="card-body">
            {/* Heading */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Section Subtitle</label>
                <input className="form-control" placeholder="Choose Your Perfect Stay" value={form.newsSubtitle || ''} onChange={e => set('newsSubtitle', e.target.value)} />
              </div>
              <div className="col-md-8">
                <label className="form-label">Section Heading</label>
                <input className="form-control" placeholder="Our Latest News Feed" value={form.newsHeading || ''} onChange={e => set('newsHeading', e.target.value)} />
              </div>
            </div>

            <hr style={{ margin: '4px 0 16px' }} />

            {/* 4 News Items */}
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, display: 'block' }}>
              News List Items
              <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>4 items shown on the left column</span>
            </label>
            <div className="row g-3 mb-3">
              {(form.newsItems || Array(4).fill(null).map((_, i) => ({ id: i + 1, date: '', category: '', title: '' }))).map((item, i) => (
                <div key={item?.id || i} className="col-md-6">
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fafafa' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#cda434', marginBottom: 8, textTransform: 'uppercase' }}>
                      News Item {i + 1}
                    </div>
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: 12 }}>Date</label>
                      <input className="form-control form-control-sm" placeholder="e.g. April 12, 2025" value={item?.date || ''} onChange={e => setNewsItem(i, 'date', e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: 12 }}>Category</label>
                      <input className="form-control form-control-sm" placeholder="e.g. Tips & Enjoy" value={item?.category || ''} onChange={e => setNewsItem(i, 'category', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Title</label>
                      <input className="form-control form-control-sm" placeholder="News headline" value={item?.title || ''} onChange={e => setNewsItem(i, 'title', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ margin: '4px 0 16px' }} />

            {/* 4 News Images */}
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, display: 'block' }}>
              News Images
              <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>4 images shown on the right column (hover on list items to switch)</span>
            </label>
            <div className="row g-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="col-md-3">
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, background: '#fafafa' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#cda434', marginBottom: 8, textTransform: 'uppercase' }}>
                      Image {i + 1}
                    </div>
                    <ImageUploader
                      value={(form.newsImages?.[i])?.url || form.newsImages?.[i]}
                      publicId={(form.newsImages?.[i])?.public_id}
                      onChange={v => setNewsImage(i, v)}
                      folder="parkqueen/news"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SPECIAL OFFERS ───────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-tag me-2" style={{ color: '#cda434' }}></i>
            Special Offers Section
          </div>
          <div className="card-body">
            {/* Section heading */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Section Subtitle</label>
                <input className="form-control" placeholder="our special offer" value={form.offersSubtitle || ''} onChange={e => set('offersSubtitle', e.target.value)} />
              </div>
              <div className="col-md-8">
                <label className="form-label">Section Heading</label>
                <input className="form-control" placeholder="Our Latest Special Offer's" value={form.offersHeading || ''} onChange={e => set('offersHeading', e.target.value)} />
              </div>
            </div>

            <hr style={{ margin: '4px 0 16px' }} />

            {/* 5 offer cards */}
            <label className="form-label" style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'block' }}>
              Offer Cards
              <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>
                Main Image = left panel · Card Image = right overlay image
              </span>
            </label>
            <div className="row g-3">
              {(form.offerItems || Array(5).fill(null).map((_, i) => ({ id: i + 1, title: '', cardTitle: '', image: null, cardImage: null }))).map((offer, i) => (
                <div key={offer?.id || i} className="col-xl-4 col-lg-6">
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, background: '#fafafa' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#cda434', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                      Offer {i + 1}
                    </div>

                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: 12 }}>Title (left panel)</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="e.g. Rohtak Heritage Tour"
                        value={offer?.title || ''}
                        onChange={e => setOfferItem(i, 'title', e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: 12 }}>Card Title (right overlay)</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="e.g. Celebrating Freedom"
                        value={offer?.cardTitle || ''}
                        onChange={e => setOfferItem(i, 'cardTitle', e.target.value)}
                      />
                    </div>

                    <ImageUploader
                      label="Main Image"
                      value={offer?.image?.url || offer?.image}
                      publicId={offer?.image?.public_id}
                      onChange={v => setOfferItem(i, 'image', v)}
                      folder="parkqueen/offers"
                    />

                    <ImageUploader
                      label="Card Image"
                      value={offer?.cardImage?.url || offer?.cardImage}
                      publicId={offer?.cardImage?.public_id}
                      onChange={v => setOfferItem(i, 'cardImage', v)}
                      folder="parkqueen/offers"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TESTIMONIAL ───────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-quote-left me-2" style={{ color: '#cda434' }}></i>
            Testimonial Section — Background Image
          </div>
          <div className="card-body">
            <ImageUploader
              label="Testimonial Background Image"
              value={form.testimonialBg?.url || form.testimonialBg}
              publicId={form.testimonialBg?.public_id}
              onChange={v => set('testimonialBg', v)}
              folder="parkqueen/testimonial"
            />
          </div>
        </div>

        {/* ── DINING ────────────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-utensils me-2" style={{ color: '#cda434' }}></i>
            Dining Section
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Dining Heading</label>
              <input className="form-control" value={form.diningHeading || ''} onChange={e => set('diningHeading', e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Dining Description</label>
              <textarea className="form-control" rows={3} value={form.diningSubtext || ''} onChange={e => set('diningSubtext', e.target.value)} />
            </div>

            <hr style={{ margin: '16px 0' }} />
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 700, fontSize: 13 }}>
                Dining Slider — Thumbnail Images
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>(4 small images on the left)</span>
              </label>
              <div className="row g-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="col-md-3">
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, background: '#fafafa' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#cda434', marginBottom: 8, textTransform: 'uppercase' }}>
                        Thumbnail {i + 1}
                      </div>
                      <ImageUploader
                        value={(form.diningImages?.[i])?.url || form.diningImages?.[i]}
                        publicId={(form.diningImages?.[i])?.public_id}
                        onChange={v => setDiningImage(i, v)}
                        folder="parkqueen/dining"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-0">
              <label className="form-label" style={{ fontWeight: 700, fontSize: 13 }}>
                Hotel Slider — Main Images
                <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>(4 large images on the right)</span>
              </label>
              <div className="row g-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="col-md-3">
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, background: '#fafafa' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#cda434', marginBottom: 8, textTransform: 'uppercase' }}>
                        Main Image {i + 1}
                      </div>
                      <ImageUploader
                        value={(form.hotelImages?.[i])?.url || form.hotelImages?.[i]}
                        publicId={(form.hotelImages?.[i])?.public_id}
                        onChange={v => setHotelImage(i, v)}
                        folder="parkqueen/dining"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURE CHECKLIST ─────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-list-check me-2" style={{ color: '#cda434' }}></i>
            About Section — Feature Checklist
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>(4 items shown in the about section bullet list)</span>
          </div>
          <div className="card-body">
            {((form.featureList && form.featureList.length ? form.featureList : ['', '', '', ''])).map((item, i) => (
              <div key={i} className="mb-3" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#6b7280', minWidth: 20 }}>{i + 1}.</span>
                <input
                  className="form-control"
                  value={item}
                  placeholder={`Feature item ${i + 1}`}
                  onChange={e => {
                    const arr = [...(form.featureList || ['', '', '', ''])]
                    arr[i] = e.target.value
                    set('featureList', arr)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── MARQUEE TEXT ──────────────────────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-arrows-left-right me-2" style={{ color: '#cda434' }}></i>
            Marquee / Scrolling Text
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>(one item per line)</span>
          </div>
          <div className="card-body">
            <label className="form-label">Scrolling Items</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Health and Fitness&#10;Rohtak's Premier Hotel&#10;Best Luxury Resort in Rohtak"
              value={(form.marqueeItems || []).join('\n')}
              onChange={e => set('marqueeItems', e.target.value.split('\n').filter(Boolean))}
            />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Each line becomes one scrolling item.</div>
          </div>
        </div>

        {/* ── COUNTER STATS (Service Page) ─────────────────── */}
        <div className="card mb-3">
          <div className="card-header">
            <i className="fa-solid fa-chart-bar me-2" style={{ color: '#cda434' }}></i>
            Counter Statistics
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>(shown on Services page)</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>These counters appear on the Services page. Go to <strong>Admin → Services</strong> to edit individual service items.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'rooms', label: 'Rooms Count' },
                { key: 'facilities', label: 'Facilities Count' },
                { key: 'clients', label: 'Clients Count' },
                { key: 'staff', label: 'Staff Count' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="form-label" style={{ fontSize: 12 }}>{label}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      className="form-control form-control-sm"
                      placeholder="value e.g. 4"
                      value={form.stats?.[key]?.value || ''}
                      onChange={e => set('stats', { ...(form.stats || {}), [key]: { ...(form.stats?.[key] || {}), value: e.target.value } })}
                    />
                    <input
                      className="form-control form-control-sm"
                      placeholder="suffix e.g. k+"
                      style={{ maxWidth: 70 }}
                      value={form.stats?.[key]?.suffix || ''}
                      onChange={e => set('stats', { ...(form.stats || {}), [key]: { ...(form.stats?.[key] || {}), suffix: e.target.value } })}
                    />
                    <input
                      className="form-control form-control-sm"
                      placeholder="label"
                      value={form.stats?.[key]?.label || ''}
                      onChange={e => set('stats', { ...(form.stats || {}), [key]: { ...(form.stats?.[key] || {}), label: e.target.value } })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="save-bar">
            {saved && (
              <div className="alert-success-custom">
                <i className="fa-solid fa-circle-check me-2"></i>
                Home page saved successfully!
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
