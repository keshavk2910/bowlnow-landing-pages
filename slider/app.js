// Main application logic
let slideCounters = {
    slider1: 0,
    slider2: 0
};

let swiperInstances = {};

// Default data for sliders
const defaultData1 = [
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/03/iStock-938976884_result-1024x683.webp',
        title: 'Open Bowling',
        description: 'Bowling is fun for the whole family. Everyone can bowl, nobody has to sit on the side line.',
        btntext: 'Know More',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/04/cc33_result-1024x662.webp',
        title: 'Specials',
        description: 'EXPERIENCE A WALLET-FRIENDLY WAY TO ROLL. LEARN MORE ABOUT OUR AMAZING SPECIALS!',
        btntext: 'Know More',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/04/22bb_result-1024x662-1.webp',
        title: 'Company Events',
        description: 'Perfect venue for team building and corporate celebrations. Create memorable experiences for your team.',
        btntext: 'Know More',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/03/iStock-938976884_result-1024x683.webp',
        title: 'Birthday Parties',
        description: 'Celebrate your special day with friends and family. Make your birthday unforgettable with our party packages.',
        btntext: 'Know More',
        btnlink: '#'
    }
];

const defaultData2 = [
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/04/22bb_result-1024x662-1.webp',
        title: 'How to Throw a Successful Company Bowling Party',
        description: 'Are you on the lookout for an exciting and engaging way to bring your team…',
        btntext: '',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/04/cc33_result-1024x662.webp',
        title: 'The Ultimate Guide: How Much Does It Cost to Have a Company Event at a Bowling Alley?',
        description: 'Are you searching for the perfect venue to host a company event that will leave…',
        btntext: '',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/03/iStock-938976884_result-1024x683.webp',
        title: 'Bowl Your Way Through the Heat: Why Bowling Should Be Your New Favorite Summer Activity',
        description: 'Summer is the time for outdoors, barbeques, pool parties, and beaches! But if you are not…',
        btntext: '',
        btnlink: '#'
    },
    {
        image: 'https://partners.bowlnow.com/wp-content/uploads/2025/03/iStock-938976884_result-1024x683.webp',
        title: 'League Bowling Adventures',
        description: 'Join our competitive leagues and improve your skills. Weekly tournaments and friendly competition await you.',
        btntext: '',
        btnlink: '#'
    }
];

function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

function addSlide(sliderId) {
    slideCounters[sliderId]++;
    const slideNumber = slideCounters[sliderId];
    
    const slideForm = document.createElement('div');
    slideForm.className = 'slide-form';
    slideForm.id = `${sliderId}-slide-${slideNumber}`;
    
    slideForm.innerHTML = `
        <div class="slide-header">
            <span>Slide ${slideNumber}</span>
            <button class="remove-slide" onclick="removeSlide('${sliderId}', ${slideNumber})">Remove</button>
        </div>
        <div class="form-group">
            <label>Image URL:</label>
            <input type="url" id="${sliderId}-image-${slideNumber}" placeholder="https://example.com/image.jpg">
        </div>
        <div class="form-group">
            <label>Title:</label>
            <input type="text" id="${sliderId}-title-${slideNumber}" placeholder="Enter slide title">
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea id="${sliderId}-description-${slideNumber}" placeholder="Enter slide description"></textarea>
        </div>
        <div class="form-group">
            <label>Button Text:</label>
            <input type="text" id="${sliderId}-btntext-${slideNumber}" placeholder="Know More">
        </div>
        <div class="form-group">
            <label>Button Link:</label>
            <input type="url" id="${sliderId}-btnlink-${slideNumber}" placeholder="https://example.com">
        </div>
    `;
    
    document.getElementById(`${sliderId}-forms`).appendChild(slideForm);
}

function removeSlide(sliderId, slideNumber) {
    const slideElement = document.getElementById(`${sliderId}-slide-${slideNumber}`);
    if (slideElement) {
        slideElement.remove();
    }
}

