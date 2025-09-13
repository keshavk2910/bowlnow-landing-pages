import { useNode, Element } from '@craftjs/core'
import { Text } from './Text'
import { Button } from './Button'

export const ContactForm = ({ 
  title = 'Get In Touch',
  subtitle = 'Send us a message and we\'ll get back to you',
  formFields = ['name', 'email', 'phone', 'message'],
  submitButtonText = 'Send Message',
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
      <div className="max-w-2xl mx-auto">
        <Element
          id="form-title"
          is={Text}
          text={title}
          fontSize="text-3xl"
          fontWeight="font-bold"
          textAlign="text-center"
          margin="mb-4"
          canvas
        />
        
        <Element
          id="form-subtitle"
          is={Text}
          text={subtitle}
          fontSize="text-lg"
          textColor="text-gray-600"
          textAlign="text-center"
          margin="mb-8"
          canvas
        />

        <form className="space-y-4">
          {formFields.includes('name') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
                disabled
              />
            </div>
          )}

          {formFields.includes('email') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
                disabled
              />
            </div>
          )}

          {formFields.includes('phone') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="(555) 123-4567"
                disabled
              />
            </div>
          )}

          {formFields.includes('message') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about your needs..."
                disabled
              />
            </div>
          )}

          <div className="text-center pt-4">
            <Element
              id="form-submit-btn"
              is={Button}
              text={submitButtonText}
              size="px-8 py-3 text-lg"
              color="bg-indigo-600 text-white"
              borderRadius="rounded-lg"
              canvas
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export const ContactFormSettings = () => {
  const {
    actions: { setProp },
    props
  } = useNode((node) => ({
    props: node.data.props
  }))

  const toggleField = (field) => {
    const currentFields = [...props.formFields]
    const index = currentFields.indexOf(field)
    
    if (index > -1) {
      currentFields.splice(index, 1)
    } else {
      currentFields.push(field)
    }
    
    setProp((props) => (props.formFields = currentFields))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Form Title
        </label>
        <input
          type="text"
          value={props.title}
          onChange={(e) => setProp((props) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle
        </label>
        <textarea
          value={props.subtitle}
          onChange={(e) => setProp((props) => (props.subtitle = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Form Fields
        </label>
        <div className="space-y-2">
          {['name', 'email', 'phone', 'message'].map((field) => (
            <label key={field} className="flex items-center">
              <input
                type="checkbox"
                checked={props.formFields.includes(field)}
                onChange={() => toggleField(field)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{field}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Submit Button Text
        </label>
        <input
          type="text"
          value={props.submitButtonText}
          onChange={(e) => setProp((props) => (props.submitButtonText = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Style
        </label>
        <select
          value={props.background}
          onChange={(e) => setProp((props) => (props.background = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="bg-gray-50">Light Gray</option>
          <option value="bg-white">White</option>
          <option value="bg-blue-50">Light Blue</option>
          <option value="bg-green-50">Light Green</option>
          <option value="bg-purple-50">Light Purple</option>
          <option value="bg-transparent">Transparent</option>
        </select>
      </div>
    </div>
  )
}

ContactForm.craft = {
  props: {
    title: 'Get In Touch',
    subtitle: 'Send us a message and we\'ll get back to you',
    formFields: ['name', 'email', 'phone', 'message'],
    submitButtonText: 'Send Message',
    background: 'bg-gray-50',
    padding: 'p-8',
    borderRadius: 'rounded-lg',
    className: ''
  },
  related: {
    settings: ContactFormSettings
  }
}