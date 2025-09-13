import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';
import BookYourEventHalf from '../TemplateComponents/BookYourEventHalf';
import Slider2Section from '../TemplateComponents/sliders/Slider2Section';
import Footer from '../TemplateComponents/Footer';
export default function LandingPageTemplate({
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
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Ref and state for header height
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await onFormSubmit({
        ...formData,
        form_type: 'contact_form',
        funnel_name: funnel?.name,
      });
      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Default values
  const heroTitle = content.hero_title || 'Welcome to Our Business';
  const heroSubtitle =
    content.hero_subtitle || 'Experience excellence with our premium services';
  const ctaText = content.cta_text || 'Get Started';
  const ctaLink = content.cta_link || '#contact';
  const heroBackground =
    content.hero_background || '/api/placeholder/1920/1080';

  const themeColor = site.settings?.theme_color || '#4F46E5';

  // Calculate hero minHeight: 100vh - headerHeight
  const heroMinHeight =
    headerHeight > 0 ? `calc(100vh - ${headerHeight}px)` : 'calc(100vh - 80px)'; // fallback

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header
        ref={headerRef}
        className='bg-black shadow-sm sticky top-0 z-50 py-4 border-b-[0.5px] border-white'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex-shrink-0'>
              <img
                src={
                  site.logo ||
                  'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png'
                }
                alt='BowlNow Logo'
                className='w-[99px] h-[80px]'
              />
            </div>
            <div className='hidden md:block'>
              <button
                className={`text-white px-6 py-2 rounded-full font-semibold`}
                style={{
                  backgroundColor: themeColor,
                }}
              >
                Book an Event
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className='relative flex flex-col justify-center text-white'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: heroMinHeight,
        }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 text-white'>
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className='text-xl md:text-2xl mb-8 text-white'>
                {heroSubtitle}
              </p>
            )}
            <div className='space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-start'>
              <a
                href={ctaLink}
                className='inline-block px-8 py-3 text-lg font-semibold rounded-full transition-colors duration-200 text-white'
                style={{
                  backgroundColor: themeColor,
                  color: 'white',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#3730A3')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = themeColor)
                }
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
          <div className='animate-bounce'>
            <ChevronDownIcon className='h-6 w-6' />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
        <h3 className='text-3xl md:text-5xl font-bold text-black mb-4'>
          Our Features
        </h3>
      </section>
      <Slider1Generator content={content} themeColor={themeColor} />
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
        <BookYourEventHalf content={content} themeColor={themeColor} />
      </section>
      <Slider2Section content={content} themeColor={themeColor} />

      {/* Contact Form Section */}
      <div id='contact' className='py-16 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Get In Touch
            </h2>
            <p className='text-lg text-gray-600'>
              Ready to get started? Contact us today for a free consultation.
            </p>
          </div>

          <div className='bg-gray-50 rounded-lg p-8'>
            {formSubmitted ? (
              <div className='text-center py-8'>
                <div className='text-6xl mb-4'>✅</div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  Thank You!
                </h3>
                <p className='text-gray-600'>
                  We've received your message and will get back to you shortly.
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
                      Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      required
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      style={{ focusRingColor: themeColor }}
                      placeholder='Your full name'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Email *
                    </label>
                    <input
                      type='email'
                      id='email'
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50'
                      style={{ focusRingColor: themeColor }}
                      placeholder='your@email.com'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50'
                    style={{ focusRingColor: themeColor }}
                    placeholder='(555) 123-4567'
                  />
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange('message', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50'
                    style={{ focusRingColor: themeColor }}
                    placeholder='Tell us about your needs...'
                  />
                </div>

                <div className='text-center'>
                  <button
                    type='submit'
                    disabled={formSubmitting}
                    className='px-8 py-3 text-lg font-semibold text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    style={{ backgroundColor: themeColor }}
                    onMouseEnter={(e) =>
                      !formSubmitting &&
                      (e.target.style.backgroundColor = '#3730A3')
                    }
                    onMouseLeave={(e) =>
                      !formSubmitting &&
                      (e.target.style.backgroundColor = themeColor)
                    }
                  >
                    {formSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer content={content} site={site} themeColor={themeColor} />
    </div>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 14l-7 7m0 0l-7-7m7 7V3'
      />
    </svg>
  );
}
