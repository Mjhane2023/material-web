/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Card} from './lib/card.js';
// import {styles} from './lib/card-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCard;
  }
}

/**
 * @summary
 *
 * @description
 *
 * @final
 * @suppress {visibility} ?
 */
@customElement('md-card')
export class MdCard extends Card {
  // static override styles = [styles];
}
