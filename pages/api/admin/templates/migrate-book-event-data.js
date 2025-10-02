import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    // Get all pages using EventsTemplate
    const { data: pages, error: fetchError } = await supabase
      .from('pages')
      .select('id, content, template_id, templates(name, type)')
      .eq('templates.type', 'events')

    if (fetchError) {
      console.error('Error fetching pages:', fetchError)
      return res.status(500).json({ error: 'Failed to fetch pages' })
    }

    let migratedCount = 0
    let skippedCount = 0
    const errors = []

    for (const page of pages) {
      try {
        // Check if page has book_your_event_half data
        if (page.content?.book_your_event_half) {
          const updatedContent = { ...page.content }

          // If book_your_event_left doesn't exist or is empty, migrate the data
          if (!updatedContent.book_your_event_left || Object.keys(updatedContent.book_your_event_left).length === 0) {
            // Copy data from book_your_event_half to book_your_event_left
            updatedContent.book_your_event_left = {
              ...updatedContent.book_your_event_half,
              image_position: 'left', // Default to left
              show_image: true // Default to showing image
            }

            // Update the page in database
            const { error: updateError } = await supabase
              .from('pages')
              .update({
                content: updatedContent,
                updated_at: new Date().toISOString()
              })
              .eq('id', page.id)

            if (updateError) {
              errors.push({ pageId: page.id, error: updateError.message })
            } else {
              migratedCount++
            }
          } else {
            skippedCount++
          }
        } else {
          skippedCount++
        }
      } catch (error) {
        errors.push({ pageId: page.id, error: error.message })
      }
    }

    res.status(200).json({
      success: true,
      message: `Migration completed. Migrated ${migratedCount} pages, skipped ${skippedCount} pages.`,
      migratedCount,
      skippedCount,
      totalPages: pages.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Error migrating data:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to migrate data'
    })
  }
}
