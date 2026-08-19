# SimonAKing notes chrome vs Joe Cheung inner pages

Status: **调研 only** (no UI). Verified 2026-08-19 with `curl` against live SimonAKing pages.  
Identity stays **Joe Cheung · CAE & HPC**. Port **LAYOUT and FORMAT**, restyle with IBM Plex + existing bronze/dark `notion-*` tokens. Do not import Vue/Pug/Gulp/Less. Do not copy Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, or remote Simon CDN scripts.

Homepage two-screen intro (`src/pages/index.astro`) is already shipped. This doc lists every remaining inner-page surface that is still the old Notion sticky-header + card-grid chrome.

---

## Live references (curl, not invented)

| URL | HTTP | What it is |
| --- | --- | --- |
| https://simonaking.com/ | 200 | Two-screen HomePage only (`#card` + fluid). **Not** notes chrome. |
| https://simonaking.com/blog/ | 200 | Notes index. Source of `aside#menu` / `header#header` / `content-header` / `ul.post-list`. |
| https://simonaking.com/blog/anthropic-model-adaptation-monopoly/ | 200 | Post. Same chrome + empty `content-header post-header` + `article.post-article .post-card`. |
| https://simonaking.com/blog/tags/ | 200 | Tags index (`content-header tags-header` + physics `card-pool`). |
| https://simonaking.com/blog/tags/Go/ | 200 | Tag detail (`waterfall` + `article.archive-article`, not the 2-col Notion grid). |
| https://simonaking.com/blog/archives/ | 200 | Archives (same notes chrome). Joe has no equivalent route. |
| https://simonaking.com/gallery/ | 200 | First-class album (sitemap `priority 0.6`). Separate AnimatedGallery SPA. |
| https://simonaking.com/projects/ | 200 | Separate FolioSpace SPA (not notes chrome). |
| https://simonaking.com/about/ | 200 | Separate TermFolio SPA (not notes chrome). |
| https://simonaking.com/blog/weibo/ | 200 | Thoughts/weibo. **Drop.** |
| https://thinking.simonaking.com/ | linked | External thinking site. **Drop.** |
| https://simonaking.com/search/ | 404 | No dedicated search page. Search is `header#header` expandable `#search-wrap`. |
| https://simonaking.com/tags/ | 404 | Tags live at `/blog/tags/`, not `/tags/`. |
| https://simonaking.com/album/ | 404 | Album is `/gallery/`, not `/album/`. |
| https://simonaking.com/does-not-exist-xyz/ | 404 | HomePage 404 (`#mes`), not notes chrome. |

CSS facts from `style-0983e14cef.css` / `home-26172fcc54.css`:

- `aside#menu` is a **215px** left drawer (`#menu{width:215px}`; `#main{padding-left:215px}`).
- `.article-card .post-cover` is **175px** tall (`.canvas-cover` fills it).
- Index banner is `.content-header.index-header` with `canvas.flickering-grid-canvas` + `#inner-header` title/subtitle.
- Post banner is `.content-header.post-header` with canvas only (empty of title text). Title lives in `.post-card-title`.
- Post TOC is `aside.post-widget nav#post-toc` (user-facing name: `aside.post-toc`).

Home card (`#card ul`) live links: `blog/`, `/blog/weibo/` (Thoughts), `about/`, `gallery/`, `projects/`, `https://thinking.simonaking.com/` (Thinking).

---

## Simon notes chrome (port this format)

Verified on `/blog/` HTML:

1. **`aside#menu` (215px left drawer)**  
   Brand wrap (avatar/monogram + `#name` nickname) → social icon row → `.statistics` (counts) → vertical `.nav` → bottom `.nav-tool`.
2. **`header#header` (`.top-header`)**  
   `#menu-toggle` · expandable `#search-wrap` (`#back` / `#key` / `#search`) · `.header-title` (site name on index, post title on post).
3. **`header.content-header`**  
   Flickering-grid canvas. Index: large `h1.title` + `.subtitle`. Post: empty banner.
4. **`ul.post-list` > `article.article-card`**  
   Centered single column (not a 2-col Notion grid). `div.post-cover` / `.canvas-cover` 175px · `h3.post-title a` · `.post-meta` (date, reading time, word count) · excerpt · `a.post-more` 阅读全文 / Read more · tag footer.
5. **Post**  
   Same chrome. `article.post-article` > `.post-card` with `h1.post-card-title`, date, tags, `aside.post-toc`, prose body.
6. **Album** is a first-class nav option (`/gallery/` in menu stats, vertical nav, sitemap, and home card).

