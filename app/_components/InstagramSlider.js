'use client'
import { useState, useEffect, useRef } from 'react'
import { imgUrl } from '@/lib/imgUrl'

const SWIPER_CONFIG = {
  spaceBetween: 30,
  speed: 1500,
  loop: true,
  autoplay: { delay: 1000, disableOnInteraction: false },
  breakpoints: {
    1399: { slidesPerView: 6 },
    1199: { slidesPerView: 5 },
    991:  { slidesPerView: 4 },
    767:  { slidesPerView: 3 },
    650:  { slidesPerView: 2 },
    575:  { slidesPerView: 1 },
    0:    { slidesPerView: 1 },
  },
}

export default function InstagramSlider({ wrapperClass = 'instagram-section-2 fix' }) {
  const [images, setImages] = useState([])
  const swiperRef = useRef(null)

  useEffect(() => {
    fetch('/api/gallery?status=active&limit=12')
      .then(r => r.json())
      .then(d => {
        if (d.data?.length) {
          const urls = d.data.map(g => imgUrl(g.image, '')).filter(Boolean)
          if (urls.length) setImages(urls)
        }
      })
      .catch(() => {})
  }, [])

  // Re-initialize Swiper once images are in the DOM
  useEffect(() => {
    if (!images.length) return
    const timer = setTimeout(() => {
      if (typeof window === 'undefined' || !window.Swiper) return
      const el = document.querySelector('.instagram-banner-slider')
      if (!el) return
      // Destroy existing instance if main.js already created one
      if (el.swiper) el.swiper.destroy(true, true)
      swiperRef.current = new window.Swiper('.instagram-banner-slider', SWIPER_CONFIG)
    }, 150)
    return () => clearTimeout(timer)
  }, [images])

  if (!images.length) return null

  return (
    <div className={wrapperClass}>
      <div className="swiper instagram-banner-slider">
        <div className="swiper-wrapper">
          {images.map((src, i) => (
            <div key={i} className="swiper-slide">
              <div className="instagram-banner-items">
                <div className="banner-image">
                  <img src={src} alt="insta-img" />
                  <a href="#" className="icon">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
