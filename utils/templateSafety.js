/**
 * Template Safety Utilities
 * Comprehensive error prevention for all template components
 */

/**
 * Validates if a string is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid for Next.js Image component
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false

  // Check if it's an absolute URL (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) return true

  // Check if it's a relative URL starting with /
  if (url.startsWith('/')) return true

  // Check if it's a data URL
  if (url.startsWith('data:image/')) return true

  return false
}

/**
 * Get safe image URL for Next.js Image component
 * @param {string} url - Image URL to validate
 * @param {string} fallback - Fallback URL if invalid
 * @returns {string} Safe image URL
 */
export function safeImageUrl(url, fallback = '/api/placeholder/400/300') {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback
  }

  const trimmedUrl = url.trim()

  // If it's valid, return it
  if (isValidImageUrl(trimmedUrl)) {
    return trimmedUrl
  }

  // If it looks like text content rather than URL, return fallback
  if (trimmedUrl.length > 100 || trimmedUrl.includes(' ')) {
    console.warn(`Invalid image URL detected: "${trimmedUrl.substring(0, 50)}..." - using fallback`)
    return fallback
  }

  // Try to make relative URLs absolute
  if (!trimmedUrl.startsWith('/') && !trimmedUrl.includes('://')) {
    return `/${trimmedUrl}`
  }

  return fallback
}

/**
 * Safely ensures an array for mapping operations
 * @param {any} value - Value that should be an array
 * @param {Array} fallback - Fallback array if value is not array
 * @returns {Array} Safe array for mapping
 */
export function safeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback
}

/**
 * Safe template props with comprehensive defaults
 * @param {Object} props - Template props
 * @returns {Object} Safe props with defaults
 */
export function safeTemplateProps(props = {}) {
  return {
    content: props.content || {},
    site: props.site || {},
    funnel: props.funnel || {},
    page: props.page || {},
    sessionId: props.sessionId || '',
    onFormSubmit: props.onFormSubmit || (() => {}),
    onCheckoutClick: props.onCheckoutClick || (() => {}),
    loading: props.loading || false,
    ...props
  }
}

/**
 * Safe content extraction with defaults for common sections
 * @param {Object} content - Content object
 * @returns {Object} Safe content sections
 */
export function safeContent(content = {}) {
  return {
    // Header section
    header: content.header || {},
    hero_title: content.hero_title || 'Welcome to Our Business',
    hero_subtitle: content.hero_subtitle || 'Experience excellence with our services',
    hero_background: content.hero_background || '/api/placeholder/1920/1080',
    hero_cta_text: content.hero_cta_text || 'Get Started',
    hero_cta_link: content.hero_cta_link || '#contact',

    // Features section
    features: safeArray(content.features, [
      {
        title: 'Quality Service',
        description: 'We provide excellent service',
        icon: '✨'
      }
    ]),

    // Carousel section
    carousel_items: safeArray(content.carousel_items, [
      {
        title: 'Welcome',
        description: 'Discover our services',
        image: '/api/placeholder/400/300',
        link: '#services'
      }
    ]),
    carousel_title: content.carousel_title || 'Latest Updates',

    // Common sections
    features_slider: content.features_slider || {},
    events_slider: content.events_slider || {},
    main_cta: content.main_cta || {},
    contact_form: content.contact_form || {},
    book_your_event: content.book_your_event || {},
    party_slider: content.party_slider || {},
    party_started: content.party_started || {},

    // About section
    about_title: content.about_title || 'About Us',
    about_text: content.about_text || 'Learn more about our company and services.',
    about_image: content.about_image || '/api/placeholder/600/400',

    // Contact section
    contact_title: content.contact_title || 'Contact Us',
    phone: content.phone || '',
    address: content.address || '',
    hours: content.hours || 'Monday - Sunday: 9am - 6pm',
    social_links: content.social_links || {},

    // Preserve all original content
    ...content
  }
}

/**
 * Safe site data extraction
 * @param {Object} site - Site object
 * @returns {Object} Safe site data
 */
export function safeSite(site = {}) {
  return {
    id: site.id || '',
    slug: site.slug || '',
    client_name: site.client_name || 'Our Business',
    logo_url: site.logo_url || 'https://partners.bowlnow.com/wp-content/uploads/2025/04/logo.png',
    settings: site.settings || {},
    contact_info: site.contact_info || '',
    contact_phone: site.contact_phone || '',
    contact_email: site.contact_email || '',
    footer_description: site.footer_description || '',
    ...site
  }
}