### Drop from Simon (never port)

| Live piece | Why |
| --- | --- |
| Weibo / Thoughts (`/blog/weibo/`, `#weibo-count`) | Explicit drop |
| Thinking (`thinking.simonaking.com`) | Explicit drop |
| WeChat (`#link-wechat`) | Explicit drop |
| Live2D (`#landlord` / `#live2d`) | Persona toy |
| Color picker (`#color-picker-icon`) | Keep existing bronze/dark tokens |
| GitHub-corner, `log.min.js`, Simon CDN scripts | Forbidden leftovers |
| Comic Sans / Roboto / Fira Code / Inter on those SPAs | IBM Plex only |
| TermFolio / FolioSpace / AnimatedGallery stacks | Separate React apps; port format only |
| Disqus comments | Not in this site |
| Simon avatar | Joe identity, monogram `JC` is enough |

Joe mapping for menu stats: **posts / tags / album** (album may be `0`). Social: GitHub, X, Email only.

---

## Current repo (confirmed by reading)

Homepage already uses `BaseLayout` + two-screen intro + `HomepageChrome` (`#search-trigger` unique on first paint) + mounted `SearchModal`. Identity card links are only Blog / About / Email / GitHub (`src/lib/homepage-schema.ts` `createHomepageConfig`).

Every other HTML route uses **`PageLayout` → sticky `Header.astro` + `<main>` + `Footer` + `SearchModal`**. Header nav is Home / Projects / Notes / About. No `#menu`, no flickering-grid banner, no `ul.post-list`.

`Card.astro` is a bordered Notion tile (`rounded-xl border border-notion-*`, Quick Preview, whole-card `<a>`, “Read note →”). Blog index puts those tiles in `grid-cols-1 md:grid-cols-2` plus a 280px right rail. **No `/gallery`.**

---

## Gap table

**keep** = restyle into notes chrome, preserve Joe semantics.  
**add** = missing surface that must exist.  
**drop** = Simon-only, do not port.  
**keep (Joe-only)** = no Simon equivalent; restyle, do not delete.

