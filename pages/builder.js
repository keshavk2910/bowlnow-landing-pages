import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Editor, Frame, Element } from '@craftjs/core'
import { Layers } from '@craftjs/layers'

// Import builder components
import Toolbox from '../components/builder/Toolbox'
import SettingsPanel from '../components/builder/SettingsPanel'
import { Container } from '../components/builder/blocks/Container'
import { Text } from '../components/builder/blocks/Text'
import { Button } from '../components/builder/blocks/Button'
import { Image } from '../components/builder/blocks/Image'
import { Hero } from '../components/builder/blocks/Hero'
import { Column } from '../components/builder/blocks/Column'
import { Spacer } from '../components/builder/blocks/Spacer'
import { ContactForm } from '../components/builder/blocks/ContactForm'
import { PartySlider } from '../components/builder/blocks/PartySlider'
import { BookingForm } from '../components/builder/blocks/BookingForm'

export default function FullScreenBuilder() {
  const router = useRouter()
  const [enabled, setEnabled] = useState(true)
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('landing')
  const [saving, setSaving] = useState(false)
  const [viewportMode, setViewportMode] = useState('desktop')

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
            fields: []
          }
        })
      })

      if (response.ok) {
        alert('Template saved successfully!')
        setTemplateName('')
        // Optionally close window or redirect
        if (window.opener) {
          window.opener.location.reload()
          window.close()
        }
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

  const viewportSizes = {
    mobile: 'max-w-sm',
    tablet: 'max-w-2xl', 
    desktop: 'max-w-6xl'
  }

  return (
    <div className="h-screen w-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>BowlNow Template Builder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Template Builder</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name..."
                className="px-3 py-2 border border-gray-300 rounded text-sm w-48"
              />
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
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
            {/* Viewport Controls */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1 text-xs rounded ${
                  viewportMode === 'mobile' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📱
              </button>
              <button 
                onClick={() => setViewportMode('tablet')}
                className={`px-3 py-1 text-xs rounded ${
                  viewportMode === 'tablet' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📄
              </button>
              <button 
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1 text-xs rounded ${
                  viewportMode === 'desktop' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                💻
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                enabled 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {enabled ? '👁️ Preview' : '✏️ Edit'}
            </button>
            
            <Editor query={(query) => handleSaveTemplate(query)}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  const editorQuery = e.target.closest('[data-craftjs="Editor"]')?.querySelector('[data-craftjs="query"]')
                  if (editorQuery) {
                    handleSaveTemplate(JSON.parse(editorQuery.textContent))
                  }
                }}
                disabled={saving}
                className="bg-purple-600 text-white px-6 py-2 rounded font-medium hover:bg-purple-700 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : '💾 Save Template'}
              </button>
            </Editor>

            <button
              onClick={() => window.close()}
              className="text-gray-500 hover:text-gray-700 p-2"
              title="Close Builder"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Builder Interface */}
        <div className="flex h-[calc(100vh-64px)]">
          {/* Toolbox */}
          <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
            <Toolbox />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-100 overflow-auto">
            <div className="p-6 min-h-full">
              <div className={`${viewportSizes[viewportMode]} mx-auto bg-white rounded-lg shadow-xl min-h-[calc(100vh-112px)] transition-all duration-300`}>
                <Frame>
                  <Element
                    id="root-container"
                    is={Container}
                    padding="p-0"
                    maxWidth="max-w-full"
                    canvas
                  >
                    <Element
                      id="welcome-hero"
                      is={Hero}
                      canvas
                    />
                  </Element>
                </Frame>
              </div>
            </div>
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
        </div>
      </Editor>
    </div>
  )
}