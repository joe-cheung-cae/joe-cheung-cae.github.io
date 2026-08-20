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

function ignoreLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

function ignoresGrokWorkflows(lines: readonly string[]): boolean {
  return lines.some(
    (line) =>
      line === '.grok' ||
      line === '.grok/' ||
      line === '.grok/**' ||
      line === '.grok/workflows' ||
      line === '.grok/workflows/' ||
      line === '.grok/workflows/**' ||
      line === '.grok/workflows/*.rhai'
  );
}

describe('ignore rules for local Grok workflows', () => {
  test('gitignore and dockerignore both exclude .grok/workflows', () => {
    const gitignore = ignoreLines(readRepo('.gitignore'));
    const dockerignore = ignoreLines(readRepo('.dockerignore'));

    assert.equal(
      ignoresGrokWorkflows(gitignore),
      true,
      '.gitignore must ignore .grok/workflows (local .rhai orchestration)'
    );
    assert.equal(
      ignoresGrokWorkflows(dockerignore),
      true,
      '.dockerignore must ignore .grok/workflows (keep in sync with .gitignore)'
    );
  });

  test('git-workflow rule tells agents not to commit those scripts', () => {
    const rule = readRepo('.claude/rules/git-workflow.md');
    assert.match(rule, /\.grok\/workflows/);
    assert.match(rule, /do not commit/i);
  });
});
