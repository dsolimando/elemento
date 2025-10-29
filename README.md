# Elemento

A lightweight, opinionated library for building web components with a functional, React-inspired approach, based on the excellent [uhtml](https://github.com/WebReflection/uhtml) library.

## Overview

Elemento is a tiny yet powerful library that bridges the gap between modern Web Components and functional programming. It provides a clean, declarative API for creating custom elements that leverage Shadow DOM while maintaining a reactive programming model.

## Core Philosophy

- Embrace Web Standards: Built on native Custom Elements and Shadow DOM
- Functional Composition: React-inspired component architecture without React
- Declarative Rendering: Reactive UI updates based on signal/state changes
- Type Safety: Full TypeScript support
- Minimalist Approach: Small API surface with powerful capabilities

## Features

- Reactive Rendering: Built on µhtml's signals and rendering system
- Attribute Reactivity: Automatic synchronization between attributes and reactive signals
- Property Reactivity: Reactive web component properties exposed as signals via getters/setters
- Encapsulated Styling: First-class support for Shadow DOM and Constructable Stylesheets
- Lightweight: Tiny footprint with no heavy dependencies
- Composition-First: Functional component patterns for easy composition

## Getting Started

### Installation

Elemento depends on uhtml as a peer dependency.

```sh
npm install @solidx/elemento uhtml
```

### Basic Usage

Create your web component with a functional approach:

```ts
import buttonCss from './button.css?inline';
import { BoolAttr, Elemento, signal, computed, html } from '@solidx/elemento';

const buttonStyles = new CSSStyleSheet();
buttonStyles.replaceSync(buttonCss);

// Define the list of reactive custom element attributes
const attributes = [
  'variant',
  'state',
  'loading',
  'shape',
  'inverted',
  'aria-expanded',
  'extended',
  'extended--mobile',
  'extended--tablet',
  'extended--laptop',
] as const;

type Attribute = (typeof attributes)[number];

// Define reactive component properties (settable via JS, exposed as signals)
const properties = ['count'] as const;

type Prop = (typeof properties)[number];

// Single-phase functional component: receives reactive props and the element
const Button = ({ variant, shape, inverted, extended, loading, count, ...rest }: Record<
  Attribute | Prop,
  { value: any }
>, el: HTMLElement) => {
  // Internal state using Elemento's signals (hook-like behavior)
  const internalClicks = signal(0);

  // Derived values
  const classes = computed(() =>
    [
      variant.value || 'btn',
      shape.value || 'default',
      BoolAttr(inverted.value) ? 'inverted' : '',
      BoolAttr(loading.value) ? 'loading' : '',
    ].join(' ')
  );

  const cssVars = computed(() =>
    [
      `--button-extended: ${BoolAttr(extended.value) ? '100%' : ''};`,
      `--button-extended--tablet: ${BoolAttr(rest['extended--tablet'].value) ? '100%' : ''};`,
      `--button-extended--mobile: ${BoolAttr(rest['extended--mobile'].value) ? '100%' : ''};`,
      `--button-extended--laptop: ${BoolAttr(rest['extended--laptop'].value) ? '100%' : ''};`,
    ].join('')
  );

  return html`<button
    class="${classes.value}"
    style="${cssVars.value}"
    aria-expanded="${rest['aria-expanded'].value}"
    @click=${() => {
      internalClicks.value++;
    }}
  >
    <slot></slot>
    <span>Prop count: ${count?.value ?? 0}</span>
    <span>Internal clicks: ${internalClicks.value}</span>
  </button>`;
};

// Register the custom element with Elemento
customElements.define(
  'my-button',
  // Signature: Elemento(template, observedAttributes?, properties?, cssStylesheets?, onConnected?)
  Elemento<Attribute, Prop>(Button, attributes, properties, [buttonStyles])
);
```

Then use it in your HTML:

```html
<my-button id="btn" variant="primary">Click me</my-button>
<script type="module">
  // Set a reactive property via JavaScript
  const btn = document.getElementById('btn');
  btn.count = 5; // updates instantly because `count` is reactive
</script>
```

## API

### Elemento

Creates a Web Component class around your functional component.

Signature:

```
Elemento(
  template: (props: Record<K | P, Signal<any>>, el: HTMLElement) => Node | HTMLElement,
  observedAttributes?: readonly K[],
  properties?: readonly P[],
  cssStylesheets?: CSSStyleSheet[],
  onConnected?: (el: HTMLElement) => void
): CustomElementConstructor
```

- observedAttributes: attributes mirrored to signals and kept in sync with the DOM
- properties: JS properties mirrored to signals (no attributes involved)
- cssStylesheets: constructable stylesheets adopted into the shadow root
- onConnected: optional callback invoked after the element connects

### Component function

Your component function is called on every reactive change with a single object containing signals for both attributes and properties, and the custom element instance as second parameter. Read signal values via `.value`.

You may call Elemento's hook-like utilities inside the function:

- signal(initial): create internal state that persists across renders
- computed(fn): derived read-only signal
- html: re-export from uhtml for templating

Important notes:

- Call signal/computed at the top level of your component and in the same order across renders (hook-like rule).
- Boolean attributes are strings at the DOM level; use `BoolAttr(value)` to coerce presence/absence to boolean.

## How it works

Elemento creates a class that extends `HTMLElement` and:

- Observes specified attributes and maps them to signals
- Creates reactive property signals with getters/setters
- Attaches a shadow root and adopts provided stylesheets
- Re-renders efficiently via uhtml effects when any relevant signal changes
- Cleans up on disconnect

## Why Elemento?

- No Virtual DOM: Direct DOM operations via uhtml
- Standards-Based: Works with native browser technologies
- Minimal Abstraction: Thin wrapper around web components
- Functional Approach: Brings a React-like feel without React
- TypeScript First: Designed with type safety in mind

## License

MIT