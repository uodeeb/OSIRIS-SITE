# Performance Optimization Guide

This document provides a guide to performance optimization best practices for all web development projects using the ZOZ skill.

## Performance Budget

A performance budget is a set of limits on the metrics that affect site performance. It helps to ensure that the website remains fast and responsive as it evolves.

| Metric | Budget |
|---|---|
| **First Contentful Paint (FCP)** | < 1.8 seconds |
| **Largest Contentful Paint (LCP)** | < 2.5 seconds |
| **First Input Delay (FID)** | < 100 milliseconds |
| **Cumulative Layout Shift (CLS)** | < 0.1 |
| **Time to Interactive (TTI)** | < 5 seconds |
| **Total Page Size** | < 500 KB |

## Performance Optimization Checklist

### Image Optimization

- [ ] Compress all images to reduce their file size.
- [ ] Use modern image formats (e.g., WebP, AVIF).
- [ ] Use responsive images to serve appropriately sized images for different screen sizes.
- [ ] Use lazy loading for images that are not in the initial viewport.

### CSS Optimization

- [ ] Minify all CSS files.
- [ ] Use a critical CSS strategy to inline critical CSS and load non-critical CSS asynchronously.
- [ ] Remove unused CSS.

### JavaScript Optimization

- [ ] Minify all JavaScript files.
- [ ] Use code splitting to break up large JavaScript files into smaller chunks.
- [ ] Load JavaScript asynchronously or defer its loading.
- [ ] Remove unused JavaScript.

### Caching

- [ ] Use browser caching to store static assets on the user's device.
- [ ] Use a Content Delivery Network (CDN) to cache assets closer to the user.

### Server-Side Optimization

- [ ] Use a fast and reliable web host.
- [ ] Enable server-side compression (e.g., Gzip, Brotli).
- [ ] Use a server-side caching solution.
