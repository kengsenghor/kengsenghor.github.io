---
title: Agentic AI testing pipeline
role: Architect and owner
period: 2025 to present
summary: A governed, evidence-gated pipeline that lets AI agents analyse, design, write and run tests without being able to cheat their way to a green result.
tags: [AI engineering, Test automation, Governance, Observability]
---

## Problem

Generating tests is easy; trusting them is hard. AI agents are probabilistic, and the fastest route from red to green is almost always to weaken the test: delete the assertion, hardcode the data, or add a sleep. Each turns red into green and destroys the reason the test existed.

## What I did

I architected and govern a pipeline delivered as a plugin for an AI coding assistant, and built it hands-on. A ticket goes through seven stages with a gate between each: intake, planning, optional live exploration, generation, review, execution and healing.

- **Agents draft, engineers govern.** Each stage produces a draft, and only an approval or a passed evidence gate lets the next stage run. There is no auto-commit and no auto-PR, and the last step, merging, is human only.
- **The plan is a contract.** Before any code, an explicit table lists every file to create or modify. The generator refuses to start if the table is missing, empty or marked "to be decided", so scope creep becomes a named violation instead of a surprise in review.
- **Rules the agent cannot negotiate.** Never edit an assertion (halt and report a probable product bug), never swap generated data for a literal, no arbitrary sleeps, capped retries that halt when there is no progress, three greens in a row before a pass counts, and never run against production.
- **A pass without evidence is a claim, not a result.** Every stage hands over a short capsule, and the gate refuses a PASS with empty evidence. Work is graded by a different context from the one that produced it, and safety rules run before the gate.
- **Two modes.** In copilot mode a person approves every handoff. In autopilot mode an evidence gate advances the handoff, failures get bounded retries and then halt to a person, and the run ends at a publish boundary with the diff uncommitted.
- **Framework-agnostic by construction.** Shared core skills hold the process and a small profile per framework supplies the details, so a new framework means writing one profile, not editing seven stages.
- **Cost control.** Models are routed by tier: cheap for high-volume generation, standard for structured work, and the most capable for open-ended analysis and diagnosis, with escalation by one tier when work is blocked, ambiguous or fails the same way twice. Routing never overrides safety. Progressive disclosure, which loads reference material only when needed, cut the always-loaded instruction lines from 2,175 to 1,067, a 51% reduction in one refactor.

## Result

The pipeline is installed in the shared component library's visual test suite and has been extended to an end-to-end suite and further teams. The value is not in the model; it is in the constraints around it, and the gates are the feature.
