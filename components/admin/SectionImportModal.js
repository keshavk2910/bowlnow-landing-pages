import { useState, useEffect } from 'react'

export default function SectionImportModal({ isOpen, onClose, onImport }) {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSections, setSelectedSections] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchSections()
    }
  }, [isOpen])

  const fetchSections = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/template-sections')
      const result = await response.json()
      if (result.success) {
        setSections(result.data.filter(section => section.is_active))
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSection = (section) => {
    setSelectedSections(prev => {
      const isSelected = prev.some(s => s.id === section.id)
      if (isSelected) {
        return prev.filter(s => s.id !== section.id)
      } else {
        return [...prev, section]
      }
    })
  }

  const handleImport = () => {
    onImport(selectedSections)
    setSelectedSections([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Import Template Sections
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sections List */}
          <div className="max-h-96 overflow-y-auto border rounded-md">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading sections...</p>
              </div>
            ) : filteredSections.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No sections found matching your search.' : 'No sections available.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSections.map((section) => {
                  const isSelected = selectedSections.some(s => s.id === section.id)
                  return (
                    <div
                      key={section.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleSection(section)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSection(section)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <h4 className="font-medium text-gray-900">
                              {section.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-6">
                            {section.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 ml-6">
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {section.component_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {section.config_schema?.fields?.length || 0} fields
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selectedSections.length > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-md">
              <p className="text-sm text-indigo-800">
                {selectedSections.length} section{selectedSections.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selectedSections.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import {selectedSections.length > 0 ? `(${selectedSections.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
