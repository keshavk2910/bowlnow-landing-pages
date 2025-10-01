import { useState, useEffect } from 'react'
import FileUpload from '../FileUpload'
import RichTextField from './RichTextField'

export default function TableField({ 
  value = [], 
  onChange, 
  label = "Schedule Table",
  description = "Manage your schedule table data",
  columns = [],
  minRows = 1,
  maxRows = 50,
  required = false,
  siteId = null,
  pageId = null
}) {
  const [tableData, setTableData] = useState(Array.isArray(value) ? value : [])
  const [tableColumns, setTableColumns] = useState(Array.isArray(columns) && columns.length > 0 ? columns : [
    { key: 'day', label: 'Day', type: 'text' },
    { key: 'time', label: 'Time', type: 'text' },
    { key: 'league', label: 'League', type: 'text' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'per_team', label: 'Per Team', type: 'number' }
  ])

  useEffect(() => {
    setTableData(Array.isArray(value) ? value : [])
  }, [value])

  const addRow = () => {
    if (tableData.length >= maxRows) {
      alert(`Maximum ${maxRows} rows allowed`)
      return
    }

    const newRow = {}
    tableColumns.forEach(col => {
      newRow[col.key] = col.type === 'number' ? 0 : ''
    })
    newRow.id = Date.now()
    
    const updatedData = [...tableData, newRow]
    setTableData(updatedData)
    onChange(updatedData)
  }

  const updateRow = (rowIndex, columnKey, value) => {
    const updatedData = tableData.map((row, index) => 
      index === rowIndex ? { ...row, [columnKey]: value } : row
    )
    setTableData(updatedData)
    onChange(updatedData)
  }

  const removeRow = (rowIndex) => {
    if (tableData.length <= minRows) {
      alert(`Minimum ${minRows} row(s) required`)
      return
    }

    if (!confirm('Are you sure you want to remove this row?')) return

    const updatedData = tableData.filter((_, index) => index !== rowIndex)
    setTableData(updatedData)
    onChange(updatedData)
  }

  const moveRow = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= tableData.length) return

    const updatedData = [...tableData]
    const [movedRow] = updatedData.splice(fromIndex, 1)
    updatedData.splice(toIndex, 0, movedRow)
    
    setTableData(updatedData)
    onChange(updatedData)
  }

  const addColumn = () => {
    const columnKey = prompt('Enter column key (e.g., "new_column"):')
    if (!columnKey) return

    const columnLabel = prompt('Enter column label:') || columnKey
    const columnType = prompt('Enter column type (text, number, select):', 'text') || 'text'

    if (tableColumns.find(col => col.key === columnKey)) {
      alert('Column with this key already exists')
      return
    }

    const newColumn = { key: columnKey, label: columnLabel, type: columnType }
    const updatedColumns = [...tableColumns, newColumn]
    setTableColumns(updatedColumns)

    // Add the new column to existing rows
    const updatedData = tableData.map(row => ({
      ...row,
      [columnKey]: columnType === 'number' ? 0 : ''
    }))
    setTableData(updatedData)
    onChange(updatedData)
  }

  const removeColumn = (columnKey) => {
    if (tableColumns.length <= 1) {
      alert('At least one column is required')
      return
    }

    if (!confirm(`Are you sure you want to remove the "${columnKey}" column?`)) return

    const updatedColumns = tableColumns.filter(col => col.key !== columnKey)
    setTableColumns(updatedColumns)

    // Remove the column from existing rows
    const updatedData = tableData.map(row => {
      const { [columnKey]: removed, ...rest } = row
      return rest
    })
    setTableData(updatedData)
    onChange(updatedData)
  }

  const renderCell = (row, column, rowIndex) => {
    const value = row[column.key] || ''

    switch (column.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateRow(rowIndex, column.key, parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            min="0"
          />
        )
      case 'select':
        const options = column.options || []
        return (
          <select
            value={value}
            onChange={(e) => updateRow(rowIndex, column.key, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select...</option>
            {options.map((option, idx) => (
              <option key={idx} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        )
      case 'image':
        return (
          <div className="space-y-2">
            <FileUpload
              value={value}
              onFileUploaded={(file) => {
                const imageUrl = file?.url || null
                updateRow(rowIndex, column.key, imageUrl)
              }}
              siteId={siteId}
              pageId={pageId}
              fieldKey={`${label}_${column.key}_${rowIndex}`}
              allowedTypes={['image']}
              maxSizeMB={5}
              multiple={false}
            />
            {value && (
              <div className="text-xs text-gray-500 truncate" title={value}>
                {value.length > 30 ? `${value.substring(0, 30)}...` : value}
              </div>
            )}
          </div>
        )
      case 'richtext':
        return (
          <div className="min-w-[300px]">
            <RichTextField
              value={value}
              onChange={(newValue) => updateRow(rowIndex, column.key, newValue)}
              placeholder={`Enter ${column.label.toLowerCase()}...`}
              minHeight="100px"
            />
          </div>
        )
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateRow(rowIndex, column.key, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[80px]"
            placeholder={column.label}
            rows="3"
          />
        )
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateRow(rowIndex, column.key, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={column.label}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addColumn}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
          >
            + Column
          </button>
          <button
            type="button"
            onClick={addRow}
            disabled={tableData.length >= maxRows}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              tableData.length >= maxRows
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            + Row ({tableData.length}/{maxRows})
          </button>
        </div>
      </div>

      {tableColumns.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    #
                  </th>
                  {tableColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        <button
                          type="button"
                          onClick={() => removeColumn(column.key)}
                          className="ml-2 text-red-500 hover:text-red-700 text-xs"
                          title="Remove column"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        <button
                          type="button"
                          onClick={() => moveRow(rowIndex, rowIndex - 1)}
                          disabled={rowIndex === 0}
                          className={`text-xs ${rowIndex === 0 ? 'text-gray-300' : 'text-blue-600 hover:text-blue-800'}`}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <span className="text-center">{rowIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => moveRow(rowIndex, rowIndex + 1)}
                          disabled={rowIndex === tableData.length - 1}
                          className={`text-xs ${rowIndex === tableData.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:text-blue-800'}`}
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    {tableColumns.map((column) => (
                      <td key={column.key} className="px-3 py-2">
                        {renderCell(row, column, rowIndex)}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeRow(rowIndex)}
                        disabled={tableData.length <= minRows}
                        className={`text-xs px-2 py-1 rounded ${
                          tableData.length <= minRows
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tableData.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <TableIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 mb-4">
            No table data yet. Click "Add Row" to get started.
          </p>
          {required && (
            <span className="text-red-600 text-sm font-medium">This field is required.</span>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Total rows: {tableData.length} | Columns: {tableColumns.length}
      </div>
    </div>
  )
}

function TableIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M3 10h18M3 14h18m-9-4v8m-7 0V6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
      />
    </svg>
  )
}



