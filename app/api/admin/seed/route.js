export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Room } from '@/lib/models/Room'
import { Service } from '@/lib/models/Service'
import { Offer } from '@/lib/models/Offer'
import { Testimonial } from '@/lib/models/Testimonial'
import { Gallery } from '@/lib/models/Gallery'
import { BlogPost } from '@/lib/models/BlogPost'
import { FAQ } from '@/lib/models/FAQ'
import { SiteSettings } from '@/lib/models/SiteSettings'
import { Hero } from '@/lib/models/Hero'
import { Content } from '@/lib/models/Content'

// ─── Seed data extracted from all frontend pages ─────────────────────────────

const SITE_SETTINGS = {
  siteName: 'The ParkQueen Hotel',
  tagline: 'Luxury Hotel in Rohtak, Haryana',
  phone: ['+91 9088809991'],
  email: ['fom@parkqueenhotels.com'],
  whatsapp: '+919088809991',
  address: 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India',
  city: 'Rohtak',
  state: 'Haryana',
  country: 'India',
  pincode: '124001',
  mapEmbed: 'https://maps.google.com/maps?q=The+ParkQueen+Hotel+Rohtak+Haryana&t=&z=14&ie=UTF8&iwloc=&output=embed',
  social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#', youtube: '#' },
  footer: {
    tagline: 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.',
    copyright: 'The ParkQueen Hotel',
    checkIn: '12:00 PM',
    checkOut: '11:00 AM',
    weekdayHours: '08:00 - 11:00',
    saturdayHours: '08:00 - 11:00',
    sundayClosed: true,
  },
  seo: {
    title: 'The ParkQueen Hotel — Rohtak, Haryana',
    description: 'The ParkQueen Hotel in Rohtak, Haryana — Luxury stays, dining and events in Rohtak, India.',
    keywords: 'ParkQueen Hotel, Rohtak hotel, luxury hotel Rohtak, hotel Haryana, best hotel Rohtak',
  },
}

