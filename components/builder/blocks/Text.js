import { useNode } from '@craftjs/core'
import ContentEditable from 'react-contenteditable'

export const Text = ({ 
  text = 'Enter your text here',
  fontSize = 'text-base',
  fontWeight = 'font-normal',
  textAlign = 'text-left',
  textColor = 'text-gray-900',
  margin = 'm-0',
  className = ''
}) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
    isHover
  } = useNode((state) => ({
    selected: state.events.selected,
    isHover: state.events.hovered
  }))

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`${fontSize} ${fontWeight} ${textAlign} ${textColor} ${margin} ${className} ${
        selected || isHover ? 'outline-2 outline-blue-500 outline-dashed' : ''
      }`}
    >
      <ContentEditable
        html={text}
        onChange={(e) => setProp((props) => (props.text = e.target.value))}
        tagName="div"
        disabled={false}
        className="outline-none"
      />
    </div>
  )
}

export const TextSettings = () => {
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
          Text Content
        </label>
        <textarea
          value={props.text}
          onChange={(e) => setProp((props) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size
        </label>
        <select
          value={props.fontSize}
          onChange={(e) => setProp((props) => (props.fontSize = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="text-xs">Extra Small</option>
          <option value="text-sm">Small</option>
          <option value="text-base">Base</option>
          <option value="text-lg">Large</option>
          <option value="text-xl">Extra Large</option>
          <option value="text-2xl">2XL</option>
          <option value="text-3xl">3XL</option>
          <option value="text-4xl">4XL</option>
          <option value="text-5xl">5XL</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Weight
        </label>
        <select
          value={props.fontWeight}
          onChange={(e) => setProp((props) => (props.fontWeight = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="font-thin">Thin</option>
          <option value="font-light">Light</option>
          <option value="font-normal">Normal</option>
          <option value="font-medium">Medium</option>
          <option value="font-semibold">Semibold</option>
          <option value="font-bold">Bold</option>
          <option value="font-extrabold">Extra Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Alignment
        </label>
        <select
          value={props.textAlign}
          onChange={(e) => setProp((props) => (props.textAlign = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="text-left">Left</option>
          <option value="text-center">Center</option>
          <option value="text-right">Right</option>
          <option value="text-justify">Justify</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <select
          value={props.textColor}
          onChange={(e) => setProp((props) => (props.textColor = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="text-gray-900">Dark Gray</option>
          <option value="text-gray-600">Medium Gray</option>
          <option value="text-gray-400">Light Gray</option>
          <option value="text-white">White</option>
          <option value="text-black">Black</option>
          <option value="text-blue-600">Blue</option>
          <option value="text-green-600">Green</option>
          <option value="text-red-600">Red</option>
          <option value="text-purple-600">Purple</option>
          <option value="text-indigo-600">Indigo</option>
        </select>
      </div>
    </div>
  )
}

Text.craft = {
  props: {
    text: 'Enter your text here',
    fontSize: 'text-base',
    fontWeight: 'font-normal',
    textAlign: 'text-left',
    textColor: 'text-gray-900',
    margin: 'm-0',
    className: ''
  },
  related: {
    settings: TextSettings
  }
}