import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function TemplateSectionsPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/template-sections')
      const result = await response.json()
      if (result.success) {
        setSections(result.data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const response = await fetch(`/api/admin/template-sections/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setSections(sections.filter(section => section.id !== id))
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const toggleActive = async (section) => {
    try {
      const response = await fetch(`/api/admin/template-sections/${section.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_active: !section.is_active
        })
      })
      const result = await response.json()
      if (result.success) {
        setSections(sections.map(s => 
          s.id === section.id ? { ...s, is_active: !s.is_active } : s
        ))
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Template Sections</h1>
            <p className="text-gray-600 mt-2">Manage reusable template sections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Section
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sections.map((section) => (
                <tr key={section.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {section.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {section.component_name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {section.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        section.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSection(section)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(section)}
                        className={`${
                          section.is_active
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {section.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No template sections found.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSection) && (
        <SectionModal
          section={editingSection}
          onClose={() => {
            setShowCreateModal(false)
            setEditingSection(null)
          }}
          onSave={(section) => {
            if (editingSection) {
              setSections(sections.map(s => 
                s.id === section.id ? section : s
              ))
            } else {
              setSections([section, ...sections])
            }
            setShowCreateModal(false)
            setEditingSection(null)
          }}
        />
      )}
    </AdminLayout>
  )
}

function SectionModal({ section, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: section?.name || '',
    description: section?.description || '',
    component_name: section?.component_name || '',
    config_schema: section?.config_schema || { fields: [] },
    is_active: section?.is_active ?? true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = section 
        ? `/api/admin/template-sections/${section.id}`
        : '/api/admin/template-sections'
      
      const method = section ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      if (result.success) {
        onSave(result.data)
      }
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {section ? 'Edit Section' : 'Create New Section'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Component Name
              </label>
              <input
                type="text"
                value={formData.component_name}
                onChange={(e) => setFormData({...formData, component_name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {section ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
