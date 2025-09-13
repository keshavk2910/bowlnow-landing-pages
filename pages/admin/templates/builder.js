import { useState, useEffect } from 'react'
import { Editor, Frame, Element } from '@craftjs/core'
import { Layers } from '@craftjs/layers'
import AdminLayout from '../../../components/admin/AdminLayout'
import Toolbox from '../../../components/builder/Toolbox'
import SettingsPanel from '../../../components/builder/SettingsPanel'
import Viewport from '../../../components/builder/Viewport'

// Import our block components
import { Container } from '../../../components/builder/blocks/Container'
import { Text } from '../../../components/builder/blocks/Text'
import { Button } from '../../../components/builder/blocks/Button'
import { Image } from '../../../components/builder/blocks/Image'
import { Hero } from '../../../components/builder/blocks/Hero'
import { Column } from '../../../components/builder/blocks/Column'
import { Spacer } from '../../../components/builder/blocks/Spacer'
import { ContactForm } from '../../../components/builder/blocks/ContactForm'
import { PartySlider } from '../../../components/builder/blocks/PartySlider'
import { BookingForm } from '../../../components/builder/blocks/BookingForm'

export default function TemplateBuilder() {
  const [enabled, setEnabled] = useState(true)
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('landing')
  const [saving, setSaving] = useState(false)

  const handleSaveTemplate = async (query) => {
    if (!templateName.trim()) {
      alert('Please enter a template name')
      return
    }

    setSaving(true)
    try {
      const serializedTemplate = query.serialize()
      
      const response = await fetch('/api/admin/templates/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          type: templateType,
          category: 'builder',
          builder_data: serializedTemplate,
          config_schema: {
            builder: true,
            fields: [] // Builder templates don't use traditional fields
          }
        })
      })

      if (response.ok) {
        alert('Template saved successfully!')
        setTemplateName('')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Template Builder">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Visual Template Builder</h1>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="landing">Landing</option>
                  <option value="parties">Parties</option>
                  <option value="events">Events</option>
                  <option value="bookings">Bookings</option>
                  <option value="checkout">Checkout</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setEnabled(!enabled)}
                className={`px-3 py-1 rounded text-sm ${
                  enabled 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {enabled ? 'Preview' : 'Edit'}
              </button>
              
              <Editor query={(query) => handleSaveTemplate(query)}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    const query = e.target.getAttribute('data-query')
                    if (query) handleSaveTemplate(JSON.parse(query))
                  }}
                  disabled={saving}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Template'}
                </button>
              </Editor>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <Editor
            resolver={{
              Container,
              Text,
              Button,
              Image,
              Hero,
              Column,
              Spacer,
              ContactForm,
              PartySlider,
              BookingForm
            }}
            enabled={enabled}
          >
            {/* Toolbox */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <Toolbox />
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
              <Viewport />
            </div>

            {/* Settings Panel */}
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <SettingsPanel />
            </div>

            {/* Layers Panel */}
            <div className="w-64 bg-gray-50 border-l border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Layers</h3>
                <Layers expandRootOnLoad={true} />
              </div>
            </div>
          </Editor>
        </div>
      </div>
    </AdminLayout>
  )
}