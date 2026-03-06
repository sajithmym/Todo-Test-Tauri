import { invoke } from "@tauri-apps/api/core";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "./types";

export async function getTodos(): Promise<Todo[]> {
  return invoke<Todo[]>("get_todos");
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  return invoke<Todo>("create_todo", { input });
}

export async function updateTodo(input: UpdateTodoInput): Promise<Todo> {
  return invoke<Todo>("update_todo", { input });
}

export async function deleteTodo(id: string): Promise<void> {
  return invoke<void>("delete_todo", { id });
}

export async function toggleTodo(id: string): Promise<Todo> {
  return invoke<Todo>("toggle_todo", { id });
}

export async function clearCompleted(): Promise<Todo[]> {
  return invoke<Todo[]>("clear_completed");
}

export async function reorderTodos(ids: string[]): Promise<Todo[]> {
  return invoke<Todo[]>("reorder_todos", { ids });
}
