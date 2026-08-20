let meta = #{
    name: "docs-license-cleanup",
    description: "Inventory docs and upstream licenses, add an LGPL-3.0-compatible repo license with SimonAKing and Pavel notices, clean stale docs, and verify with unit tests",
    when_to_use: "Full-repo documentation cleanup plus a license compatible with SimonAKing/HomePage LGPL-3.0 and PavelDoGreat WebGL-Fluid-Simulation MIT",
    phases: [
        #{ title: "Inventory", detail: "Docs inventory and upstream licenses from real sources" },
        #{ title: "License", detail: "Write LICENSE, COPYING, NOTICE, and package.json license" },
        #{ title: "Docs", detail: "Correct or stamp stale root and docs markdown" },
        #{ title: "Verify", detail: "Add unit test on shipped files, run tests, write scratch logs" },
    ],
};

let repo = "/Users/chao/workspace/repo/joe-cheung-cae.github.io";
let scratch = "/var/folders/b6/8k06h5td1cx92vtlp6x1_z380000gn/T/grok-goal-9c77493a3731/implementer";
if args != () {
    if args.repo != () { repo = args.repo; }
    if args.scratch != () { scratch = args.scratch; }
}

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

fn bars(repo) {
    let s = "";
    s += "Repo: " + repo + " on the current branch. ";
    s += "Work in this shared workspace. Do NOT use isolation worktrees. ";
    s += "Do NOT git commit, push, merge, rebase, or checkout another branch. ";
    s += "Do NOT rewrite MDX post bodies, src/data/projects.ts semantics, or homepage/UI/CSS behavior. ";
    s += "Do NOT mutate src/scripts/webgl-fluid.js except to leave its MIT header intact (do not edit that file). ";
    s += "Do NOT add extra new .md or .txt files. License/notice files without those extensions are required. ";
    s += "Live site: https://joe-cheung-cae.github.io/ . Stack: Astro, Tailwind, MDX, Preact, MiniSearch. ";
    s += "Deploy: GitHub Pages from the gh-pages branch via npm run deploy:github (not GitHub Actions). ";
    s += "Identity: Joe Cheung, CAE and HPC engineer. ";
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
    } else if r != () {
        json_encode(r)
    } else {
        "empty"
    }
}

fn p_inv_docs(repo) {
    let s = bars(repo);
    s += "PHASE Inventory/docs. READ-ONLY. Use read_file, grep, list_dir on this repo. ";
    s += "List every markdown file at repo root and under docs/. For each, say whether it matches the live site ";
    s += "(Joe Cheung personal site, Astro/Tailwind/MDX/Preact/MiniSearch, gh-pages deploy, live URL) ";
    s += "or is stale/contradictory (Notion-like framing, particle-upgrade plans, empty Unreleased, ";
    s += "chaoboli/notion-like-tech-notes URLs, Tech Notes blog-only, GitHub Actions as current Pages method). ";
    s += "Also read package.json (no license field today), README.md, DEPLOYMENT.md, CHANGELOG.md, ";
    s += "GROK_BUILD_PLAN.md, prompt.md, docs/Grok-Build-Upgrade-Plan.md, docs/simonaking-*.md. ";
    s += "Do not edit files. Return done=true and notes listing each file with keep/stamp-historical/fix. ";
    s
}

fn p_inv_upstream(repo) {
    let s = bars(repo);
    s += "PHASE Inventory/upstream. READ-ONLY. Use read_file on src/scripts/webgl-fluid.js (first 40 lines) ";
    s += "and fetch real upstream license texts. curl these URLs (do not invent licenses): ";
    s += "https://raw.githubusercontent.com/SimonAKing/HomePage/master/LICENSE ";
    s += "https://github.com/SimonAKing/HomePage (confirm LGPL-3.0) ";
    s += "https://raw.githubusercontent.com/PavelDoGreat/WebGL-Fluid-Simulation/master/LICENSE ";
    s += "Confirm: SimonAKing/HomePage is LGPL-3.0; PavelDoGreat/WebGL-Fluid-Simulation is MIT ";
    s += "Copyright (c) 2017 Pavel Dobryakov. This repo vendors the fluid via Simon background.js. ";
    s += "Homepage mechanics were ported from SimonAKing, so MIT-only at repo root is NOT acceptable. ";
    s += "LGPL-3.0 requires accompanying GNU GPL-3.0 text. ";
    s += "Do not edit files. Return done=true and notes with SPDX ids, URLs, and recommended repo SPDX LGPL-3.0-only. ";
    s
}

