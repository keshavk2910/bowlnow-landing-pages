/**
 * Landing Page Template Configuration Schema
 * Defines the sections and fields for the landing page template
 */

export const LANDING_PAGE_CONFIG = {
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
          key: 'header_cta_text',
          type: 'text',
          label: 'Header CTA Text',
          required: false,
          description: 'Call to action text in header'
        },
        {
          key: 'header_cta_link',
          type: 'url',
          label: 'Header CTA Link',
          required: true,
          description: 'Header CTA button link'
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
      key: 'features_slider',
      name: 'Features Slider',
      order: 1,
      fields: [
        {
          key: 'slider_1_title',
          type: 'text',
          label: 'Slider Title',
          required: false,
          description: 'Title for the features slider section'
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
      description: 'Features slider section with customizable slides'
    },
    {
      key: 'book_your_event',
      name: 'Book Your Event',
      order: 2,
      fields: [
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Book Your Event',
          required: false,
          description: 'Show/hide book your event section'
        }
      ],
      required: false,
      description: 'Book your event section with call-to-action'
    },
    {
      key: 'events_slider',
      name: 'Events Slider',
      order: 3,
      fields: [
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Events Slider',
          required: false,
          description: 'Show/hide events slider section'
        }
      ],
      required: false,
      description: 'Events slider section with event information'
    },
    {
      key: 'promo_banner',
      name: 'Promo Banner',
      order: 3.5,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Title',
          required: false,
          description: 'Main headline for the banner'
        },
        {
          key: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          required: false,
          description: 'Supporting text for the banner'
        },
        {
          key: 'background_image',
          type: 'image',
          label: 'Background Image',
          required: false,
          description: 'Banner background image'
        },
        {
          key: 'overlay_opacity',
          type: 'text',
          label: 'Overlay Opacity (0-1)',
          required: false,
          description: 'Dark overlay strength on image background'
        },
        {
          key: 'text_alignment',
          type: 'text',
          label: 'Text Alignment (left/center/right)',
          required: false,
          description: 'Align text content in the banner'
        },
        {
          key: 'cta_text',
          type: 'text',
          label: 'CTA Text',
          required: false,
          description: 'Primary button text'
        },
        {
          key: 'cta_link',
          type: 'url',
          label: 'CTA Link',
          required: false,
          description: 'Primary button link'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Promo Banner',
          required: false,
          description: 'Show/hide promo banner section'
        }
      ],
      required: false,
      description: 'Promotional banner with image background and CTA'
    },
    {
      key: 'table_section',
      name: 'Table Section',
      order: 4,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Table Section Title',
          required: false,
          description: 'Title for the table section'
        },
        {
          key: 'subtitle',
          type: 'textarea',
          label: 'Table Section Subtitle',
          required: false,
          description: 'Subtitle or description for the table section'
        },
        {
          key: 'table_data',
          type: 'table',
          label: 'Table Data',
          required: false,
          description: 'Configure your table with rows and columns',
          columns: [
            { key: 'column1', label: 'Column 1', type: 'text' },
            { key: 'column2', label: 'Column 2', type: 'text' },
            { key: 'column3', label: 'Column 3', type: 'text' }
          ],
          minRows: 1,
          maxRows: 50
        },
        {
          key: 'show_borders',
          type: 'checkbox',
          label: 'Show Table Borders',
          required: false,
          description: 'Display borders around table cells'
        },
        {
          key: 'striped_rows',
          type: 'checkbox',
          label: 'Striped Rows',
          required: false,
          description: 'Alternate row colors for better readability'
        },
        {
          key: 'hover_effect',
          type: 'checkbox',
          label: 'Hover Effect',
          required: false,
          description: 'Highlight rows on hover'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Table Section',
          required: false,
          description: 'Show/hide table section'
        }
      ],
      required: false,
      description: 'Dynamic table section with customizable rows and columns'
    },
    {
      key: 'book_your_event_left',
      name: 'Book Your Event Left',
      order: 5,
      fields: [
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
        },
        {
          key: 'background_image',
          type: 'image',
          label: 'Background Image',
          required: false,
          description: 'Section background image'
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
          description: 'Display the background image'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Book Your Event Left',
          required: false,
          description: 'Show/hide book your event left section'
        }
      ],
      required: false,
      description: 'Book your event section with left-aligned content and image'
    },
    {
      key: 'card_grid',
      name: 'Card Grid',
      order: 6,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Section Title',
          required: false,
          description: 'Main title for the card grid section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Section Subtitle',
          required: false,
          description: 'Subtitle for the card grid section'
        },
        {
          key: 'columns',
          type: 'text',
          label: 'Number of Columns (1-6)',
          required: false,
          description: 'Number of columns in the grid (1-6)'
        },
        {
          key: 'rows',
          type: 'text',
          label: 'Number of Rows (optional)',
          required: false,
          description: 'Limit number of rows (leave empty for auto)'
        },
        {
          key: 'max_cards_per_row',
          type: 'text',
          label: 'Max Cards Per Row',
          required: false,
          description: 'Maximum cards per row (default: 4)'
        },
        {
          key: 'min_cards_per_row',
          type: 'text',
          label: 'Min Cards Per Row',
          required: false,
          description: 'Minimum cards per row (default: 1)'
        },
        {
          key: 'card_style',
          type: 'text',
          label: 'Card Style (default/bordered)',
          required: false,
          description: 'Visual style for the cards'
        },
        {
          key: 'cards',
          type: 'table',
          label: 'Cards',
          required: false,
          description: 'Add individual cards to the grid',
          columns: [
            { key: 'title', label: 'Card Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'richtext' },
            { key: 'icon', label: 'Icon (Emoji)', type: 'text' },
            { key: 'image', label: 'Image', type: 'image' },
            { key: 'cta_text', label: 'CTA Text', type: 'text' },
            { key: 'cta_link', label: 'CTA Link', type: 'text' }
          ],
          minRows: 0,
          maxRows: 20
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Card Grid',
          required: false,
          description: 'Show/hide card grid section'
        }
      ],
      required: false,
      description: 'Dynamic grid of service cards with customizable rows and columns'
    },
    {
      key: 'register_now_section',
      name: 'Register Now Section',
      order: 7,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Title',
          required: false,
          description: 'Main headline for registration'
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
          description: 'Registration description text'
        },
        {
          key: 'cta_text',
          type: 'text',
          label: 'CTA Text',
          required: false,
          description: 'Registration button text'
        },
        {
          key: 'cta_link',
          type: 'url',
          label: 'CTA Link',
          required: false,
          description: 'Registration button link'
        },
        {
          key: 'background_color',
          type: 'text',
          label: 'Background Color',
          required: false,
          description: 'Section background color (hex code)'
        },
        {
          key: 'show_form',
          type: 'checkbox',
          label: 'Show Registration Form',
          required: false,
          description: 'Display inline registration form'
        },
        {
          key: 'urgency_text',
          type: 'text',
          label: 'Urgency Text',
          required: false,
          description: 'Text to create urgency (e.g., "Limited spots!")'
        },
        {
          key: 'show_urgency',
          type: 'checkbox',
          label: 'Show Urgency',
          required: false,
          description: 'Display urgency message'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Register Now Section',
          required: false,
          description: 'Show/hide register now section'
        }
      ],
      required: false,
      description: 'Registration section with optional form and urgency messaging'
    },
    {
      key: 'review_section',
      name: 'Review Section',
      order: 8,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Section Title',
          required: false,
          description: 'Main title for reviews section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Section Subtitle',
          required: false,
          description: 'Subtitle for reviews section'
        },
        {
          key: 'reviews',
          type: 'table',
          label: 'Reviews',
          required: false,
          description: 'Customer reviews and testimonials displayed in a 3D slider carousel',
          columns: [
            { key: 'name', label: 'Customer Name', type: 'text' },
            { key: 'review_subheading', label: 'Subheading/Title', type: 'text' },
            { key: 'rating', label: 'Rating (1-5)', type: 'text' },
            { key: 'text', label: 'Review Text', type: 'textarea' },
            { key: 'location', label: 'Location', type: 'text' }
          ],
          minRows: 1,
          maxRows: 20
        },
        {
          key: 'show_ratings',
          type: 'checkbox',
          label: 'Show Star Ratings',
          required: false,
          description: 'Display star ratings'
        },
        {
          key: 'show_locations',
          type: 'checkbox',
          label: 'Show Customer Locations',
          required: false,
          description: 'Display customer locations'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Review Section',
          required: false,
          description: 'Show/hide review section'
        }
      ],
      required: false,
      description: 'Customer reviews and testimonials section with 3D carousel slider'
    },
    {
      key: 'contact_form',
      name: 'Contact Form',
      order: 9,
      fields: [
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable Contact Form',
          required: false,
          description: 'Show/hide contact form section'
        }
      ],
      required: false,
      description: 'Contact form section for lead generation'
    }
  ]
}
