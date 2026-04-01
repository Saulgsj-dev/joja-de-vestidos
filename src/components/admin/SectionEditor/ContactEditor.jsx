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

  // 🔘 Funções para botões
  const handleAddButton = () => {
    const buttons = section.content?.buttons || [];
    onUpdateSection({
      ...section,
      content: { 
        ...section.content, 
        buttons: [...buttons, { text: '', link: '', color: '#25D366' }] 
      }
    });
  };

  const handleUpdateButton = (index, field, value) => {
    const buttons = [...(section.content?.buttons || [])];
    buttons[index] = { ...buttons[index], [field]: value };
    onUpdateSection({
      ...section,
      content: { ...section.content, buttons }
    });
  };

  const handleRemoveButton = (index) => {
    const buttons = (section.content?.buttons || []).filter((_, i) => i !== index);
    onUpdateSection({
      ...section,
      content: { ...section.content, buttons }
    });
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

      {/* 🔘 BOTÕES */}
      <SectionAccordion id="buttons" title="🔘 Botões">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-3">
            💡 Adicione botões personalizados. Se não adicionar nenhum, usará o WhatsApp das configurações.
          </p>
          {section.content?.buttons?.map((btn, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Botão {index + 1}</span>
                <button
                  onClick={() => handleRemoveButton(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ Remover
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={btn.text || ''}
                  onChange={(e) => handleUpdateButton(index, 'text', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Ex: Falar no WhatsApp"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Link ou WhatsApp</label>
                <input
                  type="text"
                  value={btn.link || ''}
                  onChange={(e) => handleUpdateButton(index, 'link', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Ex: https://wa.me/5511999999999"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Cor do Botão</label>
                <input
                  type="color"
                  value={btn.color || '#25D366'}
                  onChange={(e) => handleUpdateButton(index, 'color', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          ))}
          
          <button
            onClick={handleAddButton}
            className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition font-medium"
          >
            + Adicionar Botão
          </button>
        </div>
      </SectionAccordion>

      <SectionAccordion id="contact-text-colors" title="🎨 Cores dos Textos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Título</label>
            <input
              type="color"
              value={section.styles?.titleColor || config.cor_texto || '#000000'}
              onChange={(e) => handleStyleUpdate('titleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Texto</label>
            <input
              type="color"
              value={section.styles?.textColor || '#374151'}
              onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
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