fn p_license(repo, inv_notes) {
    let s = bars(repo);
    s += "PHASE License. WRITE files in the shared workspace. Inventory notes follow: ";
    s += json_encode(inv_notes);
    s += " DECISION (do not pick MIT-only): repo SPDX is LGPL-3.0-only because homepage portions ";
    s += "are derived from SimonAKing/HomePage (LGPL-3.0). Pavel fluid remains MIT. ";
    s += "CREATE these files (overwrite ok if incomplete). Do not create extra .md/.txt: ";
    s += "1) LICENSE at repo root. Short copyright/SPDX preamble THEN the verbatim GNU LGPL v3 text. ";
    s += "Fetch verbatim LGPL from https://raw.githubusercontent.com/SimonAKing/HomePage/master/LICENSE ";
    s += "or https://raw.githubusercontent.com/spdx/license-list-data/master/text/LGPL-3.0-only.txt . ";
    s += "Preamble must say: Joe Cheung personal site; SPDX-License-Identifier: LGPL-3.0-only; ";
    s += "derived portions from SimonAKing/HomePage LGPL-3.0; vendored fluid is MIT Pavel Dobryakov; ";
    s += "GNU GPL v3 is in COPYING; third-party list is in NOTICE. ";
    s += "2) COPYING at repo root: verbatim GNU GPL v3. Fetch ";
    s += "https://raw.githubusercontent.com/spdx/license-list-data/master/text/GPL-3.0-only.txt ";
    s += "or curl https://www.gnu.org/licenses/gpl-3.0.txt . File must contain GNU GENERAL PUBLIC LICENSE and Version 3. ";
    s += "3) NOTICE at repo root (no extension). Must name both upstreams with URLs and licenses: ";
    s += "SimonAKing/HomePage https://github.com/SimonAKing/HomePage License LGPL-3.0 ; ";
    s += "Pavel Dobryakov WebGL-Fluid-Simulation https://github.com/PavelDoGreat/WebGL-Fluid-Simulation License MIT ";
    s += "Copyright (c) 2017 Pavel Dobryakov ; vendored path src/scripts/webgl-fluid.js via Simon src/js/background.js. ";
    s += "4) package.json: add top-level field license with exact value LGPL-3.0-only . Do not change scripts or deps. ";
    s += "Do not edit webgl-fluid.js. Confirm its MIT header is still present after you finish. ";
    s += "Use search_replace or write tools. Return done=true, files list, notes. ";
    s
}

fn p_docs(repo) {
    let s = bars(repo);
    s += "PHASE Docs. EDIT existing markdown only. Do not add new .md files. ";
    s += "Current site facts: Joe Cheung personal site; live https://joe-cheung-cae.github.io/ ; ";
    s += "stack Astro, Tailwind, MDX, Preact, MiniSearch; deploy gh-pages via npm run deploy:github. ";
    s += "License: LGPL-3.0-only, see LICENSE, COPYING, NOTICE. ";
    s += "README.md: keep live URL and stack; add a License section that names LICENSE and LGPL-3.0 ";
    s += "and points at NOTICE for SimonAKing/HomePage (LGPL-3.0) and Pavel WebGL-Fluid (MIT). ";
    s += "DEPLOYMENT.md: replace Tech Notes blog framing with Joe Cheung personal site; ";
    s += "keep gh-pages branch deploy as the current Pages method; in Switching from Docker to GitHub Pages ";
    s += "remove Enable GitHub Actions as the current method — use Settings Pages Deploy from a branch gh-pages. ";
    s += "Fix leftover joe-blog project-site advice so this user site uses DEPLOY_BASE=/ . ";
    s += "CHANGELOG.md: fill [Unreleased] with license+docs cleanup; fix compare/release URLs from ";
    s += "chaoboli/notion-like-tech-notes to https://github.com/joe-cheung-cae/joe-cheung-cae.github.io ; ";
    s += "keep 1.0.0/1.1.0 as historical; note package.json version is 0.0.1 (changelog 1.x is site history). ";
    s += "Stamp HISTORICAL at the top of GROK_BUILD_PLAN.md, prompt.md, docs/Grok-Build-Upgrade-Plan.md, ";
    s += "and every docs/simonaking-*.md so they cannot be read as current tasking. Banner must say historical, ";
    s += "not current, live URL, current stack, gh-pages, see README.md and LICENSE. Do not delete those files. ";
    s += "Do not edit src/ except if you must not. Return done=true and files list. ";
    s
}

