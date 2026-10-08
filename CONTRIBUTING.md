# Contributing

Add a markdown or `.ps1` file, preview locally, and open a pull request. The site picks up new files automatically. Do not edit navigation lists or hardcode titles in templates.

The fastest way to fix a typo is the **Edit this page on GitHub** link at the bottom of every page.

## Set up

Requires Node.js 22 or later (see `.nvmrc`). PowerShell tests need [Pester](https://pester.dev) 5+ and PSScriptAnalyzer.

```powershell
npm install
npm start
```

Open `http://localhost:8080`.

## Checks

CI runs all of these. Run them before you open a PR.

| Command | What it checks |
| --- | --- |
| `npm run hygiene` | No local user paths, tokens, or keys in any tracked file |
| `npm run validate` | Frontmatter is complete; builder templates quote text fields; one `.ps1` per script folder |
| `npm test` | Builder rendering and escaping (Node) |
| `npm run build:gh` then `npm run check-links` | Every internal link and asset resolves |
| `npm run a11y` (after `npm run build:gh`) | axe accessibility check of every page, light and dark. Needs `npx playwright install chromium` once |
| `./tests/run.ps1 -Lint` | Pester tests for every script, every snippet on the site parses, builder output runs against a test folder, PSScriptAnalyzer |

Install the PowerShell test tools once:

```powershell
Install-Module Pester -MinimumVersion 5.5.0 -Scope CurrentUser -Force -SkipPublisherCheck
Install-Module PSScriptAnalyzer -RequiredVersion 1.25.0 -Scope CurrentUser -Force
```

CI runs the PowerShell tests on both Windows PowerShell 5.1 and PowerShell 7. If you can, run `./tests/run.ps1` in both.

## Add a command

1. Copy [`commands/_template.md`](commands/_template.md) to `commands/your-cmdlet.md`.
2. Fill in every required frontmatter field: `title`, `cmdlet`, `aliases`, `category`, `difficulty`, `topics`, `command`, `summary`, `module` (the module the cmdlet ships in, for example `Microsoft.PowerShell.Management`), and `platforms` (any of `windows`, `linux`, `macos`, as a list like `[windows, linux, macos]`). Use `topics` for keywords. Do not use Eleventy `tags`.
3. Use placeholder paths only: `.\docs`, `$env:TEMP`, `C:\Path\To\Folder`.
4. Run `npm run validate`, then `npm start`, and confirm the command appears under `/commands/`.

`category` is a slug. Known labels: `files`, `text`, `system`, `network`, `help`. A new slug works, but validation warns so typos get caught.

## Add a script

1. Create `scripts/your-script-name/`.
2. Add `your-script-name.ps1` with comment-based help and `[CmdletBinding()]`. Use `[CmdletBinding(SupportsShouldProcess)]` and support `-WhatIf` only if the script changes files or system state. Read-only scripts should not take `-WhatIf`.
3. Add `index.md` using [`scripts/_template.md`](scripts/_template.md) as the frontmatter guide. The `parameters` list must match the script's `param()` block exactly; a test checks it.
4. Parameters only. No hardcoded machine names, user folders, or secrets.
5. Add a `Describe` block for it in `tests/Scripts.Tests.ps1` that runs it against a folder in `$TestDrive`.

## Add a builder

1. Copy [`builders/_template.md`](builders/_template.md) to `builders/your-builder.md`.
2. Define `fields` and a `template`. The template file explains the placeholder rules. The important one: insert text fields as `{{name:q}}`, which quotes them safely for PowerShell. Validation fails otherwise.
3. `npm test` and `./tests/run.ps1` render your builder with tricky input (`$`, quotes, brackets) and check that the output still parses.

## Add a guide

1. Add `guides/your-guide.md` with `title`, `summary`, `order`, and `topics`.
2. Lower `order` sorts earlier.
3. Use `topics` for keywords. Do not use Eleventy `tags`. `tags` would dump the page into extra collections and fail CI.

## Do not commit

- Real user paths (anything inside your own Windows or macOS profile folder). Use `$HOME`, `$env:TEMP`, or `.\docs` instead.
- Credentials, tokens, API keys, `.env` files
- Transcripts, CLIXML dumps, local profiles
- `node_modules/` or `_site/`

CI fails the build if content matches those patterns.

## Maintainers: GitHub Pages

The workflow deploys on push to `main`. One-time setup in the repo: **Settings > Pages > Source > GitHub Actions**.
