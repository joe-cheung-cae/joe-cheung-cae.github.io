You are a senior front-end engineer + technical writer. Build a production-ready “Notion-like” technical learning blog using Astro.

HIGH-LEVEL VISION
- The site should feel like Notion: clean, spacious, elegant typography, subtle borders, soft shadows, great reading experience.
- Primary content: C++ learning notes, plus other programming languages/topics.
- Authoring: Markdown/MDX in a content folder, with frontmatter.
- Static-first for performance, but interactive parts (search, theme toggle) can be client-side islands.
- Deployable to Vercel/Netlify/Cloudflare Pages.

TECH STACK (MUST USE)
- Astro (latest) + TypeScript
- Styling: Tailwind CSS + @tailwindcss/typography
- Content: Astro Content Collections (src/content/...) with schema validation (zod).
- MDX support (Astro MDX integration).
- Syntax highlighting: Shiki (Astro built-in highlighter or integration). Must look great for C++.
- Search: client-side local search using MiniSearch OR FlexSearch. Build index at build time.
- RSS feed: @astrojs/rss
- Sitemap: @astrojs/sitemap- Optional: KaTeX for math (only if needed; keep optional and lightweight).

SITE FEATURES (MUST IMPLEMENT)
1) Pages
- Home:
  - Notion-like hero (site title + short tagline)
  - “Start here” section (links to key posts)
  - Latest posts list
  - Tag chips
- Blog index:
  - Filter by tag + by “language” (cpp/cuda/cmake/algorithms/python/etc)
  - Pagination (if easier: simple pagination or “Load more” client-side; choose best static-friendly approach)
- Post page:
  - Title, description, date, reading time
  - Tags + language label
  - Right-side sticky TOC on desktop, collapsible on mobile
  - Prev/Next navigation
  - “Related posts” by tag similarity
  - Excellent code blocks (Shiki) + COPY button
  - Callouts: Note / Tip / Warning blocks (MDX components)
  - Image support with captions
- Tags index + tag detail pages
- Languages index + language detail pages (language = your frontmatter field)
- About page
- Projects page
- 404 page

2) Content system
- Posts stored in: src/content/posts/*.mdx
- Frontmatter schema (required unless noted):
  - title (string)
  - description (string)
  - pubDate (date)
  - updatedDate (date, optional)
  - tags (string[])
  - language (enum-like string: "cpp" | "cuda" | "cmake" | "algorithms" | "python" | "rust" | "misc")
  - draft (boolean, default false)
  - series (string, optional)
  - order (number, optional; for series ordering)
- Draft posts excluded from production build automatically.
- Generate reading time.
- Generate TOC (h2/h3) and render it in post layout.

3) Notion-like UI Design requirements
- Global layout: centered content, max-width ~ 760-900px for posts, comfortable line-height.
- Use subtle separators, light borders, card-like list items, and a clean minimal nav.
- Use a light/dark mode toggle:
  - default to system preference
  - persist selection in localStorage
- Typography:
  - Use Tailwind Typography, but customize:
    - Notion-ish heading sizes
    - Nice blockquote + code styling
- Components:
  - “Card” component for post previews
  - “TagChip” component
  - “Callout” component (Note/Tip/Warning)
  - “CodeBlock” wrapper with copy button

4) SEO & performance (MUST)
- Per-page meta (title, description)
- OpenGraph/Twitter cards (site-level defaults + per-post overrides)
- RSS feed
- Sitemap
- robots.txt
- Canonical URLs
- Use performant images (Astro assets or <img> with width/height and lazy loading)
- Lighthouse-friendly

CONFIGURATION (IMPORTANT)
- Create a single config file: src/site.config.ts containing:
  - siteName, siteDescription, siteUrl
  - authorName
  - social links
  - repo/edit link base
  - default OG image (optional)
- All pages should import config from there.

CONTENT SEED (MUST PROVIDE)
Create at least 6 realistic example posts (short but meaningful) in MDX with proper formatting:
1) C++: RAII + smart pointers (with code)
2) C++: move semantics pitfalls (with code)
3) CMake: modern target-based linking
4) Algorithms: Quickhull 3D overview (high-level + pseudo/code)
5) CUDA: kernel launch basics + occupancy intuition
6) Misc: “How I take programming notes” (explains the site)

Also include a “Start here” MDX page or curated list on Home.

SEARCH (MUST)
- Implement a search modal/popup like Notion:
  - keyboard shortcut: Cmd+K / Ctrl+K
  - fuzzy-ish search across title, description, tags
  - show results with title + snippet
- Build the search index at build time (Astro build step). Keep it simple and reliable.

REPO STRUCTURE (EXPECTED)
- src/
  - pages/ (index, blog, tags, languages, about, projects, 404)
  - content/posts/
  - layouts/
  - components/
  - styles/ (global.css)
  - utils/ (toc, readingTime, searchIndex build)
  - site.config.ts
- public/ (favicon, og image placeholder, robots.txt if needed)

DELIVERABLES & OUTPUT FORMAT (IMPORTANT)
- Step 1: Provide a short architecture plan (what integrations you’ll install, routing approach, content pipeline, search approach).
- Step 2: Output the repo file tree.
- Step 3: Output all files in batches. Each file must be shown as:
  - "## path/to/file"
  - followed by the complete content
- Step 4: Provide macOS setup instructions (Node via fnm or nvm), install commands, dev/build commands.
- Step 5: Provide deployment instructions for Vercel and Netlify.
- Step 6: Self-review checklist (build passes, draft filtering, rss/sitemap, search shortcut works, mdx renders, SEO meta exists).

QUALITY BAR
- Keep dependencies minimal.
- Avoid overengineering.
- Ensure TypeScript types are correct.
- Ensure everything runs: `npm install`, `npm run dev`, `npm run build`.
- If you must choose among options, choose the simplest stable option and explain briefly.

PROJECT NAME
- notion-like-tech-notes

Now start. First output the architecture plan, then the file tree, then the full code.