export type FluidStartInput = {
  backgroundEnabled: boolean;
  reducedMotion: boolean;
};

export type FluidBackgroundAttr = 'on' | 'off';

export function shouldStartFluid({
  backgroundEnabled,
  reducedMotion,
}: FluidStartInput): boolean {
  return backgroundEnabled && !reducedMotion;
}

/** `data-fluid-background` reflects this decision, not WebGL success. */
export function fluidBackgroundAttr(input: FluidStartInput): FluidBackgroundAttr {
  return shouldStartFluid(input) ? 'on' : 'off';
}
