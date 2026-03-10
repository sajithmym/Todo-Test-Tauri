import { getCurrentWindow } from "@tauri-apps/api/window";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMaximized: boolean;
}

export function Header({ darkMode, onToggleDarkMode, isMaximized }: HeaderProps) {

  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();
  const handleClose = () => getCurrentWindow().close();

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between h-12 px-4 flex-shrink-0 select-none
                 bg-white dark:bg-gray-900
                 border-b border-gray-200 dark:border-gray-800"
    >
      {/* Branding — pointer-events-none so drag still works over this area */}
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
          Todo App
        </span>
      </div>

      {/* Window controls */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-500 dark:text-gray-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors duration-150"
        >
          {darkMode ? (
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Minimize */}
        <button
          onClick={handleMinimize}
          title="Minimize"
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-500 dark:text-gray-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={handleMaximize}
          title={isMaximized ? "Restore" : "Maximize"}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-500 dark:text-gray-400
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors duration-150"
        >
          {isMaximized ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          title="Close"
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     text-gray-500 dark:text-gray-400
                     hover:bg-red-500 hover:text-white
                     transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
