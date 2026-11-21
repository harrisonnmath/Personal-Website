# Working on this website

- Read README.md before editing. Use content.json for biography, card labels, links, profile photo, papers, courses, talks and personal links.
- This is a portable static website; keep it free of framework dependencies unless explicitly requested.
- Preserve the refined pinned-card design, warm neutral background, forest-green typography, restrained illustrations and accessible real text.
- Main source: index.html, style.css, app.js, content.json, editor.html, editor.js and assets/.
- Never edit generated dist/ files. Run `npm run check` and `npm run build` after meaningful source changes.
- Do not invent papers, journal status, talks, affiliations, dates, email addresses, CV details, or external links. Ask for missing personal information or leave the relevant field blank.
- Do not turn a manuscript into a published claim. The SQG explanation must distinguish norm inflation from unbounded essential supremum on every initial interval.
- Static-hosted editor changes must be downloaded and committed. Only the localhost Node server can write content.json. Do not claim local browser drafts update a published website.
- Preserve relative asset paths for GitHub Pages project subpaths.
- Preserve accessible focus styles, reduced-motion support, keyboard tab navigation and responsive layouts.
- Before using GitHub, verify the intended repository. Do not overwrite unrelated files or force-push. Keep credentials out of files and commits.
- The .openai/hosting.json configuration, if present, belongs to the ChatGPT-hosted version. Exclude it when making a portable download or creating an unrelated GitHub project.