/**
 * Safe page data extraction
 * @param {Object} page - Page object
 * @returns {Object} Safe page data
 */
export function safePage(page = {}) {
  return {
    id: page.id || '',
    name: page.name || '',
    slug: page.slug || '',
    page_type: page.page_type || '',
    is_published: page.is_published || false,
    is_homepage: page.is_homepage || false,
    ...page
  }
}

/**
 * Get safe theme color
 * @param {Object} site - Site object
 * @param {string} fallback - Fallback color
 * @returns {string} Theme color
 */
export function safeThemeColor(site = {}, fallback = '#4F46E5') {
  return site?.settings?.theme_color || fallback
}

/**
 * Safe property getter with dot notation
 * @param {Object} obj - Source object
 * @param {string} path - Property path (e.g., 'settings.theme_color')
 * @param {any} defaultValue - Default value
 * @returns {any} Property value or default
 */
export function safeGet(obj, path, defaultValue = null) {
  if (!obj || !path) return defaultValue

  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue
    }
    result = result[key]
  }

  return result !== null && result !== undefined ? result : defaultValue
}

/**
 * Create a safe template component wrapper
 * @param {Function} TemplateComponent - Template component to wrap
 * @param {Object} defaults - Default props
 * @returns {Function} Wrapped safe component
 */
export function createSafeTemplate(TemplateComponent, defaults = {}) {
  return function SafeTemplateWrapper(props) {
    try {
      const safeProps = {
        ...defaults,
        ...safeTemplateProps(props),
        content: safeContent(props.content),
        site: safeSite(props.site),
        page: safePage(props.page)
      }

      return TemplateComponent(safeProps)
    } catch (error) {
      console.error('Template rendering error:', error)
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Template Error
            </h2>
            <p className="text-gray-600 mb-4">
              This template encountered an error while loading.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
  }
}

/**
 * Validate template configuration schema
 * @param {Object} schema - Configuration schema
 * @returns {Object} Validated and safe schema
 */
export function validateTemplateSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return {
      sections: [
        {
          key: 'header',
          name: 'Header Section',
          order: 0,
          fields: [],
          required: true,
          description: 'Main header section'
        }
      ]
    }
  }

  // Ensure sections exist and are arrays
  if (schema.sections && Array.isArray(schema.sections)) {
    schema.sections = schema.sections.map(section => ({
      key: section.key || 'section',
      name: section.name || 'Section',
      order: typeof section.order === 'number' ? section.order : 0,
      fields: Array.isArray(section.fields) ? section.fields : [],
      required: Boolean(section.required),
      description: section.description || '',
      ...section
    }))
  } else {
    schema.sections = []
  }

  // Handle legacy field structure
  if (schema.fields && !schema.sections.length) {
    schema.sections = [
      {
        key: 'main',
        name: 'Main Section',
        order: 0,
        fields: Array.isArray(schema.fields) ? schema.fields : [],
        required: true,
        description: 'Main template configuration'
      }
    ]
    delete schema.fields
  }

  return schema
}

/**
 * Common default features for templates
 */
export const DEFAULT_FEATURES = [
  {
    title: 'Quality Service',
    description: 'We provide excellent service to all our customers',
    icon: '✨'
  },
  {
    title: 'Professional Team',
    description: 'Our experienced team is here to help you',
    icon: '👥'
  },
  {
    title: 'Fast Delivery',
    description: 'Quick and efficient service delivery',
    icon: '🚀'
  },
  {
    title: 'Customer Support',
    description: '24/7 customer support and assistance',
    icon: '📞'
  }
]

/**
 * Common default carousel items
 */
export const DEFAULT_CAROUSEL_ITEMS = [
  {
    title: 'Welcome to Our Service',
    description: 'Discover what we can do for you',
    image: '/api/placeholder/400/300',
    link: '#services'
  },
  {
    title: 'Professional Solutions',
    description: 'Expert solutions tailored to your needs',
    image: '/api/placeholder/400/300',
    link: '#about'
  },
  {
    title: 'Get Started Today',
    description: 'Contact us to begin your journey',
    image: '/api/placeholder/400/300',
    link: '#contact'
  }
]