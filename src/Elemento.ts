import { computed as ucomputed, effect, ReadonlySignal, signal as usignal, Signal } from '@preact/signals-core';
import { html, render } from 'lit-html';

export { html };

export function BoolAttr(attr: string) {
  return attr !== null && attr !== undefined;
}

export type ElementoHTMLFn<K extends string, P extends string> = (
  props: Record<K & P, Signal<any>>,
  el: HTMLElement
) => Node | HTMLElement;

export function signal(value: any) {
  if (!currentComponentInstanceRendering) {
    return usignal(value); // we return a signal if we are not in a component. up to the user to handle his lifecycle.
  }
  let returnSignal = currentComponentInstanceRendering.stateSignals[currentComponentInstanceRendering.signalsIndex];
  if (!returnSignal) {
    returnSignal = usignal(value);
    currentComponentInstanceRendering.stateSignals.push(returnSignal);
  }
  currentComponentInstanceRendering.signalsIndex++;
  return returnSignal;
}

export function computed(fn: () => void) {
  if (!currentComponentInstanceRendering) {
    throw new Error('useEffect must be called within a component');
  }
  let returnComputed: ReadonlySignal =
    currentComponentInstanceRendering.computed[currentComponentInstanceRendering.computedIndex];
  if (!returnComputed) {
    returnComputed = ucomputed(fn);
    currentComponentInstanceRendering.computed.push(returnComputed);
  }
  return returnComputed;
}

export function mount(fn: () => void) {
  if (!currentComponentInstanceRendering) {
    throw new Error('useEffect must be called within a component');
  }
  if (!currentComponentInstanceRendering.mount) {
    currentComponentInstanceRendering.mount = fn;
  }
}

export function unmount(fn: () => void) {
  if (!currentComponentInstanceRendering) {
    throw new Error('useEffect must be called within a component');
  }
  if (!currentComponentInstanceRendering.unmount) {
    currentComponentInstanceRendering.unmount = fn;
  }
}

let currentComponentInstanceRendering: IElemento | undefined;

interface IElemento {
  stateSignals: Signal[];
  signalsIndex: number;
  computed: ReadonlySignal[];
  computedIndex: number;
  mount?: Function;
  unmount?: Function;
}

/**
 * Web Component factory using lit-html + Preact Signals Core (@preact/signals-core) reactivity.
 *
 * @param elementoHTMLFn
 * @param {string[]} observedAttributes - List of attribute names to observe/react to.
 * @param {properties: Record<} [properties] - Optional properties to expose.
 * @param {(ctx: { signals: Record<string, any>, el: HTMLElement }) => void} [onConnected] - Optional hook for connectedCallback.
 * @param {CSSStyleSheet[]} [cssStylesheets] - Optional CSS stylesheets to adopt.
 * @returns {CustomElementConstructor}
 */
export function Elemento<K extends string, P extends string>(
  elementoHTMLFn: ElementoHTMLFn<K, P>,
  observedAttributes?: readonly K[],
  properties?: readonly P[],
  cssStylesheets?: CSSStyleSheet[],
  onConnected?: (el: HTMLElement) => void
): CustomElementConstructor {
  return class extends HTMLElement implements IElemento {
    static get observedAttributes() {
      return observedAttributes;
    }

    /**
     * Signals for reactive properties
     */
    signals?: Record<K, Signal<string>>;

    stateSignals: Signal<any>[] = [];

    computed: ReadonlySignal[] = [];

    mount?: Function;

    unmount?: Function;

    propSignals?: Record<P, Signal<any>>;

    signalsIndex = 0;

    computedIndex = 0;

    /**
     * Effect for rendering
     */
    _effect?: () => void;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.adoptedStyleSheets = cssStylesheets || [];
    }

    connectedCallback() {
      currentComponentInstanceRendering = this;

      // Create a signal for each attribute

      this.signals = observedAttributes
        ? (Object.fromEntries(observedAttributes.map(attr => [attr, usignal(this.getAttribute(attr))])) as Record<
            K,
            Signal<string>
          >)
        : undefined;

      // Define reactive attribute proxies
      if (observedAttributes) {
        for (const attr of observedAttributes) {
          Object.defineProperty(this, attr, {
            get: () => this.signals?.[attr].value,
            set: val => {
              if (this.signals && val !== this.signals?.[attr].value) {
                this.signals[attr].value = val;
                this.setAttribute(attr, val);
              }
            },
          });
        }
      }

      this.propSignals = properties
        ? // @ts-ignore
          (Object.fromEntries(properties.map(prop => [prop, usignal(this[prop])])) as Record<P, Signal<any>>)
        : undefined;

      // Define reactive property proxies
      if (properties)
        for (const prop of properties) {
          Object.defineProperty(this, prop, {
            get: () => this.propSignals?.[prop].value,
            set(val: any) {
              if (val !== this.propSignals[prop].value) {
                this.propSignals[prop].value = val;
              }
            },
          });
        }

      this._effect = effect(() => {
        currentComponentInstanceRendering = this;
        this.signalsIndex = 0; // reset signalsIndex
        this.computedIndex = 0; // reset computedIndex
        const mounted = !!this.mount;
        // @ts-ignore
        render(elementoHTMLFn?.({ ...this.propSignals, ...this.signals }, this) as Node, this.shadowRoot!);
        if (!mounted) {
          this.mount?.();
        }
        currentComponentInstanceRendering = undefined;
      });
      if (typeof onConnected === 'function') {
        onConnected(this);
      }
    }

    attributeChangedCallback(name: K, oldValue: string, newValue: string) {
      if (this.signals && oldValue !== newValue && this.signals[name]) {
        this.signals[name].value = newValue;
      }
    }

    disconnectedCallback() {
      this._effect?.();
      this.unmount?.();
    }
  };
}
