export const PAGE_TRANSITION_STATES = ['intro', 'busy', 'main'] as const;
export type PageTransitionState = (typeof PAGE_TRANSITION_STATES)[number];

/** Template switchPage duration. Path `d` morph is not a WAAPI given and is skipped. */
export const TRANSITION_DURATION_MS = 1100;

export type TransitionAdvanceInput = {
  current: PageTransitionState;
  reducedMotion: boolean;
};

export function isIntroActive(state: PageTransitionState): boolean {
  return state === 'intro';
}

export function isTransitionLocked(state: PageTransitionState): boolean {
  return state !== 'intro';
}

export function shouldSkipMorph(reducedMotion: boolean): boolean {
  return reducedMotion;
}

export function initialTransitionState(reducedMotion: boolean): PageTransitionState {
  return shouldSkipMorph(reducedMotion) ? 'main' : 'intro';
}

export function transitionDurationMs(reducedMotion: boolean): number {
  return shouldSkipMorph(reducedMotion) ? 0 : TRANSITION_DURATION_MS;
}

/** One-shot: only intro accepts a trigger. Reduced motion jumps to main. */
export function nextTransitionState({
  current,
  reducedMotion,
}: TransitionAdvanceInput): PageTransitionState {
  if (!isIntroActive(current)) {
    return current;
  }

  if (shouldSkipMorph(reducedMotion)) {
    return 'main';
  }

  return 'busy';
}

export function completeTransition(state: PageTransitionState): PageTransitionState {
  return state === 'busy' ? 'main' : state;
}

export function shouldAcceptTrigger(state: PageTransitionState): boolean {
  return isIntroActive(state);
}

export function isWheelDown(deltaY: number): boolean {
  return deltaY > 0;
}

export function isSwipeUp(startY: number, endY: number): boolean {
  return startY > endY;
}
