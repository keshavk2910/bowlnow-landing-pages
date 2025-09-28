/**
 * Template Helper Utilities
 * Provides safe access patterns and error prevention for template components
 */

/**
 * Safe destructuring with default values to prevent undefined errors
 * @param {Object} content - Template content object
 * @returns {Object} Safely destructured content with defaults
 */
export function safeTemplateContent(content = {}) {
  return {
    header: content.header || {},
    features_slider: content.features_slider || {},
    events_slider: content.events_slider || {},
    main_cta: content.main_cta || {},
    contact_form: content.contact_form || {},
    book_your_event: content.book_your_event || {},
    party_slider: content.party_slider || {},
    party_started: content.party_started || {},
    footer: content.footer || {},
    hero: content.hero || {},
    about: content.about || {},
    services: content.services || {},
    gallery: content.gallery || {},
    testimonials: content.testimonials || {},
    pricing: content.pricing || {},
    // Add more sections as needed
    ...content // Preserve any additional content
  }
}

/**
 * Safe site object with defaults
 * @param {Object} site - Site configuration object
 * @returns {Object} Safe site object with defaults
 */
export function safeSiteData(site = {}) {
  return {
    id: site.id || '',
    slug: site.slug || '',
    client_name: site.client_name || '',
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
 * Safe page object with defaults
 * @param {Object} page - Page configuration object
 * @returns {Object} Safe page object with defaults
 */
export function safePageData(page = {}) {
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
 * Get theme color with fallback
 * @param {Object} site - Site configuration object
 * @param {string} fallback - Fallback color (default: '#4F46E5')
 * @returns {string} Theme color
 */
export function getThemeColor(site = {}, fallback = '#4F46E5') {
  return site?.settings?.theme_color || fallback
}

/**
 * Safe property access with default value
 * @param {Object} obj - Object to access property from
 * @param {string} path - Dot notation path (e.g., 'header.hero_title')
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} Property value or default
 */
export function safeGet(obj, path, defaultValue = '') {
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
 * Check if a section is enabled with safe checking
 * @param {Object} section - Section object
 * @returns {boolean} Whether section is enabled
 */
export function isSectionEnabled(section = {}) {
  return Boolean(section.enabled)
}

/**
 * Get section title with fallback
 * @param {Object} section - Section object
 * @param {string} fallback - Fallback title
 * @returns {string} Section title
 */
export function getSectionTitle(section = {}, fallback = 'Section Title') {
  return section.title || section.name || fallback
}

/**
 * Template component wrapper with error boundary
 * @param {Function} Component - Component to wrap
 * @param {Object} fallbackProps - Props to use if component fails
 * @returns {Function} Wrapped component
 */
export function withTemplateErrorBoundary(Component, fallbackProps = {}) {
  return function SafeTemplateComponent(props) {
    try {
      return Component({ ...fallbackProps, ...props })
    } catch (error) {
      console.error('Template component error:', error)
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            Template section temporarily unavailable
          </p>
        </div>
      )
    }
  }
}

/**
 * Default template configuration for new templates
 */
export const DEFAULT_TEMPLATE_CONFIG = {
  sections: [
    {
      key: 'header',
      name: 'Header Section',
      order: 0,
      fields: [
        {
          key: 'hero_title',
          type: 'text',
          label: 'Hero Title',
          required: true,
          description: 'Main headline for the page'
        },
        {
          key: 'hero_subtitle',
          type: 'text',
          label: 'Hero Subtitle',
          required: false,
          description: 'Supporting text under the main headline'
        },
        {
          key: 'hero_background',
          type: 'image',
          label: 'Hero Background Image',
          required: false,
          description: 'Background image for the hero section'
        },
        {
          key: 'header_cta_text',
          type: 'text',
          label: 'Header CTA Text',
          required: false,
          description: 'Call to action text in header'
        },
        {
          key: 'header_cta_link',
          type: 'url',
          label: 'Header CTA Link',
          required: true,
          description: 'Header CTA button link'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Header',
          required: false,
          description: 'Show/hide header section'
        }
      ],
      required: true,
      description: 'Page header with navigation and hero content'
    }
  ]
}