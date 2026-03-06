import { useState, useEffect, useCallback } from "react";
import type { Todo, FilterType, Priority, CreateTodoInput, UpdateTodoInput } from "./types";
import * as api from "./api";
import { Header } from "./components/Header";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { FilterBar } from "./components/FilterBar";
import { StatsBar } from "./components/StatsBar";
import { EmptyState } from "./components/EmptyState";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadTodos = useCallback(async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      console.error("Failed to load todos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (input: CreateTodoInput) => {
    const todo = await api.createTodo(input);
    setTodos((prev) => [...prev, todo]);
  };

  const handleToggle = async (id: string) => {
    const updated = await api.toggleTodo(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleUpdate = async (input: UpdateTodoInput) => {
    const updated = await api.updateTodo(input);
    setTodos((prev) => prev.map((t) => (t.id === input.id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = async () => {
    const remaining = await api.clearCompleted();
    setTodos(remaining);
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      searchQuery
        ? todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

        <div className="mt-8 space-y-4">
          <TodoInput onAdd={handleCreate} />

          {todos.length > 0 && (
            <>
              <StatsBar stats={stats} />
              <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                hasCompleted={stats.completed > 0}
                onClearCompleted={handleClearCompleted}
              />
            </>
          )}

          {sortedTodos.length > 0 ? (
            <TodoList
              todos={sortedTodos}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ) : todos.length === 0 ? (
            <EmptyState type="no-todos" />
          ) : (
            <EmptyState type="no-results" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
