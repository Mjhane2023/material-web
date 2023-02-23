/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './tab.js';

import {customElement} from 'lit/decorators.js';

import {TabList} from './lib/tablist.js';
import {styles} from './lib/tablist-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tablist': MdTabList;
  }
}

/**
 * @summary TabList displays a list of selectable tabs.
 *
 */
@customElement('md-tablist')
export class MdTabList extends TabList {
  static override styles = [styles];
}
