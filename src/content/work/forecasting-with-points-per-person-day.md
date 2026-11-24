---
title: Forecasting sprints with points per person-day
role: Engineering manager
period: Ongoing practice
summary: A simple way to forecast sprints that compares like with like by measuring velocity per available person-day.
tags: [Agile delivery, Forecasting, Metrics, Sprint planning]
widget: forecast
---

## Problem

Raw story points mislead. A team that finishes 64 points with 80 person-days available and a team that finishes 32 points with 40 person-days both ran at 0.8 points per person-day. The second sprint did not go badly; only the people-time differed.

## What I did

I measure velocity as points finished divided by available person-days, meaning working days after leave and holidays, so sprints of any size and in any season can be compared. The baseline is the average or median of the last three or four sprints, updated every sprint, so one strong or weak sprint does not swing the plan. The forecast is capacity: person-days multiplied by the baseline, compared with what the team plans to commit. Anything above it is a stretch, and we call it one. A rolling baseline smooths the sprint-to-sprint noise and shows the real direction.

I look for a steady baseline with no sudden jumps, 90%+ of committed work finished sprint after sprint, and a small and shrinking share of unplanned reactive work. I watch for three traps: re-estimation (velocity can climb because points grew, not because the team got faster), blank zeros (a metric at 0% may simply be untracked), and league tables (points are not comparable across teams, so compare a team with its own history).

## Result

Sprint forecasts the team can trust, and planning conversations that start from capacity instead of hope.
