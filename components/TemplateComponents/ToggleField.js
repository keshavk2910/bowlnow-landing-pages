import { useState, useEffect } from 'react'

export default function ToggleField({ 
  value = false, 
  onChange, 
  label = "Show Section",
  description = "Toggle to show or hide this section on the page",
  connectedFields = [] // Array of field keys that should be hidden when this is false
}) {
  const [isEnabled, setIsEnabled] = useState(value)

  useEffect(() => {
    setIsEnabled(value)
  }, [value])

  const handleToggle = (checked) => {
    setIsEnabled(checked)
    onChange(checked)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
          {connectedFields.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              Controls: {connectedFields.join(', ')}
            </p>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => handleToggle(!isEnabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className={`text-sm ${isEnabled ? 'text-green-700' : 'text-gray-500'}`}>
        Status: {isEnabled ? 'Section will be shown on the page' : 'Section will be hidden from the page'}
      </div>
    </div>
  )
}