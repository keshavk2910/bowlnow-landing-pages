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

// Review Slider Styles - Compact centered design
const reviewSliderStyles = `
  .review-modern-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 350px;
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 32px 0 rgba(0,0,0,0.15);
    transition: box-shadow 0.4s cubic-bezier(.4,0,.2,1);
    margin: 0 auto;
    max-width: 700px;
  }
  @media (max-width: 768px) {
    .review-modern-slide {
      min-height: 300px;
      border-radius: 1rem;
      max-width: 90%;
    }
  }
  @media (max-width: 480px) {
    .review-modern-slide {
      min-height: 280px;
      border-radius: 0.75rem;
    }
  }
  .review-modern-content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 2.5rem 2rem;
    text-align: center;
    color: #fff;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }
  @media (max-width: 768px) {
    .review-modern-content {
      padding: 2rem 1.5rem;
    }
  }
  @media (max-width: 480px) {
    .review-modern-content {
      padding: 1.5rem 1rem;
    }
  }
  .swiper-slide-active .review-modern-content {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.1s;
  }
  .review-modern-nav {
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.95);
    border: 2px solid rgba(0,0,0,0.1);
    border-radius: 9999px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.12);
  }
  .review-modern-nav:hover {
    background: #fff;
    border-color: rgba(0,0,0,0.2);
    transform: translateY(-50%) scale(1.05);
  }
  .review-modern-nav svg {
    stroke: #18181b;
    transition: stroke 0.2s;
  }
  @media (max-width: 768px) {
    .review-modern-nav {
      display: none !important;
    }
  }
  .review-modern-pagination.swiper-pagination-horizontal {
    position: absolute;
    left: 50% !important;
    bottom: 1.5rem;
    transform: translateX(-50%) !important;
    z-index: 10;
    display: flex !important;
    gap: 0.5rem;
    justify-content: center !important;
    align-items: center !important;
    width: auto !important;
    text-align: center !important;
  }
  .review-modern-pagination {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  .review-modern-pagination .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    opacity: 0.35;
    border-radius: 9999px;
    transition: all 0.3s ease;
    margin: 0 4px !important;
  }
  .review-modern-pagination .swiper-pagination-bullet-active {
    opacity: 1;
    width: 24px;
  }
  .review-modern-swipe-icon {
    display: none;
    position: absolute;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    z-index: 20;
    opacity: 0.85;
    pointer-events: none;
    animation: review-swipe-bounce 1.6s infinite;
  }
  @media (max-width: 900px) {
    .review-modern-swipe-icon {
      display: block;
    }
  }
  @keyframes review-swipe-bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(12px); }
  }
`;

if (
  typeof window !== 'undefined' &&
  !document.getElementById('review-modern-style')
) {
  const style = document.createElement('style');
  style.id = 'review-modern-style';
  style.innerHTML = reviewSliderStyles;
  document.head.appendChild(style);
}

