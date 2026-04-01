import SectionAccordion from '../SectionAccordion';
import ImageUploader from '../ImageUploader';

export default function HeroEditor({ section, config, activeAccordion, onUpdateSection, onSetActiveAccordion }) {
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
      <SectionAccordion id="content" title="📝 Conteúdo" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título Principal</label>
            <input
              type="text"
              value={section.content.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              className="w-full p-2 border rounded text-xl"
              placeholder="Digite o título..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtítulo/Descrição</label>
            <textarea
              value={section.content.subtitle || ''}
              onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Digite a descrição..."
            />
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="text-colors" title="🎨 Cores dos Textos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Título</label>
            <input
              type="color"
              value={section.styles?.titleColor || '#ffffff'}
              onChange={(e) => handleColorChange('titleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cor da Descrição</label>
            <input
              type="color"
              value={section.styles?.subtitleColor || '#e5e7eb'}
              onChange={(e) => handleColorChange('subtitleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="font-styles" title="🔤 Estilo da Fonte">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
            <select
              value={section.styles?.titleFontSize || 'large'}
              onChange={(e) => handleStyleUpdate('titleFontSize', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
              <option value="xlarge">Extra Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Peso do Título</label>
            <select
              value={section.styles?.titleFontWeight || 'bold'}
              onChange={(e) => handleStyleUpdate('titleFontWeight', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Normal</option>
              <option value="semibold">Semi-negrito</option>
              <option value="bold">Negrito</option>
              <option value="extrabold">Extra Negrito</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tamanho da Descrição</label>
            <select
              value={section.styles?.subtitleFontSize || 'medium'}
              onChange={(e) => handleStyleUpdate('subtitleFontSize', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="alignments" title="📐 Alinhamentos">
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
                  {align === 'left' ? '⬅️ Esquerda' : align === 'center' ? '↕️ Centro' : '➡️ Direita'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionAccordion>

      <SectionAccordion id="image-position" title="🖼️ Posição da Imagem">
        <div>
          <label className="block text-sm font-medium mb-2">Posição da Imagem Principal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'above', label: '📍 Acima do Título', icon: '⬆️' },
              { value: 'between', label: '📍 Entre Título e Descrição', icon: '↕️' },
              { value: 'below', label: '📍 Abaixo da Descrição', icon: '⬇️' }
            ].map(pos => (
              <button
                key={pos.value}
                onClick={() => handleStyleUpdate('imagePosition', pos.value)}
                className={`p-3 rounded-lg text-sm border-2 transition ${
                  section.styles?.imagePosition === pos.value || (!section.styles?.imagePosition && pos.value === 'above')
                    ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{pos.icon}</div>
                <div className="text-xs">{pos.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <ImageUploader
            label="Imagem Principal"
            value={section.content.image}
            onChange={(url) => handleContentUpdate('image', url)}
            onRemove={() => handleContentUpdate('image', '')}
          />
        </div>
      </SectionAccordion>

      <SectionAccordion id="background" title="🎨 Fundo da Seção">
        <div className="space-y-4">
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
                value={section.styles.backgroundColor || '#faf5ff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>
          )}

          {section.styles.backgroundType === 'image' && (
            <>
              <ImageUploader
                label="Imagem de Fundo"
                value={section.styles.backgroundImage}
                onChange={(url) => handleStyleUpdate('backgroundImage', url)}
                onRemove={() => handleStyleUpdate('backgroundImage', '')}
              />
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
        </div>
      </SectionAccordion>

      <SectionAccordion id="image-layout" title="🖼️ Layout de Imagens">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStyleUpdate('imageLayout', 'center')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.imageLayout === 'center' || !section.styles?.imageLayout
                ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Centralizado
          </button>
          <button
            onClick={() => handleStyleUpdate('imageLayout', 'sides')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.imageLayout === 'sides' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Laterais
          </button>
          <button
            onClick={() => handleStyleUpdate('imageLayout', 'grid')}
            className={`flex-1 py-2 rounded text-sm ${
              section.styles?.imageLayout === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            Grid
          </button>
        </div>

        {section.styles?.imageLayout === 'sides' && (
          <>
            <div className="mb-3">
              <ImageUploader
                label="Imagem Lateral Esquerda"
                value={section.content.leftImage}
                onChange={(url) => handleContentUpdate('leftImage', url)}
                onRemove={() => handleContentUpdate('leftImage', '')}
              />
            </div>
            <div>
              <ImageUploader
                label="Imagem Lateral Direita"
                value={section.content.rightImage}
                onChange={(url) => handleContentUpdate('rightImage', url)}
                onRemove={() => handleContentUpdate('rightImage', '')}
              />
            </div>
          </>
        )}

        {section.styles?.imageLayout === 'grid' && (
          <div>
            <label className="block text-sm font-medium mb-2">Imagens do Grid</label>
            <div className="space-y-2">
              {(section.content.gridImages || []).map((img, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <ImageUploader
                    value={img}
                    onChange={(url) => {
                      const updatedImages = [...(section.content.gridImages || [])];
                      updatedImages[index] = url;
                      handleContentUpdate('gridImages', updatedImages);
                    }}
                    onRemove={() => {
                      const updatedImages = (section.content.gridImages || []).filter((_, i) => i !== index);
                      handleContentUpdate('gridImages', updatedImages);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const currentImages = section.content.gridImages || [];
                  handleContentUpdate('gridImages', [...currentImages, '']);
                }}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-purple-500 hover:text-purple-500"
              >
                + Adicionar Imagem
              </button>
            </div>
          </div>
        )}
      </SectionAccordion>
    </div>
  );
}