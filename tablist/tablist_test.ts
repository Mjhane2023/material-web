/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {TabListHarness} from './harness.js';
import {MdTab} from './tab.js';
import {MdTabList} from './tablist.js';

interface TabListTestProps {
  selected?: number;
}

function getTabListTemplate(props?: TabListTestProps) {
  return html`
    <md-tablist
      .selected=${props?.selected ?? 0}
    >
      <md-tab>A</md-tab>
      <md-tab>B</md-tab>
      <md-tab>C</md-tab>
    </md-tablist>`;
}

describe('<md-tablist>', () => {
  const env = new Environment();

  async function setupTest(
      props?: TabListTestProps, template = getTabListTemplate) {
    const root = env.render(template(props));
    await env.waitForStability();
    // ensure advance beyond RAF
    jasmine.clock().tick(1000);
    const tab = root.querySelector<MdTabList>('md-tablist')!;
    const harness = new TabListHarness(tab);
    return {harness, root};
  }

  describe('.styles', () => {
    createTokenTests(MdTabList.styles);
    createTokenTests(MdTab.styles);
  });

  describe('basic', () => {
    it('initializes as an md-tablist and md-tab', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdTabList);
      expect(harness.harnessedItems.length).toBe(3);
      harness.harnessedItems.forEach(tabHarness => {
        expect(tabHarness.element).toBeInstanceOf(MdTab);
      });
    });
  });

  describe('properties', () => {
    it('selected', async () => {
      const {harness} = await setupTest({selected: 1});
      expect(harness.element.selected).toBe(1);
      expect(harness.element.selectedItem)
          .toBe(harness.harnessedItems[1].element);
      harness.harnessedItems.forEach(async (tabHarness, i) => {
        const shouldBeSelected = i === harness.element.selected;
        await tabHarness.element.updateComplete;
        expect(tabHarness.element.selected).toBe(shouldBeSelected);
        expect(await tabHarness.isIndicatorShowing()).toBe(shouldBeSelected);
      });
      harness.element.selected = 0;
      await harness.element.updateComplete;
      expect(harness.element.selected).toBe(0);
      harness.harnessedItems.forEach(async (tabHarness, i) => {
        const shouldBeSelected = i === harness.element.selected;
        await tabHarness.element.updateComplete;
        expect(tabHarness.element.selected).toBe(shouldBeSelected);
        expect(await tabHarness.isIndicatorShowing()).toBe(shouldBeSelected);
      });
    });

    it('selectedItem/previousSelectedItem', async () => {
      const {harness} = await setupTest({selected: 1});
      expect(harness.element.selectedItem)
          .toBe(harness.harnessedItems[1].element);
      expect(harness.element.previousSelectedItem)
          .toBe(harness.harnessedItems[0].element);
      harness.element.selected = 0;
      await harness.element.updateComplete;
      expect(harness.element.selectedItem)
          .toBe(harness.harnessedItems[0].element);
      expect(harness.element.previousSelectedItem)
          .toBe(harness.harnessedItems[1].element);
    });
  });
});