import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    // BookYourEventHalf configuration with image fields
    const bookYourEventHalfConfig = {
      fields: [
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable',
          required: false,
          description: 'Show/hide this section'
        },
        {
          key: 'title',
          type: 'text',
          label: 'Title',
          required: false,
          description: 'Main headline for the section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          required: false,
          description: 'Secondary headline'
        },
        {
          key: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          description: 'Detailed description text'
        },
        {
          key: 'background_image',
          type: 'image',
          label: 'Background Image',
          required: false,
          description: 'Background image for the section'
        },
        {
          key: 'image_alt',
          type: 'text',
          label: 'Image Alt Text',
          required: false,
          description: 'Alternative text for the image (for accessibility)'
        },
        {
          key: 'secondary_image',
          type: 'image',
          label: 'Secondary Image',
          required: false,
          description: 'Optional secondary image for additional visual content'
        },
        {
          key: 'cta_text',
          type: 'text',
          label: 'CTA Text',
          required: false,
          description: 'Call to action button text'
        },
        {
          key: 'cta_link',
          type: 'url',
          label: 'CTA Link',
          required: false,
          description: 'Call to action button link'
        }
      ]
    }

    // BookYourEventLeft configuration with image fields
    const bookYourEventLeftConfig = {
      fields: [
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable',
          required: false,
          description: 'Show/hide this section'
        },
        {
          key: 'title',
          type: 'text',
          label: 'Title',
          required: false,
          description: 'Main headline for the section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          required: false,
          description: 'Secondary headline'
        },
        {
          key: 'description',
          type: 'textarea',
          label: 'Description',
          required: false,
          description: 'Detailed description text'
        },
        {
          key: 'background_image',
          type: 'image',
          label: 'Background Image',
          required: false,
          description: 'Background image for the section'
        },
        {
          key: 'image_alt',
          type: 'text',
          label: 'Image Alt Text',
          required: false,
          description: 'Alternative text for the image (for accessibility)'
        },
        {
          key: 'image_position',
          type: 'text',
          label: 'Image Position (left/right)',
          required: false,
          description: 'Position of the image relative to content'
        },
        {
          key: 'show_image',
          type: 'checkbox',
          label: 'Show Image',
          required: false,
          description: 'Show or hide the image'
        },
        {
          key: 'secondary_image',
          type: 'image',
          label: 'Secondary Image',
          required: false,
          description: 'Optional secondary image for additional visual content'
        },
        {
          key: 'cta_text',
          type: 'text',
          label: 'CTA Text',
          required: false,
          description: 'Call to action button text'
        },
        {
          key: 'cta_link',
          type: 'url',
          label: 'CTA Link',
          required: false,
          description: 'Call to action button link'
        }
      ]
    }

    // Update BookYourEventHalf
    const { data: halfData, error: halfError } = await supabase
      .from('template_sections')
      .update({
        config_schema: bookYourEventHalfConfig,
        updated_at: new Date().toISOString()
      })
      .eq('component_name', 'BookYourEventHalf')
      .select()

    if (halfError) {
      console.error('Error updating BookYourEventHalf:', halfError)
      throw halfError
    }

    // Update BookYourEventLeft
    const { data: leftData, error: leftError } = await supabase
      .from('template_sections')
      .update({
        config_schema: bookYourEventLeftConfig,
        updated_at: new Date().toISOString()
      })
      .eq('component_name', 'BookYourEventLeft')
      .select()

    if (leftError) {
      console.error('Error updating BookYourEventLeft:', leftError)
      throw leftError
    }

    res.status(200).json({
      success: true,
      message: 'BookYourEvent sections updated successfully',
      data: {
        bookYourEventHalf: halfData,
        bookYourEventLeft: leftData
      }
    })

  } catch (error) {
    console.error('Error updating BookYourEvent sections:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update sections'
    })
  }
}
