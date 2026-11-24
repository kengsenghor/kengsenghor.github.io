---
title: Handing the checking to AI agents, and what held
role: Architect and hands-on engineer
period: A three-month run, August to October
summary: Running the gated seven-stage pipeline across a visual UI suite and an end-to-end suite, to see which testing ideas survive when agents do the checking.
tags: [AI engineering, Playwright, TypeScript, Test strategy]
---

## Problem

I wanted to know whether three ideas hold under load when I give an agent the checking: that testing is not checking, that tools extend your thinking, and that context decides how much to hand over.

## What I did

I ran the same seven-stage pipeline, human-gated at the end, across two repositories with different safety rails. The visual UI suite covers a component library with baselines for four browsers. The end-to-end suite covers five product modules with 340+ specs of real user journeys and hard guards on every run.

- **Agents check; I still explore.** Agents plan, generate, review and run. An explorer agent drafts session-based charters using a product-coverage checklist, but the exploring itself, judging risk and deciding what matters stays with me.
- **A green run only tells you what it checked.** In one real end-to-end autopilot run, review failed and escalated to me, a dry run passed, the live run failed twice, and it went green three times only after two missing steps were fixed. Those steps surfaced only when the test actually ran. Elsewhere, two browser projects were silently running the same browser.
- **Most of the visual work was making screenshots repeatable.** Fonts are forced to load rather than awaited, tooltips are cleared before capture, sub-pixel clipping is forced, and baselines are rendered in CI, never on a laptop. A green screenshot only counts if it is repeatable.
- **How much I hand over depends on the change.** The end-to-end hooks cannot edit specs, production environments are refused, protected branches cannot be pushed to, and checks are locked before code is written. Exploration is optional, security-sensitive changes get an extra review, and new baselines are eyeballed before anything ships.

## Result

Over three months the work covered 30+ tickets (20+ visual UI, 10+ end-to-end and harness) and 232 non-merge commits across the two suites and the pipeline plugin. The tools changed and the ideas did not.
