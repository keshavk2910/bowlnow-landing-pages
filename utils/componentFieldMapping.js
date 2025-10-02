/**
 * Component Field Mapping Utilities
 * Ensures proper mapping between database fields and component props
 */

/**
 * Map database section data to component props
 * @param {string} componentName - Name of the component
 * @param {Object} sectionData - Raw section data from database/form
 * @returns {Object} Mapped props for the component
 */
export function mapSectionDataToComponent(componentName, sectionData = {}) {
  switch (componentName) {
    case 'BookYourEventHalf':
      return mapBookYourEventHalfData(sectionData)
    
    case 'BookYourEventLeft':
      return mapBookYourEventLeftData(sectionData)
    
    default:
      return sectionData
  }
}

/**
 * Map BookYourEventHalf section data to component props
 */
function mapBookYourEventHalfData(data = {}) {
  return {
    enabled: data.enabled || false,
    title: data.title || 'Book Your Event',
    subtitle: data.subtitle || 'Plan your perfect event with us',
    description: data.description || 'Pleasant Hill Lanes is your premier facility for corporate outings, team building, youth events, fundraising and much more! Our team of event planners are ready to help you organize and book your next event!',
    background_image: data.background_image || 'https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg',
    image_alt: data.image_alt || '',
    secondary_image: data.secondary_image || '',
    cta_text: data.cta_text || 'Book Now',
    cta_link: data.cta_link || '#form'
  }
}

/**
 * Map BookYourEventLeft section data to component props
 */
function mapBookYourEventLeftData(data = {}) {
  return {
    enabled: data.enabled || false,
    title: data.title || 'Book Your Event',
    subtitle: data.subtitle || 'Plan your perfect event with us',
    description: data.description || 'Experience the best in entertainment and service for your special occasion.',
    background_image: data.background_image || '/api/placeholder/800/600',
    image_alt: data.image_alt || '',
    secondary_image: data.secondary_image || '',
    image_position: data.image_position || 'left',
    show_image: data.show_image !== undefined ? data.show_image : true,
    cta_text: data.cta_text || 'Book Now',
    cta_link: data.cta_link || '#contact'
  }
}

/**
 * Validate image field data
 * @param {Object} imageData - Image field data
 * @returns {Object} Validation result
 */
export function validateImageField(imageData = {}) {
  const errors = []
  
  if (imageData.background_image && !isValidImageUrl(imageData.background_image)) {
    errors.push('Invalid image URL format')
  }
  
  if (imageData.image_alt && imageData.image_alt.length > 255) {
    errors.push('Image alt text must be less than 255 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Check if a URL is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get default image field values for a component
 * @param {string} componentName - Name of the component
 * @returns {Object} Default image field values
 */
export function getDefaultImageFields(componentName) {
  switch (componentName) {
    case 'BookYourEventHalf':
      return {
        background_image: 'https://partners.bowlnow.com/wp-content/uploads/2025/04/join-bg-e1744693267594.jpg',
        image_alt: ''
      }
    
    case 'BookYourEventLeft':
      return {
        background_image: '/api/placeholder/800/600',
        image_alt: '',
        image_position: 'left',
        show_image: true
      }
    
    default:
      return {
        background_image: '',
        image_alt: ''
      }
  }
}

/**
 * Transform form data for database storage
 * @param {string} componentName - Name of the component
 * @param {Object} formData - Form data from admin interface
 * @returns {Object} Transformed data for database storage
 */
export function transformFormDataForStorage(componentName, formData = {}) {
  // Ensure image fields are properly formatted
  const transformed = { ...formData }
  
  // Handle image URL formatting
  if (transformed.background_image && !transformed.background_image.startsWith('http')) {
    // If it's a relative URL, make it absolute
    if (transformed.background_image.startsWith('/')) {
      transformed.background_image = `${process.env.NEXT_PUBLIC_BASE_URL || ''}${transformed.background_image}`
    }
  }
  
  // Ensure boolean fields are properly typed
  if (componentName === 'BookYourEventLeft') {
    transformed.show_image = Boolean(transformed.show_image)
  }
  
  transformed.enabled = Boolean(transformed.enabled)
  
  return transformed
}

/**
 * Get component field schema for validation
 * @param {string} componentName - Name of the component
 * @returns {Array} Field schema array
 */
export function getComponentFieldSchema(componentName) {
  switch (componentName) {
    case 'BookYourEventHalf':
      return [
        { key: 'enabled', type: 'checkbox', required: false },
        { key: 'title', type: 'text', required: false },
        { key: 'subtitle', type: 'text', required: false },
        { key: 'description', type: 'textarea', required: false },
        { key: 'background_image', type: 'image', required: false },
        { key: 'image_alt', type: 'text', required: false },
        { key: 'secondary_image', type: 'image', required: false },
        { key: 'cta_text', type: 'text', required: false },
        { key: 'cta_link', type: 'url', required: false }
      ]
    
    case 'BookYourEventLeft':
      return [
        { key: 'enabled', type: 'checkbox', required: false },
        { key: 'title', type: 'text', required: false },
        { key: 'subtitle', type: 'text', required: false },
        { key: 'description', type: 'richtext', required: false },
        { key: 'background_image', type: 'image', required: false },
        { key: 'image_alt', type: 'text', required: false },
        { key: 'secondary_image', type: 'image', required: false },
        { key: 'image_position', type: 'text', required: false },
        { key: 'show_image', type: 'checkbox', required: false },
        { key: 'cta_text', type: 'text', required: false },
        { key: 'cta_link', type: 'url', required: false }
      ]
    
    default:
      return []
  }
}
