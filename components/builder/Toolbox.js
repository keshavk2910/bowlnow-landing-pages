import { Element, useEditor } from '@craftjs/core'
import { Container } from './blocks/Container'
import { Text } from './blocks/Text'
import { Button } from './blocks/Button'
import { Image } from './blocks/Image'
import { Hero } from './blocks/Hero'
import { Column } from './blocks/Column'
import { Spacer } from './blocks/Spacer'
import { ContactForm } from './blocks/ContactForm'
import { PartySlider } from './blocks/PartySlider'
import { BookingForm } from './blocks/BookingForm'

export default function Toolbox() {
  const { connectors } = useEditor()

  const blocks = [
    {
      name: 'Layout',
      items: [
        {
          name: 'Container',
          component: Container,
          icon: '📦',
          description: 'Basic container for grouping elements'
        },
        {
          name: 'Column',
          component: Column,
          icon: '📏',
          description: 'Flexible width column'
        },
        {
          name: 'Spacer',
          component: Spacer,
          icon: '⬜',
          description: 'Add vertical spacing'
        }
      ]
    },
    {
      name: 'Content',
      items: [
        {
          name: 'Text',
          component: Text,
          icon: '📝',
          description: 'Editable text content'
        },
        {
          name: 'Button',
          component: Button,
          icon: '🔘',
          description: 'Call-to-action button'
        },
        {
          name: 'Image',
          component: Image,
          icon: '🖼️',
          description: 'Image with customizable properties'
        }
      ]
    },
    {
      name: 'Sections',
      items: [
        {
          name: 'Hero',
          component: Hero,
          icon: '🦸',
          description: 'Full-width hero section with background'
        },
        {
          name: 'Contact Form',
          component: ContactForm,
          icon: '📧',
          description: 'Lead capture form with customizable fields'
        }
      ]
    },
    {
      name: 'Business Blocks',
      items: [
        {
          name: 'Party Slider',
          component: PartySlider,
          icon: '🎉',
          description: 'Image gallery with party features'
        },
        {
          name: 'Booking Form',
          component: BookingForm,
          icon: '📅',
          description: 'Service selection and booking form'
        }
      ]
    }
  ]

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Components</h3>
      
      {blocks.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{category.name}</h4>
          
          <div className="space-y-2">
            {category.items.map((item, index) => (
              <div
                key={index}
                ref={(ref) =>
                  connectors.create(ref, <Element is={item.component} canvas />)
                }
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="text-xs text-gray-400">+</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-800 font-medium mb-1">💡 How to use:</div>
        <div className="text-xs text-blue-700">
          Drag components from this panel to the canvas. Click any element to configure its properties in the settings panel.
        </div>
      </div>
    </div>
  )
}