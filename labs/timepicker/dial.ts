/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {TimePickerDial} from './lib/time-picker-dial.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-time-picker-dial': MdTimePickerDial;
  }
}

/**
 * @summary Time pickers help users select and set a specific time
 *
 * @description
 * Input types are flexible in order to account for a range of use cases and contexts
 * Time can be selected without significant adjustment of one’s hand position on a mobile device
 *
 * @final
 * @suppress {visibility}
 */

@customElement('md-time-picker-dial')
export class MdTimePickerDial extends TimePickerDial {
  
}
