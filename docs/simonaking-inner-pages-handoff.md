# SimonAKing inner pages — handoff

**Frozen agreed plan** (归档). 开发 implements this only. No new design.

| Field | Value |
| --- | --- |
| Branch | `refactor` (do not mix `design-upgrade` / stash / `gh-pages`) |
| Current phase | **测试** (done) |
| Next phase | — |
| Site identity | Joe Cheung · CAE & HPC Engineer (not SimonAKing) |
| Gaps | `docs/simonaking-inner-pages-gaps.md` (调研, done) |
| Plan | `docs/simonaking-inner-pages-plan.md` (计划, done; **post-review locks**) |
| Review | `docs/simonaking-inner-pages-review.md` (**PASS WITH REQUIRED LOCK EDITS**, done) |
| Stack | Astro 5 + Tailwind + MDX + Preact + MiniSearch + `data-lang` bilingual |
| Fonts | IBM Plex Sans + IBM Plex Mono only |
| UI this phase | Notes chrome already shipped; this phase is Playwright on `dist` + dual `astro build`. |

Phases done: **调研**, **计划**, **评审**, **归档**, **开发**, **测试**.

Port **LAYOUT and FORMAT** from live Simon notes chrome. Restyle with IBM Plex + existing bronze/dark tokens. Do **not** import Vue/Pug/Gulp/Less. Do **not** copy Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, or remote Simon CDN scripts.

---

## Chrome contract (`NotesLayout`)

