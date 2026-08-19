let meta = #{
    name: "homepage-notes-comic-code",
    description: "Orchestrate Comic Code as the primary family for current-homepage notes (中英文字体); not IBM Plex-first on that region",
    when_to_use: "When featured/latest homepage notes English and Chinese copy must use Comic Code first",
    phases: [
        #{ title: "Inspect", detail: "Locate homepage notes font sources for 中英" },
        #{ title: "Apply", detail: "Point notes UI at Comic Code-first" },
        #{ title: "Verify", detail: "Unit + Playwright computed font-family" },
    ],
};

fn bars() {
    let s = "";
    s += "Repo: /Users/chao/workspace/repo/joe-cheung-cae.github.io on branch refactor. ";
    s += "Work in this shared workspace. Do NOT use isolation worktrees. ";
    s += "Do NOT git commit, push, merge, rebase, or checkout another branch. ";
    s += "OBJECTIVE: current homepage notes (主页笔记) 中英文字体 must use Comic Code as the primary font-family. ";
    s += "Scope only featured + latest notes on src/pages/index.astro (#featured-notes, #latest-notes, card titles/descriptions, i18n-en and i18n-zh). ";
    s += "Do not restyle intro title, identity card, chrome, /blog notes shell, post bodies, or code blocks. ";
    s += "Do not substitute Comic Sans, Comic Mono, or IBM Plex as the first family. IBM Plex may remain a fallback after Comic Code. ";
    s += "Do not purchase or commit a commercial Comic Code webfont binary. Use @font-face local('Comic Code') plus the named family. ";
    s += "CJK glyphs may fall back; the CSS primary family must still be Comic Code for both languages. ";
    s += "Keep font-family in src/lib/homepage-notes-font.ts so styles and unit tests read the same shipped stack. ";
    s
}

fn opts(label, agent_type, mode) {
    #{
        label: label,
        capability_mode: mode,
        model: "grok-4.6",
        agent_type: agent_type,
    }
}

fn after(r, name) {
    if r == () || r.success != true {
        pause("infra", name + " agent failed or returned empty.");
    }
}

fn p_inspect() {
    let s = bars();
    s += "PHASE Inspect (read-only). Use read_file, grep, list_dir. Do not edit. ";
    s += "Read src/pages/index.astro, src/styles/homepage.css, src/styles/global.css, src/layouts/BaseLayout.astro, ";
    s += "src/lib/homepage-notes-font.ts if present, e2e/homepage-simonaking.spec.ts, e2e/card-link-structure.spec.ts. ";
    s += "Report where homepage notes 中英 copy get their font-family, and whether Comic Code is already first ";
    s += "(IBM Plex-first on #featured-notes / #latest-notes is a gap). ";
    s += "Confirm this workflow file .grok/workflows/homepage-notes-comic-code.rhai exists and names Comic Code. ";
    s
}

fn p_apply() {
    let s = bars();
    s += "PHASE Apply. Use tools. If homepage notes already use Comic Code as the first family for i18n-en and i18n-zh ";
    s += "via src/lib/homepage-notes-font.ts + homepage.css @font-face local('Comic Code') + .homepage-notes rules, ";
    s += "do not change files. ";
    s += "Otherwise: add/keep src/lib/homepage-notes-font.ts exporting HOMEPAGE_NOTES_PRIMARY_FAMILY = Comic Code, ";
    s += "the stack, parse/primary helpers, CSS extract helpers, homepageNotesInlineStyle(). ";
    s += "Wire index.astro featured + latest sections with class homepage-notes, id latest-notes, style from homepageNotesInlineStyle(). ";
    s += "In homepage.css declare @font-face font-family Comic Code src local('Comic Code'), and apply font-family ";
    s += "var(--homepage-notes-font-family, Comic Code stack) on .homepage-notes and .homepage-notes .i18n-en / .i18n-zh. ";
    s += "Add/keep src/lib/homepage-notes-font.test.ts that imports the shipped module, reads the real homepage.css and index.astro, ";
    s += "and fails if the notes stack is not Comic Code-first. ";
    s += "Add/keep e2e/homepage-notes-font.spec.ts that loads / twice, enters main, and asserts computed font-family ";
    s += "primary is Comic Code for data-lang=en and data-lang=zh on featured and latest notes copy. ";
    s += "Do not re-implement the stack inside tests. Run npm run test:unit after edits. ";
    s
}

fn p_verify() {
    let s = bars();
    s += "PHASE Verify. Drive the shipped path. No test theater. ";
    s += "Run npm run test:unit (must include homepage-notes-font.test.ts). ";
    s += "Run npm run build so Playwright serves dist. ";
    s += "Run npx playwright test e2e/homepage-notes-font.spec.ts e2e/homepage-simonaking.spec.ts e2e/card-link-structure.spec.ts. ";
    s += "Confirm computed font-family on homepage notes is Comic Code-first for en and zh. ";
    s += "A readback that shows IBM Plex (or any non-Comic Code primary) is a fail. ";
    s
}

let phase_name = "all";
if args != () && args.phase != () {
    phase_name = args.phase;
}

log("homepage-notes-comic-code phase=" + phase_name + " family=Comic Code notes=主页笔记 中英");

if phase_name == "inspect" {
    phase("Inspect");
    let r = agent(p_inspect(), opts("inspect-notes-font", "grok-46-high", "read-only"));
    after(r, "Inspect");
    complete(#{ summary: "Inspect finished", phase: "inspect" });
}

if phase_name == "apply" {
    phase("Apply");
    let r = agent(p_apply(), opts("apply-notes-font", "grok-46-high", "all"));
    after(r, "Apply");
    complete(#{ summary: "Apply finished", phase: "apply" });
}

if phase_name == "verify" {
    phase("Verify");
    let r = agent(p_verify(), opts("verify-notes-font", "grok-46-medium", "all"));
    after(r, "Verify");
    complete(#{ summary: "Verify finished", phase: "verify" });
}

if phase_name == "all" {
    phase("Inspect");
    let i = agent(p_inspect(), opts("inspect-notes-font", "grok-46-high", "read-only"));
    after(i, "Inspect");
    phase("Apply");
    let a = agent(p_apply(), opts("apply-notes-font", "grok-46-high", "all"));
    after(a, "Apply");
    phase("Verify");
    let v = agent(p_verify(), opts("verify-notes-font", "grok-46-medium", "all"));
    after(v, "Verify");
    complete(#{ summary: "homepage notes Comic Code (中英) orchestrated", phase: "all" });
}

pause("verification", "Unknown args.phase=" + phase_name + " expected inspect|apply|verify|all");
