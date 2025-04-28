export function ExpandableChatHeader({ onClose, onMinimize, onPopout }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Chat Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onPopout && (
            <button
              onClick={onPopout}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Expand to full view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}