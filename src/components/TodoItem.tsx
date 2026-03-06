import { useState, useRef, useEffect } from "react";
import type { Todo, Priority, UpdateTodoInput } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const priorityConfig: Record<Priority, { dot: string; label: string }> = {
  high: { dot: "bg-red-500", label: "High" },
  medium: { dot: "bg-yellow-500", label: "Med" },
  low: { dot: "bg-green-500", label: "Low" },
};

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      await onUpdate({ id: todo.id, title: trimmed });
    }
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(async () => {
      await onDelete(todo.id);
    }, 200);
  };

  const createdDate = new Date(todo.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border
                  bg-white dark:bg-gray-800/80 backdrop-blur-sm
                  border-gray-200 dark:border-gray-700/60
                  hover:border-gray-300 dark:hover:border-gray-600
                  hover:shadow-md dark:hover:shadow-gray-900/20
                  transition-all duration-200 animate-slide-in
                  ${isDeleting ? "opacity-0 scale-95 translate-x-4" : ""}
                  ${todo.completed ? "opacity-75" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center
                    transition-all duration-200 hover:scale-110 active:scale-90
                    ${
                      todo.completed
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
                    }`}
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={editRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm rounded-lg border border-primary-300 dark:border-primary-600
                       bg-primary-50 dark:bg-primary-900/20 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700"
            maxLength={200}
          />
        ) : (
          <div className="flex items-center gap-2">
            <p
              onDoubleClick={() => setIsEditing(true)}
              className={`text-sm font-medium truncate cursor-pointer select-none
                          ${
                            todo.completed
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
              title="Double-click to edit"
            >
              {todo.title}
            </p>
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[todo.priority].dot}`} />
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {priorityConfig[todo.priority].label}
            </span>
          </span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600">•</span>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">
            {todo.category}
          </span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600">•</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{createdDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20
                     transition-all duration-150"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                     transition-all duration-150"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
