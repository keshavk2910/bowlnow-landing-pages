import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sourceSiteId, newSiteName, newSiteSlug } = req.body

    // Validate required fields
    if (!sourceSiteId || !newSiteName || !newSiteSlug) {
      return res.status(400).json({ error: 'Source site, new name, and new slug are required' })
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(newSiteSlug)) {
      return res.status(400).json({ error: 'Slug can only contain lowercase letters, numbers, and hyphens' })
    }

    const supabase = createRouteHandlerClient()

    // Check if new slug already exists
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', newSiteSlug)
      .single()

    if (existingSite) {
      return res.status(400).json({ error: 'Site with this slug already exists' })
    }

    // Get source site data
    const { data: sourceSite, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', sourceSiteId)
      .single()

    if (siteError || !sourceSite) {
      return res.status(404).json({ error: 'Source site not found' })
    }

    // Create new site (exclude sensitive data)
    const newSiteData = {
      client_name: newSiteName,
      slug: newSiteSlug,
      logo_url: sourceSite.logo_url,
      contact_info: sourceSite.contact_info,
      contact_phone: sourceSite.contact_phone,
      footer_description: sourceSite.footer_description,
      tracking_pixels: sourceSite.tracking_pixels || {},
      settings: sourceSite.settings || {},
      default_pipeline_id: sourceSite.default_pipeline_id,
      default_pipeline_name: sourceSite.default_pipeline_name,
      default_stage_mappings: sourceSite.default_stage_mappings,
      status: 'active'
      // Note: Exclude stripe_account_id, ghl_location_id, ghl_location_token_encrypted
    }

    const { data: newSite, error: createError } = await supabase
      .from('sites')
      .insert([newSiteData])
      .select()
      .single()

    if (createError) throw createError

    // Get source site pages
    const { data: sourcePages, error: pagesError } = await supabase
      .from('site_pages')
      .select('*')
      .eq('site_id', sourceSiteId)

    if (pagesError) {
      console.error('Error fetching source pages:', pagesError)
    }

    // Duplicate pages if they exist
    if (sourcePages && sourcePages.length > 0) {
      const pagesToInsert = sourcePages.map(page => ({
        site_id: newSite.id,
        template_id: page.template_id,
        name: page.name,
        slug: page.slug,
        page_type: page.page_type,
        content: page.content,
        tracking_pixels: page.tracking_pixels,
        pipeline_id: page.pipeline_id,
        stage_mappings: page.stage_mappings,
        is_published: false, // Start as drafts
        is_homepage: page.is_homepage
      }))

      const { error: insertPagesError } = await supabase
        .from('site_pages')
        .insert(pagesToInsert)

      if (insertPagesError) {
        console.error('Error duplicating pages:', insertPagesError)
        // Continue even if pages fail to copy
      }
    }

    // Get source payment plans
    const { data: sourcePaymentPlans, error: plansError } = await supabase
      .from('payment_plans')
      .select('*')
      .eq('site_id', sourceSiteId)

    if (plansError) {
      console.error('Error fetching source payment plans:', plansError)
    }

    // Duplicate payment plans if they exist
    if (sourcePaymentPlans && sourcePaymentPlans.length > 0) {
      const plansToInsert = sourcePaymentPlans.map(plan => ({
        site_id: newSite.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        type: plan.type,
        billing_interval: plan.billing_interval,
        is_active: false // Start inactive until Stripe is configured
        // Note: Exclude stripe_price_id
      }))

      const { error: insertPlansError } = await supabase
        .from('payment_plans')
        .insert(plansToInsert)

      if (insertPlansError) {
        console.error('Error duplicating payment plans:', insertPlansError)
        // Continue even if plans fail to copy
      }
    }

    // Get final site data with counts
    const { data: finalSite } = await supabase
      .from('sites')
      .select(`
        *,
        site_pages!inner(count),
        payment_plans!inner(count)
      `)
      .eq('id', newSite.id)
      .single()

    res.status(200).json({
      success: true,
      message: 'Site duplicated successfully',
      site: finalSite || newSite,
      duplicated: {
        pages: sourcePages?.length || 0,
        paymentPlans: sourcePaymentPlans?.length || 0
      }
    })

  } catch (error) {
    console.error('Error duplicating site:', error)
    res.status(500).json({ 
      error: 'Failed to duplicate site',
      details: error.message
    })
  }
}