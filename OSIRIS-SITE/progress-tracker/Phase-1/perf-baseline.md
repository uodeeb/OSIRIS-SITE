# Phase 1.1: Performance Baseline

- Objective: Establish current performance baseline for OSIRIS-SITE and identify top bottlenecks.
- Date: 2026-03-31
- Status: in_progress

Scope
- Home page, OSIRIS content pages, and one multimedia-heavy page (if present).
- Desktop and mobile breakpoints; consider 375/768/1024/1440 widths.
- Key assets: fonts, images, and third-party scripts.

Baseline Metrics (targeted to collect)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

Current Observations (placeholder for initial data)
- Observations to be filled after first round of measurements using Lighthouse/WebPageTest.

Plan & Next Steps
- Run Lighthouse audits on 3 representative pages, at both desktop and mobile.
- Identify top bottlenecks (e.g., large font files, non-lazy loaded images, unnecessary JS).
- Propose initial remediation (code-splitting, font loading strategy, image optimization).
- Deliver a Phase-1 Perf Baseline report and remediation backlog.

Deliverables
- Perf Baseline report with metrics and priorities.
- Short remediation backlog aligned to Phase-1 items.

End of Phase 1.1
