> **Historical.** Completed process notes from the homepage refactor — not current tasking. The live site is Joe Cheung’s personal homepage (Astro, Tailwind, MDX, Preact, MiniSearch) at https://joe-cheung-cae.github.io/, deployed from the `gh-pages` branch. See README.md and LICENSE.

# SimonAKing homepage refactor — handoff

**Frozen agreed plan** (归档). 开发 implements this only. No new design.

| Field | Value |
| --- | --- |
| Branch | `refactor` (from clean `main` `51f2ef8`; 评审 `10a1805`) |
| Current phase | **上线** (done) |
| Next phase | — |
| Site identity | Joe Cheung · CAE & HPC Engineer (not SimonAKing) |
| Workflow | `.grok/workflows/homepage-refactor.rhai` (**exists**) |
| Breakdown | `docs/simonaking-refactor-breakdown.md` (done) |
| Review | `docs/simonaking-refactor-review.md` (**PASS WITH REQUIRED EDITS**, done) |
| Thinking roles | grok-46-high (需求拆解 / 评审 / 开发), grok-46-low (归档), grok-46-medium (测试 / 上线) |
| UI this phase | Two-screen `/` shipped: config identity, PavelDoGreat fluid, 1100ms enter, ClientRouter. |

Phases done: **需求拆解**, **评审**, **归档**, **开发/config**, **开发/fluid**, **开发/homepage**, **开发/transitions**, **测试**, **上线**. Next: none.

---

## Leftover branches (not mixed into `refactor`)

| Branch / ref | vs `main` | Decision |
| --- | --- | --- |
| `design-upgrade` / `origin/design-upgrade` | **9 commits ahead** (CSS-only `.hero-grid`, ClientRouter, phases 1–6 of the superseded GROK_BUILD_PLAN contract) | **Not merged.** Visual contract superseded by SimonAKing WebGL fluid. |
| `stash@{0}` (`On design-upgrade`) | Dirty leftover files: `playwright.config.ts`, `src/components/search/SearchModal.tsx` | **Not applied.** Message: `wip: design-upgrade dirty files leftover, not mixed into refactor`. |
| `origin/gh-pages` | Deploy history (`c99e320` latest; was `26f30a6`) | **Not merged.** Production publish branch for `npm run deploy:github`. |
| `main` / `origin/main` | At `51f2ef8` | Root of `refactor`. |

`design-upgrade` SHAs (do not land here): `10bb216` `833e77f` `9eb99fa` `e3ca6f6` `727b66c` `e7191de` `402c2c1` `99b4393` `1bda8c4`.

Do **not** port `e2e/reduced-motion-hero.spec.ts`. `GROK_BUILD_PLAN.md` / `docs/Grok-Build-Upgrade-Plan.md` are historical, not this contract.

---

## Agreed config (`src/homepage.config.ts`)

Reuse `siteConfig` for identity. Zod-validate only if a parse helper is added.

```ts
homepageConfig = {
  head: {
    title: 'Joe Cheung',
    description: siteConfig.description,
    favicon: '/favicon.svg',
  },
  intro: {
    title: 'Joe Cheung',
    subtitle: { en: siteConfig.role, zh: siteConfig.roleZh },
    enter: { en: 'enter', zh: '进入' },
    background: true, // default ON
  },
  main: {
    name: 'Joe Cheung',
    signature: { en: siteConfig.role, zh: siteConfig.roleZh },
    // avatar omitted by default
    links: [
      { href: '/blog', textEn: 'Blog', textZh: '笔记' },
      { href: '/about', textEn: 'About', textZh: '关于' },
      { href: `mailto:${siteConfig.email}`, textEn: 'Email', textZh: '邮箱' },
      { href: siteConfig.social.github, textEn: 'GitHub', textZh: 'GitHub' },
    ],
  },
}
```

**Forbidden:** `supportAuthor`, Simon title/subtitle/signature/email/github/avatar, `assets/avatar.jpg`, GitHub-corner, `log.min.js`. Avatar field **unset**. Favicon `/favicon.svg`. New strings are `i18n-en` / `i18n-zh`. Inner title/OG/footer stay on `siteConfig`.

---

## Fluid on/off

`src/lib/fluid-control.ts`:

