import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../components/admin/AdminLayout'
import TemplateRenderer from '../../../../components/TemplateRenderer'

export default function TemplatePreviewPage() {
  const router = useRouter()
  const { templateId } = router.query
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (templateId) {
      fetchTemplate()
    }
  }, [templateId])

  async function fetchTemplate() {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data.template)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
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

  if (!template) {
    return (
      <AdminLayout title="Template Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <Link
            href="/admin/templates"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Templates
          </Link>
        </div>
      </AdminLayout>
    )
  }

  // Create sample data for preview
  const sampleSite = {
    id: 'preview',
    slug: 'preview',
    client_name: 'Sample Business',
    settings: {
      theme_color: '#4F46E5'
    },
    tracking_pixels: {}
  }

  const samplePage = {
    id: 'preview',
    name: template.name,
    slug: 'preview',
    page_type: template.type,
    templates: template
  }

  // Generate sample content based on template fields
  const sampleContent = {}
  if (template.config_schema.fields) {
    template.config_schema.fields.forEach(field => {
      switch (field.key) {
        case 'hero_title':
          sampleContent[field.key] = 'Welcome to Our Amazing Business'
          break
        case 'hero_subtitle':
          sampleContent[field.key] = 'Experience excellence with our premium services'
          break
        case 'title':
          sampleContent[field.key] = 'Sample Page Title'
          break
        case 'cta_text':
          sampleContent[field.key] = 'Get Started Today'
          break
        case 'cta_link':
          sampleContent[field.key] = '#contact'
          break
        case 'hero_background':
          sampleContent[field.key] = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
          break
        default:
          sampleContent[field.key] = `Sample ${field.label}`
      }
    })
  }

  return (
    <AdminLayout title={`Preview ${template.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/templates"
              className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Templates</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template Preview</h1>
              <p className="text-gray-600">{template.name} • {template.type} template</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/admin/templates/${templateId}/edit`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit Template
            </Link>
          </div>
        </div>

        {/* Template Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Template Type</h3>
              <p className="text-lg font-semibold text-gray-900">{template.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Category</h3>
              <p className="text-lg font-semibold text-gray-900">{template.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Fields</h3>
              <p className="text-lg font-semibold text-gray-900">
                {template.config_schema.fields?.length || 0} customizable fields
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-600">This is how the template looks with sample content</p>
          </div>
          
          <div className="p-6">
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <TemplateRenderer
                template={template}
                content={sampleContent}
                site={sampleSite}
                page={samplePage}
                sessionId="preview"
                onFormSubmit={() => alert('This is a preview - form submission disabled')}
                onCheckoutClick={() => alert('This is a preview - checkout disabled')}
              />
            </div>
          </div>
        </div>

        {/* Template Fields */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Template Fields</h3>
            <p className="text-sm text-gray-600">These fields can be customized when creating pages</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.config_schema.fields?.map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{field.label}</h4>
                    <div className="flex space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {field.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Key: {field.key}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sample: {sampleContent[field.key] || 'No sample data'}
                  </p>
                </div>
              ))}
            </div>
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