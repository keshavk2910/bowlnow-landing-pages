/**
 * Test script to verify image field mapping functionality
 * Run with: node scripts/test-image-field-mapping.js
 */

import { 
  mapSectionDataToComponent, 
  validateImageField, 
  getDefaultImageFields,
  transformFormDataForStorage,
  getComponentFieldSchema
} from '../utils/componentFieldMapping.js'

// Test data
const testBookYourEventHalfData = {
  enabled: true,
  title: 'Test Event Half',
  subtitle: 'Test subtitle',
  description: 'Test description',
  background_image: 'https://example.com/image.jpg',
  image_alt: 'Test alt text',
  cta_text: 'Test CTA',
  cta_link: 'https://example.com'
}

const testBookYourEventLeftData = {
  enabled: true,
  title: 'Test Event Left',
  subtitle: 'Test subtitle',
  description: 'Test description',
  background_image: 'https://example.com/image.jpg',
  image_alt: 'Test alt text',
  image_position: 'right',
  show_image: true,
  cta_text: 'Test CTA',
  cta_link: 'https://example.com'
}

function runTests() {
  console.log('🧪 Testing Image Field Mapping...\n')

  // Test 1: BookYourEventHalf mapping
  console.log('1. Testing BookYourEventHalf mapping:')
  const mappedHalf = mapSectionDataToComponent('BookYourEventHalf', testBookYourEventHalfData)
  console.log('✅ Mapped data:', JSON.stringify(mappedHalf, null, 2))

  // Test 2: BookYourEventLeft mapping
  console.log('\n2. Testing BookYourEventLeft mapping:')
  const mappedLeft = mapSectionDataToComponent('BookYourEventLeft', testBookYourEventLeftData)
  console.log('✅ Mapped data:', JSON.stringify(mappedLeft, null, 2))

  // Test 3: Image field validation
  console.log('\n3. Testing image field validation:')
  const validImageData = { background_image: 'https://example.com/image.jpg', image_alt: 'Valid alt text' }
  const invalidImageData = { background_image: 'invalid-url', image_alt: 'a'.repeat(300) }
  
  const validResult = validateImageField(validImageData)
  const invalidResult = validateImageField(invalidImageData)
  
  console.log('✅ Valid image data result:', validResult)
  console.log('❌ Invalid image data result:', invalidResult)

  // Test 4: Default image fields
  console.log('\n4. Testing default image fields:')
  const defaultHalf = getDefaultImageFields('BookYourEventHalf')
  const defaultLeft = getDefaultImageFields('BookYourEventLeft')
  
  console.log('✅ BookYourEventHalf defaults:', defaultHalf)
  console.log('✅ BookYourEventLeft defaults:', defaultLeft)

  // Test 5: Form data transformation
  console.log('\n5. Testing form data transformation:')
  const formData = { ...testBookYourEventLeftData, show_image: 'true' } // String boolean
  const transformed = transformFormDataForStorage('BookYourEventLeft', formData)
  
  console.log('✅ Transformed data:', JSON.stringify(transformed, null, 2))
  console.log('✅ show_image is boolean:', typeof transformed.show_image === 'boolean')

  // Test 6: Component field schema
  console.log('\n6. Testing component field schema:')
  const halfSchema = getComponentFieldSchema('BookYourEventHalf')
  const leftSchema = getComponentFieldSchema('BookYourEventLeft')
  
  console.log('✅ BookYourEventHalf schema fields:', halfSchema.length)
  console.log('✅ BookYourEventLeft schema fields:', leftSchema.length)
  
  // Check for image fields in schema
  const halfHasImageField = halfSchema.some(field => field.key === 'background_image' && field.type === 'image')
  const leftHasImageField = leftSchema.some(field => field.key === 'background_image' && field.type === 'image')
  
  console.log('✅ BookYourEventHalf has image field:', halfHasImageField)
  console.log('✅ BookYourEventLeft has image field:', leftHasImageField)

  console.log('\n🎉 All tests completed!')
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}

export { runTests }
