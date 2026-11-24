# kengsenghor.com

Static work-portfolio site for Keng Seng Hor, built with Astro. The home page is a CI pipeline run: career stages pass through a quality gate.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Build static output to `dist/` |
| `npm run check` | Type and content checks (`astro check`) |
| `npm test` | Unit tests (Vitest), including the naming-rule guard |
| `npm run test:e2e` | Browser tests (Playwright): behaviour, no-JS, theme, accessibility (axe, WCAG 2.1 AA) |
| `npm run scan` | Scan `dist/` for banned terms (run after `build`) |
| `npm run cv-pdf` | Regenerate `public/cv.pdf` from the `/cv` page (run after `build`, then build again) |
| `npm run lighthouse` | Lighthouse scores for key routes (run after `build`) |

Full verification: `npm run check && npm test && npm run build && npm run scan && npm run test:e2e && npm run lighthouse`.

## Interactive features

All controls are added by script; without JavaScript the content is still fully readable.

- **Filter and explore:** `/work` has a search box and tag chips (filters are kept in the URL hash); the home page can expand or collapse all career stages.
- **Run pipeline:** the home page build log can be played line by line; each stage line jumps to that stage. Reduced-motion users get the finished log immediately.
- **Sprint forecast calculator:** shown on any case study whose frontmatter has `widget: forecast`.
- **Lab:** `/lab` lists the pieces, including the "Ship or halt" game. Its scenarios live in `src/lib/scenarios.ts`.

## Photo

The home page shows `src/assets/headshot.jpg` when that file exists, otherwise a text monogram. The file is git-ignored and never committed. CI gets it from the `HEADSHOT_B64` repository secret (base64 of the same file): `base64 -i src/assets/headshot.jpg | tr -d '\n' | gh secret set HEADSHOT_B64`. Keep it small (400px, metadata removed) because secrets are limited to 48 KB.

## Add a case study

Add one Markdown file to `src/content/work/`. The filename becomes the URL (`/work/<filename>`). Required frontmatter (the build fails with a clear error if any is missing or too short):

```md
---
title: Short title
role: Your role
period: 2024 to 2025
summary: One or two sentences, at least 20 characters.
tags: [Tag one, Tag two]
---

## Problem
## What I did
## Result
```

"What I did" and "Result" may be merged when detail is thin. Do not invent metrics.

## Career data

Roles, education, certifications and the profile live in `src/data/career.ts` and feed both the home page and `/cv`. Edit it in one place.

## Naming rule

No company-related terms anywhere: no employer, internal product or vendor brand names. Describe work generically. `banned-terms.txt` lists the terms. It is git-ignored and kept on your machine only (copy `banned-terms.example.txt` to create it); the tests and scan fail with a clear message when it is missing. the unit tests scan `src/`, `public/`, `tests/`, `scripts/`, the root config files and this README, and `npm run scan` scans the built site. Add a term to that file whenever a new one needs blocking. Run the checks on a machine that has the file; a fresh clone will fail until it is created.

## Deploy

`npm run build` produces plain static files in `dist/`. Upload them to any static host and serve at the domain root. There is no server and no `base` path.

## Monogram and CV download

- The home page shows a text monogram (KH) instead of a photo. To add a photo later, put a metadata-free, resized image in `public/` and replace the `.monogram` element in `src/pages/index.astro`.
- The CV download `public/cv.pdf` is generated from the `/cv` page by `npm run cv-pdf`, so it matches the page and carries no phone number or company names. After changing `src/data/career.ts`, run `npm run build && npm run cv-pdf` and commit the new PDF. `npm run scan` reads the PDF text with `pdftotext`.
