import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider1Generator from '../TemplateComponents/sliders/Slider1-Generator';
import BookYourEventHalf from '../TemplateComponents/BookYourEventHalf';
import Slider2Section from '../TemplateComponents/sliders/Slider2Section';
import Footer from '../TemplateComponents/Footer';
import Header from '../TemplateComponents/Header';
import ContactForm from '../ContactForm';
import TableSection from '../TemplateComponents/TableSection';
import PromoBannerSection from '../TemplateComponents/PromoBannerSection';
import BookYourEventLeft from '../TemplateComponents/BookYourEventLeft';
import CardGrid from '../TemplateComponents/CardGrid';
import RegisterNowSection from '../TemplateComponents/RegisterNowSection';
import Review from '../TemplateComponents/Review';
export default function LandingPageTemplate({
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
    book_your_event_half = {},
    table_section = {},
    promo_banner = {},
    book_your_event_left = {},
    card_grid = {},
    register_now_section = {},
    review_section = {},
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
      <Header ref={headerRef} header={header} themeColor={themeColor} site={site} />
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

      {/* Book Your Event Half - After Features Slider */}
      {book_your_event_half.enabled && (
        <BookYourEventHalf
          content={book_your_event_half}
          themeColor={themeColor}
        />
      )}

      

      {/* Table Section */}
      {table_section.enabled && (
        <TableSection content={table_section} themeColor={themeColor} />
      )}

      {/* Promo Banner Section */}
      {promo_banner.enabled && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15'>
          <PromoBannerSection content={promo_banner} themeColor={themeColor} />
        </section>
      )}

      {/* Book Your Event Left Section */}
      {book_your_event_left.enabled && (
        <BookYourEventLeft content={book_your_event_left} themeColor={themeColor} />
      )}

      {/* Card Grid Section */}
      {card_grid.enabled && (
        <CardGrid content={card_grid} themeColor={themeColor} />
      )}

      {/* Register Now Section */}
      {register_now_section.enabled && (
        <RegisterNowSection content={register_now_section} themeColor={themeColor} />
      )}

      {events_slider.enabled && (
        <Slider2Section content={events_slider} themeColor={themeColor} />
      )}

      {/* Review Section */}
      {review_section.enabled && (
        <Review content={review_section} themeColor={themeColor} />
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
