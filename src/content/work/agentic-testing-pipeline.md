---
title: Agentic AI testing pipeline
role: Architect and owner
period: 2025 to present
summary: A governed, observable pipeline that lets AI agents analyse, design, write and run tests without letting them mask defects.
tags: [AI engineering, Test automation, Governance, Observability]
---

## Problem

AI agents are probabilistic. Left unchecked, an agent can make a failing test pass by weakening it, which hides a real defect, and teams cannot trust output they cannot inspect.

## What I did

I architected and govern a pipeline delivered as a plugin for an AI coding assistant. It has six governed stages, from analysing a ticket through designing scenarios, generating test code, review, execution and a minimal-fix diagnosis. It runs in two modes: a copilot mode with human checkpoints and an autopilot mode that advances only when a stage passes its gate.

The design rests on observability and governance. Halt rules stop an agent from masking a defect, such as editing assertions or looping on the same failure. I built it hands-on, and I use it daily with my own teams.

## Result

The pipeline is installed in the shared component library's visual test suite and is being extended to further teams.
