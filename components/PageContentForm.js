import { useState, useEffect } from 'react'
import FileUpload from './FileUpload'
import SliderField from './TemplateComponents/SliderField'

export default function PageContentForm({ 
  template, 
  formData, 
  onChange, 
  siteId, 
  pageId,
  validationResult = { isValid: true, errors: [] }
}) {
  const handleFieldChange = (fieldKey, value) => {
    onChange({ ...formData, [fieldKey]: value })
  }

  if (!template || !template.config_schema || !template.config_schema.fields) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No template configuration available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {template.config_schema.fields?.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={field.label}
              required={field.required}
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              rows={3}
              value={formData[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={field.label}
              required={field.required}
            />
          )}
          
          {field.type === 'url' && (
            <input
              type="url"
              value={formData[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com"
              required={field.required}
            />
          )}
          
          {field.type === 'image' && (
            <FileUpload
              value={formData[field.key]}
              onFileUploaded={(file) => handleFieldChange(field.key, file?.url || null)}
              siteId={siteId}
              pageId={pageId}
              fieldKey={field.key}
              allowedTypes={['image']}
              maxSizeMB={5}
              multiple={false}
            />
          )}
          
          {field.type === 'slider' && (
            <SliderField
              value={formData[field.key] || []}
              onChange={(slides) => handleFieldChange(field.key, slides)}
              siteId={siteId}
              pageId={pageId}
              fieldKey={field.key}
              label={field.label}
              description={field.description}
              minSlides={field.minSlides || 1}
              maxSlides={field.maxSlides || 10}
              required={field.required}
            />
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            {field.description || `Configure the ${field.label.toLowerCase()} for your page`}
          </p>
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