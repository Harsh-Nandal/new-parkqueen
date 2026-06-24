'use client'
import { useState, useEffect } from 'react'
import { imgUrl } from '@/lib/imgUrl'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

const HARDCODED_FALLBACK = [
  { id: 1, title: 'Luxury Travel Trends for the Modern Explorer',   excerpt: 'Discover smart interior design tips that transform your home into a stylish sanctuary.',        image: { url: '/assets/img/home-2/news/10.jpg' }, publishedAt: '2025-03-11', slug: 'luxury-travel-trends', views: 19, ctaText: 'VIEW MORE', ctaLink: '/news' },
  { id: 2, title: 'Luxury Amenities That Redefine Comfort',         excerpt: 'Maximize your hotel stay with simple tips — declutter your schedule and enhance your downtime.', image: { url: '/assets/img/home-2/news/11.jpg' }, publishedAt: '2025-03-11', slug: 'luxury-amenities',     views: 19, ctaText: 'VIEW MORE', ctaLink: '/news' },
  { id: 3, title: 'Behind the Scenes: Life Inside a Luxury Hotel',  excerpt: 'Luxury stays offer long-term memorable experiences through personalized service.',               image: { url: '/assets/img/home-2/news/12.jpg' }, publishedAt: '2025-03-11', slug: 'behind-the-scenes',  views: 19, ctaText: 'VIEW MORE', ctaLink: '/news' },
]
const DEFAULT_TAGS = ['HotelBooking','LuxuryStay','RoomWithAView','HotelOffers','TravelInspiration','CityBreak','HolidayPlanning','Staycation','BookNow']
const FOOTER_BG = 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'

