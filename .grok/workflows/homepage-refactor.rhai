let meta = #{
    name: "homepage-refactor",
    description: "Serial SimonAKing-style homepage refactor: breakdown, review, archive, develop, test, ship",
    when_to_use: "Rebuild the homepage in SimonAKing/HomePage style on the refactor branch",
    phases: [
        #{ title: "需求拆解", detail: "Map template mechanics; record leftovers; handoff" },
        #{ title: "评审", detail: "Review the breakdown" },
        #{ title: "归档", detail: "Archive agreed plan into handoff" },
        #{ title: "开发", detail: "Config, fluid, transitions, responsive homepage" },
        #{ title: "测试", detail: "Playwright on shipped site; dual build" },
        #{ title: "上线", detail: "GitHub Pages deploy or honest blocker" },
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
    s += "Repo: /Users/chao/workspace/repo/joe-cheung-cae.github.io on branch refactor (from main 51f2ef8). ";
    s += "Work in this shared workspace. Do NOT use isolation worktrees. ";
    s += "Do NOT git commit, push, merge, rebase, or checkout another branch. ";
    s += "Do NOT mix design-upgrade leftover work. Do not copy SimonAKing persona, avatar, or supportAuthor. ";
    s += "Person/site remains Joe Cheung (CAE & HPC). Keep Astro/MDX/notes/search/projects/bilingual data-lang. ";
    s += "Do not rewrite MDX post bodies or src/data/projects.ts semantics. ";
    s += "Handoff file: docs/simonaking-refactor-handoff.md . Breakdown: docs/simonaking-refactor-breakdown.md . ";
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
        pause("infra", name + " agent failed or returned empty. model=grok-4.6");
    } else if r.output != () && r.output.done == false {
        pause("verification", name + " reported done=false.");
    }
}

fn p_breakdown() {
    let s = bars();
    s += "PHASE 需求拆解 (high thinking). Use read_file/grep/list_dir on this repo. ";
    s += "Map SimonAKing/HomePage defining mechanics onto THIS homepage. Known template facts: ";
    s += "config.json encapsulates head/intro/main identity; intro.background toggles PavelDoGreat WebGL-Fluid-Simulation on canvas#background; ";
    s += "two screens (content-intro then content-main card); enter/scroll/swipe runs anime.js SVG path morph (1100ms, intro translateY -200vh); ";
    s += "responsive; delayed page switch. Do not import Vue/Pug/Gulp. Keep this Astro stack. ";
    s += "WRITE docs/simonaking-refactor-breakdown.md covering: leftover branches vs main; ";
    s += "config shape (Joe Cheung, not Simon); fluid start/stop + reduced-motion; intro/main UI; ";
    s += "page-transition machinery; inner routes (blog/projects/about/search) stay reachable; ";
    s += "files to add/edit; Playwright assertions on shipped dist; dual npm run build; GitHub Pages 上线 path. ";
    s += "WRITE/UPDATE docs/simonaking-refactor-handoff.md with: current phase 需求拆解 status=done; leftovers table ";
    s += "(design-upgrade 9 commits not merged, gh-pages deploy branch, stash leftover dirty files); ";
    s += "what changed this phase; what 评审 must do next. Confirm .grok/workflows/homepage-refactor.rhai exists. ";
    s += "Do not implement the homepage UI in this phase. Return done=true, files, notes. ";
    s
}

fn p_review() {
    let s = bars();
    s += "PHASE 评审 (high thinking). Read-only tools first: read docs/simonaking-refactor-breakdown.md, ";
    s += "docs/simonaking-refactor-handoff.md, src/pages/index.astro, src/site.config.ts, src/layouts/BaseLayout.astro, ";
    s += "e2e/*.spec.ts, package.json, .grok/workflows/homepage-refactor.rhai. ";
    s += "Adversarially review the breakdown. Check: identity stays Joe Cheung; fluid is PavelDoGreat class and toggleable; ";
    s += "reduced-motion turns fluid off; notes/search/projects remain reachable; card-link-structure e2e will need a real featured-notes region or an explicit spec update; ";
    s += "no design-upgrade CSS-only hero-grid contract; 上线 is npm run deploy:github / gh-pages not Docker. ";
    s += "WRITE findings into docs/simonaking-refactor-review.md (pass/fail per requirement, required edits before 开发). ";
    s += "UPDATE handoff: phase 评审 status, findings summary, what 归档 must lock. Do not implement UI. Return done=true. ";
    s
}

