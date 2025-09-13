import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../components/admin/AdminLayout'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [siteFilter, setSiteFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchClientsAndSites()
  }, [])

  async function fetchClientsAndSites() {
    try {
      const [clientsRes, sitesRes] = await Promise.all([
        fetch('/api/admin/clients'),
        fetch('/api/admin/sites')
      ])

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        setClients(clientsData.clients)
      }

      if (sitesRes.ok) {
        const sitesData = await sitesRes.json()
        setSites(sitesData.sites)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.sites?.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSite = siteFilter === 'all' || client.site_id === siteFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && client.is_active) ||
                         (statusFilter === 'inactive' && !client.is_active)
    
    return matchesSearch && matchesSite && matchesStatus
  })

  async function toggleClientStatus(clientId, currentStatus) {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      if (response.ok) {
        fetchClientsAndSites() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating client status:', error)
    }
  }

  async function deleteClient(clientId, clientName) {
    if (!confirm(`Are you sure you want to delete client "${clientName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchClientsAndSites() // Refresh the list
        alert('Client deleted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete client')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client')
    }
  }

  return (
    <AdminLayout title="Client Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600">Manage client accounts and site access</p>
          </div>
          <Link
            href="/admin/clients/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create New Client
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Site Filter */}
            <div>
              <select
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Sites</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.client_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            ) : filteredClients.length > 0 ? (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onToggleStatus={toggleClientStatus}
                    onDelete={deleteClient}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No clients found</div>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first client to get started'}
                </p>
                <Link
                  href="/admin/clients/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create New Client
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function ClientCard({ client, onToggleStatus, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleStatus = async () => {
    setIsUpdating(true)
    try {
      await onToggleStatus(client.id, client.is_active)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    onDelete(client.id, client.name)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-700">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{client.name}</div>
            <div className="text-sm text-gray-500">{client.email}</div>
            <div className="text-xs text-gray-500">
              Site: {client.sites?.client_name} • Created: {new Date(client.created_at).toLocaleDateString()}
            </div>
            {client.last_login && (
              <div className="text-xs text-gray-400">
                Last login: {new Date(client.last_login).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            client.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {client.is_active ? 'Active' : 'Inactive'}
          </span>

          <div className="flex space-x-2">
            <Link
              href={`/admin/clients/${client.id}/edit`}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Edit
            </Link>
            
            <button
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className={`text-sm ${
                client.is_active
                  ? 'text-red-600 hover:text-red-800'
                  : 'text-green-600 hover:text-green-800'
              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? 'Updating...' : client.is_active ? 'Deactivate' : 'Activate'}
            </button>

            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>

            <Link
              href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'http://localhost:3000'}/${client.sites?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}