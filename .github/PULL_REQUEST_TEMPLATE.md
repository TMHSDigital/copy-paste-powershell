## What this changes

<!-- One or two sentences. Link the issue if there is one: Fixes #123 -->

## Checklist

- [ ] `npm run validate` and `npm run hygiene` pass
- [ ] `npm test` passes
- [ ] For page or style changes: `npm run build:gh`, then `npm run check-links` and `npm run a11y` pass
- [ ] For scripts or snippets: `./tests/run.ps1 -Lint` passes (ideally on both Windows PowerShell 5.1 and PowerShell 7)
- [ ] Placeholder paths only (`.\docs`, `$env:TEMP`, `C:\Path\To\Folder`). No real user folders, machine names, or secrets
- [ ] Anything that changes files or system state supports `-WhatIf` or previews first
- [ ] New script: `index.md` parameters match the `param()` block, and there is a test in `tests/Scripts.Tests.ps1`
- [ ] New builder: text fields use `{{name:q}}`
- [ ] I previewed the page with `npm start`
