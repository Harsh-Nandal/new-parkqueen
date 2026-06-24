'use client'
import { useState, useEffect } from 'react'
import { imgUrl } from '@/lib/imgUrl'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

const FOOTER_BG = 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'

export default function BlogDetailContent({ slug }) {
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({})
  const [hero, setHero] = useState({})
  const [tags, setTags] = useState(['HotelBooking','LuxuryStay','RoomWithAView','HotelOffers','TravelInspiration','CityBreak','HolidayPlanning','Staycation','BookNow'])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`/api/blog/${slug}`)
      .then(r => r.json())
      .then(d => { setPost(d.data); setLoading(false) })
      .catch(() => setLoading(false))

    fetch('/api/blog?status=published&limit=3')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setRecentPosts(d.data) })
      .catch(() => {})

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.data) setSettings(d.data) })
      .catch(() => {})

    fetch('/api/hero/news')
      .then(r => r.json())
      .then(d => { if (d.data) setHero(d.data) })
      .catch(() => {})

    fetch('/api/content/news')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.tags) && d.tags.length) setTags(d.tags) })
      .catch(() => {})
  }, [slug])

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  const phone = settings.phone?.[0] || '+91 9088809991'
  const email = settings.email?.[0] || 'fom@parkqueenhotels.com'
  const address = settings.address || 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India'
  const heroBg = imgUrl(hero?.backgroundImage, '/assets/img/breadcrumb.jpg')
  const heroTitle = hero?.title || 'Blog Details'

  return (
    <>
      <button id="back-top" className="back-to-top show"><i className="fa-regular fa-arrow-up"></i></button>
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>

      {/* Offcanvas */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="/"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="The ParkQueen Hotel logo" /></a>
                </div>
                <div className="offcanvas__close"><button><i className="fas fa-times"></i></button></div>
              </div>
              <div className="text d-none d-xl-block">
                <p>Welcome to The ParkQueen Hotel, your trusted destination for refined luxury stays and hospitality that feels personal, polished, and effortless.</p>
                <h4 className="d-xl-block">Contact Info</h4>
                <ul className="d-xl-block">
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon"><i className="fal fa-map-marker-alt"></i></div>
                    <div className="offcanvas__contact-text"><a href="/contact">{address}</a></div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15"><i className="fal fa-envelope"></i></div>
                    <div className="offcanvas__contact-text"><a href={`mailto:${email}`}>{email}</a></div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15"><i className="far fa-phone"></i></div>
                    <div className="offcanvas__contact-text"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></div>
                  </li>
                </ul>
                <div className="social-icon d-flex align-items-center">
                  <a href={settings.social?.facebook || '#'} aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href={settings.social?.twitter || '#'} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href={settings.social?.youtube || '#'} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                  <a href={settings.social?.linkedin || '#'} aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay"></div>

      {/* Header */}
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href="/" className="header-logo"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="The ParkQueen Hotel" /></a>
                  <a href="/" className="header-logo-2"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="The ParkQueen Hotel" /></a>
                </div>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown menu-thumb"><a href="/">Home</a></li>
                      <li className="has-dropdown d-xl-none"><a href="/" className="border-none">Home</a></li>
                      <li><a href="/about">About Us</a></li>
                      <li className="has-dropdown"><a href="/facilities">Facilities</a></li>
                      <li><a href="/service">Service</a></li>
                      <li className="active"><a href="/news">Blog</a></li>
                      <li><a href="/contact">Contact Us</a></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="call-item">
                  <div className="icon"><i className="fa-solid fa-phone"></i></div>
                  <h6><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></h6>
                </div>
                <div className="header-button"><a href="/contact" className="theme-btn">BOOK NOW</a></div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle"><i className="fas fa-bars"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper bg-cover" style={{ backgroundImage: `url('${heroBg}')` }}>
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">{heroTitle}</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/">Home</a></li>
              <li><i className="fa-solid fa-chevron-right"></i></li>
              <li><a href="/news">Blog</a></li>
              <li><i className="fa-solid fa-chevron-right"></i></li>
              <li>{post?.title ? (post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title) : 'Article'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <section className="news-details-section section-padding">
        <div className="container">
          <div className="news-details-wrapper">
            <div className="row g-4">
              <div className="col-lg-8 col-12">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }}></i>
                    <p>Loading article…</p>
                  </div>
                ) : !post ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <i className="fa-solid fa-newspaper" style={{ fontSize: 48, color: '#e5e7eb', marginBottom: 16 }}></i>
                    <h3 style={{ color: '#374151' }}>Article not found</h3>
                    <p style={{ color: '#6b7280' }}>This blog post may have been removed or the URL is incorrect.</p>
                    <a href="/news" className="theme-btn" style={{ marginTop: 16, display: 'inline-block' }}>← Back to Blog</a>
                  </div>
                ) : (
                  <>
                    {post.image?.url && (
                      <div className="details-image">
                        <img src={post.image.url} alt={post.title} loading="lazy" />
                      </div>
                    )}
                    <div className="news-details-content">
                      <h2>{post.title}</h2>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16, color: '#6b7280', fontSize: 13, flexWrap: 'wrap' }}>
                        <span><i className="fa-solid fa-calendar-days" style={{ marginRight: 6 }}></i>{fmt(post.publishedAt)}</span>
                        <span><i className="fa-solid fa-user" style={{ marginRight: 6 }}></i>{post.author || 'Admin'}</span>
                        {post.category && <span><i className="fa-solid fa-tag" style={{ marginRight: 6 }}></i>{post.category}</span>}
                      </div>
                      {post.excerpt && (
                        <div className="sideber">
                          <h6 className="mb-0">{post.excerpt}</h6>
                        </div>
                      )}
                      {post.content && (
                        <div style={{ lineHeight: 1.8, color: '#374151' }}
                          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
                        />
                      )}
                      {/* CTA button if set */}
                      {post.ctaText && (
                        <div style={{ margin: '24px 0' }}>
                          <a
                            href={post.ctaLink || '/contact'}
                            className="theme-btn"
                          >
                            {post.ctaText}
                          </a>
                        </div>
                      )}
                      <div className="row tag-share-wrap mt-4 mb-5">
                        <div className="col-lg-7 col-12">
                          <div className="tagcloud">
                            <span>Tags:</span>
                            {(post.tags || []).map(tag => (
                              <a key={tag} href={`/news?tag=${encodeURIComponent(tag)}`}>{tag}</a>
                            ))}
                          </div>
                        </div>
                        <div className="col-lg-5 col-12 mt-3 mt-lg-0 text-lg-end">
                          <div className="social-share">
                            <a href={settings.social?.twitter || '#'} aria-label="Share on Twitter"><i className="fab fa-twitter"></i></a>
                            <a href={settings.social?.youtube || '#'} aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                            <a href={settings.social?.linkedin || '#'} aria-label="Share on LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href={settings.social?.facebook || '#'} aria-label="Share on Facebook"><i className="fab fa-facebook-f"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 col-12">
                <div className="main-sideber">
                  <div className="single-sideber-widget">
                    <div className="widget-title"><h3>Recent Posts</h3></div>
                    <div className="recent-post-area">
                      {recentPosts.length > 0 ? recentPosts.map((p, i) => (
                        <div key={p._id} className="recent-items">
                          <div className="recent-thumb">
                            <img src={p.image?.url || `/assets/img/inner-page/news-details/post-${i + 1}.jpg`} alt={p.title} loading="lazy" />
                          </div>
                          <div className="recent-content">
                            <h5><a href={`/news-details/${p.slug || p._id}`}>{p.title}</a></h5>
                            <ul><li>{fmt(p.publishedAt)}</li></ul>
                          </div>
                        </div>
                      )) : [1, 2, 3].map(n => (
                        <div key={n} className="recent-items">
                          <div className="recent-thumb"><img src={`/assets/img/inner-page/news-details/post-${n}.jpg`} alt="Hotel article" loading="lazy" /></div>
                          <div className="recent-content">
                            <h5><a href="/news">Hotel Article {n}</a></h5>
                            <ul><li>March 26, 2025</li></ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="single-sideber-widget mb-0">
                    <div className="widget-title"><h3>Popular Tags</h3></div>
                    <div className="tagcloud">
                      {tags.map(tag => <a key={tag} href={`/news?tag=${encodeURIComponent(tag)}`}>{tag}</a>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AminitiesSection />
      <InstagramSlider wrapperClass="instagram-section-2 fix" />

      {/* Footer */}
      <footer className="footer-section fix bg-cover"
        style={{ backgroundImage: `url('${settings.footer?.backgroundImage?.url || FOOTER_BG}')` }}
      >
        <div className="container">
          <div className="footer-newsletter">
            <div className="newsletter-content">
              <h3>Stay updated with {settings.siteName || 'The ParkQueen Hotel'}</h3>
              <p>{settings.footer?.tagline || 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.'}</p>
            </div>
            <form action="#">
              <div className="form-clt">
                <i className="fa-solid fa-envelope"></i>
                <input type="text" name="email" id="email-footer-nd" placeholder="enter your email" />
                <button type="submit" className="theme-btn">subscribe now</button>
              </div>
            </form>
          </div>
          <div className="footer-bottom">
            <div className="footer-wrapper">
              <div className="social-icon wow fadeInLeft" data-wow-delay=".3s">
                <a href={settings.social?.linkedin || '#'} aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
                <a href={settings.social?.twitter || '#'} aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
                <a href={settings.social?.instagram || '#'} aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href={settings.social?.facebook || '#'} aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
              <ul className="footer-list wow fadeInUp" data-wow-delay=".5s">
                <li><a href="/contact">Contact Us</a></li>
                <li>/</li>
                <li><a href="/about">About Us</a></li>
                <li>/</li>
                <li><a href="/news">Blog</a></li>
              </ul>
              <p className="wow fadeInRight" data-wow-delay=".7s">
                Copyright&copy; <span>{settings.footer?.copyright || 'The ParkQueen Hotel'}</span>
              </p>
            </div>
            <a href="/" className="footer-logo wow fadeInUp" data-wow-delay=".3s">
              <img style={{ width: '18rem' }} src={settings.logo?.url || '/assets/images/logo.png'} alt="The ParkQueen Hotel" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
