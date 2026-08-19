let meta = #{
    name: "inner-pages-align",
    description: "Align notes and inner pages to SimonAKing blog style; keep album",
    when_to_use: "Refactor /blog and other inner pages to match SimonAKing notes design while keeping an album route",
    phases: [
        #{ title: "调研", detail: "Gap analysis vs SimonAKing notes/blog chrome" },
        #{ title: "计划", detail: "Frozen development plan" },
        #{ title: "评审", detail: "Adversarial review of the plan" },
        #{ title: "归档", detail: "Archive agreed locks into the handoff" },
        #{ title: "开发", detail: "Chrome, notes list, post, other pages, album" },
        #{ title: "测试", detail: "Unit + Playwright on shipped dist" },
    ],
};

fn result_schema() {
    #{
        "type": "object",
        "required": ["done", "notes"],
        "properties": #{
            "done": #{ "type": "boolean" },
            "notes": #{ "type": "string" },
            "files": #{ "type": "string" },
            "blockers": #{ "type": "string" },
        },
    }
}

fn bars() {
    let s = "";
    s += "Repo: /Users/chao/workspace/repo/joe-cheung-cae.github.io on branch refactor. ";
    s += "Work in this shared workspace. Do NOT use isolation worktrees. ";
    s += "Do NOT git commit, push, merge, rebase, or checkout another branch. ";
    s += "Do NOT mix design-upgrade leftovers. Identity stays Joe Cheung (CAE and HPC). ";
    s += "Keep Astro 5 + Tailwind + MDX + Preact + MiniSearch + data-lang bilingual. ";
    s += "Do not import Vue/Pug/Gulp/Less. Do not copy Comic Sans, Simon avatar, supportAuthor, GitHub-corner, log.min.js, or remote Simon CDN scripts. ";
    s += "Do not rewrite MDX post bodies or src/data/projects.ts semantics. ";
    s += "IBM Plex only. Keep existing homepage two-screen fluid intro (src/pages/index.astro) except adding a Gallery link on the identity card. ";
    s += "Keep #search-trigger unique on first paint of / and on inner pages. Keep SearchModal mounted. ";
    s += "Homepage e2e must stay green: e2e/homepage-simonaking.spec.ts, e2e/card-link-structure.spec.ts, e2e/search-keyboard-shortcuts.spec.ts, e2e/dual-theme-syntax-highlighting.spec.ts. ";
    s
}

fn opts(label, agent_type, mode) {
    #{
        label: label,
        capability_mode: mode,
        model: "grok-4.6",
        agent_type: agent_type,
        output_schema: result_schema(),
    }
}

fn after(r, name) {
    if r == () || r.success != true {
        pause("infra", name + " agent failed or returned empty.");
    }
    if type_of(r.output) == "map" && r.output.done == false {
        let extra = "";
        if r.output.notes != () { extra = r.output.notes; }
        pause("verification", name + " reported done=false. " + extra);
    }
}

fn note_of(r) {
    if r != () && type_of(r.output) == "map" && r.output.notes != () {
        r.output.notes
    } else {
        ""
    }
}

fn p_research() {
    let s = bars();
    s += "PHASE 调研 (high). Use read_file, grep, list_dir, and curl. Do not implement UI. ";
    s += "GOAL: list every inner-page surface that is still the old Notion card/header style and is not aligned with SimonAKing live notes/blog chrome. ";
    s += "REFERENCE (verify with curl, do not invent): https://simonaking.com/blog/ is the notes page. HomePage repo is only the two-screen landing. Live home card also links gallery/ and projects/. ";
    s += "Simon notes chrome (port LAYOUT and FORMAT, restyle to Joe Cheung IBM Plex + existing bronze/dark tokens): ";
    s += "1) aside#menu 215px left drawer: brand/monogram, nickname, social icons, statistics (posts/tags/album counts), vertical nav, bottom tools. ";
    s += "2) header#header top bar: menu toggle, expandable search, page title. ";
    s += "3) header.content-header with flickering-grid canvas + large title/subtitle (index) or empty banner (post). ";
    s += "4) ul.post-list of article.article-card: canvas-cover 175px, h3.post-title a, post-meta (date, reading time, word count), excerpt, 阅读全文/Read more, tag footer. Centered, not a 2-col Notion card grid. ";
    s += "5) Post: same chrome, article.post-article .post-card with h1.post-card-title, date, tags, aside.post-toc, prose body. ";
    s += "6) Album/gallery is a first-class nav option. ";
    s += "CURRENT REPO (confirm by reading): homepage already Simon two-screen. Inner routes still PageLayout + sticky Header.astro + Notion Card.astro grid: /blog, /blog/[slug], /projects, /about, /search, /tags, /tags/[tag], /languages, /languages/[lang], 404. NO /gallery. Homepage card links only Blog/About/Email/GitHub. ";
    s += "KEEP album option: add /gallery even if photos are empty. Do not copy Simon weibo/thinking/wechat. ";
    s += "WRITE docs/simonaking-inner-pages-gaps.md with a table: route, current file, current style, Simon equivalent, gap, keep/drop. Include homepage card missing Gallery. ";
    s += "Also write a short files-to-touch list. Return done=true, files=the gaps path, notes=gap count summary. ";
    s
}

