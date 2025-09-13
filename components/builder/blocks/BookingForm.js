import { useNode, Element } from '@craftjs/core'
import { Text } from './Text'
import { Button } from './Button'

export const BookingForm = ({ 
  title = 'Book Your Experience',
  services = [
    { name: 'Standard Booking', price: 50, duration: '2 hours', popular: false },
    { name: 'Premium Experience', price: 85, duration: '3 hours', popular: true },
    { name: 'VIP Package', price: 150, duration: '4 hours', popular: false }
  ],
  background = 'bg-gray-50',
  padding = 'p-8',
  borderRadius = 'rounded-lg',
  className = ''
}) => {
  const {
    connectors: { connect, drag },
    selected,
    isHover
  } = useNode((state) => ({
    selected: state.events.selected,
    isHover: state.events.hovered
  }))

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`${background} ${padding} ${borderRadius} ${className} ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <Element
          id="booking-title"
          is={Text}
          text={title}
          fontSize="text-4xl"
          fontWeight="font-bold"
          textAlign="text-center"
          margin="mb-12"
          canvas
        />

        {/* Service Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 ${
                service.popular ? 'ring-4 ring-indigo-500 ring-opacity-50' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  ${service.price}
                </div>
                <div className="text-gray-500">{service.duration}</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Professional service</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Equipment included</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Staff assistance</span>
                </div>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  service.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Select This Package
              </button>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Element
            id="booking-form-title"
            is={Text}
            text="Complete Your Booking"
            fontSize="text-2xl"
            fontWeight="font-bold"
            textAlign="text-center"
            margin="mb-6"
            canvas
          />

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Your full name"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="your@email.com"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="(555) 123-4567"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Any special requests..."
                disabled
              />
            </div>

            <div className="md:col-span-2 text-center">
              <Element
                id="booking-submit-btn"
                is={Button}
                text="Submit Booking Request"
                size="px-8 py-3 text-lg"
                color="bg-indigo-600 text-white"
                borderRadius="rounded-lg"
                canvas
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const BookingFormSettings = () => {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }))

  const updateService = (index, field, value) => {
    const updatedServices = [...props.services]
    updatedServices[index] = { ...updatedServices[index], [field]: value }
    setProp((props) => (props.services = updatedServices))
  }

  const addService = () => {
    const newService = { name: 'New Service', price: 100, duration: '2 hours', popular: false }
    setProp((props) => (props.services = [...props.services, newService]))
  }

  const removeService = (index) => {
    const updatedServices = props.services.filter((_, i) => i !== index)
    setProp((props) => (props.services = updatedServices))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Title
        </label>
        <input
          type="text"
          value={props.title}
          onChange={(e) => setProp((props) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Services
          </label>
          <button
            onClick={addService}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Add Service
          </button>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {props.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded p-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(index, 'name', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Service name"
                />
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => updateService(index, 'price', parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Price"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={service.duration}
                  onChange={(e) => updateService(index, 'duration', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm mr-2"
                  placeholder="Duration"
                />
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={service.popular}
                    onChange={(e) => updateService(index, 'popular', e.target.checked)}
                    className="mr-1"
                  />
                  Popular
                </label>
                <button
                  onClick={() => removeService(index)}
                  className="ml-2 text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

BookingForm.craft = {
  props: {
    title: 'Book Your Experience',
    services: [
      { name: 'Standard Booking', price: 50, duration: '2 hours', popular: false },
      { name: 'Premium Experience', price: 85, duration: '3 hours', popular: true },
      { name: 'VIP Package', price: 150, duration: '4 hours', popular: false }
    ],
    background: 'bg-gray-50',
    padding: 'p-8',
    borderRadius: 'rounded-lg',
    className: ''
  },
  related: {
    settings: BookingFormSettings
  }
}