import { useState } from 'react'
import { useEditor, Frame, Element } from '@craftjs/core'
import { Container } from './blocks/Container'
import { Text } from './blocks/Text'

export default function Viewport() {
  const [viewportMode, setViewportMode] = useState('desktop')
  
  const { enabled, actions, query } = useEditor((state, query) => ({
    enabled: state.options.enabled
  }))

  const viewportSizes = {
    mobile: 'max-w-sm',
    tablet: 'max-w-2xl', 
    desktop: 'max-w-6xl'
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Viewport Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-900">Canvas</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1 text-xs rounded hover:bg-gray-200 ${
                  viewportMode === 'mobile' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                📱 Mobile
              </button>
              <button 
                onClick={() => setViewportMode('tablet')}
                className={`px-3 py-1 text-xs rounded hover:bg-gray-200 ${
                  viewportMode === 'tablet' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                📄 Tablet
              </button>
              <button 
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1 text-xs rounded hover:bg-gray-200 ${
                  viewportMode === 'desktop' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                💻 Desktop
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                actions.clearEvents()
                const json = query.serialize()
                console.log('Template JSON:', json)
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`${viewportSizes[viewportMode]} mx-auto bg-white rounded-lg shadow-lg min-h-96 transition-all duration-300`}>
          <Frame>
            <Element
              is={Container}
              padding="p-8"
              maxWidth="max-w-full"
              canvas
            >
              <Element
                is={Text}
                text="Start building your template"
                fontSize="text-2xl"
                fontWeight="font-bold"
                textAlign="text-center"
                textColor="text-gray-500"
              />
              <Element
                is={Text}
                text="Drag components from the toolbox to begin"
                fontSize="text-base"
                textAlign="text-center"
                textColor="text-gray-400"
                margin="mt-2"
              />
            </Element>
          </Frame>
        </div>
      </div>
    </div>
  )
}