fn p_archive() {
    let s = bars();
    s += "PHASE 归档 (low thinking). Read breakdown + review + current handoff. ";
    s += "Do not invent new design. UPDATE docs/simonaking-refactor-handoff.md so it is the frozen agreed plan: ";
    s += "config fields, fluid on/off rules, transition behavior, files to touch, e2e contracts, leftover branches, next 开发 steps. ";
    s += "Mark 需求拆解/评审/归档 as done and 开发 as next. Minimal edits. Return done=true. ";
    s
}

fn p_dev_config() {
    let s = bars();
    s += "PHASE 开发/config (high). Expand homepage identity into a highly encapsulated config (extend src/site.config.ts and/or src/homepage.config.ts). ";
    s += "Joe Cheung identity: author, role, roleZh, email, github, description. Intro: title, subtitle, enter label, background boolean default true. ";
    s += "Main: name, signature, optional avatar, nav links to /blog /about mailto github. ";
    s += "Add src/lib/fluid-control.ts with PURE functions: shouldStartFluid({backgroundEnabled, reducedMotion}) returns true only when backgroundEnabled && !reducedMotion; ";
    s += "export types. Add src/lib/page-transition.ts with PURE helpers for intro->main transition state (e.g. isIntroActive, reduced-motion skip). ";
    s += "Zod-validate config if you add a parse helper. No UI rewrite yet except wiring config types. Return done=true. ";
    s
}

fn p_dev_fluid() {
    let s = bars();
    s += "PHASE 开发/fluid (high). Vendor PavelDoGreat WebGL-Fluid-Simulation class as used by SimonAKing/HomePage into this Astro site. ";
    s += "Put the sim in src/scripts/webgl-fluid.ts or .js (MIT license header required). canvas#background on the homepage intro. ";
    s += "Export startFluid(canvas)/stopFluid() that the homepage island calls. If intro.background is false OR prefers-reduced-motion: reduce, do NOT create/start the canvas. ";
    s += "Do not load the sim on inner routes. Keep a data-fluid-background=on|off attribute on the homepage root for Playwright. Return done=true. ";
    s
}

fn p_dev_home() {
    let s = bars();
    s += "PHASE 开发/homepage (high). Rebuild src/pages/index.astro as SimonAKing two-screen homepage using the config. ";
    s += "Intro screen: full viewport, config title/subtitle/enter, canvas#background when enabled, SVG shape-wrap for the transition, arrows. ";
    s += "Main screen: identity card (name, signature/role, links Blog/About/Email/GitHub from config) plus keep featured notes (article wrapping a single non-empty a, heading Start Here) so existing card-link e2e can still locate them, plus selected work links. ";
    s += "Homepage shell may omit the sticky inner Header overlay on the intro, but search/lang/theme must remain reachable (overlay or persist after enter). ";
    s += "Bilingual i18n-en/i18n-zh pairs for all new UI strings. Responsive: identity and primary nav visible at a 390px viewport. ";
    s += "Do not use Comic Sans; keep IBM Plex. Dark fluid aesthetic on intro is OK; bronze accent may remain. Return done=true. ";
    s
}

fn p_dev_motion() {
    let s = bars();
    s += "PHASE 开发/transitions (high). Implement smooth intro->main transition without requiring a new animation library if Web Animations API suffices; anime.js is allowed only if already justified. ";
    s += "Enter click, wheel down, and swipe-up trigger the same transition. Delayed switch (~1100ms) matching the template. data-page-transition=intro|main|busy on a root node for Playwright. ";
    s += "Under prefers-reduced-motion: reduce, skip the morph and show main (or jump instantly) AND do not start fluid. ";
    s += "Mount Astro 5 ClientRouter from astro:transitions in BaseLayout for inner-route navigations. Rebind search Cmd/Ctrl+K after astro:page-load. ";
    s += "Keep ThemeToggle/LangToggle working. Return done=true. ";
    s
}

