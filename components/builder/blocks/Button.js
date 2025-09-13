import { useNode } from '@craftjs/core'

export const Button = ({ 
  text = 'Click me',
  href = '#',
  size = 'px-4 py-2',
  color = 'bg-indigo-600 text-white',
  hoverColor = 'hover:bg-indigo-700',
  borderRadius = 'rounded-md',
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
      className={`inline-block ${margin} ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
    >
      <a
        href={href}
        className={`inline-block ${size} ${color} ${hoverColor} ${borderRadius} ${className} transition-colors duration-200 font-medium text-center`}
      >
        {text}
      </a>
    </div>
  )
}

export const ButtonSettings = () => {
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
          Button Text
        </label>
        <input
          type="text"
          value={props.text}
          onChange={(e) => setProp((props) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link URL
        </label>
        <input
          type="url"
          value={props.href}
          onChange={(e) => setProp((props) => (props.href = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="https://example.com or #section"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Size
        </label>
        <select
          value={props.size}
          onChange={(e) => setProp((props) => (props.size = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="px-2 py-1 text-sm">Small</option>
          <option value="px-4 py-2">Medium</option>
          <option value="px-6 py-3 text-lg">Large</option>
          <option value="px-8 py-4 text-xl">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Style
        </label>
        <select
          value={props.color}
          onChange={(e) => {
            const colorMap = {
              'bg-indigo-600 text-white': 'hover:bg-indigo-700',
              'bg-green-600 text-white': 'hover:bg-green-700',
              'bg-red-600 text-white': 'hover:bg-red-700',
              'bg-blue-600 text-white': 'hover:bg-blue-700',
              'bg-purple-600 text-white': 'hover:bg-purple-700',
              'bg-white text-gray-900 border border-gray-300': 'hover:bg-gray-50',
              'bg-transparent text-indigo-600 border border-indigo-600': 'hover:bg-indigo-50'
            }
            setProp((props) => {
              props.color = e.target.value
              props.hoverColor = colorMap[e.target.value] || 'hover:opacity-80'
            })
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="bg-indigo-600 text-white">Primary (Indigo)</option>
          <option value="bg-green-600 text-white">Success (Green)</option>
          <option value="bg-red-600 text-white">Danger (Red)</option>
          <option value="bg-blue-600 text-white">Info (Blue)</option>
          <option value="bg-purple-600 text-white">Purple</option>
          <option value="bg-white text-gray-900 border border-gray-300">Secondary (White)</option>
          <option value="bg-transparent text-indigo-600 border border-indigo-600">Outline</option>
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
          <option value="rounded-full">Full (Pill)</option>
        </select>
      </div>
    </div>
  )
}

Button.craft = {
  props: {
    text: 'Click me',
    href: '#',
    size: 'px-4 py-2',
    color: 'bg-indigo-600 text-white',
    hoverColor: 'hover:bg-indigo-700',
    borderRadius: 'rounded-md',
    margin: 'm-0',
    className: ''
  },
  related: {
    settings: ButtonSettings
  }
}