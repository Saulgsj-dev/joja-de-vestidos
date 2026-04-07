import SectionAccordion from '../SectionAccordion';
import ImageUploader from '../ImageUploader';

export default function FooterEditor({ section, config, activeAccordion, onUpdateSection, onSetActiveAccordion }) {
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

  const handleButtonUpdate = (field, value) => {
    const button = section.content?.button || { text: '', link: '', color: '#ffffff' };
    onUpdateSection({
      ...section,
      content: {
        ...section.content,
        button: { ...button, [field]: value }
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* 🎨 FUNDO DO FOOTER */}
      <SectionAccordion id="footer-background" title="🎨 Fundo do Footer" defaultOpen={true}>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('backgroundType', 'color')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.backgroundType === 'color' || !section.styles?.backgroundType
                ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Cor Sólida
          </button>
          <button
            onClick={() => handleStyleUpdate('backgroundType', 'image')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Imagem
          </button>
        </div>
        
        {(!section.styles?.backgroundType || section.styles?.backgroundType === 'color') && (
          <div>
            <label className="block text-xs font-medium mb-1">Cor de Fundo</label>
            <input
              type="color"
              value={section.styles?.backgroundColor || config?.cor_botao || '#000000'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        )}
        
        {section.styles?.backgroundType === 'image' && (
          <>
            <ImageUploader
              label="Imagem de Fundo"
              value={section.styles?.backgroundImage || ''}
              onChange={(url) => handleStyleUpdate('backgroundImage', url)}
              onRemove={() => handleStyleUpdate('backgroundImage', '')}
            />
            <div className="mt-3">
              <label className="block text-xs font-medium mb-1">
                Opacidade da Imagem: {section.styles?.backgroundOpacity || 100}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={section.styles?.backgroundOpacity || 100}
                onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
        
        <div className="mt-3">
          <label className="block text-xs font-medium mb-1">Cor do Texto Principal</label>
          <input
            type="color"
            value={section.styles?.textColor || '#ffffff'}
            onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </SectionAccordion>

      {/* 📦 CONTEÚDO DO FOOTER */}
      <SectionAccordion id="footer-content" title="📦 Conteúdo">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Título Principal</label>
            <input
              type="text"
              value={section.content?.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="Ex: © 2024 Minha Loja"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Descrição</label>
            <textarea
              value={section.content?.description || ''}
              onChange={(e) => handleContentUpdate('description', e.target.value)}
              className="w-full p-2 border rounded text-sm"
              rows="2"
              placeholder="Texto adicional do footer"
            />
          </div>
        </div>
      </SectionAccordion>

      {/* 🎯 ÍCONE */}
      <SectionAccordion id="footer-icon" title="🎯 Ícone">
        <div className="space-y-4">
          <ImageUploader
            label="Upload do Ícone/Logo"
            value={section.content?.icon || ''}
            onChange={(url) => handleContentUpdate('icon', url)}
            onRemove={() => handleContentUpdate('icon', '')}
          />
          
          {section.content?.icon && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2">Posição do Ícone</label>
                <div className="flex gap-2">
                  {['top', 'left', 'right'].map(pos => (
                    <button
                      key={pos}
                      onClick={() => handleStyleUpdate('iconPosition', pos)}
                      className={`flex-1 py-2 rounded text-sm ${
                        section.styles?.iconPosition === pos || (!section.styles?.iconPosition && pos === 'top')
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {pos === 'top' ? '⬆️ Topo' : pos === 'left' ? '⬅️ Esquerda' : '➡️ Direita'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Tamanho do Ícone</label>
                <select
                  value={section.styles?.iconSize || 'medio'}
                  onChange={(e) => handleStyleUpdate('iconSize', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="pequeno">Pequeno (32px)</option>
                  <option value="medio">Médio (48px)</option>
                  <option value="grande">Grande (64px)</option>
                  <option value="extra_grande">Extra Grande (96px)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </SectionAccordion>

      {/* 🔘 BOTÃO */}
      <SectionAccordion id="footer-button" title="🔘 Botão">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Texto do Botão</label>
            <input
              type="text"
              value={section.content?.button?.text || ''}
              onChange={(e) => handleButtonUpdate('text', e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="Ex: Fale Conosco"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Link do Botão</label>
            <input
              type="text"
              value={section.content?.button?.link || ''}
              onChange={(e) => handleButtonUpdate('link', e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="https://wa.me/5511999999999"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Cor do Botão</label>
            <input
              type="color"
              value={section.content?.button?.color || '#ffffff'}
              onChange={(e) => handleButtonUpdate('color', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          
          {section.content?.button?.text && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2">Posição do Botão</label>
                <div className="flex gap-2">
                  {['top', 'bottom'].map(pos => (
                    <button
                      key={pos}
                      onClick={() => handleStyleUpdate('buttonPosition', pos)}
                      className={`flex-1 py-2 rounded text-sm ${
                        section.styles?.buttonPosition === pos || (!section.styles?.buttonPosition && pos === 'bottom')
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {pos === 'top' ? '⬆️ Acima do Texto' : '⬇️ Abaixo do Texto'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Tamanho do Botão</label>
                <select
                  value={section.styles?.buttonSize || 'medio'}
                  onChange={(e) => handleStyleUpdate('buttonSize', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
            </>
          )}
        </div>
      </SectionAccordion>

      {/* 🔤 ESTILO DO TÍTULO */}
      <SectionAccordion id="footer-title-style" title="🔤 Estilo do Título">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2">Tamanho da Fonte</label>
            <select
              value={section.styles?.titleFontSize || 'medio'}
              onChange={(e) => handleStyleUpdate('titleFontSize', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
              <option value="extra_grande">Extra Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Peso da Fonte</label>
            <select
              value={section.styles?.titleFontWeight || 'bold'}
              onChange={(e) => handleStyleUpdate('titleFontWeight', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="normal">Normal</option>
              <option value="semibold">Semi-negrito</option>
              <option value="bold">Negrito</option>
              <option value="extrabold">Extra Negrito</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Alinhamento</label>
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

      {/* 📝 ESTILO DA DESCRIÇÃO */}
      <SectionAccordion id="footer-desc-style" title="📝 Estilo da Descrição">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2">Tamanho da Fonte</label>
            <select
              value={section.styles?.descriptionFontSize || 'pequeno'}
              onChange={(e) => handleStyleUpdate('descriptionFontSize', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Cor do Texto</label>
            <input
              type="color"
              value={section.styles?.descriptionColor || '#9ca3af'}
              onChange={(e) => handleStyleUpdate('descriptionColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Alinhamento</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => handleStyleUpdate('descriptionAlign', align)}
                  className={`flex-1 py-2 rounded text-sm ${
                    section.styles?.descriptionAlign === align || (!section.styles?.descriptionAlign && align === 'center')
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

      {/* 📐 ESPAÇAMENTO */}
      <SectionAccordion id="footer-spacing" title="📐 Espaçamento">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2">Padding Superior</label>
            <select
              value={section.styles?.paddingTop || 'py-12'}
              onChange={(e) => handleStyleUpdate('paddingTop', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="py-4">Pequeno</option>
              <option value="py-8">Médio</option>
              <option value="py-12">Grande</option>
              <option value="py-16">Extra Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Padding Inferior</label>
            <select
              value={section.styles?.paddingBottom || 'py-8'}
              onChange={(e) => handleStyleUpdate('paddingBottom', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="py-4">Pequeno</option>
              <option value="py-6">Médio</option>
              <option value="py-8">Grande</option>
              <option value="py-12">Extra Grande</option>
            </select>
          </div>
        </div>
      </SectionAccordion>
    </div>
  );
}