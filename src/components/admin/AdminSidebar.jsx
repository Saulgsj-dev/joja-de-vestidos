// frontend/src/components/admin/AdminSidebar.jsx
import { getSectionLabel } from '../../utils/sectionHelpers';

export default function AdminSidebar({
  sections,
  selectedSection,
  activeTab,
  activeAccordion,
  onSelectSection,
  onToggleTab,
  onToggleAccordion,
  onTogglePublish,
  onLoadSections
}) {
  // Seções que não podem ser despublicadas
  const nonPublishableSections = ['header', 'footer'];
  
  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl p-4 shadow-lg">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onToggleTab('sections')}
          className={`flex-1 py-2 rounded ${activeTab === 'sections' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
        >
          Seções
        </button>
        <button
          onClick={() => onToggleTab('config')}
          className={`flex-1 py-2 rounded ${activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
        >
          Config
        </button>
      </div>
      
      {activeTab === 'sections' && (
        <div className="space-y-2">
          {sections.map((section, index) => {
            const canPublish = !nonPublishableSections.includes(section.section_type);
            
            return (
              <div key={section.id} className="relative group">
                <button
                  onClick={() => { onSelectSection(section); onToggleAccordion('content'); }}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedSection?.id === section.id
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gradient-to-r from-green-50 to-blue-100 hover:from-green-100 hover:to-blue-200'
                  } ${section.is_active === 0 ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{getSectionLabel(section.section_type, index)}</span>
                    {canPublish && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        section.is_active === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {section.is_active === 1 ? '✓' : '○'}
                      </span>
                    )}
                  </div>
                </button>
                
                {canPublish && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onTogglePublish(section, section.is_active === 0); }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded text-xs ${
                      section.is_active === 1 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {section.is_active === 1 ? 'Despublicar' : 'Publicar'}
                  </button>
                )}
              </div>
            );
          })}
          
          <button className="w-full p-3 text-blue-400 text-2xl font-bold hover:bg-blue-50 rounded-lg mt-2">
            + Adicionar Seção
          </button>
        </div>
      )}
      
      {activeTab === 'config' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Configurações Gerais</h3>
          <p className="text-sm text-gray-500">Use a aba Config no AdminConfig.jsx</p>
        </div>
      )}
    </div>
  );
}