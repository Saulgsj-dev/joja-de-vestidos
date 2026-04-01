import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function HeroSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';
  const hasLeftImage = content.leftImage;
  const hasRightImage = content.rightImage;
  const hasGridImages = content.gridImages?.length > 0;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {imageLayout === 'center' && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
              {content.title || 'Bem-vindo'}
            </h2>
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
              {content.subtitle || 'Sua mensagem aqui'}
            </p>
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
          </div>
        )}
        {/* Adicione outros layouts (sides, grid) conforme necessário */}
      </div>
    </section>
  );
}