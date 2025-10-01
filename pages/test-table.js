import { useState } from 'react'
import TableSection from '../components/TemplateComponents/TableSection'
import mockTableData from '../data/mock-table-data.json'

export default function TestTablePage() {
  const [themeColor] = useState('#4F46E5')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Table Section Test Page
          </h1>
          <p className="text-lg text-gray-600">
            This page demonstrates the dynamic table section functionality.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Example Table Section
          </h2>
          <TableSection 
            content={mockTableData.table_section} 
            themeColor={themeColor} 
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Configuration Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Table Data Structure:</h3>
              <pre className="mt-2 p-4 bg-gray-100 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(mockTableData.table_section, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Features:</h3>
              <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
                <li>Dynamic row and column configuration</li>
                <li>Customizable column types (text, number, currency, date)</li>
                <li>Responsive design with horizontal scrolling</li>
                <li>Striped rows and hover effects</li>
                <li>Configurable borders and styling</li>
                <li>Section title and subtitle support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">How to Use:</h3>
              <ol className="mt-2 list-decimal list-inside text-gray-600 space-y-1">
                <li>Go to the template editor: <a href="/admin/templates/0621ee26-8903-49e0-938d-e9e1a8cd6874/edit" className="text-blue-600 hover:underline">Edit Template</a></li>
                <li>Enable the "Table Section" in the form</li>
                <li>Configure the table title and subtitle</li>
                <li>Add/remove columns and set their types</li>
                <li>Add/remove rows and fill in the data</li>
                <li>Customize the table appearance options</li>
                <li>Save and preview your changes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

