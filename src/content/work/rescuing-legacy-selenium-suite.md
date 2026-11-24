---
title: Rescuing a legacy Selenium C# test suite
role: Software Test Team Leader
period: 2019 onwards
summary: Redesigning an unreliable end-to-end suite onto layered page objects with parallel execution, then reusing the pattern for a new product team. Still growing years later.
tags: [Test automation, Selenium, C#, Page Object Model]
---

## Problem

The team had a legacy Selenium C# suite that was neither runnable nor maintainable. It existed, but nobody could rely on it when I took over in 2019. The real test of a framework is what happens after the person who rescued it moves on.

## What I did

I did not patch it; I redesigned it. My first commit was on 23 August 2019. This role combined leadership and hands-on technical work, and this was both. The design rests on a few rules:

- **Dependencies point down only.** Tests call helpers, helpers call page objects, page objects call a small control layer that wraps the browser. Tests never touch the browser library directly, so a reviewer only has to check which way an import points.
- **One door to the driver.** Clicks, waits and assertions go through a single facade, and the browser driver is resolved per test, so Selenium internals can be swapped in one place.
- **One browser per thread.** Each test looks up its own driver by test ID, so fixtures run side by side without stealing each other's browser. Fixtures run in parallel, with no shared mutable state: a stray static field counts as a correctness bug.
- **Selectors live in page objects, and pages act while tests decide.** A renamed control changes one file, and the test body reads almost like the scenario.
- **Honest trade-offs.** Tests are ordered and a prerequisite fixture seeds the data, so a mid-fixture test cannot run alone. We accepted that, and a failure teardown stops one bad test from poisoning the next.
- **A pipeline that does not change when tests are added.** Staged gates stop a long run early when a cheap prerequisite check fails. Parameters pick the slice to run, and a new category is one new entry. Parallel workers each get an isolated workspace.
- **Discipline.** Never use a fixed sleep, keep every test in a category, never weaken a test to make it pass, and write down structural decisions.

## Result

The suite became something the team could run and maintain, and the team still maintains and expands it today on the framework I built. By approximate figures it has 60+ page objects, 100+ test fixtures, 15+ shared helpers and just 5 control-layer classes: the core stays tiny while page objects and tests grow, and that ratio is the point. New tests are cheap because the team copies a proven pattern. Together with a principal software engineer, I later brought the same pattern to a different product whose team had just been set up, so they started with a proven structure instead of from zero.
