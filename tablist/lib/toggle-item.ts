/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';

import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';
import {ARIAHasPopup} from '../../types/aria.js';


/**
 * An element that can select items.
 */
export interface SelectionGroupElement extends HTMLElement {
  selected?: number;
  selectedItem?: ToggleItem;
  previousSelectedItem?: ToggleItem;
}

// This is required for decorators.
// tslint:disable:no-new-decorators

/**
 * A base class for items that render buttons and are selectable.
 */
export class ToggleItem extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: String, attribute: 'data-aria-has-popup', noAccessor: true})
  @ariaProperty
  override ariaHasPopup!: ARIAHasPopup;

  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty
  override ariaLabel!: string;

  /**
   * Styling variant to display; defaults to `primary`.
   */
  @property({reflect: true}) variant = 'primary';

  /**
   * Whether or not the item is `disabled`.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether is not the item is `selected`.
   **/
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * Set to render a link with the given url.
   */
  @property() href = '';

  /**
   * When `href` is set, the link target
   */
  @property() target?: string;

  @query('.button') protected buttonElement!: HTMLElement;

  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;

  // note, this is public so it can participate in selection animation.
  /**
   * Selection indicator element.
   */
  @query('.indicator') indicator!: HTMLElement;

  @state() protected focusRingRequested = false;
  @state() protected showFocusRing = false;
  @state() protected rippleRequested = false;

  // whether or not selection state can be animated; used to avoid initial
  // animation and becomes true one task after first update.
  private canAnimate = false;

  constructor() {
    super();
    this.addEventListener('click', (event: MouseEvent) => {
      if (!isActivationClick((event))) {
        return;
      }
      this.focus();
      dispatchActivationClick(this.buttonElement);
    });
  }

  override focus() {
    this.buttonElement.focus();
  }

  override blur() {
    this.buttonElement.blur();
  }

  protected readonly getRipple = () => {
    this.rippleRequested = true;
    return this.ripple;
  };

  protected override async firstUpdated() {
    await new Promise(requestAnimationFrame);
    this.canAnimate = true;
  }

  protected override willUpdate(changed: PropertyValues) {
    // makes focus ring lazy until needed.
    if (changed.has('showFocusRing')) {
      this.focusRingRequested ||= this.showFocusRing;
    }
  }

  protected shouldAnimate() {
    return this.canAnimate && !this.disabled &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has('selected') && this.shouldAnimate()) {
      this.animateSelected();
    }
  }

  /**
   * Implement to animate selection state.
   */
  protected animateSelected() {}

  protected override render(): TemplateResult {
    return this.href ? this.renderLink() : this.renderButton();
  }

  protected renderButton(): TemplateResult {
    return html`
      <button
        class="button md3-button"
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        aria-haspopup=${this.ariaHasPopup || nothing}
        @pointerdown=${this.handleDown}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        ${ripple(this.getRipple)}
      >
        ${this.renderContent()}
      </button>`;
  }

  protected renderLink(): TemplateResult {
    return html`
      <a
        .href=${this.href}
        .target=${this.target || nothing}
        class="button md3-button"
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        aria-haspopup=${this.ariaHasPopup || nothing}
        @pointerdown=${this.handleDown}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        ${ripple(this.getRipple)}
      >
        ${this.renderContent()}
      </a>`;
  }

  protected renderContent() {
    return html`
      ${this.renderDecorations()}
      <div class="content">
        ${this.renderStart()}
        ${this.renderMiddle()}
        ${this.renderEnd()}
        ${this.renderIndicator()}
      </div>`;
  }

  protected renderDecorations() {
    return html`
      ${when(this.focusRingRequested, this.renderFocusRing)}
      ${this.renderElevation()}
      ${when(this.rippleRequested, this.renderRipple)}
      ${this.renderOutline()}
      ${this.renderTouchTarget()}  
    `;
  }

  protected renderTouchTarget() {
    return html`<span class="touch"></span>`;
  }

  protected renderElevation() {
    return html`<md-elevation shadow surface></md-elevation>`;
  }

  protected renderRipple = () => {
    return html`<md-ripple ?disabled="${this.disabled}"></md-ripple>`;
  };

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderFocusRing =
      () => {
        return html`<md-focus-ring .visible="${
            this.showFocusRing}"></md-focus-ring>`;
      };

  protected renderMiddle() {
    return html`<span class="middle"><slot></slot></span>`;
  }

  protected renderStart() {
    return html`<slot name="start"></slot>`;
  }

  protected renderEnd() {
    return html`<slot name="end"></slot>`;
  }

  protected renderIndicator() {
    return html`<div class="indicator ${
        this.selected ? 'showing' : 'hidden'}"></div>`;
  }

  protected get selectionGroup() {
    return this.parentElement as SelectionGroupElement;
  }

  protected handleDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
