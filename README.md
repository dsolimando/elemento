# Elemento

Lightweight, build-free utilities for composing modern Web Components with lit-html templating and Preact Signals reactivity. Ships as ESM; use directly in browsers or bundle if your app requires it.

- [Full guide](doc/README.md) — install, API, examples
- [Store walkthrough](doc/store.md) — central store patterns

Quick start:
```sh
npm install @solidx/elemento
```
```ts
import { Elemento, html } from '@solidx/elemento';
customElements.define('hello-name', Elemento(({ name }) => html`<p>Hello ${name.value || 'World'}</p>`, {
  observedAttributes: ['name'],
}));
```
    