```ts
shouldStartFluid({ backgroundEnabled, reducedMotion })
  === backgroundEnabled && !reducedMotion
```

| Condition | `canvas#background` | Sim |
| --- | --- | --- |
| `intro.background === true` AND motion allowed | Present on homepage intro | `startFluid(canvas)` |
| `intro.background === false` | Absent | Do not import/start |
| `prefers-reduced-motion: reduce` | Absent | Do not start even if config on |
| Inner routes | Absent | Do not load the sim module |

- Vendor PavelDoGreat as `src/scripts/webgl-fluid.js` (prefer **`.js`**), MIT / Copyright (c) 2017 Pavel Dobryakov header.
- Convert the IIFE so **import is inert**. Export `startFluid(canvas)` / `stopFluid()`.
- Homepage-only. Never import from `BaseLayout` or inner routes.
- Wrapper `data-fluid-background=on|off` reflects the **decision**, not GPU success. If WebGL fails, still leave the node when `shouldStartFluid` is true.
- `stopFluid()` on intro→main complete, `pagehide`, `astro:before-swap`.
- **Unit-test** both false branches of `shouldStartFluid`.
- Compile-time `intro.background === false` is **not** a single-`dist` Playwright case. E2E “off” = `prefers-reduced-motion: reduce`.

---

## Intro / main chrome (no forks)

**First paint of `/`:** exactly one `#search-trigger` + mounted `SearchModal` + Lang/Theme toggles. Do **not** update search specs to click enter first. Do not ship two `#search-trigger` ids (`SearchTrigger.astro` + Header).

**Featured notes:** Keep Start Here (`Card.astro` `article` → one non-empty `a`) on `/` in the DOM (`#featured-notes` recommended). Heading accessible name stays **`Start Here`** (do not hide that h2 when `data-lang=zh`). Default: both screens in the DOM. 测试 strengthens `card-link-structure` to attached region + `article a` count ≥ 1 + no empty anchors.

**Main:** identity card (name, signature, Blog / About / Email / GitHub). Keep selected work (`featuredProjects`) + latest notes. **Drop** Focus cards. `/projects` on the card is not required if Header after enter + selected-work “all projects” remain.

**390px:** Intro shows name + enter. After enter (and immediately under reduced-motion), name/signature + Blog/About/Email/GitHub visible **without** the hamburger. Header `md:flex`-hidden nav is OK.

IBM Plex. Dark fluid intro OK. Bronze accent may remain. No Comic Sans.

---

## Transition behavior

- Homepage wrapper (not `<html>`): `data-page-transition=intro|main|busy`.
- Triggers: enter click, wheel down (`deltaY > 0`), swipe-up. Same one-shot `loadAll`. Arrow hover optional.
- Motion allowed: intro `translateY(-200vh)` + optional SVG path morph, **~1100ms**, then `main`.
- One-shot: ignore further enter/scroll/swipe after `busy`/`main`.
- Reduced motion: skip morph; jump to `main`; **do not start fluid**.
- WAAPI `translateY` required. Path-`d` interpolation is not a WAAPI given — skip path morph **or** npm/vendored anime.js (no jsDelivr).
- `ClientRouter` re-added cleanly in `BaseLayout` in 开发/transitions (not via `design-upgrade`). Header search rebind on `astro:page-load` (AbortController). `SearchModal` `open-search` stays.
- **No** `GridAnimation` / `#gridCanvas`.

---

## Files to touch

### Add (开发)

| File | Why |
| --- | --- |
| `src/homepage.config.ts` | Encapsulated head/intro/main (Joe Cheung) |
| `src/lib/fluid-control.ts` | Pure `shouldStartFluid` + types |
| `src/lib/page-transition.ts` | Pure intro/main/busy + reduced-motion skip |
| `src/scripts/webgl-fluid.js` | Vendored PavelDoGreat, MIT header, inert import, `startFluid`/`stopFluid` |
| Homepage island e.g. `src/components/homepage/IntroMotion.tsx` or a `<script>` | Bind enter/wheel/swipe, data attrs, start/stop fluid |
| Optional `src/styles/homepage.css` | Intro/main/shape (or a section in `global.css`) |

### Add (测试, not 开发 UI)

| File | Why |
| --- | --- |
| `e2e/homepage-simonaking.spec.ts` | New Playwright contracts |
| `package.json` script `test:e2e` | `"test:e2e": "playwright test"` |

