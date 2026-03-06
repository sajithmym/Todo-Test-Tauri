interface EmptyStateProps {
  type: "no-todos" | "no-results";
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No matching todos</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different search or filter</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 flex items-center justify-center mb-5">
        <svg className="w-10 h-10 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No todos yet</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 text-center max-w-xs">
        Add your first task above to get started. Stay productive!
      </p>
    </div>
  );
}
