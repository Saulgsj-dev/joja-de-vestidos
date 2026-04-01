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

  // 🔘 Funções para botões
  const handleAddButton = () => {
    const buttons = section.content?.buttons || [];
    onUpdateSection({
      ...section,
      content: {
        ...section.content,
        buttons: [...buttons, { text: '', link: '', color: '#f59e0b' }]
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
      {/* 📝 CONTEÚDO */}
      <SectionAccordion id="content" title="📝 Conteúdo" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título Principal</label>
            <input
              type="text"
              value={section.content?.title || ''}
              onChange={(e) => handleContentUpdate('title', e.target.value)}
              className="w-full p-2 border rounded text-xl"
              placeholder="Digite o título..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtítulo/Descrição</label>
            <textarea
              value={section.content?.subtitle || ''}
              onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Digite a descrição..."
            />
          </div>
        </div>
      </SectionAccordion>

      {/* 🔘 BOTÕES */}
      <SectionAccordion id="buttons" title="🔘 Botões">
        <div className="space-y-4">
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
                  placeholder="Ex: Fale com um Especialista"
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
                <p className="text-xs text-gray-500 mt-1">
                  💡 Para WhatsApp use: https://wa.me/5511999999999
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Cor do Botão</label>
                <input
                  type="color"
                  value={btn.color || '#f59e0b'}
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

          {/* 📐 ALINHAMENTO DOS BOTÕES */}
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium mb-2">📐 Alinhamento dos Botões</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => handleStyleUpdate('buttonsAlign', align)}
                  className={`flex-1 py-2 rounded text-sm ${
                    section.styles?.buttonsAlign === align || (!section.styles?.buttonsAlign && align === 'center')
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {align === 'left' ? '⬅️ Esquerda' : align === 'center' ? '↕️ Centro' : '➡️ Direita'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* 🎨 CORES DOS TEXTOS */}
      <SectionAccordion id="text-colors" title="🎨 Cores dos Textos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Título</label>
            <input
              type="color"
              value={section.styles?.titleColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('titleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cor da Descrição</label>
            <input
              type="color"
              value={section.styles?.subtitleColor || '#e5e7eb'}
              onChange={(e) => handleStyleUpdate('subtitleColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </SectionAccordion>

      {/* 🔤 ESTILO DA FONTE - TÍTULO (5 tamanhos) */}
      <SectionAccordion id="title-font" title="🔤 Tamanho do Título">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
            <select
              value={section.styles?.titleFontSize || 'grande'}
              onChange={(e) => handleStyleUpdate('titleFontSize', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
              <option value="extra_grande">Extra Grande</option>
              <option value="mega_grande">Mega Grande</option>
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
        </div>
      </SectionAccordion>

      {/* 🔤 ESTILO DA FONTE - SUBTÍTULO (5 tamanhos) */}
      <SectionAccordion id="subtitle-font" title="🔤 Tamanho da Descrição">
        <div>
          <label className="block text-sm font-medium mb-2">Tamanho da Descrição</label>
          <select
            value={section.styles?.subtitleFontSize || 'medio'}
            onChange={(e) => handleStyleUpdate('subtitleFontSize', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
            <option value="extra_grande">Extra Grande</option>
            <option value="mega_grande">Mega Grande</option>
          </select>
        </div>
      </SectionAccordion>

      {/* 🖼️ TAMANHO DA IMAGEM (5 opções) */}
      <SectionAccordion id="image-size" title="🖼️ Tamanho da Imagem">
        <div>
          <label className="block text-sm font-medium mb-2">Tamanho da Imagem Principal</label>
          <select
            value={section.styles?.imageSize || 'grande'}
            onChange={(e) => handleStyleUpdate('imageSize', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
            <option value="extra_grande">Extra Grande</option>
            <option value="mega_grande">Mega Grande</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            💡 Isso controla o tamanho do logo/imagem principal
          </p>
        </div>
      </SectionAccordion>

      {/* 📐 ALINHAMENTOS */}
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
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Alinhamento da Descrição</label>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => handleStyleUpdate('subtitleAlign', align)}
                  className={`flex-1 py-2 rounded text-sm ${
                    section.styles?.subtitleAlign === align || (!section.styles?.subtitleAlign && align === 'center')
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionAccordion>

      {/* 🖼️ POSIÇÃO DA IMAGEM */}
      <SectionAccordion id="image-position" title="🖼️ Posição da Imagem">
        <div>
          <label className="block text-sm font-medium mb-2">Posição da Imagem Principal</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'above', label: '📍 Acima', icon: '⬆️' },
              { value: 'between', label: '📍 Entre', icon: '↕️' },
              { value: 'below', label: '📍 Abaixo', icon: '⬇️' }
            ].map(pos => (
              <button
                key={pos.value}
                onClick={() => handleStyleUpdate('imagePosition', pos.value)}
                className={`p-3 rounded-lg text-sm border-2 transition ${
                  section.styles?.imagePosition === pos.value || (!section.styles?.imagePosition && pos.value === 'above')
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300'
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
            value={section.content?.image || ''}
            onChange={(url) => handleContentUpdate('image', url)}
            onRemove={() => handleContentUpdate('image', '')}
          />
        </div>
      </SectionAccordion>

      {/* 🎨 FUNDO DA SEÇÃO */}
      <SectionAccordion id="background" title="🎨 Fundo da Seção">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleStyleUpdate('backgroundType', 'color')}
              className={`flex-1 py-2 rounded ${
                section.styles?.backgroundType === 'color' || !section.styles?.backgroundType
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Cor de Fundo
            </button>
            <button
              onClick={() => handleStyleUpdate('backgroundType', 'image')}
              className={`flex-1 py-2 rounded ${
                section.styles?.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}
            >
              Imagem de Fundo
            </button>
          </div>
          {(section.styles?.backgroundType === 'color' || !section.styles?.backgroundType) && (
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <input
                type="color"
                value={section.styles?.backgroundColor || '#faf5ff'}
                onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                className="w-full h-10 rounded"
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
              <div>
                <label className="block text-sm font-medium mb-2">Opacidade: {section.styles?.backgroundOpacity || 100}%</label>
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
        </div>
      </SectionAccordion>

      {/* 🖼️ LAYOUT DE IMAGENS */}
      <SectionAccordion id="image-layout" title="🖼️ Layout de Imagens">
        <div className="flex gap-2 mb-4">
          {['center', 'sides', 'grid'].map(layout => (
            <button
              key={layout}
              onClick={() => handleStyleUpdate('imageLayout', layout)}
              className={`flex-1 py-2 rounded text-sm ${
                section.styles?.imageLayout === layout || (!section.styles?.imageLayout && layout === 'center')
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {layout === 'center' ? 'Centralizado' : layout === 'sides' ? 'Laterais' : 'Grid'}
            </button>
          ))}
        </div>
        {section.styles?.imageLayout === 'sides' && (
          <>
            <ImageUploader label="Imagem Esquerda" value={section.content?.leftImage || ''} onChange={(url) => handleContentUpdate('leftImage', url)} onRemove={() => handleContentUpdate('leftImage', '')} />
            <ImageUploader label="Imagem Direita" value={section.content?.rightImage || ''} onChange={(url) => handleContentUpdate('rightImage', url)} onRemove={() => handleContentUpdate('rightImage', '')} />
          </>
        )}
        {section.styles?.imageLayout === 'grid' && (
          <div>
            <label className="block text-sm font-medium mb-2">Imagens do Grid</label>
            <div className="space-y-2">
              {(section.content?.gridImages || []).map((img, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <ImageUploader
                    value={img}
                    onChange={(url) => {
                      const updated = [...(section.content.gridImages || [])];
                      updated[index] = url;
                      handleContentUpdate('gridImages', updated);
                    }}
                    onRemove={() => {
                      const updated = (section.content.gridImages || []).filter((_, i) => i !== index);
                      handleContentUpdate('gridImages', updated);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => handleContentUpdate('gridImages', [...(section.content.gridImages || []), ''])}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-purple-500"
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