/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing} from 'lit';

import '../divider/divider.js'
import '../elevation/elevation.js'
import { property } from 'lit/decorators.js';

/**
 * m3 (for now) ish card implementation
 * 
 * @example
 * html```
 * <md-card type="filled"></md-card> // default is elevated
 * ```
 */
export class Card extends LitElement {
  dividerType: 'full' | 'inset' | 'middle-inset' // todo: md-divider

  @property({ type: String, reflect: true })
  type: 'elevated' | 'filled' | 'outlined' = 'elevated'

  constructor() {
    super()
  }
  
  renderDivider() {
    const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]')
    // @ts-ignore
    const children = Array.from(actionsSlot?.assignedNodes() || [])
    return children.length !== 0 ? 
        html`<md-divider></md-divider>` :
        nothing;
  }

  override render() {
    return html`
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 8px;
          position: relative;
        }

        .container {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border: 1px solid;
          padding: 16px;
          border-radius: 12px;
          max-width: 320px;
          height: 100%;
          max-height: 320px;
          border-color: transparent;
          color: var(--md-sys-color-on-surface-variant);
          background: var(--md-sys-color-surface-variant);
          position: relative;
        }

        md-elevation {
          --md-elevation-level: 1;
        }

        :host() :slotted(*) {
          font-family: var(--md-sys-typescale-display-small-font-family-name);
          font-weight: var(--md-sys-typescale-display-small-font-family-style);
        }

        slot[name="headline"]::slotted(*) {
          font-weight: var(--md-sys-typescale-headline-large-font-weight);
          font-size: var(--md-sys-typescale-headline-large-font-size);
          line-height: var(--md-sys-typescale-headline-large-line-height);
          letter-spacing: var(--md-sys-typescale-headline-large-letter-spacing);
        
        }

        slot[name="subline"]::slotted(*) {
          font-weight: var(--md-sys-typescale-title-large-font-weight);
          font-size: var(--md-sys-typescale-title-large-font-size);

          line-height: var(--md-sys-typescale-title-large-line-height);
          letter-spacing: var(--md-sys-typescale-title-large-letter-spacing);
        }

        slot[name="supportingText"]::slotted(*) {
          margin: 8px 0 0 0;
          font-weight: var(--md-sys-typescale-body-medium-font-weight);
          font-size: var(--md-sys-typescale-body-medium-font-size);

          line-height: var(--md-sys-typescale-body-medium-line-height);
          letter-spacing: var(--md-sys-typescale-body-medium-letter-spacing);
        }

        .supporting-text {
          max-height: 196px;
          overflow-y: scroll;
        }

        :host([type="filled"]) .container {
          color: var(--md-sys-color-on-secondary-container);
          background: var(--md-sys-color-secondary-container);
        }

        :host([type="outlined"]) .container {
          color: var(--md-sys-color-on-surface);
          background: var(--md-sys-color-surface);
          border-color: var(--md-sys-color-outline);
        }

        :host([type="filled"]) md-elevation {
          --md-elevation-level: 0;
        }

        :host([type="outlined"]) md-elevation {
          --md-elevation-level: 0;
        }

        .actions {
          height: 44px;
        }
        
      </style>
      <span class="container">
        <md-elevation></md-elevation>
        <!-- todo: no padding ... -->
        <slot name="image"></slot>
        <slot name="headline"></slot>
        <slot name="subline"></slot>
        <span class="supporting-text">
          <slot name="supportingText"></slot>
        </span>
        ${this.renderDivider()}
        <span class="actions">
          <slot name="actions"></slot>
        </span>
      </span>
    `
  }
}