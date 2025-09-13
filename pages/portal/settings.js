import { useState, useEffect } from 'react'
import PortalLayout from '../../components/portal/PortalLayout'

export default function PortalSettings() {
  const [settings, setSettings] = useState({
    site_name: '',
    theme_color: '#4F46E5',
    tracking_pixels: {
      facebook: '',
      google: ''
    },
    notification_preferences: {
      email_leads: true,
      email_orders: true,
      sms_notifications: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('portal_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (user?.siteId) {
      fetchSettings()
    }
  }, [user])

  async function fetchSettings() {
    try {
      const token = localStorage.getItem('portal_token')
      const response = await fetch('/api/portal/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, ...data.settings })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('portal_token')
      const response = await fetch('/api/portal/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  if (loading) {
    return (
      <PortalLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Manage your site configuration and preferences</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Site Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Site Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.site?.name}
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact admin to change site name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site URL
                </label>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'partners.bowlnow.com'}/{user?.site?.slug}
                </div>
                <p className="text-xs text-gray-500 mt-1">Contact admin to change URL slug</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Appearance</h3>
            
            <div>
              <label htmlFor="theme_color" className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="theme_color"
                  value={settings.theme_color}
                  onChange={(e) => handleInputChange('theme_color', e.target.value)}
                  className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.theme_color}
                  onChange={(e) => handleInputChange('theme_color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#4F46E5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tracking Pixels</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="facebook_pixel" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  id="facebook_pixel"
                  value={settings.tracking_pixels.facebook}
                  onChange={(e) => handleNestedChange('tracking_pixels', 'facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123456789012345"
                />
                <p className="text-xs text-gray-500 mt-1">Your Facebook Pixel ID for conversion tracking</p>
              </div>
              
              <div>
                <label htmlFor="google_analytics" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  id="google_analytics"
                  value={settings.tracking_pixels.google}
                  onChange={(e) => handleNestedChange('tracking_pixels', 'google', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="GA_MEASUREMENT_ID"
                />
                <p className="text-xs text-gray-500 mt-1">Your Google Analytics measurement ID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Email for New Leads</div>
                  <div className="text-sm text-gray-500">Get notified when someone submits a form</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNestedChange('notification_preferences', 'email_leads', !settings.notification_preferences.email_leads)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.notification_preferences.email_leads ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notification_preferences.email_leads ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Email for New Orders</div>
                  <div className="text-sm text-gray-500">Get notified when someone makes a purchase</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNestedChange('notification_preferences', 'email_orders', !settings.notification_preferences.email_orders)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.notification_preferences.email_orders ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notification_preferences.email_orders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">SMS Notifications</div>
                  <div className="text-sm text-gray-500">Receive text message alerts</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNestedChange('notification_preferences', 'sms_notifications', !settings.notification_preferences.sms_notifications)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.notification_preferences.sms_notifications ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notification_preferences.sms_notifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              saving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </PortalLayout>
  )
}