# SimonAKing inner pages — frozen implementation plan

Status: **frozen** (this phase is the plan only; **do not implement UI in this commit**).  
Source: `docs/simonaking-inner-pages-gaps.md` + current `src/` (verified 2026-08-19).  
Review: `docs/simonaking-inner-pages-review.md` (**PASS WITH REQUIRED LOCK EDITS**, applied below). 开发 must not start from a pre-review copy.  
Branch: `refactor`. Do not checkout, merge, rebase, or mix `design-upgrade` leftovers.  
Identity: **Joe Cheung · CAE & HPC**. Never SimonAKing persona, avatar, or `supportAuthor`.  
Stack: keep **Astro 5 + Tailwind + MDX + Preact + MiniSearch + `data-lang` bilingual**. IBM Plex only.

Port **LAYOUT and FORMAT** from live Simon notes chrome. Restyle with IBM Plex + existing bronze/dark `notion-*` tokens and `:root` / `.dark` CSS variables. Do **not** import Vue / Pug / Gulp / Less. Do **not** copy Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, or remote Simon CDN scripts.

Homepage two-screen intro (`src/pages/index.astro`) is **already shipped**. This plan only adds a Gallery link on the identity card and replaces inner-page Notion chrome.

开发 must follow §9 order. 测试 must keep existing homepage e2e green.

---

## 0. Non-negotiables

| Lock | Rule |
| --- | --- |
| Identity | Joe Cheung. Monogram **JC** (`siteConfig.shortName`). No stolen avatar. |
| Homepage | Stays `BaseLayout` + two-screen fluid intro + `HomepageChrome` + mounted `SearchModal`. Do not wrap `/` in `NotesLayout`. |
| Inner chrome | New `NotesLayout` wrapping `BaseLayout`. Every HTML inner route leaves `PageLayout`. |
| Search | Exactly one `#search-trigger` on first paint of `/` **and** on first paint of each inner page. `SearchModal` stays mounted. Do not remount unused `SearchTrigger.astro`. |
| Bilingual | `data-lang` + `.i18n-en` / `.i18n-zh`. No JS string tables for chrome labels. |
| Content | Do not rewrite MDX bodies under `src/content/posts/`. Do not change `src/data/projects.ts` record semantics. |
| Fonts | IBM Plex Sans + IBM Plex Mono only. No Comic Sans / Roboto / Fira Code / Inter. |
| Dark mode | `html.dark` + existing tokens. Notes CSS uses the same variables. |
| Reduced motion | No flickering canvas animation. Cover + banner are static (or unanimated) when `prefers-reduced-motion: reduce`. |
| Paths | Keep Joe routes: `/blog`, `/tags`, `/languages`, `/projects`, `/about`, `/search`, `/gallery` (new). Do **not** move tags to `/blog/tags`. |
| Drop | Weibo / Thoughts, Thinking, WeChat, Live2D, color picker, Disqus, TermFolio, FolioSpace, AnimatedGallery SPA, Simon `#mes` 404. |
| Fluid isolation | Pavel sim is homepage-only. `NotesLayout`, `NotesBanner`, `notes.css`, and every inner route **must not** import `FluidBackground`, `webgl-fluid.js`, `fluid-control.ts`, `homepage.css`, or `IntroMotion`. They **must not** emit `canvas#background` or `id="background"`. Banner decoration is CSS (`--accent-color` grid) or a non-`#background` canvas. |
| Schema test | After Gallery lands, **replace** (do not keep) the live 4-href `deepEqual` in `src/lib/homepage-schema.test.ts`. Oracle is the F.4 five-href list. No test may still assert `['/blog','/about',mailto,github]` as the full `createHomepageConfig` href array. |
| Post `h1` | `/blog/[slug]` first paint has **exactly one** `h1`: `h1.post-card-title`. `.header-title` is a `p` / `span` / `div`, never `h1`. `banner="post"` emits no heading. Protects `e2e/dual-theme-syntax-highlighting.spec.ts` (`page.locator('h1').toBeVisible()` is strict). |
| Search persist | Do **not** `transition:persist` the `#search-trigger` node. Persist only `lang-toggle`, `theme-toggle`, and `search-modal`. Never render `Header.astro` and `NotesHeader.astro` in the same tree. Do not remount `SearchTrigger.astro`. |
| Homepage chrome | `HomepageChrome` stays search + Lang + Theme only. Do **not** add `#menu-toggle` or a menu/hamburger `aria-label` (390px homepage e2e asserts count 0). |

---

## 1. Locked name: `NotesLayout` (not `InnerLayout`)

Use **`src/layouts/NotesLayout.astro`**.

