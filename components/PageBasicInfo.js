import { useState } from 'react'

export default function PageBasicInfo({ page, site, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: page.name,
    slug: page.slug,
    is_homepage: page.is_homepage,
    is_published: page.is_published
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setEditing(false)
        onUpdate(formData)
        alert('Page information updated successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update page information')
      }
    } catch (error) {
      console.error('Error updating page info:', error)
      alert('Failed to update page information')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: page.name,
      slug: page.slug,
      is_homepage: page.is_homepage,
      is_published: page.is_published
    })
    setEditing(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!editing) {
    // View mode
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Page Information</h3>
            <p className="text-sm text-gray-600">Page details and settings</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
          >
            Edit Info
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Page Name</label>
              <p className="mt-1 text-sm text-gray-900">{page.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Page URL</label>
              <p className="mt-1 text-sm text-gray-900">
                {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost:3000'}/{site.slug}/{page.slug}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-6">
            <div className="flex items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                page.is_homepage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {page.is_homepage ? 'Homepage' : 'Regular Page'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                page.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {page.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit mode
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Edit Page Information</h3>
        <p className="text-sm text-gray-600">Update page details and settings</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700">
              Page Name *
            </label>
            <input
              type="text"
              id="edit_name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Page Name"
            />
          </div>

          <div>
            <label htmlFor="edit_slug" className="block text-sm font-medium text-gray-700">
              Page URL *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost:3000'}/{site.slug}/
              </span>
              <input
                type="text"
                id="edit_slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="page-url"
                pattern="[a-z0-9-]+"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_homepage}
              onChange={(e) => handleChange('is_homepage', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Set as homepage</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => handleChange('is_published', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Published</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !formData.name || !formData.slug}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
              saving || !formData.name || !formData.slug
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Info'}
          </button>
        </div>
      </div>
    </div>
  )
}