
// frontend/src/components/preview/PreviewFrame.jsx
export default function PreviewFrame({ viewMode, children }) {
  if (viewMode === 'desktop') {
    return (
      <div className="h-full flex justify-center items-start bg-gray-200 p-6">
        <div className="w-full max-w-[1200px] rounded-xl overflow-hidden shadow-2xl border bg-white">

          {/* Barra do navegador */}
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
            
            {/* Bolinhas */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            {/* URL fake */}
            <div className="flex-1 mx-4">
              <div className="bg-white border rounded-md px-3 py-1 text-sm text-gray-500 text-center">
                https://jojadevestidos.netlify.app/Horror-Gaming
              </div>
            </div>

            {/* Espaço direito */}
            <div className="w-16"></div>
          </div>

          {/* Conteúdo com scroll */}
          <div className="h-[80vh] overflow-y-auto">
            {children}
          </div>

        </div>
      </div>
    );
  }

  // Mobile continua igual (já tá top)
  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-200">
      <div className="flex justify-center">
        <div className="w-[375px] bg-white rounded-[2.5rem] border-8 border-gray-800 overflow-hidden shadow-2xl">
          
          {/* Status bar */}
          <div className="bg-gray-800 h-7 flex items-center justify-between px-6">
            <span className="text-white text-xs">9:41</span>
            <div className="flex gap-1">
              <div className="w-4 h-2.5 bg-white rounded-sm"></div>
              <div className="w-3 h-2.5 bg-white rounded-sm"></div>
            </div>
          </div>
          
          {/* Conteúdo */}
          <div className="h-[667px] overflow-y-auto">
            {children}
          </div>
          
          {/* Home indicator */}
          <div className="bg-gray-800 h-5 flex justify-center items-center">
            <div className="w-32 h-1 bg-white rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
