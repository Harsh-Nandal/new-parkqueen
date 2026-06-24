'use client'
import { useState, useEffect } from 'react'
import { imgUrl } from '@/lib/imgUrl'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

const STATIC_FACILITIES = [
  { _id: 'f1', image: { url: '/assets/img/home-1/room/faciliti-1.jpg' }, icon: 'fa-utensils', title: 'Restaurant & Dining', text: 'Savor exceptional cuisine crafted by our chefs — from traditional Indian flavours to continental delights.' },
  { _id: 'f2', image: { url: '/assets/img/home-1/room/faciliti-2.jpg' }, icon: 'fa-restroom', title: 'Spa & Wellness', text: 'Rejuvenate your body and mind with our premium spa treatments.' },
  { _id: 'f3', image: { url: '/assets/img/home-1/room/faciliti-3.jpg' }, icon: 'fa-champagne-glasses', title: 'Banquets & Events', text: 'Host your weddings, corporate events, and celebrations in our beautifully appointed banquet halls.' },
  { _id: 'f4', image: { url: '/assets/img/home-1/room/faciliti-4.jpg' }, icon: 'fa-dumbbell', title: 'Fitness & Gym', text: 'Stay on top of your routine with our fully equipped fitness centre.' },
  { _id: 'f6', image: { url: '/assets/img/home-1/room/faciliti-6.jpg' }, icon: 'fa-car-rear', title: 'Free Guest Parking', text: 'Secure, complimentary parking for all guests.' },
]
const FOOTER_BG = 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'

export default function FacilitiesPage() {
  // null = still loading (prevents flash of old static images)
  const [facilities, setFacilities] = useState(null)
  const [breadcrumbBg, setBreadcrumbBg] = useState('/assets/img/breadcrumb.jpg')
  const [footerBg, setFooterBg] = useState(FOOTER_BG)
  const [hero, setHero] = useState({})

  useEffect(() => {
    fetch('/api/hero/facilities')
      .then(r => r.json())
      .then(d => { if (d.data) setHero(d.data) })
      .catch(() => {})

    // Fetch from the same source the admin saves to
    fetch('/api/content/facilities')
      .then(r => r.json())
      .then(d => {
        if (d.items?.length) setFacilities(d.items)
        else setFacilities(STATIC_FACILITIES)
        if (d.breadcrumbBg) setBreadcrumbBg(d.breadcrumbBg)
      })
      .catch(() => setFacilities(STATIC_FACILITIES))

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.data?.footer?.backgroundImage) setFooterBg(imgUrl(d.data.footer.backgroundImage, FOOTER_BG)) })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* GT Back To Top Start */}
      <button id="back-top" className="back-to-top show">
        <i className="fa-regular fa-arrow-up"></i>
      </button>
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>

      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="/">
                    <img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="The ParkQueen Hotel logo" />
                  </a>
                </div>
                <div className="offcanvas__close">
                  <button><i className="fas fa-times"></i></button>
                </div>
              </div>
              <div className="text d-none d-xl-block">
                <p>Nullam dignissim, ante scelerisque the is euismod fermentum odio sem semper the is erat, a feugiat leo urna eget eros. Duis Aenean a imperdiet risus.</p>
                <p>Welcome to The ParkQueen Hotel, your trusted destination for refined luxury stays and hospitality that feels personal, polished, and effortless.</p>
                <h4 className="d-xl-block">Contact Info</h4>
                <ul className="d-xl-block">
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon"><i className="fal fa-map-marker-alt"></i></div>
                    <div className="offcanvas__contact-text"><a target="_blank" href="#">The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India</a></div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15"><i className="fal fa-envelope"></i></div>
                    <div className="offcanvas__contact-text"><a href="mailto:fom@parkqueenhotels.com"><span className="mailto:fom@parkqueenhotels.com">fom@parkqueenhotels.com</span></a></div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15"><i className="fal fa-clock"></i></div>
                    <div className="offcanvas__contact-text"><a target="_blank" href="#">Mon-Friday, 09am - 05pm</a></div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="offcanvas__contact-icon mr-15"><i className="far fa-phone"></i></div>
                    <div className="offcanvas__contact-text"><a href="tel:+919088809991">+91 90888 09991</a></div>
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

      {/* Header Section Start */}
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href="/" className="header-logo">
                    <img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="logo-img" />
                  </a>
                  <a href="/" className="header-logo-2">
                    <img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="logo-img" />
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
                      <li className="has-dropdown d-xl-none">
                        <a href="/" className="border-none"> Home </a>
                      </li>
                      <li>
                        <a href="/about">About Us</a>
                      </li>
                      <li className="has-dropdown active">
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
                  <div className="icon"><i className="fa-solid fa-phone"></i></div>
                  <h6><a href="tel:+919088809991">+91 9088809991</a></h6>
                </div>
                <div className="header-button">
                  <a href="#" className="theme-btn">BOOK NOW</a>
                </div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle"><i className="fas fa-bars"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Wrapper Start */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: `url('${imgUrl(hero?.backgroundImage || breadcrumbBg, '/assets/img/breadcrumb.jpg')}')` }}
      >
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">{hero?.title || 'Hotel Facilities'}</h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li><a href="/">Home</a></li>
              <li><i className="fa-solid fa-chevron-right"></i></li>
              <li>Hotel Facilities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hotel Facilities Section Start */}
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

      {/* Instagram Section */}
      <InstagramSlider wrapperClass="instagram-section-2 fix" />

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
              <p>At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.</p>
            </div>
            <form action="#">
              <div className="form-clt">
                <i className="fa-solid fa-envelope"></i>
                <input type="text" name="email" id="email-footer-facilities" placeholder="enter your email" />
                <button type="submit" className="theme-btn">subscribe now</button>
              </div>
            </form>
          </div>
          <div className="footer-widget-wrapper">
            <div className="row">
              <div className="col-xl-4 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".2s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>About us</h5></div>
                  <div className="footer-content"><p>Welcome to The ParkQueen Hotel, your destination for refined luxury stays and hospitality that feels personal, polished, and effortless.</p></div>
                </div>
              </div>
              <div className="col-xl-2 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".4s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>hotel best services</h5></div>
                  <ul className="list">
                    <li><a href="#">Airport pickup &amp; drop</a></li>
                    <li><a href="#">Room booking</a></li>
                    <li><a href="#">special offers</a></li>
                    <li><a href="#">special foods</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".6s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>check in &amp; out time</h5></div>
                  <ul className="date-list">
                    <li>Mon to Fri : <span className="style-1">08:00 - 11:00</span></li>
                    <li>Saturday : <span>08:00 - 11:00</span></li>
                    <li>Sunday : <span className="style-3">Closed</span></li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 ps-lg-5 col-md-6 col-lg-3 wow fadeInUp" data-wow-delay=".8s">
                <div className="single-footer-widget">
                  <div className="widget-title"><h5>Contact Us</h5></div>
                  <ul className="contact-item">
                    <li><i className="fa-solid fa-location-dot"></i> The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India</li>
                    <li className="style-2"><i className="fa-solid fa-envelope"></i><a href="mailto:fom@parkqueenhotels.com">fom@parkqueenhotels.com</a></li>
                    <li className="style-2"><i className="fa-solid fa-phone"></i><a href="tel:+919088809991">+91 9088809991</a></li>
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
              <p className="wow fadeInRight" data-wow-delay=".7s">Copyright&copy; <span>The ParkQueen Hotel</span></p>
            </div>
            <a href="/" className="footer-logo wow fadeInUp" data-wow-delay=".3s">
              <img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="img" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
