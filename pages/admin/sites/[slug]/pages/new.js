import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../../components/admin/AdminLayout'
import PageContentForm from '../../../../../components/PageContentForm'

export default function NewPageMultiStep() {
  const router = useRouter()
  const { slug } = router.query
  const [currentStep, setCurrentStep] = useState(1)
  const [site, setSite] = useState(null)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createdPage, setCreatedPage] = useState(null)
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] })
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    slug: '',
    page_type: 'landing',
    template_id: '',
    is_homepage: false,
    is_published: false
  })
  
  const [pageContent, setPageContent] = useState({})

  useEffect(() => {
    if (slug) {
      fetchSiteAndTemplates()
    }
  }, [slug])

  useEffect(() => {
    // Auto-generate slug from name
    if (basicInfo.name) {
      const generatedSlug = basicInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setBasicInfo(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [basicInfo.name])

  useEffect(() => {
    // Update selected template when template_id changes
    if (basicInfo.template_id && templates.length > 0) {
      const template = templates.find(t => t.id === basicInfo.template_id)
      setSelectedTemplate(template)
      // Reset page content when template changes
      setPageContent({})
    }
  }, [basicInfo.template_id, templates])

  // Validate content based on template requirements
  useEffect(() => {
    if (selectedTemplate && currentStep === 2) {
      const result = validatePageContent()
      setValidationResult(result)
    }
  }, [pageContent, selectedTemplate, currentStep])

  async function fetchSiteAndTemplates() {
    try {
      const [siteRes, templatesRes] = await Promise.all([
        fetch(`/api/admin/sites/by-slug/${slug}`),
        fetch('/api/admin/templates')
      ])

      if (siteRes.ok) {
        const siteData = await siteRes.json()
        setSite(siteData.site)
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setTemplates(templatesData.templates)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function validatePageContent() {
    if (!selectedTemplate || !selectedTemplate.config_schema || !selectedTemplate.config_schema.fields) {
      return { isValid: true, errors: [] }
    }
    
    const errors = []
    
    for (const field of selectedTemplate.config_schema.fields) {
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

  async function handleCreatePage() {
    setCreating(true)

    try {
      // Set default content based on template
      let defaultContent = pageContent
      if (selectedTemplate && Object.keys(pageContent).length === 0) {
        defaultContent = getDefaultContentForTemplate(selectedTemplate, basicInfo.name)
      }

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basicInfo,
          site_id: site.id,
          content: { ...defaultContent, ...pageContent }
        })
      })

      if (response.ok) {
        const { page } = await response.json()
        setCreatedPage(page)
        setCurrentStep(3) // Success step
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page')
    } finally {
      setCreating(false)
    }
  }

  function getDefaultContentForTemplate(template, pageName) {
    const defaultContent = {}
    
    if (template.config_schema.fields) {
      template.config_schema.fields.forEach(field => {
        switch (field.key) {
          case 'hero_title':
            defaultContent[field.key] = `Welcome to ${pageName}`
            break
          case 'hero_subtitle':
            defaultContent[field.key] = 'Experience excellence with our services'
            break
          case 'title':
            defaultContent[field.key] = pageName
            break
          case 'cta_text':
            defaultContent[field.key] = 'Get Started'
            break
          case 'cta_link':
            defaultContent[field.key] = '#contact'
            break
          default:
            if (field.required && field.type !== 'slider') {
              defaultContent[field.key] = `Default ${field.label}`
            }
        }
      })
    }
    
    return defaultContent
  }

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const canProceedToStep2 = basicInfo.name && basicInfo.slug && basicInfo.template_id
  const canCreatePage = validationResult.isValid && selectedTemplate

  if (!site) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Create Page - ${site.client_name}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/admin/sites/${slug}?tab=pages`}
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to {site.client_name}</span>
          </Link>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <StepIndicator step={1} currentStep={currentStep} title="Page Info" />
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <StepIndicator step={2} currentStep={currentStep} title="Content" />
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <StepIndicator step={3} currentStep={currentStep} title="Success" />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Page Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set up the basic information for your new page.
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
                      placeholder="About Us"
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
                        placeholder="about-us"
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
                      Publish immediately
                    </label>
                  </div>
                </div>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Template: {selectedTemplate.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{selectedTemplate.category} template</p>
                        <div className="text-xs text-gray-500">
                          {selectedTemplate.config_schema?.sections?.length || selectedTemplate.config_schema?.fields?.length || 0} {selectedTemplate.config_schema?.sections ? 'sections' : 'fields'}
                        </div>
                        {selectedTemplate.component_file && (
                          <div className="text-xs text-blue-600 mt-2">
                            Component: {selectedTemplate.component_file}
                          </div>
                        )}
                      </div>
                      
                      {selectedTemplate.template_image_url && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Template Preview
                          </label>
                          <div 
                            className="relative h-32 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => window.open(selectedTemplate.template_image_url, '_blank')}
                          >
                            <img
                              src={selectedTemplate.template_image_url}
                              alt={selectedTemplate.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                  Next: Configure Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content Configuration */}
        {currentStep === 2 && selectedTemplate && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Configure Page Content</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customize the content for "{basicInfo.name}" using the {selectedTemplate.name} template.
                </p>
              </div>

              <PageContentForm
                template={selectedTemplate}
                formData={pageContent}
                onChange={setPageContent}
                siteId={site.id}
                pageId={null} // No page ID yet since we're creating
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
                    onClick={handleCreatePage}
                    disabled={!canCreatePage || creating}
                    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !canCreatePage || creating
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={!validationResult.isValid ? validationResult.errors.join('\n') : ''}
                  >
                    {creating ? 'Creating Page...' : 'Create Page'}
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
        {currentStep === 3 && createdPage && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Page Created Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  "{createdPage.name}" has been created and is ready to use.
                </p>

                <div className="flex justify-center space-x-4">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${site.slug}/${createdPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Page
                  </Link>
                  
                  <Link
                    href={`/admin/sites/${slug}/pages/${createdPage.id}/edit`}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Page
                  </Link>
                  
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