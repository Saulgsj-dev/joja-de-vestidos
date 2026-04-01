// frontend/src/components/admin/SectionEditor/ContentEditor.jsx
import SectionAccordion from '../SectionAccordion';
import ImageUploader from '../ImageUploader';

export default function FooterEditor({ section, config, activeAccordion, onUpdateSection }) {
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

  // 🔘 Funções para blocos
  const handleAddBlock = () => {
    const blocks = section.content?.blocks || [];
    onUpdateSection({
      ...section,
      content: {
        ...section.content,
        blocks: [...blocks, { type: 'text', title: '', text: '', align: 'center', button: null }]
      }
    });
  };

  const handleUpdateBlock = (index, field, value) => {
    const blocks = [...(section.content?.blocks || [])];
    blocks[index] = { ...blocks[index], [field]: value };
    onUpdateSection({
      ...section,
      content: { ...section.content, blocks }
    });
  };

  const handleRemoveBlock = (index) => {
    const blocks = (section.content?.blocks || []).filter((_, i) => i !== index);
    onUpdateSection({
      ...section,
      content: { ...section.content, blocks }
    });
  };

  const handleAddButtonToBlock = (blockIndex) => {
    const blocks = [...(section.content?.blocks || [])];
    blocks[blockIndex] = {
      ...blocks[blockIndex],
      button: { text: '', link: '', color: config?.cor_botao || '#000000' }
    };
    onUpdateSection({
      ...section,
      content: { ...section.content, blocks }
    });
  };

  const handleUpdateButton = (blockIndex, field, value) => {
    const blocks = [...(section.content?.blocks || [])];
    if (blocks[blockIndex].button) {
      blocks[blockIndex].button = { ...blocks[blockIndex].button, [field]: value };
    }
    onUpdateSection({
      ...section,
      content: { ...section.content, blocks }
    });
  };

  const handleRemoveButton = (blockIndex) => {
    const blocks = [...(section.content?.blocks || [])];
    blocks[blockIndex] = { ...blocks[blockIndex], button: null };
    onUpdateSection({
      ...section,
      content: { ...section.content, blocks }
    });
  };

  return (
    <div className="space-y-3">
      {/* 🎨 FUNDO DO FOOTER */}
      <SectionAccordion id="footer-background" title="🎨 Fundo do Footer" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
            <input
              type="color"
              value={section.styles?.backgroundColor || config?.cor_botao || '#000000'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cor do Texto</label>
            <input
              type="color"
              value={section.styles?.textColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>
      </SectionAccordion>

      {/* 📦 BLOCOS DE CONTEÚDO */}
      <SectionAccordion id="footer-blocks" title="📦 Blocos de Conteúdo">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-3">
            💡 Adicione blocos com títulos, textos e botões personalizados
          </p>
          
          {section.content?.blocks?.map((block, blockIndex) => (
            <div key={blockIndex} className="p-4 bg-gray-50 rounded-lg border space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Bloco {blockIndex + 1}</span>
                <button
                  onClick={() => handleRemoveBlock(blockIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ Remover
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={(e) => handleUpdateBlock(blockIndex, 'title', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Ex: © 2024 Minha Loja"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Texto/Descrição</label>
                <textarea
                  value={block.text || ''}
                  onChange={(e) => handleUpdateBlock(blockIndex, 'text', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  rows="2"
                  placeholder="Texto adicional (opcional)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2">Alinhamento</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => handleUpdateBlock(blockIndex, 'align', align)}
                      className={`flex-1 py-2 rounded text-sm ${
                        block.align === align || (!block.align && align === 'center')
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {align === 'left' ? '⬅️ Esquerda' : align === 'center' ? '↕️ Centro' : '➡️ Direita'}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTÃO DO BLOCO */}
              {block.button ? (
                <div className="p-3 bg-white rounded border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Botão</span>
                    <button
                      onClick={() => handleRemoveButton(blockIndex)}
                      className="text-red-500 text-xs"
                    >
                      Remover botão
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Texto do Botão</label>
                    <input
                      type="text"
                      value={block.button.text || ''}
                      onChange={(e) => handleUpdateButton(blockIndex, 'text', e.target.value)}
                      className="w-full p-2 border rounded text-xs"
                      placeholder="Ex: Fale Conosco"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Link</label>
                    <input
                      type="text"
                      value={block.button.link || ''}
                      onChange={(e) => handleUpdateButton(blockIndex, 'link', e.target.value)}
                      className="w-full p-2 border rounded text-xs"
                      placeholder="https://wa.me/5511999999999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Cor do Botão</label>
                    <input
                      type="color"
                      value={block.button.color || config?.cor_botao || '#000000'}
                      onChange={(e) => handleUpdateButton(blockIndex, 'color', e.target.value)}
                      className="w-full h-8 rounded cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAddButtonToBlock(blockIndex)}
                  className="w-full py-2 border-2 border-dashed border-purple-300 rounded text-purple-600 hover:bg-purple-50 text-sm"
                >
                  + Adicionar Botão
                </button>
              )}
            </div>
          ))}

          <button
            onClick={handleAddBlock}
            className="w-full py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition font-medium"
          >
            + Adicionar Bloco
          </button>
        </div>
      </SectionAccordion>

      {/* 🔤 TAMANHO DO TEXTO */}
      <SectionAccordion id="footer-font-size" title="🔤 Tamanho do Texto">
        <div>
          <label className="block text-sm font-medium mb-2">Tamanho do Texto</label>
          <select
            value={section.styles?.textFontSize || 'medio'}
            onChange={(e) => handleStyleUpdate('textFontSize', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
          </select>
        </div>
      </SectionAccordion>

      {/* 📐 ESPAÇAMENTO */}
      <SectionAccordion id="footer-spacing" title="📐 Espaçamento">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Padding Superior: {section.styles?.paddingTop || 'py-8'}</label>
            <select
              value={section.styles?.paddingTop || 'py-8'}
              onChange={(e) => handleStyleUpdate('paddingTop', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="py-4">Pequeno</option>
              <option value="py-8">Médio</option>
              <option value="py-12">Grande</option>
              <option value="py-16">Extra Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Padding Inferior: {section.styles?.paddingBottom || 'py-6'}</label>
            <select
              value={section.styles?.paddingBottom || 'py-6'}
              onChange={(e) => handleStyleUpdate('paddingBottom', e.target.value)}
              className="w-full p-2 border rounded"
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