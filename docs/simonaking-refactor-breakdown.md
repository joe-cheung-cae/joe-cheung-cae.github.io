> **Historical.** Completed process notes from the homepage refactor — not current tasking. The live site is Joe Cheung’s personal homepage (Astro, Tailwind, MDX, Preact, MiniSearch) at https://joe-cheung-cae.github.io/, deployed from the `gh-pages` branch. See README.md and LICENSE.

# SimonAKing/HomePage → Joe Cheung site: 需求拆解

Status: **done** (this phase is mapping only; no homepage UI).  
Branch: `refactor` at `main` `51f2ef8`.  
Workflow: `.grok/workflows/homepage-refactor.rhai` (**confirmed present**).  
Identity: **Joe Cheung · CAE & HPC Engineer**. Never SimonAKing persona, avatar, or `supportAuthor`.  
Stack: keep **Astro 5 + Tailwind + MDX + Preact + MiniSearch + `data-lang` bilingual**. Do **not** import Vue / Pug / Gulp / Less.

This document is the input to **评审**. 开发 must not start until 评审 + 归档 lock it.

---

## 1. Leftover branches vs `main`

`refactor` is a clean checkout of `main` `51f2ef8`. Nothing from the superseded visual contract is mixed in.

| Ref | Relation to `main` | Contents | Decision |
| --- | --- | --- | --- |
| `refactor` (HEAD) | equal to `main` | Current Astro site + this docs/workflow work | **Work here.** Do not checkout, merge, or rebase other branches. |
| `main` / `origin/main` | `51f2ef8` | Production source of truth | Root of `refactor`. Do **not** merge `refactor` back in this workflow. |
| `design-upgrade` / `origin/design-upgrade` | **9 commits ahead** of `main` | Superseded GROK_BUILD_PLAN phases 1–6: CSS-only `.hero-grid` particles, ClientRouter, motion tokens, e2e that asserted *no* canvas | **Not merged. Not cherry-picked.** Visual contract replaced by PavelDoGreat WebGL fluid. |
| `origin/gh-pages` | deploy history only (`26f30a6` latest) | Built `dist/` for GitHub Pages | **Not merged.** Publish branch for `npm run deploy:github`. |
| `stash@{0}` | created on `design-upgrade` | Dirty leftover files: `playwright.config.ts` (+12), `src/components/search/SearchModal.tsx` (+20/−5) | **Leave stashed.** Message: `wip: design-upgrade dirty files leftover, not mixed into refactor`. |

`design-upgrade` commits (do not land on `refactor`):

| SHA | Subject |
| --- | --- |
| `10bb216` | chore: add design-upgrade workflow for GROK_BUILD_PLAN phases 1–6 |
| `833e77f` | feat: add phase 1 motion tokens and reduced-motion kill-switch |
| `9eb99fa` | feat: upgrade phase 2 hero, cards, and nav surfaces |
| `e3ca6f6` | feat: add phase 3 ClientRouter, reveal, and persist islands |
| `727b66c` | feat: add phase 4 CSS dual-layer Hero grid particles |
| `e7191de` | feat: align phase 5 pages, bilingual chrome, and containers |
| `402c2c1` | feat: add phase 6 e2e coverage and motion docs |
| `99b4393` | fix: keep e2e green after ClientRouter and reduced-motion |
| `1bda8c4` | docs: refresh Grok Build upgrade plan against current main |

`GROK_BUILD_PLAN.md` / `docs/Grok-Build-Upgrade-Plan.md` stay on disk as historical plans. They are **not** the contract for this refactor. ClientRouter will be re-added cleanly in 开发/transitions if 评审 agrees — not by merging `design-upgrade`.

---

## 2. What this homepage is today

`src/pages/index.astro` is a single long-scroll landing inside `PageLayout` (sticky `Header` + `main` + `Footer` + `SearchModal`).

| Region | Implementation |
| --- | --- |
| Hero | CSS `.hero-grid` dots, `siteConfig.author` / `role` / `roleZh`, bilingual blurb, CTAs to `/projects`, `/blog`, `mailto:` |
| Focus | Three static cards (particle methods / GPU / solver infra) |
| Selected work | `featuredProjects` from `src/data/projects.ts` (do **not** change project semantics) |
| Start Here | Featured MDX notes (`article` wrapping one non-empty `a`) — heading **Start Here** |
| Latest notes | Non-featured posts |
| Chrome | Sticky header (Home / Projects / Notes / About + `#search-trigger` + Lang + Theme), footer, ⌘K search |