It wraps `BaseLayout` directly (same contract as today's `PageLayout`: title / description / og / canonical / noIndex). It does **not** wrap or call `PageLayout`.

After every inner route migrates, **delete** `src/layouts/PageLayout.astro`. Do not leave a Notion sticky-header shell that a future page can import by habit.

```
BaseLayout
  Homepage `/`     → HomepageChrome + fluid intro + main + Footer + SearchModal
  NotesLayout      → aside#notes-menu + header#header + header.content-header + <slot/> + slim Footer + SearchModal
    PostLayout     → NotesLayout (post banner) + article.post-article
```

`PostLayout.astro` switches its shell from `PageLayout` to `NotesLayout`. MDX render / prev / next / related data stay in `src/pages/blog/[slug].astro`.

---

## A. Inner chrome

### A.1 Shell regions (every inner route)

| Region | Locked DOM | Behavior |
| --- | --- | --- |
| Left drawer | `aside#notes-menu` | 215px. Brand + social + stats + vertical nav. Overlay/off-canvas below `md`; persistent on desktop. |
| Top header | `header#header.top-header` | `#menu-toggle` · exactly one `#search-trigger` · `.header-title` · LangToggle · ThemeToggle. |
| Content header | `header.content-header` | Banner. Index pages: title + subtitle. Post pages: empty of title text (title lives in `.post-card-title`). |
| Body | `<div class="notes-body">` + default slot | Page-specific content. |
| Footer | existing `Footer.astro` | Slim Joe identity line. Add Gallery to Site links. |
| Search | one `SearchModal client:idle` with `transition:persist="search-modal"` | Same MiniSearch index mapping as `PageLayout` today. |

Desktop: `#main` / notes wrap gets `padding-left: 215px`.  
390px: padding-left 0; drawer closed until `#menu-toggle`.

### A.2 `NotesLayout` props

```ts
interface NotesLayoutProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  headerTitle?: string;          // .header-title; default site author
  banner?: 'index' | 'post' | 'tags' | 'quiet';
  bannerTitleEn?: string;
  bannerTitleZh?: string;
  bannerSubtitleEn?: string;
  bannerSubtitleZh?: string;
}
```

| `banner` | Used by | Content-header |
| --- | --- | --- |
| `index` | `/blog`, `/gallery`, `/projects`, `/about`, `/search`, `/languages`, `/languages/[lang]` | `.content-header.index-header` with `h1.title` + `.subtitle` |
| `tags` | `/tags`, `/tags/[tag]` | `.content-header.tags-header` with title/subtitle (no physics `card-pool`) |
| `post` | `/blog/[slug]` | `.content-header.post-header` — canvas/grid only, **no** title text |
| `quiet` | `404` | Empty/quiet banner, no flicker |

Banner decorative layer is a CSS grid using `--accent-color` (optional `<canvas class="flickering-grid-canvas">` only when motion is allowed). That canvas **must not** be `id="background"` and **must not** import `webgl-fluid.js`. Under `prefers-reduced-motion: reduce` the layer is a static grid; **no flickering animation**.

### A.3 Pieces (small files)

| File | Role |
| --- | --- |
| `src/layouts/NotesLayout.astro` | Compose menu + header + banner + slot + Footer + SearchModal. Import `src/styles/notes.css`. |
| `src/components/notes/NotesMenu.astro` | `aside#notes-menu` |
| `src/components/notes/NotesHeader.astro` | Rewrite target of today's `Header.astro` (see A.4) |
| `src/components/notes/NotesBanner.astro` | `header.content-header` |
| `src/components/notes/NoteCard.astro` | `article.article-card` for lists |
| `src/components/notes/PostCard.astro` | `article.post-article > .post-card` (optional extract from PostLayout) |

Keep files focused (<400 lines). Do not dump drawer + banner + list into one 800-line layout.

### A.4 Fate of `Header.astro`

Today `Header.astro` is the Notion sticky 64px bar (Home / Projects / Notes / About + `#search-trigger` + Lang + Theme + `#mobile-menu-btn`). Homepage does **not** use it (`HomepageChrome` does).

Lock: **rewrite** `src/components/navigation/Header.astro` into the notes top bar (`header#header`) **or** replace its body by re-exporting `NotesHeader.astro`. Either way:

- Horizontal Notion nav goes away (nav lives in the drawer).
- `#mobile-menu-btn` / `#mobile-menu` go away; replaced by `#menu-toggle` + `#notes-menu`.
- Gallery is a first-class inner-nav item (drawer), not a fifth sticky-bar pill.
- `LangToggle` + `ThemeToggle` stay in this top bar so they are visible at 390px without opening the drawer (dual-theme e2e looks for the theme button on `/blog/cmake-modern-targets`).
- Exactly one `#search-trigger` here on inner pages.
- After the rewrite, the inner page tree emits `#search-trigger` from **exactly one** file (`NotesHeader.astro` **or** rewritten `Header.astro`, not both).

Do not keep two headers. Do not compose `SearchTrigger.astro` into either file.

### A.5 Client chrome rebind

`src/scripts/client-router-chrome.ts` today binds `#search-trigger` click → `open-search`, ⌘K, and `#mobile-menu-btn`.

Lock:

- Keep `#search-trigger` → `open-search` and ⌘K (`isSearchHotkey`).
- Replace mobile-menu binding with `#menu-toggle` toggling `aside#notes-menu.is-open` (and `body` scroll lock optional).
- Homepage has no `#menu-toggle`; binding is a no-op there.
- Do not attach a second keydown listener from `SearchTrigger.astro`.

---

## B. Sidebar nav

### B.1 Drawer contents (top → bottom)

1. **Brand wrap** — `JC` monogram (bordered square, IBM Plex Mono) + `#name` = `Joe Cheung`. Link to `/`. No photo, no Simon avatar.
2. **Social row** — Email (`mailto:zhangchao.simzc@outlook.com`), GitHub (`siteConfig.social.github`), X (`siteConfig.social.x`). Those three only. No WeChat.
3. **`.statistics`** — three counts, bilingual labels:
   - notes / 笔记 = published post count (`getCollection('posts')`, draft filter same as today)
   - tags / 标签 = unique tag count
   - album / 相册 = `albums.length` (may be `0`)
4. **Vertical `.nav`** — exact items, exact hrefs:

| href | `i18n-en` | `i18n-zh` |
| --- | --- | --- |
| `/` | Home | 主页 |
| `/blog` | Notes | 笔记 |
| `/tags` | Tags | 标签 |
| `/languages` | Languages | 语言 |
| `/gallery` | Gallery | 相册 |
| `/projects` | Projects | 项目 |
| `/about` | About | 关于 |

Active state: current `Astro.url.pathname` (prefix match for nested `/blog/*`, `/tags/*`, `/languages/*`).

5. **Do not put Lang/Theme in the drawer** if they already live in the top header. One pair of islands, persisted (`transition:persist="lang-toggle"` / `"theme-toggle"`). Duplicating Preact islands causes two toggles and a11y-name collisions.

### B.2 Search trigger (inner)

`#search-trigger` in `header#header`:

- `type="button"`
- `aria-label` containing `search` (homepage e2e on `/` uses `/search/i`; inner should match the same accessible name pattern)
- Click opens the **existing** `SearchModal` via `open-search` (already wired in `client-router-chrome.ts`)
- Visual may look like Simon's `#search-wrap`, but it must **not** introduce a second id (`#search`, `#key`, or `SearchTrigger.astro`'s `#search-trigger`)
- `/search` page: **no** extra `#search-trigger`; a plain button may dispatch `open-search` without that id

