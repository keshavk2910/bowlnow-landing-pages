import { Frame } from '@craftjs/core'
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

export default function BuilderTemplateRenderer({ builderData, site, page, sessionId, onFormSubmit, onCheckoutClick }) {
  if (!builderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
          <p className="text-gray-600">This builder template could not be loaded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Frame
        data={builderData}
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
      />
    </div>
  )
}