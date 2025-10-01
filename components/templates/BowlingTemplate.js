import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Header2 from '../TemplateComponents/Header2';
import BookYourEventHalf from '../TemplateComponents/BookYourEventHalf';
import BookYourEventLeft from '../TemplateComponents/BookYourEventLeft';
import CardGrid from '../TemplateComponents/CardGrid';
import TableSection from '../TemplateComponents/TableSection';
import Review from '../TemplateComponents/Review';
import FAQAccordion from '../TemplateComponents/faq';
import Footer from '../TemplateComponents/Footer';
import ContactForm from '../ContactForm';
export default function BowlingTemplate({
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
    main_cta = {},
    contact_form = {},
    book_your_event_half = {},
    book_your_event_left = {},
    card_grid = {},
    table_section = {},
    review_section = {},
    faq_section = {},
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
      {/* Header - Required */}
      <Header2 ref={headerRef} header={header} themeColor={themeColor} site={site} />

      {/* Hero Section with Background Image */}
      {header.enabled !== false && (
        <section
          className='relative flex items-center justify-center text-white'
          style={{
            minHeight: heroMinHeight,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
              {heroTitle}
            </h1>
            <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
              {heroSubtitle}
            </p>
            {main_cta.enabled !== false && (
              <a
                href={ctaLink}
                className='inline-block px-8 py-4 text-lg font-semibold text-white rounded-full hover:opacity-90 transition-opacity'
                style={{ backgroundColor: themeColor }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Book Your Event Half - Optional */}
      {book_your_event_half.enabled && (
        <BookYourEventHalf
          content={book_your_event_half}
          themeColor={themeColor}
        />
      )}

      {/* Card Grid - Optional */}
      {card_grid.enabled && (
        <CardGrid
          content={card_grid}
          themeColor={themeColor}
        />
      )}

      {/* Book Your Event Left - Optional */}
      {book_your_event_left.enabled && (
        <BookYourEventLeft
          content={book_your_event_left}
          themeColor={themeColor}
        />
      )}

      {/* Table Section - Optional */}
      {table_section.enabled && (
        <TableSection
          content={table_section}
          themeColor={themeColor}
        />
      )}

      

      {/* FAQ Section - Optional */}
      {faq_section.enabled && (
        <FAQAccordion
          content={faq_section}
          themeColor={themeColor}
        />
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

      {/* Review Section - Optional */}
      {review_section.enabled && (
        <Review
          content={review_section}
          themeColor={themeColor}
        />
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
