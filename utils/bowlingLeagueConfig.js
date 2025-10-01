/**
 * Bowling League Template Configuration Schema
 * Defines the sections and fields for the bowling league template
 */

export const BOWLING_LEAGUE_CONFIG = {
  sections: [
    {
      key: 'header',
      name: 'Header Section',
      order: 0,
      fields: [
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
          required: false,
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
      description: 'Page header with navigation and CTA button'
    },
    {
      key: 'book_your_event_half',
      name: 'Book Your Event Half',
      order: 1,
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
          type: 'textarea',
          label: 'Description',
          required: false,
          description: 'Description text for the section'
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
          label: 'Enable Book Your Event Half',
          required: false,
          description: 'Show/hide book your event half section'
        }
      ],
      required: false,
      description: 'Two-column event booking section'
    },
    {
      key: 'book_your_event_left',
      name: 'Book Your Event Left',
      order: 2,
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
          type: 'textarea',
          label: 'Description',
          required: false,
          description: 'Description text for the section'
        },
        {
          key: 'background_image',
          type: 'image',
          label: 'Background Image',
          required: false,
          description: 'Background image for the section'
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
          label: 'Enable Book Your Event Left',
          required: false,
          description: 'Show/hide book your event left section'
        }
      ],
      required: false,
      description: 'Left-aligned event booking section'
    },
    {
      key: 'card_grid',
      name: 'Card Grid',
      order: 3,
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
      key: 'table_section',
      name: 'Table Section',
      order: 4,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Table Title',
          required: false,
          description: 'Title for the table section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Table Subtitle',
          required: false,
          description: 'Subtitle for the table section'
        },
        {
          key: 'table_data',
          type: 'table',
          label: 'Table Data',
          required: false,
          description: 'Table data',
          columns: [
            { key: 'column1', label: 'Column 1', type: 'text' },
            { key: 'column2', label: 'Column 2', type: 'text' },
            { key: 'column3', label: 'Column 3', type: 'text' }
          ],
          minRows: 1,
          maxRows: 50
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
      description: 'Data table component for displaying structured information'
    },
    {
      key: 'review_section',
      name: 'Review Section',
      order: 5,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Section Title',
          required: false,
          description: 'Title for the review section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Section Subtitle',
          required: false,
          description: 'Subtitle for the review section'
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
          description: 'Display star ratings on reviews'
        },
        {
          key: 'show_locations',
          type: 'checkbox',
          label: 'Show Customer Locations',
          required: false,
          description: 'Display customer location information'
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
      description: 'Customer testimonials and reviews section with 3D carousel slider'
    },
    {
      key: 'faq_section',
      name: 'FAQ Section',
      order: 6,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Section Title',
          required: false,
          description: 'Title for the FAQ section'
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Section Subtitle',
          required: false,
          description: 'Subtitle for the FAQ section'
        },
        {
          key: 'faqs',
          type: 'faq',
          label: 'FAQ Items',
          required: false,
          description: 'Frequently asked questions',
          minFAQs: 1,
          maxFAQs: 20
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable FAQ Section',
          required: false,
          description: 'Show/hide FAQ section'
        }
      ],
      required: false,
      description: 'Frequently asked questions section'
    },
    {
      key: 'contact_form',
      name: 'Contact Form',
      order: 7,
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