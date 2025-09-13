import { createRouteHandlerClient } from './supabase'

// Site management functions
export async function createSite(siteData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .insert([siteData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getSiteBySlug(slug) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export async function updateSite(id, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Template management functions
export async function getAllTemplates() {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getTemplatesByType(type) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('type', type)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Page session management functions
export async function getPageSession(sessionId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('page_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single()
  
  if (error) return null
  return data
}

export async function updatePageSession(sessionId, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('page_sessions')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Customer management functions
export async function createCustomer(customerData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getCustomerByEmail(siteId, email) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('site_id', siteId)
    .eq('email', email)
    .single()
  
  if (error) return null // Customer doesn't exist
  return data
}

export async function updateCustomer(id, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Attribution tracking functions
export async function createAttributionTracking(attributionData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('attribution_tracking')
    .insert([attributionData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAttributionBySession(sessionId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('attribution_tracking')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

// Funnel session management
export async function createFunnelSession(sessionData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('funnel_sessions')
    .insert([sessionData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getFunnelSession(sessionId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('funnel_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single()
  
  if (error) return null
  return data
}

export async function updateFunnelSession(sessionId, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('funnel_sessions')
    .update(updates)
    .eq('session_id', sessionId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Form submission functions
export async function createFormSubmission(submissionData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('form_submissions')
    .insert([submissionData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getFormSubmissionsBySite(siteId, limit = 50, offset = 0) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('form_submissions')
    .select(`
      *,
      customers (*),
      funnel_pages (
        slug,
        funnels (name, slug)
      )
    `)
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

// Order management functions
export async function createOrder(orderData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateOrder(id, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getOrdersBySite(siteId, limit = 50, offset = 0) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (*),
      payment_plans (*)
    `)
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data
}

// Payment plan functions
export async function createPaymentPlan(planData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('payment_plans')
    .insert([planData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getPaymentPlansBySite(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Site Pipeline configuration functions
export async function createSitePipelineConfig(configData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pipeline_config')
    .insert([configData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getSitePipelineConfigBySite(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pipeline_config')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

// Conversion tracking functions
export async function createConversion(conversionData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('conversions')
    .insert([conversionData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getConversionsBySite(siteId, dateRange = null) {
  const supabase = createRouteHandlerClient()
  
  let query = supabase
    .from('conversions')
    .select(`
      *,
      customers (*),
      funnels (name, slug)
    `)
    .eq('site_id', siteId)
    .order('timestamp', { ascending: false })
  
  if (dateRange) {
    query = query
      .gte('timestamp', dateRange.start)
      .lte('timestamp', dateRange.end)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

// Additional helper functions
export async function getAllSites() {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSiteById(id) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Site Pages management functions
export async function createSitePage(pageData) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pages')
    .insert([pageData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getSitePageBySlug(siteId, slug) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pages')
    .select(`
      *,
      templates (*),
      sites (*)
    `)
    .eq('site_id', siteId)
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export async function getSitePages(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pages')
    .select(`
      *,
      templates (name, type)
    `)
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function updateSitePage(pageId, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pages')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteSitePage(pageId) {
  const supabase = createRouteHandlerClient()
  
  const { error } = await supabase
    .from('site_pages')
    .delete()
    .eq('id', pageId)
  
  if (error) throw error
  return true
}

export async function getSiteHomePage(siteId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('site_pages')
    .select(`
      *,
      templates (*),
      sites (*)
    `)
    .eq('site_id', siteId)
    .eq('is_homepage', true)
    .single()
  
  if (error) {
    // If no homepage found, try to get the first page
    const { data: firstPage, error: firstPageError } = await supabase
      .from('site_pages')
      .select(`
        *,
        templates (*),
        sites (*)
      `)
      .eq('site_id', siteId)
      .eq('is_published', true)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
    
    if (firstPageError) throw firstPageError
    return firstPage
  }
  
  return data
}

// Missing exports for backward compatibility
export async function getOrderByStripeSession(sessionId) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('metadata->>stripe_session_id', sessionId)
    .single()
  
  if (error) return null
  return data
}

export async function updatePaymentPlan(planId, updates) {
  const supabase = createRouteHandlerClient()
  
  const { data, error } = await supabase
    .from('payment_plans')
    .update(updates)
    .eq('id', planId)
    .select()
    .single()
  
  if (error) throw error
  return data
}