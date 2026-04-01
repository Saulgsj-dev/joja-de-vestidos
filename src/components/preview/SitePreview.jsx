import { useState } from 'react';
import Header from '../site/Header';
import Footer from '../site/Footer';
import PreviewFrame from './PreviewFrame';
import HeroSection from '../site/Sections/HeroSection';
import ProductsSection from '../site/Sections/ProductsSection';
import ContentSection from '../site/Sections/ContentSection';
import ContactSection from '../site/Sections/ContactSection';

export default function SitePreview({ config, sections, selectedSection }) {
  const [viewMode, setViewMode] = useState('desktop');

  const previewSections = selectedSection
    ? sections.map(s => s.id === selectedSection.id ? selectedSection : s)
    : sections;

  const headerSection = previewSections.find(s => s.section_type === 'header');
  const heroSection = previewSections.find(s => s.section_type === 'hero');
  const productsSection = previewSections.find(s => s.section_type === 'products');
  const contentSections = previewSections.filter(s => s.section_type === 'content');
  const contactSection = previewSections.find(s => s.section_type === 'contact');

  return (
    <div className="h-full flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-2">Preview ao vivo</span>
        </div>
        <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-200 relative">
        <PreviewFrame viewMode={viewMode}>
          {headerSection ? (
            <Header config={config} sections={[headerSection]} isPreview={true} />
          ) : (
            <div className="bg-gray-200 p-4 text-center text-sm text-gray-500">Header não configurado</div>
          )}
          {heroSection && <HeroSection section={heroSection} config={config} />}
          {productsSection && <ProductsSection section={productsSection} config={config} produtos={[]} />}
          {contentSections.map((section, index) => (
            <ContentSection key={section.id} section={section} config={config} />
          ))}
          {contactSection && <ContactSection section={contactSection} config={config} />}
          <Footer config={config} />
          <div className="h-8"></div>
        </PreviewFrame>
      </div>
    </div>
  );
}