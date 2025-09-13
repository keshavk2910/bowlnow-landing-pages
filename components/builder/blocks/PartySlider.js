import { useNode, Element } from '@craftjs/core'
import { Text } from './Text'
import { Button } from './Button'

export const PartySlider = ({ 
  title = 'Amazing Parties',
  images = [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
  buttonText = 'Book Your Party',
  buttonLink = '#booking',
  background = 'bg-white',
  padding = 'p-8',
  borderRadius = 'rounded-xl',
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Images */}
        <div className="space-y-4">
          <Element
            id="slider-title"
            is={Text}
            text={title}
            fontSize="text-3xl"
            fontWeight="font-bold"
            textColor="text-gray-900"
            margin="mb-6"
            canvas
          />
          
          <div className="grid grid-cols-2 gap-4">
            {images.slice(0, 3).map((image, index) => (
              <div 
                key={index} 
                className={`${index === 0 ? 'col-span-2' : ''} relative h-48 rounded-xl overflow-hidden`}
              >
                <img
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-lg text-gray-700">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Professional party planning</span>
            </div>
            <div className="flex items-center space-x-3 text-lg text-gray-700">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Delicious food & beverages</span>
            </div>
            <div className="flex items-center space-x-3 text-lg text-gray-700">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Fun activities & entertainment</span>
            </div>
            <div className="flex items-center space-x-3 text-lg text-gray-700">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Dedicated party coordinator</span>
            </div>
          </div>
          
          <Element
            id="slider-cta"
            is={Button}
            text={buttonText}
            href={buttonLink}
            size="px-8 py-4 text-lg"
            color="bg-purple-600 text-white"
            hoverColor="hover:bg-purple-700"
            borderRadius="rounded-full"
            canvas
          />
        </div>
      </div>
    </div>
  )
}

export const PartySliderSettings = () => {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }))

  const updateImage = (index, url) => {
    const updatedImages = [...props.images]
    updatedImages[index] = url
    setProp((props) => (props.images = updatedImages))
  }

  const addImage = () => {
    const updatedImages = [...props.images, 'https://via.placeholder.com/400x300']
    setProp((props) => (props.images = updatedImages))
  }

  const removeImage = (index) => {
    const updatedImages = props.images.filter((_, i) => i !== index)
    setProp((props) => (props.images = updatedImages))
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
            Gallery Images
          </label>
          <button
            onClick={addImage}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Add Image
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {props.images.map((image, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="url"
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="Image URL"
              />
              <button
                onClick={() => removeImage(index)}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Text
        </label>
        <input
          type="text"
          value={props.buttonText}
          onChange={(e) => setProp((props) => (props.buttonText = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Link
        </label>
        <input
          type="text"
          value={props.buttonLink}
          onChange={(e) => setProp((props) => (props.buttonLink = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="#booking or https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background
        </label>
        <select
          value={props.background}
          onChange={(e) => setProp((props) => (props.background = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="bg-white">White</option>
          <option value="bg-gray-50">Light Gray</option>
          <option value="bg-purple-50">Light Purple</option>
          <option value="bg-blue-50">Light Blue</option>
          <option value="bg-pink-50">Light Pink</option>
        </select>
      </div>
    </div>
  )
}

PartySlider.craft = {
  props: {
    title: 'Amazing Parties',
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    buttonText: 'Book Your Party',
    buttonLink: '#booking',
    background: 'bg-white',
    padding: 'p-8',
    borderRadius: 'rounded-xl',
    className: ''
  },
  related: {
    settings: PartySliderSettings
  }
}