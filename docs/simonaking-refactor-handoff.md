# SimonAKing homepage refactor — handoff

Status document. Each serial phase updates this file, then the parent commits.

| Field | Value |
| --- | --- |
| Branch | `refactor` at `18f18a7` (from clean `main` `51f2ef8`) |
| Current phase | **评审 — done** |
| Next phase | 归档 |
| Site identity | Joe Cheung · CAE & HPC Engineer (not SimonAKing) |
| Workflow | `.grok/workflows/homepage-refactor.rhai` (**exists**) |
| Breakdown | `docs/simonaking-refactor-breakdown.md` |
| Review | `docs/simonaking-refactor-review.md` (**PASS WITH REQUIRED EDITS**) |
| Thinking roles | grok-46-high (需求拆解 / 评审 / 开发), grok-46-low (归档), grok-46-medium (测试 / 上线) |
| UI this phase | **None.** Review only. |

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

### 2. 评审 — done

Adversarial review of the breakdown against current `src/`, `e2e/`, `package.json`, leftover `design-upgrade` / stash / `gh-pages`, and SimonAKing/HomePage sources. Wrote `docs/simonaking-refactor-review.md`. No homepage UI implemented.

**Findings summary**

| Requirement | Result |
| --- | --- |
| Joe Cheung identity; no `supportAuthor` / Simon avatar | **PASS** |
| PavelDoGreat fluid, toggleable; wrap IIFE so import is inert | **PASS (lock wrap + test split)** |
| Reduced-motion turns fluid off and skips 1100ms morph | **PASS** |
| Notes / search / projects reachable; MDX + `projects.ts` untouched | **PASS (lock chrome)** |
| Real featured-notes region **or** spec update | **FAIL as written** — current spec is a false green if Start Here is missing; 归档 must keep the region **and** strengthen the spec |
| Intro `#search-trigger` **or** search spec update | **FAIL as written** — lock intro chrome + mounted `SearchModal`; do not require enter first |
| No design-upgrade CSS-only `.hero-grid` / “no canvas” contract | **PASS** — do not port `e2e/reduced-motion-hero.spec.ts` |
| No Vue / Pug / Gulp | **PASS** |
| 上线 `npm run deploy:github` / `gh-pages`, not Docker | **PASS** |
| Snake `GridAnimation` | **PASS — stays out** (评审 does not add it) |
| Workflow serial driver | **PASS** |

Compile-time `intro.background === false` is **not** a single-`dist` Playwright case. Unit-test `shouldStartFluid`; e2e “off” is `prefers-reduced-motion: reduce`.

**What changed this phase**

- Added `docs/simonaking-refactor-review.md` (pass/fail table, findings F1–F10, required edits before 开发).
- Updated this handoff: 评审 = done; 归档 is next; lock list below.
- Did **not** edit `src/pages/index.astro` or any runtime UI.
- Did **not** merge `design-upgrade` or apply `stash@{0}`.

## Next phase must (归档)

Freeze the agreed plan into **this** handoff (minimal edits, no new design). Mark 需求拆解 / 评审 / 归档 done and 开发 next.

### What 归档 must lock

1. **Identity.** `homepage.config` head/intro/main from `siteConfig` (Joe Cheung, role/roleZh, email, github). Forbidden: `supportAuthor`, Simon avatar/title/subtitle/signature, GitHub-corner, `log.min.js`. Favicon `/favicon.svg`. Avatar field unset.
2. **Fluid on/off.** `shouldStartFluid({backgroundEnabled, reducedMotion}) === backgroundEnabled && !reducedMotion`. Default `intro.background: true`. Vendor PavelDoGreat as `src/scripts/webgl-fluid.js` (MIT Pavel Dobryakov header, inert import, `startFluid`/`stopFluid`). Homepage-only. `data-fluid-background=on|off` on a homepage wrapper. Unit-test both false branches. E2E off-path = reduced-motion (not a second production build).
3. **Intro chrome.** First paint of `/`: exactly one `#search-trigger` + mounted `SearchModal` + Lang/Theme toggles. Do not update search specs to click enter first. Do not ship two `#search-trigger` ids.
4. **Featured notes.** Keep Start Here (`Card.astro` `article` → one non-empty `a`) on `/` in the DOM (`#featured-notes` recommended). Heading accessible name stays `Start Here`. 测试 strengthens `card-link-structure` to attached region + `article a` count ≥ 1. Selected work + latest notes stay on main; Focus cards drop.
5. **Transition.** `data-page-transition=intro|main|busy` on the homepage wrapper. Enter click / wheel down / swipe-up; one-shot; ~1100ms when motion allowed; reduced-motion skips morph and does not start fluid. `ClientRouter` re-added cleanly in `BaseLayout`; Header search rebind on `astro:page-load`. No `GridAnimation` / `#gridCanvas`. Path morph: WAAPI `translateY` required; anime.js only if npm/vendored (no jsDelivr).
6. **Files.** Add/edit/do-not-touch as breakdown §9, plus prefer `.js` for the sim. Do not rewrite MDX bodies or `src/data/projects.ts` semantics. Drop `.hero-grid` as the homepage background.
7. **Leftovers.** `design-upgrade` 9 commits, `stash@{0}`, `origin/gh-pages` stay unmixed. Do not port `reduced-motion-hero.spec.ts`.
8. **E2E / 上线.** `test:e2e` added in 测试. Dual `npm run build`. 上线 is `npm run deploy:github` (`gh-pages`), not Docker, not merge to `main`.
9. **390px.** Intro shows name + enter; after enter, name/signature + Blog/About/Email/GitHub visible without the hamburger.
10. **Next 开发 steps.** config → fluid → homepage → transitions (workflow order).
11. **测试-only env.** If Playwright cannot reach `:4321`, add a localhost `NO_PROXY` bypass in `playwright.config.ts`. Do not apply `stash@{0}`.
