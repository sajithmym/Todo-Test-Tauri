import { useState, useRef, useEffect } from "react";
import type { Priority, CreateTodoInput } from "../types";

interface TodoInputProps {
  onAdd: (input: CreateTodoInput) => Promise<void>;
}

const CATEGORIES = ["Personal", "Work", "Shopping", "Health", "Learning", "Other"];

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("Personal");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({ title: trimmed, priority, category });
      setTitle("");
      setPriority("medium");
      setCategory("Personal");
      setIsExpanded(false);
      inputRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityColors: Record<Priority, string> = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="What needs to be done?"
          className="w-full px-5 py-4 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:border-primary-400 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30
                     transition-all duration-200 outline-none shadow-sm"
          maxLength={200}
        />
        {title.trim() && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl
                       bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg
                       transition-all duration-200 hover:scale-105 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-2 px-1 animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority:</span>
            {(["low", "medium", "high"] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all duration-150
                  ${priority === p
                    ? priorityColors[p] + " shadow-sm scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700
                         bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700
                         transition-all duration-150 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </form>
  );
}
