import Head from 'next/head'
import Link from 'next/link'

export default function TemplateGallery() {
  const templates = [
    {
      type: 'template-page-one',
      name: 'Template Page One',
      description: '100% exact replica of Pleasant Hill Lanes design with hero, features grid, carousel, and booking form',
      color: 'blue',
      icon: '🎳',
      preview: '/preview/template-page-one'
    },
    {
      type: 'bowling',
      name: 'Bowling Alley',
      description: 'Complete bowling alley website with carousel, features, and event booking - modeled after Pleasant Hill Lanes',
      color: 'red',
      icon: '🎳',
      preview: '/preview/bowling'
    },
    {
      type: 'landing',
      name: 'Landing Page',
      description: 'Professional business landing page with hero section and contact form',
      color: 'blue',
      icon: '📄',
      preview: '/preview/landing'
    },
    {
      type: 'parties',
      name: 'Party Events',
      description: 'Event planning template with image sliders and party booking forms',
      color: 'purple',
      icon: '🎉',
      preview: '/preview/parties'
    },
    {
      type: 'events',
      name: 'Corporate Events',
      description: 'Professional event planning for conferences and corporate gatherings',
      color: 'green',
      icon: '🏢',
      preview: '/preview/events'
    },
    {
      type: 'bookings',
      name: 'Service Bookings',
      description: 'Service booking template with package selection and reservation system',
      color: 'indigo',
      icon: '📅',
      preview: '/preview/bookings'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Head>
        <title>Template Gallery - BowlNow</title>
        <meta name="description" content="Browse and preview all available funnel templates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Template Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our professional funnel templates with live previews. 
            Each template includes complete attribution tracking and CRM integration.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.type} template={template} />
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Template Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600 text-sm">Optimized for all devices and screen sizes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Tracking</h3>
              <p className="text-gray-600 text-sm">Complete attribution and analytics built-in</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CRM Integration</h3>
              <p className="text-gray-600 text-sm">Automatic GoHighLevel synchronization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Ready</h3>
              <p className="text-gray-600 text-sm">Stripe Connect checkout integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ template }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    green: 'border-green-200 bg-green-50',
    indigo: 'border-indigo-200 bg-indigo-50',
    red: 'border-red-200 bg-red-50'
  }

  const buttonColors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    red: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <div className={`${colorClasses[template.color]} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
      {/* Template Preview */}
      <div className="relative h-48 bg-white rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {template.icon}
        </div>
        <div className="absolute top-2 right-2">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Live Preview
          </span>
        </div>
      </div>

      {/* Template Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
        <p className="text-gray-600 text-sm">{template.description}</p>
        
        {/* Actions */}
        <div className="flex space-x-3">
          <Link
            href={template.preview}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center px-4 py-2 text-white rounded-lg font-medium transition-colors ${buttonColors[template.color]}`}
          >
            Live Preview
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Use Template
          </Link>
        </div>

        {/* Template Type */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Template Type: <span className="font-medium">{template.type}</span>
        </div>
      </div>
    </div>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}