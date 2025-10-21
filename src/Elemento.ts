import { effect, Hole, render, signal } from 'uhtml';

// Type for signal/reactive value
export interface Signal<T> {
  value: T;
}

// Type for effect cleanup
export interface Effect {
  cleanup?: () => void;
}

export function BoolAttr(attr: string) {
  return attr !== null && attr !== undefined;
}

export type ElementoHTMLFn<K extends string> = (
  props: Record<K, Signal<string>>,
  el: HTMLElement
) => Hole | Node | HTMLElement;

/**
 * Type for template function
 */
export type ElementoFn<K extends string> = () => ElementoHTMLFn<K>;

/**
 * Web Component factory using uhtml + signal reactivity.
 *
 * @param {string[]} observedAttributes - List of attribute names to observe/react to.
 * @param {(ctx: { signals: Record<string, any>, el: HTMLElement }) => unknown} templateFn - Render function returning uhtml template.
 * @param {(ctx: { signals: Record<string, any>, el: HTMLElement }) => void} [onConnected] - Optional hook for connectedCallback.
 * @param {CSSStyleSheet[]} [cssStylesheets] - Optional CSS stylesheets to adopt.
 * @returns {CustomElementConstructor}
 */
export function Elemento<K extends string>(
  templateFn: ElementoFn<K>,
  observedAttributes: readonly K[],
  cssStylesheets?: CSSStyleSheet[],
  onConnected?: (el: HTMLElement) => void
): CustomElementConstructor {
  return class extends HTMLElement {
    static get observedAttributes() {
      return observedAttributes;
    }

    /**
     * Signals for reactive properties
     */
    signals: Record<K, Signal<string>>;

    elementoHTMLFn?: ElementoHTMLFn<K>;

    /**
     * Effect for rendering
     */
    _effect?: Effect;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      // Create a signal for each attribute
      this.signals = Object.fromEntries(
        observedAttributes.map(attr => [attr, signal(this.getAttribute(attr))])
      ) as Record<K, Signal<string>>;

      // Define reactive property proxies
      for (const attr of observedAttributes) {
        Object.defineProperty(this, attr, {
          get: () => this.signals[attr].value,
          set: val => {
            if (val !== this.signals[attr].value) {
              this.signals[attr].value = val;
              this.setAttribute(attr, val);
            }
          },
        });
      }

      this.shadowRoot!.adoptedStyleSheets = cssStylesheets || [];
    }

    /**
     * Trigger a manual update/re-render
     */
    update(): void {
      if (this._effect && this.isConnected) {
        render(this.shadowRoot!, this.elementoHTMLFn?.(this.signals, this) as Node);
      }
    }

    connectedCallback() {
      this.elementoHTMLFn = templateFn();

      this._effect = effect(() => {
        render(this.shadowRoot!, this.elementoHTMLFn?.(this.signals, this) as Node);
      });
      if (typeof onConnected === 'function') {
        onConnected(this);
      }
    }

    attributeChangedCallback(name: K, oldValue: string, newValue: string) {
      if (oldValue !== newValue && this.signals[name]) {
        this.signals[name].value = newValue;
      }
    }

    disconnectedCallback() {
      // clean up effect if needed (optional API safety)
      if (this._effect && typeof this._effect.cleanup === 'function') {
        this._effect.cleanup();
      }
    }
  };
}
