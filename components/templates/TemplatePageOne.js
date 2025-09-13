import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function TemplatePageOne({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'birthday',
    event_date: '',
    guest_count: '',
    special_requests: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const carouselItems = content.carousel_items || []
    if (carouselItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [content.carousel_items])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'bowling_event_booking',
        funnel_name: funnel?.name,
        estimated_value: calculateEstimatedValue(formData.guest_count, formData.event_type)
      })
      setFormSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: 'birthday',
        event_date: '',
        guest_count: '',
        special_requests: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit booking request. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateEstimatedValue = (guestCount, eventType) => {
    const baseRate = eventType === 'corporate' ? 35 : eventType === 'birthday' ? 25 : 20
    return parseInt(guestCount) * baseRate || 0
  }

  // Content with defaults
  const logoUrl = content.logo_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop'
  const heroTitleLine1 = content.hero_title_line1 || 'Welcome To'
  const heroTitleLine2 = content.hero_title_line2 || 'Pleasant Hill Lanes'
  const heroSubtitle = content.hero_subtitle || 'Family Owned and Operated Bowling Center since 1962'
  const heroBackground = content.hero_background || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop'
  const heroCtaText = content.hero_cta_text || 'Book Now'

  const carouselItems = content.carousel_items || [
    {
      title: 'Bowl Your Way Through the Heat: Why Bowling Should Be Your New Favorite Summer Activity',
      description: 'Summer is the time for outdoors, barbecues, pool parties, and beaches! But if you are not...',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 relative">
                <Image
                  src={logoUrl}
                  alt={site.client_name}
                  fill
                  className="object-contain rounded-full"
                />
              </div>
            </div>
            
            {/* CTA Button */}
            <div>
              <a
                href="#booking"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold transition-colors duration-200 text-sm md:text-base"
              >
                Book an Event
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-start text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              {heroTitleLine1}<br />
              <span className="text-blue-400">{heroTitleLine2}</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-lg">
              {heroSubtitle}
            </p>
            <a
              href="#features"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              {heroCtaText}
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            {content.features_title || 'Our Features'}
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Open Bowling Card */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-80">
                <Image
                  src={content.open_bowling_image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'}
                  alt="Open Bowling"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    {content.open_bowling_title || 'Open Bowling'}
                  </h3>
                  <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                    {content.open_bowling_desc || 'Bowling is fun for the whole family. Everyone can bowl, nobody has to sit on the side line.'}
                  </p>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Know More
                  </button>
                </div>
              </div>
            </div>

            {/* Specials Card */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-80">
                <Image
                  src={content.specials_image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop'}
                  alt="Specials"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    {content.specials_title || 'Specials'}
                  </h3>
                  <p className="text-gray-200 mb-4 text-sm leading-relaxed uppercase tracking-wide">
                    {content.specials_desc || 'EXPERIENCE A WALLET-FRIENDLY WAY TO ROLL. LEARN MORE ABOUT OUR AMAZING SPECIALS!'}
                  </p>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Know More
                  </button>
                </div>
              </div>
            </div>

            {/* Bowling Leagues Card */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-80">
                <Image
                  src={content.leagues_image || 'https://images.unsplash.com/photo-1574394483755-5877f42d74d9?w=600&h=400&fit=crop'}
                  alt="Bowling Leagues"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">
                    {content.leagues_title || 'Bowling Leagues'}
                  </h3>
                  <p className="text-gray-200 mb-4 text-sm leading-relaxed">
                    {content.leagues_desc || 'Join our competitive leagues for fun and prizes'}
                  </p>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Know More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-8 space-x-4">
            <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Book Your Event Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Content */}
              <div className="p-8 lg:p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
                  {content.book_event_title || 'BOOK YOUR EVENT'}
                </h2>
                <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                  {content.book_event_desc || 'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team of event planners are ready to help you organize and book your next event!'}
                </p>
                <a
                  href="#booking"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200"
                >
                  Book Now
                </a>
              </div>
              
              {/* Right Image */}
              <div className="relative h-64 lg:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1574394483755-5877f42d74d9?w=800&h=600&fit=crop"
                  alt="Book Your Event"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parties & Events Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-wide">
            {content.parties_section_title || 'PARTIES & EVENTS'}
          </h2>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="relative h-96 md:h-[32rem]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end">
                        <div className="p-8 md:p-12 text-center w-full">
                          <h3 className="text-2xl md:text-3xl font-bold mb-4 max-w-4xl mx-auto leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div id="booking" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Book Your Event
            </h2>
            <p className="text-lg text-gray-600">
              Ready to roll? Book your bowling event today!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎳</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Received!</h3>
                <p className="text-xl text-gray-600 mb-4">
                  Thank you for choosing {site.client_name}!
                </p>
                <p className="text-gray-600">
                  We'll contact you within 24 hours to confirm your booking details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      id="event_type"
                      required
                      value={formData.event_type}
                      onChange={(e) => handleInputChange('event_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="birthday">Birthday Party</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="league">League Bowling</option>
                      <option value="fundraising">Fundraising Event</option>
                      <option value="youth">Youth Event</option>
                      <option value="other">Other Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      required
                      value={formData.event_date}
                      onChange={(e) => handleInputChange('event_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="guest_count" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of People *
                    </label>
                    <input
                      type="number"
                      id="guest_count"
                      required
                      min="1"
                      value={formData.guest_count}
                      onChange={(e) => handleInputChange('guest_count', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How many people?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    id="special_requests"
                    rows={4}
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requests, food preferences, or additional services needed?"
                  />
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-12 py-4 text-xl font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {formSubmitting ? 'Submitting...' : 'Book Your Event!'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 relative mr-4">
                  <Image
                    src={logoUrl}
                    alt={site.client_name}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{site.client_name}</h3>
              </div>
              <p className="text-gray-600 max-w-lg leading-relaxed">
                {content.footer_text || 'Pleasant Hill Lanes is a family-owned and operated bowling center. Opened in 1962 by Robert Maclary, who envisioned bringing wholesome family entertainment to Wilmington, DE.'}
              </p>
              <div className="mt-6 text-sm text-gray-500">
                © 2024 — Copyright Pleasant Hill Lanes. All Rights Reserved.
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {content.contact_email || 'info@bowlphl.com'}
                </p>
                <p className="text-gray-600 font-medium">
                  {content.contact_phone || '302-998-8811'}
                </p>
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm">📷</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icons
function ChevronLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}