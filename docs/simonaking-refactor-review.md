# SimonAKing homepage refactor — 评审

Status: **done** (read-only review; no homepage UI).  
Verdict: **PASS WITH REQUIRED EDITS** — direction is correct; **开发 must not start** until 归档 freezes the locks in §4.  
Branch: `refactor` at `18f18a7` (docs-only, from `main` `51f2ef8`).  
Inputs: `docs/simonaking-refactor-breakdown.md`, current `src/` + `e2e/`, `.grok/workflows/homepage-refactor.rhai`, leftover `design-upgrade` / stash / `gh-pages`.  
Template facts re-checked against [SimonAKing/HomePage](https://github.com/SimonAKing/HomePage) (`config.json`, `src/js/{main,background}.js`, `src/components/scripts.pug`).

This document is the input to **归档**. It does not implement UI.

---

## 1. Verdict per requirement

| # | Requirement | Result | Why |
| --- | --- | --- | --- |
| 1 | Identity stays Joe Cheung; no `supportAuthor` / Simon avatar | **PASS** | `src/site.config.ts` is Joe Cheung / CAE & HPC. Breakdown config copies those fields, omits `supportAuthor`, leaves `avatar` unset, forbids `log.min.js` + GitHub-corner. Template `config.json` is Simon-only — do not copy values. |
| 2 | Fluid is PavelDoGreat-class and toggleable via `intro.background` | **PASS (lock wrap + test split)** | Simon `background.js` is MIT Pavel Dobryakov and **auto-inits** (`const canvas = document.getElementById('background')` at load). `scripts.pug` loads it only if `intro.background`. Toggle is real. See R1/R4. |
| 3 | `prefers-reduced-motion: reduce` turns fluid **off** and skips the 1100ms morph | **PASS** | `shouldStartFluid === backgroundEnabled && !reducedMotion` is the right predicate. Reduced-motion jumps to `main`. Do not start the sim. |
| 4 | Notes / search / projects stay reachable; MDX + `projects.ts` semantics untouched | **PASS (lock chrome)** | Routes exist (`/blog`, `/projects`, `/about`, `/search`). Breakdown does not rewrite MDX or project records. Search dies if homepage skips `PageLayout` without remounting `SearchModal`. See R2. |
| 5 | `card-link-structure` needs a **real** featured-notes region **or** an explicit spec update | **FAIL as written** | Breakdown offers a fork. Current spec is a **false green** if Start Here is missing (no `toHaveCount`, no `toBeVisible`). 归档 must pick one path. See R3. |
| 6 | Intro still exposes `#search-trigger` **or** search specs are updated | **FAIL as written** | Same fork. `e2e/search-keyboard-shortcuts.spec.ts` does `goto('/')` then `click('#search-trigger')` with **no enter**. “Persist after enter” fails those specs. 归档 must pick intro chrome. See R2. |
| 7 | No design-upgrade CSS-only `.hero-grid` / “no canvas” contract | **PASS** | `origin/design-upgrade` is 9 commits ahead and **not** merged. Its `e2e/reduced-motion-hero.spec.ts` asserts `.hero-grid` **and** `canvas` count 0. That spec must never land. Current `index.astro` still uses CSS `.hero-grid` — 开发 drops it as the homepage background. |
| 8 | No Vue / Pug / Gulp import | **PASS** | Keep Astro 5 + Tailwind + MDX + Preact + MiniSearch + `data-lang`. |
| 9 | 上线 is `npm run deploy:github` / `gh-pages`, not Docker | **PASS** | `package.json` script is `build:github && touch dist/.nojekyll && gh-pages -d dist --dotfiles`. `Dockerfile` / `docker-compose.yml` / `build:docker` exist and stay unused. Do **not** merge `refactor` → `main`. |
| 10 | Snake `GridAnimation` stays out | **PASS (评审 does not add it)** | Template `main.js` `GridAnimation` + `#gridCanvas` starts 1100ms after `loadMain`. Not a defining mechanic. Out of scope. |
| 11 | Workflow remains the serial driver | **PASS** | `.grok/workflows/homepage-refactor.rhai` exists and sequences 评审 → 归档 → 开发 → 测试 → 上线. |
| 12 | `package.json` `test:e2e` | **PASS (测试, not 开发)** | Missing today; Playwright config already serves **built** `dist` on `:4321`. 测试 adds `"test:e2e": "playwright test"`. |

**Overall:** mapping is honest and leftover-aware. Three items are too loose to implement against (search chrome, featured-notes e2e, compile-time fluid-off). Those are required edits, not a new design.

---

## 2. Adversarial findings

### F1 — Search on `/` is Header + `SearchModal`, not the button alone

`src/layouts/PageLayout.astro` mounts `Header` (`#search-trigger`) and `<SearchModal client:idle />`.  
`e2e/search-keyboard-shortcuts.spec.ts` clicks `#search-trigger` on `/` three times, never enters a second screen.

Breakdown §6 says the homepage *may omit* the sticky Header on intro and offers “update the specs” as an alternative. Workflow `p_dev_home` also allows “persist after enter”. That alternative is a trap:

- Clicking `#search-trigger` after a hidden Header still fails if `SearchModal` is not mounted.
- Updating specs to “press enter first” still fails if 开发 uses `BaseLayout` without `SearchModal`.
- `Header.astro` and unused `SearchTrigger.astro` both define `id="search-trigger"`. Two copies = invalid DOM and flaky clicks.

**Lock:** first paint of `/` has **exactly one** `#search-trigger` **and** a mounted `SearchModal`. Compact intro chrome: search + `LangToggle` + `ThemeToggle`. Do not choose “update search specs to enter first”.

### F2 — `card-link-structure` does not actually require Start Here

Current spec (`e2e/card-link-structure.spec.ts` on this branch):

```ts
const startHereSection = page.locator('section')
  .filter({ has: page.getByRole('heading', { name: 'Start Here' }) });
const cardAnchors = startHereSection.locator('article a');
// …assert no empty text…
expect(emptyAnchors.length).toBe(0);
```

If the heading is gone, the locator is empty, `texts = []`, the test **passes**.  
`index.astro` only renders Start Here when `featuredPosts.length > 0` (today four MDX posts have `featured: true`, sliced to two — so the region exists **now**).  
`Card.astro` is already `article` → one non-empty `a` (`TagChip` is `interactive={false}`).

`origin/design-upgrade` strengthened this to `#featured-notes` + bilingual heading + `toBeVisible()`. Do **not** merge that branch; copy only the *idea* of a stable region + a count assertion.

**Lock:** keep a real featured-notes region on `/` (both screens in the DOM; do not `display:none` main until enter). 测试 must assert the region is attached and `article a` count ≥ 1. Heading accessible name stays **`Start Here`** (do not wrap that h2 in `.i18n-en` that hides it when `data-lang=zh`).

### F3 — “Canvas absent when `intro.background` is false” is not a single-`dist` e2e

`intro.background` is a build-time TS constant. Playwright hits one `dist`. You cannot observe both on and off without a second build or a runtime override.

**Lock:**

- Unit-test `shouldStartFluid` for `{backgroundEnabled:false}` and `{reducedMotion:true}`.
- Default config stays `intro.background: true`.
- E2E “off” path is `prefers-reduced-motion: reduce` (canvas absent, `data-fluid-background=off`, no long `busy`).
- Do **not** promise a Playwright case for compile-time `background: false` unless 开发 adds an explicit runtime override (not required).

`data-fluid-background` reflects the **decision**, not WebGL success. E2E asserts `canvas#background` **node** when on — not pixels. If `getContext('webgl')` fails, still leave the node when `shouldStartFluid` is true.

### F4 — PavelDoGreat script will crash if vendored as-is

Simon `background.js` is the Pavel sim **and** it grabs `#background` at import time. `scripts.pug` only includes the file when `intro.background` is true. Our Astro bundler will evaluate the module if imported.

**Lock:** vendor as `src/scripts/webgl-fluid.js` (prefer **`.js`**, keep the MIT / Copyright (c) 2017 Pavel Dobryakov header). Convert the IIFE so import is inert. Export `startFluid(canvas)` / `stopFluid()`. Homepage-only. Never import from `BaseLayout` or inner routes. `stopFluid()` on intro→main complete, `pagehide`, and `astro:before-swap`.

### F5 — design-upgrade “no canvas” e2e is hostile to this refactor

`origin/design-upgrade:e2e/reduced-motion-hero.spec.ts`:

- requires `.hero-grid`
- asserts `page.locator('canvas')` count **0** (even without reduced motion in the companion contract)

`GROK_BUILD_PLAN.md` / `docs/Grok-Build-Upgrade-Plan.md` still rank CSS hero-grid above canvas. They are **historical**. `stash@{0}` dirty files (`playwright.config.ts`, `SearchModal.tsx`) stay stashed.

**Lock:** do not merge, cherry-pick, or apply those leftovers. Do not port `reduced-motion-hero.spec.ts`. Drop `.hero-grid` as the homepage background. Re-add `ClientRouter` cleanly in 开发/transitions — current `src/layouts/BaseLayout.astro` has none (any `ClientRouter` chunk in local `dist/` is a stale build).

### F6 — 390px “primary nav visible” fights current Header

`Header.astro` desktop `<nav>` is `hidden md:flex`. 390px only shows logo + search + lang + theme + hamburger. Workflow `p_dev_home` requires identity + primary nav at 390px.

**Lock:** intro shows Joe Cheung + enter. After enter (and immediately under reduced-motion), the identity card shows name / signature and Blog / About / Email / GitHub **without opening the hamburger**. Header remaining `md:flex`-hidden is OK.

### F7 — IA leftovers the breakdown did not freeze

| Current homepage region | Decision |
| --- | --- |
| Focus (3 static cards) | **Drop** from the two-screen main (copy already lives in `siteConfig` / intro blurb). |
| Selected work (`featuredProjects`) | **Keep** on main. Do not rewrite `src/data/projects.ts`. |
| Start Here (featured notes) | **Keep** — see F2. |
| Latest notes | **Keep** below the card (notes remain reachable without search). |
| `/projects` on the identity card | **Not required** if Header (after enter) + selected-work “all projects” remain. |

### F8 — anime.js / 1100ms / snake

Template `switchPage` is anime.js **1100ms** `translateY: "-200vh"` + SVG path morph; `loadMain` then starts `GridAnimation` after another 1100ms.

**Lock:** one-shot enter / wheel-down / swipe-up; root `data-page-transition=intro|main|busy`; ~1100ms delayed switch when motion is allowed; reduced-motion skips morph. Prefer Web Animations API for `translateY`. Path-`d` interpolation is **not** a WAAPI given — 开发 may skip the path morph or add **npm/vendored** anime.js (no jsDelivr, no Simon CDN). Arrow `mouseenter` stays optional. **Snake stays out.**

### F9 — Header script + ClientRouter will double-bind ⌘K

`Header.astro` `<script>` adds click + `keydown` with no `astro:page-load` guard. After `ClientRouter`, listeners leak.

**Lock:** rebind on `astro:page-load` (AbortController or equivalent). `SearchModal`’s `window` `open-search` listener is already cleaned up — leave it.

### F10 — Playwright may need a localhost proxy bypass (测试 only)

`playwright.config.ts` on this branch has no `NO_PROXY` / unset-`HTTP_PROXY` for `localhost`. `stash@{0}` on `design-upgrade` had that cleanup; do **not** apply the stash. If `npm run test:e2e` cannot reach `http://localhost:4321`, 测试 may add a local-only proxy bypass in `playwright.config.ts`. That is not a 开发 UI task.

### F11 — 上线 / dual build (no defect)

- Dual `npm run build` is a stability check on whatever `.env` is present (today matches `.env.github`).
- Production path remains `npm run deploy:github`.
- `origin/gh-pages` `26f30a6` is publish history, not a source merge.

---

## 3. Current-repo facts the breakdown got right

- Identity: `author` Joe Cheung, `role` / `roleZh`, email, `social.github`.
- No `ClientRouter`, no WebGL, no `data-page-transition` / `data-fluid-background` in source.
- Homepage is long-scroll `PageLayout` + CSS `.hero-grid`.
- IBM Plex in `BaseLayout`; `data-lang` bootstrap; `.i18n-en` / `.i18n-zh` in `global.css`.
- `package.json` has `deploy:github` and **no** `test:e2e`.
- `playwright.config.ts` serves `npx serve dist -p 4321`.
- Leftovers: `design-upgrade` SHAs `10bb216` … `1bda8c4`; stash message matches; `gh-pages` not merged.
- Template `supportAuthor: true` + remote `log.min.js` correctly forbidden (security + persona).

---

## 4. Required edits before 开发 (归档 must freeze)

1. **Identity.** `src/homepage.config.ts` reads Joe Cheung from `siteConfig`. No `supportAuthor`, no Simon title/subtitle/signature/email/github/avatar, no `assets/avatar.jpg`, no GitHub-corner, no `log.min.js`. Favicon stays `/favicon.svg`.
2. **Intro chrome (no fork).** First paint of `/`: exactly one `#search-trigger`, mounted `SearchModal`, `LangToggle`, `ThemeToggle`. Do not update search specs to require enter. Do not use `SearchTrigger.astro` alongside `Header` (duplicate id).
3. **Featured notes (no fork).** Keep `Card.astro` Start Here on `/` in the DOM (id `featured-notes` recommended). Heading accessible name **`Start Here`**. 测试 strengthens `card-link-structure` to attached region + `article a` count ≥ 1 + no empty anchors. If 开发 later `display:none`s main, 测试 must click enter **and** keep the count assertion — default plan is both screens in the DOM so first paint stays spec-compatible.
4. **Fluid.** Vendor PavelDoGreat via Simon `background.js` → `src/scripts/webgl-fluid.js` + MIT header + inert import + `startFluid` / `stopFluid`. `shouldStartFluid` unit-tested. Homepage wrapper `data-fluid-background=on|off`. Canvas only when the helper is true. Inner routes never load the module.
5. **Reduced motion.** No canvas, no sim, skip 1100ms morph, `data-page-transition` lands on `main` (or instant jump). Same helper gates fluid.
6. **Config-off e2e.** Unit test only. Do not claim one `dist` covers `intro.background === false`.
7. **Kill the old visual contract.** No CSS-only `.hero-grid` homepage background. No `reduced-motion-hero.spec.ts`. No GROK_BUILD_PLAN particle ladder. No merge/cherry-pick of `design-upgrade` / `stash@{0}`.
8. **Transitions.** `data-page-transition` on a **homepage** wrapper (not `<html>`). Triggers: enter click, wheel down, swipe-up; one-shot. ~1100ms when motion allowed. `ClientRouter` re-added in `BaseLayout` only in 开发/transitions. Rebind search on `astro:page-load`. No snake / `#gridCanvas`.
9. **Reachability.** Keep `/blog` `/projects` `/about` `/search` (and tags/languages/rss/404). Selected work + Start Here + latest notes on main. Focus cards drop. Do not rewrite MDX bodies or `src/data/projects.ts` semantics.
10. **390px.** Identity + enter on intro; name/signature + card links visible after enter without the hamburger.
11. **Stack / type.** Astro/MDX/Preact; IBM Plex; no Comic Sans; bilingual `i18n-en` / `i18n-zh` for **new** strings; `data-lang` unchanged.
12. **上线.** `npm run deploy:github` → `gh-pages`. Not Docker, not GitLab CI, not merge to `main`. If deploy cannot run, record the real blocker.
13. **测试 script.** `"test:e2e": "playwright test"` is added in **测试**, not as a 开发 UI task. Dual `npm run build` must exit 0 with non-empty `dist/index.html` + inner routes.
14. **Libraries.** No Vue/Pug/Gulp. No remote Simon scripts. anime.js only if path morph is justified, then npm/vendor — never jsDelivr.

评审 **does not** add `GridAnimation`.

---

## 5. What 归档 must lock (checklist)

- [ ] Joe Cheung config field list (head / intro / main) and the forbidden Simon keys
- [ ] Fluid on/off truth table + unit-test vs e2e split
- [ ] Intro chrome: `#search-trigger` + `SearchModal` on first paint
- [ ] Featured-notes region + strengthened `card-link-structure` contract
- [ ] Transition attributes, triggers, 1100ms, reduced-motion skip
- [ ] File touch list (add/edit/do-not-touch) from breakdown §9, plus “prefer `.js` for the sim”
- [ ] Leftover branches remain unmixed
- [ ] 上线 command and non-Docker rule
- [ ] Next phase = 开发 (config → fluid → homepage → transitions)

---

## 6. UI this phase

**None.** No edits to `src/pages/index.astro` or runtime UI.