### Edit

| File | Why |
| --- | --- |
| `src/pages/index.astro` | Two-screen homepage; drop CSS-only `.hero-grid` as background |
| `src/site.config.ts` | Wire/re-export if needed; do not rename Joe Cheung |
| `src/layouts/BaseLayout.astro` | `ClientRouter`; keep IBM Plex + `data-lang` |
| `src/layouts/PageLayout.astro` | Homepage may use `BaseLayout` directly so intro is full-bleed |
| `src/components/navigation/Header.astro` | Compact intro chrome; persist after enter; rebind search |
| `src/styles/global.css` | Homepage motion / reduced-motion |
| `src/components/search/SearchModal.tsx` | Only if ClientRouter requires a rebind (likely fine) |
| `e2e/card-link-structure.spec.ts` | 测试: attach + count ≥ 1 |
| `docs/simonaking-refactor-handoff.md` | Later phases update status |

### Do not touch (semantics)

- `src/content/posts/*.mdx` bodies
- `src/data/projects.ts` project records
- `design-upgrade` / `stash@{0}` / `gh-pages`
- Simon avatar / `supportAuthor` / Comic Sans
- Docker / GitLab as the 上线 path
- Vue / Pug / Gulp

---

## E2E / dual build / 上线 contracts

Playwright serves **built** `dist` on `http://localhost:4321` (`npx serve dist -p 4321`). Not `astro dev`.

1. `/` shows Joe Cheung and role (`CAE & HPC Engineer` or zh pair when `data-lang=zh`).
2. Motion allowed + default config: `canvas#background` node exists; wrapper `data-fluid-background=on`.
3. Reduced-motion: canvas **absent**, `data-fluid-background=off`; no long `busy`; lands on `main`.
4. Enter and/or wheel: `data-page-transition` `intro → busy → main`, or intro leaves the viewport.
5. 390px: identity + card links visible after enter; critical controls have non-empty names/text.
6. `card-link-structure`: Start Here region attached, `article a` ≥ 1, no empty anchors.
7. Search + theme specs stay green (`#search-trigger` / theme on first paint of `/`; dual-theme hits `/blog/cmake-modern-targets`).
8. Do **not** assert compile-time `background: false` in one `dist`.

**测试-only env:** if Playwright cannot reach `:4321`, add a localhost `NO_PROXY` bypass in `playwright.config.ts`. Do not apply `stash@{0}`.

**Dual `npm run build`:** both exit 0; non-empty `dist/index.html` + `dist/blog/` `dist/projects/` `dist/about/` `dist/search/`. Stability check, not a substitute for `build:github`.

**上线:** `npm run deploy:github` → `build:github && touch dist/.nojekyll && gh-pages -d dist --dotfiles`. Not Docker, not GitLab CI, not merge `refactor` → `main`. If deploy cannot run, record the real blocker.

Inner routes stay: `/` `/blog` `/blog/[slug]` `/projects` `/about` `/search` `/languages` `/tags` `/rss.xml` `404`.

---

## Next 开发 steps (workflow order)

1. **config** — done (`homepage.config.ts` + `shouldStartFluid` + transition helpers + unit tests for both fluid false branches).
2. **fluid** — done (`webgl-fluid.js` inert import; homepage-only start/stop; `data-fluid-background`).
3. **homepage** — done (two-screen `index.astro`; intro chrome; Start Here + selected work + latest notes; drop Focus + `.hero-grid` background).
4. **transitions** — done (1100ms WAAPI switch; reduced-motion skip; `ClientRouter` + search rebind).

---

## Phase log

### 0. Branch setup — done

Checked out `main`, listed branches, created `refactor` at the same commit as `main`. Working tree was clean. Uncommitted `design-upgrade` files were stashed, not carried over.

### 1. 需求拆解 — done

Mapped SimonAKing/HomePage defining mechanics onto this Astro homepage. Wrote `docs/simonaking-refactor-breakdown.md`. No homepage UI.

### 2. 评审 — done

Adversarial review. Wrote `docs/simonaking-refactor-review.md`. Required locks (search chrome, featured-notes e2e, compile-time fluid-off) frozen above. No homepage UI.

### 3. 归档 — done