Use `src/layouts/NotesLayout.astro` wrapping `BaseLayout` (same title/description/og/canonical/noIndex as today's `PageLayout`). Do **not** wrap `/` in `NotesLayout`. Do **not** call `PageLayout`. After every inner HTML route migrates, **delete** `src/layouts/PageLayout.astro`.

```
BaseLayout
  Homepage `/`     → HomepageChrome + fluid intro + main + Footer + SearchModal
  NotesLayout      → aside#notes-menu + header#header + header.content-header + <slot/> + slim Footer + SearchModal
    PostLayout     → NotesLayout (post banner) + article.post-article
```

| Region | Locked DOM | Behavior |
| --- | --- | --- |
| Left drawer | `aside#notes-menu` | 215px. Brand + social + stats + vertical nav. Overlay below `md`; persistent on desktop. |
| Top header | `header#header.top-header` | `#menu-toggle` · exactly one `#search-trigger` · `.header-title` · LangToggle · ThemeToggle. |
| Content header | `header.content-header` | Index: title + subtitle. Post: empty of title text. |
| Body | `<div class="notes-body">` + slot | Page-specific. |
| Footer | `Footer.astro` | Slim Joe identity. Gallery in Site links (phase 4 with `/gallery`). |
| Search | one `SearchModal client:idle` `transition:persist="search-modal"` | MiniSearch as today. |

Desktop: notes wrap `padding-left: 215px`. 390px: padding 0; drawer closed until `#menu-toggle`.

**Search uniqueness:** first paint of `/`, `/blog`, and `/search` each have exactly one `#search-trigger`. Do **not** persist the trigger node. Persist only `lang-toggle`, `theme-toggle`, `search-modal`. Never render `Header` and `NotesHeader` together. Do not remount `SearchTrigger.astro`. `/search` must not add a second modal or reuse `id="search-trigger"` on a spare button.

**Homepage `/`:** stays `BaseLayout` + two-screen fluid intro + `HomepageChrome` + `FluidBackground` + `SearchModal` + Start Here `Card.astro`. `HomepageChrome` is search + Lang + Theme only — **no** `#menu-toggle` / hamburger `aria-label`.

**Fluid isolation:** `NotesLayout`, `NotesBanner`, `notes.css`, and inner routes **must not** import `FluidBackground`, `webgl-fluid.js`, `fluid-control.ts`, `homepage.css`, or `IntroMotion`. They **must not** emit `canvas#background` or `id="background"`. Banner is CSS `--accent-color` grid or a non-`#background` canvas. Reduced-motion: no flicker.

**Drawer (top → bottom):** `JC` + `Joe Cheung` (no photo) → Email / GitHub / X only → stats (notes, tags, album; album may be `0`) → nav:

`/` Home/主页 · `/blog` Notes/笔记 · `/tags` Tags/标签 · `/languages` Languages/语言 · `/gallery` Gallery/相册 · `/projects` Projects/项目 · `/about` About/关于

Lang/Theme live in the top bar, not duplicated in the drawer.

**Banner prop:** `index` | `post` | `tags` | `quiet`. Post banner emits **no** heading. `.header-title` is `p`/`span`/`div`, never `h1`.

**Client chrome:** keep `#search-trigger` → `open-search` and ⌘K. Replace `#mobile-menu-btn` with `#menu-toggle` toggling `aside#notes-menu.is-open`. Missing node on homepage is a no-op.

Phase 1 album count: hardcode `0` **or** stub empty `src/data/album.ts`. Do not import a missing module.

---

## Notes card contract

`/blog` (and tag/language **detail**): drop 2-col `Card.astro` + 280px rail. Centered:

```
ul.post-list
  article.article-card
    div.post-cover > div.canvas-cover   ← 175px; build-time SVG from coverFromSlug(slug)
    h3.post-title > a[href=/blog/{slug}]
    p.post-meta                         ← date · reading time · word count
    p.post-excerpt
    a.post-more                         ← i18n-en Read more / i18n-zh 阅读全文
    footer.post-tags
```

Title `a` + Read more `a` is **allowed off `/`**. Homepage Start Here **stays** `Card.astro` (`article` → one non-empty `a`). Do not upgrade `Card.astro` to two anchors.

Cover: `src/lib/note-cover.ts` — same slug → same `NoteCover`; no `Math.random()`. Word count: `src/lib/word-count.ts`; `readingTime.ts` delegates; do **not** mutate `post.data` in `[slug].astro`.

**Post page:** exactly one `h1` = `h1.post-card-title`. `article.post-article > .post-card` + `aside.post-toc` `nav#post-toc`. Keep MDX, dual-theme `.astro-code` in `global.css` (do not restyle in `notes.css`). Canonical: `/blog/cmake-modern-targets`. RelatedPosts → `NoteCard`, not `Card` grid.

---

## Album contract

- `src/data/album.ts`: `albums: AlbumItem[] = []` is valid. Do not invent photos or hotlink Simon.
- `src/pages/gallery.astro` + `NotesLayout` + `album-state.ts` bilingual empty state.
- First-class: drawer nav, drawer stats, Footer (phase 4), homepage identity card.
- Stay in Astro. No AnimatedGallery / Vue / GitHub-corner.

---

## Homepage Gallery link

`createHomepageConfig` / schema `superRefine` **replace** the 4-href oracle. Locked order:

`/blog`, `/gallery`, `/about`, `mailto:…`, github  
Blog/笔记, Gallery/相册, About/关于, Email/邮箱, GitHub/GitHub

`index.astro` already maps `main.links` — **no two-screen structural change**. Do not add Thoughts / Thinking / Projects to the card.

**Schema tests:** delete exact-4 `deepEqual`. New 5-tuple; `validConfig()` includes Gallery; omit `/gallery` throws; keep `supportAuthor` rejection and `avatar` unset. `.min(4)` may stay as a floor.

---

## Files to touch

### Add

`NotesLayout.astro` · `NotesMenu.astro` · `NotesHeader.astro` (or rewrite `Header.astro`) · `NotesBanner.astro` · `NoteCard.astro` · optional `PostCard.astro` · `gallery.astro` · `album.ts` · `notes.css` · `note-cover.ts` + test · `word-count.ts` + test · `album-state.ts` + test · `e2e/notes-simonaking.spec.ts`

### Edit

`PostLayout.astro` · `Header.astro` · `Footer.astro` · `TOC.astro` · `RelatedPosts.astro` · `PrevNext.astro` · `blog/index.astro` · `blog/[slug].astro` · tags / languages pages · `projects.astro` · `about.astro` · `search.astro` (remove extra SearchModal) · `404.astro` · `index.astro` (config only) · `homepage-schema.ts` + test · `readingTime.ts` · `client-router-chrome.ts` · additive Gallery assert in `homepage-simonaking.spec.ts`

Delete `PageLayout.astro` when grep is clean.

---

## E2E contracts

Playwright on **built** `dist`. New `e2e/notes-simonaking.spec.ts`:

1. `/blog`: `#notes-menu`, `article.article-card` ≥ 1, `.canvas-cover`, Read more + 阅读全文, tags, `#search-trigger` count 1, `canvas#background` count 0
2. `/gallery`: not 404, `#notes-menu`, empty bilingual state when `albums` is `[]`
3. `/blog/cmake-modern-targets`: `h1.post-card-title`, `h1` count 1, `canvas#background` 0
4. 390px `/blog`: drawer closed; `#menu-toggle` opens/closes
5. `/` after enter: `.homepage-card-nav` Gallery (`/gallery`, `/Gallery|相册/`)

Must stay green (do not weaken): `e2e/homepage-simonaking.spec.ts`, `e2e/card-link-structure.spec.ts`, `e2e/search-keyboard-shortcuts.spec.ts`, `e2e/dual-theme-syntax-highlighting.spec.ts`. Do **not** change search specs to “enter first”.

---

## Do not touch

- `src/content/posts/**/*.mdx` bodies
- `src/data/projects.ts` record semantics
- Homepage intro / fluid / `HomepageChrome` / `Card.astro` `article>a` (except Gallery on the card)
- `SearchModal.tsx` behavior; remounting `SearchTrigger.astro`
- Vue / Pug / Gulp / Less, Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, remote Simon scripts
- `design-upgrade` / stash / `gh-pages`
- Archives, Weibo, Thinking, WeChat, Live2D, Disqus, dummy photos

---

## 开发 order

1. **Chrome** — `notes.css`, menu/header/banner, `NotesLayout` + SearchModal, drawer toggle, cut inner routes off `PageLayout`, albumCount 0 or stub `album.ts`. Footer Gallery waits for phase 4.
2. **Notes list** — word-count + cover (TDD) + `NoteCard` + `/blog` `ul.post-list`.
3. **Post** — empty banner, one `h1.post-card-title`, TOC, PrevNext/RelatedPosts.
4. **Other pages + album** — `gallery`, taxonomies NoteCard, projects/about/search/404, schema Gallery, Footer, delete `PageLayout`.
5. **Tests** — `notes-simonaking.spec.ts`, additive homepage Gallery assert, `test:unit` + `build` + `test:e2e`.

---

## What 开发 must lock (checklist)

- [x] Joe Cheung / `JC`; no Simon avatar / `supportAuthor` / Comic Sans / Vue
- [x] `/` stays two-screen + unique `#search-trigger` + `SearchModal` + Start Here `Card.astro`
- [x] Inner routes: `NotesLayout` only; `PageLayout` deleted when grep is clean
- [x] No fluid module / `canvas#background` on inner routes
- [x] `/blog` is `ul.post-list` > `NoteCard`, not 2-col `Card`
- [x] `/gallery` exists (empty album valid) and is required in schema + card + drawer
- [x] Schema unit test 5-href `deepEqual`; old 4-tuple gone
- [x] Post page: one `h1.post-card-title`; dual-theme `.astro-code` untouched
- [x] Four existing e2e specs green; `notes-simonaking.spec.ts` added
- [x] MDX bodies and `projects.ts` records untouched
- [x] `design-upgrade` / stash unmixed

---

## 测试 results (2026-08-19)

Shipped path: Playwright `page.goto` against `playwright.config.ts` (`npx serve dist -p 4321`). Specs read DOM, not remembered titles.

| Check | Result |
| --- | --- |
| `npm run test:unit` | **pass** — 42 tests, 0 fail |
| `npm run build` (1) | **exit 0** — 37 pages |
| `npm run build` (2) | **exit 0** — 37 pages; `dist/index.html` 51007 B; `dist/blog/index.html` 42649 B; `dist/gallery/index.html` 33585 B; `dist/projects/index.html` 44998 B; `dist/about/index.html` 36536 B |
| `npm run test:e2e` | **pass** — 24 tests, 0 fail (8.9s chromium) |

E2E files:

- `e2e/notes-simonaking.spec.ts` (new): `/blog` `#notes-menu` + `article.article-card` ≥ 1 + cover + non-empty `a.post-more` (Read more / 阅读全文) + tag link + unique `#search-trigger` + no `canvas#background`; first card title click → `h1.post-card-title` / `article.post-article`; `/gallery` `#album-page` + Gallery/相册 nav; reduced-motion `/` `.homepage-card-nav` Gallery → `/gallery`; 390px `/blog` `#menu-toggle` opens/closes Notes nav
- Existing kept green: `e2e/homepage-simonaking.spec.ts`, `e2e/card-link-structure.spec.ts`, `e2e/search-keyboard-shortcuts.spec.ts`, `e2e/dual-theme-syntax-highlighting.spec.ts`

Fix applied during 测试 (implementation, not spec deletion): overlay `#notes-menu` no longer covers `#menu-toggle` (header `z-index: 55`; overlay menu `top: 52px`). `NoteCard` ships `p.post-excerpt` and `footer.post-tags`.
