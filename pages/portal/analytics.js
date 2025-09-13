import { useState, useEffect } from 'react'
import PortalLayout from '../../components/portal/PortalLayout'

export default function PortalAnalytics() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    monthlyData: [],
    topPages: [],
    trafficSources: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  async function fetchAnalytics() {
    try {
      const token = localStorage.getItem('portal_token')
      const response = await fetch(`/api/portal/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PortalLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Performance metrics for your site</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            name="Total Leads"
            value={stats.totalLeads}
            change="+12.5%"
            changeType="increase"
            icon={UsersIcon}
            color="blue"
          />
          <StatCard
            name="Total Orders"
            value={stats.totalOrders}
            change="+8.2%"
            changeType="increase"
            icon={ShoppingBagIcon}
            color="green"
          />
          <StatCard
            name="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+15.3%"
            changeType="increase"
            icon={CurrencyDollarIcon}
            color="purple"
          />
          <StatCard
            name="Conversion Rate"
            value={`${stats.conversionRate}%`}
            change="+2.1%"
            changeType="increase"
            icon={TrendingUpIcon}
            color="indigo"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Traffic Sources</h3>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.trafficSources.map((source, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-medium text-gray-900">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{source.visitors}</div>
                        <div className="text-xs text-gray-500">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Performing Pages</h3>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{page.path}</div>
                        <div className="text-xs text-gray-500">{page.funnel_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{page.views}</div>
                        <div className="text-xs text-gray-500">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Conversion Funnel</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-gray-900">Page Views</div>
                    <div className="text-sm text-gray-600">Visitors landed on your pages</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalPageViews || 0}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-gray-900">Form Submissions</div>
                    <div className="text-sm text-gray-600">Visitors became leads</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalLeads}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-gray-900">Conversions</div>
                    <div className="text-sm text-gray-600">Leads became customers</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalOrders}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}

function StatCard({ name, value, change, changeType, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-8 w-8 rounded-md ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{name}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className={`font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-gray-500"> from last period</span>
        </div>
      </div>
    </div>
  )
}

function UsersIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
}

function ShoppingBagIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
    </svg>
  )
}

function CurrencyDollarIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrendingUpIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}