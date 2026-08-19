import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fluidBackgroundAttr, shouldStartFluid } from './fluid-control.ts';

describe('shouldStartFluid', () => {
  test('returns false when backgroundEnabled is false', () => {
    assert.equal(
      shouldStartFluid({ backgroundEnabled: false, reducedMotion: false }),
      false
    );
  });

  test('returns false when reducedMotion is true', () => {
    assert.equal(
      shouldStartFluid({ backgroundEnabled: true, reducedMotion: true }),
      false
    );
  });

  test('returns false when background is off and motion is reduced', () => {
    assert.equal(
      shouldStartFluid({ backgroundEnabled: false, reducedMotion: true }),
      false
    );
  });

  test('returns true only when background is on and motion is allowed', () => {
    assert.equal(
      shouldStartFluid({ backgroundEnabled: true, reducedMotion: false }),
      true
    );
  });
});

describe('fluidBackgroundAttr', () => {
  test('is off on both false branches', () => {
    assert.equal(
      fluidBackgroundAttr({ backgroundEnabled: false, reducedMotion: false }),
      'off'
    );
    assert.equal(
      fluidBackgroundAttr({ backgroundEnabled: true, reducedMotion: true }),
      'off'
    );
  });

  test('is on when the fluid should start', () => {
    assert.equal(
      fluidBackgroundAttr({ backgroundEnabled: true, reducedMotion: false }),
      'on'
    );
  });
});
