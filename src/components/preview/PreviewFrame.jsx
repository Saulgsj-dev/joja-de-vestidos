export default function PreviewFrame({ viewMode, children }) {
  if (viewMode === 'desktop') {
    return (
      <div className="h-full overflow-y-auto bg-white">
        <div className="min-h-full">
          {children}
        </div>
      </div>
    );
  }

  // Mobile view
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
          
          {/* Content */}
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