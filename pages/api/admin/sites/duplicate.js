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

    // Create new site (exclude sensitive data and GHL configuration)
    const newSiteData = {
      client_name: newSiteName,
      slug: newSiteSlug,
      logo_url: sourceSite.logo_url,
      contact_info: sourceSite.contact_info,
      contact_phone: sourceSite.contact_phone,
      contact_email: sourceSite.contact_email,
      footer_description: sourceSite.footer_description,
      tracking_pixels: sourceSite.tracking_pixels || {},
      settings: sourceSite.settings || {},
      status: 'active'
      // Note: Exclude ALL GHL fields: default_pipeline_id, default_pipeline_name, default_stage_mappings
      // Note: Exclude Stripe fields: stripe_account_id
      // Note: Exclude GHL fields: ghl_location_id, ghl_location_token_encrypted
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

    // Duplicate pages and their files
    if (sourcePages && sourcePages.length > 0) {
      const pagesToInsert = await Promise.all(
        sourcePages.map(async (page) => {
          // Process page content to update file URLs
          const updatedContent = await duplicatePageFiles(
            page.content,
            sourceSite.slug,
            newSiteSlug,
            supabase
          )

          return {
            site_id: newSite.id,
            template_id: page.template_id,
            name: page.name,
            slug: page.slug,
            page_type: page.page_type,
            content: updatedContent,
            tracking_pixels: page.tracking_pixels,
            // Note: Exclude pipeline_id and stage_mappings (GHL-specific)
            is_published: false, // Start as drafts
            is_homepage: page.is_homepage
          }
        })
      )

      const { error: insertPagesError } = await supabase
        .from('site_pages')
        .insert(pagesToInsert)

      if (insertPagesError) {
        console.error('Error duplicating pages:', insertPagesError)
        // Continue even if pages fail to copy
      }
    }

    // Copy site logo to new site folder
    if (sourceSite.logo_url) {
      try {
        const newLogoUrl = await duplicateSiteFile(
          sourceSite.logo_url,
          sourceSite.slug,
          newSiteSlug,
          'logo',
          supabase
        )
        
        if (newLogoUrl) {
          // Update new site with copied logo URL
          await supabase
            .from('sites')
            .update({ logo_url: newLogoUrl })
            .eq('id', newSite.id)
        }
      } catch (logoError) {
        console.error('Error copying site logo:', logoError)
        // Continue even if logo copy fails
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

// Helper function to duplicate files and update URLs in content
async function duplicatePageFiles(content, sourceSiteSlug, newSiteSlug, supabase) {
  if (!content || typeof content !== 'object') return content

  const updatedContent = JSON.parse(JSON.stringify(content)) // Deep copy
  
  // Recursively process content to find and update file URLs
  await processContentForFiles(updatedContent, sourceSiteSlug, newSiteSlug, supabase)
  
  return updatedContent
}

async function processContentForFiles(obj, sourceSiteSlug, newSiteSlug, supabase) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        // Process arrays (like sliders)
        for (let i = 0; i < obj[key].length; i++) {
          if (typeof obj[key][i] === 'object' && obj[key][i].url) {
            // This is likely a slider item with image URL
            const newUrl = await duplicateSiteFile(
              obj[key][i].url,
              sourceSiteSlug,
              newSiteSlug,
              `${key}_${i}`,
              supabase
            )
            if (newUrl) {
              obj[key][i].url = newUrl
            }
          } else if (typeof obj[key][i] === 'object') {
            await processContentForFiles(obj[key][i], sourceSiteSlug, newSiteSlug, supabase)
          }
        }
      } else {
        // Process nested objects
        await processContentForFiles(obj[key], sourceSiteSlug, newSiteSlug, supabase)
      }
    } else if (typeof obj[key] === 'string' && obj[key].includes('supabase.co/storage')) {
      // This is likely a direct image URL
      const newUrl = await duplicateSiteFile(
        obj[key],
        sourceSiteSlug,
        newSiteSlug,
        key,
        supabase
      )
      if (newUrl) {
        obj[key] = newUrl
      }
    }
  }
}

async function duplicateSiteFile(sourceUrl, sourceSiteSlug, newSiteSlug, filePrefix, supabase) {
  try {
    if (!sourceUrl || !sourceUrl.includes('supabase.co/storage')) {
      return sourceUrl // Not a Supabase storage file
    }

    // Extract file path from URL
    const urlParts = sourceUrl.split('/storage/v1/object/public/site-files/')
    if (urlParts.length < 2) return sourceUrl

    const sourceFilePath = urlParts[1]
    
    // Create new file path with new site slug
    const fileName = sourceFilePath.split('/').pop()
    const timestamp = Date.now()
    const newFileName = `${timestamp}-${fileName}`
    const newFilePath = `${newSiteSlug}/copied/${newFileName}`

    // Create storage client
    const { createClient } = await import('@supabase/supabase-js')
    const storageClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Download the original file
    const { data: fileData, error: downloadError } = await storageClient.storage
      .from('site-files')
      .download(sourceFilePath)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      return sourceUrl
    }

    // Upload to new location
    const { data: uploadData, error: uploadError } = await storageClient.storage
      .from('site-files')
      .upload(newFilePath, fileData, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading copied file:', uploadError)
      return sourceUrl
    }

    // Get public URL for new file
    const { data: urlData } = storageClient.storage
      .from('site-files')
      .getPublicUrl(newFilePath)

    // Create file record in database
    try {
      await supabase
        .from('site_files')
        .insert([{
          site_id: null, // Will be updated when site is created
          filename: newFileName,
          original_filename: fileName,
          file_path: newFilePath,
          file_url: urlData.publicUrl,
          file_size: fileData.size || null,
          mime_type: fileData.type || 'image/jpeg',
          file_type: 'image',
          field_key: `copied_${filePrefix}`,
          upload_context: {
            source: 'site_duplication',
            original_url: sourceUrl,
            copied_at: new Date().toISOString()
          }
        }])
    } catch (dbError) {
      console.error('Error creating file record:', dbError)
      // Continue even if database record fails
    }

    console.log(`File copied: ${sourceFilePath} → ${newFilePath}`)
    return urlData.publicUrl

  } catch (error) {
    console.error('Error copying file:', error)
    return sourceUrl // Return original URL if copy fails
  }
}