export default function Review({ content = {}, themeColor = '#4F46E5', section = {} }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract data from content with proper fallbacks
  const title = content?.title || '';
  const subtitle = content?.subtitle || '';
  const rawReviews = content?.reviews || [];
  const show_ratings = content?.show_ratings !== false; // Default true
  const show_locations = content?.show_locations !== false; // Default true
  console.log(rawReviews);
  // Filter out reviews with blank required fields (name and text)
  const validReviews = rawReviews.filter(review =>
    review?.name?.trim() && review?.review?.trim()
  );
  console.log(validReviews);
  // Ensure minimum 3 reviews - duplicate if needed
  let reviews = validReviews;
  if (validReviews.length > 0 && validReviews.length < 3) {
    const times = Math.ceil(3 / validReviews.length);
    reviews = Array(times).fill(validReviews).flat().slice(0, 3);
  }

  // If no valid reviews at all, don't render the section
  if (reviews.length === 0) {
    return null;
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const initialSlide = 1;

  // Create looped reviews for smooth carousel
  let loopedReviews = reviews;
  if (reviews.length < 6) {
    const sideCopies = 2;
    loopedReviews = [
      ...Array(sideCopies).fill(reviews).flat(),
      ...reviews,
      ...Array(sideCopies).fill(reviews).flat(),
    ];
  }

  return (
    <section className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white'>
      {title && (
        <h3 className='text-3xl md:text-5xl font-bold mb-8 text-center tracking-tight' style={{ color: themeColor }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className='text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto'>
          {subtitle}
        </p>
      )}
      <div className='w-full max-w-4xl mx-auto relative'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={30}
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
          onSlideChange={(swiper) => {
            setActiveSlideIndex(swiper.realIndex);
          }}
          pagination={{
            el: '.review-modern-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className='review-modern-swiper w-full'
          style={{
            paddingBottom: '80px',
            paddingTop: '20px',
          }}
        >
          {loopedReviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <div
                className='review-modern-slide group border-2'
                style={{
                  backgroundColor: themeColor,
                  borderColor: themeColor
                }}
              >
                <div className='review-modern-content'>
                  {review.review && (
                    <>
                      <div className='flex justify-center mb-4'>
                        <svg
                          className='w-12 h-12 md:w-16 md:h-16 text-white opacity-30'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                        </svg>
                      </div>
                      <p className='text-white text-base md:text-lg mb-5 leading-relaxed'>
                        {review.review}
                      </p>
                    </>
                  )}
                  {show_ratings && review.rating && (
                    <div className='flex justify-center mb-3'>
                      {renderStars(review.rating)}
                    </div>
                  )}

                  <div className='mt-4'>
                    {review.name && (
                      <h4 className='text-white font-bold text-lg'>{review.name}</h4>
                    )}
                    {review.review_sub_heading && review.review_sub_heading.trim() && (
                      <p className='text-white opacity-90 mt-1 text-sm font-medium'>{review.review_sub_heading}</p>
                    )}
                    {show_locations && review.location && review.location.trim() && (
                      <p className='text-white opacity-75 mt-1 text-sm'>{review.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <button
            ref={prevRef}
            type='button'
            className='review-modern-nav'
            style={{ left: '-60px' }}
            aria-label='Previous Review'
            tabIndex={isMobile ? -1 : 0}
          >
            <svg
              width='24'
              height='24'
              fill='none'
              strokeWidth='2.5'
              viewBox='0 0 24 24'
            >
              <path d='M15 19l-7-7 7-7' stroke='currentColor' />
            </svg>
          </button>
          <button
            ref={nextRef}
            type='button'
            className='review-modern-nav'
            style={{ right: '-60px' }}
            aria-label='Next Review'
            tabIndex={isMobile ? -1 : 0}
          >
            <svg
              width='24'
              height='24'
              fill='none'
              strokeWidth='2.5'
              viewBox='0 0 24 24'
            >
              <path d='M9 5l7 7-7 7' stroke='currentColor' />
            </svg>
          </button>

          <div className='review-modern-swipe-icon'>
            <svg width='54' height='54' viewBox='0 0 54 54' fill='none'>
              <g>
                <path
                  d='M27 38V18.5C27 16.0147 29.0147 14 31.5 14C33.9853 14 36 16.0147 36 18.5V32'
                  stroke='currentColor'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                <path
                  d='M27 38V13.5C27 11.0147 24.9853 9 22.5 9C20.0147 9 18 11.0147 18 13.5V32'
                  stroke='currentColor'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                <path
                  d='M27 38V22C27 20.3431 25.6569 19 24 19C22.3431 19 21 20.3431 21 22V32'
                  stroke='currentColor'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.9'
                  fill='none'
                />
                <ellipse
                  cx='27'
                  cy='42'
                  rx='10'
                  ry='6'
                  fill='currentColor'
                  opacity='0.15'
                />
                <path
                  d='M27 46c0 0 0-2 0-4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  opacity='0.7'
                />
                <path
                  d='M23 44l4 4 4-4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  opacity='0.7'
                />
              </g>
            </svg>
          </div>

          <div
            className='review-modern-pagination'
            style={{
              '--swiper-pagination-color': themeColor,
              '--swiper-pagination-bullet-inactive-color': '#999',
            }}
          />
        </Swiper>
      </div>
    </section>
  );
}
