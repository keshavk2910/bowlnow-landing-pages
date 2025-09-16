import React, { useRef } from 'react';
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
    align-items: flex-end;
    justify-content: center;
    height: 600px;
    border-radius: 2.5rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 12px 48px 0 rgba(0,0,0,0.22);
    background: #18181b;
    transition: box-shadow 0.4s cubic-bezier(.4,0,.2,1);
  }
  .slider2-modern-slide .slider2-modern-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    z-index: 0;
    transition: filter 0.4s cubic-bezier(.4,0,.2,1);
  }
  .slider2-modern-slide .slider2-modern-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,rgba(0,0,0,0.10) 0%,rgba(0,0,0,0.65) 100%);
    z-index: 1;
    pointer-events: none;
  }
  .slider2-modern-content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 3.5rem 2.5rem 2.5rem 2.5rem;
    text-align: center;
    color: #fff;
    opacity: 0;
    transform: translateY(32px) scale(0.97);
    transition: opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1);
    will-change: opacity, transform;
    pointer-events: none;
  }
  .swiper-slide-active .slider2-modern-content {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
    transition-delay: 0.1s;
  }
  .slider2-modern-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 1rem 2.75rem;
    border-radius: 9999px;
    border: 2px solid #fff;
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-weight: 600;
    font-size: 1.15rem;
    letter-spacing: 0.01em;
    transition: background 0.2s, color 0.2s, border 0.2s;
    text-decoration: none;
    backdrop-filter: blur(2px);
  }
  .slider2-modern-btn:hover {
    background: #fff;
    color: #18181b;
    border-color: #fff;
  }
  .slider2-modern-nav {
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    background: rgba(24,24,27,0.7);
    border: 2px solid #fff;
    border-radius: 9999px;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.18);
  }
  .slider2-modern-nav:hover {
    background: #fff;
    border-color: #fff;
  }
  .slider2-modern-nav svg {
    stroke: #fff;
    transition: stroke 0.2s;
  }
  .slider2-modern-nav:hover svg {
    stroke: #18181b;
  }
  .slider2-modern-pagination {
    position: absolute;
    left: 50%;
    bottom: 2.5rem;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    gap: 0.75rem;
  }
  .slider2-modern-pagination .swiper-pagination-bullet {
    width: 16px;
    height: 16px;
    background: #fff;
    opacity: 0.4;
    border-radius: 9999px;
    transition: opacity 0.2s, background 0.2s;
  }
  .slider2-modern-pagination .swiper-pagination-bullet-active {
    opacity: 1;
    background: #fff;
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
    <section className='w-full mx-auto px-2 sm:px-4 lg:px-12 py-20 bg-black min-h-[90vh] flex flex-col justify-center'>
      <h3 className='text-4xl md:text-6xl font-bold text-white mb-12 text-center tracking-tight drop-shadow-lg'>
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
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
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
            paddingBottom: '120px',
            paddingTop: '40px',
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
              <div
                className={`slider2-modern-slide group border-2 border-white  `}
              >
                <div
                  className='slider2-modern-bg'
                  style={{
                    backgroundColor: themeColor || '#222',
                    backgroundImage: `url(${slide.image || slide.url})`,
                  }}
                />
                <div className='slider2-modern-overlay' />
                <div className='slider2-modern-content'>
                  {slide.title && (
                    <h4 className='text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg tracking-tight'>
                      {slide.title}
                    </h4>
                  )}
                  {slide.description && (
                    <p className='text-white text-lg md:text-xl font-medium mb-5 drop-shadow-md'>
                      {slide.description}
                    </p>
                  )}
                  {slide.buttonText && (
                    <a href={slide.buttonLink} className='slider2-modern-btn'>
                      {slide.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* Navigation */}
          <button
            ref={prevRef}
            type='button'
            className='slider2-modern-nav left-2 md:left-8'
            style={{ left: 0 }}
            aria-label='Previous Slide'
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
          {/* Pagination */}
          <div className='slider2-modern-pagination' />
        </Swiper>
      </div>
    </section>
  );
};

export default Slider2Section;
