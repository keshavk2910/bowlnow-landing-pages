import { useNode } from '@craftjs/core'

export const Spacer = ({ 
  height = 'h-8',
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
      className={`${height} ${className} ${
        selected || isHover ? 'bg-blue-100 border-2 border-blue-300 border-dashed' : 'bg-gray-100'
      } flex items-center justify-center`}
    >
      {(selected || isHover) && (
        <span className="text-xs text-blue-600 font-medium">Spacer</span>
      )}
    </div>
  )
}

export const SpacerSettings = () => {
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
          Spacer Height
        </label>
        <select
          value={props.height}
          onChange={(e) => setProp((props) => (props.height = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="h-2">Extra Small (8px)</option>
          <option value="h-4">Small (16px)</option>
          <option value="h-6">Medium Small (24px)</option>
          <option value="h-8">Medium (32px)</option>
          <option value="h-12">Large (48px)</option>
          <option value="h-16">Extra Large (64px)</option>
          <option value="h-20">2XL (80px)</option>
          <option value="h-24">3XL (96px)</option>
          <option value="h-32">4XL (128px)</option>
          <option value="h-40">5XL (160px)</option>
        </select>
      </div>

      <div className="text-xs text-gray-500">
        Spacers are invisible in the live template but help create vertical spacing between sections.
      </div>
    </div>
  )
}

Spacer.craft = {
  props: {
    height: 'h-8',
    className: ''
  },
  related: {
    settings: SpacerSettings
  }
}