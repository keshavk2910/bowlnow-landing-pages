import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client
export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client for API routes
export function createRouteHandlerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        persistSession: false
      }
    }
  )
}

// Server-side Supabase client for pages
export function createServerComponentClient(cookies) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies.get(name)?.value
      },
      set(name, value, options) {
        cookies.set(name, value, options)
      },
      remove(name, options) {
        cookies.delete(name, options)
      },
    },
  })
}

// Standard client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)