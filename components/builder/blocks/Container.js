import { useNode } from '@craftjs/core'

export const Container = ({ 
  children, 
  background = 'transparent',
  padding = 'p-6',
  margin = 'm-0',
  maxWidth = 'max-w-full',
  className = ''
}) => {
  const {
    connectors: { connect, drag }
  } = useNode()

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`${padding} ${margin} ${maxWidth} ${className}`}
      style={{ background }}
    >
      {children}
    </div>
  )
}

export const ContainerSettings = () => {
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
          Background Color
        </label>
        <input
          type="color"
          value={props.background === 'transparent' ? '#ffffff' : props.background}
          onChange={(e) => setProp((props) => (props.background = e.target.value))}
          className="w-full h-10 border border-gray-300 rounded"
        />
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
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Width
        </label>
        <select
          value={props.maxWidth}
          onChange={(e) => setProp((props) => (props.maxWidth = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="max-w-full">Full Width</option>
          <option value="max-w-7xl mx-auto">Container (7xl)</option>
          <option value="max-w-6xl mx-auto">Container (6xl)</option>
          <option value="max-w-4xl mx-auto">Container (4xl)</option>
          <option value="max-w-2xl mx-auto">Container (2xl)</option>
        </select>
      </div>
    </div>
  )
}

Container.craft = {
  props: {
    background: 'transparent',
    padding: 'p-6',
    margin: 'm-0',
    maxWidth: 'max-w-full',
    className: ''
  },
  related: {
    settings: ContainerSettings
  }
}