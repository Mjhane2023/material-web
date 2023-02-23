/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ToggleItem} from './toggle-item.js';

const hidden: Keyframe = {
  'opacity': 0,
  'transform': 'none'
};

const showing: Keyframe = {
  'transform': 'none',
  'opacity': 1
};

const scaled: Keyframe = {
  'transform': 'scaleX(0.5)'
};

/**
 * Tab component.
 */
export class Tab extends ToggleItem {
  protected getKeyframes() {
    const selected = showing;
    let unselected: Keyframe = hidden;
    if (this.variant.includes('navigation')) {
      unselected = {...unselected, ...scaled};
    } else {
      if (this.selected) {
        const isVertical = this.variant.includes('vertical');
        const fromRect =
            (this.selectionGroup?.previousSelectedItem?.indicator
                 .getBoundingClientRect() ??
             ({} as DOMRect));
        const fromPos = isVertical ? fromRect.top : fromRect.left;
        const fromExtent = isVertical ? fromRect.height : fromRect.width;
        if (fromPos !== undefined) {
          const toRect = this.indicator.getBoundingClientRect();
          const toPos = isVertical ? toRect.top : toRect.left;
          const toExtent = isVertical ? toRect.height : toRect.width;
          const axis = isVertical ? 'Y' : 'X';
          unselected = {
            'transform': `translate${axis}(${fromPos - toPos}px)
            scale${axis}(${fromExtent / toExtent})`
          };
        }
      } else {
        return null;
      }
    }
    return this.selected ? [unselected, selected] : [selected, unselected];
  }

  protected override animateSelected() {
    this.indicator.getAnimations().forEach(a => {
      a.cancel();
    });
    const frames = this.getKeyframes();
    if (frames !== null) {
      this.indicator.animate(frames, {duration: 400, easing: 'ease-out'});
    }
  }
}
