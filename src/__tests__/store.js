import { signal } from 'Elemento';
import { getTodos, addTodo as add } from './TodoService.js';

const todos = signal([]);

export const store = { todos };

export async function fetchTodos() {
  const t = await getTodos();
  todos.value = [...t];
}

export async function addTodo(todo) {
  const t = await add(todo);
  todos.value = [...t];
}
