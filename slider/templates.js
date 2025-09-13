// HTML Templates for sliders

function generateSlider1Code(slides) {
  let slidesHtml = '';

  slides.forEach((slide) => {
    slidesHtml += `
              <div class="swiper-slide">
                <div class="bowling-slide-container">
                  <img
                    src="${slide.image}"
                    alt="${slide.title}"
                    class="bowling-slide-image"
                  />
                  <div class="bowling-slide-content">
                    <h2 class="bowling-slide-title">${slide.title}</h2>
                    <p class="bowling-slide-description">
                      ${slide.description}
                    </p>
                    <a href="${slide.btnlink}" class="bowling-know-more-btn">${slide.btntext}</a>
                  </div>
                </div>
              </div>`;
  });

  return `<!-- Go High Level Custom Code Element - Basic Slider -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
    />

    <style>
      /* Basic Container */
      .bowling-specials-section {
        padding: 20px 0;
        width: 100%;
        position: relative;
        max-width: 100%;
      }

      .specials-carousel-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 0 20px;
        overflow: hidden; /* fix scrollbar issue */
      }

      .specials-swiper {
        position: relative;
        overflow: hidden; /* ensures no extra scroll */
      }

      /* Basic Slide Content */
      .bowling-slide-container {
        width: 100%;
        height: 600px;
        position: relative;
        border-radius: 15px;
        overflow: hidden;
      }

      .bowling-slide-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Overlay: bottom → top gradient */
      .bowling-slide-container::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.75) 0%,
          rgba(0, 0, 0, 0.4) 40%,
          rgba(0, 0, 0, 0) 100%
        );
        z-index: 1;
      }

      .bowling-slide-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 40px;
        color: white;
        z-index: 2; /* above overlay */
      }

      .bowling-slide-title {
        font-family: var(--headlinefont);
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .bowling-slide-description {
        font-family: var(--contentfont);
        font-size: 16px;
        margin-bottom: 20px;
        opacity: 0.9;
      }

      .bowling-know-more-btn {
        font-family: var(--contentfont);
        display: inline-block;
        padding: 12px 25px;
        background: transparent;
        border: 2px solid white;
        border-radius: 25px;
        color: white;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .bowling-know-more-btn:hover {
        background: white;
        color: black;
      }

      /* Navigation Arrows */
      .specials-nav-button {
        position: absolute;
        bottom: 40px;
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
      }

      .specials-nav-button-prev {
        right: 90px;
      }

      .specials-nav-button-next {
        right: 30px;
      }

      .specials-nav-button svg {
        width: 18px;
        height: 18px;
      }

      /* Pagination */
      .specials-pagination {
        bottom: -50px;
      }
    </style>

    <div class="bowling-specials-section">
      <div class="specials-carousel-container">
        <div class="specials-carousel">
          <div class="specials-swiper swiper">
            <div class="swiper-wrapper">${slidesHtml}
            </div>

            <!-- Navigation Arrows -->
            <div class="specials-nav-button specials-nav-button-prev">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="256"
                height="256"
                viewBox="0 0 256 256"
              >
                <g transform="translate(1.41 1.41) scale(2.81 2.81)">
                  <path
                    d="M 65.75 90 c 0.896 0 1.792 -0.342 2.475 -1.025 c 1.367 -1.366 1.367 -3.583 0 -4.949 L 29.2 45 L 68.225 5.975 c 1.367 -1.367 1.367 -3.583 0 -4.95 c -1.367 -1.366 -3.583 -1.366 -4.95 0 l -41.5 41.5 c -1.367 1.366 -1.367 3.583 0 4.949 l 41.5 41.5 C 63.958 89.658 64.854 90 65.75 90 z"
                    fill="#000000"
                  />
                </g>
              </svg>
            </div>
            <div class="specials-nav-button specials-nav-button-next">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="256"
                height="256"
                viewBox="0 0 256 256"
              >
                <g transform="translate(1.41 1.41) scale(2.81 2.81)">
                  <path
                    d="M 24.25 90 c -0.896 0 -1.792 -0.342 -2.475 -1.025 c -1.367 -1.366 -1.367 -3.583 0 -4.949 L 60.8 45 L 21.775 5.975 c -1.367 -1.367 -1.367 -3.583 0 -4.95 c 1.367 -1.366 3.583 -1.366 4.95 0 l 41.5 41.5 c 1.367 1.366 1.367 3.583 0 4.949 l -41.5 41.5 C 26.042 89.658 25.146 90 24.25 90 z"
                    fill="#000000"
                  />
                </g>
              </svg>
            </div>

            <!-- Pagination -->
            <div class="specials-pagination swiper-pagination"></div>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script>
      // Wait for Swiper to be available and initialize
      function initSpecialsSwiper() {
        if (typeof Swiper !== 'undefined') {
          console.log('Swiper loaded, initializing specials slider');
          const specialsSwiper = new Swiper('.specials-swiper', {
            slidesPerView: 2.2,
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            roundLengths: true,
            centeredSlidesBounds: true,
            autoplay: {
              delay: 4000,
            },
            navigation: {
              nextEl: '.specials-nav-button-next',
              prevEl: '.specials-nav-button-prev',
            },
            pagination: {
              el: '.specials-pagination',
              clickable: true,
            },
            breakpoints: {
              0: { slidesPerView: 1 },
              768: { slidesPerView: 1.4 },
              1200: { slidesPerView: 2.2 },
            },
          });
          return true;
        } else {
          console.log('Swiper not yet available, checking again in 1 second...');
          return false;
        }
      }

      // Check for Swiper availability every second
      const specialsSwiperInterval = setInterval(() => {
        if (initSpecialsSwiper()) {
          clearInterval(specialsSwiperInterval);
        }
      }, 1000);
    </script>`;
}

