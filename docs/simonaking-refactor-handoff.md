# SimonAKing homepage refactor — handoff

Status document. Each serial phase updates this file, then the parent commits.

| Field | Value |
| --- | --- |
| Branch | `refactor` (from clean `main` `51f2ef8`) |
| Current phase | **需求拆解 — done** |
| Next phase | 评审 |
| Site identity | Joe Cheung · CAE & HPC Engineer (not SimonAKing) |
| Workflow | `.grok/workflows/homepage-refactor.rhai` (**exists**) |
| Breakdown | `docs/simonaking-refactor-breakdown.md` |
| Thinking roles | grok-46-high (需求拆解 / 评审 / 开发), grok-46-low (归档), grok-46-medium (测试 / 上线) |
| UI this phase | **None.** Mapping + leftovers only. |

## Leftover branches (not mixed into `refactor`)

| Branch / ref | vs `main` | Decision |
| --- | --- | --- |
| `design-upgrade` / `origin/design-upgrade` | **9 commits ahead** (CSS-only `.hero-grid`, ClientRouter, phases 1–6 of the superseded GROK_BUILD_PLAN contract) | **Not merged.** Visual contract superseded by SimonAKing WebGL fluid. |
| `stash@{0}` (`On design-upgrade`) | Dirty leftover files: `playwright.config.ts`, `src/components/search/SearchModal.tsx` | **Not applied.** Message: `wip: design-upgrade dirty files leftover, not mixed into refactor`. |
| `origin/gh-pages` | Deploy history (`26f30a6` latest) | **Not merged.** Production publish branch for `npm run deploy:github`. |
| `main` / `origin/main` | At `51f2ef8` | Root of `refactor`. |

`design-upgrade` SHAs (do not land here): `10bb216` `833e77f` `9eb99fa` `e3ca6f6` `727b66c` `e7191de` `402c2c1` `99b4393` `1bda8c4`.

## Phase log

### 0. Branch setup — done

Checked out `main`, listed branches, created `refactor` at the same commit as `main`. Working tree was clean. Uncommitted `design-upgrade` files were stashed, not carried over.

### 1. 需求拆解 — done

Mapped SimonAKing/HomePage defining mechanics onto this Astro homepage (config, PavelDoGreat fluid + reduced-motion, two-screen intro/main, 1100ms SVG/translateY transition, reachable inner routes). Confirmed `.grok/workflows/homepage-refactor.rhai` exists. Wrote `docs/simonaking-refactor-breakdown.md`. No homepage UI implemented.

**What changed this phase**

- Added/expanded `docs/simonaking-refactor-breakdown.md` (leftovers, Joe Cheung config shape, fluid start/stop, intro/main, transition, files, Playwright, dual build, Pages 上线).
- Updated this handoff: 需求拆解 = done; leftovers table includes the 9 unmerged commits, `gh-pages`, and stash dirty files.
- Did **not** edit `src/pages/index.astro` or any runtime UI.
- Did **not** merge `design-upgrade` or apply `stash@{0}`.

## Next phase must (评审)

Run **评审** against `docs/simonaking-refactor-breakdown.md` (read-only first). Adversarially check:

1. Identity stays Joe Cheung; no `supportAuthor` / Simon avatar.
2. Fluid is PavelDoGreat-class and toggleable; reduced-motion turns it off.
3. Notes / search / projects remain reachable; card-link-structure needs a real Start Here region **or** an explicit spec update.
4. Intro still exposes `#search-trigger` **or** search specs are updated in 测试.
5. No design-upgrade CSS-only hero-grid / “no canvas” contract.
6. 上线 is `npm run deploy:github` / `gh-pages`, not Docker.
7. Snake `GridAnimation` stays out unless 评审 adds it.

Write findings to `docs/simonaking-refactor-review.md` (pass/fail per requirement, required edits before 开发). Update this handoff: 评审 status, findings summary, what 归档 must lock. Do not implement UI.
