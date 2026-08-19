# SimonAKing homepage refactor — handoff

**Frozen agreed plan** (归档). 开发 implements this only. No new design.

| Field | Value |
| --- | --- |
| Branch | `refactor` (from clean `main` `51f2ef8`; 评审 `10a1805`) |
| Current phase | **归档 — done** |
| Next phase | **开发** (config → fluid → homepage → transitions) |
| Site identity | Joe Cheung · CAE & HPC Engineer (not SimonAKing) |
| Workflow | `.grok/workflows/homepage-refactor.rhai` (**exists**) |
| Breakdown | `docs/simonaking-refactor-breakdown.md` (done) |
| Review | `docs/simonaking-refactor-review.md` (**PASS WITH REQUIRED EDITS**, done) |
| Thinking roles | grok-46-high (需求拆解 / 评审 / 开发), grok-46-low (归档), grok-46-medium (测试 / 上线) |
| UI this phase | **None.** Archive only. |

Phases done: **需求拆解**, **评审**, **归档**. Do not start UI until 开发.

---

## Leftover branches (not mixed into `refactor`)

| Branch / ref | vs `main` | Decision |
| --- | --- | --- |
| `design-upgrade` / `origin/design-upgrade` | **9 commits ahead** (CSS-only `.hero-grid`, ClientRouter, phases 1–6 of the superseded GROK_BUILD_PLAN contract) | **Not merged.** Visual contract superseded by SimonAKing WebGL fluid. |
| `stash@{0}` (`On design-upgrade`) | Dirty leftover files: `playwright.config.ts`, `src/components/search/SearchModal.tsx` | **Not applied.** Message: `wip: design-upgrade dirty files leftover, not mixed into refactor`. |
| `origin/gh-pages` | Deploy history (`26f30a6` latest) | **Not merged.** Production publish branch for `npm run deploy:github`. |
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

1. **config** — `homepage.config.ts` + `shouldStartFluid` + transition helpers + unit tests for both fluid false branches.
2. **fluid** — vendor `webgl-fluid.js` (inert import); homepage-only start/stop; `data-fluid-background`.
3. **homepage** — two-screen `index.astro`; intro chrome; Start Here + selected work + latest notes; drop Focus + `.hero-grid` background.
4. **transitions** — 1100ms / reduced-motion skip; `ClientRouter` + search rebind.

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
