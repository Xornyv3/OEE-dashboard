# Prodex Dashboard — Client User Guide

Welcome to Prodex — your window into real‑time production performance. This guide is for operators, supervisors, and managers. It explains how to use each section of the dashboard and what every KPI means, with practical tips to act on insights.

## What is OEE?

Overall Equipment Effectiveness (OEE) tells you how effectively equipment is producing compared to its full potential.

- Availability: % of scheduled time equipment is actually running
- Performance: % of ideal production speed you are achieving
- Quality: % of good parts (no defects) out of all produced
- OEE: Availability × Performance × Quality (all in %)

Example: 90% Availability × 85% Performance × 98% Quality ≈ 75% OEE.

## Daily workflow (5–10 minutes)

1. Start of shift
   - Check the Overview to see current OEE and top alerts.
   - Confirm today’s targets (e.g., OEE, FPY, energy per good piece) in Reference.
2. During shift
   - Watch Real‑time for counts, machine status, and micro‑stops.
   - Use Heatmap to spot when/where OEE dips.
3. End of shift
   - Review day’s trends and note top losses for handover/continuous improvement.

## Sections walkthrough

### Overview

- Snapshot of core KPIs: OEE, Availability, Performance, Quality.
- Today’s production counts (Total, Good, Scrap) and yield (FPY).
- Quick deltas vs target (green if above target, red if below).
- When to act: If OEE dips >5 pts below target, drill into Real‑time and Micro‑stops.

### Real‑time

- Machines list: which assets are ON/OFF and assigned line.
- Counts: Total, Good, Scrap, and Rate per Hour update frequently.
- Minute‑by‑minute OEE chart (last 60 minutes): see immediate impact of slowdowns.
- Micro‑stops: short interruptions that reduce Performance; investigate frequent causes.
- Heatmap (by hour × asset): patterns of low OEE through the day across machines.

### Quality

- Yield/FPY (% of good parts) and scrap drivers.
- Watch for sudden drops after changeovers or material changes.
- Action: If FPY declines, escalate to quality checks and isolate suspect machines.

### Maintenance & Integrity

- Failure modes, recent issues, and MTTR/MTBF context.
- Use for root‑cause sessions when the same micro‑stops repeatedly appear.
- Action: Prioritize assets with high downtime and low MTBF.

### Planning & ERP (if connected)

- Work orders, assignments, and materials context.
- Cross‑check planned vs actual throughput; adjust staffing and sequencing.

### Energy (if connected)

- kWh per good piece and per hour; track against target.
- Action: Focus on periods with high kWh/good and low OEE to find waste.

### Advanced Analytics (if enabled)

- Forecasts, anomaly detection, and what‑if scenarios.
- Use for weekly reviews and improvement projects.

## KPI glossary

- OEE (%): Overall Equipment Effectiveness, the primary score for productive time.
- Availability (%): Time equipment is running ÷ scheduled production time.
- Performance (%): Actual output speed ÷ ideal speed, adjusted for running time.
- Quality (%): Good parts ÷ total parts produced.
- FPY (First Pass Yield, %): % of units passing quality inspection without rework.
- Total / Good / Scrap (units): Counts of produced pieces.
- Rate per Hour (uph): Throughput speed; watch for sudden dips.
- MTTR (Mean Time to Repair, hours): Average time to fix failures.
- MTBF (Mean Time Between Failures, hours): Average time between breakdowns.
- kWh per Good: Energy per conforming product; aim to reduce without harming quality.

## Reading the charts

- Minute‑OEE: Short‑term trend; sharp drops suggest stoppages or slow cycles.
- Micro‑stops: Many short events often explain performance losses; address top reasons.
- Heatmap: Darker low‑OEE blocks indicate recurring issues by hour/asset; plan a focused kaizen.

## Targets & benchmarks

- Company/line targets (e.g., OEE 85%, FPY 98%) appear in the Reference section.
- Interpreting:
  - OEE within 2 pts of target → stable
  - OEE 3–5 pts below target → investigate (performance vs availability vs quality)
  - >5 pts below target → corrective action (maintenance/quality/line balancing)

## Acting on insights

- Low Availability: Check changeover/maintenance duration and unplanned stops.
- Low Performance: Look at micro‑stops, cycle time variance, and material flow.
- Low Quality: Review recent changeovers, materials, and operator notes.
- Escalate with evidence: Use charts + exact times to align maintenance/quality teams.

## Tips for operators and supervisors

- Monitor the Minute‑OEE line during changeovers to catch slow ramp‑ups.
- Use Heatmap at midday to plan interventions before peak hours.
- Log top 3 losses per shift; revisit weekly in improvement meetings.

## FAQs

- Why do I see realistic sample data? When live data isn’t connected, Prodex shows lifelike samples so you can train and plan without downtime.
- Which tabs are read‑only? All sections are read‑only by default; any writes occur via integrations configured by your admin.
- Can I change targets? Targets are maintained by admins in the Reference/ERP systems; ask your lead to update them.

If you need a brief live tour or onboarding session, reach out to your admin or CI lead. Prodex is designed to make wins visible and losses actionable, fast.
