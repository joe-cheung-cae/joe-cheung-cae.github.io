import { useEffect } from 'preact/hooks';
import {
  fluidBackgroundAttr,
  shouldStartFluid,
} from '@/lib/fluid-control';

type Props = {
  backgroundEnabled: boolean;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function homepageRoot(): HTMLElement | null {
  return document.getElementById('homepage');
}

function applyFluidAttr(backgroundEnabled: boolean, reducedMotion: boolean) {
  const root = homepageRoot();
  if (!root) return;
  root.setAttribute(
    'data-fluid-background',
    fluidBackgroundAttr({ backgroundEnabled, reducedMotion })
  );
}

/**
 * Homepage-only island. Dynamically imports the sim after shouldStartFluid.
 * Do not mount this on inner routes or from BaseLayout.
 */
export default function FluidBackground({ backgroundEnabled }: Props) {
  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    applyFluidAttr(backgroundEnabled, reducedMotion);

    if (!shouldStartFluid({ backgroundEnabled, reducedMotion })) {
      return;
    }

    const rootForCanvas = homepageRoot();
    let canvas = document.getElementById('background');
    if (!(canvas instanceof HTMLCanvasElement) && rootForCanvas) {
      const intro = rootForCanvas.querySelector('.homepage-intro') || rootForCanvas;
      canvas = document.createElement('canvas');
      canvas.id = 'background';
      canvas.setAttribute('aria-hidden', 'true');
      intro.insertBefore(canvas, intro.firstChild);
    }
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    let cancelled = false;
    let stopSim = () => {};

    const stop = () => {
      stopSim();
    };

    const root = homepageRoot();
    const observer = root
      ? new MutationObserver(() => {
          if (root.getAttribute('data-page-transition') === 'main') {
            stop();
          }
        })
      : null;
    if (root && observer) {
      observer.observe(root, {
        attributes: true,
        attributeFilter: ['data-page-transition'],
      });
    }

    window.addEventListener('pagehide', stop);
    document.addEventListener('astro:before-swap', stop);

    void import('@/scripts/webgl-fluid.js').then((mod) => {
      if (cancelled) return;
      stopSim = mod.stopFluid;
      mod.startFluid(canvas);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener('pagehide', stop);
      document.removeEventListener('astro:before-swap', stop);
      stop();
    };
  }, [backgroundEnabled]);

  return null;
}
