import Header from './Header';

export default function SitePreview({ config, sections, selectedSection }) {
  // Merge das sections com a seção sendo editada (se houver)
  const previewSections = selectedSection
    ? sections.map(s => s.id === selectedSection.id ? selectedSection : s)
    : sections;

  const headerSection = previewSections.find(s => s.section_type === 'header');
  const heroSection = previewSections.find(s => s.section_type === 'hero');

  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-inner">
      {/* Header do Preview */}
      <div className="bg-gray-100 px-3 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">Preview ao vivo</span>
        </div>
        <span className="text-xs text-gray-400">Desktop</span>
      </div>

      {/* Conteúdo do Site - Scrollável */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        {headerSection ? (
          <Header config={config} sections={[headerSection]} isPreview={true} />
        ) : (
          <div className="bg-gray-200 p-3 text-center text-xs text-gray-500">
            Header não configurado
          </div>
        )}

        {/* Hero Section Preview */}
        {heroSection && (
          <div className="p-4">
            <div 
              className="rounded-lg overflow-hidden shadow-md"
              style={{
                background: heroSection.styles?.backgroundType === 'image' && heroSection.styles?.backgroundImage
                  ? `url(${heroSection.styles.backgroundImage}) center/cover`
                  : heroSection.styles?.backgroundColor || '#faf5ff'
              }}
            >
              <div className="p-6 text-center">
                <h2 className="text-lg font-bold text-white mb-2 drop-shadow">
                  {heroSection.content?.title || 'Título'}
                </h2>
                <p className="text-xs text-white/90 mb-3 drop-shadow">
                  {heroSection.content?.subtitle || 'Subtítulo'}
                </p>
                {heroSection.content?.image && (
                  <img 
                    src={heroSection.content.image} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg mx-auto shadow-lg"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Produtos Preview */}
        {previewSections.find(s => s.section_type === 'products') && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-sm font-bold text-center mb-3" style={{ color: config?.cor_texto }}>
                Nossos Produtos
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gray-100 rounded p-2 aspect-square flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Produto {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mensagem se não houver conteúdo */}
        {!headerSection && !heroSection && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Selecione uma seção para editar
          </div>
        )}
      </div>
    </div>
  );
}