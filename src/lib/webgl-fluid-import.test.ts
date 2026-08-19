import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('webgl-fluid module', () => {
  test('import is inert and exports startFluid/stopFluid', async () => {
    const mod = await import('../scripts/webgl-fluid.js');
    assert.equal(typeof mod.startFluid, 'function');
    assert.equal(typeof mod.stopFluid, 'function');
    assert.doesNotThrow(() => {
      mod.stopFluid();
    });
  });

  test('startFluid is a no-op without a canvas', async () => {
    const mod = await import('../scripts/webgl-fluid.js');
    assert.doesNotThrow(() => {
      mod.startFluid(undefined as unknown as HTMLCanvasElement);
    });
  });
});
