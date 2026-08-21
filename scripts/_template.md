# Script page template (not published)

Copy this frontmatter into `scripts/your-script-name/index.md`. Put the script beside it as `your-script-name.ps1`.

```yaml
---
title: Human title
summary: One sentence.
difficulty: beginner
topics: [files]
parameters:
  - name: Path
    type: string
    required: true
    description: Folder to work on.
---
```

The body is usage notes. The site embeds the sibling `.ps1` automatically.
