# Elemento

**Build modern, reactive Web Components effortlessly** — with functional composition, lit-html templating, and Preact Signals reactivity. Zero build step required.

✨ **Modern & Lightweight** — Ships as ESM modules, use directly in browsers or bundle as needed  
🚀 **React-inspired API** — Familiar functional component patterns  
⚡  **Reactive by default** — Powered by Preact Signals for automatic updates  
🎯 **Standards-based** — Built on native Web Components and Custom Elements

- [Documentation & Examples](https://dsolimando.github.io/elemento/) — complete guide and live demos

Quick start:

```sh
npm install @solidx/elemento
```

```ts
import { Elemento, html } from '@solidx/elemento';

function Hello({ name }) {
  return html`<p>Hello ${name.value || 'World'}</p>`;
}

customElements.define(
  'hello-name',
  Elemento(Hello, {
    observedAttributes: ['name'],
  })
);
```