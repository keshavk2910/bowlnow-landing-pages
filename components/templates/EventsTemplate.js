import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';
import BookYourEventLeft from '../TemplateComponents/BookYourEventLeft';
import Slider2Section from '../TemplateComponents/sliders/Slider2Section';
import Footer from '../TemplateComponents/Footer';
import Header2 from '../TemplateComponents/Header2';
import ContactForm from '../ContactForm';
export default function EventsTemplate({
  content = {},
  site = {},
  funnel = {},
  page = {},
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

  // Destructure with safe defaults to prevent undefined errors
  var {
    header = {},
    features_slider = {},
    events_slider = {},
    main_cta = {},
    contact_form = {},
    book_your_event_left = {},
  } = content;
  // Default values with proper null checking
  const heroTitle = header.hero_title || 'Welcome to Our Business';
  const heroSubtitle = header.hero_subtitle || 'Experience excellence with our premium services';
  const ctaText = main_cta.cta_text || 'Get Started';
  const ctaLink = main_cta.cta_link || '#contact';
  const heroBackground = header.hero_background || '/api/placeholder/1920/1080';
  const themeColor = site?.settings?.theme_color || '#4F46E5';

  // Calculate hero minHeight: 100vh - headerHeight
  const heroMinHeight =
    headerHeight > 0 ? `calc(90vh - ${headerHeight}px)` : 'calc(100vh - 80px)'; // fallback

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <Header2 ref={headerRef} header={header} themeColor={themeColor} site={site} />
      {header.enabled && (
        <>
        {/* Hero Section - Corporate Events Style */}
          <div className='relative flex items-center justify-between text-white min-h-[60vh] bg-black'>
            {/* Full Width Grid Container */}
            <div className='w-full'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[40vh] w-full'>
                
                {/* Left Side - Text Content on Black Background */}
                <div className='text-left flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16'>
                  <div className='max-w-2xl'>
                    <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight'>
                      {heroTitle || 'Corporate Events'}
                    </h1>
                    
                    {heroSubtitle && (
                      <p className='text-lg md:text-xl mb-8 text-gray-300 leading-relaxed'>
                        {heroSubtitle}
                      </p>
                    )}
                    
                    {/* CTA Button */}
                    <div>
                      <a
                        href={ctaLink}
                        className='inline-block px-8 py-4 text-base font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl'
                        style={{
                          backgroundColor: '#DC2626',
                          color: 'white',
                          border: '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#B91C1C';
                          e.target.style.borderColor = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#DC2626';
                          e.target.style.borderColor = 'transparent';
                        }}
                      >
                        {ctaText}
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Background Image (50% width) */}
                <div 
                  className='w-full h-full min-h-[60vh] lg:min-h-[80vh] bg-cover bg-center bg-no-repeat'
                  style={{
                    backgroundImage: `url(${heroBackground})`,
                  }}
                >
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className='absolute top-16 right-16 hidden xl:block'>
              <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
            </div>
            
            <div className='absolute bottom-20 left-16 hidden xl:block'>
              <div className='w-2 h-2 bg-gray-400 opacity-40 rounded-full'></div>
            </div>

            {/* Bottom fade effect */}
            <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent'></div>
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
      {book_your_event_left.enabled && (
        <BookYourEventLeft
          content={book_your_event_left}
          themeColor={themeColor}
        />
      )}
      {events_slider.enabled && (
        <Slider2Section content={events_slider} themeColor={themeColor} />
      )}

      {/* Contact Form Section */}
      {contact_form.enabled && (
        <div id='form'>
          <ContactForm
            content={contact_form}
            themeColor={themeColor}
            siteId={site?.id}
            pageId={page?.id}
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
