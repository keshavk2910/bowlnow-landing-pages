import { useState } from 'react'
import Image from 'next/image'

export default function EventsTemplate({ content, site, funnel, page, sessionId, onFormSubmit, onCheckoutClick, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'conference',
    event_date: '',
    attendees: '',
    duration: '4',
    budget_range: '5000-10000',
    requirements: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'event_booking',
        funnel_name: funnel?.name,
        estimated_value: getBudgetValue(formData.budget_range)
      })
      setFormSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: 'conference',
        event_date: '',
        attendees: '',
        duration: '4',
        budget_range: '5000-10000',
        requirements: ''
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

  const getBudgetValue = (range) => {
    const ranges = {
      '1000-5000': 3000,
      '5000-10000': 7500,
      '10000-25000': 17500,
      '25000-50000': 37500,
      '50000+': 75000
    }
    return ranges[range] || 7500
  }

  // Default values
  const title = content.title || 'Professional Events'
  const heroTitle = content.hero_title || 'Exceptional Events, Flawlessly Executed'
  const heroBackground = content.hero_background || '/api/placeholder/1920/1080'
  const themeColor = site.settings?.theme_color || '#4F46E5'

  const eventTypes = content.event_types || [
    { name: 'Corporate Conferences', description: 'Professional meetings and presentations', icon: '🏢' },
    { name: 'Product Launches', description: 'Memorable brand experiences', icon: '🚀' },
    { name: 'Team Building', description: 'Strengthen workplace relationships', icon: '👥' },
    { name: 'Networking Events', description: 'Connect industry professionals', icon: '🤝' },
    { name: 'Training Seminars', description: 'Educational workshops and sessions', icon: '📚' },
    { name: 'Awards Ceremonies', description: 'Celebrate achievements in style', icon: '🏆' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            From intimate corporate meetings to large-scale conferences, we deliver professional events that exceed expectations
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="#services"
              className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{ 
                backgroundColor: themeColor,
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              Explore Our Services
            </a>
            <a
              href="#booking"
              className="inline-block px-8 py-4 text-lg font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200"
            >
              Plan Your Event
            </a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Event Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in creating impactful business events that drive results and leave lasting impressions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((eventType, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-6 text-center">{eventType.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{eventType.name}</h3>
                <p className="text-gray-600 text-center mb-6">{eventType.description}</p>
                <div className="text-center">
                  <a
                    href="#booking"
                    className="inline-block px-6 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200"
                    style={{ 
                      borderColor: themeColor,
                      color: themeColor
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = themeColor
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = themeColor
                    }}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose {site.client_name}?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">End-to-End Planning</h3>
                  <p className="text-gray-600">From concept to execution, we handle every detail of your event</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
                  <p className="text-gray-600">Experienced professionals dedicated to your event's success</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Solutions</h3>
                  <p className="text-gray-600">Tailored event experiences that align with your objectives</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">On-Time Delivery</h3>
                  <p className="text-gray-600">Reliable execution with attention to timelines and budgets</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/api/placeholder/600/400"
                alt="Professional event setup"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div id="booking" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plan Your Event
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about your vision and we'll make it a reality
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Event Request Received!</h3>
                <p className="text-xl text-gray-600 mb-4">
                  Thank you for considering {site.client_name} for your upcoming event.
                </p>
                <p className="text-gray-600">
                  Our event planning specialist will contact you within 24 hours to discuss your requirements.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
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
                      placeholder="your@company.com"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                    >
                      <option value="conference">Corporate Conference</option>
                      <option value="product_launch">Product Launch</option>
                      <option value="team_building">Team Building</option>
                      <option value="networking">Networking Event</option>
                      <option value="training">Training Seminar</option>
                      <option value="awards">Awards Ceremony</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                    />
                  </div>

                  <div>
                    <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
                      Attendees *
                    </label>
                    <input
                      type="number"
                      id="attendees"
                      required
                      min="1"
                      value={formData.attendees}
                      onChange={(e) => handleInputChange('attendees', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                      placeholder="Expected attendees"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours) *
                    </label>
                    <select
                      id="duration"
                      required
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRingColor: themeColor }}
                    >
                      <option value="2">2 hours</option>
                      <option value="4">4 hours</option>
                      <option value="8">Full day (8 hours)</option>
                      <option value="16">2 days</option>
                      <option value="24">3 days</option>
                      <option value="custom">Custom duration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range *
                  </label>
                  <select
                    id="budget_range"
                    required
                    value={formData.budget_range}
                    onChange={(e) => handleInputChange('budget_range', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                  >
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-25000">$10,000 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000+">$50,000+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Requirements & Goals
                  </label>
                  <textarea
                    id="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ focusRingColor: themeColor }}
                    placeholder="Please describe your event goals, special requirements, catering needs, AV requirements, etc."
                  />
                </div>

                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-12 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ backgroundColor: themeColor }}
                  >
                    {formSubmitting ? 'Submitting Request...' : 'Request Event Proposal'}
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
            <h3 className="text-2xl font-bold mb-4">{site.client_name}</h3>
            <p className="text-gray-400 mb-4">
              Professional event planning and management services
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
function CheckCircleIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function UsersIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
}

function CogIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClockIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}