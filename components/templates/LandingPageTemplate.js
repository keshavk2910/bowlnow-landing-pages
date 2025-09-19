import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';
import BookYourEventHalf from '../TemplateComponents/BookYourEventHalf';
import Slider2Section from '../TemplateComponents/sliders/Slider2Section';
import Footer from '../TemplateComponents/Footer';
import ContactForm from '../ContactForm';
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

  var {
    header,
    features_slider,
    events_slider,
    main_cta,
    contact_form,
    book_your_event,
  } = content;
  // Default values
  const heroTitle = header.hero_title || 'Welcome to Our Business';

  const heroSubtitle =
    header?.hero_subtitle || 'Experience excellence with our premium services';
  const ctaText = main_cta?.cta_text || 'Get Started';
  const ctaLink = main_cta?.cta_link || '#contact';
  const heroBackground =
    header?.hero_background || '/api/placeholder/1920/1080';

  const themeColor = site.settings?.theme_color || '#4F46E5';

  // Calculate hero minHeight: 100vh - headerHeight
  const heroMinHeight =
    headerHeight > 0 ? `calc(90vh - ${headerHeight}px)` : 'calc(100vh - 80px)'; // fallback

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
                  site.logo_url ||
                  'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png'
                }
                alt='BowlNow Logo'
                className='w-[99px] h-[80px]'
              />
            </div>
            <div className=''>
              <a
                href={header.header_cta_link || '#form'}
                className='text-white px-6 py-2 rounded-full font-semibold'
                target='_blank'
                style={{
                  backgroundColor: themeColor,
                }}
              >
                {header.header_cta_text || 'Book an Event'}
              </a>
            </div>
          </div>
        </div>
      </header>
      {header.enabled && (
        <>
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
        </>
      )}

      {/* Features Section */}
      {features_slider.enabled && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
          <h3 className='text-3xl md:text-5xl font-bold text-black mb-4'>
            {features_slider.slider_1_title || 'Our Features'}
          </h3>
        </section>
      )}
      {features_slider.enabled && (
        <Slider1Generator content={features_slider} themeColor={themeColor} />
      )}
      {book_your_event.enabled && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
          <BookYourEventHalf
            content={book_your_event}
            themeColor={themeColor}
          />
        </section>
      )}
      {events_slider.enabled && (
        <Slider2Section content={events_slider} themeColor={themeColor} />
      )}

      {/* Contact Form Section */}
      {contact_form?.enabled && (
        <div id='form'>
          <ContactForm
            content={contact_form}
            themeColor={themeColor}
            siteId={site.id}
            pageId={page.id}
            sessionId={sessionId}
          />
        </div>
      )}

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
