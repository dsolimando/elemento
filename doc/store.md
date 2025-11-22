---
title: Store Guide
nav_order: 2
---

# Central Store with Elemento

This guide shows how to create a tiny, framework-free “central store” using Elemento’s signals. It’s based on the live example in `src/__tests__/store.html` and `src/__tests__/store.js`.

You’ll learn how to:
- Model app state with signals
- Expose read/write APIs (fetch/update)
- Consume the store from Web Components built with Elemento

## Why a central store?
- Share state across multiple components
- Keep async data fetching in one place
- Provide a single source of truth with a small, predictable API

Elemento uses signals powered by [Preact Signals Core](https://github.com/preactjs/signals) under the hood, so any component reading from the store will re-render automatically when the store changes.

---

## Quick start: A minimal Todos store (JavaScript)

store.js
```js
import { signal } from '@solidx/elemento';
// Or, if you run from this repo without bundler:
// import { signal } from 'Elemento';
import { getTodos, addTodo as add } from './TodoService.js';

// 1) Define reactive state
const todos = signal([]);

// 2) Export read-only handles (by convention)
export const store = { todos };

// 3) Write-side API (async-safe)
export async function fetchTodos() {
  const t = await getTodos();
  // Always assign a new array so change is detected
  todos.value = [...t];
}

export async function addTodo(todo) {
  const t = await add(todo);
  todos.value = [...t];
}
```

A tiny mock service for this example:

TodoService.js
```js
let data = { todos: [{ title: 'Clean the kitchen' }] };

export function getTodos() {
  return new Promise(resolve => {
    setTimeout(() => resolve(data.todos), 500);
  });
}

export function addTodo(todo) {
  return new Promise(resolve => {
    setTimeout(() => {
      data.todos = [...data.todos, todo];
      resolve(data.todos);
    }, 300);
  });
}
```

---

## Consuming the store from a component

- Read store signals with `computed` (or directly via `.value` inside the template function).
- The component re-renders whenever any used signal changes.

```js
import { Elemento, computed, html } from '@solidx/elemento';
import { store } from './store.js';

function TodoList() {
    // derive reactive value from the store
    const todos = computed(() => store.todos.value);

    return html`
      <section>
        <h3>Todos</h3>
        ${todos.value?.map(t => html`<p>${t.title}</p>`)}
      </section>`;
}
// Elemento accepts an options object; none are needed here.
customElements.define('todo-list', Elemento(TodoList));
```

You can keep composing components like usual:

```js

function TodoApp() {
    return html`
    <todo-list></todo-list>
    <button @click=${() => import('./store.js').then(m => m.addTodo({ title: 'New todo' }))}>
      Add todo
    </button>
  `
}
customElements.define('todo-app', Elemento(TodoApp));
```

---

## Using in the browser (no bundler)

Use an import map to point `Elemento` to the built file under `dist/` (this repo’s test pages do this):

```html
<script type="importmap">
  {
    "imports": {
      "Elemento": "/dist/index.js"
    }
  }
</script>
<script type="module">
  import { Elemento, computed, html } from 'Elemento';
  import { store, fetchTodos } from './store.js';

  fetchTodos();
  // Define and use components that read from store...
</script>
```

## Using with a bundler

Install the package:
```sh
npm install @solidx/elemento
```
Then import from the package name in your app code:
```js
import { signal, computed, Elemento, html } from '@solidx/elemento';
```

TypeScript tip: you can type the options object if you pass one:
```ts
import type { ElementoOptions } from '@solidx/elemento';

const opts: ElementoOptions<never, never> = {};
customElements.define('todo-list', Elemento(TodoList, opts));
```

---

## Patterns and best practices

- Immutable updates: avoid mutating arrays/objects in-place. Reassign with new references so signals propagate changes. For example:
  - Good: `todos.value = [...todos.value, newTodo]`
  - Avoid: `todos.value.push(newTodo)`

- Granular signals: keep separate signals for independent concerns (e.g., `todos`, `loading`, `error`) so components update only when needed.

- Derived selectors: compute projections once and share them between components.
```js
import { computed } from '@solidx/elemento';
import { store } from './store.js';

export const completedTodos = computed(() =>
  store.todos.value.filter(t => t.completed)
);
```

- Write helpers: keep all writes in the store module to centralize side effects.
```js
export async function toggleTodo(id) {
  const next = store.todos.value.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  store.todos.value = next;
}
```

- Loading and error states:
```js
const loading = signal(false);
const error = signal(null);
export const store = { todos, loading, error };

export async function fetchTodos() {
  loading.value = true; error.value = null;
  try {
    const t = await getTodos();
    todos.value = [...t];
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
}
```

---

## Full inline example (like `src/__tests__/store.html`)

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <script type="importmap">
        {
          "imports": {
            "Elemento": "../../dist/index.js"
          }
        }
    </script>
</head>
<body>
<script type="module">
    import { Elemento, computed, html } from 'Elemento';
    import { store, fetchTodos, addTodo } from './store.js';

    function TodoList() {
        // derive reactive value from the store
        const todos = computed(() => store.todos.value);

        return html`
              <section>
                <h3>Todos</h3>
                ${todos.value?.map(t => html`<p>${t.title}</p>`)}
              </section>`;
    }
    customElements.define('todo-list', Elemento(TodoList));

    function TodoApp() {
        return html`
            <todo-list></todo-list>
            <button @click=${() => addTodo({ title: 'New todo' })}>add todo</button>
          `;
    }
    customElements.define('my-data-button', Elemento(TodoApp));

    fetchTodos();
</script>
<my-data-button></my-data-button>
</body>
</html>
```

That’s it! You now have a lightweight, reactive central store you can consume from any Elemento component.