const HEROES = [
  { page: 'home', title: 'The ParkQueen Hotel', subtitle: 'Luxury Hotel in Rohtak', description: 'Indulge in a luxurious hotel stay where comfort meets style, offering world-class amenities, elegant design, and exceptional personalized service.', buttonText: 'View Our Rooms', buttonLink: '#', backgroundImage: { url: '/assets/images/home/12121.jpg.jpeg', public_id: '' }, overlayColor: 'linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.25))' },
  { page: 'about', title: 'About Us', subtitle: 'The Heart of Hospitality', description: 'Learn about our story, vision, and commitment to delivering unforgettable hospitality.', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'contact', title: 'Contact Us', subtitle: 'Get In Touch', description: 'We are always here to help. Reach us anytime.', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'facilities', title: 'Hotel Facilities', subtitle: 'World-Class Amenities', description: 'Explore our premium facilities designed to make your stay exceptional.', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'service', title: 'Services', subtitle: 'Tailored for You', description: 'From fine dining to adventure tours — explore all our exclusive service offerings.', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'news', title: 'Blog Standard', subtitle: 'Latest News & Articles', description: 'Stay updated with news, tips, and stories from The ParkQueen Hotel.', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'news-details', title: 'Blog Details', subtitle: '', description: '', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
  { page: 'service-details', title: 'Services Details', subtitle: '', description: '', backgroundImage: { url: '/assets/img/breadcrumb.jpg', public_id: '' } },
]

const ROOMS = [
  { name: 'Delux Family Room', category: 'Standard Room', description: 'Our spacious Standard Room offers a premium experience with elegant décor and modern amenities perfect for families.', price: '₹4,999', priceUnit: 'NIGHT', size: '1500 SQ.FT', capacity: 2, images: [{ url: '/assets/images/rooms/ROOM2.jpg', public_id: '' }], amenities: ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV', 'Mini Bar'], status: 'active', featured: true, order: 1 },
  { name: 'Delux Family Room', category: "Couple's Room", description: 'Perfect romantic retreat with a plush king bed, ambient lighting, and curated amenities for couples.', price: '₹5,999', priceUnit: 'NIGHT', size: '1500 SQ.FT', capacity: 2, images: [{ url: '/assets/images/rooms/newroom.jpeg', public_id: '' }], amenities: ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV', 'Jacuzzi'], status: 'active', featured: true, order: 2 },
  { name: 'Delux Family Room', category: 'Super Delux Room', description: 'An indulgent experience with premium furnishings, panoramic views, and exclusive butler service.', price: '₹7,499', priceUnit: 'NIGHT', size: '2000 SQ.FT', capacity: 4, images: [{ url: '/assets/images/rooms/ROOM3.jpg', public_id: '' }], amenities: ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'Smart TV', 'Mini Bar', 'Balcony'], status: 'active', featured: true, order: 3 },
  { name: 'Delux Family Room', category: 'Haven Room', description: 'A serene sanctuary where comfort and style meet — perfect for solo travellers or business guests.', price: '₹6,499', priceUnit: 'NIGHT', size: '1800 SQ.FT', capacity: 2, images: [{ url: '/assets/images/rooms/ROOM4.jpg', public_id: '' }], amenities: ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'Work Desk', 'Coffee Maker'], status: 'active', featured: false, order: 4 },
  { name: 'Delux Family Room', category: 'Standard Room', description: 'Clean, comfortable, and well-appointed — ideal for travellers looking for quality at value pricing.', price: '₹3,999', priceUnit: 'NIGHT', size: '1200 SQ.FT', capacity: 2, images: [{ url: '/assets/images/rooms/ROOM5.jpg', public_id: '' }], amenities: ['Free Wi-Fi', 'Air Conditioning', 'Room Service', 'TV'], status: 'active', featured: false, order: 5 },
]

const SERVICES = [
  { title: 'Restaurant & Dining', description: 'Savor exceptional cuisine crafted by our chefs — from traditional Indian flavours to continental delights, all served in an elegant ambiance at The ParkQueen Hotel.', icon: 'fa-utensils', image: { url: '/assets/img/home-1/room/faciliti-1.jpg', public_id: '' }, category: 'dining', status: 'active', featured: true, order: 1 },
  { title: 'Spa & Wellness', description: 'Rejuvenate your body and mind with our premium spa treatments, designed to offer deep relaxation and a refreshing escape from the everyday.', icon: 'fa-restroom', image: { url: '/assets/img/home-1/room/faciliti-2.jpg', public_id: '' }, category: 'wellness', status: 'active', featured: true, order: 2 },
  { title: 'Banquets & Events', description: 'Host your weddings, corporate events, and celebrations in our beautifully appointed banquet halls with full planning and catering support.', icon: 'fa-champagne-glasses', image: { url: '/assets/img/home-1/room/faciliti-3.jpg', public_id: '' }, category: 'events', status: 'active', featured: true, order: 3 },
  { title: 'Fitness & Gym', description: 'Stay on top of your routine with our fully equipped fitness centre, open all day to help you maintain your health and energy throughout your stay.', icon: 'fa-dumbbell', image: { url: '/assets/img/home-1/room/faciliti-4.jpg', public_id: '' }, category: 'fitness', status: 'active', featured: true, order: 4 },
  { title: 'Free Guest Parking', description: 'Arrive with ease — The ParkQueen Hotel offers secure, complimentary parking for all guests, ensuring a stress-free start and end to every visit.', icon: 'fa-car-rear', image: { url: '/assets/img/home-1/room/faciliti-6.jpg', public_id: '' }, category: 'general', status: 'active', featured: false, order: 5 },
  { title: 'Smart Key Access', description: 'Experience keyless convenience with our smart key technology for seamless room access anytime.', icon: 'fa-key', image: { url: '/assets/img/home-1/icon/08.svg', public_id: '' }, category: 'technology', status: 'active', featured: false, order: 7 },
  { title: 'Fast Wi-Fi Internet', description: 'Stay connected with high-speed complimentary Wi-Fi available throughout the hotel premises.', icon: 'fa-wifi', image: { url: '/assets/img/home-1/icon/02.svg', public_id: '' }, category: 'technology', status: 'active', featured: false, order: 8 },
  { title: 'Room Service', description: 'Enjoy in-room dining with our 24/7 room service offering a curated menu of hotel specialties.', icon: 'fa-concierge-bell', image: { url: '/assets/img/home-1/icon/03.svg', public_id: '' }, category: 'dining', status: 'active', featured: false, order: 9 },
  { title: 'Food & Drink', description: 'A range of food and beverage options available across multiple dining outlets within the hotel.', icon: 'fa-utensils', image: { url: '/assets/img/home-1/icon/05.svg', public_id: '' }, category: 'dining', status: 'active', featured: false, order: 10 },
]

const OFFERS = [
  { title: 'Rohtak Heritage Tour', description: 'Explore the rich cultural heritage of Rohtak with our curated city tour package, including guided visits to historical sites and local attractions.', image: { url: '/assets/img/home-1/offer/radius-1.jpg', public_id: '' }, cardImage: { url: '/assets/img/home-1/offer/radius-5.jpg', public_id: '' }, status: 'active', featured: true, order: 1 },
  { title: 'Special Dining Experience', description: 'Treat yourself to an exclusive dining experience at our signature restaurant with a specially crafted menu for two.', image: { url: '/assets/img/home-1/offer/radius-2.jpg', public_id: '' }, cardImage: { url: '/assets/img/home-1/offer/radius-6.jpg', public_id: '' }, status: 'active', featured: true, order: 2 },
  { title: 'Extend Your Stay', description: 'Book 3 nights and get the 4th night complimentary. Enjoy extended luxury at an unbeatable value.', image: { url: '/assets/img/home-1/offer/radius-9.jpg', public_id: '' }, cardImage: { url: '/assets/img/home-1/offer/01.jpg', public_id: '' }, status: 'active', featured: true, order: 3 },
  { title: 'Stay a Bit Longer', description: 'Weekend getaway package with complimentary breakfast and spa access for the whole family.', image: { url: '/assets/img/home-1/offer/radius-3.jpg', public_id: '' }, cardImage: { url: '/assets/img/home-1/offer/radius-7.jpg', public_id: '' }, status: 'active', featured: false, order: 4 },
  { title: 'Rohtak Festival Packages', description: 'Celebrate local festivals in style with our specially curated packages including cultural experiences and festive dining.', image: { url: '/assets/img/home-1/offer/radius-4.jpg', public_id: '' }, cardImage: { url: '/assets/img/home-1/offer/radius-8.jpg', public_id: '' }, status: 'active', featured: false, order: 5 },
]

const TESTIMONIALS = [
  { name: 'Marvin McKinney', role: 'Product Manager', rating: 5, content: "From the moment we arrived, every detail was flawless. The staff anticipated our every need, and the suite was pure perfection. We'll be back soon!", image: { url: '/assets/img/home-1/testimonial/01.png', public_id: '' }, status: 'active', order: 1 },
  { name: 'Sarah Johnson', role: 'Travel Blogger', rating: 5, content: "An absolutely exceptional stay. The rooms are beautifully appointed, the staff incredibly attentive, and the dining experience was world-class.", image: { url: '/assets/img/home-1/testimonial/01.png', public_id: '' }, status: 'active', order: 2 },
  { name: 'Rajesh Kumar', role: 'Business Executive', rating: 5, content: "The ParkQueen Hotel is easily the finest accommodation in Rohtak. Perfect blend of luxury and service. Highly recommended for both business and leisure.", image: { url: '/assets/img/home-1/testimonial/01.png', public_id: '' }, status: 'active', order: 3 },
]

const GALLERY = [
  { title: 'Hotel Gallery 1', category: 'about', image: { url: '/assets/images/gallery/NDS_4957-1.jpg', public_id: '' }, status: 'active', order: 1 },
  { title: 'Hotel Gallery 2', category: 'about', image: { url: '/assets/images/gallery/NDS_4960.jpg', public_id: '' }, status: 'active', order: 2 },
  { title: 'Hotel Gallery 3', category: 'about', image: { url: '/assets/images/gallery/NDS_4971.jpg', public_id: '' }, status: 'active', order: 3 },
  { title: 'Hotel Gallery 4', category: 'about', image: { url: '/assets/images/gallery/NDS_4974.jpg', public_id: '' }, status: 'active', order: 4 },
  { title: 'Hotel Gallery 5', category: 'about', image: { url: '/assets/images/gallery/NDS_5018.jpg', public_id: '' }, status: 'active', order: 5 },
  { title: 'Hotel Gallery 6', category: 'about', image: { url: '/assets/images/gallery/NDS_5029.jpg', public_id: '' }, status: 'active', order: 6 },
  { title: 'Hotel Gallery 7', category: 'about', image: { url: '/assets/images/gallery/NDS_5036.jpg', public_id: '' }, status: 'active', order: 7 },
  { title: 'Hotel Gallery 8', category: 'about', image: { url: '/assets/images/gallery/NDS_5039.jpg', public_id: '' }, status: 'active', order: 8 },
  { title: 'Hotel Gallery 9', category: 'about', image: { url: '/assets/images/gallery/NDS_5047.jpg', public_id: '' }, status: 'active', order: 9 },
  { title: 'Hotel Gallery 10', category: 'about', image: { url: '/assets/images/gallery/NDS_5162.jpg', public_id: '' }, status: 'active', order: 10 },
  { title: 'Hotel Gallery 11', category: 'about', image: { url: '/assets/images/gallery/NDS_5257.jpg', public_id: '' }, status: 'active', order: 11 },
  { title: 'Hotel Gallery 12', category: 'about', image: { url: '/assets/images/gallery/NDS_5265.jpg', public_id: '' }, status: 'active', order: 12 },
  { title: 'Dining Experience', category: 'dining', image: { url: '/assets/images/dining/NDS_5117.jpg', public_id: '' }, status: 'active', order: 13 },
  { title: 'Hotel Dining', category: 'dining', image: { url: '/assets/images/dining/NDS_5151.jpg', public_id: '' }, status: 'active', order: 14 },
  { title: 'Restaurant', category: 'dining', image: { url: '/assets/images/dining/NDS_4994.jpg', public_id: '' }, status: 'active', order: 15 },
]

const BLOG_POSTS = [
  { title: 'Luxury Travel Trends for the Modern Explorer', slug: 'luxury-travel-trends', excerpt: 'Discover smart interior design tips that transform your hotel experience into a stylish sanctuary.', content: 'Whether you\'re visiting for business or leisure, smart choices can elevate your stay at The ParkQueen Hotel. From personalized service to the right balance of comfort and elegance, these ideas will help you create memories that last a lifetime.', category: 'Hospitality', tags: ['HotelBooking', 'LuxuryStay', 'TravelInspiration'], author: 'Admin', status: 'published', featured: true, image: { url: '/assets/img/home-2/news/10.jpg', public_id: '' }, publishedAt: new Date('2025-03-11') },
  { title: 'Luxury Amenities That Redefine Comfort', slug: 'luxury-amenities-comfort', excerpt: 'Maximize your hotel stay with simple tips — enhance your downtime and highlight key experiences.', content: 'At The ParkQueen Hotel, luxury is not just a destination — it\'s a feeling, an experience, and a way of life. Our world-class amenities are designed to exceed your expectations and create moments you\'ll cherish forever.', category: 'Amenities', tags: ['LuxuryStay', 'HotelOffers', 'RoomWithAView'], author: 'Admin', status: 'published', featured: false, image: { url: '/assets/img/home-2/news/11.jpg', public_id: '' }, publishedAt: new Date('2025-03-11') },
  { title: 'Behind the Scenes: Life Inside a Luxury Hotel', slug: 'behind-the-scenes-luxury-hotel', excerpt: 'Luxury stays offer long-term memorable experiences through personalized service and exceptional hospitality.', content: 'Ever wondered what goes into creating the perfect hotel stay? At The ParkQueen Hotel, hundreds of team members work around the clock to ensure every guest experience is flawless, from the perfectly pressed linens to the impeccably timed room service.', category: 'Hospitality', tags: ['BookNow', 'Staycation', 'CityBreak'], author: 'Admin', status: 'published', featured: false, image: { url: '/assets/img/home-2/news/12.jpg', public_id: '' }, publishedAt: new Date('2025-03-11') },
  { title: 'Why The ParkQueen Hotel Is Rohtak\'s Premier Destination', slug: 'parkqueen-rohtaks-premier-destination', excerpt: 'Discover what sets The ParkQueen Hotel apart as the finest hospitality destination in Rohtak, Haryana.', content: 'Situated in the heart of Rohtak, The ParkQueen Hotel combines world-class amenities with the warm hospitality that Haryana is known for. Our commitment to excellence, combined with our prime location opposite Devi Lal Park, makes us the first choice for both business and leisure travellers.', category: 'Hotel', tags: ['HotelBooking', 'LuxuryStay', 'HolidayPlanning'], author: 'Admin', status: 'published', featured: true, image: { url: '/assets/img/home-2/news/01.jpg', public_id: '' }, publishedAt: new Date('2025-04-17') },
  { title: 'Discover Our Signature Dining Experience in Rohtak', slug: 'signature-dining-rohtak', excerpt: 'Embark on a culinary journey with masterful artistry and exceptional flavours at our signature restaurant.', content: 'Our chefs bring together the best of Indian and continental cuisines, crafting dishes that delight the senses. From festive banquets to intimate dinners, our restaurant offers an unmatched dining experience right in the heart of Rohtak.', category: 'Dining', tags: ['HotelBooking', 'CityBreak', 'BookNow'], author: 'Admin', status: 'published', featured: false, image: { url: '/assets/img/home-2/news/02.jpg', public_id: '' }, publishedAt: new Date('2025-04-20') },
  { title: '5 Reasons to Host Your Next Event at The ParkQueen Hotel', slug: 'host-events-parkqueen', excerpt: 'From weddings to corporate meets — discover why ParkQueen is the top event venue in Rohtak.', content: 'The ParkQueen Hotel offers versatile event spaces, professional event management, customized menus, state-of-the-art audio-visual equipment, and dedicated event coordinators to ensure your event is flawless from start to finish.', category: 'Events', tags: ['HotelOffers', 'TravelInspiration', 'HolidayPlanning'], author: 'Admin', status: 'published', featured: false, image: { url: '/assets/img/home-2/news/03.jpg', public_id: '' }, publishedAt: new Date('2025-04-25') },
]

const FAQS = [
  { question: 'What time is check-in and check-out?', answer: 'Standard check-in is from 12:00 PM (noon) and check-out is by 11:00 AM. Early check-in and late check-out are available subject to room availability. Please contact our front desk at least 24 hours in advance to arrange.', category: 'general', status: 'active', order: 1 },
  { question: 'Do you offer airport pickup and drop services?', answer: 'Yes, we offer airport pickup and drop services on request. Please contact our concierge at least 24 hours in advance to book the service. Additional charges may apply based on the distance.', category: 'services', status: 'active', order: 2 },
  { question: 'Is Wi-Fi available in the hotel?', answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel premises, including all guest rooms, lobby, restaurant, and conference areas.', category: 'facilities', status: 'active', order: 3 },
  { question: 'Do you have facilities for events and weddings?', answer: 'Absolutely! The ParkQueen Hotel offers beautifully appointed banquet halls and event spaces suitable for weddings, corporate meetings, birthday parties, and all types of celebrations. Our dedicated event management team will assist you with planning and execution.', category: 'events', status: 'active', order: 4 },
  { question: 'What dining options are available?', answer: 'Our hotel features a multi-cuisine restaurant serving Indian and continental dishes, a café for light snacks and beverages, and 24/7 room service. Special dietary requirements can be accommodated upon advance request.', category: 'dining', status: 'active', order: 5 },
  { question: 'Is there parking available at the hotel?', answer: 'Yes, we offer complimentary parking for all hotel guests. Our parking area is secure and monitored round the clock for your peace of mind.', category: 'facilities', status: 'active', order: 6 },
  { question: 'Can I participate in events without being a hotel guest?', answer: 'Yes, many of our events and dining experiences are open to outside guests. Please contact us in advance to check availability and make reservations.', category: 'general', status: 'active', order: 7 },
  { question: 'What is the cancellation policy?', answer: 'Cancellations made 48 hours or more before check-in are eligible for a full refund. Cancellations within 48 hours may incur a one-night charge. Please refer to your booking confirmation for specific terms.', category: 'booking', status: 'active', order: 8 },
]

const PAGE_CONTENTS = [
  {
    page: 'home',
    data: {
      hero: { backgroundImage: '/assets/images/home/12121.jpg.jpeg', heading: 'The ParkQueen Hotel', subheading: 'Luxury Hotel in Rohtak', subtext: 'Indulge in a luxurious hotel stay where comfort meets style, offering world-class amenities, elegant design, and exceptional personalized service.' },
      about: { image: '/assets/images/home/NDS_5148.jpg', subTitle: 'The Heart of Hospitality', heading: 'Welcome To a World of Warmth & Elegance Hotel', text: 'Welcome to The ParkQueen Hotel, your destination for luxury hospitality and effortless comfort in Rohtak. Enjoy refined service, elegant design, and exceptional experiences on every stay.' },
      featureList: ['Easy and secure online booking', 'Exclusive discounts and offers', '24/7 customer support', 'Flexible cancellation policies'],
      rooms: [
        { id: 1, image: '/assets/images/rooms/ROOM2.jpg', category: 'Standard Room', name: 'Delux Family Room', price: '$69 / NIGHT' },
        { id: 2, image: '/assets/images/rooms/newroom.jpeg', category: 'Standard Room', name: 'Delux Family Room', price: '$69 / NIGHT' },
        { id: 3, image: '/assets/images/rooms/ROOM3.jpg', category: "Couple's Room", name: 'Delux Family Room', price: '$69 / NIGHT' },
        { id: 4, image: '/assets/images/rooms/ROOM4.jpg', category: 'Super Delux Room', name: 'Delux Family Room', price: '$69 / NIGHT' },
        { id: 5, image: '/assets/images/rooms/ROOM5.jpg', category: 'Haven Room', name: 'Delux Family Room', price: '$69 / NIGHT' },
      ],
      roomsBg: '/assets/images/dining/NDS_5117.jpg',
      roomsHeading: 'Our Rooms / Accommodation',
      roomsSubtext: 'At The ParkQueen Hotel, we present exquisite rooms and suites crafted for modern luxury in Rohtak. Each space features premium amenities, elegant finishes, and a welcoming ambiance.',
      diningHeading: 'Our Signature Dining',
      diningSubtext: 'Embark on a journey of exquisite experiences, encompassing impeccable service, sophisticated ambience and masterful culinary artistry.',
      marqueeItems: ["Health and Fitness", "Rohtak's Premier Hotel", "Best Luxury Resort in Rohtak", "Luxury Hotel in Rohtak", "Modern City Hotel", "Best Luxury Resort"],
    },
  },
  {
    page: 'about',
    data: {
      breadcrumbBg: '/assets/img/breadcrumb.jpg',
      mainImage: '/assets/images/about/NDS_5014.jpg',
      subTitle: 'The Heart of Hospitality',
      heading: 'Welcome To a World of Warmth & Elegance Hotel',
      text: "Welcome to The ParkQueen Hotel, your destination for luxury hospitality and effortless comfort in Rohtak. Enjoy refined service, elegant design, and exceptional experiences on every stay. We are committed to making every visit personal, polished, and truly unforgettable.",
      buttonText: 'Know more about us',
      videoLink: '#',
    },
  },
  {
    page: 'contact',
    data: {
      breadcrumbBg: '/assets/img/breadcrumb.jpg',
      location: 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India',
      email: 'fom@parkqueenhotels.com',
      phone: '+91 9088809991',
      mapEmbed: 'https://maps.google.com/maps?q=The+ParkQueen+Hotel+Rohtak+Haryana&t=&z=14&ie=UTF8&iwloc=&output=embed',
    },
  },
  {
    page: 'service',
    data: {
      breadcrumbBg: '/assets/img/breadcrumb.jpg',
      statsBg: '/assets/img/home-2/feature/02.jpg',
      stats: {
        rooms: { value: '4', suffix: 'k+', label: 'Rooms' },
        facilities: { value: '200', suffix: '+', label: 'Facilities' },
        clients: { value: '2', suffix: 'k', label: 'Clients' },
        staff: { value: '150', suffix: '+', label: 'Staff' },
      },
    },
  },
  {
    page: 'global',
    data: {
      logo: '/assets/images/logo.png',
      siteName: 'The ParkQueen Hotel',
      phone: '+91 9088809991',
      email: 'fom@parkqueenhotels.com',
      address: 'The ParkQueen Hotel, Opposite Devi Lal Park, Rohtak, Haryana 124001, India',
      footerBg: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
      footerTagline: 'At The ParkQueen Hotel, luxury is a crafted experience that blends elegance, comfort, and exceptional service in Rohtak.',
    },
  },
]

// ─── Seed runner ─────────────────────────────────────────────────────────────

async function seedModel(Model, data, uniqueKey) {
  const count = await Model.countDocuments()
  if (count > 0) return { model: Model.modelName, skipped: true, existing: count }
  await Model.insertMany(data)
  return { model: Model.modelName, seeded: data.length }
}

async function seedHeroes() {
  const results = []
  for (const h of HEROES) {
    const exists = await Hero.findOne({ page: h.page })
    if (!exists) {
      await Hero.create(h)
      results.push(`created:${h.page}`)
    } else {
      results.push(`skipped:${h.page}`)
    }
  }
  return results
}

async function seedSiteSettings() {
  const exists = await SiteSettings.findOne()
  if (exists) return { model: 'SiteSettings', skipped: true }
  await SiteSettings.create(SITE_SETTINGS)
  return { model: 'SiteSettings', seeded: 1 }
}

async function seedPageContents() {
  const results = []
  for (const pc of PAGE_CONTENTS) {
    const exists = await Content.findOne({ page: pc.page })
    if (!exists) {
      await Content.create(pc)
      results.push(`created:${pc.page}`)
    } else {
      results.push(`skipped:${pc.page}`)
    }
  }
  return results
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const [rooms, services, offers, testimonials, gallery, blog, faqs, settings, heroes, pages] =
      await Promise.all([
        seedModel(Room, ROOMS),
        seedModel(Service, SERVICES),
        seedModel(Offer, OFFERS),
        seedModel(Testimonial, TESTIMONIALS),
        seedModel(Gallery, GALLERY),
        seedModel(BlogPost, BLOG_POSTS),
        seedModel(FAQ, FAQS),
        seedSiteSettings(),
        seedHeroes(),
        seedPageContents(),
      ])

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      results: { rooms, services, offers, testimonials, gallery, blog, faqs, settings, heroes, pages },
    })
  } catch (e) {
    console.error('[Seed Error]', e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

// GET — returns current counts for status check
export async function GET(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const counts = await Promise.all([
      Room.countDocuments(),
      Service.countDocuments(),
      Offer.countDocuments(),
      Testimonial.countDocuments(),
      Gallery.countDocuments(),
      BlogPost.countDocuments(),
      FAQ.countDocuments(),
      Hero.countDocuments(),
      SiteSettings.countDocuments(),
      Content.countDocuments(),
    ])
    const [rooms, services, offers, testimonials, gallery, blog, faqs, heroes, settings, pages] = counts
    return NextResponse.json({ success: true, data: { rooms, services, offers, testimonials, gallery, blog, faqs, heroes, settings, pages } })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
