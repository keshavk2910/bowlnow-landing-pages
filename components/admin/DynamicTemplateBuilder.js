import { useState, useEffect } from 'react'
import SectionSelector from './SectionSelector'
import SectionImportModal from './SectionImportModal'
import SectionBasedForm from '../SectionBasedForm'
import FileUpload from '../FileUpload'
import TableField from '../TemplateComponents/TableField'
import RichTextField from '../TemplateComponents/RichTextField'

export default function DynamicTemplateBuilder({ 
  template, 
  formData, 
  onChange, 
  siteId, 
  pageId,
  siteSlug 
}) {
  const [selectedSections, setSelectedSections] = useState([])
  const [showSectionSelector, setShowSectionSelector] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    // Initialize selected sections from template data
    if (template?.sections) {
      setSelectedSections(template.sections)
    }
  }, [template])

  const handleSectionSelect = (section) => {
    const isAlreadySelected = selectedSections.some(selected => selected.id === section.id)
    
    if (isAlreadySelected) {
      // Remove section
      const updatedSections = selectedSections.filter(selected => selected.id !== section.id)
      setSelectedSections(updatedSections)
      
      // Remove section data from form data
      const updatedFormData = { ...formData }
      delete updatedFormData[section.component_name.toLowerCase()]
      onChange(updatedFormData)
    } else {
      // Add section
      const updatedSections = [...selectedSections, section]
      setSelectedSections(updatedSections)
      
      // Initialize section data
      const updatedFormData = { ...formData }
      updatedFormData[section.component_name.toLowerCase()] = {
        enabled: true,
        ...section.config_schema?.fields?.reduce((acc, field) => {
          acc[field.key] = field.default || ''
          return acc
        }, {})
      }
      onChange(updatedFormData)
    }
  }

  const handleImportSections = (sectionsToImport) => {
    const newSections = [...selectedSections]
    const updatedFormData = { ...formData }
    
    sectionsToImport.forEach(section => {
      // Check if section already exists
      if (!newSections.some(s => s.id === section.id)) {
        newSections.push(section)
        
        // Initialize section data
        const sectionKey = section.component_name.toLowerCase()
        updatedFormData[sectionKey] = {
          enabled: true,
          ...section.config_schema?.fields?.reduce((acc, field) => {
            acc[field.key] = field.default || ''
            return acc
          }, {})
        }
      }
    })
    
    setSelectedSections(newSections)
    onChange(updatedFormData)
  }

  const removeSection = (sectionId) => {
    const section = selectedSections.find(s => s.id === sectionId)
    if (section) {
      const updatedSections = selectedSections.filter(s => s.id !== sectionId)
      setSelectedSections(updatedSections)
      
      // Remove section data from form data
      const updatedFormData = { ...formData }
      delete updatedFormData[section.component_name.toLowerCase()]
      onChange(updatedFormData)
    }
  }

  const reorderSections = (fromIndex, toIndex) => {
    const updatedSections = [...selectedSections]
    const [movedSection] = updatedSections.splice(fromIndex, 1)
    updatedSections.splice(toIndex, 0, movedSection)
    setSelectedSections(updatedSections)
  }

  return (
    <div className="space-y-6">
      {/* Section Management */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Template Sections ({selectedSections.length})
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Import Sections
            </button>
            <button
              onClick={() => setShowSectionSelector(!showSectionSelector)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showSectionSelector ? 'Hide' : 'Add'} Sections
            </button>
          </div>
        </div>

        {/* Section Selector */}
        {showSectionSelector && (
          <div className="mb-6">
            <SectionSelector
              onSectionSelect={handleSectionSelect}
              selectedSections={selectedSections}
            />
          </div>
        )}

        {/* Selected Sections List */}
        <div className="space-y-3">
          {selectedSections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => reorderSections(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => reorderSections(index, Math.min(selectedSections.length - 1, index + 1))}
                    disabled={index === selectedSections.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{section.name}</h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {selectedSections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No sections selected. Click "Add Sections" to get started.</p>
          </div>
        )}
      </div>

      {/* Section Configuration */}
      {selectedSections.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Configure Sections
          </h3>
          
          <DynamicSectionForm
            sections={selectedSections}
            formData={formData}
            onChange={onChange}
            siteId={siteId}
            pageId={pageId}
            siteSlug={siteSlug}
          />
        </div>
      )}

      {/* Import Modal */}
      <SectionImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportSections}
      />
    </div>
  )
}

function DynamicSectionForm({ sections, formData, onChange, siteId, pageId, siteSlug }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleFieldChange = (sectionKey, fieldKey, value) => {
    const updatedData = { ...formData }
    
    if (!updatedData[sectionKey]) {
      updatedData[sectionKey] = { enabled: true }
    }
    
    updatedData[sectionKey][fieldKey] = value
    onChange(updatedData)
  }

  const renderField = (section, field) => {
    const sectionKey = section.component_name.toLowerCase()
    const value = formData[sectionKey]?.[field.key] || ''

    switch (field.type) {
      case 'table':
        return (
          <TableField
            value={value || []}
            onChange={(tableData) => handleFieldChange(sectionKey, field.key, tableData)}
            label={field.label}
            description={field.description}
            columns={field.columns || []}
            minRows={field.minRows || 0}
            maxRows={field.maxRows || 50}
            required={field.required}
            siteId={siteId}
            pageId={pageId}
          />
        )
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
            required={field.required}
          />
        )
      
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
            required={field.required}
          />
        )
      
      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com"
            required={field.required}
          />
        )
      
      case 'image':
        return (
          <FileUpload
            value={value}
            onFileUploaded={(file) => handleFieldChange(sectionKey, field.key, file?.url || null)}
            siteId={siteId}
            pageId={pageId}
            fieldKey={`${sectionKey}.${field.key}`}
            allowedTypes={['image']}
            maxSizeMB={5}
            multiple={false}
          />
        )
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        )
      
      case 'richtext':
        return (
          <RichTextField
            value={value || ''}
            onChange={(content) => handleFieldChange(sectionKey, field.key, content)}
            label={field.label}
            description={field.description}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        )
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(sectionKey, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.label}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg">
          <div 
            className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSectionExpansion(section.id)}
          >
            <div>
              <h4 className="font-medium text-gray-900">{section.name}</h4>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <div className="text-gray-500">
              {expandedSections[section.id] ? '▼' : '▶'}
            </div>
          </div>

          {expandedSections[section.id] && (
            <div className="p-4 space-y-4">
              {section.config_schema?.fields?.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(section, field)}
                  {field.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {field.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
