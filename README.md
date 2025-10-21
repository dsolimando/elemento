# Elemento

A lightweight, opinionated library for building web components with a functional, React-inspired approach and based on the excellent [uhtml](
  https://github.com/WebReflection/uhtml
) library.

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
import buttonCss from './button.css?inline';
import { BoolAttr, Elemento, ElementoFn } from 'elemento';
import { computed, html, signal } from 'uhtml';

const buttonStyles = new CSSStyleSheet();
buttonStyles.replaceSync(buttonCss);

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

const Button: ElementoFn<Attribute> = () => {
  const counter = signal(0);

  return ({ variant, shape, inverted, extended, loading, ...rest }) => {
    const computedStyle = computed(() =>
      [
        variant.value || 'btn',
        shape.value || 'default',
        BoolAttr(inverted.value) ? 'inverted' : '',
        BoolAttr(loading.value) ? 'loading' : '',
      ].join(' ')
    );

    const computedCSSProperties = computed(() =>
      [
        `--button-extended: ${BoolAttr(extended.value) ? '100%' : ''};`,
        `--button-extended--tablet: ${BoolAttr(rest['extended--tablet'].value) ? '100%' : ''};`,
        `--button-extended--mobile: ${BoolAttr(rest['extended--mobile'].value) ? '100%' : ''};`,
        `--button-extended--laptop: ${BoolAttr(rest['extended--laptop'].value) ? '100%' : ''};`,
      ].join('')
    );

    return html`<button
      class="${computedStyle.value}"
      style="${computedCSSProperties.value}"
      aria-expanded="s${rest['aria-expanded'].value}"
      @click=${() => {
        counter.value++;
      }}
    >
      <slot></slot>
      <span>Counter: ${counter.value}</span>
    </button>`;
  };
};

customElements.define(
  'my-button',
  Elemento<Attribute>(Button, attributes, [buttonStyles])
);
```


Then use it in your HTML:

```html
<my-button variant="primary">Click me</my-button>
```


## API Design

Elemento follows a two-phase component creation pattern:

1. **Setup Phase**:
    - Runs only once when the component is connected to the DOM
    - Establishes the component's internal state using signals
    - Defines component-scoped variables and functions that persist across renders
    - Similar to React's hooks initialization phase, allowing for closures over state
    - The perfect place for setting up event listeners, timers, or other stateful logic

2. **Render Phase**:
    - Returns a function that produces HTML based on reactive properties
    - Re-executes whenever observed attributes or internal state changes
    - Has access to both external properties and internal state

This approach allows for clean separation of concerns while maintaining reactivity. The setup phase creates an encapsulated environment for each component instance, with private state that's preserved between renders.

## How Elemento Works

Elemento creates a class that extends `HTMLElement`, providing:

- Automatic observation of specified attributes
- Signal-based reactivity for each attribute
- Shadow DOM attachment and style encapsulation
- Efficient re-rendering when attributes change
- Proper lifecycle management

## State Management

Elemento provides a simple yet powerful approach to state management:

- **External State**: Managed through observed attributes and properties
- **Internal State**: Created during the setup phase using signals
- **Computed Values**: Derived state calculated from other state values

Unlike traditional web components that often mix state management with rendering logic, Elemento keeps these concerns separate, making components more maintainable and testable.

## Why Elemento?

- **No Virtual DOM**: Direct DOM manipulation for better performance
- **Standards-Based**: Works with native browser technologies
- **Minimal Abstraction**: Thin wrapper around web components
- **Functional Approach**: Provides the elegance of React's functional components
- **TypeScript First**: Designed with type safety in mind

## License

MIT