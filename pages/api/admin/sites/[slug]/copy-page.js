import { createRouteHandlerClient } from '../../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug: targetSiteSlug } = req.query
    const { sourceSiteSlug, sourcePageId, copyOptions } = req.body

    if (!sourceSiteSlug || !sourcePageId) {
      return res.status(400).json({ error: 'Source site and page ID are required' })
    }

    const supabase = createRouteHandlerClient()

    // Get target site
    const { data: targetSite, error: targetSiteError } = await supabase
      .from('sites')
      .select('id, client_name, slug')
      .eq('slug', targetSiteSlug)
      .single()

    if (targetSiteError || !targetSite) {
      return res.status(404).json({ error: 'Target site not found' })
    }

    // Get source site
    const { data: sourceSite, error: sourceSiteError } = await supabase
      .from('sites')
      .select('id, client_name, slug')
      .eq('slug', sourceSiteSlug)
      .single()

    if (sourceSiteError || !sourceSite) {
      return res.status(404).json({ error: 'Source site not found' })
    }

    // Get source page with all related data
    const { data: sourcePage, error: sourcePageError } = await supabase
      .from('site_pages')
      .select(`
        *,
        payment_plans(*),
        site_files(*)
      `)
      .eq('id', sourcePageId)
      .eq('site_id', sourceSite.id)
      .single()

    if (sourcePageError || !sourcePage) {
      return res.status(404).json({ error: 'Source page not found' })
    }

    // Generate new unique slug for the copied page
    let newSlug = sourcePage.slug
    let slugCounter = 1

    // Check if slug already exists in target site
    while (true) {
      const { data: existingPage } = await supabase
        .from('site_pages')
        .select('id')
        .eq('site_id', targetSite.id)
        .eq('slug', newSlug)
        .single()

      if (!existingPage) break // Slug is available
      
      newSlug = `${sourcePage.slug}-${slugCounter}`
      slugCounter++
    }

    // If making this the homepage, unset current homepage
    if (copyOptions.makeHomepage) {
      await supabase
        .from('site_pages')
        .update({ is_homepage: false })
        .eq('site_id', targetSite.id)
        .eq('is_homepage', true)
    }

    // Create the new page
    const newPageData = {
      site_id: targetSite.id,
      template_id: sourcePage.template_id,
      name: `${sourcePage.name} (Copy)`,
      slug: newSlug,
      page_type: sourcePage.page_type,
      content: sourcePage.content,
      tracking_pixels: sourcePage.tracking_pixels,
      is_published: false, // Always start as draft
      is_homepage: copyOptions.makeHomepage || false,
      pipeline_id: copyOptions.copyPipelineConfig ? sourcePage.pipeline_id : null,
      pipeline_name: copyOptions.copyPipelineConfig ? sourcePage.pipeline_name : null,
      stage_mappings: copyOptions.copyPipelineConfig ? sourcePage.stage_mappings : {}
    }

    const { data: newPage, error: createPageError } = await supabase
      .from('site_pages')
      .insert(newPageData)
      .select()
      .single()

    if (createPageError) {
      console.error('Error creating page:', createPageError)
      return res.status(500).json({ error: 'Failed to create page copy' })
    }

    let copiedItems = {
      page: true,
      paymentPlans: 0,
      files: 0
    }

    // Copy payment plans if requested
    if (copyOptions.copyPaymentPlans && sourcePage.payment_plans?.length > 0) {
      for (const plan of sourcePage.payment_plans) {
        const newPlanData = {
          site_id: targetSite.id,
          page_id: newPage.id,
          name: plan.name,
          description: plan.description,
          price: plan.price,
          currency: plan.currency,
          type: plan.type,
          billing_interval: plan.billing_interval,
          is_active: plan.is_active,
          // Note: stripe_price_id is NOT copied - needs to be set up separately
          stripe_price_id: null
        }

        const { error: planError } = await supabase
          .from('payment_plans')
          .insert(newPlanData)

        if (!planError) {
          copiedItems.paymentPlans++
        } else {
          console.error('Error copying payment plan:', planError)
        }
      }
    }

    // Copy files if requested
    if (copyOptions.copyFiles && sourcePage.site_files?.length > 0) {
      for (const file of sourcePage.site_files) {
        const newFileData = {
          site_id: targetSite.id,
          page_id: newPage.id,
          filename: file.filename,
          original_filename: file.original_filename,
          file_path: file.file_path,
          file_url: file.file_url,
          file_size: file.file_size,
          mime_type: file.mime_type,
          file_type: file.file_type,
          field_key: file.field_key,
          upload_context: file.upload_context
        }

        const { error: fileError } = await supabase
          .from('site_files')
          .insert(newFileData)

        if (!fileError) {
          copiedItems.files++
        } else {
          console.error('Error copying file:', fileError)
        }
      }
    }

    res.status(200).json({
      success: true,
      page: newPage,
      copiedItems,
      message: `Page "${sourcePage.name}" copied successfully to ${targetSite.client_name}`
    })

  } catch (error) {
    console.error('Error copying page:', error)
    res.status(500).json({ 
      error: 'Failed to copy page',
      details: error.message
    })
  }
}