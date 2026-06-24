'use client'
import InstagramSlider from '@/app/_components/InstagramSlider'
import AminitiesSection from '@/app/_components/AminitiesSection'

export default function NewsDetailsPage() {
  return (
    <>
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
                  <a href="/"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="The ParkQueen Hotel logo" /></a>
                </div>
                <div className="offcanvas__close"><button><i className="fas fa-times"></i></button></div>
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
      {/* Offcanvas Area End */}

      {/* Header Start */}
      <header id="header-sticky" className="header-1">
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <a href="/" className="header-logo"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="logo-img" /></a>
                  <a href="/" className="header-logo-2"><img style={{ width: '18rem' }} src="/assets/images/logo.png" alt="logo-img" /></a>
                </div>
              </div>
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown menu-thumb"><a href="/"> Home </a></li>
                      <li className="has-dropdown d-xl-none"><a href="/" className="border-none"> Home </a></li>
                      <li><a href="/about">About Us</a></li>
                      <li className="has-dropdown"><a href="/facilities"> Facilities </a></li>
                      <li><a href="/service"> Service </a></li>
                      <li className="active"><a href="/news"> Blog </a></li>
                      <li><a href="/contact">Contact Us</a></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="call-item">
                  <div className="icon"><i className="fa-solid fa-phone"></i></div>
                  <h6><a href="tel:+919088809991">+91 9088809991</a></h6>
                </div>
                <div className="header-button"><a href="#" className="theme-btn">BOOK NOW</a></div>
                <div className="header__hamburger d-xl-none my-auto">
                  <div className="sidebar__toggle"><i className="fas fa-bars"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Header End */}

      {/* Breadcrumb Start */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <h1>Blog Details</h1>
            <ul className="breadcrumb-items">
              <li><a href="/">Home</a></li>
              <li><i className="fa-solid fa-chevron-right"></i></li>
              <li>Blog Details</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Breadcrumb End */}

      {/* News Details Section Start */}
      <section className="news-details-section section-padding">
        <div className="container">
          <div className="news-details-wrapper">
            <div className="row g-4">

              {/* Main Content */}
              <div className="col-lg-8 col-12">
                <div className="details-image"><img src="/assets/img/inner-page/news-details/details-1.jpg" alt="img" /></div>
                <div className="news-details-content">
                  <h3>Luxury Travel Trends for the Modern Explorer</h3>
                  <p>Whether you&apos;re moving into a new experience or updating your current travel plans, smart choices can elevate your everyday living. From personalized service to the right balance of comfort and elegance, these ideas will help you create a stay that feels both functional and beautiful.</p>
                  <div className="sideber">
                    <h6 className="mb-0">Our team conducts a thorough evaluation of every guest experience, analyzing usability, comfort, and functionality.</h6>
                  </div>
                  <h4 className="news-title">01. Personalized Stays Over Standard Luxury</h4>
                  <p>Custom-curated itineraries, room preferences remembered, and private concierge services now set the standard for top-tier comfort.</p>
                  <h4 className="news-title">02. Wellness-Centered Getaways</h4>
                  <p>Modern travelers seek spa access, healthy dining options, and mindful experiences that restore body and mind during their stay.</p>
                  <h4 className="news-title">03. Experience-Driven Travel</h4>
                  <p>Guests want more than a room — they want local cultural experiences, curated tours, and unforgettable moments that money can&apos;t buy.</p>
                  <h4 className="news-title">04. Boutique &amp; Bespoke Properties</h4>
                  <p>Intimate hotels with distinct character and personalized attention are increasingly preferred over large chain properties.</p>
                  <h4 className="news-title">05. Seamless Digital Booking &amp; Smart Technology</h4>
                  <p>Mobile check-in, smart room controls, and instant booking confirmations define the modern luxury hotel experience.</p>
                  <h4 className="news-title">06. Culinary Exploration</h4>
                  <p>Hotel dining has evolved into a destination in itself — guests now seek signature restaurants, chef&apos;s tables, and local flavor pairings.</p>
                  <h4 className="news-title">07. Sustainable Luxury</h4>
                  <p>Eco-conscious travelers expect hotels to demonstrate responsibility — from energy efficiency to locally sourced ingredients.</p>
                  <h4 className="news-title">08. Extended Stays &amp; Workcations</h4>
                  <p>With remote work normalized, long-stay packages with high-speed internet, co-working spaces, and home comforts are in high demand.</p>
                  <div className="row g-4 mt-3">
                    <div className="col-lg-6"><div className="details-image"><img src="/assets/img/inner-page/news-details/details-2.jpg" alt="img" /></div></div>
                    <div className="col-lg-6"><div className="details-image"><img src="/assets/img/inner-page/news-details/details-3.jpg" alt="img" /></div></div>
                  </div>
                  <h3 className="text">Ready for the Stay of a Lifetime?</h3>
                  <p>No matter your preference, The ParkQueen Hotel offers unforgettable experiences. Pack your bags and experience true luxury in Rohtak.</p>
                  <div className="row tag-share-wrap mt-4 mb-5">
                    <div className="col-lg-7 col-12">
                      <div className="tagcloud">
                        <span>Tags:</span>
                        <a href="/news-details">HotelBooking</a>
                        <a href="/news-details">CityBreak</a>
                        <a href="/news-details">HotelOffer</a>
                      </div>
                    </div>
                    <div className="col-lg-5 col-12 mt-3 mt-lg-0 text-lg-end">
                      <div className="social-share">
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fa-brands fa-youtube"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                      </div>
                    </div>
                  </div>

                  {/* Comments Area */}
                  <div className="comments-area">
                    <div className="comments-heading"><h3>02 Comments</h3></div>
                    <div className="blog-single-comment d-flex gap-4 pt-4 pb-4">
                      <div className="image"><img src="/assets/img/inner-page/news-details/comment-1.png" alt="img" /></div>
                      <div className="content">
                        <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between">
                          <div className="con">
                            <h5><a href="/news-details">Leslie Alexander</a></h5>
                            <span>February 10, 2024 at 2:37 pm</span>
                          </div>
                          <a href="/news-details" className="reply">Reply</a>
                        </div>
                        <p className="mt-30 mb-4">Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy.</p>
                      </div>
                    </div>
                    <div className="blog-single-comment d-flex gap-4 pt-4 pb-4">
                      <div className="image"><img src="/assets/img/inner-page/news-details/comment-2.png" alt="img" /></div>
                      <div className="content">
                        <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between">
                          <div className="con">
                            <h5><a href="/news-details">Joseph Michael</a></h5>
                            <span>February 10, 2024 at 2:37 pm</span>
                          </div>
                          <a href="/news-details" className="reply">Reply</a>
                        </div>
                        <p className="mt-30 mb-4">Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy.</p>
                      </div>
                    </div>
                  </div>

                  {/* Comment Form */}
                  <div className="comment-form-wrap pt-5">
                    <h3>Leave a comment</h3>
                    <form action="#" id="contact-form" method="POST">
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <span>Your Name*</span>
                            <input type="text" name="name" id="name" placeholder="Your Name" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <span>Your Email*</span>
                            <input type="text" name="email" id="email6" placeholder="Your Email" />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <span>Message*</span>
                            <textarea name="message" id="message" placeholder="Type your message"></textarea>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <button type="submit" className="theme-btn">SEND MESSAGE</button>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 col-12">
                <div className="main-sideber">

                  {/* All Categories Widget */}
                  <div className="single-sideber-widget">
                    <div className="widget-title"><h3>All Categories</h3></div>
                    <ul className="category-list">
                      <li><a href="/news-details">City Guide</a><span>(08)</span></li>
                      <li><a href="/news-details">New Places</a><span>(02)</span></li>
                      <li><a href="/news-details">Business Travel</a><span>(10)</span></li>
                      <li><a href="/news-details">Events &amp; Celebrations</a><span>(15)</span></li>
                      <li><a href="/news-details">Resort</a><span>(12)</span></li>
                      <li><a href="/news-details">Tips &amp; Tricks</a><span>(07)</span></li>
                    </ul>
                  </div>

                  {/* Recent Post Widget */}
                  <div className="single-sideber-widget">
                    <div className="widget-title"><h3>Recent Post</h3></div>
                    <div className="recent-post-area">
                      <div className="recent-items">
                        <div className="recent-thumb"><img src="/assets/img/inner-page/news-details/post-1.jpg" alt="img" /></div>
                        <div className="recent-content">
                          <h5><a href="/news-details">VIP Services That Define Elite Hospitality</a></h5>
                          <ul><li>March 26, 2025</li></ul>
                        </div>
                      </div>
                      <div className="recent-items">
                        <div className="recent-thumb"><img src="/assets/img/inner-page/news-details/post-2.jpg" alt="img" /></div>
                        <div className="recent-content">
                          <h5><a href="/news-details">A Romantic Escape Luxury Getaways for Couples</a></h5>
                          <ul><li>March 26, 2025</li></ul>
                        </div>
                      </div>
                      <div className="recent-items">
                        <div className="recent-thumb"><img src="/assets/img/inner-page/news-details/post-3.jpg" alt="img" /></div>
                        <div className="recent-content">
                          <h5><a href="/news-details">How to Choose the Perfect Luxury Suite</a></h5>
                          <ul><li>March 26, 2025</li></ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Popular Tags Widget */}
                  <div className="single-sideber-widget mb-0">
                    <div className="widget-title"><h3>Popular Tags</h3></div>
                    <div className="tagcloud">
                      <a href="/news-details">HotelBooking</a>
                      <a href="/news-details">LuxuryStay</a>
                      <a href="/news-details">RoomWithAView</a>
                      <a href="/news-details">HotelOffers</a>
                      <a href="/news-details">TravelInspiration</a>
                      <a href="/news-details">CityBreak</a>
                      <a href="/news-details">HolidayPlanning</a>
                      <a href="/news-details">Staycation</a>
                      <a href="/news-details">BookNow</a>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      {/* News Details Section End */}
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
                <input type="text" name="email" id="email-footer-nd" placeholder="enter your email" />
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
      {/* Footer End */}
    </>
  )
}
