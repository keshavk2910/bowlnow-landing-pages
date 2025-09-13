import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';
export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/admin/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTemplates = templates.filter((template) => {
    if (filter === 'all') return true;
    return template.type === filter;
  });

  const templateTypes = ['all', 'landing', 'parties', 'events', 'bookings', 'bowling', 'template-page-one'];

  return (
    <AdminLayout title='Templates'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Templates</h1>
            <p className='text-gray-600'>Manage funnel templates and designs</p>
          </div>
          <div className="flex space-x-2">
            <Link
              href="/builder"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              🎨 Visual Builder
            </Link>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Create Template
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex space-x-2'>
            {templateTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {type === 'all'
                  ? 'All Templates'
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='bg-white rounded-lg shadow animate-pulse'>
                <div className='h-48 bg-gray-200 rounded-t-lg'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                  <div className='h-10 bg-gray-200 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}

        {!loading && filteredTemplates.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-lg mb-2'>No templates found</div>
            <p className='text-gray-500 mb-4'>
              {filter === 'all'
                ? 'No templates available'
                : `No ${filter} templates found`}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function TemplateCard({ template }) {
  const typeColors = {
    landing: 'bg-blue-100 text-blue-800',
    parties: 'bg-purple-100 text-purple-800',
    events: 'bg-green-100 text-green-800',
    bookings: 'bg-orange-100 text-orange-800',
    bowling: 'bg-red-100 text-red-800',
    'template-page-one': 'bg-blue-100 text-blue-800',
  };

  const typeIcons = {
    landing: '🏠',
    parties: '🎉',
    events: '📅',
    bookings: '📋',
    bowling: '🎳',
    'template-page-one': '🎯',
  };

  return (
    <div className='bg-white rounded-lg shadow hover:shadow-md transition-shadow'>
      <div className='h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center'>
        <div className='text-6xl'>{typeIcons[template.type] || '📄'}</div>
      </div>

      <div className='p-6'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {template.name}
          </h3>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              typeColors[template.type] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {template.type}
          </span>
        </div>

        <p className='text-gray-600 text-sm mb-4'>
          Category: {template.category} •{' '}
          {template.config_schema.fields?.length || 0} fields
        </p>

        <div className='flex space-x-2'>
          <Link
            href={`/admin/templates/${template.id}/edit`}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center'
          >
            Edit
          </Link>
          <Link
            href={`/preview/${template.type}`}
            target="_blank"
            rel="noopener noreferrer"
            className='flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors text-center'
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
