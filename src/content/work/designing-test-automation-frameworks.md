---
title: Designing test automation frameworks across UI, API and performance
role: Engineering manager and framework architect
period: Ongoing practice
summary: One layer contract and a few shared habits across visual, functional, API and performance test suites in several languages.
tags: [Test automation, Framework design, Monorepo, CI/CD]
---

## Problem

Several teams needed automation across different test types and stacks. Without a shared way of working, each suite would drift into its own conventions, and file counts and green builds would hide real gaps in coverage.

## What I did

I set a way of working across four core projects: a visual regression suite for a component library (30+ components, 100+ spec files, 4 browsers), a functional end-to-end monorepo with several product modules, an API suite, and the agentic pipeline plugin. Alongside them sit Selenium suites in C# and Java and load tests built from one plan per user journey.

- **One layer contract everywhere.** Specs say what to test and only call step methods, steps orchestrate and hold the assertions, and pages know where things are. A failing spec reads as a sentence, and a change in component markup means editing one page object.
- **Monorepo means self-contained modules.** Each module owns its pages, steps, specs and data with no cross-module imports. One configuration lists the exact files each project runs, not a glob, and module rules sit next to the module. The gain is one browser version, one lint ruleset and one pipeline to reason about. The cost is configuration sprawl and drift between modules.
- **Visual checks pair screenshots with computed styles.** One baseline per browser, baselines rendered only in CI, and every diff triaged as regression, intentional change or flake before any baseline is touched.
- **Count real coverage.** In the API suite, about 7 in 10 spec files turned out to be placeholders with one empty test each. File count is not coverage, and permanent red is noise, so stub failures are reported as unstable and real tests are counted with the test runner's own list command.
- **Parameterise, and protect secrets.** One environment file per target, one collection with swapped environments instead of drifting copies, and logins kept in the CI credential store, never typed into a script.
- **Performance tests follow the same discipline.** One plan per journey, users and ramp-up as properties, test users from a data file, percentiles and failure rate on every run, and recorded plans cleaned of third-party calls and hard-coded tenant identifiers before reuse.
- **Agents draft, humans publish.** Commit, push, pull request and merge stay with a person.

## Result

Teams share one vocabulary, so people can move between suites without relearning, and quality reports reflect real tests instead of placeholders.
