import { useState, useEffect } from 'react'
import CardGrid from './TemplateComponents/CardGrid'
import PromoBannerSection from './TemplateComponents/PromoBannerSection'
import BookYourEventLeft from './TemplateComponents/BookYourEventLeft'
import BookYourEventHalf from './TemplateComponents/BookYourEventHalf'
import RegisterNowSection from './TemplateComponents/RegisterNowSection'
import Review from './TemplateComponents/Review'
import FAQField from './TemplateComponents/FAQField'
import Footer from './TemplateComponents/Footer'
import TableSection from './TemplateComponents/TableSection'
import Slider1Generator from './TemplateComponents/sliders/Slider1-Generator'
import Slider2Section from './TemplateComponents/sliders/Slider2Section'

// Component mapping
const COMPONENT_MAP = {
  'CardGrid': CardGrid,
  'PromoBannerSection': PromoBannerSection,
  'BookYourEventLeft': BookYourEventLeft,
  'BookYourEventHalf': BookYourEventHalf,
  'RegisterNowSection': RegisterNowSection,
  'Review': Review,
  'FAQField': FAQField,
  'Footer': Footer,
  'TableSection': TableSection,
  'Slider1Generator': Slider1Generator,
  'Slider2Section': Slider2Section,
}

export default function DynamicTemplateRenderer({
  template,
  content,
  site,
  page,
  sessionId,
  onFormSubmit,
  onCheckoutClick,
  loading,
}) {
  const [sections, setSections] = useState([])
  const [sectionsLoading, setSectionsLoading] = useState(true)

  useEffect(() => {
    if (template?.sections) {
      setSections(template.sections)
      setSectionsLoading(false)
    } else {
      // Fallback: fetch sections from database if not in template
      fetchSections()
    }
  }, [template])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/template-sections')
      const result = await response.json()
      if (result.success) {
        setSections(result.data.filter(section => section.is_active))
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setSectionsLoading(false)
    }
  }

  const renderSection = (section, index) => {
    const Component = COMPONENT_MAP[section.component_name]
    
    if (!Component) {
      console.warn(`Component ${section.component_name} not found`)
      return null
    }

    const sectionKey = section.component_name.toLowerCase()
    const sectionContent = content[sectionKey] || {}
    const sectionData = {
      ...section,
      title: section.name,
      description: section.description
    }

    // Only render if section is enabled
    if (!sectionContent.enabled) {
      return null
    }

    return (
      <Component
        key={`${section.id}-${index}`}
        content={sectionContent}
        section={sectionData}
        themeColor={site?.settings?.theme_color || '#4F46E5'}
        site={site}
        page={page}
        sessionId={sessionId}
        onFormSubmit={onFormSubmit}
        onCheckoutClick={onCheckoutClick}
        loading={loading}
      />
    )
  }

  if (sectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template sections...</p>
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Sections Found
          </h1>
          <p className="text-gray-600">
            This template doesn't have any sections configured.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  )
}