export default function NewsPage() {
  const [posts, setPosts]                     = useState([])
  const [staticPosts, setStaticPosts]         = useState(HARDCODED_FALLBACK)
  const [recentPosts, setRecentPosts]         = useState([])
  const [page, setPage]                       = useState(1)
  const [totalPages, setTotalPages]           = useState(1)
  const [breadcrumbBg, setBreadcrumbBg]       = useState('/assets/img/breadcrumb.jpg')
  const [breadcrumbTitle, setBreadcrumbTitle] = useState('Blog & News')
  const [recentPostsTitle, setRecentPostsTitle] = useState('Recent Posts')
  const [popularTagsTitle, setPopularTagsTitle] = useState('Popular Tags')
  const [tags, setTags]                       = useState(DEFAULT_TAGS)
  const [footerBg, setFooterBg]               = useState(FOOTER_BG)
  const [settings, setSettings]               = useState({})

  useEffect(() => {
    loadPosts(1)

    fetch('/api/content/news')
      .then(r => r.json())
      .then(d => {
        if (d.breadcrumbBg) setBreadcrumbBg(d.breadcrumbBg)
        if (d.breadcrumbTitle) setBreadcrumbTitle(d.breadcrumbTitle)
        if (d.recentPostsTitle) setRecentPostsTitle(d.recentPostsTitle)
        if (d.popularTagsTitle) setPopularTagsTitle(d.popularTagsTitle)
        if (Array.isArray(d.tags) && d.tags.length) setTags(d.tags)
        if (Array.isArray(d.staticPosts) && d.staticPosts.length) setStaticPosts(d.staticPosts)
      })
      .catch(() => {})

    fetch('/api/hero/news')
      .then(r => r.json())
      .then(d => {
        if (d.data?.backgroundImage) setBreadcrumbBg(d.data.backgroundImage)
        if (d.data?.title) setBreadcrumbTitle(d.data.title)
      })
      .catch(() => {})

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setSettings(d.data)
          if (d.data.footer?.backgroundImage) setFooterBg(imgUrl(d.data.footer.backgroundImage, FOOTER_BG))
        }
      })
      .catch(() => {})
  }, [])

  async function loadPosts(p) {
    try {
      const res = await fetch(`/api/blog?status=published&limit=5&page=${p}`)
      const d = await res.json()
      if (d.data?.length) {
        setPosts(d.data)
        setPage(p)
        setTotalPages(d.pagination?.pages || 1)
      }
      const rRes = await fetch('/api/blog?status=published&limit=3')
      const rD = await rRes.json()
      if (rD.data?.length) setRecentPosts(rD.data)
    } catch {}
  }

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

  // Use published blog posts; fall back to CMS-editable static cards
  const displayPosts = posts.length ? posts : staticPosts
  const displayRecent = recentPosts.length ? recentPosts : staticPosts.slice(0, 3)

  const phone   = settings.phone?.[0]   || '+91 9088809991'
  const email   = settings.email?.[0]   || 'fom@parkqueenhotels.com'
  const address = settings.address      || 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India'

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
                  <a href={settings.social?.twitter  || '#'} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href={settings.social?.youtube  || '#'} aria-label="YouTube"><i className="fab fa-youtube"></i></a>
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
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: `url('${imgUrl(breadcrumbBg, '/assets/img/breadcrumb.jpg')}')` }}
      >
        <div className="container">
          <div className="page-heading">
            <h1>{breadcrumbTitle}</h1>
            <ul className="breadcrumb-items">
              <li><a href="/">Home</a></li>
              <li><i className="fa-solid fa-chevron-right"></i></li>
              <li>{breadcrumbTitle}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* News Listing */}
      <section className="news-standard-section section-padding">
        <div className="container">
          <div className="news-standard-wrapper">
            <div className="row g-4">

              {/* Main post list */}
              <div className="col-lg-8 col-12">
                {displayPosts.map((post, i) => (
                  <div key={post._id || post.id || i} className="news-card-items-4">
                    <div className="news-image">
                      <img src={imgUrl(post.image, '/assets/img/home-2/news/10.jpg')} alt={post.title} loading="lazy" />
                    </div>
                    <div className="news-content">
                      <ul className="date-list">
                        <li><i className="fa-solid fa-calendar-days"></i> {fmt(post.publishedAt)}</li>
                        <li><i className="fa-solid fa-comments"></i> {post.views || 0} Views</li>
                      </ul>
                      <h3><a href={post.ctaLink || `/news-details/${post.slug || post._id}`}>{post.title}</a></h3>
                      <p>{post.excerpt}</p>
                      <a href={post.ctaLink || `/news-details/${post.slug || post._id}`} className="theme-btn mt-4">
                        {post.ctaText || 'VIEW MORE'}
                      </a>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="page-nav-wrap mt-0">
                    <ul>
                      <li>
                        <button className="page-numbers" onClick={() => loadPosts(Math.max(1, page - 1))} disabled={page === 1}>
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                      </li>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <li key={i} className={page === i + 1 ? 'active' : ''}>
                          <button className="page-numbers" onClick={() => loadPosts(i + 1)}>{String(i + 1).padStart(2, '0')}</button>
                        </li>
                      ))}
                      <li>
                        <button className="page-numbers" onClick={() => loadPosts(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 col-12">
                <div className="main-sideber sticky-style">
                  <div className="single-sideber-widget">
                    <div className="widget-title"><h3>{recentPostsTitle}</h3></div>
                    <div className="recent-post-area">
                      {displayRecent.map((p, i) => (
                        <div key={p._id || p.id || i} className="recent-items">
                          <div className="recent-thumb">
                            <img src={imgUrl(p.image, `/assets/img/inner-page/news-details/post-${i + 1}.jpg`)} alt={p.title} loading="lazy" />
                          </div>
                          <div className="recent-content">
                            <h5><a href={p.ctaLink || `/news-details/${p.slug || p._id}`}>{p.title}</a></h5>
                            <ul><li>{fmt(p.publishedAt)}</li></ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="single-sideber-widget mb-0">
                    <div className="widget-title"><h3>{popularTagsTitle}</h3></div>
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
      <footer className="footer-section fix bg-cover" style={{ backgroundImage: `url('${footerBg}')` }}>
        <div className="container">
          <div className="footer-newsletter">
            <div className="newsletter-content">
              <h3>Stay updated with {settings.siteName || 'The ParkQueen Hotel'}</h3>
              <p>{settings.footer?.tagline || 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.'}</p>
            </div>
            <form action="#">
              <div className="form-clt">
                <i className="fa-solid fa-envelope"></i>
                <input type="text" name="email" id="email-footer-news" placeholder="enter your email" />
                <button type="submit" className="theme-btn">subscribe now</button>
              </div>
            </form>
          </div>
          <div className="footer-widget-wrapper">
            <div className="row">
              <div className="col-xl-4 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".2s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>About us</h5></div>
                  <div className="footer-content"><p>{settings.footer?.tagline || 'Welcome to The ParkQueen Hotel, your destination for refined luxury stays and hospitality that feels personal, polished, and effortless.'}</p></div>
                </div>
              </div>
              <div className="col-xl-2 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".4s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>hotel best services</h5></div>
                  <ul className="list">
                    <li><a href="/service">Room Booking</a></li>
                    <li><a href="/service">Special Offers</a></li>
                    <li><a href="/service">Special Foods</a></li>
                    <li><a href="/contact">Airport Pickup</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".6s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>check in &amp; out time</h5></div>
                  <ul className="date-list">
                    <li>Mon to Fri : <span className="style-1">{settings.footer?.weekdayHours || '08:00 - 11:00'}</span></li>
                    <li>Saturday : <span>{settings.footer?.saturdayHours || '08:00 - 11:00'}</span></li>
                    <li>Sunday : <span className="style-3">{settings.footer?.sundayClosed ? 'Closed' : 'Open'}</span></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".8s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>Contact Us</h5></div>
                  <ul className="contact-item">
                    <li><i className="fa-solid fa-location-dot"></i> {address}</li>
                    <li className="style-2"><i className="fa-solid fa-envelope"></i><a href={`mailto:${email}`}>{email}</a></li>
                    <li className="style-2"><i className="fa-solid fa-phone"></i><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-wrapper">
              <div className="social-icon wow fadeInLeft" data-wow-delay=".3s">
                <a href={settings.social?.linkedin  || '#'} aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
                <a href={settings.social?.twitter   || '#'} aria-label="Twitter"><i className="fa-brands fa-twitter"></i></a>
                <a href={settings.social?.instagram || '#'} aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href={settings.social?.facebook  || '#'} aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
              <ul className="footer-list wow fadeInUp" data-wow-delay=".5s">
                <li><a href="/about">About Us</a></li>
                <li>/</li>
                <li><a href="/service">Services</a></li>
                <li>/</li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
              <p className="wow fadeInRight" data-wow-delay=".7s">Copyright&copy; <span>{settings.footer?.copyright || 'The ParkQueen Hotel'}</span></p>
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
