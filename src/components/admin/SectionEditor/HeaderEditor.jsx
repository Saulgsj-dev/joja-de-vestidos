// frontend/src/components/admin/SectionEditor/HeaderEditor.jsx
import SectionAccordion from '../SectionAccordion';
import ImageUploader from '../ImageUploader';

export default function HeaderEditor({ section, config, activeAccordion, onUpdateSection, onSetActiveAccordion }) {
  const handleStyleUpdate = (field, value) => {
    onUpdateSection({
      ...section,
      styles: { ...section.styles, [field]: value }
    });
  };

  const handleContentUpdate = (field, value) => {
    onUpdateSection({
      ...section,
      content: { ...section.content, [field]: value }
    });
  };

  const handleColorChange = (field, value) => {
    onUpdateSection({
      ...section,
      styles: { ...section.styles, [field]: value }
    });
  };

  // 🔘 Funções para botão direito
  const handleRightButtonUpdate = (field, value) => {
    const rightButton = section.content?.rightButton || { text: '', link: '', color: config?.cor_botao || '#000000' };
    onUpdateSection({
      ...section,
      content: {
        ...section.content,
        rightButton: { ...rightButton, [field]: value }
      }
    });
  };

  return (
    <div className="space-y-3">
      <SectionAccordion id="header-appearance" title="🎨 Aparência" defaultOpen={true}>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('bgType', 'solid')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.bgType === 'solid' || !section.styles?.bgType
                ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Cor Sólida
          </button>
          <button
            onClick={() => handleStyleUpdate('bgType', 'gradient')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.bgType === 'gradient' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Gradiente
          </button>
        </div>

        {(section.styles?.bgType === 'solid' || !section.styles?.bgType) && (
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1">Cor de Fundo</label>
            <input
              type="color"
              value={section.styles?.bgColor || config.cor_fundo || '#ffffff'}
              onChange={(e) => handleColorChange('bgColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        )}

        {section.styles?.bgType === 'gradient' && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">Cor Inicial</label>
              <input
                type="color"
                value={section.styles?.gradientStart || '#667eea'}
                onChange={(e) => handleColorChange('gradientStart', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cor Final</label>
              <input
                type="color"
                value={section.styles?.gradientEnd || '#764ba2'}
                onChange={(e) => handleColorChange('gradientEnd', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1">Cor do Texto</label>
          <input
            type="color"
            value={section.styles?.textColor || config.cor_texto || '#000000'}
            onChange={(e) => handleColorChange('textColor', e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </SectionAccordion>

      <SectionAccordion id="header-left" title="⬅️ Lado Esquerdo">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('leftType', 'text')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.leftType === 'text' || !section.styles?.leftType
                ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Texto
          </button>
          <button
            onClick={() => handleStyleUpdate('leftType', 'logo')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.leftType === 'logo' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Logo
          </button>
        </div>

        {(!section.styles?.leftType || section.styles?.leftType === 'text') ? (
          <div>
            <label className="block text-xs font-medium mb-1">Texto</label>
            <input
              type="text"
              value={section.content?.leftText || section.content?.title || ''}
              onChange={(e) => handleContentUpdate('leftText', e.target.value)}
              className="w-full p-2 border rounded text-sm"
              placeholder="Ex: Minha Loja"
            />
          </div>
        ) : (
          <ImageUploader
            label="Logo"
            value={section.content?.logo || section.styles?.leftLogo}
            onChange={(url) => {
              onUpdateSection({
                ...section,
                content: { ...section.content, logo: url },
                styles: { ...section.styles, leftLogo: url }
              });
            }}
            onRemove={() => {
              onUpdateSection({
                ...section,
                content: { ...section.content, logo: '' },
                styles: { ...section.styles, leftLogo: '' }
              });
            }}
          />
        )}
      </SectionAccordion>

      <SectionAccordion id="header-center" title="↕️ Centro">
        <div>
          <label className="block text-xs font-medium mb-1">Texto Central</label>
          <input
            type="text"
            value={section.content?.centerText || ''}
            onChange={(e) => handleContentUpdate('centerText', e.target.value)}
            className="w-full p-2 border rounded text-sm"
            placeholder="Ex: Frete Grátis | Promoções"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Texto que aparece centralizado no header
          </p>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-medium mb-1">Cor do Texto Central</label>
          <input
            type="color"
            value={section.styles?.centerTextColor || section.styles?.textColor || config.cor_texto || '#000000'}
            onChange={(e) => handleColorChange('centerTextColor', e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </SectionAccordion>

      <SectionAccordion id="header-right" title="➡️ Lado Direito">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('rightType', 'none')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.rightType === 'none' || !section.styles?.rightType
                ? 'bg-gray-400 text-white' : 'bg-gray-200'
            }`}
          >
            Nenhum
          </button>
          <button
            onClick={() => handleStyleUpdate('rightType', 'text')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.rightType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Texto
          </button>
          <button
            onClick={() => handleStyleUpdate('rightType', 'button')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.rightType === 'button' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Botão
          </button>
        </div>

        {section.styles?.rightType && section.styles?.rightType !== 'none' && (
          <>
            <div>
              <label className="block text-xs font-medium mb-1">
                {section.styles?.rightType === 'text' ? 'Texto' : 'Texto do Botão'}
              </label>
              <input
                type="text"
                value={section.content?.rightButton?.text || ''}
                onChange={(e) => handleRightButtonUpdate('text', e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder={section.styles?.rightType === 'text' ? 'Ex: (11) 99999-9999' : 'Ex: Compre Agora'}
              />
            </div>

            {section.styles?.rightType === 'button' && (
              <>
                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1">Link</label>
                  <input
                    type="text"
                    value={section.content?.rightButton?.link || ''}
                    onChange={(e) => handleRightButtonUpdate('link', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="https://wa.me/5511999999999"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1">Cor do Botão</label>
                  <input
                    type="color"
                    value={section.content?.rightButton?.color || config?.cor_botao || '#000000'}
                    onChange={(e) => handleRightButtonUpdate('color', e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </>
            )}

            <div className="mt-3">
              <label className="block text-xs font-medium mb-1">Cor do Texto</label>
              <input
                type="color"
                value={section.styles?.rightTextColor || section.styles?.textColor || config.cor_texto || '#000000'}
                onChange={(e) => handleColorChange('rightTextColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </>
        )}
      </SectionAccordion>
    </div>
  );
}