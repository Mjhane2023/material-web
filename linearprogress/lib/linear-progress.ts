/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {ariaProperty} from '../../decorators/aria-property.js';

/**
 * LinearProgress component.
 */
export class LinearProgress extends LitElement {
  @query('.linear-progress') protected rootEl!: HTMLElement;

  /**
   * Whether or not to render indeterminate progress in an animated state.
   */
  @property({type: Boolean, reflect: true}) indeterminate = false;

  /**
   * Progress to display, a fraction between 0 and 1.
   */
  @property({type: Number}) progress = 0;

  /**
   * Buffer amount to display, a fraction between 0 and 1.
   */
  @property({type: Number}) buffer = 1;

  /**
   * Whether or not to render indeterminate mode using 4 colors instead of one.
   *
   */
  @property({type: Boolean, reflect: true}) fourColorActive = false;

  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  override ariaLabel!: string;

  @state() protected animationReady = true;
  protected resizeObserver: ResizeObserver|null = null;

  // Note, the indeterminate animation is rendered with transform %'s
  // Previously, this was optimized to use px calculated with the resizeObserver
  // due to a now fixed Chrome bug: crbug.com/389359.
  protected override render() {
    const classes = {
      'indeterminate': this.indeterminate,
      'animation-ready': this.animationReady,
      'four-color-active': this.fourColorActive
    };

    const rootStyles = {
      '--__progress': `${(this.indeterminate ? 1 : this.progress) * 100}%`,
      '--__buffer': `${(this.indeterminate ? 1 : this.buffer) * 100}%`
    };
    return html`
      <div
          role="progressbar"
          class="linear-progress ${classMap(classes)}"
          style=${styleMap(rootStyles)}
          aria-label="${this.ariaLabel || nothing}"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow="${this.indeterminate ? nothing : this.progress}">
        <div class="track"></div>
        <div class="buffer-bar"></div>
        <div class="bar primary-bar">
          <div class="bar-inner"></div>
        </div>
        <div class="bar secondary-bar">
          <div class="bar-inner"></div>
        </div>
      </div>`;
  }

  override async connectedCallback() {
    super.connectedCallback();
    // wait for rendering.
    await this.updateComplete;
    if (this.resizeObserver) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => {
      if (this.indeterminate) {
        this.restartAnimation();
      }
    });
    this.resizeObserver.observe(this.rootEl);
  }

  override disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    super.disconnectedCallback();
  }

  // When size changes, restart the animation
  // to avoid jank.
  protected async restartAnimation() {
    await this.updateComplete;
    this.animationReady = false;
    await new Promise(requestAnimationFrame);
    this.animationReady = true;
    await this.updateComplete;
  }
}