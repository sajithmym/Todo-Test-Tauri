import type { Todo, UpdateTodoInput } from "../types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onUpdate: (input: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
