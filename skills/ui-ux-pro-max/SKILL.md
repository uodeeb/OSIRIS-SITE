---
name: "ui-ux-pro-max"
description: "Provides design intelligence and design system generation. Invoke when planning UI/UX, creating design systems, or standardizing visuals/components."
---

# UI UX Pro Max

This skill provides expert UI/UX guidance and an AI-powered Design System Generator to rapidly produce a tailored design system and implementation checklist for your product.

## What It Does
- Generates a complete design system recommendation (patterns, styles, colors, typography, effects, accessibility)
- Suggests page/section architecture aligned with conversion goals
- Produces pre-delivery accessibility and interaction checklists
- Avoids anti-patterns and ensures consistency across platforms

## When To Invoke
- Starting a new product or feature UI
- Standardizing visuals/components across the app
- Improving conversion UX for landing pages and dashboards
- Auditing accessibility, motion, and responsiveness

## Quick Start
Use this prompt in your AI tool of choice (ChatGPT/Claude/Gemini) to generate a full design system:

Title: Design System Generator

Input:
- Product: [Your Product Name]
- Audience: [Primary audience]
- Brand Mood: [e.g., premium, friendly, minimalist]
- Conversion Goal: [e.g., signups, bookings]
- Constraints: [e.g., Tailwind + React, WCAG AA]

Output Requirements:
- Pattern: [layout + sections; conversion strategy]
- Style: [keywords; performance + accessibility notes]
- Colors: [primary/secondary/cta/background/text + notes]
- Typography: [primary/secondary; mood; font sources]
- Key Effects: [shadows/transitions/hover/focus]
- Avoid: [anti-patterns list]
- Pre-Delivery Checklist: [cursor, hover, contrast, focus, reduced-motion, breakpoints 375/768/1024/1440]

## Example Result (Abbreviated)
- Pattern: Hero-Centric + Social Proof; CTA above fold and post-testimonials; Sections: Hero, Services, Testimonials, Booking, Contact
- Style: Soft UI Evolution; keywords: soft shadows, subtle depth, calming, premium feel
- Colors: Primary #E8B4B8, Secondary #A8D5BA, CTA #D4AF37, Background #FFF5F5, Text #2D3436
- Typography: Cormorant Garamond / Montserrat
- Key Effects: 200–300ms transitions; gentle hover states
- Avoid: neon colors; harsh animations; dark mode; purple/pink gradients
- Checklist: hover/focus states; 4.5:1 contrast; prefers-reduced-motion; responsive 375/768/1024/1440

## Implementation Notes
- Works seamlessly with React + Tailwind + Radix UI
- Map generated tokens to existing design system (Tailwind theme and component variants)
- Verify motion/accessibility with prefers-reduced-motion and focus-visible

## Best Practices
- Keep CTA prominent and repeated at logical points
- Respect brand mood while ensuring performance (LCP/CLS)
- Use SVG icon sets (Heroicons/Lucide); avoid emojis

