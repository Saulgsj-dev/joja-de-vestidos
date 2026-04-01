import SectionAccordion from '../SectionAccordion';

export default function ContactEditor({ section, config, activeAccordion, onUpdateSection }) {
  const handleContentUpdate = (field, value) => {
    onUpdateSection({
      ...section,
      content: { ...section.content, [field]: value }
    });
  };

  const handleStyleUpdate = (field, value) => {
    onUpdateSection({
      ...section,
      styles: { ...section.styles, [field]: value }
    });
  };

  const handleColorChange = (field, value) => {
    handleStyleUpdate(field, value);
  };

  return (
    <div className="space-y-3">
      <SectionAccordion id="contact-content" title="📝 Conteúdo" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={section.content.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Texto</label>
            <textarea
              value={section.content.text || ''}
              onChange={(e) => handleContentUpdate('text', e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="contact-text-colors" title="🎨 Cores dos Textos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Título</label>
            <input
              type="color"
              value={section.styles?.titleColor || config.cor_texto || '#000000'}
              onChange={(e) => handleColorChange('titleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Texto</label>
            <input
              type="color"
              value={section.styles?.textColor || '#374151'}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="contact-alignments" title="📐 Alinhamentos">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => handleStyleUpdate('titleAlign', align)}
                  className={`flex-1 py-2 rounded text-sm ${
                    section.styles?.titleAlign === align || (!section.styles?.titleAlign && align === 'center')
                      ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="contact-background" title="🎨 Fundo da Seção">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('backgroundType', 'color')}
            className={`flex-1 py-2 rounded ${
              section.styles.backgroundType === 'color' || !section.styles.backgroundType
                ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Cor de Fundo
          </button>
          <button
            onClick={() => handleStyleUpdate('backgroundType', 'image')}
            className={`flex-1 py-2 rounded ${
              section.styles.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Imagem de Fundo
          </button>
        </div>

        {(section.styles.backgroundType === 'color' || !section.styles.backgroundType) && (
          <div>
            <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
            <input
              type="color"
              value={section.styles.backgroundColor || '#f9fafb'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="w-full h-10 rounded"
            />
          </div>
        )}

        {section.styles.backgroundType === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Implementar upload
                }}
                className="w-full"
              />
              {section.styles.backgroundImage && (
                <img src={section.styles.backgroundImage} alt="Fundo" className="mt-2 w-full h-48 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opacidade: {section.styles.backgroundOpacity || 100}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={section.styles.backgroundOpacity || 100}
                onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </SectionAccordion>
    </div>
  );
}