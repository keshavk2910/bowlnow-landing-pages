import { updateSitePage, deleteSitePage } from '../../../../lib/database'
import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  const { pageId } = req.query

  if (req.method === 'GET') {
    return handleGetPage(req, res, pageId)
  } else if (req.method === 'PATCH') {
    return handleUpdatePage(req, res, pageId)
  } else if (req.method === 'DELETE') {
    return handleDeletePage(req, res, pageId)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGetPage(req, res, pageId) {
  try {
    const supabase = createRouteHandlerClient()
    
    const { data: page, error } = await supabase
      .from('site_pages')
      .select(`
        *,
        templates (*),
        sites (*)
      `)
      .eq('id', pageId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Page not found' })
      }
      throw error
    }

    res.status(200).json({
      success: true,
      page
    })

  } catch (error) {
    console.error('Error fetching page:', error)
    res.status(500).json({ 
      error: 'Failed to fetch page',
      details: error.message
    })
  }
}

async function handleUpdatePage(req, res, pageId) {
  try {
    const updates = req.body

    // Remove any fields that shouldn't be updated directly
    delete updates.id
    delete updates.created_at
    delete updates.updated_at
    delete updates.site_id

    const updatedPage = await updateSitePage(pageId, updates)

    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      page: updatedPage
    })

  } catch (error) {
    console.error('Error updating page:', error)
    res.status(500).json({ 
      error: 'Failed to update page',
      details: error.message
    })
  }
}

async function handleDeletePage(req, res, pageId) {
  try {
    const supabase = createRouteHandlerClient()
    
    // First check if page exists and get info
    const { data: page, error: fetchError } = await supabase
      .from('site_pages')
      .select('id, name, is_homepage')
      .eq('id', pageId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Page not found' })
      }
      throw fetchError
    }

    // Prevent deletion of homepage
    if (page.is_homepage) {
      return res.status(400).json({ error: 'Cannot delete homepage. Set another page as homepage first.' })
    }

    // Delete the page
    await deleteSitePage(pageId)

    res.status(200).json({
      success: true,
      message: `Page "${page.name}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting page:', error)
    res.status(500).json({ 
      error: 'Failed to delete page',
      details: error.message
    })
  }
}