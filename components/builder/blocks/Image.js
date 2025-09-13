import { useNode } from '@craftjs/core'

export const Image = ({ 
  src = 'https://via.placeholder.com/400x300',
  alt = 'Image',
  width = 'w-full',
  height = 'h-auto',
  objectFit = 'object-cover',
  borderRadius = 'rounded-none',
  margin = 'm-0',
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
      className={`${margin} ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
    >
      <img
        src={src}
        alt={alt}
        className={`${width} ${height} ${objectFit} ${borderRadius} ${className}`}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
        }}
      />
    </div>
  )
}

export const ImageSettings = () => {
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
          Image URL
        </label>
        <input
          type="url"
          value={props.src}
          onChange={(e) => setProp((props) => (props.src = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text
        </label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) => setProp((props) => (props.alt = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Image description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Width
        </label>
        <select
          value={props.width}
          onChange={(e) => setProp((props) => (props.width = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="w-full">Full Width</option>
          <option value="w-1/2">Half Width</option>
          <option value="w-1/3">One Third</option>
          <option value="w-2/3">Two Thirds</option>
          <option value="w-1/4">Quarter Width</option>
          <option value="w-64">Fixed (256px)</option>
          <option value="w-48">Fixed (192px)</option>
          <option value="w-32">Fixed (128px)</option>
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
          <option value="h-auto">Auto</option>
          <option value="h-32">128px</option>
          <option value="h-48">192px</option>
          <option value="h-64">256px</option>
          <option value="h-80">320px</option>
          <option value="h-96">384px</option>
          <option value="h-screen">Full Screen</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Object Fit
        </label>
        <select
          value={props.objectFit}
          onChange={(e) => setProp((props) => (props.objectFit = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="object-cover">Cover</option>
          <option value="object-contain">Contain</option>
          <option value="object-fill">Fill</option>
          <option value="object-none">None</option>
          <option value="object-scale-down">Scale Down</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Border Radius
        </label>
        <select
          value={props.borderRadius}
          onChange={(e) => setProp((props) => (props.borderRadius = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="rounded-none">None</option>
          <option value="rounded-sm">Small</option>
          <option value="rounded-md">Medium</option>
          <option value="rounded-lg">Large</option>
          <option value="rounded-xl">Extra Large</option>
          <option value="rounded-full">Full</option>
        </select>
      </div>
    </div>
  )
}

Image.craft = {
  props: {
    src: 'https://via.placeholder.com/400x300',
    alt: 'Image',
    width: 'w-full',
    height: 'h-auto',
    objectFit: 'object-cover',
    borderRadius: 'rounded-none',
    margin: 'm-0',
    className: ''
  },
  related: {
    settings: ImageSettings
  }
}