fn p_plan() {
    let s = bars();
    s += "PHASE 计划 (high). Read docs/simonaking-inner-pages-gaps.md and current src/. Do not implement UI. ";
    s += "WRITE docs/simonaking-inner-pages-plan.md as the frozen implementation plan. Must lock: ";
    s += "A) New inner chrome: NotesLayout (or InnerLayout) wrapping BaseLayout. Left drawer + top header + content header + slot. Replace PageLayout usage on inner routes. Homepage stays BaseLayout two-screen. ";
    s += "B) Sidebar nav (bilingual): Home /, Notes /blog, Tags /tags, Languages /languages, Gallery /gallery, Projects /projects, About /about. Stats: post count, tag count, album count. Monogram JC, not a stolen avatar. Email + GitHub + X social. LangToggle + ThemeToggle live in chrome (top or sidebar tools). Exactly one #search-trigger that opens existing SearchModal. ";
    s += "C) Notes index /blog: Simon article-card list, not Card.astro grid. Extract NoteCard component. Deterministic canvas cover from slug hash (pure helper + unit test). Word count helper + unit test (do not hardcode expected counts; drive the real function with a fixture string). Read more i18n-en/i18n-zh. ";
    s += "D) Post page: Simon post-card + TOC. Keep MDX render, prev/next, related. Dual-theme syntax highlighting must still work on /blog/cmake-modern-targets. ";
    s += "E) Tags/languages/search/about/projects/404: same inner chrome. Tag/language indexes use the same NoteCard list, not the old grid. ";
    s += "F) NEW /gallery album page: keep the option. src/data/album.ts list (may be empty). Empty state bilingual. Masonry/grid style inspired by AnimatedGallery but stay in Astro, no Vue. Add Gallery to homepageConfig.main.links AND Header/Footer. Update homepage-schema tests: required blog/about/mailto/github remain; gallery extra is required now. ";
    s += "G) CSS in src/styles/notes.css using existing CSS variables. Dark mode via .dark. Reduced-motion: no flickering canvas animation. No Comic Sans. ";
    s += "H) Tests: unit for cover-hash, word-count, album empty-state helper, schema gallery link. e2e notes-simonaking.spec.ts on built dist: /blog has #notes-menu, article.article-card count >= 1, canvas-cover, Read more/阅读全文, tags; /gallery exists; /blog/<slug> has post-card-title; 390px drawer toggle works; homepage still has Gallery link after enter. Keep existing e2e green. ";
    s += "I) File add/edit/do-not-touch lists. 开发 order: chrome -> notes list -> post -> other pages+album -> tests. ";
    s += "Return done=true. ";
    s
}

fn p_review() {
    let s = bars();
    s += "PHASE 评审 (high). Read-only first: gaps doc, plan doc, src/pages/blog/index.astro, PostLayout, Header, PageLayout, homepage.config.ts, homepage-schema.ts, e2e/*.spec.ts, package.json. ";
    s += "Adversarially review. Fail the plan if: identity becomes Simon; Comic Sans; fluid sim loaded on inner routes; SearchModal missing; two #search-trigger; homepage Start Here region dropped; MDX rewritten; album omitted; Vue imported; schema test still asserts exact 4-link array after gallery is added; inner notes still a 2-col Card grid. ";
    s += "WRITE docs/simonaking-inner-pages-review.md with pass/fail per requirement and required edits before 开发. ";
    s += "If required edits exist, APPLY them to docs/simonaking-inner-pages-plan.md (locks only, no UI). Return done=true only if the plan is implementable. ";
    s
}

