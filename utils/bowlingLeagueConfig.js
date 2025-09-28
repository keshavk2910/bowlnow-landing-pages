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
          key: 'hero_title',
          type: 'text',
          label: 'Hero Title',
          required: true,
          description: 'Main headline for the bowling league page'
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
          label: 'Features Section Title',
          required: false,
          description: 'Title for the features section'
        },
        {
          key: 'slider_1_items',
          type: 'slider',
          label: 'Feature Slides',
          required: false,
          description: 'Upload images and content for feature slides',
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
      description: 'Sliding showcase of bowling alley features and amenities'
    },
    {
      key: 'league_schedule',
      name: 'League Schedule',
      order: 2,
      fields: [
        {
          key: 'section_title',
          type: 'text',
          label: 'Section Title',
          required: false,
          description: 'Title for the league schedule section'
        },
        {
          key: 'section_subtitle',
          type: 'textarea',
          label: 'Section Subtitle',
          required: false,
          description: 'Subtitle or description for the league schedule'
        },
        {
          key: 'schedule_table',
          type: 'table',
          label: 'League Schedule Table',
          required: false,
          description: 'Dynamic table for bowling league schedules',
          columns: [
            { key: 'day', label: 'Day', type: 'text' },
            { key: 'league', label: 'League', type: 'text' },
            { key: 'type', label: 'Type', type: 'text' },
            { key: 'per_team', label: 'Per Team', type: 'number' },
            { key: 'time', label: 'Time', type: 'text' }
          ],
          minRows: 1,
          maxRows: 20
        },
        {
          key: 'schedule_note',
          type: 'textarea',
          label: 'Schedule Note',
          required: false,
          description: 'Additional note or information about the schedule'
        },
        {
          key: 'contact_info',
          type: 'textarea',
          label: 'Contact Information',
          required: false,
          description: 'Contact information for league sign-up or inquiries'
        },
        {
          key: 'enabled',
          type: 'checkbox',
          label: 'Enable League Schedule',
          required: false,
          description: 'Show/hide league schedule section'
        }
      ],
      required: false,
      description: 'Dynamic table displaying bowling league schedules and information'
    },
    {
      key: 'book_your_event',
      name: 'Book Your Event',
      order: 3,
      fields: [
        {
          key: 'book_event_title',
          type: 'text',
          label: 'Event Section Title',
          required: false,
          description: 'Title for the book your event section'
        },
        {
          key: 'book_event_desc',
          type: 'rich_text',
          label: 'Event Section Description',
          required: false,
          description: 'Description for the book your event section (supports HTML)'
        },
        {
          key: 'book_event_image',
          type: 'image',
          label: 'Event Section Image',
          required: false,
          description: 'Background image for the book your event section'
        },
        {
          key: 'book_event_cta_text',
          type: 'text',
          label: 'Event CTA Text',
          required: false,
          description: 'Call to action button text'
        },
        {
          key: 'book_event_cta_link',
          type: 'url',
          label: 'Event CTA Link',
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
      description: 'Section promoting event bookings and party reservations'
    },
    {
      key: 'events_slider',
      name: 'Events Slider',
      order: 4,
      fields: [
        {
          key: 'slider_2_title',
          type: 'text',
          label: 'Events Section Title',
          required: false,
          description: 'Title for the events slider section'
        },
        {
          key: 'slider_2_items',
          type: 'slider',
          label: 'Event Slides',
          required: false,
          description: 'Upload images and content for event slides',
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
      description: 'Sliding showcase of upcoming events and promotions'
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
          type: 'textarea',
          label: 'Form Subtitle',
          required: false,
          description: 'Description for the contact form'
        },
        {
          key: 'form_background',
          type: 'image',
          label: 'Form Background Image',
          required: false,
          description: 'Background image for the contact form section'
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
      description: 'Contact form for league inquiries and event bookings'
    },
    {
      key: 'main_cta',
      name: 'Main Call to Action',
      order: 6,
      fields: [
        {
          key: 'cta_text',
          type: 'text',
          label: 'CTA Button Text',
          required: false,
          description: 'Text for the main call to action button'
        },
        {
          key: 'cta_link',
          type: 'url',
          label: 'CTA Button Link',
          required: false,
          description: 'Link for the main call to action button'
        }
      ],
      required: false,
      description: 'Main call to action settings used throughout the page'
    }
  ]
}

// Sample data for the bowling league schedule
export const SAMPLE_LEAGUE_SCHEDULE = [
  {
    id: 1,
    day: 'Monday Start September',
    league: 'Christian Women',
    type: 'Women',
    per_team: 3,
    time: '12:30pm'
  },
  {
    id: 2,
    day: 'Tuesday Start September',
    league: 'Blue Hen Ladies',
    type: 'Women',
    per_team: 4,
    time: '6:00pm'
  },
  {
    id: 3,
    day: 'Tuesday Start September',
    league: 'Suburbanites',
    type: 'Women',
    per_team: 4,
    time: '9:30am'
  },
  {
    id: 4,
    day: 'Tuesday Start September',
    league: 'Newport Men',
    type: 'Men',
    per_team: 5,
    time: '6:10pm'
  },
  {
    id: 5,
    day: 'Wednesday Start September',
    league: 'Weds Mixed Seniors',
    type: 'Senior Mixed',
    per_team: 4,
    time: '12:00pm'
  },
  {
    id: 6,
    day: 'Wednesday Start September',
    league: 'Wednesday Men',
    type: 'Men',
    per_team: 5,
    time: '6:20pm'
  },
  {
    id: 7,
    day: 'Thursday Start September',
    league: 'Sparetimers',
    type: 'Women',
    per_team: 3,
    time: '9:30am'
  },
  {
    id: 8,
    day: 'Thursday Start September',
    league: 'Gems',
    type: 'Mixed',
    per_team: 4,
    time: '9:30am'
  },
  {
    id: 9,
    day: 'Thursday Start September',
    league: 'B & B Mixed',
    type: 'Mixed',
    per_team: 4,
    time: '6:30pm'
  },
  {
    id: 10,
    day: 'Thursday Start September',
    league: 'Mixed Majors',
    type: 'Mixed',
    per_team: 5,
    time: '6:30pm'
  },
  {
    id: 11,
    day: 'Friday Start September',
    league: 'Senior Red Pin',
    type: 'Senior Mixed',
    per_team: 4,
    time: '12:00pm'
  },
  {
    id: 12,
    day: 'Friday Start September',
    league: 'Stanton Suburban',
    type: 'Mixed',
    per_team: 4,
    time: '6:30pm'
  },
  {
    id: 13,
    day: 'Saturday Start September',
    league: 'Juniors',
    type: 'Youth',
    per_team: null,
    time: '9:30am'
  },
  {
    id: 14,
    day: 'Saturday Start September',
    league: 'Bantams',
    type: 'Youth',
    per_team: null,
    time: '9:30am'
  },
  {
    id: 15,
    day: 'Saturday Start September',
    league: 'Pee Wee (Bumper League)',
    type: 'Youth',
    per_team: null,
    time: '9:30am'
  },
  {
    id: 16,
    day: 'Saturday Start September',
    league: 'Saturday Night League',
    type: 'Adult Mix',
    per_team: 4,
    time: '6:30pm'
  }
]
