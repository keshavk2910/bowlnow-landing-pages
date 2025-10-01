import { useState, useEffect } from 'react'

export default function SectionSelector({ onSectionSelect, selectedSections = [] }) {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
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

  const isSelected = (sectionId) => {
    return selectedSections.some(selected => selected.id === sectionId)
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Add Template Sections
        </h3>
        <input
          type="text"
          placeholder="Search sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {filteredSections.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No sections found matching your search.' : 'No sections available.'}
          </div>
        ) : (
          <div className="p-2">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 mb-2 ${
                  isSelected(section.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onSectionSelect(section)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {section.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {section.description}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {section.component_name}
                    </span>
                  </div>
                  {isSelected(section.id) && (
                    <div className="ml-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
