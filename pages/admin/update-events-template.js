import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function UpdateEventsTemplate() {
  const [updating, setUpdating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleUpdate = async () => {
    if (!confirm('This will update the EventsTemplate schema in the database. Continue?')) {
      return
    }

    setUpdating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/templates/update-events-template-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Update failed')
      }
    } catch (err) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update template')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AdminLayout title="Update EventsTemplate Schema">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Update EventsTemplate Schema
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This will update the EventsTemplate configuration schema in the database with the new sections including <code className="bg-gray-100 px-2 py-1 rounded">book_your_event_left</code>.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ What this update does:</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Updates EventsTemplate (ID: cd8a6d11-7410-4d55-be5b-0a04ac7822e9)</li>
                <li>Adds new sections: Main CTA, Features Slider, Book Your Event (left), Events Slider, Contact Form</li>
                <li>Removes old book_your_event_half from template schema</li>
                <li>Updates field types (description changed to richtext)</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Important:</h3>
              <p className="text-sm text-yellow-700">
                This only updates the template schema. Existing page data is NOT affected. You'll need to run the data migration separately to move existing page data from book_your_event_half to book_your_event_left.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                updating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {updating ? 'Updating...' : 'Update Template Schema'}
            </button>

            <a
              href="/admin/migrate-book-event"
              className="px-6 py-3 rounded-lg font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
            >
              Go to Data Migration →
            </a>
          </div>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Template Updated Successfully
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Sections added:</strong> {result.sectionsCount}</p>
                <p className="mt-2">
                  You can now edit the template at:{' '}
                  <a
                    href="/admin/templates/cd8a6d11-7410-4d55-be5b-0a04ac7822e9/edit"
                    className="underline hover:text-green-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    EventsTemplate Editor
                  </a>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ❌ Update Failed
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
