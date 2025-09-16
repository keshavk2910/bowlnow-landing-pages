import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../../../components/admin/AdminLayout'
import PageContentForm from '../../../../../../components/PageContentForm'

export default function EditPageMultiStep() {
  const router = useRouter()
  const { slug, pageId } = router.query
  const [currentStep, setCurrentStep] = useState(1)
  const [site, setSite] = useState(null)
  const [page, setPage] = useState(null)
  const [template, setTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] })
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    slug: '',
    page_type: '',
    template_id: '',
    is_homepage: false,
    is_published: false
  })
  
  const [pageContent, setPageContent] = useState({})

  useEffect(() => {
    if (slug && pageId) {
      fetchPageData()
    }
  }, [slug, pageId])

  // Validate content based on template requirements
  useEffect(() => {
    if (template && currentStep === 2) {
      const result = validatePageContent()
      setValidationResult(result)
    }
  }, [pageContent, template, currentStep])

  async function fetchPageData() {
    try {
      const [siteRes, pageRes, templatesRes] = await Promise.all([
        fetch(`/api/admin/sites/by-slug/${slug}`),
        fetch(`/api/admin/pages/${pageId}`),
        fetch('/api/admin/templates')
      ])

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSite(siteData.site)
      }

      if (pageRes.ok) {
        const pageData = await pageRes.json()
        setPage(pageData.page)
        setTemplate(pageData.page.templates)
        
        // Pre-fill basic info
        setBasicInfo({
          name: pageData.page.name,
          slug: pageData.page.slug,
          page_type: pageData.page.page_type,
          template_id: pageData.page.template_id,
          is_homepage: pageData.page.is_homepage,
          is_published: pageData.page.is_published
        })
        
        // Pre-fill content including pipeline data
        setPageContent({
          ...pageData.page.content,
          pipeline_id: pageData.page.pipeline_id,
          stage_mappings: pageData.page.stage_mappings
        })
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setTemplates(templatesData.templates)
      }
    } catch (error) {
      console.error('Error fetching page data:', error)
    } finally {
      setLoading(false)
    }
  }

  function validatePageContent() {
    if (!template || !template.config_schema || !template.config_schema.fields) {
      return { isValid: true, errors: [] }
    }
    
    const errors = []
    
    for (const field of template.config_schema.fields) {
      if (field.type === 'slider') {
        const slides = pageContent[field.key] || []
        const minSlides = field.minSlides || 1
        
        if (field.required || minSlides > 0) {
          if (slides.length < minSlides) {
            errors.push(`"${field.label}" requires at least ${minSlides} slides (currently has ${slides.length})`)
          }
        }
      } else if (field.required) {
        const value = pageContent[field.key]
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

  async function handleUpdatePage() {
    setSaving(true)

    try {
      // Update basic info first
      const basicInfoResponse = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basicInfo)
      })

      if (!basicInfoResponse.ok) {
        const error = await basicInfoResponse.json()
        throw new Error(error.error || 'Failed to update basic info')
      }

      // Update content and pipeline configuration
      const contentResponse = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: pageContent,
          pipeline_id: pageContent.pipeline_id,
          stage_mappings: pageContent.stage_mappings
        })
      })

      if (!contentResponse.ok) {
        const error = await contentResponse.json()
        throw new Error(error.error || 'Failed to update content')
      }

      setCurrentStep(3) // Success step
    } catch (error) {
      console.error('Error updating page:', error)
      alert(error.message || 'Failed to update page')
    } finally {
      setSaving(false)
    }
  }

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const canProceedToStep2 = basicInfo.name && basicInfo.slug && basicInfo.template_id
  const canUpdatePage = validationResult.isValid && template

  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!page || !site) {
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
    <AdminLayout title={`Edit ${page.name} - ${site.client_name}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/admin/sites/${slug}?tab=pages`}
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to {site.client_name} Pages</span>
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <StepIndicator step={1} currentStep={currentStep} title="Page Info" />
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <StepIndicator step={2} currentStep={currentStep} title="Content & Pipeline" />
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <StepIndicator step={3} currentStep={currentStep} title="Updated" />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Page Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update the basic information for "{page.name}".
                </p>
              </div>

              <div className="space-y-6">
                {/* Page Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Page Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={basicInfo.name}
                      onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Page Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                      Page URL *
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost:3000'}/{site.slug}/
                      </span>
                      <input
                        type="text"
                        id="slug"
                        required
                        value={basicInfo.slug}
                        onChange={(e) => handleBasicInfoChange('slug', e.target.value)}
                        className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="page-url"
                        pattern="[a-z0-9-]+"
                      />
                    </div>
                  </div>
                </div>

                {/* Page Type and Template */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="page_type" className="block text-sm font-medium text-gray-700">
                      Page Type *
                    </label>
                    <select
                      id="page_type"
                      required
                      value={basicInfo.page_type}
                      onChange={(e) => handleBasicInfoChange('page_type', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="landing">Landing Page</option>
                      <option value="parties">Party Events</option>
                      <option value="events">Events Booking</option>
                      <option value="bookings">Bookings Management</option>
                      <option value="checkout">Checkout Page</option>
                      <option value="thank-you">Thank You Page</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="template_id" className="block text-sm font-medium text-gray-700">
                      Template *
                    </label>
                    <select
                      id="template_id"
                      required
                      value={basicInfo.template_id}
                      onChange={(e) => handleBasicInfoChange('template_id', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a template</option>
                      {templates
                        .filter(t => t.type === basicInfo.page_type)
                        .map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Page Settings */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="is_homepage"
                      type="checkbox"
                      checked={basicInfo.is_homepage}
                      onChange={(e) => handleBasicInfoChange('is_homepage', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_homepage" className="ml-2 block text-sm text-gray-900">
                      Set as homepage
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="is_published"
                      type="checkbox"
                      checked={basicInfo.is_published}
                      onChange={(e) => handleBasicInfoChange('is_published', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                      Published
                    </label>
                  </div>
                </div>

                {/* Current Template Info */}
                {template && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Current Template: {template.name}</h4>
                    <p className="text-sm text-blue-700 mb-3">{template.category} template</p>
                    <div className="text-xs text-blue-600">
                      Fields: {template.config_schema.fields?.length || 0} customizable fields
                    </div>
                  </div>
                )}
              </div>

              {/* Step 1 Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <Link
                  href={`/admin/sites/${slug}?tab=pages`}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !canProceedToStep2
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Next: Edit Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content Configuration */}
        {currentStep === 2 && template && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Page Content & Pipeline</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update content for "{basicInfo.name}" and configure pipeline settings.
                </p>
              </div>

              <PageContentForm
                template={template}
                formData={pageContent}
                onChange={setPageContent}
                siteId={site.id}
                pageId={pageId}
                siteSlug={slug}
                defaultPipeline={site.default_pipeline_id}
                defaultStageMapping={site.default_stage_mappings}
                validationResult={validationResult}
              />

              {/* Step 2 Actions */}
              <div className="flex justify-between space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back: Page Info
                </button>
                
                <div className="relative group">
                  <button
                    onClick={handleUpdatePage}
                    disabled={!canUpdatePage || saving}
                    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !canUpdatePage || saving
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={!validationResult.isValid ? validationResult.errors.join('\n') : ''}
                  >
                    {saving ? 'Updating Page...' : 'Update Page'}
                  </button>
                  
                  {/* Error tooltip */}
                  {!validationResult.isValid && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      <div className="space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                      <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Updated Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  "{basicInfo.name}" has been updated with your changes.
                </p>

                <div className="flex justify-center space-x-4">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${basicInfo.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Updated Page
                  </Link>
                  
                  <button
                    onClick={() => {
                      setCurrentStep(1)
                      fetchPageData() // Refresh data
                    }}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Again
                  </button>
                  
                  <Link
                    href={`/admin/sites/${slug}?tab=pages`}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Back to Pages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// Step Indicator Component
function StepIndicator({ step, currentStep, title }) {
  const isActive = step === currentStep
  const isCompleted = step < currentStep

  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isCompleted 
          ? 'bg-green-500 text-white'
          : isActive 
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-300 text-gray-600'
      }`}>
        {isCompleted ? <CheckIcon className="w-4 h-4" /> : step}
      </div>
      <span className={`ml-2 text-sm font-medium ${
        isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
      }`}>
        {title}
      </span>
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}