| Route | Current file | Current style | Simon equivalent | Gap | keep/drop |
| --- | --- | --- | --- | --- | --- |
| `/` identity card | `src/pages/index.astro` + `src/lib/homepage-schema.ts` | Two-screen landing already Simon-format. `.homepage-card-nav` is Blog / About / Email / GitHub only. | Live `#card` also links `gallery/` and `projects/` (plus Thoughts/Thinking). | **Missing Gallery** on the identity card. Projects already exist as `/projects` and the Selected work block; card itself has no Gallery. `e2e/homepage-simonaking.spec.ts` asserts the four current links (`>= 4` still passes if Gallery is added). | **add** Gallery link. **drop** Thoughts / Thinking. Projects-on-card optional (route already exists). |
| `/blog` | `src/pages/blog/index.astro` | `PageLayout` + sticky `Header` + `h1` “Notes” + **2-col `Card.astro` grid** + right Languages/Tags rail + page numbers. | `/blog/` notes chrome: `aside#menu` + `header#header` + `content-header.index-header` (title + subtitle + flickering-grid) + **centered `ul.post-list` of `article.article-card`**. | Full chrome mismatch. 2-col Notion cards vs single-column 175px canvas-cover list. No word count. CTA is “Read note →” not 阅读全文 / Read more. Right rail is not the 215px drawer. | **keep** route + MDX collection. Restyle list + chrome. |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` → `src/layouts/PostLayout.astro` | Same sticky header. Notion `h1` + description + date/reading-time + `TagChip` row. Body `prose-custom`. Right sticky `TOC.astro` (`lg:grid-cols-[1fr_280px]`). `PrevNext` + `RelatedPosts` (more Notion cards). | Same notes chrome. Empty `content-header.post-header` (canvas only). `article.post-article .post-card` with `h1.post-card-title`, date, tags, `aside.post-toc`, prose. Header title becomes the post title. | Post is still a Notion two-column article, not `.post-card` under an empty banner. TOC is a gray Notion box, not `aside.post-toc`. Related posts reuse `Card.astro` grid. | **keep** MDX body / frontmatter semantics. Restyle chrome + card + TOC. |
| `/projects` | `src/pages/projects.astro` | `PageLayout` + eyebrow + `h1` + **2-col bordered project tiles** from `src/data/projects.ts`. | Live `/projects/` is FolioSpace (drop the SPA). Notes-chrome treatment: same drawer/header/banner, Joe project list inside. | No notes chrome. Still Notion card grid. | **keep** `projects.ts` semantics. Restyle chrome; do not copy FolioSpace / GitHub-corner. |
| `/about` | `src/pages/about.astro` | `PageLayout` + Notion `h1` + `prose-custom` bilingual sections. | Live `/about/` is TermFolio (drop the SPA). Notes chrome + existing Joe prose. | No notes chrome. | **keep** copy. Restyle chrome; do not copy TermFolio. |
| `/search` | `src/pages/search.astro` | `PageLayout` + centered Notion “Search” heading + **second** `SearchModal client:load` (PageLayout already mounts one) + tips / popular chips. | No `/search` (404). Search is expandable `#search-wrap` in `header#header`. | Dedicated page is extra vs Simon. Double-mounted modal. Still sticky Header + Notion tips layout. | **keep** MiniSearch + unique `#search-trigger` + mounted `SearchModal` (e2e lock). Restyle chrome. Page may stay as a thin entry that opens the same modal; do not add a second `#search-trigger`. |
| `/tags` | `src/pages/tags/index.astro` | `PageLayout` + Notion `h1` + pill cloud + A–Z 3-col gray tiles. | `/blog/tags/` notes chrome + `content-header tags-header` (`Tag.sort()`) + `.card-pool` tag cards. | No drawer/banner. Cloud + letter groups vs Simon tag cards. Path is `/tags` not `/blog/tags` — keep Joe path. | **keep** `/tags` path + tag data. Restyle into notes chrome. |
| `/tags/[tag]` | `src/pages/tags/[tag].astro` | Breadcrumb + Notion `h1` + related pills + **3-col `Card.astro` grid**. | `/blog/tags/<tag>/` notes chrome + title `标签: Go` + `waterfall` of `article.archive-article` (title / date / tags). | 3-col Notion cards vs centered archive list. No notes chrome. | **keep** path + filter. Restyle list to centered cards/archive rows. |
| `/languages` | `src/pages/languages/index.astro` | `PageLayout` + 3-col Notion language tiles. | None. | Joe-only taxonomy, still Notion cards, no notes chrome. | **keep (Joe-only)**. Restyle; optional drawer nav item. |
| `/languages/[lang]` | `src/pages/languages/[lang].astro` | Same as tag detail: breadcrumb + 3-col `Card.astro`. | None. | Same card-grid gap. | **keep (Joe-only)**. Restyle to centered `post-list`. |
| `404` | `src/pages/404.astro` | `PageLayout` + huge Notion-blue `404` + Home / Browse Notes + `#cpp` / `#algorithms` chips. | HomePage 404 (`#mes`), not notes chrome. | Inner 404 still uses sticky Header + Notion CTA cards. | **keep** route. Restyle with notes chrome (or a quiet empty banner). Do not copy Simon `#mes` / CDN 404. |
| `/gallery` | **missing** | No page, no nav item, no card link. | `/gallery/` first-class (home card, menu 相册, stats `#photo-count`, sitemap). Live app is AnimatedGallery — drop that stack. | **No album surface at all.** | **add** `/gallery` even if photos are empty. Notes chrome + empty album. Do not copy AnimatedGallery / GitHub-corner. |

### Shared chrome (every inner route above)

