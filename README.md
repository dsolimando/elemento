# Elemento

A lightweight, opinionated library for building web components with a functional, React-inspired approach, powered by the excellent [lit-html](https://github.com/lit/lit/tree/main/packages/lit-html) templating library and the tiny, fast [Preact Signals Core](https://github.com/preactjs/signals) reactivity system.


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