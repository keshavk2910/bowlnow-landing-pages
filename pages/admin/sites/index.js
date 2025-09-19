import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { createClientComponentClient } from '../../../lib/supabase';
import CopySiteModal from '../../../components/admin/CopySiteModal';

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, table

  useEffect(() => {
    fetchSites();
    // Load view preference from cookie
    const savedViewMode = getCookie('admin_sites_view_mode');
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'table')) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Cookie helper functions
  function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function handleViewModeChange(newViewMode) {
    setViewMode(newViewMode);
    setCookie('admin_sites_view_mode', newViewMode);
  }

  async function fetchSites() {
    try {
      // Use the API endpoint instead of direct Supabase query
      const response = await fetch('/api/admin/sites');
      if (response.ok) {
        const data = await response.json();
        setSites(data.sites);
      } else {
        console.error('Error fetching sites from API');
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.slug.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && site.status === filter;
  });

  async function toggleSiteStatus(siteId, currentStatus) {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const response = await fetch(`/api/admin/sites/id/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchSites(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating site status:', error);
    }
  }

  async function deleteSite(siteId, siteName) {
    if (
      !confirm(
        `Are you sure you want to delete "${siteName}"?\n\nThis will permanently delete:\n- The site and all its pages\n- All uploaded files and images\n- All customer data and orders\n- All client accounts\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    // Additional confirmation with site name
    const confirmName = prompt(`Type "${siteName}" to confirm deletion:`);
    if (confirmName !== siteName) {
      alert('Site name does not match. Deletion cancelled.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/sites/id/${siteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSites(); // Refresh the list
        alert('Site deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete site');
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Failed to delete site');
    }
  }

  return (
    <AdminLayout title='Sites Management'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Sites</h1>
            <p className='text-gray-600'>Manage client sites and pages</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCopyModal(true)}
              className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center'
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate Site
            </button>
            <Link
              href='/admin/sites/new'
              className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors'
            >
              Create New Site
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <div className='flex flex-col sm:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Search sites...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>

            {/* Status Filter */}
            <div className='sm:w-48'>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value='all'>All Sites</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className='flex rounded-md border border-gray-300'>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => handleViewModeChange('table')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h3M3 4h18M3 18h18" />
                </svg>
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Sites Display */}
        {loading ? (
          viewMode === 'grid' ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='bg-white rounded-lg shadow animate-pulse'>
                  <div className='p-6'>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
                    <div className='space-y-2'>
                      <div className='h-4 bg-gray-200 rounded'></div>
                      <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-white rounded-lg shadow'>
              <div className='animate-pulse'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <div className='h-6 bg-gray-200 rounded w-1/4'></div>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='px-6 py-4 border-b border-gray-200'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className='h-10 w-10 bg-gray-200 rounded-full'></div>
                        <div className='space-y-1'>
                          <div className='h-4 bg-gray-200 rounded w-32'></div>
                          <div className='h-3 bg-gray-200 rounded w-24'></div>
                        </div>
                      </div>
                      <div className='flex space-x-4'>
                        <div className='h-4 bg-gray-200 rounded w-16'></div>
                        <div className='h-4 bg-gray-200 rounded w-16'></div>
                        <div className='h-4 bg-gray-200 rounded w-16'></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : viewMode === 'grid' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onToggleStatus={toggleSiteStatus}
                onDelete={deleteSite}
              />
            ))}
          </div>
        ) : (
          <SitesTable
            sites={filteredSites}
            onToggleStatus={toggleSiteStatus}
            onDelete={deleteSite}
          />
        )}

        {!loading && filteredSites.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-lg mb-2'>No sites found</div>
            <p className='text-gray-500 mb-4'>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first site to get started'}
            </p>
            <Link
              href='/admin/sites/new'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
            >
              Create New Site
            </Link>
          </div>
        )}
      </div>

      {/* Copy Site Modal */}
      <CopySiteModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        onSuccess={(newSite) => {
          fetchSites()
          setShowCopyModal(false)
        }}
      />
    </AdminLayout>
  );
}

