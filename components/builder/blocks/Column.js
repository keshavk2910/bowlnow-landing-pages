import { useNode } from '@craftjs/core'

export const Column = ({ 
  children,
  width = 'w-full',
  padding = 'p-4',
  background = 'transparent',
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
      className={`${width} ${padding} ${className} ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
      style={{ background }}
    >
      {children}
    </div>
  )
}

export const ColumnSettings = () => {
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
          Column Width
        </label>
        <select
          value={props.width}
          onChange={(e) => setProp((props) => (props.width = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="w-full">Full Width (100%)</option>
          <option value="w-1/2">Half Width (50%)</option>
          <option value="w-1/3">One Third (33%)</option>
          <option value="w-2/3">Two Thirds (67%)</option>
          <option value="w-1/4">Quarter (25%)</option>
          <option value="w-3/4">Three Quarters (75%)</option>
          <option value="w-1/5">One Fifth (20%)</option>
          <option value="w-2/5">Two Fifths (40%)</option>
          <option value="w-3/5">Three Fifths (60%)</option>
          <option value="w-4/5">Four Fifths (80%)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Padding
        </label>
        <select
          value={props.padding}
          onChange={(e) => setProp((props) => (props.padding = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="p-0">None</option>
          <option value="p-2">Small</option>
          <option value="p-4">Medium</option>
          <option value="p-6">Large</option>
          <option value="p-8">Extra Large</option>
          <option value="py-4 px-6">Vertical Medium, Horizontal Large</option>
          <option value="py-8 px-4">Vertical Large, Horizontal Medium</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background
        </label>
        <div className="flex space-x-2">
          <input
            type="color"
            value={props.background === 'transparent' ? '#ffffff' : props.background}
            onChange={(e) => setProp((props) => (props.background = e.target.value))}
            className="w-16 h-10 border border-gray-300 rounded"
          />
          <button
            onClick={() => setProp((props) => (props.background = 'transparent'))}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Transparent
          </button>
        </div>
      </div>
    </div>
  )
}

Column.craft = {
  props: {
    width: 'w-full',
    padding: 'p-4',
    background: 'transparent',
    className: ''
  },
  related: {
    settings: ColumnSettings
  }
}