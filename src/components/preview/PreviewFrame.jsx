export default function PreviewFrame({ viewMode, children }) {
  if (viewMode === 'desktop') {
    return (
      <div className="h-full overflow-y-auto bg-gray-200 p-4 sm:p-8">
        <div className="flex justify-center min-h-full">
          {/* Container Desktop com borda e sombra */}
          <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-300">
            {/* Barra de rolagem customizada */}
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile view (já está perfeito)
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gray-200">
      <div className="flex justify-center min-h-full">
        <div className="w-[375px] min-h-[667px] bg-white rounded-[3rem] border-8 border-gray-800 overflow-hidden shadow-2xl">
          {/* Status bar */}
          <div className="bg-gray-800 h-6 flex items-center justify-center">
            <div className="w-20 h-4 bg-black rounded-full"></div>
          </div>
          
          {/* Content com scrollbar */}
          <div className="h-[calc(100%-1.5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {children}
          </div>
          
          {/* Home indicator */}
          <div className="bg-gray-800 h-1 flex justify-center items-end pb-1">
            <div className="w-32 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}