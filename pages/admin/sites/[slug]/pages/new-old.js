import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../../components/admin/AdminLayout'

export default function NewPagePage() {
  const router = useRouter()
  const { slug } = router.query
  const [site, setSite] = useState(null)
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    page_type: 'landing',
    template_id: '',
    is_homepage: false,
    is_published: false,
    content: {}
  })

  useEffect(() => {
    if (slug) {
      fetchSiteAndTemplates()
    }
  }, [slug])

  useEffect(() => {
    // Auto-generate slug from name
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name])

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

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          site_id: site.id
        })
      })

      if (response.ok) {
        const { page } = await response.json()
        router.push(`/admin/sites/${slug}?tab=pages`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create page')
      }
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedTemplate = templates.find(t => t.id === formData.template_id)

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

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Page</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new page to {site.client_name}&apos;s website
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
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
                    value={formData.page_type}
                    onChange={(e) => handleInputChange('page_type', e.target.value)}
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
                    value={formData.template_id}
                    onChange={(e) => handleInputChange('template_id', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a template</option>
                    {templates
                      .filter(t => t.type === formData.page_type)
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
                    checked={formData.is_homepage}
                    onChange={(e) => handleInputChange('is_homepage', e.target.checked)}
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
                    checked={formData.is_published}
                    onChange={(e) => handleInputChange('is_published', e.target.checked)}
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
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Template: {selectedTemplate.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{selectedTemplate.category} template</p>
                  <div className="text-xs text-gray-500">
                    Fields: {selectedTemplate.config_schema.fields?.length || 0} customizable fields
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.template_id}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || !formData.template_id
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? 'Creating Page...' : 'Create Page'}
                </button>
              </div>
            </form>
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