// frontend/src/components/admin/SectionEditor/SectionEditor.jsx
import HeaderEditor from './HeaderEditor';
import HeroEditor from './HeroEditor';
import ProductsEditor from './ProductsEditor';
import ContentEditor from './ContentEditor';
import ContactEditor from './ContactEditor';
import FooterEditor from './FooterEditor';

const editors = {
  header: HeaderEditor,
  hero: HeroEditor,
  products: ProductsEditor,
  content: ContentEditor,
  contact: ContactEditor,
  footer: FooterEditor
};

export default function SectionEditor({
  section,
  config,
  activeAccordion,
  onSave,
  onTogglePublish,
  onUpdateSection,
  onSetActiveAccordion
}) {
  const EditorComponent = editors[section.section_type];

  if (!EditorComponent) {
    return <div className="text-gray-500">Editor não encontrado para: {section.section_type}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Editando: {section.section_type}</h2>
        <button
          onClick={() => onTogglePublish(section, section.is_active === 0)}
          className={`px-4 py-2 rounded-lg font-medium ${
            section.is_active === 1 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {section.is_active === 1 ? '🔓 Despublicar' : '✅ Publicar'}
        </button>
      </div>

      <EditorComponent
        section={section}
        config={config}
        activeAccordion={activeAccordion}
        onUpdateSection={onUpdateSection}
        onSetActiveAccordion={onSetActiveAccordion}
      />

      <button
        onClick={() => onSave(section)}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full font-semibold"
      >
        💾 Salvar Alterações
      </button>
    </div>
  );
}