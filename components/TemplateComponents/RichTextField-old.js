import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function RichTextField({ 
  value = '', 
  onChange, 
  label = "Rich Text Content",
  description = "Use the toolbar to format your text",
  placeholder = "Enter your content here...",
  height = 300,
  className = ""
}) {
  const editorRef = useRef(null)

  const handleEditorChange = (content) => {
    onChange(content)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          apiKey="no-api-key" // Using TinyMCE without API key for local development
          onInit={(evt, editor) => editorRef.current = editor}
          value={value}
          onEditorChange={handleEditorChange}
          init={{
            height: height,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | link | code | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; }',
            placeholder: placeholder,
            branding: false,
            resize: false,
            statusbar: false,
            skin: 'oxide',
            content_css: 'default',
            paste_as_text: false,
            paste_retain_style_properties: 'font-weight font-style color',
            setup: (editor) => {
              editor.on('init', () => {
                if (placeholder && !value) {
                  editor.setContent(`<p style="color: #9CA3AF;">${placeholder}</p>`)
                }
              })
            }
          }}
        />
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  )
}