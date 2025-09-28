import { useState, useEffect } from 'react'
import FileUpload from './FileUpload'
import SliderField from './TemplateComponents/SliderField'
import FAQField from './TemplateComponents/FAQField'
import RichTextField from './TemplateComponents/RichTextField'
import TableField from './TemplateComponents/TableField'

export default function SectionBasedForm({ 
  template, 
  formData, 
  onChange, 
  siteId, 
  pageId,
  siteSlug,
  defaultPipeline,
  defaultStageMapping,
  validationResult = { isValid: true, errors: [] }
}) {
  const [enabledSections, setEnabledSections] = useState({})
  const [expandedSections, setExpandedSections] = useState({}) // Track which sections are expanded
  const [initialized, setInitialized] = useState(false) // Track if we've initialized

  useEffect(() => {
    // Initialize enabled sections based on existing data or defaults (only once)
    if (template?.config_schema?.sections && !initialized) {
      const initialEnabled = {}
      template.config_schema.sections.forEach(section => {
        // Required sections are always enabled
        if (section.required) {
          initialEnabled[section.key] = true
        } else {
          // Check if section is explicitly enabled or has data
          const explicitlyEnabled = formData[section.key]?.enabled
          const hasData = section.fields?.some(field => {
            const nestedValue = formData[section.key]?.[field.key] // New nested format
            const dotValue = formData[`${section.key}.${field.key}`] // Dot notation format
            const legacyValue = formData[field.key] // Legacy format
            
            const value = nestedValue || dotValue || legacyValue
            return value && (
              (typeof value === 'string' && value.trim() !== '') ||
              (Array.isArray(value) && value.length > 0) ||
              (typeof value === 'object' && Object.keys(value).length > 0)
            )
          })
          
          // Section is enabled if explicitly set to true OR if it has data (for backward compatibility)
          initialEnabled[section.key] = explicitlyEnabled !== undefined ? explicitlyEnabled : (hasData || false)
          console.log(`Section ${section.key} enabled:`, initialEnabled[section.key], '(explicit:', explicitlyEnabled, 'hasData:', hasData, ')')
        }
      })
      setEnabledSections(initialEnabled)
      console.log('Initial enabled sections:', initialEnabled)
      
      // Initialize all sections as collapsed by default
      const initialExpanded = {}
      template.config_schema.sections.forEach(section => {
        initialExpanded[section.key] = false
      })
      setExpandedSections(initialExpanded)
      
      // Ensure all sections have their enabled state in the data
      const updatedData = { ...formData }
      let needsUpdate = false
      
      template.config_schema.sections.forEach(section => {
        if (!updatedData[section.key]) {
          updatedData[section.key] = {}
          needsUpdate = true
        }
        
        if (updatedData[section.key].enabled === undefined) {
          updatedData[section.key].enabled = initialEnabled[section.key]
          needsUpdate = true
        }
      })
      
      if (needsUpdate) {
        console.log('Initializing section enabled states:', updatedData)
        onChange(updatedData)
      }
      
      setInitialized(true) // Mark as initialized
    }
  }, [template, initialized]) // Only run when template changes or not yet initialized

  const handleFieldChange = (sectionKey, fieldKey, value) => {
    const updatedData = { ...formData }
    
    // Initialize section object if it doesn't exist
    if (!updatedData[sectionKey]) {
      updatedData[sectionKey] = {
        enabled: enabledSections[sectionKey] !== false // Default to enabled unless explicitly disabled
      }
    }
    
    // Ensure section has enabled state
    if (updatedData[sectionKey].enabled === undefined) {
      updatedData[sectionKey].enabled = enabledSections[sectionKey] !== false
    }
    
    // Set the field value in the section object
    updatedData[sectionKey][fieldKey] = value
    
    console.log('Section field changed:', `${sectionKey}.${fieldKey}`, '=', value)
    console.log('Updated form data:', updatedData)
    onChange(updatedData)
  }

  const toggleSection = (sectionKey, enabled) => {
    const wasDisabled = !enabledSections[sectionKey]
    setEnabledSections(prev => ({ ...prev, [sectionKey]: enabled }))
    
    // Auto-open accordion when section is enabled (if it was previously disabled)
    if (enabled && wasDisabled) {
      setExpandedSections(prev => ({ ...prev, [sectionKey]: true }))
      console.log(`Auto-opening accordion for enabled section: ${sectionKey}`)
    }
    
    // Update the section's enabled state in the data without deleting content
    const updatedData = { ...formData }
    
    // Initialize section object if it doesn't exist
    if (!updatedData[sectionKey]) {
      updatedData[sectionKey] = {}
    }
    
    // Set the enabled flag for the section
    updatedData[sectionKey].enabled = enabled
    
    console.log(`Section ${sectionKey} ${enabled ? 'enabled' : 'disabled'}`)
    console.log('Updated form data with section state:', updatedData)
    onChange(updatedData)
  }

  const toggleSectionExpansion = (sectionKey) => {
    setExpandedSections(prev => ({ 
      ...prev, 
      [sectionKey]: !prev[sectionKey] 
    }))
  }

  // Section-based validation function
  const validateSectionContent = () => {
    if (!template?.config_schema?.sections) {
      return { isValid: true, errors: [] }
    }
    
    const errors = []
    
    template.config_schema.sections.forEach(section => {
      // Only validate enabled sections (required sections are always enabled)
      const sectionEnabled = section.required || enabledSections[section.key]
      
      if (sectionEnabled) {
        section.fields?.forEach(field => {
          const sectionData = formData[section.key] || {}
          const value = sectionData[field.key]
          
          if (field.type === 'slider') {
            const slides = value || []
            const minSlides = field.minSlides || 1
            
            if (field.required && slides.length < minSlides) {
              errors.push(`${section.name}: "${field.label}" requires at least ${minSlides} slides (currently has ${slides.length})`)
            }
          } else if (field.type === 'faq') {
            const faqs = value || []
            const minFAQs = field.minFAQs || 1
            
            if (field.required && faqs.length < minFAQs) {
              errors.push(`${section.name}: "${field.label}" requires at least ${minFAQs} FAQs (currently has ${faqs.length})`)
            }
          } else if (field.required) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              errors.push(`${section.name}: "${field.label}" is required`)
            }
          }
        })
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Update validation result when needed
  useEffect(() => {
    if (template?.config_schema?.sections) {
      const result = validateSectionContent()
      if (validationResult.isValid !== result.isValid || validationResult.errors.length !== result.errors.length) {
        // Only update if validation actually changed to prevent loops
        validationResult.isValid = result.isValid
        validationResult.errors = result.errors
      }
    }
  }, [formData, enabledSections, template])

  const renderField = (section, field) => {
    const fullKey = `${section.key}.${field.key}` // For fieldKey prop
    const nestedValue = formData[section.key]?.[field.key] // New nested format
    const dotValue = formData[`${section.key}.${field.key}`] // Dot notation format  
    const legacyValue = formData[field.key] // Legacy format
    
    const value = nestedValue || dotValue || legacyValue || ''

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
            required={field.required}
          />
        )
      
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={value || ''}
            onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
            required={field.required}
          />
        )
      
      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
            required={field.required}
          />
        )
      
      case 'image':
        return (
          <FileUpload
            value={value}
            onFileUploaded={(file) => handleFieldChange(section.key, field.key, file?.url || null)}
            siteId={siteId}
            pageId={pageId}
            fieldKey={fullKey}
            allowedTypes={['image']}
            maxSizeMB={5}
            multiple={false}
          />
        )
      
      case 'slider':
        return (
          <SliderField
            value={value || []}
            onChange={(slides) => handleFieldChange(section.key, field.key, slides)}
            siteId={siteId}
            pageId={pageId}
            fieldKey={fullKey}
            label={field.label}
            description={field.description}
            minSlides={field.minSlides || 1}
            maxSlides={field.maxSlides || 10}
            required={field.required}
          />
        )
      
      case 'faq':
        return (
          <FAQField
            value={value || []}
            onChange={(faqs) => handleFieldChange(section.key, field.key, faqs)}
            label={field.label}
            description={field.description}
            minFAQs={field.minFAQs || 1}
            maxFAQs={field.maxFAQs || 20}
            required={field.required}
          />
        )

      case 'table':
        return (
          <TableField
            value={value || []}
            onChange={(tableData) => handleFieldChange(section.key, field.key, tableData)}
            label={field.label}
            description={field.description}
            columns={field.columns || []}
            minRows={field.minRows || 1}
            maxRows={field.maxRows || 50}
            required={field.required}
          />
        )
      
      case 'richtext':
        return (
          <RichTextField
            value={value || ''}
            onChange={(content) => handleFieldChange(section.key, field.key, content)}
            label={field.label}
            description={field.description}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        )
      
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(section.key, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
          />
        )
    }
  }

  if (!template || !template.config_schema || !template.config_schema.sections) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Template uses old field-based structure. Please update template to use sections.</p>
      </div>
    )
  }

  // Sort sections by order
  const sortedSections = [...template.config_schema.sections].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-8">
      {sortedSections.map((section) => (
        <div key={section.key} className="border border-gray-200 rounded-lg">
          {/* Section Header */}
          <div 
            className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSectionExpansion(section.key)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                {expandedSections[section.key] ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
            
            {!section.required && (
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${enabledSections[section.key] ? 'text-green-600' : 'text-gray-500'}`}>
                  {enabledSections[section.key] ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection(section.key, !enabledSections[section.key])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    enabledSections[section.key] ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enabledSections[section.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {section.required && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Required
              </span>
            )}
          </div>

          {/* Section Fields */}
          {(section.required || enabledSections[section.key]) && expandedSections[section.key] && (
            <div className="p-6 space-y-6">
              {section.fields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {renderField(section, field)}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {field.description || `Configure the ${field.label.toLowerCase()}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Disabled Section Message */}
          {!section.required && !enabledSections[section.key] && expandedSections[section.key] && (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">
                This section is disabled. Toggle above to enable and configure fields.
              </p>
            </div>
          )}

          {/* Collapsed Section Summary */}
          {!expandedSections[section.key] && (section.required || enabledSections[section.key]) && (
            <div className="px-6 py-3 bg-gray-25 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  {section.fields?.length || 0} fields configured
                </span>
                <span className="text-xs text-gray-500">
                  Click to expand and edit
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Validation Summary */}
      {!validationResult.isValid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Validation Errors</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExclamationTriangleIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.766 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}