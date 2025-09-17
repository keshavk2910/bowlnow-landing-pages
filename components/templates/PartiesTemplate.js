import { useState } from 'react';
import Image from 'next/image';
import ContactForm from '../ContactForm';

export default function PartiesTemplate({
  content,
  site,
  page,
  sessionId,
  onFormSubmit,
  onCheckoutClick,
  loading,
}) {
  // Extract section-based content
  const header = content.header || {};
  const gallery_1 = content.gallery_1 || {};
  const gallery_2 = content.gallery_2 || {};
  const contact_form = content.contact_form || {};

  // Content with defaults (copied from TemplatePageOne style)
  const logoUrl = header.logo_url || site.logo_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&h=120&fit=crop';
  const title = header.title || 'Party Time!';
  const heroTitle = header.hero_title || 'Unforgettable Parties Start Here';
  const heroBackground = header.hero_background || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop';
  const themeColor = site.settings?.theme_color || '#4F46E5';
  
  // Footer content
  const footerText = content.footer_text || site.footer_description || `${site.client_name} provides exceptional service and memorable experiences for all our customers.`;
  const contactEmail = content.contact_email || site.contact_info || 'info@example.com';
  const contactPhone = content.contact_phone || site.contact_phone || '(555) 123-4567';

  // No need for handleContactFormSubmit anymore - ContactForm handles its own submission

  return (
    <div className="min-h-screen bg-white">
      {/* Header (copied from TemplatePageOne) */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 relative">
                <Image
                  src={logoUrl}
                  alt={site.client_name}
                  fill
                  className="object-contain rounded-full"
                />
              </div>
            </div>
            
            {/* CTA Button */}
            <div>
              <a
                href="#contact"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold transition-colors duration-200 text-sm md:text-base"
              >
                Plan Your Party
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Create memories that last a lifetime at {site.client_name}
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="#party-types"
              className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ 
                backgroundColor: themeColor,
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              Explore Party Options
            </a>
          </div>
        </div>
      </div>

      {/* Gallery 1 Section */}
      {gallery_1.enabled !== false && gallery_1.slider_1_images && (
        <section id="party-types" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {gallery_1.slider_1_title || 'Perfect Parties for Every Occasion'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From intimate birthday celebrations to grand corporate events, we make every moment special
              </p>
            </div>

            {/* Gallery Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery_1.slider_1_images?.slice(0, 6).map((image, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={image.url || image}
                      alt={image.title || `Party Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {image.title || 'Party Experience'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {image.description || 'Create unforgettable memories with our professional party services.'}
                    </p>
                    {image.buttonText && image.buttonLink && (
                      <a
                        href={image.buttonLink}
                        className="inline-block px-6 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200"
                        style={{ 
                          borderColor: themeColor,
                          color: themeColor
                        }}
                      >
                        {image.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery 2 Section */}
      {gallery_2.enabled !== false && gallery_2.slider_2_images && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {gallery_2.slider_2_title || 'More Party Experiences'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery_2.slider_2_images?.slice(0, 6).map((image, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={image.url || image}
                      alt={image.title || `Event Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {image.title || 'Event Experience'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {image.description || 'Professional event planning and execution.'}
                    </p>
                    {image.buttonText && image.buttonLink && (
                      <a
                        href={image.buttonLink}
                        className="inline-block px-6 py-2 text-sm font-semibold rounded-full"
                        style={{ backgroundColor: themeColor, color: 'white' }}
                      >
                        {image.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      {contact_form?.enabled !== false && (
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm
              siteId={site?.id}
              pageId={page?.id}
              sessionId={sessionId}
              content={{
                title: contact_form.title || "Plan Your Perfect Party",
                subtitle: contact_form.description || "Tell us about your celebration and we'll make it unforgettable",
                submit_text: contact_form.submit_text || "Request Party Quote 🎉"
              }}
              showEventFields={true}
              themeColor={themeColor}
              className="mx-auto"
            />
          </div>
        </section>
      )}

      {/* Footer (copied from TemplatePageOne) */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 relative mr-4">
                  <Image
                    src={logoUrl}
                    alt={site.client_name}
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{site.client_name}</h3>
              </div>
              <p className="text-gray-600 max-w-lg leading-relaxed">
                {footerText}
              </p>
              <div className="mt-6 text-sm text-gray-500">
                © 2024 — Copyright {site.client_name}. All Rights Reserved.
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {contactEmail}
                </p>
                <p className="text-gray-600 font-medium">
                  {contactPhone}
                </p>
                {site.contact_info && (
                  <p className="text-gray-600 text-sm">
                    {site.contact_info}
                  </p>
                )}
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm">📷</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}