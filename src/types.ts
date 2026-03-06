export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  priority: Priority;
  category: string;
}

export type Priority = "low" | "medium" | "high";

export type FilterType = "all" | "active" | "completed";

export interface CreateTodoInput {
  title: string;
  priority: Priority;
  category: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  completed?: boolean;
  priority?: Priority;
  category?: string;
}