| Surface | Current file | Current style | Simon equivalent | Gap | keep/drop |
| --- | --- | --- | --- | --- | --- |
| Inner shell | `src/layouts/PageLayout.astro` | `BaseLayout` + sticky `Header` + `main` + `Footer` + `SearchModal`. | `aside#menu` + `main#main` (`padding-left: 215px`) + `header#header` + `content-header` + body. | This is why every inner route still looks Notion. | **keep** `SearchModal` mount. Replace header/footer shell with notes chrome. |
| Top bar | `src/components/navigation/Header.astro` | Sticky 64px bar: `JC` monogram + Joe Cheung, horizontal Home/Projects/Notes/About, `#search-trigger` + ⌘K, Lang, Theme, hamburger. | `header#header`: menu toggle, expandable search, page title. Drawer holds nav. | Horizontal Notion nav vs left drawer + compact top bar. Search is a button that opens a modal, not an expanding field. | **keep** `#search-trigger` uniqueness + MiniSearch modal behavior (homepage + inner first paint). Port top-bar format; do not ship a second search id (`SearchTrigger.astro` is unused leftover — do not remount). |
| Post card | `src/components/ui/Card.astro` | Whole-card `<a>`, Quick Preview, bordered lift, “Read note →”. Used by `/blog`, tags, languages, RelatedPosts, homepage Start Here / Latest. | `article.article-card`: 175px canvas-cover, title link, meta (date / min read / word count), excerpt, 阅读全文 / Read more, tag footer. Centered. | Format mismatch. No canvas-cover, no word count (`readingTime.ts` only returns minutes). Homepage Start Here **must stay** `article` → one non-empty `a` (`e2e/card-link-structure.spec.ts`). | **keep** homepage featured `article>a` contract. Inner list should become `post-list` cards (title `a` + Read more `a` is OK off `/`). |
| Post TOC | `src/components/navigation/TOC.astro` | Sticky Notion gray box “On this page”. | `aside.post-widget` / `nav#post-toc`. | Visual + placement. | **keep** heading data. Restyle to `aside.post-toc`. |
| Site footer | `src/components/navigation/Footer.astro` | 3-col Notion footer (Site / Connect). No Gallery. | Blog footer is a thin power line; home has no this footer. | Extra Notion chrome. Missing Gallery. | **keep** Joe identity line. Slim down; add Gallery if footer nav remains. |
| Related / prev-next | `RelatedPosts.astro`, `PrevNext.astro` | Notion card grid / bordered tiles. | Not part of the required notes card; Simon uses Disqus (drop). | Still Notion tiles on the post page. | **keep** prev/next + related data. Restyle; drop Disqus. |

**Inner-page gap count: 12 route surfaces** (11 existing Notion pages + missing `/gallery`) **+ 1 homepage-card Gallery gap + 6 shared-chrome surfaces.** All 12 inner routes fail the notes-chrome check. Homepage two-screen intro itself is **not** a gap except the missing Gallery link.

---

## Files to touch (later implement — not this phase)

**New**

- `src/pages/gallery.astro` — empty album, notes chrome, first-class nav.
- Notes shell pieces (split small): `aside#menu` drawer, `header#header` top bar, `content-header` + flickering-grid canvas, `article.article-card` / `ul.post-list`, post `.post-card` + `aside.post-toc`.
- Optional `src/styles/notes.css` for drawer 215px / cover 175px / banner. IBM Plex + existing bronze/dark tokens only.

**Replace / adapt**

- `src/layouts/PageLayout.astro` — swap sticky Header for notes chrome; keep one `SearchModal`.
- `src/layouts/PostLayout.astro` — empty banner + `.post-article .post-card` + `aside.post-toc`.
- `src/components/navigation/Header.astro` — become `header#header` (toggle + expandable search + title). Keep a single `#search-trigger` (or map Simon `#search` click to the existing modal without a second id).
- `src/components/ui/Card.astro` — inner-list format; do not break homepage `article>a` / “Start Here”.
- `src/components/navigation/TOC.astro`, `Footer.astro`, `RelatedPosts.astro`, `PrevNext.astro`.
- `src/pages/blog/index.astro` — drop 2-col grid + right rail; centered `post-list`.
- `src/pages/blog/[slug].astro` — no body rewrite; layout only.
- `src/pages/projects.astro`, `about.astro`, `search.astro`, `tags/index.astro`, `tags/[tag].astro`, `languages/index.astro`, `languages/[lang].astro`, `404.astro`.
- `src/lib/homepage-schema.ts` + `src/lib/homepage-schema.test.ts` — add `{ href: '/gallery', textEn: 'Gallery', textZh: '相册' }` to `main.links`.
- `src/pages/index.astro` — card gets Gallery via config; do not change the two-screen intro.
- `src/components/navigation/Header.astro` / new drawer nav — add Gallery; do not add weibo/thinking/wechat.
- `src/utils/readingTime.ts` — expose word count for `.post-meta` if the card needs it.
- `e2e/homepage-simonaking.spec.ts` — assert Gallery on the card after the schema change. Do **not** weaken `#search-trigger` / SearchModal / Start Here / dual-theme specs.

**Do not touch**

- MDX post bodies under `src/content/posts/`.
- `src/data/projects.ts` record semantics.
- Homepage fluid / intro motion except the Gallery card link.
- Vue/Pug/Gulp/Less, Comic Sans, Simon avatar, `supportAuthor`, GitHub-corner, `log.min.js`, remote Simon scripts.

**E2E locks**

- `e2e/homepage-simonaking.spec.ts`
- `e2e/card-link-structure.spec.ts`
- `e2e/search-keyboard-shortcuts.spec.ts`
- `e2e/dual-theme-syntax-highlighting.spec.ts`
