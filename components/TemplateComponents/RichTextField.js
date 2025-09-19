import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'

export default function RichTextField({ 
  value = '', 
  onChange, 
  label = "Rich Text Content",
  description = "Use the toolbar to format your text",
  placeholder = "Enter your content here...",
  className = ""
}) {
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  const [htmlContent, setHtmlContent] = useState(value)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    immediatelyRender: false, // Fix SSR hydration issue
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlContent(html)
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3',
      },
    },
  })

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-3">
        <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
      </div>
    )
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to visual - update editor with HTML content
      editor.commands.setContent(htmlContent)
      setIsHtmlMode(false)
    } else {
      // Switching from visual to HTML - get current HTML
      const currentHtml = editor.getHTML()
      setHtmlContent(currentHtml)
      setIsHtmlMode(true)
    }
  }

  const handleHtmlChange = (e) => {
    const newHtml = e.target.value
    setHtmlContent(newHtml)
    onChange(newHtml)
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 rounded-t-lg">
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bold') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('italic') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('strike') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Heading 1"
          >
            H1
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('paragraph') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Paragraph"
          >
            P
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bulletList') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Bullet List"
          >
            •
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('orderedList') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Numbered List"
          >
            1.
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Alignment */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Align Left"
          >
            ⬅
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Center"
          >
            ⬌
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Align Right"
          >
            ➡
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Links */}
          <button
            type="button"
            onClick={addLink}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('link') ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-gray-300'
            }`}
            title="Add Link"
          >
            🔗
          </button>

          <button
            type="button"
            onClick={removeLink}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="Remove Link"
          >
            🗙
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* HTML Mode Toggle */}
          <button
            type="button"
            onClick={toggleHtmlMode}
            className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
              isHtmlMode ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-gray-300'
            }`}
            title={isHtmlMode ? "Switch to Visual Editor" : "Edit HTML Source"}
          >
            {isHtmlMode ? 'Visual' : 'HTML'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="min-h-[120px] border border-gray-200 rounded-b-lg">
        {isHtmlMode ? (
          <textarea
            value={htmlContent}
            onChange={handleHtmlChange}
            className="w-full min-h-[120px] p-3 font-mono text-sm border-0 focus:outline-none resize-none"
            placeholder="<p>Enter HTML content...</p>"
          />
        ) : (
          <EditorContent 
            editor={editor} 
            className="min-h-[120px] p-3 prose prose-sm max-w-none rich-text-content"
          />
        )}
      </div>

      {/* Custom Styling for Rich Text Content */}
      <style jsx global>{`
        .rich-text-content h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 12px;
          margin-top: 16px;
        }
        .rich-text-content h2 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 12px;
        }
        .rich-text-content h3 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
          margin-top: 8px;
        }
        .rich-text-content p {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .rich-text-content ul {
          margin: 8px 0;
          padding-left: 24px;
          list-style-type: disc;
        }
        .rich-text-content ol {
          margin: 8px 0;
          padding-left: 24px;
          list-style-type: decimal;
        }
        .rich-text-content ul ul {
          list-style-type: circle;
          margin: 4px 0;
        }
        .rich-text-content ol ol {
          list-style-type: lower-alpha;
          margin: 4px 0;
        }
        .rich-text-content li {
          margin-bottom: 4px;
          line-height: 1.5;
          display: list-item;
        }
        .rich-text-content li p {
          margin: 0;
          display: inline;
        }
        .rich-text-content a {
          color: #3B82F6;
          text-decoration: underline;
        }
        .rich-text-content strong {
          font-weight: 600;
        }
        .rich-text-content em {
          font-style: italic;
        }
      `}</style>

      {/* Help Text */}
      {description && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 rounded-b-lg">
          {description}
        </div>
      )}
    </div>
  )
}