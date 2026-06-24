'use client'
import { useState, useEffect } from 'react'
import { imgUrl } from '@/lib/imgUrl'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

const STATIC_ABOUT = {
  mainImage: '/assets/images/about/NDS_5014.jpg',
  subTitle: 'The Heart of Hospitality',
  heading: 'Welcome To a World of Warmth & Elegance Hotel',
  text: 'Welcome to The ParkQueen Hotel, your destination for luxury hospitality and effortless comfort in Rohtak. Enjoy refined service, elegant design, and exceptional experiences on every stay. We are committed to making every visit personal, polished, and truly unforgettable.',
  buttonText: 'Know more about us',
}

const STATIC_FEATURED_POSTS = [
  { id: 1, title: "Why The ParkQueen Hotel Is Rohtak's Premier Destination", excerpt: '', image: { url: '/assets/img/home-2/news/01.jpg' }, category: 'Hospitality', author: 'Admin', publishedAt: '2025-04-17', slug: 'parkqueen-rohtaks-premier-destination', ctaText: 'READ MORE', ctaLink: '/news' },
  { id: 2, title: 'Discover Our Signature Dining Experience in Rohtak',         excerpt: '', image: { url: '/assets/img/home-2/news/02.jpg' }, category: 'Dining',      author: 'Admin', publishedAt: '2025-04-20', slug: 'signature-dining-rohtak',                ctaText: 'READ MORE', ctaLink: '/news' },
  { id: 3, title: '5 Reasons to Host Your Next Event at The ParkQueen Hotel',   excerpt: '', image: { url: '/assets/img/home-2/news/03.jpg' }, category: 'Events',      author: 'Admin', publishedAt: '2025-04-25', slug: 'host-events-parkqueen',                  ctaText: 'READ MORE', ctaLink: '/news' },
]

const STATIC_FACILITIES = [
  { _id: 'f1', image: { url: '/assets/img/home-1/room/faciliti-1.jpg' }, icon: 'fa-utensils', title: 'Restaurant & Dining', text: 'Savor exceptional cuisine crafted by our chefs.' },
  { _id: 'f2', image: { url: '/assets/img/home-1/room/faciliti-2.jpg' }, icon: 'fa-restroom', title: 'Spa & Wellness', text: 'Rejuvenate your body and mind with our premium spa treatments.' },
  { _id: 'f3', image: { url: '/assets/img/home-1/room/faciliti-3.jpg' }, icon: 'fa-champagne-glasses', title: 'Banquets & Events', text: 'Host your events in our beautifully appointed banquet halls.' },
  { _id: 'f4', image: { url: '/assets/img/home-1/room/faciliti-4.jpg' }, icon: 'fa-dumbbell', title: 'Fitness & Gym', text: 'Stay on top of your routine with our fully equipped fitness centre.' },
  { _id: 'f6', image: { url: '/assets/img/home-1/room/faciliti-6.jpg' }, icon: 'fa-car-rear', title: 'Free Guest Parking', text: 'Secure, complimentary parking for all guests.' },
]

const STATIC_GALLERY = [
  '/assets/images/gallery/NDS_4957-1.jpg', '/assets/images/gallery/NDS_4960.jpg',
  '/assets/images/gallery/NDS_4971.jpg', '/assets/images/gallery/NDS_4974.jpg',
  '/assets/images/gallery/NDS_5018.jpg', '/assets/images/gallery/NDS_5029.jpg',
  '/assets/images/gallery/NDS_5036.jpg', '/assets/images/gallery/NDS_5039.jpg',
  '/assets/images/gallery/NDS_5047.jpg', '/assets/images/gallery/NDS_5162.jpg',
  '/assets/images/gallery/NDS_5257.jpg', '/assets/images/gallery/NDS_5265.jpg',
]