fn p_verify(repo, scratch) {
    let s = bars(repo);
    s += "PHASE Verify. ADD src/lib/license-docs.test.ts so npm run test:unit picks it up ";
    s += "(runner: node --test --experimental-strip-types src/lib/*.test.ts). ";
    s += "The test MUST read the actual files from disk via node:fs readFileSync relative to repo root ";
    s += "(from import.meta.url: join(dirname(fileURLToPath(import.meta.url)), '../..')). ";
    s += "No mocks. Do not re-implement a license checker. Do not hard-code the full LICENSE body as the only assertion. ";
    s += "Tests must FAIL if any of these are missing: ";
    s += "non-empty root LICENSE; package.json.license matching that choice (LGPL-3.0 in both package.json and LICENSE text, ";
    s += "LICENSE must contain GNU LESSER GENERAL PUBLIC LICENSE); ";
    s += "SimonAKing/HomePage named with LGPL-3.0 in NOTICE and/or README; ";
    s += "Pavel or WebGL-Fluid named with MIT in NOTICE and/or README; ";
    s += "src/scripts/webgl-fluid.js still contains MIT License and Copyright (c) 2017 Pavel Dobryakov; ";
    s += "README names or links LICENSE and includes https://joe-cheung-cae.github.io/ and the current stack words ";
    s += "Astro and Tailwind. Also assert COPYING is non-empty and contains GNU GENERAL PUBLIC LICENSE. ";
    s += "Match existing test style: import assert from node:assert/strict; import { describe, test } from node:test. ";
    s += "THEN run: node --test --experimental-strip-types src/lib/license-docs.test.ts ";
    s += "and npm run test:unit . Capture stdout/stderr. ";
    s += "WRITE these files under " + scratch + " (create the dir if needed): ";
    s += "license-docs-test.log (the license-docs.test.ts run), unit.log (full npm run test:unit), ";
    s += "docs-inventory.log (list remaining markdown at repo root and docs/, note historical vs current; ";
    s += "grep the tree excluding node_modules and dist for leftover false claims that GitHub Actions is the ";
    s += "current Pages method). ";
    s += "If tests fail, FIX the shipped files or the test until they pass, then re-run and overwrite the logs. ";
    s += "Return done=true only after both test commands pass. notes must include pass counts. ";
    s
}

phase("Inventory");
let inv_jobs = [];
inv_jobs.push(#{
    prompt: p_inv_docs(repo),
    label: "inventory-docs",
    capability_mode: "read-only",
    model: "grok-4.6",
    agent_type: "grok-46-high",
    output_schema: result_schema(),
});
inv_jobs.push(#{
    prompt: p_inv_upstream(repo),
    label: "inventory-upstream",
    capability_mode: "read-only",
    model: "grok-4.6",
    agent_type: "grok-46-high",
    output_schema: result_schema(),
});
let inv = parallel(inv_jobs);
if inv[0] == () || inv[1] == () {
    pause("infra", "Inventory parallel returned an empty slot.");
}
after(inv[0], "inventory-docs");
after(inv[1], "inventory-upstream");
let inv_notes = "docs: " + note_of(inv[0]) + " | upstream: " + note_of(inv[1]);
log("inventory complete");

phase("License");
let lic = agent(p_license(repo, inv_notes), opts("license-apply", "grok-46-high", "all"));
after(lic, "license-apply");
log("license files written");

phase("Docs");
let docs = agent(p_docs(repo), opts("docs-cleanup", "grok-46-high", "all"));
after(docs, "docs-cleanup");
log("docs cleanup complete");

phase("Verify");
let ver = agent(p_verify(repo, scratch), opts("verify-tests", "grok-46-medium", "all"));
after(ver, "verify-tests");
log("verify complete");

complete(#{
    summary: "docs-license-cleanup finished",
    inventory: inv_notes,
    license: note_of(lic),
    docs: note_of(docs),
    verify: note_of(ver),
});