This file is the frozen plan. 需求拆解 / 评审 / 归档 = done. **开发** is next.

**What changed this phase**

- Replaced handoff “Next phase must (归档)” with the locked config, fluid table, chrome, transition, files, e2e, leftovers, and 开发 order.
- Did **not** edit `src/pages/index.astro` or any runtime UI.
- Did **not** merge `design-upgrade` or apply `stash@{0}`.

### 4. 开发/config — done

Encapsulated Joe Cheung homepage identity. No homepage UI rewrite.

**What changed this phase**

- Extended `src/site.config.ts` with `siteIdentity` (`author`, `role`, `roleZh`, `email`, `github`, `description`). Existing `siteConfig` fields unchanged.
- Added `src/homepage.config.ts` (`head` / `intro` / `main`) sourced from `siteConfig`. Avatar unset. No `supportAuthor`.
- Added Zod `parseHomepageConfig` / `createHomepageConfig` in `src/lib/homepage-schema.ts`. `intro.background` defaults to `true`.
- Added `src/lib/fluid-control.ts` (`shouldStartFluid` === `backgroundEnabled && !reducedMotion`) and `src/lib/page-transition.ts` (`isIntroActive`, reduced-motion skip, one-shot `intro → busy → main`).
- Unit tests: both `shouldStartFluid` false branches, transition skip/lock, schema parse. `npm run test:unit`.
- Did **not** rewrite `src/pages/index.astro` UI. Did **not** vendor fluid or add ClientRouter.

### 5. 开发/fluid — done

Vendored PavelDoGreat as used by SimonAKing. Homepage-only start/stop. No two-screen rewrite.

**What changed this phase**

- Added `src/scripts/webgl-fluid.js` (MIT / Copyright (c) 2017 Pavel Dobryakov). Import is inert. Exports `startFluid(canvas)` / `stopFluid()`.
- Homepage intro: `canvas#background` is created only when `intro.background` is true **and** motion is allowed. Reduced-motion never creates the node.
- `#homepage` wrapper `data-fluid-background=on|off` reflects the **decision**, not GPU success.
- `FluidBackground` island (homepage only) dynamically imports the sim after `shouldStartFluid`. `stopFluid()` on `pagehide`, `astro:before-swap`, and `data-page-transition=main`.
- Did **not** load the sim from `BaseLayout` or inner routes. Did **not** rebuild the two-screen homepage. Did **not** add ClientRouter.

### 6. 开发/homepage — done

Two-screen homepage from `homepageConfig`. Joe Cheung identity only.

**What changed this phase**

- Rebuilt `src/pages/index.astro` on `BaseLayout` (full-bleed intro). Compact chrome: one `#search-trigger` + Lang + Theme + mounted `SearchModal`. No sticky Header overlay on intro.
- Intro: config title / subtitle / enter, `canvas#background` when fluid is on, SVG `.shape-wrap`, arrows. Dark fluid aesthetic, IBM Plex, no Comic Sans, no GitHub-corner / avatar / `supportAuthor`.
- Main: identity card (name, signature, Blog / About / Email / GitHub), selected work, `#featured-notes` Start Here (`article` → one `a`), latest notes. Focus cards and `.hero-grid` background dropped.
- `IntroMotion` binds enter / wheel-down / swipe-up (one-shot). Wrapper `data-page-transition=intro|busy|main`. Reduced motion jumps to `main` before paint and does not start fluid.
- New UI strings are `i18n-en` / `i18n-zh`. 390px: intro name + enter; after enter (and immediately under reduced-motion) name / signature / card links stay visible without a hamburger.
- Did **not** add `ClientRouter`. Did **not** rewrite MDX or `src/data/projects.ts`. Did **not** mix `design-upgrade` leftovers.

### 7. 开发/transitions — done

Smooth intro→main switch and inner-route ClientRouter. Joe Cheung identity only.

**What changed this phase**

