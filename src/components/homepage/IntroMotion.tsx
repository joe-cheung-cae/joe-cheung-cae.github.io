import { useEffect } from 'preact/hooks';
import {
  completeTransition,
  initialTransitionState,
  isSwipeUp,
  isWheelDown,
  nextTransitionState,
  shouldAcceptTrigger,
  TRANSITION_DURATION_MS,
  transitionDurationMs,
  type PageTransitionState,
} from '@/lib/page-transition';

const SWIPE_MIN_PX = 48;
const INTRO_EASE = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function setTransition(root: HTMLElement, state: PageTransitionState) {
  root.setAttribute('data-page-transition', state);
}

function animateIntro(intro: HTMLElement, shape: SVGElement | null) {
  intro.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-200vh)' }], {
    duration: TRANSITION_DURATION_MS,
    easing: INTRO_EASE,
    fill: 'forwards',
  });

  if (!shape) return;
  shape.style.transformOrigin = '50% 0%';
  shape.animate(
    [
      { transform: 'scaleY(0.8)', easing: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)' },
      { transform: 'scaleY(1.8)', offset: 0.5, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
      { transform: 'scaleY(1)' },
    ],
    {
      duration: TRANSITION_DURATION_MS,
      fill: 'forwards',
    }
  );
}

/**
 * Homepage-only island. One-shot enter / wheel-down / swipe-up.
 * Path `d` morph is skipped: WAAPI cannot interpolate path data.
 */
export default function IntroMotion() {
  useEffect(() => {
    const root = document.getElementById('homepage');
    if (!root) return;

    const reducedMotion = prefersReducedMotion();
    let state: PageTransitionState = initialTransitionState(reducedMotion);
    let settled = false;
    let touchStartY = 0;
    let settleTimer = 0;
    const gestureAbort = new AbortController();
    const { signal } = gestureAbort;
    setTransition(root, state);

    if (state !== 'intro') {
      return;
    }

    const intro = root.querySelector<HTMLElement>('.homepage-intro');
    const shape = root.querySelector<SVGElement>('.homepage-intro .shape');
    const triggers = root.querySelectorAll<HTMLElement>('[data-homepage-enter]');

    const settle = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(settleTimer);
      state = completeTransition(state);
      setTransition(root, state);
      gestureAbort.abort();
    };

    const loadAll = () => {
      if (!shouldAcceptTrigger(state)) return;
      const next = nextTransitionState({ current: state, reducedMotion });
      state = next;
      setTransition(root, next);
      if (next === 'main') {
        settle();
        return;
      }
      if (intro) {
        animateIntro(intro, shape);
      }
      settleTimer = window.setTimeout(settle, transitionDurationMs(reducedMotion));
    };

    const onWheel = (event: WheelEvent) => {
      if (isWheelDown(event.deltaY)) loadAll();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.pageY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.pageY ?? touchStartY;
      if (isSwipeUp(touchStartY, endY) && touchStartY - endY >= SWIPE_MIN_PX) {
        loadAll();
      }
    };

    triggers.forEach((node) => node.addEventListener('click', loadAll, { signal }));
    window.addEventListener('wheel', onWheel, { passive: true, signal });
    window.addEventListener('touchstart', onTouchStart, { passive: true, signal });
    window.addEventListener('touchend', onTouchEnd, { passive: true, signal });

    return () => {
      window.clearTimeout(settleTimer);
      gestureAbort.abort();
    };
  }, []);

  return null;
}