function generateSlider2Code(slides) {
  let slidesHtml = '';

  slides.forEach((slide) => {
    slidesHtml += `
        <!-- Slide -->
        <div class="swiper-slide">
          <div class="slide-content">
            <img
              class="slide-image"
              src="${slide.image}"
              alt="${slide.title}"
            />
            <div class="slide-text">
              <h3 class="slide-title">
                ${slide.title}
              </h3>
              <p class="slide-description">
                ${slide.description}
              </p>
            </div>
          </div>
        </div>`;
  });

  return `<style>
  /* import Swiper styles */
  @import url('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');

  :root {
    --bg: #111;
    --card-bg: #0f0f0f;
    --accent: #fff;
    --radius: 14px;
  }

  .parties-events-section {
    background-color: var(--bg);
    padding: 60px 20px 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
  .slider-container {
    width: 100%;
    overflow: hidden;
    position: relative;
    perspective: 1000px; /* for 3D depth */
  }

  /* allow previews outside the container */
  .bowling-carousel.swiper {
    padding: 10px 0 40px;
    overflow: visible;
  }

  .swiper-wrapper {
    align-items: center;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* card that scales */
  .slide-content {
    width: 92%;
    max-width: 820px;
    border-radius: var(--radius);
    overflow: hidden;
    transform: scale(0.85) translateZ(-60px);
    transition: transform 600ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 600ms;
    opacity: 0.75;
    transform-style: preserve-3d;
  }

  /* center the active slide bigger and in front */
  .swiper-slide-active .slide-content {
    transform: scale(1) translateZ(0);
    opacity: 1;
    z-index: 5;
  }

  /* ensure prev/next look slightly smaller (explicit) */
  .swiper-slide-prev .slide-content,
  .swiper-slide-next .slide-content {
    transform: scale(0.85) translateZ(-60px);
    opacity: 0.75;
    z-index: 3;
  }
  .swiper-slide-prev .slide-content .slide-text,
  .swiper-slide-next .slide-content .slide-text {
    opacity: 0;
    visibility: hidden;
  }
  .slide-image {
    width: 100%;
    height: 460px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
  }

  .slide-text {
    padding: 28px 36px 40px;
    text-align: center;
    color: var(--accent);
    visibility: visible;
    opacity: 1;
    transition: all 0.6s ease;
  }

  .slide-title {
    font-family: var(--headlinefont, 'Inter', sans-serif);
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 12px;
    line-height: 1.3;
  }

  .slide-description {
    font-family: var(--contentfont, 'Inter', sans-serif);
    font-size: 15px;
    margin: 0;
    opacity: 0.95;
    line-height: 1.6;
  }

  /* navigation arrows - left and right, vertically centered */
  .swiper-button-prev,
  .swiper-button-next {
    position: absolute;
    bottom: 10px;
    top: auto;
    right: 30px;
    left: auto;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #fff;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    z-index: 20;
    cursor: pointer;
  }

  .swiper-button-prev {
    right: 90px;
  }

  /* make the default Swiper arrows visible / sized */
  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 16px;
    font-weight: 700;
    color: #111;
  }

  /* responsive tweaks */
  @media (max-width: 1100px) {
    .slide-image {
      height: 420px;
    }
    .slide-content {
      max-width: 720px;
    }
  }

  @media (max-width: 900px) {
    .section-title {
      font-size: 36px;
    }
    .slide-image {
      height: 360px;
    }
    .slide-content {
      width: 95%;
    }
    /* move arrows slightly inward on smaller screens */
    .swiper-button-prev {
      left: 6px;
    }
    .swiper-button-next {
      right: 6px;
    }
  }

  @media (max-width: 650px) {
    /* smaller devices: show 1 slide but allow peek */
    .swiper-button-prev,
    .swiper-button-next {
      width: 40px;
      height: 40px;
    }
    .slide-image {
      height: 300px;
    }
  }
  .section-title {
    font-family: var(--headlinefont, 'Inter', sans-serif);
    font-size: 48px;
    color: var(--accent);
    margin-bottom: 40px;
    text-align: center;
    letter-spacing: 2px;
  }
</style>

<div class="parties-events-section">
  <h2 class="section-title">PARTIES &amp; EVENTS</h2>
  <div class="slider-container">
    <div class="bowling-carousel swiper">
      <div class="swiper-wrapper">${slidesHtml}
        <!-- add more static slides here if needed -->
      </div>
    </div>

    <!-- nav buttons (left / right) -->
    <div class="swiper-button-prev" aria-label="Previous"></div>
    <div class="swiper-button-next" aria-label="Next"></div>
  </div>
</div>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script>
  // Wait for Swiper to be available and initialize
  function initBowlingCarousel() {
    if (typeof Swiper !== 'undefined') {
      console.log('Swiper loaded, initializing bowling carousel slider');
      const bowlingCarouselSwiper = new Swiper('.bowling-carousel', {
        slidesPerView: 2.2,
        spaceBetween: 1,
        slideToClickedSlide: true,
        loop: true,
        centeredSlides: true,
        roundLengths: true,
        centeredSlidesBounds: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        effect: 'slide',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // breakpoints: {
        //   320: { slidesPerView: 1.05, spaceBetween: 14 },
        //   640: { slidesPerView: 1.25, spaceBetween: 18 },
        //   900: { slidesPerView: 1.6, spaceBetween: 22 },
        //   1024: { slidesPerView: 1.8, spaceBetween: 30 },
        // },
      });
      return true;
    } else {
      console.log('Swiper not yet available, checking again in 1 second...');
      return false;
    }
  }

  // Check for Swiper availability every second
  const bowlingCarouselInterval = setInterval(() => {
    if (initBowlingCarousel()) {
      clearInterval(bowlingCarouselInterval);
    }
  }, 1000);

  // Also try to initialize on DOM ready if Swiper is already available
  document.addEventListener('DOMContentLoaded', function () {
    initBowlingCarousel();
  });
</script>`;
}