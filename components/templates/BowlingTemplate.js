import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BowlingTemplate({
  content,
  site,
  funnel,
  page,
  sessionId,
  onFormSubmit,
  onCheckoutClick,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'birthday',
    event_date: '',
    guest_count: '',
    special_requests: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const carouselItems = content.carousel_items || [];
    if (carouselItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [content.carousel_items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'bowling_booking',
        funnel_name: funnel?.name,
        estimated_value: calculateEstimatedValue(
          formData.guest_count,
          formData.event_type
        ),
      });
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: 'birthday',
        event_date: '',
        guest_count: '',
        special_requests: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit booking request. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEstimatedValue = (guestCount, eventType) => {
    const baseRate =
      eventType === 'corporate' ? 35 : eventType === 'birthday' ? 25 : 20;
    return parseInt(guestCount) * baseRate || 0;
  };

  // Default values
  const heroTitle =
    content.hero_title || 'Family Owned and Operated Bowling Center';
  const heroSubtitle = content.hero_subtitle || 'Since 1962';
  const heroCtaText = content.hero_cta_text || 'Book Now';
  const heroCtaLink = content.hero_cta_link || '#booking';
  const heroBackground =
    content.hero_background || '/api/placeholder/1920/1080';
  const themeColor = site.settings?.theme_color || '#DC2626';

  // Default features
  const features = content.features || [
    {
      title: 'Open Bowling',
      description: 'Walk-in bowling available daily',
      icon: '🎳',
    },
    {
      title: 'Specials',
      description: 'Daily deals and special offers',
      icon: '💰',
    },
    {
      title: 'Bowling Leagues',
      description: 'Join our competitive leagues',
      icon: '🏆',
    },
    {
      title: 'Event Booking',
      description: 'Perfect for parties and events',
      icon: '🎉',
    },
  ];

  // Default carousel items
  const carouselItems = content.carousel_items || [
    {
      title: 'Summer Bowling Special',
      description: 'Beat the heat with cool savings on summer bowling packages',
      image: '/api/placeholder/400/300',
      link: '#specials',
    },
    {
      title: 'Corporate Events',
      description: 'Team building at its finest with our corporate packages',
      image: '/api/placeholder/400/300',
      link: '#events',
    },
    {
      title: 'Birthday Parties',
      description: 'Make it a strike celebration with our party packages',
      image: '/api/placeholder/400/300',
      link: '#parties',
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Header Navigation */}
      <header className='bg-white shadow-sm relative z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <h1 className='text-2xl font-bold text-gray-900'>
                  {site.client_name}
                </h1>
              </div>
            </div>
            <nav className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-8'>
                <a
                  href='#home'
                  className='text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
                >
                  Home
                </a>
                <a
                  href='#about'
                  className='text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
                >
                  About
                </a>
                <a
                  href='#services'
                  className='text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
                >
                  Services
                </a>
                <a
                  href='#events'
                  className='text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
                >
                  Events
                </a>
                <a
                  href='#contact'
                  className='text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
                >
                  Contact
                </a>
              </div>
            </nav>
            <div className='hidden md:block'>
              <a
                href={heroCtaLink}
                className='bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors'
              >
                {heroCtaText}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        id='home'
        className='relative h-96 md:h-screen flex items-center justify-center text-center text-white'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>{heroTitle}</h1>
          <p className='text-xl md:text-2xl mb-8 text-gray-200'>
            {heroSubtitle}
          </p>
          <div className='space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center'>
            <a
              href={heroCtaLink}
              className='inline-block px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 transform hover:scale-105'
              style={{
                backgroundColor: themeColor,
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {heroCtaText}
            </a>
            <a
              href='#about'
              className='inline-block px-8 py-4 text-lg font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200'
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id='services' className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              What We Offer
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              From casual bowling to competitive leagues, we have something for
              everyone
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300'
              >
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 mb-4'>{feature.description}</p>
                <a
                  href='#booking'
                  className='inline-block px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-colors duration-200'
                  style={{
                    borderColor: themeColor,
                    color: themeColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = themeColor;
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = themeColor;
                  }}
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {content.carousel_title || 'Latest News & Events'}
            </h2>
          </div>

          {/* Carousel */}
          <div className='relative'>
            <div className='overflow-hidden rounded-2xl'>
              <div
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className='w-full flex-shrink-0'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-r from-gray-50 to-white p-8 lg:p-12'>
                      <div className='space-y-6'>
                        <h3 className='text-3xl lg:text-4xl font-bold text-gray-900'>
                          {item.title}
                        </h3>
                        <p className='text-lg text-gray-600 leading-relaxed'>
                          {item.description}
                        </p>
                        <a
                          href={item.link}
                          className='inline-block px-8 py-3 text-lg font-semibold text-white rounded-lg transition-colors duration-200'
                          style={{ backgroundColor: themeColor }}
                        >
                          Learn More
                        </a>
                      </div>
                      <div className='relative h-80 lg:h-96'>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className='object-cover rounded-xl shadow-lg'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            {carouselItems.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentSlide(
                      currentSlide === 0
                        ? carouselItems.length - 1
                        : currentSlide - 1
                    )
                  }
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200'
                >
                  <ChevronLeftIcon className='h-6 w-6 text-gray-600' />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((currentSlide + 1) % carouselItems.length)
                  }
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200'
                >
                  <ChevronRightIcon className='h-6 w-6 text-gray-600' />
                </button>

                {/* Carousel Indicators */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                  {carouselItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        currentSlide === index
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id='about' className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-6'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
                {content.about_title || 'About Us'}
              </h2>
              <p className='text-lg text-gray-600 leading-relaxed'>
                {content.about_text ||
                  'Opened in 1962, we are a family-owned bowling center dedicated to providing fun for all ages. Our commitment to excellence and community has made us a local favorite for over 60 years.'}
              </p>
              <div className='grid grid-cols-2 gap-6'>
                <div className='text-center'>
                  <div
                    className='text-3xl font-bold'
                    style={{ color: themeColor }}
                  >
                    60+
                  </div>
                  <div className='text-gray-600'>Years of Service</div>
                </div>
                <div className='text-center'>
                  <div
                    className='text-3xl font-bold'
                    style={{ color: themeColor }}
                  >
                    24
                  </div>
                  <div className='text-gray-600'>Bowling Lanes</div>
                </div>
              </div>
            </div>
            <div className='relative h-96'>
              <Image
                src={content.about_image || '/api/placeholder/600/400'}
                alt='About us'
                fill
                className='object-cover rounded-xl shadow-lg'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div id='booking' className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Book Your Event
            </h2>
            <p className='text-lg text-gray-600'>
              Ready to roll? Book your bowling event today!
            </p>
          </div>

          <div className='bg-gray-50 rounded-2xl p-8 shadow-xl'>
            {formSubmitted ? (
              <div className='text-center py-12'>
                <div className='text-6xl mb-6'>🎳</div>
                <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                  Booking Request Received!
                </h3>
                <p className='text-xl text-gray-600 mb-4'>
                  Thank you for choosing {site.client_name}!
                </p>
                <p className='text-gray-600'>
                  We&apos;ll contact you within 24 hours to confirm your booking
                  details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Your Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      placeholder='Your full name'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      placeholder='your@email.com'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      placeholder='(555) 123-4567'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='event_type'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Event Type *
                    </label>
                    <select
                      id='event_type'
                      required
                      value={formData.event_type}
                      onChange={(e) =>
                        handleInputChange('event_type', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    >
                      <option value='birthday'>Birthday Party</option>
                      <option value='corporate'>Corporate Event</option>
                      <option value='league'>League Bowling</option>
                      <option value='open'>Open Bowling</option>
                      <option value='other'>Other Event</option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label
                      htmlFor='event_date'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Preferred Date *
                    </label>
                    <input
                      type='date'
                      id='event_date'
                      required
                      value={formData.event_date}
                      onChange={(e) =>
                        handleInputChange('event_date', e.target.value)
                      }
                      min={new Date().toISOString().split('T')[0]}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='guest_count'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Number of People *
                    </label>
                    <input
                      type='number'
                      id='guest_count'
                      required
                      min='1'
                      value={formData.guest_count}
                      onChange={(e) =>
                        handleInputChange('guest_count', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                      placeholder='How many bowlers?'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='special_requests'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Special Requests
                  </label>
                  <textarea
                    id='special_requests'
                    rows={4}
                    value={formData.special_requests}
                    onChange={(e) =>
                      handleInputChange('special_requests', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    placeholder='Any special requests, food preferences, or additional services needed?'
                  />
                </div>

                {formData.guest_count && (
                  <div className='bg-red-50 rounded-xl p-4 border-2 border-red-200'>
                    <div className='text-center'>
                      <p className='text-sm text-red-700 mb-2'>
                        Estimated Cost
                      </p>
                      <p className='text-2xl font-bold text-red-900'>
                        $
                        {calculateEstimatedValue(
                          formData.guest_count,
                          formData.event_type
                        )}
                      </p>
                      <p className='text-xs text-red-600'>
                        *Final pricing may vary based on packages selected
                      </p>
                    </div>
                  </div>
                )}

                <div className='text-center pt-4'>
                  <button
                    type='submit'
                    disabled={formSubmitting}
                    className='px-12 py-4 text-xl font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    style={{ backgroundColor: themeColor }}
                  >
                    {formSubmitting ? 'Submitting...' : 'Book Your Event! 🎳'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id='contact' className='py-16 bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              {content.contact_title || 'Visit Us Today'}
            </h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Contact Info */}
            <div className='text-center lg:text-left'>
              <h3 className='text-xl font-semibold mb-4'>Contact Info</h3>
              {content.phone && (
                <div className='flex items-center justify-center lg:justify-start mb-3'>
                  <PhoneIcon className='h-5 w-5 text-red-400 mr-3' />
                  <span>{content.phone}</span>
                </div>
              )}
              {content.address && (
                <div className='flex items-start justify-center lg:justify-start mb-3'>
                  <MapPinIcon className='h-5 w-5 text-red-400 mr-3 mt-1' />
                  <span className='whitespace-pre-line'>{content.address}</span>
                </div>
              )}
            </div>

            {/* Hours */}
            <div className='text-center lg:text-left'>
              <h3 className='text-xl font-semibold mb-4'>Hours</h3>
              <div className='text-gray-300 whitespace-pre-line'>
                {content.hours ||
                  'Monday - Thursday: 10am - 10pm\nFriday - Saturday: 10am - 12am\nSunday: 12pm - 10pm'}
              </div>
            </div>

            {/* Social Links */}
            <div className='text-center lg:text-left'>
              <h3 className='text-xl font-semibold mb-4'>Follow Us</h3>
              <div className='flex justify-center lg:justify-start space-x-4'>
                {content.social_links?.facebook && (
                  <a
                    href={content.social_links.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors'
                  >
                    <span className='text-white'>f</span>
                  </a>
                )}
                {content.social_links?.instagram && (
                  <a
                    href={content.social_links.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors'
                  >
                    <span className='text-white'>📷</span>
                  </a>
                )}
                {content.social_links?.twitter && (
                  <a
                    href={content.social_links.twitter}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors'
                  >
                    <span className='text-white'>🐦</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='border-t border-gray-700 mt-12 pt-8 text-center'>
            <p className='text-gray-400'>
              © 2024 {site.client_name}. All rights reserved. | Family owned and
              operated since 1962
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function ChevronLeftIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 19l-7-7 7-7'
      />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 5l7 7-7 7'
      />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
      />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
      />
    </svg>
  );
}
