import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Modern Center Stage 3D Slider Styles
const sliderStyles = `
  .slider2-modern-slide {
    display: flex;
    flex-direction: column;
    height: auto;
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 60px 0 rgba(0,0,0,0.5);
    transition: box-shadow 0.4s cubic-bezier(.4,0,.2,1), transform 0.4s cubic-bezier(.4,0,.2,1);
  }
  .swiper-slide-active .slider2-modern-slide {
    box-shadow: 0 25px 80px 0 rgba(0,0,0,0.7);
  }
  .slider2-modern-slide .slider2-modern-bg {
    position: relative;
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center;
    transition: transform 0.4s cubic-bezier(.4,0,.2,1);
  }
  @media (min-width: 640px) {
    .slider2-modern-slide .slider2-modern-bg {
      height: 500px;
    }
  }
  @media (min-width: 1024px) {
    .slider2-modern-slide .slider2-modern-bg {
      height: 600px;
    }
  }
  .slider2-modern-slide .slider2-modern-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.3) 100%);
    pointer-events: none;
  }
  .slider2-modern-content {
    position: relative;
    width: 100%;
    padding: 2rem 1.5rem;
    text-align: center;
    color: #fff;
    opacity: 1;
    transition: opacity 0.4s cubic-bezier(.4,0,.2,1);
  }
  @media (min-width: 640px) {
    .slider2-modern-content {
      padding: 2.5rem 2rem;
    }
  }
  @media (min-width: 1024px) {
    .slider2-modern-content {
      padding: 3rem 2.5rem;
    }
  }
  .slider2-modern-content h4 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #fff;
    line-height: 1.2;
  }
  @media (min-width: 640px) {
    .slider2-modern-content h4 {
      font-size: 2.25rem;
      margin-bottom: 1.25rem;
    }
  }
  @media (min-width: 1024px) {
    .slider2-modern-content h4 {
      font-size: 2.75rem;
      margin-bottom: 1.5rem;
    }
  }
  .slider2-description h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  .slider2-description h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  .slider2-description p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }
  .slider2-description ul,
  .slider2-description ol {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
    color: rgba(255, 255, 255, 0.85);
    text-align: left;
  }
  .slider2-description li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  .slider2-description strong,
  .slider2-description b {
    font-weight: 600;
    color: #fff;
  }
  .slider2-modern-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.875rem 2.5rem;
    border-radius: 9999px;
    border: 2px solid #fff;
    background: transparent;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.01em;
    transition: background 0.3s, transform 0.2s;
    text-decoration: none;
  }
  .slider2-modern-btn:hover {
    background: #fff;
    color: #000;
    transform: scale(1.05);
  }
  .slider2-modern-nav {
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 9999px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 4px 20px 0 rgba(0,0,0,0.3);
    backdrop-filter: blur(8px);
  }
  .slider2-modern-nav:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 30px 0 rgba(255,255,255,0.3);
  }
  .slider2-modern-nav svg {
    stroke: #fff;
    transition: stroke 0.3s;
  }
  .slider2-modern-nav:hover svg {
    stroke: #000;
  }
  /* Hide navigation on mobile */
  @media (max-width: 900px) {
    .slider2-modern-nav {
      display: none !important;
    }
  }
  .slider2-modern-pagination {
    position: absolute;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    gap: 0.75rem;
  }
  .slider2-modern-pagination .swiper-pagination-bullet {
    width: 14px;
    height: 14px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
    border-radius: 9999px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
    cursor: pointer;
  }
  .slider2-modern-pagination .swiper-pagination-bullet:hover {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.6);
  }
  .slider2-modern-pagination .swiper-pagination-bullet-active {
    background: #fff;
    border-color: #fff;
    width: 32px;
    border-radius: 7px;
  }
  /* Swipe icon styles */
  .slider2-modern-swipe-icon {
    display: none;
    position: absolute;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    z-index: 20;
    opacity: 0.85;
    pointer-events: none;
    animation: slider2-swipe-bounce 1.6s infinite;
  }
  @media (max-width: 900px) {
    .slider2-modern-swipe-icon {
      display: block;
    }
  }
  @keyframes slider2-swipe-bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(12px); }
  }
`;

if (
  typeof window !== 'undefined' &&
  !document.getElementById('slider2-modern-style')
) {
  const style = document.createElement('style');
  style.id = 'slider2-modern-style';
  style.innerHTML = sliderStyles;
  document.head.appendChild(style);
}

const DEFAULT_SLIDES = [
  {
    title: 'Birthday Parties',
    description:
      'Celebrate your special day with friends and family. Make your birthday unforgettable with our party packages.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    buttonLink: '#birthday-parties',
    buttonText: 'Learn More',
  },
  {
    title: 'Corporate Events',
    description:
      'Perfect venue for team building and corporate celebrations. Create memorable experiences for your team.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    buttonLink: '#company-events',
    buttonText: 'Learn More',
  },
  {
    title: 'Youth Parties',
    description:
      'Fun and safe environment for kids and teens to celebrate and enjoy.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    buttonLink: '#youth-parties',
    buttonText: 'Learn More',
  },
  {
    title: 'Fundraisers',
    description:
      'Host your next fundraiser with us and make a difference in your community.',
    image:
      'https://partners.bowlnow.com/wp-content/uploads/2025/04/t4200x2520-e1744691387553.webp',
    buttonLink: '#fundraisers',
    buttonText: 'Learn More',
  },
];