function getSlideData(sliderId) {
    const slides = [];
    const slideElements = document.querySelectorAll(`#${sliderId}-forms .slide-form`);
    
    slideElements.forEach((slideElement, index) => {
        const slideNumber = slideElement.id.split('-').pop();
        const image = document.getElementById(`${sliderId}-image-${slideNumber}`).value;
        const title = document.getElementById(`${sliderId}-title-${slideNumber}`).value;
        const description = document.getElementById(`${sliderId}-description-${slideNumber}`).value;
        const btntext = document.getElementById(`${sliderId}-btntext-${slideNumber}`).value;
        const btnlink = document.getElementById(`${sliderId}-btnlink-${slideNumber}`).value;
        
        if (image && title) {
            slides.push({ image, title, description, btntext, btnlink });
        }
    });
    
    return slides;
}

function generateCode(sliderId) {
    const slides = getSlideData(sliderId);
    
    if (slides.length === 0) {
        alert('Please add at least one slide with image and title.');
        return;
    }

    let generatedCode = '';
    
    if (sliderId === 'slider1') {
        generatedCode = generateSlider1Code(slides);
    } else {
        generatedCode = generateSlider2Code(slides);
    }
    
    // Display the code
    document.getElementById(`${sliderId}-code`).textContent = generatedCode;
    
    // Show live preview
    showPreview(sliderId, generatedCode);
}

function showPreview(sliderId, code) {
    const previewContainer = document.getElementById(`${sliderId}-preview`);
    previewContainer.innerHTML = code;
    
    // Destroy existing swiper instance if it exists
    if (swiperInstances[sliderId]) {
        swiperInstances[sliderId].destroy(true, true);
        delete swiperInstances[sliderId];
    }
    
    // Initialize new swiper
    setTimeout(() => {
        if (sliderId === 'slider1') {
            swiperInstances[sliderId] = new Swiper('.slider1-swiper', {
                wrapperClass: 'slider1-wrapper',
                slideClass: 'slider1-slide',
                slideActiveClass: 'slider1-slide-active',
                slideDuplicateClass: 'slider1-slide-duplicate',
                slideVisibleClass: 'slider1-slide-visible',
                
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
                    nextEl: '.slider1-nav-button-next',
                    prevEl: '.slider1-nav-button-prev',
                },
                pagination: {
                    el: '.slider1-pagination',
                    clickable: true,
                    bulletClass: 'slider1-bullet',
                    bulletActiveClass: 'slider1-bullet-active',
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 1.4 },
                    1200: { slidesPerView: 2.2 },
                },
            });
        } else {
            swiperInstances[sliderId] = new Swiper('.bowling-carousel', {
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
            });
        }
    }, 100);
}

function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Code copied to clipboard!');
    });
}

// Initialize with default slides
document.addEventListener('DOMContentLoaded', function() {
    // Add 4 default slides for slider1
    for (let i = 0; i < 4; i++) {
        addSlide('slider1');
    }
    
    // Add 4 default slides for slider2
    for (let i = 0; i < 4; i++) {
        addSlide('slider2');
    }
    
    // Fill default data
    defaultData1.forEach((data, index) => {
        const slideNum = index + 1;
        document.getElementById(`slider1-image-${slideNum}`).value = data.image;
        document.getElementById(`slider1-title-${slideNum}`).value = data.title;
        document.getElementById(`slider1-description-${slideNum}`).value = data.description;
        document.getElementById(`slider1-btntext-${slideNum}`).value = data.btntext;
        document.getElementById(`slider1-btnlink-${slideNum}`).value = data.btnlink;
    });

    defaultData2.forEach((data, index) => {
        const slideNum = index + 1;
        document.getElementById(`slider2-image-${slideNum}`).value = data.image;
        document.getElementById(`slider2-title-${slideNum}`).value = data.title;
        document.getElementById(`slider2-description-${slideNum}`).value = data.description;
        document.getElementById(`slider2-btntext-${slideNum}`).value = data.btntext;
        document.getElementById(`slider2-btnlink-${slideNum}`).value = data.btnlink;
    });
});