# PowerShell for Dummies

Copy-paste PowerShell for beginners: commands with explanations, ready-to-run scripts, and form-based script builders.

## GitHub Pages

The workflow deploys on push to `main`. Once, in the repo: **Settings > Pages > Source > GitHub Actions**.

Site: [tmhsdigital.github.io/Powershell-for-Dummies](https://tmhsdigital.github.io/Powershell-for-Dummies/)

Drop a file in `commands/`, `scripts/`, `builders/`, or `guides/` and the site publishes it on the next push to `main`. Nothing is hardcoded in the templates.

## Local preview

Requires Node.js 18 or later.

```powershell
npm install
npm start
```

Then open `http://localhost:8080`.

| Script | What it does |
| --- | --- |
| `npm start` | Serve locally with live reload |
| `npm run build` | Write `_site/` |
| `npm run validate` | Check required frontmatter |
| `npm run hygiene` | Fail on local paths and secret-like strings |

## Add a command

1. Copy `commands/_template.md` to `commands/get-whatever.md`.
2. Fill in the frontmatter. `command` is the one-liner the copy button uses.
3. Open a PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

```
commands/     one markdown file per command
scripts/      folder per script: .ps1 plus index.md
builders/     markdown form spec plus template
guides/       beginner reading path
```

## License

Apache License 2.0. Copyright 2026 TMHSDigital. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
