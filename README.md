# Nicholas Harrison — personal website

A portable, dependency-free academic website with pinned cards, editable content, responsive pages, and a small mathematics demo. The source is ordinary HTML, CSS and JavaScript. No paid service, database, or account is needed to run it locally.

## Run on your computer

Install Node.js 20 or later. Open this folder in Codex, VS Code, or a terminal:

```sh
npm start
```

Visit http://127.0.0.1:3000. No `npm install` is needed. The homepage lives in `index.html`; all primary content lives in `content.json`.

On Windows, you can also double-click `start-website.cmd` and keep its window open. If Node is available but `npm` is not on your PATH, use `node scripts/serve.mjs` to start, `node scripts/check.mjs` to check, and `node scripts/build.mjs` to build. These are the same commands the npm scripts run.

## Edit

Open `http://127.0.0.1:3000/editor.html`. Edit your introduction, card titles, descriptions and links, upload a profile photo, and add papers, courses, talks, or personal links. **Save to local files** updates `content.json`. Then commit and push your changes.

The editor on a static hosted site can preview changes and download an updated `content.json`; it cannot write to GitHub or alter the live site. Replace the local file and commit it to publish. Draft previews use session storage in the current browser; they are not a published or durable source of truth.

Under **Papers & projects**, each paper has an **About the paper & proof** section. Edit **The idea**, **Main results**, and **Proof ideas**, including headings, equations, notes, and expandable proof step titles and explanations. These fields use plain text; no HTML is needed. Preview changes and open Research → Explore the paper to review them, then save to local files. The original SQG explanations remain under `paperPanels` in `content.json`; other papers store their own `explanations`. Keep each paper page ID unique. PDF files are stored in `assets/papers/`, with arXiv records linked separately.

You can also ask Codex to edit `content.json` directly. For design changes ask it to edit `style.css`; for page structure, `app.js`. All six card links are configurable and can point to built-in pages or external URLs. Built-in destinations: `#research`, `#teaching`, `#talks`, `#lab`, `#about`, `#contact`. The SQG explorer lives at `#sqg`.

## Research results map

The Research page links to `#results-map`. Select a result to see its scope, assumptions, proof mechanism, and source. The connected diagram branches from a central question into endpoint integrability, refined smoothness, and a different transport equation. Selecting a result highlights immediate connections. Labeled solid connections show research directions and extensions; dashed connections show complementary results and related ideas. Edit node text under **Research results map** in the editor. These labels and descriptions live in `content.json` under `resultsMap`; the layout and interactions live in `results-map.js` and `style.css`.

## Profile, CV and PDFs

Add your real profile photo in the editor. Put PDFs into `assets/` and enter a link such as `assets/cv.pdf` or `assets/sqg.pdf`. Email and CV fields start blank intentionally. No complete publication or talk history has been invented. The supplied SQG entry is based on your manuscript. Check all biographical and academic content before public release.

## Build and check

```sh
npm run check
npm run build
```

The build creates `dist/` and a complete downloadable source ZIP at `dist/downloads/website-source.zip`. Source assets remain outside `dist/`; never edit generated files there. Both the server and build use only Node.js; Python and package installation are not needed on Windows, macOS, or Linux.

## Upload to GitHub

From this folder, tell Codex:

> Create a private GitHub repository named personal-website in my account, commit this website and push it. Keep the content editable in content.json. Do not overwrite another repository.

Or, with GitHub CLI installed and authenticated, create a NEW repository. This local folder already has Git history imported from your original Site. Confirm `git remote -v` has no unrelated GitHub destination before proceeding:

```sh
git add .
git commit -m "Create personal website"
gh repo create personal-website --private --source=. --remote=origin --push
```

If using the downloadable source ZIP, it contains no .git directory or hosting credentials. You choose the repository name and visibility. GitHub Pages availability for private repositories depends on your GitHub plan. You can keep source private and choose another static host, or intentionally make the repository public if desired.

## Publish with GitHub Pages

An Actions workflow is included in `.github/workflows/pages.yml`. In the chosen repository, go to Settings → Pages and select **GitHub Actions** as the source. Run the workflow or push to `main`. It checks, builds, and deploys `dist/`. All asset paths are relative, so project URLs such as `/personal-website/` work.

Do not commit .openai hosting configuration from a ChatGPT Site into an unrelated GitHub project. The downloadable ZIP already excludes that configuration. GitHub Pages and the ChatGPT Site are separate deployments; a GitHub push does not automatically update the ChatGPT Site.

This local copy retains the original design and content. `.openai/` is ignored for future Git additions. Because its configuration exists in the imported history, the GitHub Pages workflow publishes only the clean `dist/` output, and the downloadable source ZIP excludes all Site configuration and Git history. To start a GitHub repository with completely independent history, extract that ZIP into a new folder and run `git init -b main` there first.

## Suggested Codex handoff

> Work in this website folder. Read AGENTS.md and README.md. Preserve the pinned-card design and update the site using content.json whenever possible. Run npm run check and npm run build. Show me the changes and commit them to my chosen GitHub repository without force-pushing.

## Accessibility and maintenance

Navigation is semantic HTML. Cards are real links. Decorative art is inline SVG; pins and paper surfaces are CSS. Reduced-motion preferences are respected. The layout adapts to phones, tablets and desktops. Keep image files reasonably small. The probability demo assumes independent Poisson goal totals and concerns regulation time only.
