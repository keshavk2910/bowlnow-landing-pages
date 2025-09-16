import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { isAdminAuthenticated } from '../lib/admin-auth'

export default function AdminAuthGuard({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated()
      
      if (!authenticated) {
        router.push('/admin/login')
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    // Check authentication on mount
    checkAuth()

    // Check authentication on focus (in case token expired)
    const handleFocus = () => {
      if (!isAdminAuthenticated()) {
        router.push('/admin/login')
      }
    }

    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return children
}