- Intro enter / wheel-down / swipe-up stay one-shot `loadAll`. Motion allowed: WAAPI `translateY(-200vh)` + shape `scaleY`, delayed switch **1100ms**, then `data-page-transition=main`. Path `d` morph skipped (not a WAAPI given; no anime.js).
- `#homepage` wrapper `data-page-transition=intro|busy|main`. Reduced motion skips the morph (jump to `main`, no long `busy`) and does **not** start fluid.
- Mounted Astro 5 `ClientRouter` from `astro:transitions` in `BaseLayout`. Search ⌘K / `#search-trigger` rebound on `astro:page-load` via AbortController. Theme/lang copied on `astro:before-swap`; toggles `transition:persist`.
- `SearchModal` `open-search` unchanged. Did **not** rewrite MDX or `src/data/projects.ts`. Did **not** mix `design-upgrade` leftovers. No snake / `#gridCanvas`.

### 8. 测试 — done

Playwright on built `dist` + dual `npm run build`. Joe Cheung identity only.

**What changed this phase**

- Added `e2e/homepage-simonaking.spec.ts`: config name/role (en + `data-lang=zh`), `canvas#background` when motion allowed, canvas **absent** under `prefers-reduced-motion: reduce` (single-`dist` stand-in for background off), enter `intro → busy/main` + intro leaves, 390px identity + card nav without hamburger, critical controls non-empty.
- Strengthened `e2e/card-link-structure.spec.ts` to `#featured-notes` attached, heading **Start Here**, `article a` ≥ 1, no empty anchors.
- Added `package.json` script `"test:e2e": "playwright test"`. Localhost `NO_PROXY` bypass in `playwright.config.ts`.
- Search + dual-theme specs stay green (`#search-trigger` on first paint of `/`; dual-theme still hits `/blog/cmake-modern-targets`). Spec-only robustness: IME ArrowDown via `window` keydown, `c++` query blurs then arrows, theme screenshots target `(dark|light) mode` (not LangToggle).
- Did **not** assert compile-time `intro.background === false` in one `dist`. Did **not** rewrite MDX or `src/data/projects.ts`. Did **not** mix `design-upgrade` leftovers.

**Dual build**

| Run | Command | Exit | `dist` |
| --- | --- | --- | --- |
| 1 | `npm run build` | 0 | 36 pages; `dist/index.html` + `/blog/` `/projects/` `/about/` `/search/` |
| 2 | `npm run build` | 0 | same; `index.html` 50695 bytes, non-empty inner routes |

**`npm run test:e2e`** (chromium, `npx serve dist -p 4321`)

| Run | Result |
| --- | --- |
| 1 | **18 passed** (6.9s) |
| 2 | **18 passed** (6.5s) |
| 3 (parent, after importing `homepageConfig` into the spec) | **18 passed** (8.5s) |

Covered: `homepage-simonaking` (6), `card-link-structure` (1), `search-keyboard-shortcuts` (3), `dual-theme-syntax-highlighting` (7). Identity assertions read `homepageConfig`, not a reimplemented string.

Parent also re-ran `npm run build` twice (both exit 0, 36 pages, `dist/index.html` 50695 bytes). Playwright 1.58.2. Probe: `/` identity Joe Cheung, canvas 1280×800, zero page errors; second WebGL context readback is null (context already owned).

### 9. 上线 — done

Published the refactored site via the existing GitHub Pages path. Did **not** merge `refactor` → `main`. Did **not** use Docker / GitLab.

**What changed this phase**

- Ran `npm run deploy:github` (`build:github` + `touch dist/.nojekyll` + `gh-pages -d dist --dotfiles`). Command exit 0; `gh-pages` printed `Published`.
- `origin/gh-pages` moved `26f30a6` → `c99e320` (`Updates`, 2026-08-19T03:27:00Z). Tree includes `.nojekyll`, `index.html` (50695 bytes), `/blog/` `/projects/` `/about/` `/search/`.
- GitHub Pages (`source.branch=gh-pages`, `path=/`) build `2026-08-19T03:27:03Z` → **built** at `03:27:21Z` (`error: null`).
- Live probe `https://joe-cheung-cae.github.io/`: `/` `/blog/` `/projects/` `/about/` `/search/` `.nojekyll` all HTTP 200. Home is Joe Cheung · CAE & HPC Engineer two-screen (`homepage-intro`, `data-fluid-background`, FluidBackground). No SimonAKing / `supportAuthor`.
- Stayed on `refactor` (`5755dc5`). Did **not** checkout, merge, or rebase. Did **not** mix `design-upgrade` / `stash@{0}`. Local `dist/` is the same `build:github` output.
