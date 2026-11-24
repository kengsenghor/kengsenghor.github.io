---
title: Engineering metrics that drive decisions
role: Senior Software Engineering Manager
period: Ongoing practice
summary: A small scorecard of delivery, quality and test-automation signals, each with a target, a direction and an owner, read as trends rather than snapshots.
tags: [Engineering leadership, Metrics, Quality, Delivery]
---

## Problem

Dashboards for their own sake do not change anything. Leadership needs numbers that drive decisions, in business terms, across delivery, quality and test automation.

## What I did

I review eight signals every sprint: change failure rate, support SLA compliance, reactive work share, deploy frequency, merge-to-production lead time, forecast accuracy, defect escape rate and new-code test coverage. Every metric has a target, a direction and an owner.

- **Shape tests like a pyramid.** A common starting split is about 50% unit, 30% API and 20% end-to-end, with fewer tests as you go up because they are slower and costlier to keep stable. Within end-to-end, prioritise the user journeys customers cannot live without.
- **Trend over target.** A rising line tells me a habit is forming. A dip tells me where to ask what changed, before it becomes an incident.
- **Compare coverage by layer.** The lowest bar becomes next quarter's investment, not the layer the loudest voice asks for.
- **Coverage means little if tests are not trustworthy.** I track pass rate right next to coverage. A sudden dip means flaky tests or a real regression, and either way it needs a look.
- **Five questions when a metric moves.** Is it a trend or a one-off? What changed in people, process or code? Is the metric measuring the right thing? What is the smallest fix with the biggest effect? Who owns it, and by when?

## Result

Metrics start conversations, not blame. I set a target and a direction for every metric, watch trends rather than snapshots, pair coverage with pass rate, and share the misses, because they drive the roadmap. The monthly test metrics and quarterly engineering metrics reach leadership in these terms.
