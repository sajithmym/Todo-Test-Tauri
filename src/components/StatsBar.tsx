interface StatsBarProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 px-1">
      {/* Progress bar */}
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
        <span>
          <span className="text-primary-600 dark:text-primary-400 font-semibold">{completionPercent}%</span> done
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>{stats.active} left</span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>{stats.total} total</span>
      </div>
    </div>
  );
}
