import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  completeTransition,
  initialTransitionState,
  isIntroActive,
  isSwipeUp,
  isTransitionLocked,
  isWheelDown,
  nextTransitionState,
  shouldAcceptTrigger,
  shouldSkipMorph,
  TRANSITION_DURATION_MS,
  transitionDurationMs,
} from './page-transition.ts';

describe('intro activity', () => {
  test('isIntroActive is true only for intro', () => {
    assert.equal(isIntroActive('intro'), true);
    assert.equal(isIntroActive('busy'), false);
    assert.equal(isIntroActive('main'), false);
  });

  test('locks further triggers after intro', () => {
    assert.equal(isTransitionLocked('intro'), false);
    assert.equal(isTransitionLocked('busy'), true);
    assert.equal(isTransitionLocked('main'), true);
    assert.equal(shouldAcceptTrigger('intro'), true);
    assert.equal(shouldAcceptTrigger('busy'), false);
    assert.equal(shouldAcceptTrigger('main'), false);
  });
});

describe('reduced-motion skip', () => {
  test('skips the morph and starts on main', () => {
    assert.equal(shouldSkipMorph(true), true);
    assert.equal(shouldSkipMorph(false), false);
    assert.equal(initialTransitionState(true), 'main');
    assert.equal(initialTransitionState(false), 'intro');
    assert.equal(transitionDurationMs(true), 0);
    assert.equal(transitionDurationMs(false), TRANSITION_DURATION_MS);
  });

  test('jumps intro to main without a busy phase', () => {
    assert.equal(
      nextTransitionState({ current: 'intro', reducedMotion: true }),
      'main'
    );
  });
});

describe('nextTransitionState', () => {
  test('advances intro to busy when motion is allowed', () => {
    assert.equal(
      nextTransitionState({ current: 'intro', reducedMotion: false }),
      'busy'
    );
  });

  test('is one-shot after busy or main', () => {
    assert.equal(
      nextTransitionState({ current: 'busy', reducedMotion: false }),
      'busy'
    );
    assert.equal(
      nextTransitionState({ current: 'main', reducedMotion: false }),
      'main'
    );
    assert.equal(
      nextTransitionState({ current: 'main', reducedMotion: true }),
      'main'
    );
  });

  test('settles busy onto main', () => {
    assert.equal(completeTransition('busy'), 'main');
    assert.equal(completeTransition('intro'), 'intro');
    assert.equal(completeTransition('main'), 'main');
  });
});

describe('enter gestures', () => {
  test('wheel down is deltaY greater than zero', () => {
    assert.equal(isWheelDown(1), true);
    assert.equal(isWheelDown(0), false);
    assert.equal(isWheelDown(-8), false);
  });

  test('swipe up is a decreasing Y', () => {
    assert.equal(isSwipeUp(200, 40), true);
    assert.equal(isSwipeUp(40, 200), false);
    assert.equal(isSwipeUp(100, 100), false);
  });
});