export default function AboutPage() {
  const [about, setAbout] = useState(STATIC_ABOUT)
  const [facilities, setFacilities] = useState(null)
  const [gallery, setGallery] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [testimonialBg, setTestimonialBg] = useState('/assets/img/home-1/testimonial/bg.jpg')
  const [hero, setHero] = useState({})

  useEffect(() => {
    fetch('/api/content/about')
      .then(r => r.json())
      .then(d => { if (d && Object.keys(d).length > 1) setAbout({ ...STATIC_ABOUT, ...d }) })
      .catch(() => {})

    fetch('/api/hero/about')
      .then(r => r.json())
      .then(d => { if (d.data) setHero(d.data) })
      .catch(() => {})

    fetch('/api/content/home')
      .then(r => r.json())
      .then(d => { if (d.testimonialBg) setTestimonialBg(d.testimonialBg) })
      .catch(() => {})

    fetch('/api/content/facilities')
      .then(r => r.json())
      .then(d => {
        if (d.items?.length) setFacilities(d.items)
        else setFacilities(STATIC_FACILITIES)
      })
      .catch(() => setFacilities(STATIC_FACILITIES))

    fetch('/api/gallery?status=active&category=about&limit=12')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setGallery(d.data) })
      .catch(() => {})

    fetch('/api/testimonials?status=active&limit=6')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setTestimonials(d.data) })
      .catch(() => {})
  }, [])

  const galleryUrls = gallery.length
    ? gallery.map(g => g.image?.url)
    : STATIC_GALLERY

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

  return (
    <>
      {/* GT Back To Top Start */}
      <button id="back-top" className="back-to-top show">
        <i className="fa-regular fa-arrow-up"></i>
      </button>

      {/* GT MouseCursor Start */}
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>

      {/* Offcanvas Area Start — identical to home page */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="/">
                    <img
                      style={{ width: '18rem' }}
                      src="/assets/images/logo.png"
                      alt="The ParkQueen Hotel logo"
                    />
                  </a>
                </div>
                <div className="offcanvas__close">
                  <button>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="text d-none d-xl-block">
                <p>
                  Nullam dignissim, ante scelerisque the is euismod fermentum odio
                  sem semper the is erat, a feugiat leo urna eget eros. Duis Aenean
                  a imperdiet risus.
                </p>
                <p>
                  Welcome to The ParkQueen Hotel, your trusted destination for
                  refined luxury stays and hospitality that feels personal,
                  polished, and effortless.
                </p>
                <h4 className="d-xl-block">Contact Info</h4>
                <ul className="d-xl-block">
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak,
                        Haryana 124001, India
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-envelope"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="mailto:fom@parkqueenhotels.com">
                        <span className="mailto:fom@parkqueenhotels.com">
                          fom@parkqueenhotels.com
                        </span>
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="fal fa-clock"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a target="_blank" href="#">
                        Mon-Friday, 09am - 05pm
                      </a>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15">
                      <i className="far fa-phone"></i>
                    </div>
                    <div className="offcanvas__contact-text">
                      <a href="tel:+919088809991">+91 90888 09991</a>
                    </div>
                  </li>
                </ul>
                <div className="social-icon d-flex align-items-center">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay"></div>

      {/* Header Section Start — identical to home page */}
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href="/" className="header-logo">
                    <img
                      style={{ width: '18rem' }}
                      src="/assets/images/logo.png"
                      alt="logo-img"
                    />
                  </a>
                  <a href="/" className="header-logo-2">
                    <img
                      style={{ width: '18rem' }}
                      src="/assets/images/logo.png"
                      alt="logo-img"
                    />
                  </a>
                </div>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown menu-thumb">
                        <a href="/"> Home </a>
                      </li>
                     
                      <li className="active">
                        <a href="/about">About Us</a>
                      </li>
                      <li className="has-dropdown">
                        <a href="/facilities"> Facilities </a>
                      </li>
                      <li>
                        <a href="/service"> Service </a>
                      </li>
                      <li>
                        <a href="/news"> Blog </a>
                      </li>
                      <li>
                        <a href="/contact">Contact Us</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="call-item">
                  <div className="icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <h6>
                    <a href="tel:+919088809991">+91 9088809991</a>
                  </h6>
                </div>
                <div className="header-button">
                  <a href="#" className="theme-btn">
                    BOOK NOW
                  </a>
                </div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle">
                    <i className="fas fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Wrapper Start */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: `url('${imgUrl(hero?.backgroundImage || about.breadcrumbBg, '/assets/img/breadcrumb.jpg')}')` }}
      >
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">
                {hero?.title || 'About Us'}
              </h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right"></i>
              </li>
              <li>About Us</li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Section Start */}
      <section className="about-section section-padding fix section-bg">
        <div className="container">
          <div className="about-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="about-image">
                  <img src={imgUrl(about.mainImage, STATIC_ABOUT.mainImage)} alt="img" />
                  <div className="shape">
                    <img src="/assets/img/home-1/about/shape.png" alt="img" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title mb-0">
                    <span className="sub-title wow fadeInUp">
                      {about.subTitle || STATIC_ABOUT.subTitle}
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      {about.heading || STATIC_ABOUT.heading}
                    </h2>
                  </div>
                  <p className="text wow fadeInUp" data-wow-delay=".3s">
                    {about.text || STATIC_ABOUT.text}
                  </p>
                  <div className="list-item wow fadeInUp" data-wow-delay=".5s">
                    <ul className="list">
                      <li><i className="fa-solid fa-circle-chevron-right"></i> Easy and secure online booking</li>
                      <li><i className="fa-solid fa-circle-chevron-right"></i> Exclusive discounts and offers</li>
                    </ul>
                    <ul className="list">
                      <li><i className="fa-solid fa-circle-chevron-right"></i> 24/7 customer support</li>
                      <li><i className="fa-solid fa-circle-chevron-right"></i> Flexible cancellation policies</li>
                    </ul>
                  </div>
                  <div className="hero-button-item wow fadeInUp" data-wow-delay=".3s" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    <div className="top-shape">
                      <img src="/assets/img/home-1/about/bg-shape.png" alt="img" />
                    </div>
                    <a href="#" className="theme-btn">{about.buttonText || STATIC_ABOUT.buttonText}</a>
                    <span className="button-text">
                      <span className="me-3 d-line">view reels</span>
                      <a href={about.videoLink || '#'} className="video-btn ripple video-popup">
                        <i className="fa-solid fa-play"></i>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Facilities Section — same as facilities page */}
      <section className="hotel-facilities-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            {(facilities || []).map((f, i) => {
              const imgSrc = imgUrl(f.image, `/assets/img/home-1/room/faciliti-${i + 1}.jpg`)
              return (
                <div
                  key={f._id || f.id || i}
                  className={`col-lg-6 ${i % 2 === 0 ? 'wow fadeInLeft' : 'wow fadeInRight'}`}
                  data-wow-delay={i % 2 === 0 ? '.3s' : '.5s'}
                >
                  <div className="hotel-facilities-items">
                    <div className="facilities-image">
                      <img src={imgSrc} alt="img" />
                      <img src={imgSrc} alt="img" />
                    </div>
                    <div className="facilities-content">
                      <div className="icon">
                        <i className={`fa-solid ${f.icon || 'fa-star'}`}></i>
                      </div>
                      <h3>{f.title}</h3>
                      <p>{f.text || f.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Aminities Section */}
      <AminitiesSection />

      {/* Marque Section Start */}
      <div className="marque-section fix">
        <div className="scrolling-wrap">
          <div className="comm">
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Rohtak&apos;s Premier Hotel
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Best Luxury Resort in Rohtak
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Luxury Hotel in Rohtak
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
          </div>
          <div className="comm">
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Modern City Hotel
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Best Luxury Resort
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Luxury Hotel in Rohtak
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
          </div>
          <div className="comm">
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Modern City Hotel
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Best Luxury Resort
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Luxury Hotel in Rohtak
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
            <div className="cmn-textslide">
              <i className="fa-sharp fa-solid fa-star"></i> Health and Fitness
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section Start */}
      <section
        className="testimonial-section style-inn section-padding fix bg-cover"
        style={{
          backgroundImage: `url('${imgUrl(testimonialBg, '/assets/img/home-1/testimonial/bg.jpg')}')`,
        }}
      >
        <div className="container">
          <div className="testimonial-wrapper style-inner">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="testimonial-card-item scale-animation">
                  <div className="swiper testimonial-slider">
                    <div className="swiper-wrapper">
                      {(testimonials.length ? testimonials : [
                        { _id: 'at1', name: 'Marvin McKinney', role: 'Product Manager', rating: 5, content: "From the moment we arrived, every detail was flawless. The staff anticipated our every need, and the suite was pure perfection. We'll be back soon!", image: null },
                        { _id: 'at2', name: 'Sarah Johnson',   role: 'Travel Blogger',  rating: 5, content: "An absolutely exceptional stay. The rooms are beautifully appointed, the staff incredibly attentive, and the dining experience was world-class.", image: null },
                      ]).map(t => (
                        <div key={t._id} className="swiper-slide">
                          <div className="content">
                            <div className="star">
                              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                <i key={i} className="fa-solid fa-star"></i>
                              ))}
                            </div>
                            <p>{t.content}</p>
                            <div className="client-info-item">
                              <div className="info-item">
                                <img
                                  src={imgUrl(t.image, '/assets/img/home-1/testimonial/01.png')}
                                  alt={t.name}
                                />
                                <div className="content">
                                  <h5>{t.name}</h5>
                                  <span>{t.role}</span>
                                </div>
                              </div>
                              <div className="quate-image">
                                <img src="/assets/img/home-1/icon/07.svg" alt="img" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="testimonial-content">
                  <div className="section-title mb-0">
                    <span className="sub-title wow fadeInUp">
                      our hotel testimonials
                    </span>
                    <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                      What Our Guest&apos;s Say
                    </h2>
                  </div>
                  <div className="client-item">
                    <div className="group-image">
                      <img
                        src="/assets/img/home-1/testimonial/group.png"
                        alt="img"
                      />
                    </div>
                    <h6>
                      More than{' '}
                      <span className="odometer" data-count="25">
                        00
                      </span>
                      <b>k</b> <br />
                      Client Reviews
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section Start */}
      <section className="news-section-2 section-padding fix news-bg">
        <div className="container">
          <div className="section-title-area">
            <div className="section-title">
              <span className="sub-title sub-title-2 wow fadeInUp">
                {about.newsSection?.subtitle || 'news & blog'}
              </span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                {about.newsSection?.heading || 'Latest News & Articles'}
              </h2>
            </div>
            <a
              href={about.newsSection?.buttonLink || '/news'}
              className="theme-btn wow fadeInUp"
              data-wow-delay=".4s"
            >
              {about.newsSection?.buttonText || 'VIEW ALL ARTICLES'}
            </a>
          </div>
          <div className="row">
            {(about.featuredPosts?.length ? about.featuredPosts : STATIC_FEATURED_POSTS).slice(0, 3).map((post, i) => {
              const d = post.publishedAt ? new Date(post.publishedAt) : new Date()
              const link = post.ctaLink || `/news-details/${post.slug || post.id}`
              return (
                <div key={post.id || i} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="news-card-items-2">
                    <div className="news-image">
                      <img src={imgUrl(post.image, '/assets/img/home-2/news/01.jpg')} alt={post.title} loading="lazy" />
                      <div className="post-box">
                        <h4>{d.getDate()}<br /><span>{d.toLocaleString('en', { month: 'short' })}</span></h4>
                      </div>
                    </div>
                    <div className="news-content">
                      <ul className="news-meta">
                        <li><img src="/assets/img/home-2/arrow.png" alt="img" /> By {post.author || 'Admin'}</li>
                        <li className="style-2">{post.category || 'Hotel'}</li>
                      </ul>
                      <h4><a href={link}>{post.title}</a></h4>
                      <a href={link} className="link-btn">{post.ctaText || 'READ MORE'}</a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <InstagramSlider wrapperClass="instagram-section-2 section-padding pb-0 fix" />

      {/* Footer Section Start — identical to home page */}
      <footer
        className="footer-section fix bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="container">
          <div className="footer-newsletter">
            <div className="newsletter-content">
              <h3>Stay updated with The ParkQueen Hotel</h3>
              <p>
                At The ParkQueen Hotel, luxury is a crafted experience that
                blends elegance, comfort, and exceptional service in Rohtak.
              </p>
            </div>
            <form action="#">
              <div className="form-clt">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="text"
                  name="email"
                  id="email-footer"
                  placeholder="enter your email"
                />
                <button type="submit" className="theme-btn">
                  subscribe now
                </button>
              </div>
            </form>
          </div>
          <div className="footer-widget-wrapper">
            <div className="row">
              <div
                className="col-xl-4 col-md-6 col-lg-3 wow fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="single-footer-widget">
                  <div className="widget-title">
                    <h5>About us</h5>
                  </div>
                  <div className="footer-content">
                    <p>
                      Welcome to The ParkQueen Hotel, your destination for
                      refined luxury stays and hospitality that feels personal,
                      polished, and effortless.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-2 col-md-6 col-lg-3 wow fadeInUp"
                data-wow-delay=".4s"
              >
                <div className="single-footer-widget">
                  <div className="widget-title">
                    <h5>hotel best services</h5>
                  </div>
                  <ul className="list">
                    <li><a href="#">Airport pickup &amp; drop</a></li>
                    <li><a href="#">Room booking</a></li>
                    <li><a href="#">special offers</a></li>
                    <li><a href="#">special foods</a></li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp"
                data-wow-delay=".6s"
              >
                <div className="single-footer-widget">
                  <div className="widget-title">
                    <h5>check in &amp; out time</h5>
                  </div>
                  <ul className="date-list">
                    <li>
                      Mon to Fri :{' '}
                      <span className="style-1">08:00 - 11:00</span>
                    </li>
                    <li>Saturday : <span>08:00 - 11:00</span></li>
                    <li>Sunday : <span className="style-3">Closed</span></li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp"
                data-wow-delay=".8s"
              >
                <div className="single-footer-widget">
                  <div className="widget-title">
                    <h5>Contact Us</h5>
                  </div>
                  <ul className="contact-item">
                    <li>
                      <i className="fa-solid fa-location-dot"></i>
                      The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak,
                      Haryana 124001, India
                    </li>
                    <li className="style-2">
                      <i className="fa-solid fa-envelope"></i>
                      <a href="mailto:fom@parkqueenhotels.com">
                        fom@parkqueenhotels.com
                      </a>
                    </li>
                    <li className="style-2">
                      <i className="fa-solid fa-phone"></i>
                      <a href="tel:+919088809991">+91 9088809991</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-wrapper">
              <div className="social-icon wow fadeInLeft" data-wow-delay=".3s">
                <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              </div>
              <ul className="footer-list wow fadeInUp" data-wow-delay=".5s">
                <li><a href="#">Terms &amp; Conditions</a></li>
                <li>/</li>
                <li><a href="#">Privacy Policy</a></li>
                <li>/</li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
              <p className="wow fadeInRight" data-wow-delay=".7s">
                Copyright&copy; <span>The ParkQueen Hotel</span>
              </p>
            </div>
            <a href="/" className="footer-logo wow fadeInUp" data-wow-delay=".3s">
              <img
                style={{ width: '18rem' }}
                src="/assets/images/logo.png"
                alt="img"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
