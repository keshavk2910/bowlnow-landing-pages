import { createRouteHandlerClient } from '../../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createRouteHandlerClient()

    const eventsTemplateSchema = {
      sections: [
        {
          key: 'header',
          name: 'Header Section',
          order: 0,
          fields: [
            {
              key: 'hero_title',
              type: 'text',
              label: 'Hero Title',
              required: true,
              description: 'Main headline for the page'
            },
            {
              key: 'hero_subtitle',
              type: 'text',
              label: 'Hero Subtitle',
              required: false,
              description: 'Supporting text under the main headline'
            },
            {
              key: 'hero_background',
              type: 'image',
              label: 'Hero Background Image',
              required: false,
              description: 'Background image for the hero section'
            },
            {
              key: 'enabled',
              type: 'checkbox',
              label: 'Enable Header',
              required: false,
              description: 'Show/hide header section'
            }
          ],
          required: true,
          description: 'Page header with navigation and hero content'
        },
        {
          key: 'main_cta',
          name: 'Main CTA',
          order: 1,
          fields: [
            {
              key: 'cta_text',
              type: 'text',
              label: 'CTA Button Text',
              required: false,
              description: 'Main call to action button text'
            },
            {
              key: 'cta_link',
              type: 'url',
              label: 'CTA Button Link',
              required: false,
              description: 'Main call to action button link'
            }
          ],
          required: false,
          description: 'Main call-to-action configuration'
        },
        {
          key: 'features_slider',
          name: 'Features Slider',
          order: 2,
          fields: [
            {
              key: 'slider_1_title',
              type: 'text',
              label: 'Slider Title',
              required: false,
              description: 'Title for the features slider section'
            },
            {
              key: 'slides',
              type: 'slider',
              label: 'Feature Slides',
              required: false,
              description: 'Add feature slides',
              minSlides: 1,
              maxSlides: 10
            },
            {
              key: 'enabled',
              type: 'checkbox',
              label: 'Enable Features Slider',
              required: false,
              description: 'Show/hide features slider section'
            }
          ],
          required: false,
          description: 'Slider showcasing features'
        },
        {
          key: 'book_your_event_left',
          name: 'Book Your Event',
          order: 3,
          fields: [
            {
              key: 'title',
              type: 'text',
              label: 'Section Title',
              required: false,
              description: 'Title for the book your event section'
            },
            {
              key: 'subtitle',
              type: 'text',
              label: 'Section Subtitle',
              required: false,
              description: 'Subtitle for the book your event section'
            },
            {
              key: 'description',
              type: 'richtext',
              label: 'Description',
              required: false,
              description: 'Description text for the section (supports HTML)'
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
              key: 'cta_text',
              type: 'text',
              label: 'CTA Button Text',
              required: false,
              description: 'Call to action button text'
            },
            {
              key: 'cta_link',
              type: 'url',
              label: 'CTA Button Link',
              required: false,
              description: 'Call to action button link'
            },
            {
              key: 'enabled',
              type: 'checkbox',
              label: 'Enable Book Your Event',
              required: false,
              description: 'Show/hide book your event section'
            }
          ],
          required: false,
          description: 'Event booking section with flexible image positioning'
        },
        {
          key: 'events_slider',
          name: 'Events Slider',
          order: 4,
          fields: [
            {
              key: 'title',
              type: 'text',
              label: 'Slider Title',
              required: false,
              description: 'Title for the events slider section'
            },
            {
              key: 'slides',
              type: 'slider',
              label: 'Event Slides',
              required: false,
              description: 'Add event slides',
              minSlides: 1,
              maxSlides: 10
            },
            {
              key: 'enabled',
              type: 'checkbox',
              label: 'Enable Events Slider',
              required: false,
              description: 'Show/hide events slider section'
            }
          ],
          required: false,
          description: 'Slider showcasing events'
        },
        {
          key: 'contact_form',
          name: 'Contact Form',
          order: 5,
          fields: [
            {
              key: 'form_title',
              type: 'text',
              label: 'Form Title',
              required: false,
              description: 'Title for the contact form section'
            },
            {
              key: 'form_subtitle',
              type: 'text',
              label: 'Form Subtitle',
              required: false,
              description: 'Subtitle for the contact form section'
            },
            {
              key: 'enabled',
              type: 'checkbox',
              label: 'Enable Contact Form',
              required: false,
              description: 'Show/hide contact form section'
            }
          ],
          required: false,
          description: 'Contact form for user inquiries and bookings'
        }
      ]
    }

    // Update the specific EventsTemplate
    const { data: updatedTemplate, error: updateError } = await supabase
      .from('templates')
      .update({
        config_schema: eventsTemplateSchema,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'cd8a6d11-7410-4d55-be5b-0a04ac7822e9')
      .select()
      .single()

    if (updateError) {
      console.error('Error updating template:', updateError)
      return res.status(500).json({ error: 'Failed to update template', details: updateError })
    }

    res.status(200).json({
      success: true,
      message: 'EventsTemplate schema updated successfully',
      template: updatedTemplate,
      sectionsCount: eventsTemplateSchema.sections.length
    })

  } catch (error) {
    console.error('Error updating EventsTemplate schema:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update template schema'
    })
  }
}
