import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platform_name: 'BowlNow',
    support_email: 'support@bowlnow.com',
    default_theme_color: '#4F46E5',
    stripe_application_fee: 2.9,
    enable_analytics: true,
    enable_webhooks: true,
    webhook_url: '',
    smtp_settings: {
      host: '',
      port: 587,
      username: '',
      password: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...settings, ...data.settings })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <AdminLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure global platform settings and integrations</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="platform_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  id="platform_name"
                  value={settings.platform_name}
                  onChange={(e) => handleInputChange('platform_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="support_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  id="support_email"
                  value={settings.support_email}
                  onChange={(e) => handleInputChange('support_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="default_theme_color" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Theme Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="default_theme_color"
                    value={settings.default_theme_color}
                    onChange={(e) => handleInputChange('default_theme_color', e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.default_theme_color}
                    onChange={(e) => handleInputChange('default_theme_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stripe_fee" className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Application Fee (%)
                </label>
                <input
                  type="number"
                  id="stripe_fee"
                  step="0.1"
                  min="0"
                  max="10"
                  value={settings.stripe_application_fee}
                  onChange={(e) => handleInputChange('stripe_application_fee', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Feature Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Analytics Tracking</div>
                  <div className="text-sm text-gray-500">Enable platform-wide analytics</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('enable_analytics', !settings.enable_analytics)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.enable_analytics ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.enable_analytics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Webhook Processing</div>
                  <div className="text-sm text-gray-500">Enable webhook event processing</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('enable_webhooks', !settings.enable_webhooks)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    settings.enable_webhooks ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.enable_webhooks ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {settings.enable_webhooks && (
              <div className="mt-4">
                <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  id="webhook_url"
                  value={settings.webhook_url}
                  onChange={(e) => handleInputChange('webhook_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://your-webhook-endpoint.com/webhook"
                />
              </div>
            )}
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Email Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  id="smtp_host"
                  value={settings.smtp_settings.host}
                  onChange={(e) => handleNestedChange('smtp_settings', 'host', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  id="smtp_port"
                  value={settings.smtp_settings.port}
                  onChange={(e) => handleNestedChange('smtp_settings', 'port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="smtp_username" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  id="smtp_username"
                  value={settings.smtp_settings.username}
                  onChange={(e) => handleNestedChange('smtp_settings', 'username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="smtp_password" className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="smtp_password"
                  value={settings.smtp_settings.password}
                  onChange={(e) => handleNestedChange('smtp_settings', 'password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
    </AdminLayout>
  )
}