fn p_archive() {
    let s = bars();
    s += "PHASE 归档 (low). Read gaps + plan + review. Do not invent design. ";
    s += "WRITE/UPDATE docs/simonaking-inner-pages-handoff.md as the frozen agreed plan: chrome contract, notes card contract, album contract, homepage Gallery link, files to touch, e2e contracts, do-not-touch, 开发 order. ";
    s += "Mark 调研/计划/评审/归档 done and 开发 next. Minimal edits. Return done=true. ";
    s
}

fn p_dev_chrome() {
    let s = bars();
    s += "PHASE 开发/chrome (high). IMPLEMENT against docs/simonaking-inner-pages-handoff.md (fallback to plan if handoff missing). Use tools. ";
    s += "Create inner chrome: src/layouts/NotesLayout.astro (name may match plan), src/components/notes/NotesSidebar.astro, NotesTopHeader.astro, NotesContentHeader.astro, src/styles/notes.css. ";
    s += "Sidebar: JC monogram (not Simon photo), Joe Cheung name, email/github/x icons, stats (posts, tags, album), nav Home/Notes/Tags/Languages/Gallery/Projects/About with i18n-en/i18n-zh, active state from Astro.url.pathname. Drawer hidden off-canvas below ~1300px; #menu-toggle opens it. ";
    s += "Top header: menu toggle, existing SearchModal trigger MUST keep id=search-trigger (one per page), LangToggle, ThemeToggle. ";
    s += "Content header: gradient using --accent-color, optional flickering-grid canvas that does not run under prefers-reduced-motion. Index pages show title+subtitle; post pages may hide the large title. ";
    s += "Wire NotesLayout into PageLayout OR replace PageLayout usages so EVERY inner route gets this chrome. Homepage index.astro must NOT use this overlay on the intro (homepage chrome stays). ";
    s += "Do not yet rewrite the notes card list if that is the next agent — but layout must be in place. Add a tiny unit-tested helper if you introduce drawer state predicates. ";
    s += "After edits run npm run test:unit. Return done=true with files list. ";
    s
}

fn p_dev_notes() {
    let s = bars();
    s += "PHASE 开发/notes (high). IMPLEMENT notes list + post page in Simon article-card / post-card format. Read handoff. ";
    s += "Add src/lib/note-cover.ts: hashString(slug) and coverStops(slug) returning deterministic CSS/canvas colors. Unit test with a fixture slug that the REAL function is called (do not reimplement hash in the test; import the shipped function; do not hardcode a magic expected hex unless it is computed by calling the shipped function twice for stability). ";
    s += "Add src/lib/word-count.ts: countWords(markdown) used for the card meta. Unit test drives the shipped function with a markdown fixture containing code fences that must be ignored. ";
    s += "Add src/components/notes/NoteCard.astro matching Simon structure: article.article-card > .post-cover > .canvas-cover[data-post-id], h3.post-title > a[href=/blog/slug], .post-meta date/reading-time/word-count, .post-content excerpt, a.post-more Read more / 阅读全文, ul.article-tag-list. ";
    s += "Canvas cover: island or inline script that paints from coverStops; reduced-motion uses a static gradient. ";
    s += "Rewrite src/pages/blog/index.astro to a vertical ul.post-list of NoteCard (drop the 2-col Card grid and old languages/tags aside). Keep all posts reachable. Pagination optional if >10, matching siteConfig.pagination. ";
    s += "Rewrite PostLayout.astro / blog/[slug].astro to post-card + TOC using NotesLayout chrome. Keep prev/next and related. Do not change MDX bodies. ";
    s += "Homepage Start Here must KEEP Card.astro article>a contract (do not break card-link-structure). Only inner notes list uses NoteCard. ";
    s += "Run npm run test:unit after. Return done=true. ";
    s
}

