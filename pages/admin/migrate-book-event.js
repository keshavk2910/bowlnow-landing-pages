import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function MigrateBookEvent() {
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleMigrate = async () => {
    if (!confirm('This will migrate data from book_your_event_half to book_your_event_left for all EventsTemplate pages. Continue?')) {
      return
    }

    setMigrating(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/admin/templates/migrate-book-event-data', {
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
        setError(errorData.error || 'Migration failed')
      }
    } catch (err) {
      console.error('Migration error:', err)
      setError(err.message || 'Failed to run migration')
    } finally {
      setMigrating(false)
    }
  }

  return (
    <AdminLayout title="Migrate Book Event Data">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Migrate Book Event Data
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This migration will copy data from <code className="bg-gray-100 px-2 py-1 rounded">book_your_event_half</code> to <code className="bg-gray-100 px-2 py-1 rounded">book_your_event_left</code> for all pages using the EventsTemplate.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ What this migration does:</h3>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Finds all pages using EventsTemplate</li>
                <li>Copies data from book_your_event_half to book_your_event_left</li>
                <li>Adds default values for new fields (image_position: "left", show_image: true)</li>
                <li>Skips pages that already have book_your_event_left data</li>
                <li>Does NOT delete book_your_event_half data (you can do this manually later)</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Note:</h3>
              <p className="text-sm text-blue-700">
                After running this migration, you should manually verify the migrated data in the page editor. The EventsTemplate component has already been updated to use book_your_event_left.
              </p>
            </div>
          </div>

          <button
            onClick={handleMigrate}
            disabled={migrating}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              migrating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {migrating ? 'Migrating...' : 'Run Migration'}
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Migration Completed
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Total pages found:</strong> {result.totalPages}</p>
                <p><strong>Pages migrated:</strong> {result.migratedCount}</p>
                <p><strong>Pages skipped:</strong> {result.skippedCount}</p>
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-red-700 mb-2">Errors encountered:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.errors.map((err, idx) => (
                        <li key={idx} className="text-red-600">
                          Page {err.pageId}: {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ❌ Migration Failed
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
