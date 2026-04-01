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
    </div>
  );
}