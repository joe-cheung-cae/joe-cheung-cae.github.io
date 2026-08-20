import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

function readRepo(relativePath: string): string {
  const absolute = join(repoRoot, relativePath);
  assert.equal(existsSync(absolute), true, `${relativePath} must exist`);
  return readFileSync(absolute, 'utf8');
}

describe('license and documentation provenance', () => {
  test('root LICENSE is non-empty and package.json.license matches it', () => {
    const licenseText = readRepo('LICENSE');
    assert.ok(licenseText.trim().length > 0, 'LICENSE must be non-empty');

    const pkg = JSON.parse(readRepo('package.json')) as { license?: unknown };
    assert.equal(typeof pkg.license, 'string');
    const spdx = pkg.license as string;
    assert.ok(spdx.length > 0, 'package.json.license must be set');

    const declared = licenseText.match(/SPDX-License-Identifier:\s*(\S+)/);
    assert.ok(declared, 'LICENSE must declare SPDX-License-Identifier');
    assert.equal(
      spdx,
      declared[1],
      'package.json.license must match LICENSE SPDX-License-Identifier'
    );
    assert.match(
      spdx,
      /LGPL-3\.0/,
      'repo SPDX must remain LGPL-3.0 for SimonAKing-derived portions'
    );
    assert.match(licenseText, /GNU LESSER GENERAL PUBLIC LICENSE/);
    assert.match(licenseText, /Version 3/);
  });

  test('COPYING accompanies LGPL with GNU GPL v3 text', () => {
    const copying = readRepo('COPYING');
    assert.ok(copying.trim().length > 0, 'COPYING must be non-empty');
    assert.match(copying, /GNU GENERAL PUBLIC LICENSE/);
    assert.match(copying, /Version 3/);
  });

  test('NOTICE names SimonAKing/HomePage as LGPL-3.0 and Pavel fluid as MIT', () => {
    const notice = readRepo('NOTICE');
    const readme = readRepo('README.md');
    const provenance = `${notice}\n${readme}`;

    assert.match(provenance, /SimonAKing\/HomePage/);
    assert.match(
      notice,
      /SimonAKing\/HomePage[\s\S]{0,500}LGPL-3\.0/,
      'NOTICE must name SimonAKing/HomePage with LGPL-3.0'
    );
    assert.match(provenance, /PavelDoGreat\/WebGL-Fluid-Simulation|WebGL-Fluid-Simulation|Pavel Dobryakov/);
    assert.match(
      notice,
      /(?:Pavel Dobryakov|WebGL-Fluid-Simulation)[\s\S]{0,500}\bMIT\b/,
      'NOTICE must name Pavel/WebGL-Fluid with MIT'
    );
    assert.match(notice, /Maple Mono NF CN/);
    assert.match(notice, /subframe7536\/maple-font/);
    assert.match(notice, /OFL-1\.1|SIL Open Font License 1\.1/);
    assert.match(notice, /MapleMono-NF-CN\.zip/);
  });

  test('vendored fluid script keeps the Pavel MIT copyright header', () => {
    const fluid = readRepo('src/scripts/webgl-fluid.js');
    assert.match(fluid, /MIT License/);
    assert.match(fluid, /Copyright \(c\) 2017 Pavel Dobryakov/);
  });

  test('README names the license and the current site', () => {
    const readme = readRepo('README.md');
    assert.match(readme, /LICENSE/);
    assert.match(readme, /LGPL-3\.0/);
    assert.match(readme, /https:\/\/joe-cheung-cae\.github\.io\//);
    assert.match(readme, /Astro/);
    assert.match(readme, /Tailwind/);
    assert.match(readme, /MDX/);
    assert.match(readme, /Preact/);
    assert.match(readme, /MiniSearch/);
  });
});
