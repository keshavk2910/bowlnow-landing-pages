import { useState } from 'react'

export default function TableSection({ 
  content = {}, 
  themeColor = '#4F46E5',
  className = ''
}) {
  const {
    enabled = false,
    title = 'Table Section',
    subtitle = '',
    table_data = [],
    table_columns = [],
    show_borders = true,
    striped_rows = true,
    hover_effect = true
  } = content

  if (!enabled || !table_data || table_data.length === 0) {
    return null
  }

  // Default columns if none provided
  const columns = table_columns && table_columns.length > 0 ? table_columns : [
    { key: 'column1', label: 'Column 1', type: 'text' },
    { key: 'column2', label: 'Column 2', type: 'text' },
    { key: 'column3', label: 'Column 3', type: 'text' }
  ]

  const getCellValue = (row, column) => {
    const value = row[column.key] || ''
    
    // Format based on column type
    switch (column.type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value
      case 'currency':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : value
      case 'date':
        return value ? new Date(value).toLocaleDateString() : value
      default:
        return value
    }
  }

  const tableClasses = `
    w-full
    ${show_borders ? 'border border-gray-200' : ''}
    ${striped_rows ? 'divide-y divide-gray-200' : ''}
    ${hover_effect ? 'hover:shadow-lg' : ''}
    transition-shadow duration-200
  `.trim()

  const rowClasses = (index) => `
    ${striped_rows && index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
    ${hover_effect ? 'hover:bg-gray-100' : ''}
    transition-colors duration-150
  `.trim()

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className={tableClasses}>
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table_data.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex} className={rowClasses(rowIndex)}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Info */}
        {table_data.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {table_data.length} {table_data.length === 1 ? 'row' : 'rows'}
          </div>
        )}
      </div>
    </section>
  )
}

