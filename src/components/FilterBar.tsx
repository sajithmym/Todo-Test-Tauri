import type { FilterType } from "../types";

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export function FilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  hasCompleted,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 w-full sm:w-auto">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search todos..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30
                     transition-all duration-200 outline-none"
        />
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
              ${
                filter === f.key
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Clear completed */}
      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300
                     hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg
                     transition-all duration-150 whitespace-nowrap"
        >
          Clear done
        </button>
      )}
    </div>
  );
}
