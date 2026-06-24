'use client'
import { useState, useEffect } from 'react'
import { imgUrl } from '@/lib/imgUrl'
import InstagramSlider from '@/app/_components/InstagramSlider'

const STATIC_OFFERS = [
  { _id: 's1', title: 'Rohtak Heritage Tour', image: { url: '/assets/img/home-1/offer/radius-1.jpg' }, cardImage: { url: '/assets/img/home-1/offer/radius-5.jpg' }, cardTitle: 'ParkQueen Special' },
  { _id: 's2', title: 'Special Dining Experience', image: { url: '/assets/img/home-1/offer/radius-2.jpg' }, cardImage: { url: '/assets/img/home-1/offer/radius-6.jpg' }, cardTitle: 'Celebrating Freedom' },
  { _id: 's3', title: 'Extend Your Stay', image: { url: '/assets/img/home-1/offer/radius-9.jpg' }, cardImage: { url: '/assets/img/home-1/offer/01.jpg' }, cardTitle: 'Celebrating Freedom', active: true },
  { _id: 's4', title: 'Stay a Bit Longer', image: { url: '/assets/img/home-1/offer/radius-3.jpg' }, cardImage: { url: '/assets/img/home-1/offer/radius-7.jpg' }, cardTitle: 'Celebrating Freedom' },
  { _id: 's5', title: 'Rohtak Festival Packages', image: { url: '/assets/img/home-1/offer/radius-4.jpg' }, cardImage: { url: '/assets/img/home-1/offer/radius-8.jpg' }, cardTitle: 'Celebrating Freedom' },
]

const STATIC_TESTIMONIALS = [
  { _id: 't1', name: 'Marvin McKinney', role: 'Product Manager', rating: 5, content: "From the moment we arrived, every detail was flawless. The staff anticipated our every need, and the suite was pure perfection. We'll be back soon!", image: { url: '/assets/img/home-1/testimonial/01.png' } },
  { _id: 't2', name: 'Sarah Johnson', role: 'Travel Blogger', rating: 5, content: "An absolutely exceptional stay. The rooms are beautifully appointed, the staff incredibly attentive, and the dining experience was world-class.", image: { url: '/assets/img/home-1/testimonial/01.png' } },
]