fn p_dev_rest() {
    let s = bars();
    s += "PHASE 开发/rest (high). IMPLEMENT remaining inner pages + album + homepage Gallery link. Read handoff. ";
    s += "1) Add src/data/album.ts (typed items: src, altEn, altZh, optional href). May be empty. Add src/lib/album.ts helper isAlbumEmpty(items) and formatAlbumCount. Unit tests drive the shipped helpers. ";
    s += "2) Add src/pages/gallery.astro: NotesLayout, content-header title Album/相册, masonry/grid of items, empty state if none. id=album-page. Keep the option even if empty. ";
    s += "3) Add Gallery to homepageConfig via createHomepageConfig links (after Blog). Update src/lib/homepage-schema.ts: still require /blog /about mailto github; ALSO require a /gallery (or /album) href. Update homepage-schema.test.ts accordingly — assert the shipped createHomepageConfig output contains /gallery, do not hardcode Simon names. ";
    s += "4) Align /about /projects /search /tags /tags/[tag] /languages /languages/[lang] /404 to NotesLayout and NoteCard lists where posts are shown. Footer includes Gallery. ";
    s += "5) Header.astro if still used: include Gallery. Avoid duplicate #search-trigger if NotesTopHeader already has it. ";
    s += "Do not load webgl-fluid on inner routes. Run npm run test:unit. Return done=true. ";
    s
}

fn p_test() {
    let s = bars();
    s += "PHASE 测试 (medium-high). Drive the REAL shipped path. No test theater. ";
    s += "Add e2e/notes-simonaking.spec.ts that uses page.goto against playwright.config.ts (built dist on :4321). Assertions must read shipped DOM: ";
    s += "- /blog: #notes-menu or aside#menu attached; locator('article.article-card') count >= 1; a canvas-cover or post-cover exists; a.post-more non-empty; a tag link exists. ";
    s += "- open the first article-card title link; expect h1.post-card-title or article.post-article attached. ";
    s += "- /gallery: #album-page attached; nav still offers Gallery/相册. ";
    s += "- / : after reduced-motion (lands on main) homepage-card-nav contains a Gallery/相册 link to /gallery. ";
    s += "- 390px on /blog: menu toggle visible; after click, Notes nav link visible. ";
    s += "Do not hardcode post titles from memory — read them from the page or from getCollection-backed config if needed. ";
    s += "Keep existing e2e. If Start Here/search/theme selectors broke, fix implementation not by deleting specs. ";
    s += "Run npm run test:unit. Run npm run build twice (both exit 0; dist/index.html, dist/blog/, dist/gallery/, dist/projects/, dist/about/ non-empty). Run npm run test:e2e. ";
    s += "UPDATE docs/simonaking-inner-pages-handoff.md with results. Copy a brief log into notes. Return done=true only if unit+e2e+dual-build passed. ";
    s
}

log("inner-pages-align: research -> plan -> review -> archive -> develop -> test");

phase("调研");
let r0 = agent(p_research(), opts("research-high", "grok-46-high", "all"));
after(r0, "调研");

phase("计划");
let r1 = agent(p_plan(), opts("plan-high", "grok-46-high", "all"));
after(r1, "计划");

phase("评审");
let r2 = agent(p_review(), opts("review-high", "grok-46-high", "all"));
after(r2, "评审");

phase("归档");
let r3 = agent(p_archive(), opts("archive-low", "grok-46-low", "read-write"));
after(r3, "归档");

phase("开发");
let d0 = agent(p_dev_chrome(), opts("dev-chrome-high", "grok-46-high", "all"));
after(d0, "开发/chrome");
let d1 = agent(p_dev_notes(), opts("dev-notes-high", "grok-46-high", "all"));
after(d1, "开发/notes");
let d2 = agent(p_dev_rest(), opts("dev-rest-high", "grok-46-high", "all"));
after(d2, "开发/rest");

phase("测试");
let t0 = agent(p_test(), opts("test-medium", "grok-46-medium", "all"));
after(t0, "测试");

complete(#{
    summary: "inner-pages-align finished",
    research: note_of(r0),
    plan: note_of(r1),
    review: note_of(r2),
    archive: note_of(r3),
    chrome: note_of(d0),
    notes: note_of(d1),
    rest: note_of(d2),
    test: note_of(t0),
});
