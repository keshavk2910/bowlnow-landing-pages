import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../../../components/admin/AdminLayout'
import PageContentForm from '../../../../../../components/PageContentForm'

export default function EditPagePage() {
  const router = useRouter()
  const { slug, pageId } = router.query
  const [site, setSite] = useState(null)
  const [page, setPage] = useState(null)
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] })

  useEffect(() => {
    if (slug && pageId) {
      fetchPageData()
    }
  }, [slug, pageId])

  // Re-run validation when formData or template changes
  useEffect(() => {
    const result = validateSliderRequirements()
    setValidationResult(result)
    console.log('Validation updated:', result)
  }, [formData, template])

  async function fetchPageData() {
    try {
      const [siteRes, pageRes] = await Promise.all([
        fetch(`/api/admin/sites/by-slug/${slug}`),
        fetch(`/api/admin/pages/${pageId}`)
      ])

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSite(siteData.site)
      }

      if (pageRes.ok) {
        const pageData = await pageRes.json()
        setPage(pageData.page)
        setTemplate(pageData.page.templates)
        setFormData(pageData.page.content || {})
      }
    } catch (error) {
      console.error('Error fetching page data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    // Validate slider field requirements
    if (template && template.config_schema.fields) {
      for (const field of template.config_schema.fields) {
        if (field.type === 'slider' && field.required) {
          const slides = formData[field.key] || []
          const minSlides = field.minSlides || 1
          
          if (slides.length < minSlides) {
            alert(`"${field.label}" requires at least ${minSlides} slides. Currently has ${slides.length}.`)
            return
          }
        }
      }
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData,
          pipeline_id: formData.pipeline_id,
          stage_mappings: formData.stage_mappings,
          is_published: page.is_published
        })
      })

      if (response.ok) {
        alert('Page updated successfully!')
        router.push(`/admin/sites/${slug}?tab=pages`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update page')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      alert('Failed to update page')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
  }

  // Validate all slider requirements
  const validateSliderRequirements = () => {
    if (!template || !template.config_schema || !template.config_schema.fields) {
      return { isValid: true, errors: [] }
    }
    
    const errors = []
    
    for (const field of template.config_schema.fields) {
      if (field.type === 'slider') {
        const slides = formData[field.key] || []
        const minSlides = field.minSlides || 1
        
        // Check if field is required or has minimum slides requirement
        if (field.required || minSlides > 0) {
          if (slides.length < minSlides) {
            errors.push(`"${field.label}" requires at least ${minSlides} slides (currently has ${slides.length})`)
          }
        }
      }
      
      // Also validate other required fields
      if (field.required && field.type !== 'slider') {
        const value = formData[field.key]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(`"${field.label}" is required`)
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const canSave = validationResult.isValid && !saving

  const togglePublished = async () => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !page.is_published
        })
      })

      if (response.ok) {
        setPage(prev => ({ ...prev, is_published: !prev.is_published }))
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!page || !template) {
    return (
      <AdminLayout title="Page Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <Link
            href={`/admin/sites/${slug}?tab=pages`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Pages
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit ${page.name} - ${site?.client_name}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/admin/sites/${slug}?tab=pages`}
              className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Pages</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit {page.name}</h1>
              <p className="text-gray-600">{page.page_type} page • {template.name}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Preview
            </Link>
            <button
              onClick={togglePublished}
              className={`px-4 py-2 rounded-md transition-colors ${
                page.is_published 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {page.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Validation Summary */}
        {!validationResult.isValid && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Page Validation Errors</h3>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Editor */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Page Content</h3>
              <p className="text-sm text-gray-600">Configure your page content and settings</p>
            </div>
            
            <div className="p-6">
              <PageContentForm
                template={template}
                formData={formData}
                onChange={setFormData}
                siteId={site.id}
                pageId={page.id}
                siteSlug={slug}
                defaultPipeline={site.default_pipeline_id}
                defaultStageMapping={site.default_stage_mappings}
                validationResult={validationResult}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <p className="text-sm text-gray-600">See how your page will look</p>
            </div>
            
            <div className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${page.slug}?preview=true`}
                  className="w-full h-96"
                  title="Page Preview"
                />
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Open in New Tab
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end space-x-3">
          <Link
            href={`/admin/sites/${slug}?tab=pages`}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <div className="relative group">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !canSave
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              title={!validationResult.isValid ? validationResult.errors.join('\n') : ''}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            
            {/* Error tooltip */}
            {!validationResult.isValid && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function ExclamationTriangleIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.766 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}