`src/site.config.ts` already holds Joe Cheung identity:

- `author`: Joe Cheung  
- `role` / `roleZh`: CAE & HPC Engineer / 计算力学与高性能计算工程师  
- `email`: `zhangchao.simzc@outlook.com`  
- `social.github`: `https://github.com/joe-cheung-cae`  
- `description` / `descriptionZh`  
- `data-lang` + `.i18n-en` / `.i18n-zh` in `BaseLayout` + `global.css`

No `ClientRouter`. No WebGL. No two-screen intro. No `data-page-transition` / `data-fluid-background`. `package.json` has **no** `test:e2e` script yet (Playwright config exists; 测试 must add the npm script).

---

## 3. SimonAKing defining mechanics → this site

Source of truth inspected: [SimonAKing/HomePage](https://github.com/SimonAKing/HomePage) (`config.json`, `src/components/{intro,main,scripts}.pug`, `src/js/{main,background}.js`). Port **mechanics**, not the Vue/Pug/Gulp stack, not the persona.

| Mechanic | Template fact | Map onto this Astro site |
| --- | --- | --- |
| Encapsulated identity | `config.json` keys `head` / `intro` / `main` drive Pug | `src/homepage.config.ts` (+ extend `src/site.config.ts`). Joe Cheung values only. |
| Fluid background | `intro.background` gates PavelDoGreat sim on `canvas#background` (`src/js/background.js`, MIT Pavel Dobryakov). Loaded only if `intro.background` is true (`scripts.pug`). | Vendor as `src/scripts/webgl-fluid.ts` (or `.js`) with MIT header. Homepage-only. `startFluid(canvas)` / `stopFluid()`. |
| Two screens | `.content-intro` then `.content-main` `#card` | Rebuild `src/pages/index.astro`: intro screen then main identity card. Keep featured notes + selected work on the **main** screen. |
| Enter / scroll / swipe | `loadAll()` → `switchPage()` + `loadMain()`. Triggers: `.enter` click / `touchenter`, wheel-down (`deltaY > 0`), phone swipe-up, arrow `mouseenter`. | Same three required triggers: enter click, wheel down, swipe-up. Arrow hover is optional (评审 may drop it). |
| SVG morph + delayed switch | anime.js 1100ms: intro `translateY: "-200vh"` + `svg.shape` scaleY 0.8→1.8→1 + path `d` morph to `pathdata:id`. `switchPage.switched` is a one-shot. Fluid canvas removed in `complete`. `loadMain` fades `#card` then (after 1100ms) starts a 2D grid/snake — **out of scope**. | Same 1100ms delayed switch. Prefer **Web Animations API**; anime.js only if WAAPI cannot morph the path cleanly. Root `data-page-transition=intro\|main\|busy`. |
| Responsive | Mobile font/arrow/grid tweaks; 100vh intro | 390px viewport: identity + primary nav still visible. IBM Plex (no Comic Sans). Dark fluid intro is OK; bronze accent may remain. |
| `supportAuthor` | GitHub-corner octocat + remote `log.min.js` when `intro.supportAuthor` | **Omit entirely.** No octopus, no Simon console banner, no remote author script. |
| Avatar | `main.avatar` → `assets/avatar.jpg` (Simon) | Optional field. Default **unset**. Do not copy Simon's photo. |

`GridAnimation` (snake-on-grid on `#gridCanvas`) is a later extra in `main.js`. It is **not** a defining mechanic of this refactor and must not land unless 评审 explicitly adds it.

---

## 4. Config shape (Joe Cheung, not Simon)

Proposed `src/homepage.config.ts` (Zod-validate if a parse helper is added). Reuse `siteConfig` for author / email / github / descriptions — do not fork identity.

```ts
homepageConfig = {
  head: {
    title: 'Joe Cheung',
    description: siteConfig.description, // CAE & HPC engineer building GPU particle solvers…
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

Hard rules:

- No `supportAuthor`, no Simon title/subtitle/signature/email/github/avatar.
- `intro.background` default `true`.
- All new UI strings are `i18n-en` / `i18n-zh` pairs (or the `{ en, zh }` object above rendered that way).
- Inner-site identity (document title, OG, footer) continues to come from `siteConfig`.

---

## 5. Fluid start / stop + reduced-motion

Pure helper (开发/config) in `src/lib/fluid-control.ts`:

```ts
shouldStartFluid({ backgroundEnabled, reducedMotion })
  === backgroundEnabled && !reducedMotion
```

Runtime (开发/fluid):

| Condition | Canvas `#background` | Sim |
| --- | --- | --- |
| `intro.background === true` AND motion allowed | Present on homepage intro | `startFluid(canvas)` |
| `intro.background === false` | **Absent** | Do not import/start |
| `prefers-reduced-motion: reduce` | **Absent** | Do not start, even if config is on |
| Inner routes (`/blog`, `/projects`, `/about`, `/search`, …) | **Absent** | Do not load the sim module |

Also:

- Export `startFluid(canvas)` / `stopFluid()` for the homepage island.
- Homepage root attribute `data-fluid-background=on|off` for Playwright (reflects the *decision*, not GPU success).
- Vendor PavelDoGreat as used by SimonAKing (`src/js/background.js`) into `src/scripts/webgl-fluid.ts` or `.js`. Keep the **MIT / Copyright (c) 2017 Pavel Dobryakov** header. Convert the IIFE so it does **not** auto-start on import.
- Do not load the sim from `BaseLayout` or inner pages.
- `stopFluid()` on intro→main complete (template removes the canvas in the morph `complete` callback) and on `pagehide` / `astro:before-swap`.

---

## 6. Intro / main UI

### Intro (full viewport)

- `canvas#background` only when `shouldStartFluid` is true.
- Config title + subtitle + enter control (clickable, non-empty text).
- SVG `.shape-wrap` path used by the morph (same viewBox / dual `d` as the template, restyled to this palette).
- Optional down-arrows (visual affordance; click/hover may share the enter handler).
- **No** Simon GitHub-corner.
- Homepage may omit the sticky inner `Header` overlay on the intro, **but** search / lang / theme must remain reachable.

**E2E implication (评审 must lock):** existing `e2e/search-keyboard-shortcuts.spec.ts` does `page.goto('/')` then `page.click('#search-trigger')` *without* entering the main screen. Recommended: keep a compact intro chrome (`#search-trigger`, `LangToggle`, `ThemeToggle`) so those specs stay green. Alternative: update the specs in 测试 to press ⌘K or click enter first.

### Main (identity card + existing content)

- Identity card: `main.name`, `main.signature`, config links Blog / About / Email / GitHub.
- **Keep** featured notes: heading **Start Here**, each card is `article` wrapping a **single non-empty** `a` (`src/components/ui/Card.astro` already does this). `e2e/card-link-structure.spec.ts` locates `section` ⊃ heading "Start Here" ⊃ `article a`.
- Keep selected-work links (read `featuredProjects`; do not rewrite `src/data/projects.ts` semantics).
- Latest notes may stay below the card.
- After enter, Header/Footer may appear so inner nav matches the rest of the site.

### Responsive

- 390px: name/role (or signature) and primary nav (card links and/or header) visible without horizontal clipping.
- IBM Plex Sans / Mono. Dark fluid intro OK. Bronze `--accent-color` may remain.

---

## 7. Page-transition machinery

Pure helpers in `src/lib/page-transition.ts` (e.g. `isIntroActive`, `nextTransitionState`, `shouldSkipMorph(reducedMotion)`).

Runtime (开发/transitions):

| Item | Contract |
| --- | --- |
| Root attribute | `data-page-transition=intro \| main \| busy` |
| Triggers | Enter click, wheel down, swipe-up — all call the same one-shot `loadAll` |
| Motion path | Intro `translateY(-200vh)` + SVG path morph, **~1100ms**, then settle on `main` |
| One-shot | Ignore further enter/scroll/swipe after `busy`/`main` |
| Reduced motion | Skip morph; jump to `main` immediately; **do not start fluid** |
| Library | Web Animations API first. `anime.js` only if path-`d` interpolation is otherwise unjustified (justify in 开发 notes). |
| Fluid teardown | `stopFluid()` when leaving intro |
| Inner navigations | Mount Astro 5 `ClientRouter` from `astro:transitions` in `BaseLayout.astro` |
| Search rebind | Header today binds `#search-trigger` + ⌘K in a plain `<script>`. After ClientRouter, rebind on `astro:page-load`. `SearchModal` already listens for `open-search`; keep that. |

`loadMain`'s 2D grid/snake stays out of scope.

---

## 8. Inner routes stay reachable

These routes already exist and must remain after the homepage rebuild. The homepage is a shell; it is not the whole site.

| Route | File | How users reach it after refactor |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Intro → enter → main |
| `/blog` | `src/pages/blog/index.astro` | Main card Blog + Header Notes |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Start Here / Latest cards, search results |
| `/projects` | `src/pages/projects.astro` | Header Projects + selected-work “all projects” |
| `/about` | `src/pages/about.astro` | Main card About + Header |
| `/search` | `src/pages/search.astro` | `#search-trigger` / ⌘K / header path |
| `/languages`, `/languages/[lang]` | `src/pages/languages/*` | Existing tag/language indexes |
| `/tags`, `/tags/[tag]` | `src/pages/tags/*` | Existing tag indexes |
| `/rss.xml` | `src/pages/rss.xml.ts` | Footer RSS |
| `404` | `src/pages/404.astro` | Unchanged |

Do **not** rewrite MDX post bodies. Do **not** change `src/data/projects.ts` project list/blurbs/tags/urls. Bilingual `data-lang` stays the site-wide mechanism.

---

## 9. Files to add / edit / leave alone

### Add (开发)

| File | Why |
| --- | --- |
| `src/homepage.config.ts` | Encapsulated head/intro/main (Joe Cheung) |
| `src/lib/fluid-control.ts` | Pure `shouldStartFluid` + types |
| `src/lib/page-transition.ts` | Pure intro/main/busy + reduced-motion skip |
| `src/scripts/webgl-fluid.ts` (or `.js`) | Vendored PavelDoGreat sim, MIT header, `startFluid`/`stopFluid` |
| Homepage island(s) e.g. `src/components/homepage/IntroMotion.tsx` or a `<script>` island | Bind enter/wheel/swipe, set data attrs, start/stop fluid |
| Optional `src/styles/homepage.css` | Intro/main/shape styles (or a section in `global.css`) |
| `e2e/homepage-simonaking.spec.ts` (测试) | New Playwright contracts below |
| `package.json` script `test:e2e` (测试) | Missing today; Playwright already configured |

### Edit

| File | Why |
| --- | --- |
| `src/pages/index.astro` | Two-screen homepage; drop CSS-only `.hero-grid` as the background contract |
| `src/site.config.ts` | Wire/re-export homepage identity if needed; do not rename Joe Cheung |
| `src/layouts/BaseLayout.astro` | `ClientRouter`; keep IBM Plex + `data-lang` bootstrap |
| `src/layouts/PageLayout.astro` | Homepage may use `BaseLayout` directly so intro is full-bleed |
| `src/components/navigation/Header.astro` | Omit sticky overlay on intro if agreed; persist after enter; rebind search on `astro:page-load` |
| `src/styles/global.css` | Homepage motion / reduced-motion; `.hero-grid` no longer the homepage background |
| `src/components/search/SearchModal.tsx` | Only if ClientRouter requires a page-load rebind (listener is on `window` today — likely fine) |
| `e2e/card-link-structure.spec.ts` | Only if Start Here moves out of first paint; otherwise keep |
| `docs/simonaking-refactor-handoff.md` | Each later phase updates status |

### Do not touch (semantics)

- `src/content/posts/*.mdx` bodies  
- `src/data/projects.ts` project records  
- `design-upgrade` / `stash@{0}` / `gh-pages`  
- Simon avatar / `supportAuthor` / Comic Sans  
- Docker / GitLab as the 上线 path  

---

## 10. Playwright assertions on shipped `dist`

`playwright.config.ts` already serves **built** `dist` on `http://localhost:4321` via `npx serve dist -p 4321`. Tests must `page.goto` that server — not `astro dev`.

测试 adds `e2e/homepage-simonaking.spec.ts` (name flexible) plus any selector updates. Required assertions:

1. `/` shows config-backed **Joe Cheung** and role (`CAE & HPC Engineer` or the zh pair when `data-lang=zh`).
2. When background is enabled and motion is allowed: `canvas#background` exists; root `data-fluid-background=on`.
3. When background is configured **off**: canvas **absent**, `data-fluid-background=off`.
4. Under `prefers-reduced-motion: reduce`: canvas **absent** (even if config on); transition skips morph (`data-page-transition` is `main` or jumps without a long `busy`).
5. Enter (and/or wheel) exercises the transition: `data-page-transition` changes `intro → busy → main`, or intro leaves the viewport.
6. Viewport **390px**: identity + primary nav still visible; critical controls have non-empty accessible names/text.
7. `e2e/card-link-structure.spec.ts` still finds Start Here `article a` with no empty anchors — **or** the spec is explicitly updated because the region moved behind enter.
8. `e2e/search-keyboard-shortcuts.spec.ts` and `e2e/dual-theme-syntax-highlighting.spec.ts` stay green (`#search-trigger` / theme toggle reachable; dual-theme hits `/blog/cmake-modern-targets` and is homepage-independent).

`package.json` must gain `"test:e2e": "playwright test"` (or equivalent) so the workflow's `npm run test:e2e` exists.

---

## 11. Dual `npm run build`

测试 runs **`npm run build` twice**. Both must:

- exit 0  
- produce a non-empty `dist/` that includes `dist/index.html` plus inner routes (`dist/blog/`, `dist/projects/`, `dist/about/`, `dist/search/`)

Notes:

- `npm run build` is `astro build` using the current `.env` (today copied from `.env.github`: `DEPLOY_SITE=https://joe-cheung-cae.github.io`, `DEPLOY_BASE=/`).  
- Production 上线 uses `npm run build:github` (`cp .env.github .env && astro build`) inside `deploy:github`.  
- Dual build is a **stability** check (second build must not fail or empty `dist`), not a substitute for `build:github`.

---

## 12. GitHub Pages 上线 path

This is a **user site** (`joe-cheung-cae.github.io`), `DEPLOY_BASE=/`.

```bash
npm run deploy:github
# → npm run build:github && touch dist/.nojekyll && gh-pages -d dist --dotfiles
```

| Rule | Detail |
| --- | --- |
| Publish branch | `gh-pages` (already exists as `origin/gh-pages`) |
| Not | Merge `refactor` → `main` (not required; Pages serves `gh-pages`) |
| Not | Docker / `Dockerfile` / `docker-compose.yml` / GitLab CI |
| If deploy cannot run | Record the real blocker in handoff notes; leave local `dist/` as the refactored site |

GitHub Pages settings already expected: Deploy from branch `gh-pages` / folder `/ (root)`.

---

## 13. Intensity / phase map (already in the workflow)

| Phase | Role | This document |
| --- | --- | --- |
| 需求拆解 | grok-46-high | **This file.** Mapping + leftover honesty. No UI. |
| 评审 | grok-46-high | Adversarial check → `docs/simonaking-refactor-review.md` |
| 归档 | grok-46-low | Freeze agreed plan into the handoff |
| 开发 | grok-46-high × config / fluid / homepage / transitions | Implement against this + review edits |
| 测试 | grok-46-medium | Playwright on `dist` + dual build |
| 上线 | grok-46-medium | `npm run deploy:github` or honest blocker |

---

## 14. 评审 must verify (pass/fail)

- [ ] Identity is Joe Cheung only; no Simon copy, avatar, or `supportAuthor`.
- [ ] Fluid is PavelDoGreat-class, homepage-only, toggleable via `intro.background`.
- [ ] `prefers-reduced-motion: reduce` turns fluid **off** and skips the 1100ms morph.
- [ ] `/blog` `/projects` `/about` `/search` stay reachable; MDX and `projects.ts` semantics untouched.
- [ ] Start Here `article > a` remains findable **or** 测试 is explicitly told to update `card-link-structure`.
- [ ] Intro still exposes `#search-trigger` (or 测试 updates search specs).
- [ ] No design-upgrade CSS-only hero-grid / “no canvas” contract.
- [ ] No Vue / Pug / Gulp import.
- [ ] 上线 is `npm run deploy:github` / `gh-pages`, not Docker.
- [ ] Snake `GridAnimation` stays out unless explicitly added.
- [ ] Workflow `.grok/workflows/homepage-refactor.rhai` remains the serial driver.
