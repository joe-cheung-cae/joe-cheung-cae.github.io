# SimonAKing inner pages — 评审

Status: **done** (read-only review of current `src/` + e2e; **no UI**).  
Verdict: **PASS WITH REQUIRED LOCK EDITS** — direction is implementable; 开发 must follow the frozen plan **after** the lock patches listed in §4 (already applied to `docs/simonaking-inner-pages-plan.md`).  
Branch: `refactor`. Do not checkout, merge, rebase, or mix `design-upgrade` leftovers.  
Inputs: `docs/simonaking-inner-pages-gaps.md`, `docs/simonaking-inner-pages-plan.md` (pre-patch), current `src/` + `e2e/` + `package.json`.  
Identity stays **Joe Cheung · CAE & HPC**. Stack stays **Astro 5 + Tailwind + MDX + Preact + MiniSearch + `data-lang` bilingual**. IBM Plex only.

This document is the input to 开发. It does not implement chrome.

---

## 1. Verdict per fail-condition / requirement

| # | Requirement | Result | Why |
| --- | --- | --- | --- |
| 1 | Identity stays Joe Cheung; never Simon | **PASS** | Plan §0 + B.1: `JC` + `Joe Cheung`, no avatar, no `supportAuthor`. Schema tests keep `supportAuthor` rejection and `avatar` unset. `site.config.ts` / `createHomepageConfig` already bind Joe. |
| 2 | No Comic Sans (IBM Plex only) | **PASS** | Plan forbids Comic Sans / Roboto / Fira Code / Inter and Simon CDN `@font-face`. `BaseLayout` already loads IBM Plex only. |
| 3 | Fluid sim **not** loaded on inner routes | **PASS (lock wrap)** | Homepage keeps `FluidBackground` + `canvas#background` in `index.astro` only. `NotesLayout` wraps `BaseLayout` (no fluid import today). Banner flicker is a **different** canvas. Pre-patch plan did not say the forbidden imports out loud — see R1. |
| 4 | `SearchModal` stays mounted | **PASS** | Homepage keeps `client:idle` + `transition:persist="search-modal"`. `NotesLayout` remounts the same contract. `/search` **removes** the extra `client:load` modal. `SearchModal.tsx` behavior is do-not-touch. |
| 5 | Exactly one `#search-trigger` on first paint of `/` and of inner pages | **PASS (lock wrap)** | `/` stays `HomepageChrome` (one id). Inner bar is rewritten `Header` **or** `NotesHeader`, not both. `SearchTrigger.astro` must not remount. `/search` must not add a second id. See R2. |
| 6 | Homepage Start Here region kept | **PASS** | `e2e/card-link-structure.spec.ts` requires `#featured-notes` + heading `Start Here` + `article a` ≥ 1. Plan I.3: do not change intro / fluid / Start Here / `Card.astro` contract. `NoteCard` is a **new** inner list, not a rewrite of homepage cards. |
| 7 | MDX bodies not rewritten | **PASS** | I.3 freezes `src/content/posts/**/*.mdx`. `[slug].astro` is layout-only (stop mutating `post.data`; pass computed counts). |
| 8 | Album not omitted | **PASS** | New `/gallery` + `src/data/album.ts` (`[]` valid) + drawer/stats/footer/card. AnimatedGallery / Vue / GitHub-corner dropped. |
| 9 | No Vue (or Pug / Gulp / Less) | **PASS** | Stack lock + F.2 “Stay in Astro.” `package.json` has no Vue. |
| 10 | Schema test must **not** still assert the exact 4-link href array after Gallery is added | **FAIL as written → lock applied** | Live `src/lib/homepage-schema.test.ts` `deepEqual`s `['/blog','/about',mailto,github]`. Pre-patch F.5 said “deep-equal hrefs **includes** `/gallery`” and I.2 said “old four remain” — that can be read as **keep** the 4-tuple and add a fifth assert, which is impossible. See R3. |
| 11 | Inner notes must not stay a 2-col `Card` grid | **PASS** | C.1–C.2 drop `md:grid-cols-2` + `Card.astro` on `/blog`. `ul.post-list` + `NoteCard`. Tags/languages detail also `NoteCard`. CSS lock: `.post-list` centered, not 2-col. |
| 12 | Homepage two-screen intro unchanged except Gallery on the identity card | **PASS** | Do not wrap `/` in `NotesLayout`. `index.astro` already maps `main.links`. Schema grows; intro/fluid/`HomepageChrome` stay. |
| 13 | Existing homepage e2e stay green (no weaken) | **PASS (lock wrap)** | H.3 + I.3. Dual-theme `page.locator('h1')` is **strict** — a second `h1` on the post page fails the spec. See R4. |
| 14 | `projects.ts` semantics frozen | **PASS** | I.3. Projects page restyles chrome only. |
| 15 | Plan is implementable (Astro/Preact, phased, files listed) | **PASS after §4 locks** | Names, props, DOM ids, phase order, and e2e cases are specific enough to build. Pre-patch holes were locks, not a new design. |

