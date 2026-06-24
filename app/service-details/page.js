'use client'
import { useState } from 'react'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

export default function ServiceDetailsPage() {
  const [booking, setBooking] = useState({ name: '', email: '', phone: '', checkIn: '', checkOut: '', roomType: 'Room', guests: '1' })
  const [submitting, setSubmitting] = useState(false)
  const [bookingStatus, setBookingStatus] = useState(null)
  const [bookingMsg, setBookingMsg] = useState('')
  const [bookingRef, setBookingRef] = useState('')

  async function handleBookingSubmit(e) {
    e.preventDefault()
    if (!booking.name.trim() || !booking.email.trim()) {
      setBookingStatus('error'); setBookingMsg('Name and email are required.'); return
    }
    if (!booking.checkIn.trim() || !booking.checkOut.trim()) {
      setBookingStatus('error'); setBookingMsg('Please enter check-in and check-out dates.'); return
    }
    if (booking.roomType === 'Room') {
      setBookingStatus('error'); setBookingMsg('Please select a room type.'); return
    }
    setSubmitting(true); setBookingStatus(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setBookingStatus('success')
        setBookingRef(data.data?.bookingRef || '')
        setBookingMsg('Your booking request has been submitted! Check your email for confirmation.')
        setBooking({ name: '', email: '', phone: '', checkIn: '', checkOut: '', roomType: 'Room', guests: '1' })
      } else {
        setBookingStatus('error'); setBookingMsg(data.error || 'Something went wrong.')
      }
    } catch { setBookingStatus('error'); setBookingMsg('Network error. Please try again.') }
    setSubmitting(false)
  }

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

      {/* Header Section Start */}
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
                      <li className="has-dropdown d-xl-none">
                        <a href="/" className="border-none"> Home </a>
                      </li>
                      <li><a href="/about">About Us</a></li>
                      <li className="has-dropdown">
                        <a href="/facilities"> Facilities </a>
                      </li>
                      <li className="active"><a href="/service"> Service </a></li>
                      <li><a href="/news"> Blog </a></li>
                      <li><a href="/contact">Contact Us</a></li>
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
                  <a href="#" className="theme-btn">BOOK NOW</a>
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
        style={{ backgroundImage: "url('/assets/img/breadcrumb.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <div className="breadcrumb-sub-title">
              <h1 className="text-white wow fadeInUp" data-wow-delay=".3s">
                Services Details
              </h1>
            </div>
            <ul className="breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right"></i>
              </li>
              <li>Services Details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Details Section Start */}
      <section className="service-details-section section-padding fix">
        <div className="container">
          <div className="service-details-wrapper">
            <div className="row g-4">
              <div className="col-lg-8 col-12">
                <div className="details-image">
                  <img
                    src="/assets/img/inner-page/service-details/details-1.jpg"
                    alt="img"
                  />
                </div>
                <div className="details-content">
                  <h2>Family Fun Package</h2>
                  <p>
                    Planning a trip for the whole family? Our Family Fun Package is
                    designed to offer comfort, entertainment, and unforgettable
                    moments for guests of all ages. Book now for a stay filled with
                    laughter, relaxation, and family bonding.
                  </p>
                  <span className="box">
                    Our team conducts a thorough evaluation of the submitted
                    element, analyzing its usability, functionality
                  </span>
                  <div className="details-list-item">
                    <h3>Package Inclusions:</h3>
                    <ul>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Family-Size
                          Room or Suite
                        </span>{' '}
                        Spacious accommodations with extra beds or connecting rooms,
                        ideal for families.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Daily
                          Breakfast Buffet for the Family
                        </span>{' '}
                        A variety of kid-friendly and healthy options included each
                        morning.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Welcome Gifts
                          for Children
                        </span>{' '}
                        Fun surprises like toys, coloring books, or snack packs upon
                        arrival.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Complimentary
                          Kids&apos; Club Access
                        </span>{' '}
                        Supervised activities, games, and crafts for different age
                        groups.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Family Movie
                          Night Experience
                        </span>{' '}
                        Enjoy in-room movie setup or join our weekly family movie
                        screenings with popcorn.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Kids Eat Free
                          (Under Age 6)
                        </span>{' '}
                        Special dining benefits when ordering from the children&apos;s
                        menu with a paying adult.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Access to
                          Family Pool &amp; Kids&apos; Play Area
                        </span>{' '}
                        Safe, clean recreational areas for fun and relaxation.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Free Late
                          Check-Out (Based on Availability)
                        </span>{' '}
                        Enjoy a little more time before departure.
                      </li>
                    </ul>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="details-image-2">
                        <img
                          src="/assets/img/inner-page/service-details/details-2.jpg"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="details-image-2">
                        <img
                          src="/assets/img/inner-page/service-details/details-3.jpg"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="details-list-item">
                    <h3>Booking Info:</h3>
                    <ul>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Availability:
                        </span>{' '}
                        Year-round (subject to blackout dates)
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Minimum Stay:
                        </span>{' '}
                        2 nights
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> How to Book:
                        </span>{' '}
                        Select the Family Fun Package when reserving your room online
                        or contact our reservations team.
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-circle-check"></i> Cancellation
                          Policy:
                        </span>{' '}
                        Flexible options available (check specific rates)
                      </li>
                    </ul>
                  </div>
                  <div className="faq-content">
                    <h3>Frequently Asked Question</h3>
                    <div className="faq-items">
                      <div className="accordion" id="accordionExample">
                        <div
                          className="accordion-item mb-3 wow fadeInUp"
                          data-wow-delay=".2s"
                        >
                          <h5 className="accordion-header" id="headingTwo">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              Can I participate in events without being a member?
                            </button>
                          </h5>
                          <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Experience the serene balance of our hotel, where
                                timeless traditions meet the pulse of modern life.
                                Every detail tells a story of harmony, comfort, and
                                refined elegance.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="accordion-item mb-3 wow fadeInUp"
                          data-wow-delay=".4s"
                        >
                          <h5 className="accordion-header" id="headingOne">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Are there events for beginners and experienced guests?
                            </button>
                          </h5>
                          <div
                            id="collapseOne"
                            className="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Yes, The ParkQueen Hotel hosts events for guests of
                                all backgrounds. Our concierge team ensures every
                                experience is tailored to your needs.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="accordion-item mb-3 wow fadeInUp"
                          data-wow-delay=".6s"
                        >
                          <h5 className="accordion-header" id="headingthree">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapsethree"
                              aria-expanded="false"
                              aria-controls="collapsethree"
                            >
                              Do you provide airport pickup services?
                            </button>
                          </h5>
                          <div
                            id="collapsethree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingthree"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Yes, airport pickup and drop services are available
                                on request. Please contact our front desk at least 24
                                hours in advance to arrange your transfer.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="accordion-item wow fadeInUp"
                          data-wow-delay=".8s"
                        >
                          <h5 className="accordion-header" id="headingfour">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapsefour"
                              aria-expanded="false"
                              aria-controls="collapsefour"
                            >
                              What is the check-in and check-out time?
                            </button>
                          </h5>
                          <div
                            id="collapsefour"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingfour"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Standard check-in is from 12:00 PM and check-out is
                                by 11:00 AM. Early check-in and late check-out are
                                available subject to availability.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12">
                <div className="service-main-sideber">
                  <div className="single-sideber-widget">
                    <div className="widget-title">
                      <h3>All Categories</h3>
                    </div>
                    <ul className="category-list">
                      <li>
                        <a href="/service-details">Smart Key</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                      <li>
                        <a href="/service-details">Free Car Parking</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                      <li>
                        <a href="/service-details">Fast Wifi Internet</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                      <li>
                        <a href="/service-details">Room Service</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                      <li>
                        <a href="/service-details">Food &amp; Drink</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                      <li>
                        <a href="/service-details">Swimming Pool</a>
                        <span><i className="fa-solid fa-circle-chevron-right"></i></span>
                      </li>
                    </ul>
                  </div>
                  <div className="single-sideber-widget">
                    <div className="widget-title">
                      <h3>Hours</h3>
                    </div>
                    <ul className="hours-list">
                      <li>
                        <span>Breakfast</span>{' '}
                        <b>7.00 AM to 10.30 AM</b>
                      </li>
                      <li>
                        <span>Lunch</span>{' '}
                        <b>1.00 PM to 2.30 PM</b>
                      </li>
                      <li>
                        <span>Supper</span>{' '}
                        <b>6.00 PM to 7.00 PM</b>
                      </li>
                      <li>
                        <span>Dinner</span>{' '}
                        <b>9.30 PM to 11.00 PM</b>
                      </li>
                      <li>
                        <span>Super Offer</span>{' '}
                        <b>Monday To Friday</b>
                      </li>
                    </ul>
                  </div>
                  <div className="single-sideber-widget">
                    <div className="widget-title">
                      <h3>Book A Room</h3>
                    </div>
                    <div className="booking-item">
                      {bookingStatus === 'success' && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '14px', marginBottom: 14, color: '#065f46', fontSize: 13 }}>
                          <i className="fa-solid fa-circle-check" style={{ marginRight: 8 }}></i>
                          {bookingMsg}
                          {bookingRef && <div style={{ marginTop: 6, fontWeight: 700 }}>Ref: {bookingRef}</div>}
                        </div>
                      )}
                      {bookingStatus === 'error' && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '14px', marginBottom: 14, color: '#dc2626', fontSize: 13 }}>
                          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 8 }}></i>{bookingMsg}
                        </div>
                      )}
                      <form onSubmit={handleBookingSubmit}>
                        <div className="row g-4">
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <input type="text" placeholder="Your Name *" value={booking.name} onChange={e => setBooking(b => ({ ...b, name: e.target.value }))} required />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <input type="email" placeholder="Your Email *" value={booking.email} onChange={e => setBooking(b => ({ ...b, email: e.target.value }))} required />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <input type="text" placeholder="Phone Number" value={booking.phone} onChange={e => setBooking(b => ({ ...b, phone: e.target.value }))} />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <input type="text" placeholder="Check In (e.g. 25 July 2025)" value={booking.checkIn} onChange={e => setBooking(b => ({ ...b, checkIn: e.target.value }))} required />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <input type="text" placeholder="Check Out (e.g. 27 July 2025)" value={booking.checkOut} onChange={e => setBooking(b => ({ ...b, checkOut: e.target.value }))} required />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <div className="form">
                                <select
                                  value={booking.roomType}
                                  onChange={e => setBooking(b => ({ ...b, roomType: e.target.value }))}
                                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14 }}
                                >
                                  <option value="Room">Select Room Type</option>
                                  <option value="Executive Room">Executive Room — ₹5,500 + GST</option>
                                  <option value="Superior Room">Superior Room — ₹6,000 + GST</option>
                                  <option value="Queen Suite">Queen Suite — ₹6,500 + GST</option>
                                  <option value="Presidential Suite">Presidential Suite — ₹7,499 + GST</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-clt">
                              <div className="form">
                                <select
                                  value={booking.guests}
                                  onChange={e => setBooking(b => ({ ...b, guests: e.target.value }))}
                                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14 }}
                                >
                                  <option value="1">1 Guest</option>
                                  <option value="2">2 Guests</option>
                                  <option value="3">3 Guests</option>
                                  <option value="4">4 Guests</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <button className="theme-btn w-100" type="submit" disabled={submitting}>
                              {submitting ? 'Submitting…' : 'CHECK AVAILABILITY'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className="service-details-contact-bg text-center bg-cover"
                    style={{
                      backgroundImage:
                        "url('/assets/img/inner-page/service-details/bg.jpg')",
                    }}
                  >
                    <h3>
                      Please Contact Us By Phone or Email to Make a Reservation.
                    </h3>
                    <div className="icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <p>Need Reservation? Call us, it&apos;s toll-free.</p>
                    <h3>
                      <a href="tel:+919088809991">+91 9088809991</a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
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
                <input type="text" name="email" id="email-footer-sd" placeholder="enter your email" />
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