export default function HomePage() {
  const [c, setC] = useState({})
  const [offers, setOffers] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetch('/api/content/home')
      .then(r => r.json())
      .then(data => setC(data))
      .catch(() => {})

    fetch('/api/offers?status=active&limit=10')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setOffers(d.data) })
      .catch(() => {})

    fetch('/api/testimonials?status=active&limit=10')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setTestimonials(d.data) })
      .catch(() => {})
  }, [])

  // Priority: admin home content → DB offers → static fallback
  const activeOffers = (c.offerItems?.length ? c.offerItems : null) || (offers.length ? offers : STATIC_OFFERS)
  const activeTestimonials = testimonials.length ? testimonials : STATIC_TESTIMONIALS

  // Reinitialize dining + hotel Swiper after dynamic images load into DOM
  useEffect(() => {
    const diningImgs = c.diningImages
    const hotelImgs = c.hotelImages
    if (!diningImgs?.length && !hotelImgs?.length) return

    const timer = setTimeout(() => {
      if (typeof window === 'undefined' || !window.Swiper) return
      const diningEl = document.querySelector('.dining-slider')
      const hotelEl = document.querySelector('.hotel-slider')
      if (!diningEl || !hotelEl) return

      if (diningEl.swiper) diningEl.swiper.destroy(true, true)
      if (hotelEl.swiper) hotelEl.swiper.destroy(true, true)

      const DiningSlider = new window.Swiper('.dining-slider', {
        spaceBetween: 20,
        speed: 1000,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: { nextEl: '.array-next', prevEl: '.array-prev' },
        breakpoints: {
          1199: { slidesPerView: 4 },
          991:  { slidesPerView: 3 },
          767:  { slidesPerView: 3 },
          575:  { slidesPerView: 3 },
          0:    { slidesPerView: 2 },
        },
      })

      const HotelSlider = new window.Swiper('.hotel-slider', {
        spaceBetween: 20,
        speed: 800,
        loop: true,
        slidesPerView: 1,
        effect: 'slide',
      })

      // Click a dining thumbnail → jump hotel slider to matching slide
      if (window.$) {
        window.$('.dining-slider .swiper-slide').off('click').on('click', function () {
          const realIndex = Number(this.getAttribute('data-swiper-slide-index'))
          HotelSlider.slideToLoop(realIndex, 800)
        })
        // Keep hotel in sync with dining autoplay
        DiningSlider.on('slideChange', function () {
          HotelSlider.slideToLoop(DiningSlider.realIndex, 800)
        })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [c.diningImages, c.hotelImages])

  // Helper: prefer dynamic value, fall back to static default
  const dyn = (dynamic, fallback) => dynamic || fallback

  return (
    <>
{/* GT Back To Top Start */}
      <button id="back-top" className="back-to-top show">
        <i className="fa-regular fa-arrow-up"></i>
      </button>

      {/* GT MouseCursor Start */}
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>

      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="#">
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
              {/* outer <p> changed to <div> — block elements cannot be nested inside <p> in JSX */}
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
                        Mod-friday, 09am -05pm
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
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay"></div>

      {/* Header Section Start */}
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href="#" className="header-logo">
                    <img
                      style={{ width: '18rem' }}
                      src="/assets/images/logo.png"
                      alt="logo-img"
                    />
                  </a>
                  <a href="#" className="header-logo-2">
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
                      <li className="has-dropdown active menu-thumb">
                        <a href="/"> Home </a>
                      </li>
                      
                      <li>
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

      {/* Hero Section Start */}
      <section
        className="hero-section-1 hero-1 fix bg-cover jquery-ripples"
        style={{
          backgroundImage: `url('${imgUrl(c.hero?.backgroundImage, '/assets/images/home/12121.jpg.jpeg')}')`,
          position: 'relative',
        }}
      >
        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.25))',
            zIndex: 1,
          }}
        ></div>
        <div className="container-fluid">
          <div className="row">
            <div className="hero-content">
              <p>
                {dyn(c.hero?.subtext, 'Indulge in a luxurious hotel stay where comfort meets style, offering world-class amenities, elegant design, and exceptional personalized service.')}
              </p>
              <a href="#" className="theme-btn" style={{ background: '#cda434' }}>
                view our rooms
              </a>
              <div className="hero-wrapper" style={{ position: 'relative', zIndex: 2 }}>
                <h1 className="wow fadeInUp" data-wow-delay=".3s">
                  The ParkQueen Hotel <br />
                  Luxury Hotel in Rohtak
                </h1>
                <div
                  className="hero-box"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(15px)',
                  }}
                >
                  <div className="top-item">
                    <h4>Hotel&apos;s Facilities</h4>
                    <div className="swiper-dot-1 mt-0">
                      <div className="dot"></div>
                    </div>
                  </div>
                  <div className="swiper hero-slider">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="hero-item">
                          <div className="hero-image">
                            <img
                              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
                              alt="Luxury pool"
                            />
                          </div>
                          <h6>Swimming Pool</h6>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="hero-item">
                          <div className="hero-image">
                            <img
                              src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80"
                              alt="Luxury lobby"
                            />
                          </div>
                          <h6>Guest Lobby</h6>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="hero-item">
                          <div className="hero-image">
                            <img
                              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                              alt="Luxury room"
                            />
                          </div>
                          <h6>Luxury Rooms</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Start */}
      <section className="about-section section-padding fix section-bg">
        <div className="container">
          <div className="about-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="about-image">
                  <img src={imgUrl(c.about?.image, '/assets/images/home/NDS_5148.jpg')} alt="img" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title mb-0">
                    <span className="sub-title wow fadeInUp">
                      {dyn(c.about?.subTitle, 'The Heart of Hospitality')}
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      {dyn(c.about?.heading, 'Welcome To a World of Warmth & Elegance Hotel')}
                    </h2>
                  </div>
                  <p className="text wow fadeInUp" data-wow-delay=".3s">
                    {dyn(c.about?.text, 'Welcome to The ParkQueen Hotel, your destination for luxury hospitality and effortless comfort in Rohtak.')}
                  </p>
                  <div className="list-item wow fadeInUp" data-wow-delay=".5s">
                    <ul className="list">
                      <li>
                        <i className="fa-solid fa-circle-chevron-right"></i>
                        Easy and secure online booking
                      </li>
                      <li>
                        <i className="fa-solid fa-circle-chevron-right"></i>
                        Exclusive discounts and offers
                      </li>
                    </ul>
                    <ul className="list">
                      <li>
                        <i className="fa-solid fa-circle-chevron-right"></i>
                        24/7 customer support
                      </li>
                      <li>
                        <i className="fa-solid fa-circle-chevron-right"></i>
                        Flexible cancellation policies
                      </li>
                    </ul>
                  </div>
                  <div
                    className="hero-button-item wow fadeInUp"
                    data-wow-delay=".3s"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div className="top-shape">
                      <img
                        src="/assets/img/home-1/about/bg-shape.png"
                        alt="img"
                      />
                    </div>
                    <a href="#" className="theme-btn">
                      Know more about us
                    </a>
                    <span className="button-text">
                      <span className="me-3 d-line">view reels</span>
                      <a href="#" className="video-btn ripple video-popup">
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

      {/* Marque Section Start */}
      <div className="marque-section fix section-padding pt-0">
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
              <i className="fa-sharp fa-solid fa-star"></i> Luxury Hotel in California
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
              <i className="fa-sharp fa-solid fa-star"></i> Luxury Hotel in California
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

      {/* Room Section Start */}
      <section className="room-section section-padding fix">
        <div className="bg-image">
          <img src={imgUrl(c.roomsBg, '/assets/images/dining/NDS_5117.jpg')} alt="img" />
        </div>
        <div className="container">
          <div className="section-title-area">
            <div className="section-title mb-0">
              <span className="sub-title text-white wow fadeInUp">
                Choose Your Perfect Stay
              </span>
              <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                {dyn(c.roomsHeading, 'Our Rooms / Accommodation')}
              </h2>
              <p className="mt-3 text-white wow fadeInUp" data-wow-delay=".3s">
                {dyn(c.roomsSubtext, 'At The ParkQueen Hotel, we present exquisite rooms and suites crafted for modern luxury in Rohtak.')}
              </p>
            </div>
            <div className="array-buttons wow fadeInUp" data-wow-delay=".5s">
              <button className="array-prev">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button className="array-next">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="swiper room-slider">
          <div className="swiper-wrapper">
            {(c.rooms || [
              { id: 1, image: '/assets/images/rooms/ROOM2.jpg', category: 'Executive Room', name: 'Executive Room', price: '₹5,500 + GST' },
              { id: 2, image: '/assets/images/rooms/newroom.jpeg', category: 'Superior Room', name: 'Superior Room', price: '₹6,000 + GST' },
              { id: 3, image: '/assets/images/rooms/ROOM3.jpg', category: 'Queen Suite', name: 'Queen Suite', price: '₹6,500 + GST' },
              { id: 4, image: '/assets/images/rooms/ROOM4.jpg', category: 'Presidential Suite', name: 'Presidential Suite', price: '₹7,499 + GST' },
              { id: 5, image: '/assets/images/rooms/ROOM5.jpg', category: 'Executive Room', name: 'Executive Room', price: '₹5,500 + GST' },
            ]).map(room => (
              <div key={room.id} className="swiper-slide">
                <div className="room-box-item">
                  <div className="room-image">
                    <img src={imgUrl(room.image, '')} alt={room.name || 'room'} />
                    <img src={imgUrl(room.image, '')} alt={room.name || 'room'} />
                    <span>{room.price}</span>
                  </div>
                  <div className="content-item">
                    <div className="room-content">
                      <h6>{room.category}</h6>
                      <h4><a href="#">{room.name}</a></h4>
                      <ul className="list">
                        <li><i className="fa-solid fa-bed-front"></i> 1500 SQ.FT/Rooms</li>
                        <li><i className="fa-solid fa-user"></i> 02 Guests</li>
                      </ul>
                    </div>
                    <a href="#" className="theme-btn">
                      Book Now <i className="fa-solid fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section Start */}
      <section className="feature-section section-padding fix">
        <div className="container">
          <div className="feature-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-xl-6 col-lg-7">
                <div className="feature-left-item">
                  <div className="feature-box-item">
                    <div className="feature-box wow fadeInUp" data-wow-delay=".3s">
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/01.svg" alt="img" />
                      </div>
                      <p>Free Car Parking</p>
                    </div>
                    <div
                      className="feature-box style-2 wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/02.svg" alt="img" />
                      </div>
                      <p>Fast Wi-Fi Internet</p>
                    </div>
                    <div className="feature-box wow fadeInUp" data-wow-delay=".7s">
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/03.svg" alt="img" />
                      </div>
                      <p>Room Service</p>
                    </div>
                  </div>
                  <div className="feature-box-item">
                    <div
                      className="feature-box style-2 wow fadeInUp"
                      data-wow-delay=".3s"
                    >
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/04.svg" alt="img" />
                      </div>
                      <p>Smart key&apos;s</p>
                    </div>
                    <div className="feature-box wow fadeInUp" data-wow-delay=".5s">
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/05.svg" alt="img" />
                      </div>
                      <p>Food &amp; Drink</p>
                    </div>
                    <div
                      className="feature-box style-2 wow fadeInUp"
                      data-wow-delay=".7s"
                    >
                      <div className="icon">
                        <img src="/assets/img/home-1/icon/06.svg" alt="img" />
                      </div>
                      <p>Swimming - Pool</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-5">
                <div className="feature-content">
                  <div className="section-title mb-0">
                    <span className="sub-title wow fadeInUp">
                      our best facilities
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Our Facilities &amp; Amenities
                    </h2>
                  </div>
                  <p className="text wow fadeInUp" data-wow-delay=".5s">
                    The ParkQueen Hotel brings premium hospitality to every guest,
                    blending modern comfort with elegant service for a truly
                    memorable escape in Rohtak.
                  </p>
                  <div
                    className="feature-contact-item wow fadeInUp"
                    data-wow-delay=".5s"
                  >
                    <div className="call-item">
                      <div className="shape">
                        <img src="/assets/img/call-bg-2.png" alt="img" />
                      </div>
                      <div className="icon">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <h6>
                        <a href="tel:+919088809991">+91 9088809991</a>
                      </h6>
                    </div>
                    <a href="#" className="theme-btn">
                      <img src="/assets/img/button-bg-2.png" alt="img" />
                      BOOK NOW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aminities Section Start */}
      <div className="aminities-section">
        <div className="container">
          <div className="aminities-wrapper">
            <div className="row">
              <div className="col-xl-12 sticky-style">
                <div className="aminities-items">
                  <div className="aminities-image">
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5117.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5117.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5117.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5117.jpg" alt="img" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 sticky-style">
                <div className="aminities-items">
                  <div className="aminities-image">
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5151.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5151.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5151.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_5151.jpg" alt="img" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-xl-12 sticky-style">
                <div className="aminities-items mb-0">
                  <div className="aminities-image">
                    <a href="#">
                      <img src="/assets/images/dining/NDS_4994.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_4994.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_4994.jpg" alt="img" />
                    </a>
                    <a href="#">
                      <img src="/assets/images/dining/NDS_4994.jpg" alt="img" />
                    </a>
                    <div className="content-box">
                      <div className="shape">
                        <img src="/assets/img/home-1/aminiti/bg.png" alt="img" />
                      </div>
                      <h3>
                        <a href="#">many more&apos;s</a>
                      </h3>
                      <a href="#" className="view-btn">
                        View All <i className="fa-solid fa-arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service-Offer Section Start */}
      <div className="service-offer-section section-padding fix">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">{dyn(c.offersSubtitle, 'our special offer')}</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              {dyn(c.offersHeading, "Our Latest Special Offer's")}
            </h2>
          </div>
          <div className="service-wrapper">
            {activeOffers.map((offer, i) => {
              const mainSrc = imgUrl(offer.image, null)
              const cardSrc = imgUrl(offer.cardImage, null)
              return (
                <div
                  key={offer._id || offer.id || i}
                  className={`service-main-item${i === 2 ? ' active' : ''}`}
                  onMouseEnter={e => {
                    document.querySelectorAll('.service-main-item').forEach(el => el.classList.remove('active'))
                    e.currentTarget.classList.add('active')
                  }}
                >
                  <div className="service-item">
                    <div className="service-image">
                      {mainSrc && <img src={mainSrc} alt="img" />}
                    </div>
                    <div className="service-content">
                      <h3><a href="#">{offer.title}</a></h3>
                      <a href="#" className="btn">view details</a>
                    </div>
                  </div>
                  <div className="service-card-item">
                    <div className="services-image">
                      {cardSrc && <img src={cardSrc} alt="img" />}
                      <div className="content">
                        <h3><a href="#">{offer.cardTitle || offer.description || offer.title}</a></h3>
                        <a href="#" className="views-btn">view details</a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hotel-Dining Section Start */}
      <section className="hotel-dining-section fix">
        <div className="container">
          <div className="hotel-dining-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="hotel-dining-content">
                  <div className="section-title mb-0">
                    <span className="sub-title text-white wow fadeInUp">
                      best foods in hotel
                    </span>
                    <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                      {dyn(c.diningHeading, 'Our Signature Dining')}
                    </h2>
                  </div>
                  <p className="text text-white wow fadeInUp" data-wow-delay=".5s">
                    {dyn(c.diningSubtext, 'Embark on a journey of exquisite experiences, encompassing impeccable service, sophisticated ambience and masterful culinary artistry.')}
                  </p>
                  <div className="dining-item">
                    <div className="swiper dining-slider">
                      <div className="swiper-wrapper">
                        {(c.diningImages || []).map((img, i) => (
                          <div key={i} className="swiper-slide">
                            <div className="dining-image">
                              <img src={imgUrl(img, '')} alt="img" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="array-buttons wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      <button className="array-prev">
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button className="array-next">
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="swiper hotel-slider">
                  <div className="swiper-wrapper">
                    {(c.hotelImages || []).map((img, i) => (
                      <div key={i} className="swiper-slide">
                        <div className="hotel-image">
                          <img src={imgUrl(img, '')} alt="img" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section Start */}
      <section
        className="testimonial-section section-padding fix bg-cover"
        style={{
          backgroundImage: `url('${imgUrl(c.testimonialBg, '/assets/img/home-1/testimonial/bg.jpg')}')`,
        }}
      >
        <div className="container">
          <div className="testimonial-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="testimonial-card-item scale-animation">
                  <div className="swiper testimonial-slider">
                    <div className="swiper-wrapper">
                      {activeTestimonials.map(t => (
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

      {/* Instagram Section Start */}
      <InstagramSlider wrapperClass="instagram-section fix" />

      {/* News Section Start */}
      <section className="news-section section-padding fix">
        <div className="container">
          <div className="section-title-area">
            <div className="section-title mb-0">
              <span className="sub-title wow fadeInUp">
                {dyn(c.newsSubtitle, 'Choose Your Perfect Stay')}
              </span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                {dyn(c.newsHeading, 'Our Latest News Feed')}
              </h2>
            </div>
            <a href="/news" className="theme-btn">VIEW all news</a>
          </div>
          <div className="news-wrapper">
            <div className="row">
              <div className="col-lg-6">
                <ul className="news-list">
                  {(c.newsItems || [
                    { id: 1, date: 'April 12, 2025', category: 'Tips & Enjoy', title: "Toast to the Good Life Our Sommelier's Picks" },
                    { id: 2, date: 'April 12, 2025', category: 'Tips & Enjoy', title: "Toast to the Good Life Our Sommelier's Picks" },
                    { id: 3, date: 'April 12, 2025', category: 'Tips & Enjoy', title: "Toast to the Good Life Our Sommelier's Picks" },
                    { id: 4, date: 'April 12, 2025', category: 'Tips & Enjoy', title: "Toast to the Good Life Our Sommelier's Picks" },
                  ]).map((item, i) => (
                    <li
                      key={item.id || i}
                      className="news-service"
                      onMouseEnter={() => {
                        document.querySelectorAll('.news-img-group li').forEach(el => el.classList.remove('active'))
                        const target = document.querySelector(`.news-img-group li:nth-child(${i + 1})`)
                        if (target) target.classList.add('active')
                      }}
                    >
                      <div className="tag">
                        <span>{item.date}</span>
                        <span className="style-2">{item.category}</span>
                      </div>
                      <div className="news-content">
                        <h3><a href="/news">{item.title}</a></h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-6">
                <ul className="news-img-group">
                  {(c.newsImages || [
                    '/assets/img/home-1/news/news-1.jpg',
                    '/assets/img/home-1/news/news-2.jpg',
                    '/assets/img/home-1/news/news-3.jpg',
                    '/assets/img/home-1/news/news-4.jpg',
                  ]).map((img, i) => (
                    <li key={i} className={i === 0 ? 'active' : ''}>
                      <div className="news-img">
                        <img src={imgUrl(img, `/assets/img/home-1/news/news-${i + 1}.jpg`)} alt="img" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Section Start */}
      <div className="brand-section section-padding fix section-bg">
        <div className="container">
          <div className="swiper brand-slider">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/01.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/01.png" alt="thumb" />
                  </span>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/02.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/02.png" alt="thumb" />
                  </span>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/03.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/03.png" alt="thumb" />
                  </span>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/04.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/04.png" alt="thumb" />
                  </span>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/05.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/05.png" alt="thumb" />
                  </span>
                </div>
              </div>
              <div className="swiper-slide">
                <div className="brand-item">
                  <span className="brand-three-active-media">
                    <img src="/assets/img/home-1/brand/06.png" alt="thumb" />
                  </span>
                  <span className="brand-three-hover-media">
                    <img src="/assets/img/home-1/brand/06.png" alt="thumb" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section Start */}
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
                  id="email"
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
                    <li>
                      <a href="#">Airport pickup &amp; drop</a>
                    </li>
                    <li>
                      <a href="#">Room booking</a>
                    </li>
                    <li>
                      <a href="#">special offers</a>
                    </li>
                    <li>
                      <a href="#">special foods</a>
                    </li>
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
                    <li>
                      Saturday : <span>08:00 - 11:00</span>
                    </li>
                    <li>
                      Sunday : <span className="style-3">Closed</span>
                    </li>
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
                <a href="#">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </div>
              <ul className="footer-list wow fadeInUp" data-wow-delay=".5s">
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
                <li>/</li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>/</li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
              <p className="wow fadeInRight" data-wow-delay=".7s">
                Copyright&copy; <span>The ParkQueen Hotel</span>
              </p>
            </div>
            <a href="#" className="footer-logo wow fadeInUp" data-wow-delay=".3s">
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
