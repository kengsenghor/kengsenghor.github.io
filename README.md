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
| `npm run lighthouse` | Lighthouse scores for key routes (run after `build`) |

Full verification: `npm run check && npm test && npm run build && npm run scan && npm run test:e2e && npm run lighthouse`.

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

No company-related terms anywhere: no employer, internal product or vendor brand names. Describe work generically. `banned-terms.txt` lists the terms. It is git-ignored and kept on your machine only (copy `banned-terms.example.txt` to create it); the tests and scan fail with a clear message when it is missing. the unit tests scan `src/`, `public/`, `docs/` and this README, and `npm run scan` scans the built site. Add a term to that file whenever a new one needs blocking. Run the checks on a machine that has the file; a fresh clone will fail until it is created.

## Deploy

`npm run build` produces plain static files in `dist/`. Upload them to any static host and serve at the domain root. There is no server and no `base` path.

## Placeholders to replace before launch

- `public/headshot-placeholder.svg`: replace with a real headshot and update the `src` in `src/pages/index.astro`.
- `public/cv-placeholder.txt`: replace with a PDF CV that follows the naming rule, and update the link in `src/pages/cv.astro`.
