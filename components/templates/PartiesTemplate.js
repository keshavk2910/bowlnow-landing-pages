import { useState, useRef } from 'react'
import Image from 'next/image'

export default function PartiesTemplate({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    party_type: 'birthday',
    party_date: '',
    guest_count: '',
    special_requests: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'party_booking',
        funnel_name: funnel?.name,
        estimated_value: calculateEstimatedValue(formData.guest_count, formData.party_type)
      })
      setFormSubmitted(true)
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        party_type: 'birthday',
        party_date: '',
        guest_count: '',
        special_requests: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateEstimatedValue = (guestCount, partyType) => {
    const baseRate = partyType === 'corporate' ? 25 : partyType === 'birthday' ? 20 : 18
    return parseInt(guestCount) * baseRate || 0
  }

  // Default values
  const title = content.title || 'Party Time!'
  const heroTitle = content.hero_title || 'Unforgettable Parties Start Here'
  const heroBackground = content.hero_background || '/api/placeholder/1920/1080'
  const themeColor = site.settings?.theme_color || '#4F46E5'

  // Default slider content
  const sliders = [
    {
      title: content.slider_1_title || 'Birthday Parties',
      images: content.slider_1_images || ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      buttonText: content.slider_1_button_text || 'Book Birthday Party',
      buttonLink: content.slider_1_button_link || '#booking'
    },
    {
      title: content.slider_2_title || 'Corporate Events',
      images: content.slider_2_images || ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      buttonText: content.slider_2_button_text || 'Plan Corporate Event',
      buttonLink: content.slider_2_button_link || '#booking'
    },
    {
      title: content.slider_3_title || 'Special Celebrations',
      images: content.slider_3_images || ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
      buttonText: content.slider_3_button_text || 'Celebrate With Us',
      buttonLink: content.slider_3_button_link || '#booking'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Create memories that last a lifetime at {site.client_name}
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="#party-types"
              className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ 
                backgroundColor: themeColor,
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              Explore Party Options
            </a>
          </div>
        </div>
      </div>

      {/* Party Types Section */}
      <div id="party-types" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect Parties for Every Occasion
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate birthday celebrations to grand corporate events, we make every moment special
            </p>
          </div>

          {/* Party Type Sliders */}
          <div className="space-y-16">
            {sliders.map((slider, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">{slider.title}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {slider.images.slice(0, 3).map((image, imgIndex) => (
                        <div key={imgIndex} className={`${imgIndex === 0 ? 'col-span-2' : ''} relative h-48 rounded-xl overflow-hidden`}>
                          <Image
                            src={image}
                            alt={`${slider.title} ${imgIndex + 1}`}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-lg text-gray-700">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                        <span>Professional party planning</span>
                      </div>
                      <div className="flex items-center space-x-3 text-lg text-gray-700">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                        <span>Delicious food & beverages</span>
                      </div>
                      <div className="flex items-center space-x-3 text-lg text-gray-700">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                        <span>Fun activities & entertainment</span>
                      </div>
                      <div className="flex items-center space-x-3 text-lg text-gray-700">
                        <CheckIcon className="h-6 w-6 text-green-500" />
                        <span>Dedicated party coordinator</span>
                      </div>
                    </div>
                    
                    <a
                      href={slider.buttonLink}
                      className="inline-block px-8 py-4 text-lg font-bold text-white rounded-full transition-all duration-300 transform hover:scale-105 text-center"
                      style={{ backgroundColor: themeColor }}
                    >
                      {slider.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div id="booking" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Book Your Perfect Party
            </h2>
            <p className="text-xl text-gray-600">
              Let us help you create an unforgettable experience for your special occasion
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Party Booking Received!</h3>
                <p className="text-xl text-gray-600 mb-4">
                  Thank you for choosing {site.client_name} for your special celebration!
                </p>
                <p className="text-gray-600">
                  Our party coordinator will contact you within 24 hours to discuss the details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="party_type" className="block text-sm font-bold text-gray-700 mb-2">
                      Party Type *
                    </label>
                    <select
                      id="party_type"
                      required
                      value={formData.party_type}
                      onChange={(e) => handleInputChange('party_type', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="birthday">Birthday Party</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="graduation">Graduation</option>
                      <option value="other">Other Celebration</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="party_date" className="block text-sm font-bold text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="party_date"
                      required
                      value={formData.party_date}
                      onChange={(e) => handleInputChange('party_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="guest_count" className="block text-sm font-bold text-gray-700 mb-2">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      id="guest_count"
                      required
                      min="1"
                      value={formData.guest_count}
                      onChange={(e) => handleInputChange('guest_count', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="How many guests?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="special_requests" className="block text-sm font-bold text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    id="special_requests"
                    rows={4}
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Any special requests or dietary restrictions?"
                  />
                </div>

                {formData.guest_count && (
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <div className="text-center">
                      <p className="text-sm text-purple-700 mb-2">Estimated Party Cost</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ${calculateEstimatedValue(formData.guest_count, formData.party_type)}
                      </p>
                      <p className="text-xs text-purple-600">*Final pricing subject to customization</p>
                    </div>
                  </div>
                )}

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-12 py-4 text-xl font-bold text-white rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ backgroundColor: themeColor }}
                  >
                    {formSubmitting ? 'Submitting...' : 'Book My Party! 🎉'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">{site.client_name}</h3>
            <p className="text-gray-400 mb-6 text-lg">
              Making every celebration unforgettable since day one
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>© 2024 {site.client_name}</span>
              <span>•</span>
              <span>All rights reserved</span>
              <span>•</span>
              <span>Party planning excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}