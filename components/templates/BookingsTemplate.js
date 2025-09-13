import { useState } from 'react'
import Image from 'next/image'

export default function BookingsTemplate({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    preferred_date: '',
    preferred_time: '',
    duration: '',
    special_requests: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'booking_request',
        funnel_name: funnel?.name,
        estimated_value: selectedService?.price || 0
      })
      setFormSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        preferred_date: '',
        preferred_time: '',
        duration: '',
        special_requests: ''
      })
      setSelectedService(null)
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

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setFormData(prev => ({ ...prev, service: service.name }))
  }

  // Default values
  const title = content.title || 'Book Your Experience'
  const heroTitle = content.hero_title || 'Reserve Your Spot Today'
  const heroBackground = content.hero_background || '/api/placeholder/1920/1080'
  const themeColor = site.settings?.theme_color || '#4F46E5'

  // Default services
  const services = content.services || [
    {
      name: 'Standard Booking',
      price: 50,
      duration: '2 hours',
      description: 'Perfect for individuals or small groups',
      features: ['2-hour session', 'Basic equipment included', 'Staff assistance'],
      popular: false
    },
    {
      name: 'Premium Experience',
      price: 85,
      duration: '3 hours',
      description: 'Enhanced experience with premium amenities',
      features: ['3-hour session', 'Premium equipment', 'Priority support', 'Complimentary refreshments'],
      popular: true
    },
    {
      name: 'VIP Package',
      price: 150,
      duration: '4 hours',
      description: 'The ultimate luxury experience',
      features: ['4-hour session', 'VIP treatment', 'Dedicated host', 'Gourmet catering', 'Professional photos'],
      popular: false
    }
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-96 flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Choose your perfect experience at {site.client_name}
          </p>
        </div>
      </div>

      {/* Services Selection */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select from our range of carefully crafted experiences, each designed to provide exceptional value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedService?.name === service.name 
                    ? 'ring-4 ring-opacity-50' 
                    : 'hover:shadow-xl'
                }`}
                style={{ 
                  ringColor: selectedService?.name === service.name ? themeColor : 'transparent' 
                }}
                onClick={() => handleServiceSelect(service)}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="px-4 py-2 text-sm font-bold text-white rounded-full"
                      style={{ backgroundColor: themeColor }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <div className="text-4xl font-bold mb-2" style={{ color: themeColor }}>
                    ${service.price}
                  </div>
                  <div className="text-gray-500">{service.duration}</div>
                </div>

                <p className="text-gray-600 text-center mb-6">{service.description}</p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedService?.name === service.name
                      ? 'text-white'
                      : 'text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedService?.name === service.name ? themeColor : 'transparent',
                    borderColor: selectedService?.name === service.name ? themeColor : undefined
                  }}
                >
                  {selectedService?.name === service.name ? 'Selected ✓' : 'Select This Package'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Your Booking
            </h2>
            <p className="text-lg text-gray-600">
              {selectedService 
                ? `You've selected: ${selectedService.name} - $${selectedService.price}`
                : 'Please select a service above to continue'
              }
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Submitted!</h3>
                <p className="text-xl text-gray-600 mb-4">
                  Thank you for booking with {site.client_name}!
                </p>
                <p className="text-gray-600 mb-6">
                  We'll confirm your booking and send you payment details within 24 hours.
                </p>
                {selectedService && (
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <p className="text-sm text-gray-600">Booking Summary:</p>
                    <p className="font-semibold">{selectedService.name}</p>
                    <p className="text-lg font-bold" style={{ color: themeColor }}>${selectedService.price}</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!selectedService && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-center">
                      Please select a service package above before completing your booking.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="preferred_date"
                      required
                      value={formData.preferred_date}
                      onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                    />
                  </div>

                  <div>
                    <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="preferred_time"
                      required
                      value={formData.preferred_time}
                      onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedService && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-blue-900">Selected Service:</p>
                        <p className="text-blue-700">{selectedService.name}</p>
                        <p className="text-sm text-blue-600">{selectedService.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-900">${selectedService.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Notes
                  </label>
                  <textarea
                    id="special_requests"
                    rows={4}
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="Any special requests, dietary restrictions, or additional information..."
                  />
                </div>

                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={formSubmitting || !selectedService}
                    className="px-12 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ backgroundColor: themeColor }}
                  >
                    {formSubmitting ? 'Submitting Booking...' : `Submit Booking Request${selectedService ? ` - $${selectedService.price}` : ''}`}
                  </button>
                  
                  {!selectedService && (
                    <p className="text-sm text-gray-500 mt-2">
                      Please select a service package above
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking process with instant confirmation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">Your information is protected with industry-standard security</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <HeartIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-gray-600">We're committed to providing an exceptional experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{site.client_name}</h3>
            <p className="text-gray-400 mb-4">
              Creating unforgettable experiences since day one
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 {site.client_name}</span>
              <span>•</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icons
function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function CalendarIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function ShieldCheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function HeartIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}