function SiteCard({ site, onToggleStatus, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await onToggleStatus(site.id, site.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(site.id, site.client_name);
  };

  return (
    <div className='bg-white rounded-lg shadow hover:shadow-md transition-shadow'>
      <div className='p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center'>
              <span className='text-sm font-medium text-indigo-700'>
                {site.client_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                {site.client_name}
              </h3>
              <p className='text-sm text-gray-500'>{site.slug}</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                site.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {site.status}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-900'>
              {site.pageCount}
            </div>
            <div className='text-sm text-gray-500'>Pages</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-900'>
              {site.customerCount}
            </div>
            <div className='text-sm text-gray-500'>Customers</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-900'>
              {site.orderCount}
            </div>
            <div className='text-sm text-gray-500'>Orders</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-gray-900'>
              ${site.totalRevenue.toFixed(0)}
            </div>
            <div className='text-sm text-gray-500'>Revenue</div>
          </div>
        </div>

        {/* Integration Status */}
        <div className='flex items-center justify-between text-sm mb-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center'>
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  site.stripe_account_id ? 'bg-green-400' : 'bg-gray-300'
                }`}
              ></div>
              <span className='text-gray-600'>Stripe</span>
            </div>
            <div className='flex items-center'>
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  site.ghl_location_id ? 'bg-green-400' : 'bg-gray-300'
                }`}
              ></div>
              <span className='text-gray-600'>GHL</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='grid grid-cols-2 gap-2'>
          <Link
            href={`/admin/sites/${site.slug}?tab=pages`}
            className='text-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
          >
            Manage
          </Link>

          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              site.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating
              ? 'Updating...'
              : site.status === 'active'
              ? 'Deactivate'
              : 'Activate'}
          </button>

          <Link
            href={`${
              process.env.NEXT_PUBLIC_FRONTEND_DOMAIN ||
              'https://partners.bowlnow.com'
            }/${site.slug}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-center flex items-center justify-center  gap-2 px-3 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors'
          >
            View Site <ExternalLinkIcon className='h-4 w-4' />
          </Link>

          <button
            onClick={handleDelete}
            className='px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SitesTable({ sites, onToggleStatus, onDelete }) {
  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Site
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Stats
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Integrations
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {sites.map((site) => (
            <SiteTableRow
              key={site.id}
              site={site}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SiteTableRow({ site, onToggleStatus, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await onToggleStatus(site.id, site.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(site.id, site.client_name);
  };

  return (
    <tr className='hover:bg-gray-50'>
      {/* Site Info */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center'>
            <span className='text-sm font-medium text-indigo-700'>
              {site.client_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900'>{site.client_name}</div>
            <div className='text-sm text-gray-500'>{site.slug}</div>
          </div>
        </div>
      </td>

      {/* Stats */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          <div className='flex space-x-4'>
            <span><strong>{site.pageCount}</strong> pages</span>
            <span><strong>{site.customerCount}</strong> customers</span>
          </div>
          <div className='flex space-x-4 text-gray-500'>
            <span>{site.orderCount} orders</span>
            <span>${site.totalRevenue.toFixed(0)} revenue</span>
          </div>
        </div>
      </td>

      {/* Integrations */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center'>
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                site.stripe_account_id ? 'bg-green-400' : 'bg-gray-300'
              }`}
            ></div>
            <span className='text-sm text-gray-600'>Stripe</span>
          </div>
          <div className='flex items-center'>
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                site.ghl_location_id ? 'bg-green-400' : 'bg-gray-300'
              }`}
            ></div>
            <span className='text-sm text-gray-600'>GHL</span>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            site.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {site.status}
        </span>
      </td>

      {/* Actions */}
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='flex items-center space-x-2'>
          <Link
            href={`/admin/sites/${site.slug}?tab=pages`}
            className='text-indigo-600 hover:text-indigo-900'
          >
            Manage
          </Link>
          
          <Link
            href={`${
              process.env.NEXT_PUBLIC_FRONTEND_DOMAIN ||
              'https://partners.bowlnow.com'
            }/${site.slug}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:text-blue-900 flex items-center'
          >
            View <ExternalLinkIcon className='h-3 w-3 ml-1' />
          </Link>

          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={`transition-colors ${
              site.status === 'active'
                ? 'text-red-600 hover:text-red-900'
                : 'text-green-600 hover:text-green-900'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdating
              ? 'Updating...'
              : site.status === 'active'
              ? 'Deactivate'
              : 'Activate'}
          </button>

          <button
            onClick={handleDelete}
            className='text-red-600 hover:text-red-900'
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function ExternalLinkIcon(props) {
  return (
    <svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
      />
    </svg>
  );
}