fn p_test() {
    let s = bars();
    s += "PHASE 测试 (medium-high). Add/update Playwright specs under e2e/ that drive the REAL built site (page.goto, same dist + port 4321 as playwright.config.ts). ";
    s += "Required: config-backed name/role visible on / ; fluid/WebGL canvas present when background enabled; canvas ABSENT when background configured off AND under prefers-reduced-motion: reduce; ";
    s += "a nav/enter action exercises page-transition (data-page-transition changes or intro leaves); mobile 390px viewport still shows identity and primary nav; critical controls non-empty. ";
    s += "Update e2e/card-link-structure.spec.ts if the Start Here region moved. Keep search-keyboard-shortcuts and dual-theme specs green if those surfaces still exist. ";
    s += "Run npm run build twice (both exit 0, non-empty dist). Run npm run test:e2e. ";
    s += "Capture logs if possible; parent will copy to scratch. UPDATE handoff with test results. Return done=true with notes of pass/fail. ";
    s
}

fn p_ship() {
    let s = bars();
    s += "PHASE 上线 (medium-high). Use this repo production GitHub Pages path: npm run deploy:github (build:github + gh-pages -d dist --dotfiles). ";
    s += "Do not invent Docker/GitLab as the 上线 path. Do not merge refactor into main unless required by the existing deploy (it is not; gh-pages is the publish branch). ";
    s += "If deploy cannot run here, capture the REAL blocker in notes and leave local dist as the refactored site. UPDATE handoff 上线 status. Return done=true. ";
    s
}

let phase_name = "";
if args != () && args.phase != () {
    phase_name = args.phase;
}
if phase_name == "" {
    pause("verification", "Pass args.phase: breakdown | review | archive | develop | test | ship");
}

log("homepage-refactor phase=" + phase_name + " model=grok-4.6 serial");

if phase_name == "breakdown" {
    phase("需求拆解");
    let r = agent(p_breakdown(), opts("breakdown-high", "grok-46-high", "all"));
    after(r, "需求拆解");
    complete(#{ summary: "需求拆解 finished", phase: "breakdown", notes: r.output.notes });
}

if phase_name == "review" {
    phase("评审");
    let r = agent(p_review(), opts("review-high", "grok-46-high", "all"));
    after(r, "评审");
    complete(#{ summary: "评审 finished", phase: "review", notes: r.output.notes });
}

if phase_name == "archive" {
    phase("归档");
    let r = agent(p_archive(), opts("archive-low", "grok-46-low", "read-write"));
    after(r, "归档");
    complete(#{ summary: "归档 finished", phase: "archive", notes: r.output.notes });
}

if phase_name == "develop" {
    phase("开发");
    let c = agent(p_dev_config(), opts("dev-config-high", "grok-46-high", "all"));
    after(c, "开发/config");
    let f = agent(p_dev_fluid(), opts("dev-fluid-high", "grok-46-high", "all"));
    after(f, "开发/fluid");
    let h = agent(p_dev_home(), opts("dev-home-high", "grok-46-high", "all"));
    after(h, "开发/homepage");
    let m = agent(p_dev_motion(), opts("dev-motion-high", "grok-46-high", "all"));
    after(m, "开发/transitions");
    complete(#{ summary: "开发 finished", phase: "develop" });
}

if phase_name == "test" {
    phase("测试");
    let r = agent(p_test(), opts("test-medium", "grok-46-medium", "all"));
    after(r, "测试");
    complete(#{ summary: "测试 finished", phase: "test", notes: r.output.notes });
}

if phase_name == "ship" {
    phase("上线");
    let r = agent(p_ship(), opts("ship-medium", "grok-46-medium", "all"));
    after(r, "上线");
    complete(#{ summary: "上线 finished", phase: "ship", notes: r.output.notes });
}

pause("verification", "Unknown args.phase=" + phase_name + " expected breakdown|review|archive|develop|test|ship");