const Slider2Section = ({ content, themeColor }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile (width <= 900px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slides = content?.slider2?.length ? content.slider2 : DEFAULT_SLIDES;

  // Swiper uses 0-based index, so slide 2 is index 1
  const initialSlide = 1;

  // If not enough slides, duplicate slides until at least 3
  let displaySlides = slides;
  if (slides.length < 3) {
    const times = Math.ceil(3 / slides.length);
    displaySlides = Array(times).fill(slides).flat().slice(0, 3);
  }

  // --- Manual loop: repeat slides 4x on each side to avoid blank/black slides ---
  // This creates 4 copies before and 4 after the original slides
  let loopedSlides = displaySlides;
  if (slides.length < 6) {
    const sideCopies = 2;
    loopedSlides = [
      ...Array(sideCopies).fill(displaySlides).flat(),
      ...displaySlides,
      ...Array(sideCopies).fill(displaySlides).flat(),
    ];
  } else {
    loopedSlides = displaySlides;
  }

  return (
    <section className='w-full mx-auto px-2 sm:px-4 lg:px-12 py-16 md:py-20 bg-black min-h-[90vh] flex flex-col justify-center slider2'>
      <h3 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 md:mb-12 text-center tracking-tight'>
        {content?.slider2_title || 'Parties & Events'}
      </h3>
      <div className='w-full relative flex flex-col items-center'>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect='coverflow'
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 360,
            modifier: 1.2,
            slideShadows: false,
          }}
          slidesPerView={3}
          centeredSlidesBounds={true}
          roundLengths={true}
          centeredSlides={true}
          loop={true}
          initialSlide={initialSlide}
          navigation={
            !isMobile
              ? {
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }
              : false
          }
          onInit={(swiper) => {
            if (!isMobile) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          pagination={{
            el: '.slider2-modern-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className='slider2-modern-swiper w-full max-w-8xl'
          style={{
            paddingBottom: '80px',
            paddingTop: '20px',
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              coverflowEffect: { depth: 120, modifier: 2.2 },
            },
            640: {
              slidesPerView: 1,
              coverflowEffect: { depth: 180, modifier: 2.7 },
            },
            900: {
              slidesPerView: 2,
              coverflowEffect: { depth: 220, modifier: 1 },
            },
            1200: {
              slidesPerView: 3,
              coverflowEffect: { depth: 360, modifier: 1.2 },
            },
          }}
        >
          {loopedSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className='slider2-modern-slide'>
                {/* Image Section */}
                <div
                  className='slider2-modern-bg'
                  style={{
                    backgroundColor: themeColor || '#222',
                    backgroundImage: `url(${slide.image || slide.url})`,
                  }}
                >
                  <div className='slider2-modern-overlay' />
                </div>

                {/* Text Content Section - Below Image */}
                <div className='slider2-modern-content'>
                  {slide.title && (
                    <h4>{slide.title}</h4>
                  )}
                  {slide.description && (
                    <div
                      className='slider2-description'
                      dangerouslySetInnerHTML={{ __html: slide.description }}
                    />
                  )}
                  {slide.buttonText && (
                    <a
                      href={slide.buttonLink}
                      className='slider2-modern-btn'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {slide.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation (desktop only, hidden on mobile via CSS) */}
          <button
            ref={prevRef}
            type='button'
            className='slider2-modern-nav left-2 md:left-8'
            style={{ left: 0 }}
            aria-label='Previous Slide'
            tabIndex={isMobile ? -1 : 0}
          >
            <svg
              width='36'
              height='36'
              fill='#ffffff'
              strokeWidth='2.5'
              viewBox='0 0 24 24'
            >
              <path d='M15 19l-7-7 7-7' stroke='currentColor' />
            </svg>
          </button>
          <button
            ref={nextRef}
            type='button'
            className='slider2-modern-nav right-2 md:right-8'
            style={{ right: 0 }}
            aria-label='Next Slide'
            tabIndex={isMobile ? -1 : 0}
          >
            <svg
              width='36'
              height='36'
              fill='#ffffff'
              strokeWidth='2.5'
              viewBox='0 0 24 24'
            >
              <path d='M9 5l7 7-7 7' stroke='currentColor' />
            </svg>
          </button>
          {/* Swipe Icon (mobile only, finger swiping) */}
          <div className='slider2-modern-swipe-icon'>
            {/* Finger swipe icon SVG */}
            <svg width='54' height='54' viewBox='0 0 54 54' fill='none'>
              <g>
                {/* Hand palm */}
                <path
                  d='M27 38V18.5C27 16.0147 29.0147 14 31.5 14C33.9853 14 36 16.0147 36 18.5V32'
                  stroke='#fff'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                {/* Index finger */}
                <path
                  d='M27 38V13.5C27 11.0147 24.9853 9 22.5 9C20.0147 9 18 11.0147 18 13.5V32'
                  stroke='#fff'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                {/* Thumb */}
                <path
                  d='M27 38V22C27 20.3431 25.6569 19 24 19C22.3431 19 21 20.3431 21 22V32'
                  stroke='#fff'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                {/* Palm base */}
                <ellipse
                  cx='27'
                  cy='42'
                  rx='10'
                  ry='6'
                  fill='#fff'
                  opacity='0.15'
                />
                {/* Swipe arrow */}
                <path
                  d='M27 46c0 0 0-2 0-4'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  opacity='0.7'
                />
                <path
                  d='M23 44l4 4 4-4'
                  stroke='#fff'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.7'
                />
              </g>
            </svg>
          </div>
          {/* Pagination */}
          <div className='slider2-modern-pagination' />
        </Swiper>
      </div>
    </section>
  );
};

export default Slider2Section;