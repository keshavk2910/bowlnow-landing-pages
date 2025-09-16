import { getSiteBySlug, updateSite } from '../../../../../lib/database'
import { createRouteHandlerClient } from '../../../../../lib/supabase'

export default async function handler(req, res) {
  const { siteId } = req.query

  if (req.method === 'GET') {
    return handleGetSite(req, res, siteId)
  } else if (req.method === 'PATCH') {
    return handleUpdateSite(req, res, siteId)
  } else if (req.method === 'DELETE') {
    return handleDeleteSite(req, res, siteId)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetSite(req, res, siteId) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data: site, error } = await supabase
      .from('sites')
      .select(`
        *,
        site_pages:site_pages(*),
        site_pipeline_config:site_pipeline_config(*),
        payment_plans:payment_plans(*)
      `)
      .eq('id', siteId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Site not found' })
      }
      throw error
    }

    res.status(200).json({
      success: true,
      site
    })

  } catch (error) {
    console.error('Error fetching site:', error)
    res.status(500).json({ 
      error: 'Failed to fetch site',
      details: error.message
    })
  }
}

async function handleUpdateSite(req, res, siteId) {
  try {
    const updates = req.body

    // Remove any fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.updated_at

    const updatedSite = await updateSite(siteId, updates)

    res.status(200).json({
      success: true,
      message: 'Site updated successfully',
      site: updatedSite
    })

  } catch (error) {
    console.error('Error updating site:', error)
    res.status(500).json({ 
      error: 'Failed to update site',
      details: error.message
    })
  }
}

async function handleDeleteSite(req, res, siteId) {
  try {
    const supabase = createRouteHandlerClient()
    
    // First check if site exists and get site info
    const { data: site, error: fetchError } = await supabase
      .from('sites')
      .select('id, client_name, slug')
      .eq('id', siteId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Site not found' })
      }
      throw fetchError
    }

    // Get all files associated with this site for cleanup
    const { data: siteFiles } = await supabase
      .from('site_files')
      .select('file_path')
      .eq('site_id', siteId)

    // Delete files from Supabase Storage
    if (siteFiles && siteFiles.length > 0) {
      const filePaths = siteFiles.map(file => file.file_path)
      
      // Create storage client for file deletion
      const { createClient } = await import('@supabase/supabase-js')
      const storageClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      
      const { error: storageError } = await storageClient.storage
        .from('site-files')
        .remove(filePaths)

      if (storageError) {
        console.error('Error deleting files from storage:', storageError)
        // Continue with deletion even if file cleanup fails
      }
    }

    // Delete the site (this will cascade delete related records due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: `Site "${site.client_name}" and all related data deleted successfully`,
      deletedFiles: siteFiles?.length || 0
    })

  } catch (error) {
    console.error('Error deleting site:', error)
    res.status(500).json({ 
      error: 'Failed to delete site',
      details: error.message
    })
  }
}