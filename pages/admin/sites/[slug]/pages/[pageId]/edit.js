import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../../../components/admin/AdminLayout'

export default function EditPagePage() {
  const router = useRouter()
  const { slug, pageId } = router.query
  const [site, setSite] = useState(null)
  const [page, setPage] = useState(null)
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (slug && pageId) {
      fetchPageData()
    }
  }, [slug, pageId])

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
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData,
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Editor */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Page Content</h3>
              <p className="text-sm text-gray-600">Configure your page content and settings</p>
            </div>
            
            <div className="p-6 space-y-6">
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
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Image URL"
                        required={field.required}
                      />
                      {formData[field.key] && (
                        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                          <img
                            src={formData[field.key]}
                            alt={field.label}
                            className="max-h-full max-w-full object-contain rounded"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }}
                          />
                          <div className="text-gray-500 text-sm hidden">Invalid image URL</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {field.description || `Configure the ${field.label.toLowerCase()} for your page`}
                  </p>
                </div>
              ))}
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
          <button
            onClick={handleSave}
            disabled={saving}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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