**Overall:** mapping is honest and leftover-aware. One fail-condition (#10) was too loose to implement against. That is a required lock, not a new chrome design. After §4, 开发 may start.

---

## 2. Adversarial findings

### R1 — Fluid vs flickering-grid (inner routes)

`FluidBackground.tsx` dynamically imports `@/scripts/webgl-fluid.js` and creates `canvas#background`. It is mounted only from `src/pages/index.astro`. `BaseLayout` does not import it. `NotesLayout` wrapping `BaseLayout` does **not** by itself load the sim.

Pre-patch A.2 allowed `canvas.flickering-grid-canvas` on inner banners. That is fine **only if** it is not the Pavel module and not `id="background"`. Homepage e2e asserts `canvas#background` count on `/` only, but a mistaken inner import still violates the fail-condition “fluid sim loaded on inner routes.”

**Lock (applied):** `NotesLayout`, `NotesBanner`, `notes.css`, and every inner route **must not** import `FluidBackground`, `webgl-fluid.js`, `fluid-control.ts`, `homepage.css`, or `IntroMotion`. They must not emit `canvas#background` or `id="background"`. Banner decoration is CSS (`--accent-color` grid) or a non-`#background` canvas. Reduced-motion: no flicker.

### R2 — Two headers / leftover `SearchTrigger` = two `#search-trigger`

Today the id exists in three files: `HomepageChrome.astro` (live on `/`), `Header.astro` (live on inner via `PageLayout`), unused `SearchTrigger.astro` (also binds its own ⌘K). They never share a first-paint tree **if** homepage stays off `Header` / `NotesLayout`.

A.4 allows rewrite **or** re-export. If both `Header.astro` and `NotesHeader.astro` render a trigger, or if `SearchTrigger.astro` is composed into the new bar, Playwright `click('#search-trigger')` and uniqueness fail.

`/search` currently mounts a **second** `SearchModal client:load` (no second trigger). Plan already removes that modal. A “plain button” on `/search` must not reuse `id="search-trigger"`.

**Lock (applied):** first paint of `/`, `/blog`, and `/search` each have exactly one `#search-trigger`. Do not `transition:persist` the trigger node. Persist only `lang-toggle`, `theme-toggle`, and `search-modal`. Never render `Header` and `NotesHeader` together. Do not remount `SearchTrigger.astro`.

### R3 — Schema test 4-href `deepEqual` (fail-condition #10)

Live test (`src/lib/homepage-schema.test.ts`):

```ts
assert.deepEqual(
  config.main.links.map((link) => link.href),
  ['/blog', '/about', `mailto:${joeCheung.email}`, joeCheung.github]
);
```

`createHomepageConfig` emits that same 4-tuple. `validConfig()` is the same 4 links. `links` is `.min(4)`. SuperRefine requires blog / about / mailto / github only.

Pre-patch F.5: “deep-equal hrefs **includes** `/gallery`” + I.2 “old four remain.” That can be implemented as:

- keep the 4-tuple `deepEqual` **and** `includes('/gallery')` → unit test red after Gallery lands; or
- keep the 4-tuple and drop Gallery from `createHomepageConfig` to stay green → fail-condition #10.

**Lock (applied):** **replace** the 4-href `deepEqual` with the locked 5-href list. `validConfig()` must include Gallery so parse fixtures stay valid. New omit-`/gallery` case. Do **not** leave any assertion that `createHomepageConfig().main.links` equals the old 4-array. `.min(4)` may stay as a floor (five required hrefs already force length ≥ 5).

Locked href order (unchanged from F.4, now the test oracle):

`/blog`, `/gallery`, `/about`, `mailto:…`, github.

### R4 — Dual-theme spec is a strict single-`h1` locator

`e2e/dual-theme-syntax-highlighting.spec.ts` does `page.goto('/blog/cmake-modern-targets')` then `expect(page.locator('h1')).toBeVisible()`. Playwright strict mode fails if two `h1`s exist (banner `h1.title` + `h1.post-card-title`, or `h1.header-title` + post title).

It also looks for `button` name `/Switch to (dark|light) mode/` and `.astro-code` border / radius ≥ 12 / box-shadow / overflow-x.

**Lock (applied):** post route emits **exactly one** `h1`, and it is `h1.post-card-title`. `.header-title` is not an `h1`. `banner="post"` emits no title heading. `ThemeToggle` stays in the top bar (not only in the drawer). `notes.css` does not restyle `.astro-code` / Shiki variables.

### R5 — `NotesLayout` must not be used on `/`

Fail-condition if homepage picks up drawer + fluid + a second search id. Plan already says do not wrap `/` in `NotesLayout`. Reinforce: `index.astro` keeps `BaseLayout` + `HomepageChrome` + `FluidBackground` + `SearchModal`. Footer on `/` may gain a Gallery href (phase 4) without changing the two-screen intro.

### R6 — Phase-1 `albums` import can 404 the build

B.3 uses `albums.length` in `NotesLayout` / `NotesMenu`. `src/data/album.ts` is a phase-4 file. Importing it in phase 1 before the file exists breaks `astro build`.

**Lock (applied):** phase 1 hardcodes `albumCount = 0` **or** lands the empty `album.ts` stub in phase 1 (data only). Do not import a missing module. `gallery.astro` still waits for phase 4.

### R7 — Client chrome still binds `#mobile-menu-btn`

`client-router-chrome.ts` toggles `#mobile-menu`. After the drawer lands, that node is gone. Plan A.5 already replaces the binding. Homepage has no `#menu-toggle` (390px homepage spec asserts **zero** menu/hamburger buttons). Binding must be a no-op when the node is missing — `?.addEventListener` already is.

**Lock (applied):** do not add `#menu-toggle` / hamburger `aria-label` to `HomepageChrome`.

### R8 — Gaps vs plan on `Card.astro`

Gaps said “adapt `Card.astro` to inner-list format.” Plan correctly **extracts** `NoteCard` and freezes the homepage `article>a` contract. Do not “upgrade” `Card.astro` to title + Read more (two anchors) — that would fail `card-link-structure` on Start Here.

No extra plan edit; I.3 already wins.

### R9 — `readingTime` mutation vs empty frontmatter

No post frontmatter sets `readingTime`. `[slug].astro` mutates `post.data`. Homepage `Card.astro` therefore often omits minutes. Plan C.4: local computed counts; do not mutate. Do not change `Card.astro` to require a new field.

### R10 — Not fail-conditions (checked, left as-is)

| Topic | Decision |
| --- | --- |
| `links.min(4)` | Floor can stay; five required hrefs imply length ≥ 5. |
| `DEPLOY_BASE` | Schema already uses `/blog` `/about` without prefix; Gallery follows that. User site base is `/`. |
| RelatedPosts 2-col `Card` | Restyle in D.2; not the `/blog` index fail-condition. |
| Pagination `/blog/page/n` | Dead path today (`totalPages === 1`). Out of scope. |
| Footer slim on `/` | Allowed; e2e does not assert footer grid. |
| `aside#notes-menu` vs live `aside#menu` | Intentional rename; e2e locks `#notes-menu`. |

---

## 3. Current-repo facts the plan got right

- Identity: Joe Cheung, `shortName` `JC`, CAE & HPC, no `supportAuthor`.
- `/` is `BaseLayout` + two-screen intro + `HomepageChrome` (`#search-trigger`) + `FluidBackground` + mounted `SearchModal`. Start Here is `#featured-notes` + `Card.astro`.
- Every other HTML route is `PageLayout` → sticky `Header` + `Footer` + `SearchModal`. `/blog` is `md:grid-cols-2` `Card` + 280px rail. No `/gallery`.
- `/search` double-mounts `SearchModal` (`PageLayout` idle + page `client:load`).
- `SearchTrigger.astro` is unused leftover with its own `#search-trigger` + keydown.
- `homepage-schema.test.ts` exact 4-href `deepEqual` is live and **will go red** the moment Gallery is appended unless the test is replaced.
- Dual-theme spec targets `/blog/cmake-modern-targets`, visible `h1`, `.astro-code`, `html.dark`.
- Search keyboard spec clicks `#search-trigger` on `/` **without enter**.
- Stack: Astro 5 + Tailwind + MDX + Preact + MiniSearch + zod. No Vue.
- `notes.css` tokens `--bg-primary` / `--accent-color` already exist on `:root` / `.dark` in `global.css`.

---

## 4. Required lock edits (applied to the plan)

1. **Schema tests.** Replace the 4-href `deepEqual`. Oracle is the F.4 5-list. `validConfig()` includes Gallery. Omit-`/gallery` throws. No leftover exact-4 assertion.
2. **Fluid isolation.** Inner tree must not import or emit the Pavel sim / `canvas#background` / `homepage.css`.
3. **Single `h1` on posts.** `h1.post-card-title` only. Protects dual-theme strict locator.
4. **Search uniqueness.** One trigger emitter per tree; no persist on the trigger; no `SearchTrigger.astro`; no hamburger on `HomepageChrome`.
5. **Phase-1 album count.** Hardcode `0` or stub `album.ts`; do not import a missing file.
6. **`notes.css` blast radius.** Do not restyle `#homepage`, `.homepage-*`, `canvas#background`, or `.astro-code`.

开发 must not start from the pre-patch F.5/I.2 wording.

---

## 5. What 开发 must lock (checklist)

- [ ] Joe Cheung / `JC`; no Simon avatar / `supportAuthor` / Comic Sans / Vue
- [ ] `/` stays two-screen + unique `#search-trigger` + `SearchModal` + Start Here `Card.astro`
- [ ] Inner routes: `NotesLayout` only; `PageLayout` deleted when grep is clean
- [ ] No fluid module / `canvas#background` on inner routes
- [ ] `/blog` is `ul.post-list` > `NoteCard`, not 2-col `Card`
- [ ] `/gallery` exists (empty album valid) and is required in schema + card + drawer
- [ ] Schema unit test 5-href `deepEqual`; old 4-tuple gone
- [ ] Post page: one `h1.post-card-title`; dual-theme `.astro-code` untouched
- [ ] Four existing e2e specs green; `notes-simonaking.spec.ts` added
- [ ] MDX bodies and `projects.ts` records untouched
- [ ] `design-upgrade` / stash unmixed

---

## 6. UI this phase

**None.** Review writes this file and lock-only patches on `docs/simonaking-inner-pages-plan.md`. No `src/` edits.
