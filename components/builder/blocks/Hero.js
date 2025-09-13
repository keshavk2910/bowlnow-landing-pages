import { useNode, Element } from '@craftjs/core'
import { Text } from './Text'
import { Button } from './Button'

export const Hero = ({ 
  backgroundImage = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  backgroundColor = 'bg-gray-900',
  overlay = 'bg-black bg-opacity-50',
  height = 'h-screen',
  padding = 'p-12',
  textAlign = 'text-center',
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
      className={`relative ${height} ${backgroundColor} ${padding} ${textAlign} ${className} flex items-center justify-center ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlay}`}></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <Element 
          id="hero-title"
          is={Text}
          text="Hero Title"
          fontSize="text-5xl md:text-6xl"
          fontWeight="font-bold"
          textColor="text-white"
          textAlign="text-center"
          canvas
        />
        
        <Element 
          id="hero-subtitle"
          is={Text}
          text="Compelling subtitle that explains your value proposition"
          fontSize="text-xl md:text-2xl"
          textColor="text-gray-200"
          textAlign="text-center"
          canvas
        />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Element 
            id="hero-cta-primary"
            is={Button}
            text="Get Started"
            size="px-8 py-4 text-lg"
            color="bg-indigo-600 text-white"
            hoverColor="hover:bg-indigo-700"
            borderRadius="rounded-lg"
            canvas
          />
          
          <Element 
            id="hero-cta-secondary"
            is={Button}
            text="Learn More"
            size="px-8 py-4 text-lg"
            color="bg-transparent text-white border-2 border-white"
            hoverColor="hover:bg-white hover:text-gray-900"
            borderRadius="rounded-lg"
            canvas
          />
        </div>
      </div>
    </div>
  )
}

export const HeroSettings = () => {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image URL
        </label>
        <input
          type="url"
          value={props.backgroundImage}
          onChange={(e) => setProp((props) => (props.backgroundImage = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="https://example.com/hero-image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color (fallback)
        </label>
        <select
          value={props.backgroundColor}
          onChange={(e) => setProp((props) => (props.backgroundColor = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="bg-gray-900">Dark Gray</option>
          <option value="bg-black">Black</option>
          <option value="bg-indigo-900">Indigo</option>
          <option value="bg-blue-900">Blue</option>
          <option value="bg-purple-900">Purple</option>
          <option value="bg-green-900">Green</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overlay Opacity
        </label>
        <select
          value={props.overlay}
          onChange={(e) => setProp((props) => (props.overlay = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="bg-black bg-opacity-0">No Overlay</option>
          <option value="bg-black bg-opacity-25">25% Dark</option>
          <option value="bg-black bg-opacity-50">50% Dark</option>
          <option value="bg-black bg-opacity-75">75% Dark</option>
          <option value="bg-white bg-opacity-25">25% Light</option>
          <option value="bg-white bg-opacity-50">50% Light</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Height
        </label>
        <select
          value={props.height}
          onChange={(e) => setProp((props) => (props.height = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="h-96">Small (384px)</option>
          <option value="h-screen">Full Screen</option>
          <option value="h-[60vh]">60% Screen</option>
          <option value="h-[80vh]">80% Screen</option>
        </select>
      </div>
    </div>
  )
}

Hero.craft = {
  props: {
    backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundColor: 'bg-gray-900',
    overlay: 'bg-black bg-opacity-50',
    height: 'h-screen',
    padding: 'p-12',
    textAlign: 'text-center',
    className: ''
  },
  related: {
    settings: HeroSettings
  }
}