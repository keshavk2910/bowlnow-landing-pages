import { 
  mapSectionDataToComponent, 
  validateImageField, 
  getDefaultImageFields,
  transformFormDataForStorage 
} from '../../../utils/componentFieldMapping'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { componentName, sectionData, testType = 'mapping' } = req.body

    let result = {}

    switch (testType) {
      case 'mapping':
        result = {
          componentName,
          originalData: sectionData,
          mappedData: mapSectionDataToComponent(componentName, sectionData),
          defaultFields: getDefaultImageFields(componentName)
        }
        break

      case 'validation':
        result = {
          imageData: sectionData,
          validation: validateImageField(sectionData)
        }
        break

      case 'transformation':
        result = {
          originalData: sectionData,
          transformedData: transformFormDataForStorage(componentName, sectionData)
        }
        break

      case 'full-test':
        // Run all tests
        const mapped = mapSectionDataToComponent(componentName, sectionData)
        const validation = validateImageField(sectionData)
        const transformed = transformFormDataForStorage(componentName, sectionData)
        const defaults = getDefaultImageFields(componentName)

        result = {
          componentName,
          tests: {
            mapping: {
              original: sectionData,
              mapped: mapped,
              success: mapped !== null
            },
            validation: {
              data: sectionData,
              result: validation,
              success: validation.isValid
            },
            transformation: {
              original: sectionData,
              transformed: transformed,
              success: transformed !== null
            },
            defaults: {
              fields: defaults,
              success: Object.keys(defaults).length > 0
            }
          },
          summary: {
            allTestsPassed: mapped !== null && validation.isValid && transformed !== null && Object.keys(defaults).length > 0,
            passedTests: [
              mapped !== null ? 'mapping' : null,
              validation.isValid ? 'validation' : null,
              transformed !== null ? 'transformation' : null,
              Object.keys(defaults).length > 0 ? 'defaults' : null
            ].filter(Boolean)
          }
        }
        break

      default:
        return res.status(400).json({ error: 'Invalid test type' })
    }

    res.status(200).json({
      success: true,
      testType,
      result
    })

  } catch (error) {
    console.error('Error in image field mapping test:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Test failed'
    })
  }
}