### B.3 Stats computation (pure, in layout)

Compute once in `NotesLayout` / `NotesMenu`:

```ts
const posts = await getCollection('posts', ({ data }) =>
  import.meta.env.PROD ? !data.draft : true
);
const postCount = posts.length;
const tagCount = new Set(posts.flatMap((p) => p.data.tags)).size;
const albumCount = albums.length;
```

Do not hardcode `6`. Album count of `0` is valid.

Phase 1: hardcode `albumCount = 0` **or** land empty `src/data/album.ts` in phase 1 (data stub only). Do **not** import `albums` from a file that does not exist yet. `gallery.astro` still waits for phase 4.

---

## C. Notes index `/blog`

### C.1 Drop

- `PageLayout`
- 2-col `Card.astro` grid
- 280px right Languages/Tags rail (those are drawer destinations)
- CTA “Read note →”

Keep the `posts` collection, newest-first sort, and draft filter. Pagination links may stay if `totalPages > 1`; current corpus is one page (`postsPerPage = 10`, 6 posts).

### C.2 List format

Centered single column:

```
ul.post-list
  article.article-card   × N (N ≥ 1 with current MDX)
```

Extract **`NoteCard.astro`**. Do **not** reuse `Card.astro` here.

`NoteCard` structure (locked class names for e2e):

```
article.article-card
  div.post-cover
    div.canvas-cover          ← 175px tall; deterministic cover from slug
  h3.post-title
    a[href=/blog/{slug}]
  p.post-meta                 ← date · reading time · word count
  p.post-excerpt              ← frontmatter description
  a.post-more[href=/blog/{slug}]
    span.i18n-en Read more
    span.i18n-zh 阅读全文
  footer.post-tags            ← tag links
```

Title `a` + Read more `a` is **allowed off `/`**. Homepage Start Here **must stay** `Card.astro` (`article` → one non-empty `a`) so `e2e/card-link-structure.spec.ts` stays green.

### C.3 Deterministic canvas cover

New pure helper `src/lib/note-cover.ts`:

```ts
export function hashSlug(slug: string): number
export type NoteCover = { hue: number; sat: number; seed: number; pattern: number }
export function coverFromSlug(slug: string): NoteCover
```

Rules:

- Same slug → same `NoteCover` (stable across builds).
- Output ranges are documented and unit-tested (`hue` 0–360, etc.).
- `NoteCard` paints `.canvas-cover` at **build time** from `coverFromSlug(post.slug)`: inline SVG (or a static canvas `data-*` snapshot). Prefer SVG so `dist/` e2e sees the cover **without** client JS.
- Optional client canvas animation is **out**. Reduced-motion must not flicker. No random `Math.random()` in the paint path.
- Height **175px** (`.article-card .post-cover` / `.canvas-cover`).

Unit test `src/lib/note-cover.test.ts` (picked up by existing `test:unit` glob `src/lib/*.test.ts`):

