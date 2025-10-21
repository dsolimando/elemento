# Elemento

A lightweight, opinionated library for building web components with a functional, React-inspired approach.

## Overview

Elemento is a tiny yet powerful library that bridges the gap between modern web components and the functional programming paradigm popularized by React. It provides a clean, declarative API for creating custom elements that leverage Shadow DOM while maintaining a reactive programming model.

## Core Philosophy

- **Embrace Web Standards**: Built on native Custom Elements and Shadow DOM
- **Functional Composition**: React-inspired component architecture without the React dependencies
- **Declarative Rendering**: Reactive UI updates based on signal/state changes
- **Type Safety**: Full TypeScript support for enhanced developer experience
- **Minimalist Approach**: Small API surface with powerful capabilities

## Features

- 🔄 **Reactive Rendering**: Built on µhtml's signals and rendering system
- 🎯 **Attribute Reactivity**: Automatic synchronization between attributes and properties
- 🎨 **Encapsulated Styling**: First-class support for Shadow DOM and Constructable Stylesheets
- 📦 **Lightweight**: Tiny footprint with no heavy dependencies
- 🧩 **Composition-First**: Functional component patterns for easy composition

## Getting Started

### Installation

```shell script
npm install elemento uhtml
```


### Basic Usage

Create your web component with a functional approach:

```typescript
import { Elemento, ElementoFn, BoolAttr } from 'elemento';
import { html, signal, computed } from 'uhtml';

// Define observed attributes
const attributes = ['variant', 'disabled'] as const;
type ButtonAttr = (typeof attributes)[number];

// Create component function
const MyButton: ElementoFn<ButtonAttr> = () => {
  const clickCount = signal(0);

  return ({ variant, disabled }) => {
    const className = computed(() => 
      `btn ${variant.value || 'default'} ${BoolAttr(disabled.value) ? 'disabled' : ''}`
    );

    return html`
      <button 
        class=${className.value}
        ?disabled=${BoolAttr(disabled.value)}
        @click=${() => { clickCount.value++; }}
      >
        <slot></slot>
        <span>Clicks: ${clickCount.value}</span>
      </button>
    `;
  };
};

// Define the custom element
customElements.define(
  'my-button', 
  Elemento<ButtonAttr>(MyButton, attributes)
);
```


Then use it in your HTML:

```html
<my-button variant="primary">Click me</my-button>
```


## API Design

Elemento follows a two-phase component creation pattern:

1. **Setup Phase**: Initialize signals, create closures (equivalent to React's hooks)
2. **Render Phase**: Return a function that produces HTML based on reactive properties

This approach allows for clean separation of concerns while maintaining reactivity.

## How Elemento Works

Elemento creates a class that extends `HTMLElement`, providing:

- Automatic observation of specified attributes
- Signal-based reactivity for each attribute
- Shadow DOM attachment and style encapsulation
- Efficient re-rendering when attributes change
- Proper lifecycle management

## Why Elemento?

- **No Virtual DOM**: Direct DOM manipulation for better performance
- **Standards-Based**: Works with native browser technologies
- **Minimal Abstraction**: Thin wrapper around web components
- **Functional Approach**: Provides the elegance of React's functional components
- **TypeScript First**: Designed with type safety in mind

## License

MIT