/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {LinearProgressHarness} from './harness.js';
import {MdLinearProgress} from './linear-progress.js';

interface LinearProgressTestProps {
  progress: number;
  buffer: number;
}

function getLinearProgressTemplate(props?: LinearProgressTestProps) {
  return html`
    <md-linear-progress
      .progress=${props?.progress ?? 0}
      .buffer=${props?.buffer ?? 0}
    ></md-linear-progress>`;
}

describe('<md-linear-progress>', () => {
  const env = new Environment();

  async function setupTest(
      props?: LinearProgressTestProps, template = getLinearProgressTemplate) {
    const root = env.render(template(props));
    await env.waitForStability();
    const progress =
        root.querySelector<MdLinearProgress>('md-linear-progress')!;
    const harness = new LinearProgressHarness(progress);
    return {harness, root};
  }

  describe('.styles', () => {
    createTokenTests(MdLinearProgress.styles);
  });

  describe('basic', () => {
    it('initializes as an md-linear-progress', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdLinearProgress);
    });
  });

  describe('properties', () => {
    it('gets/sets progress', async () => {
      const {harness} = await setupTest();
      harness.element.progress = 0.3;
      await harness.element.updateComplete;
      expect(harness.element.progress).toEqual(0.3);
    });

    it('gets/sets buffer', async () => {
      const {harness} = await setupTest();
      harness.element.buffer = 0.4;
      await harness.element.updateComplete;
      expect(harness.element.buffer).toEqual(0.4);
    });

    it('gets/sets indeterminate', async () => {
      const {harness} = await setupTest();
      harness.element.indeterminate = true;
      await harness.element.updateComplete;
      expect(harness.element.indeterminate).toEqual(true);
    });

  });
});