- `hashSlug('cmake-modern-targets') === hashSlug('cmake-modern-targets')`
- different slugs differ
- `coverFromSlug` is a pure function of slug (deep equal on two calls)
- hue in range

Do **not** snapshot a live post's pixels.

### C.4 Word count helper

New pure helper `src/lib/word-count.ts`:

```ts
export function countWords(content: string): number
```

Cleaning rules (lock to match today's `calculateReadingTime` stripping): drop fenced code, inline code, HTML tags, images, markdown chrome; then split on whitespace. Empty / whitespace-only → `0`.

`src/utils/readingTime.ts` **delegates** to `countWords` for the numeric core (`Math.max(1, ceil(count / wpm))`). Do not duplicate the strip regex. Do **not** mutate `post.data.readingTime` in `[slug].astro` (current mutation is a style violation); compute a local `readingTime` / `wordCount` and pass it in.

`NoteCard` meta shows word count from `countWords(post.body ?? '')` (and existing minutes via `formatReadingTime`).

Unit test `src/lib/word-count.test.ts`:

- **Do not hardcode expected counts from live MDX files.**
- Drive the real function with a **fixture string constructed in the test**.
- Assert determinism: `countWords(fixture) === countWords(fixture)`.
- Assert behavior from tokens the test itself built, e.g. `const words = ['Alpha','beta','gamma']; countWords(words.join(' ')) === words.length`.
- Assert fences are ignored: fixture with a ` ``` ` block plus known surviving tokens.
- Assert `countWords('') === 0` and `countWords('   ') === 0`.

### C.5 Read more i18n

Locked copy, no other synonyms:

- `.i18n-en` → `Read more`
- `.i18n-zh` → `阅读全文`

E2E will look for both strings in `/blog` HTML (zh copy may be `display:none` when `data-lang=en`).

---

## D. Post page `/blog/[slug]`

### D.1 Keep

- `post.render()` MDX `Content` + `headings`
- Frontmatter semantics (title, description, dates, tags, language, featured, draft)
- Prev/next computation
- Related-posts scoring (language + shared tags, top 4)
- Dual-theme Shiki (`astro.config.mjs` github-light / github-dark, `defaultColor: false`)
- `.prose-custom` + `.astro-code` CSS in `global.css` (do not restyle away borders / radius / box-shadow — `e2e/dual-theme-syntax-highlighting.spec.ts` asserts those)

### D.2 Restyle

`PostLayout` uses `NotesLayout` with `banner="post"` and `headerTitle={post.data.title}`.

On `/blog/[slug]`, emit **exactly one** `h1` (`h1.post-card-title`). `.header-title` in `header#header` is a `p` / `span` / `div`, never `h1`. `banner="post"` content-header contains no heading. This keeps `e2e/dual-theme-syntax-highlighting.spec.ts` `page.locator('h1')` strict-mode green.

```
article.post-article
  div.post-card
    h1.post-card-title          ← e2e + dual-theme `h1` locator
    .post-card-meta             ← date, updated, reading time, word count
    tags
    aside.post-toc
      nav#post-toc              ← restyle of TOC.astro; keep heading data (h2/h3)
    div.prose-custom
      <slot/>                   ← MDX
  PrevNext                      ← keep data; restyle borders to notes tokens (no Disqus)
  RelatedPosts                  ← switch from Card.astro grid to NoteCard / compact post-list
```

`TOC.astro` keeps the IntersectionObserver active-link behavior. Visual: `aside.post-toc`, not a gray Notion box in a 280px right column. On small viewports the TOC stacks inside the post-card (or hides below `md`); dual-theme spec only needs `h1` + `.astro-code` visible — do not hide the title.

Canonical post for syntax e2e: **`/blog/cmake-modern-targets`**. That page must still have visible `h1.post-card-title` and at least one `.astro-code` whose light/dark backgrounds flip via `html.dark`.

Do not rewrite the MDX body of `cmake-modern-targets.mdx` or any other post.

---

## E. Other inner routes (same chrome)

All of these drop `PageLayout` and wrap `NotesLayout`.

| Route | File | Banner | Body |
| --- | --- | --- | --- |
| `/tags` | `src/pages/tags/index.astro` | `tags` | Tag list/cloud restyled to notes cards (no 3-col gray Notion tiles). Keep `/tags` path and tag data. |
| `/tags/[tag]` | `src/pages/tags/[tag].astro` | `tags` | Title `标签: {tag}` / `Tag: {tag}`. **`ul.post-list` of `NoteCard`**, not `Card.astro` grid. Keep filter + related-tag chips. |
| `/languages` | `src/pages/languages/index.astro` | `index` | Joe-only taxonomy. Restyle language tiles; keep `/languages` path. Drawer already links here. |
| `/languages/[lang]` | `src/pages/languages/[lang].astro` | `index` | **`NoteCard` list**, not 3-col `Card.astro`. Keep filter. |
| `/projects` | `src/pages/projects.astro` | `index` | Same `projects` array. Notes chrome around the existing list. Do **not** copy FolioSpace / GitHub-corner. Do not change blurb/tag/github fields. |
| `/about` | `src/pages/about.astro` | `index` | Keep Joe bilingual prose. Notes chrome. Do not copy TermFolio. |
| `/search` | `src/pages/search.astro` | `index` | Thin entry: tips + popular topics dispatch `open-search`. **Remove the second** `<SearchModal client:load>`. **No second `#search-trigger`**. MiniSearch stays the one modal from `NotesLayout`. |
| `404` | `src/pages/404.astro` | `quiet` | Notes chrome. Keep Home / Browse Notes CTAs, bilingual. Do not copy Simon `#mes` / CDN 404. |

`/tags` and `/languages` indexes are taxonomies, not post lists — they do not need `article.article-card`. **Tag detail and language detail do.**

---

## F. New `/gallery`

### F.1 Data

New `src/data/album.ts`:

```ts
export type AlbumItem = {
  src: string;
  altEn: string;
  altZh: string;
  captionEn?: string;
  captionZh?: string;
};

export const albums: AlbumItem[] = []; // may stay empty
```

Empty is a valid ship state. Do not invent photos or hotlink Simon's album.

### F.2 Empty-state helper

New `src/lib/album-state.ts`:

```ts
export function isAlbumEmpty(items: readonly { src: string }[]): boolean
export function albumEmptyCopy(): { en: string; zh: string }
```

`isAlbumEmpty` is `items.length === 0`. Copy is bilingual, Joe-voiced (not Simon). Unit test `src/lib/album-state.test.ts` covers `[]` → empty, one item → not empty, and both language strings non-empty.

`src/pages/gallery.astro` uses `NotesLayout` + this helper. When empty, render the bilingual empty state (`.i18n-en` / `.i18n-zh`). When non-empty, CSS masonry/grid (`columns` or `grid`) inspired by AnimatedGallery **layout only**. Stay in Astro. No Vue, no GitHub-corner, no remote scripts.

### F.3 First-class nav

Gallery is required in **all** of:

- drawer vertical nav (`/gallery`)
- drawer stats (`albumCount`)
- `Footer.astro` Site links
- rewritten inner `Header` only inasmuch as the chrome includes the drawer (no extra sticky pill required)
- **homepage identity card** via `homepageConfig.main.links`

### F.4 Homepage schema (required extra)

`src/lib/homepage-schema.ts` `superRefine` **keeps** the four existing required hrefs and **adds** `/gallery`:

1. `/blog`
2. `/about`
3. `mailto:`
4. github
5. **`/gallery` (new, required)**

`createHomepageConfig` inserts the Gallery link. Locked default `main.links` order:

```
/blog          Blog / 笔记
/gallery       Gallery / 相册
/about         About / 关于
mailto:…       Email / 邮箱
github         GitHub / GitHub
```

Do **not** add Thoughts / Thinking / Projects to the identity card (Projects stays in Selected work + drawer).

`src/pages/index.astro` already maps `main.links` — **no two-screen structural change**. Only the config grows.

### F.5 Schema tests (lock)

Update `src/lib/homepage-schema.test.ts`. This **replaces** the live 4-href assertion; it does not sit beside it.

- **Delete** the `createHomepageConfig` href `deepEqual` that currently expects
  `['/blog', '/about', mailto, github]` (length 4). That assertion **must not remain**.
- New expected hrefs (exact order, length 5):
  `['/blog', '/gallery', '/about', \`mailto:${email}\`, github]`
- `validConfig().main.links` must include `{ href: '/gallery', textEn: 'Gallery', textZh: '相册' }` in that same order so parse fixtures stay valid.
- Existing rejection of missing `/blog` (etc.) **remains**.
- New case: omit `/gallery` → throws `/main.links must include \/gallery/`.
- Keep `supportAuthor` rejection and `avatar` unset.
- Do **not** add or keep any test that `createHomepageConfig().main.links` has length 4, or that `deepEqual`s the old 4-tuple, after Gallery is required.
- `links.min(4)` may stay as a floor; the five required hrefs already force length ≥ 5.

`e2e/homepage-simonaking.spec.ts` 390px card-nav already asserts Blog / About / Email / GitHub and `>= 4` links — adding Gallery keeps that green. Still add an explicit Gallery assertion (see H) so the extra cannot silently disappear.

---

## G. CSS

New **`src/styles/notes.css`**, imported from `NotesLayout` only (not from `BaseLayout` / homepage). Homepage keeps `homepage.css`.

Use existing variables from `global.css`:

```css
:root { --bg-primary; --bg-secondary; --text-primary; --text-secondary; --border-color; --accent-color; }
.dark { /* same names, dark values */ }
```

Plus Tailwind `notion-*` where components still use utility classes.

Locked numbers:

| Token | Value |
| --- | --- |
| Drawer width | `215px` |
| Cover height | `175px` |
| Font | inherit IBM Plex from `body` / `tailwind.config.mjs` |
| Dark | `.dark` on `html` |

Rules:

- `#notes-menu { width: 215px }`
- desktop notes wrap `padding-left: 215px`; 390px `padding-left: 0`
- `.article-card .post-cover, .canvas-cover { height: 175px }`
- `.post-list` max-width centered, not `md:grid-cols-2`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables banner flicker / any cover animation
- No Comic Sans, no Simon CDN `@font-face`

Do not restyle `.astro-code` in `notes.css` in a way that breaks dual-theme (leave Shiki hooks in `global.css`).

`notes.css` must not restyle `#homepage`, `.homepage-*`, `canvas#background`, or Shiki / `.astro-code` variables (border, radius, box-shadow, overflow-x). Namespaced selectors only (`#notes-menu`, `.post-list`, `.article-card`, `.content-header`, …).

---

## H. Tests

Playwright already serves **built** `dist` (`npx serve dist -p 4321`). New e2e runs the same way. Unit tests stay `node --test --experimental-strip-types src/lib/*.test.ts`.

### H.1 Unit (new + updated)

| File | Asserts |
| --- | --- |
| `src/lib/note-cover.test.ts` | slug hash determinism, range, inequality across slugs |
| `src/lib/word-count.test.ts` | fixture-driven `countWords`; **no live MDX magic numbers** |
| `src/lib/album-state.test.ts` | empty vs non-empty; bilingual copy strings present |
| `src/lib/homepage-schema.test.ts` | **Replace** the 4-href `deepEqual` with the F.4 5-tuple; `validConfig()` includes Gallery; omit-`/gallery` throws; blog/about/mailto/github still required. No remaining exact-4 assertion. |

### H.2 New e2e `e2e/notes-simonaking.spec.ts`

All against built dist. Locked cases:

1. **`/blog` notes chrome**
   - `aside#notes-menu` attached
   - `article.article-card` count **≥ 1**
   - `.canvas-cover` attached (at least one)
   - `Read more` visible in default `data-lang=en`
   - `阅读全文` present in DOM (`.i18n-zh`)
   - at least one tag link/footer on a card
   - `locator('#search-trigger')` count **1**
   - `canvas#background` count **0** (no fluid on inner routes)
2. **`/gallery` exists**
   - `goto('/gallery')` → not 404
   - `#notes-menu` attached
   - empty state visible when `albums` is empty (bilingual nodes in DOM)
3. **Post card title**
   - `goto('/blog/cmake-modern-targets')` (or first `article.article-card` href)
   - `.post-card-title` (h1) visible
   - `locator('h1')` count **1** (dual-theme strict locator)
   - `canvas#background` count **0**
4. **390px drawer toggle**
   - `test.use({ viewport: { width: 390, height: 844 } })`
   - `/blog`: `#notes-menu` not in the open state on load
   - `#menu-toggle` click opens it (`is-open` or visible overlay)
   - second click (or equivalent) closes it
5. **Homepage Gallery after enter**
   - `goto('/')`, advance to `data-page-transition=main` (same helper pattern as `homepage-simonaking.spec.ts`)
   - `.homepage-card-nav` has a Gallery link (`/gallery`, name `/Gallery|相册/`)

### H.3 Existing e2e — must stay green (do not weaken)

| Spec | Why it still passes |
| --- | --- |
| `e2e/homepage-simonaking.spec.ts` | Two-screen intro unchanged; card gains Gallery (`>= 4` still holds). First paint `/` still has unique `#search-trigger` in `HomepageChrome`. |
| `e2e/card-link-structure.spec.ts` | Start Here still uses `Card.astro` `article>a` with non-empty text. Do not switch homepage cards to `NoteCard`. |
| `e2e/search-keyboard-shortcuts.spec.ts` | Clicks `#search-trigger` on `/` **without entering**. HomepageChrome + SearchModal stay on first paint. |
| `e2e/dual-theme-syntax-highlighting.spec.ts` | `/blog/cmake-modern-targets` still has visible `h1` and `.astro-code`; `html.dark` still flips Shiki CSS variables. Theme toggle remains in inner chrome. |

Allowed **additive** edit to `homepage-simonaking.spec.ts`: assert the Gallery card link after enter. Do **not** drop Blog/About/Email/GitHub assertions. Do **not** change search specs to “enter first”.

### H.4 Search uniqueness (implementer checklist, not a new spec file unless cheap)

- `/` first paint: `locator('#search-trigger')` count **1** (already implied by homepage e2e click).
- `/blog` first paint: count **1** (add to `notes-simonaking.spec.ts`).
- `/search` first paint: count **1** (the layout's trigger only).

---

## I. File lists

### I.1 Add

| File | Why |
| --- | --- |
| `src/layouts/NotesLayout.astro` | Inner shell wrapping BaseLayout |
| `src/components/notes/NotesMenu.astro` | `aside#notes-menu` |
| `src/components/notes/NotesHeader.astro` | Top bar (if not inlined into rewritten `Header.astro`) |
| `src/components/notes/NotesBanner.astro` | Content header / banner |
| `src/components/notes/NoteCard.astro` | `article.article-card` |
| `src/pages/gallery.astro` | Album route |
| `src/data/album.ts` | Album list (may be `[]`) |
| `src/styles/notes.css` | Drawer 215px, cover 175px, post-list, dark, reduced-motion |
| `src/lib/note-cover.ts` | Slug → cover params |
| `src/lib/note-cover.test.ts` | Cover hash unit tests |
| `src/lib/word-count.ts` | Pure word count |
| `src/lib/word-count.test.ts` | Fixture-driven unit tests |
| `src/lib/album-state.ts` | Empty-state helper |
| `src/lib/album-state.test.ts` | Empty vs non-empty |
| `e2e/notes-simonaking.spec.ts` | Inner-chrome e2e on dist |

Optional extract: `src/components/notes/PostCard.astro` if `PostLayout` gets large.

### I.2 Edit

| File | Change |
| --- | --- |
| `src/layouts/PostLayout.astro` | `NotesLayout` + `.post-article .post-card` + `aside.post-toc` |
| `src/components/navigation/Header.astro` | Become notes top bar **or** thin re-export of `NotesHeader`. Add Gallery via drawer, not a fifth sticky pill. |
| `src/components/navigation/Footer.astro` | Add Gallery to Site links. Slim Notion 3-col if needed; keep Joe identity + Connect (GitHub / X / Email). |
| `src/components/navigation/TOC.astro` | Restyle to `aside.post-toc` / `nav#post-toc` |
| `src/components/RelatedPosts.astro` | `NoteCard` list, not `Card.astro` grid |
| `src/components/navigation/PrevNext.astro` | Restyle to notes tokens; keep prev/next data |
| `src/pages/blog/index.astro` | `NotesLayout` + `ul.post-list` + `NoteCard`; drop 2-col grid + right rail |
| `src/pages/blog/[slug].astro` | Layout-only; stop mutating `post.data`; pass computed reading/word counts |
| `src/pages/tags/index.astro` | NotesLayout |
| `src/pages/tags/[tag].astro` | NotesLayout + NoteCard list |
| `src/pages/languages/index.astro` | NotesLayout |
| `src/pages/languages/[lang].astro` | NotesLayout + NoteCard list |
| `src/pages/projects.astro` | NotesLayout; `projects.ts` semantics untouched |
| `src/pages/about.astro` | NotesLayout; copy untouched |
| `src/pages/search.astro` | NotesLayout; **remove extra SearchModal** |
| `src/pages/404.astro` | NotesLayout `banner="quiet"` |
| `src/pages/index.astro` | Gallery appears via config only. Do not change intro/fluid/Start Here/`Card.astro`. |
| `src/lib/homepage-schema.ts` | Require `/gallery`; `createHomepageConfig` adds the link |
| `src/lib/homepage-schema.test.ts` | **Replace** the 4-href `deepEqual` with the F.4 5-tuple; `validConfig()` includes Gallery; add omit-`/gallery` rejection. Do not leave an exact-4-link assertion. |
| `src/homepage.config.ts` | No logic change if it only calls `createHomepageConfig` |
| `src/utils/readingTime.ts` | Delegate count to `countWords` |
| `src/scripts/client-router-chrome.ts` | Bind `#menu-toggle` / `#notes-menu`; keep search |
| `e2e/homepage-simonaking.spec.ts` | Additive Gallery assertion after enter (do not weaken) |

`PageLayout.astro`: delete after the last consumer is gone (`PostLayout` + the pages in the table above). Grep must return zero `PageLayout` imports.

### I.3 Do not touch

| Path | Why |
| --- | --- |
| `src/content/posts/**/*.mdx` bodies | Semantics frozen. No copy edits “to fit the card”. |
| `src/data/projects.ts` records | Names, blurbs, tags, github, featured flags stay. |
| Homepage intro motion / fluid | `FluidBackground`, `IntroMotion`, `homepage.css` two-screen, `webgl-fluid.js`, `fluid-control.ts` — only Gallery on the card. **Never import these from `NotesLayout` / notes components / inner routes.** No inner `canvas#background`. |
| `src/components/ui/Card.astro` contract | Homepage Start Here / Latest still `article>a`. Do not add a second anchor on homepage cards. |
| `src/components/homepage/HomepageChrome.astro` | Unique `#search-trigger` on `/` first paint. Search + Lang + Theme only. No `#menu-toggle`, no hamburger `aria-label`. |
| `src/components/search/SearchModal.tsx` behavior | Keep MiniSearch modal; do not replace with Simon `#search-wrap` field. |
| `src/components/search/SearchTrigger.astro` | Unused leftover. **Do not remount** (second `#search-trigger`). Deleting it is allowed; reusing it is not. |
| Vue / Pug / Gulp / Less, Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, remote Simon CDN | Forbidden leftovers. |
| `origin/design-upgrade` / stash | Do not merge or cherry-pick. |
| `e2e/card-link-structure.spec.ts`, `e2e/search-keyboard-shortcuts.spec.ts`, `e2e/dual-theme-syntax-highlighting.spec.ts` | Do not weaken. |

---

## 9. 开发 order (locked)

Implement in this sequence. Do not start later phases until the previous phase's acceptance is true. Tests in phase 5 still get **test files written last**, but helpers in phase 2–4 should land with their unit tests (TDD for pure functions).

### Phase 1 — Chrome

1. `notes.css` tokens (215px / 175px / `.dark` / reduced-motion).
2. `NotesMenu` + `NotesHeader` / rewritten `Header` + `NotesBanner`.
3. `NotesLayout` wrapping `BaseLayout`, mounting one `SearchModal`, computing stats. Phase 1 hardcodes `albumCount = 0` **or** lands empty `src/data/album.ts` (`export const albums: AlbumItem[] = []`) as a data stub. Do not import a missing module. `gallery.astro` still waits for phase 4.
4. `client-router-chrome` drawer toggle.
5. Point **one** inner page (`/about` is the smallest) at `NotesLayout` as a smoke path, then migrate the rest of the shell consumers so `PageLayout` can die at the end of phase 4.
6. Footer + Gallery href (page may 404 until phase 4 — prefer adding `gallery.astro` stub in phase 4 only; Footer link can wait until phase 4 if we want zero 404s. **Lock:** Footer Gallery link lands in phase 4 with the page. Drawer item may 404 until then — acceptable only inside phase 1 local smoke, not at merge of the whole feature.)

Phase 1 merge-ready slice: layout files exist; no route cutover yet **or** all inner routes cut over with old inner bodies still inside the new chrome. Prefer **cut all routes to NotesLayout in phase 1** with existing body markup, so search uniqueness and theme toggle keep working on `/blog/cmake-modern-targets` immediately.

### Phase 2 — Notes list

1. `word-count.ts` + unit test (fixture-driven).
2. `note-cover.ts` + unit test.
3. `NoteCard.astro`.
4. `/blog` → `ul.post-list` of `NoteCard`. Drop `Card.astro` grid + right rail.

### Phase 3 — Post

1. `PostLayout` → post banner + `.post-card` + `h1.post-card-title`.
2. Restyle `TOC.astro` → `aside.post-toc`.
3. Restyle `PrevNext` / `RelatedPosts` (`NoteCard`).
4. Verify `/blog/cmake-modern-targets` still has `.astro-code` dual theme (manual or existing e2e).

### Phase 4 — Other pages + album

1. `album.ts` (`[]`) + `album-state.ts` + unit test.
2. `gallery.astro` empty state + masonry/grid class hooks.
3. Tags / languages indexes + **NoteCard** on `[tag]` / `[lang]`.
4. Projects / about / search (drop extra modal) / 404.
5. `createHomepageConfig` Gallery link + schema tests.
6. Footer Gallery link.
7. Delete `PageLayout.astro` when grep is clean.

### Phase 5 — Tests

1. Finish `e2e/notes-simonaking.spec.ts`.
2. Additive Gallery assert in `homepage-simonaking.spec.ts`.
3. `npm run test:unit` + `npm run build` + `npm run test:e2e`.
4. Confirm the four existing homepage/search/card/syntax specs green.

---

## 10. Acceptance (definition of done)

- [ ] `/` is still two-screen `BaseLayout` intro; identity card includes Gallery; Start Here still `Card.astro`.
- [ ] Every inner HTML route uses `NotesLayout`; `PageLayout` is gone.
- [ ] `aside#notes-menu` has JC, Email/GitHub/X, post/tag/album counts, and the seven nav hrefs in B.1.
- [ ] First paint of `/` and of `/blog` each have exactly one `#search-trigger`; `SearchModal` is mounted; `/search` does not add a second modal or trigger.
- [ ] `/blog` is a `NoteCard` list with canvas-cover, word count, `Read more` / `阅读全文`, tags.
- [ ] `/blog/cmake-modern-targets` has exactly one `h1` (`.post-card-title`), MDX body, TOC, prev/next, related, dual-theme `.astro-code`. No `canvas#background` on inner routes.
- [ ] `/tags/[tag]` and `/languages/[lang]` use `NoteCard`, not `Card.astro`.
- [ ] `/gallery` exists; empty album is bilingual; `albums` may be `[]`.
- [ ] Schema requires `/gallery` **and** the original four links; unit test `deepEqual` is the 5-href F.4 list (the old 4-href assertion is gone).
- [ ] `notes.css` + `.dark` + reduced-motion kill-switch; IBM Plex only.
- [ ] Unit: cover-hash, word-count (fixture), album empty-state, schema gallery.
- [ ] E2E: `notes-simonaking.spec.ts` + the four existing specs green on built `dist`.

---

## 11. Out of scope (do not sneak in)

- Archives route (`/blog/archives`) — Joe has none; do not add.
- Weibo / Thinking / WeChat / Live2D / Disqus / color picker.
- AnimatedGallery / TermFolio / FolioSpace stacks.
- Rewriting MDX, adding dummy photos, or changing project records.
- Homepage fluid / intro animation tweaks.
- A second search id or an expanding Simon search field that replaces MiniSearch.
- Loading `webgl-fluid.js` / `FluidBackground` on any route except `/`.
- Keeping the `homepage-schema.test.ts` 4-href `deepEqual` after Gallery is added.
- Merging `design-upgrade`.
