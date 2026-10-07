# Contributing

Add a markdown or `.ps1` file, preview locally, and open a pull request. The site picks up new files automatically. Do not edit navigation lists or hardcode titles in templates.

## Preview

```powershell
npm install
npm start
```

Open `http://localhost:8080`. `npm run build` writes the static site to `_site/`. `npm run validate` and `npm run hygiene` are what CI runs.

## Add a command

1. Copy [`commands/_template.md`](commands/_template.md) to `commands/your-cmdlet.md`.
2. Fill in every required frontmatter field (`title`, `cmdlet`, `aliases`, `category`, `difficulty`, `topics`, `command`). Use `topics` for keywords. Do not use Eleventy `tags`.
3. Use placeholder paths only: `.\docs`, `$env:TEMP`, `C:\Path\To\Folder`.
4. Run `npm run validate` then `npm start` and confirm the command appears under `/commands/`.

`category` is a slug. Known labels: `files`, `text`, `system`, `network`, `help`. A new slug is fine; the site title-cases it for the nav.

## Add a script

1. Create `scripts/your-script-name/`.
2. Add `your-script-name.ps1` with comment-based help and `[CmdletBinding()]`. Use `[CmdletBinding(SupportsShouldProcess)]` only if the script changes files or system state. Read-only scripts should not take `-WhatIf`.
3. Add `index.md` using [`scripts/_template.md`](scripts/_template.md) as the frontmatter guide.
4. Parameters only. No hardcoded machine names, user folders, or secrets.
5. Support `-WhatIf` for anything that changes files or system state.

## Add a builder

1. Copy [`builders/_template.md`](builders/_template.md) to `builders/your-builder.md`.
2. Define `fields` and a `template`. `{{name}}` is replaced with the field value. `{{#name}}flag text{{/name}}` is included when a checkbox is on.

## Add a guide

1. Add `guides/your-guide.md` with `title`, `summary`, `order`, and `topics`.
2. Lower `order` sorts earlier.
3. Use `topics` for keywords. Do not use Eleventy `tags`. `tags` would dump the page into extra collections and fail CI.

## Do not commit

- Real user paths (`C:\Users\`, `/Users/`)
- Credentials, tokens, API keys, `.env` files
- Transcripts, CLIXML dumps, local profiles
- `node_modules/` or `_site/`

CI fails the build if content matches those patterns.
