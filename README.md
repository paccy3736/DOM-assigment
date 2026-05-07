# Ikawa House — Kigali Coffee Shop Landing Page

A polished, fully responsive single-page landing website for **Ikawa House**, a fictional specialty coffee shop based in Kigali, Rwanda. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

*"Ikawa" means "coffee" in Kinyarwanda.*

---

## Features

- **Responsive Navigation** — Fixed top navbar with smooth-scroll links; collapses into a hamburger menu on mobile (≤768 px). Active link highlights as you scroll.
- **Hero Section** — Full-viewport banner with a Rwandan coffee-themed tagline and a call-to-action button.
- **Menu with Category Filter** — Browse Espresso Drinks, Cold Drinks, and Rwandan-inspired Food items (mandazi, isombe toast, fried plantain). Filter buttons animate items in/out without a page refresh. Prices displayed in Rwandan Francs (RWF).
- **About Section** — Story of the shop's Kigali roots, sourcing from Huye Mountain and Nyamasheke farmers, with an animated statistics counter.
- **Gallery with Lightbox** — Responsive image grid; click any photo to open a full-screen lightbox with prev/next navigation and keyboard support (Arrow keys + Escape).
- **Testimonials Carousel** — Auto-advancing carousel featuring Kigali customer reviews with Rwandan names and neighbourhoods. Manual controls pause auto-advance for 5 seconds.
- **Contact Form** — Kigali address (KG 7 Ave, Kimihurura), Rwandan phone number, and inline-validated contact form with success message.
- **Back to Top Button** — Floating button appears after scrolling 300 px; smooth-scrolls back to the top.
- **Fade-in Animations** — Each section fades in as it enters the viewport using the Intersection Observer API.
- **Accessible** — Semantic HTML5, ARIA labels, keyboard navigation, focus trapping in the lightbox, and WCAG AA contrast ratios.

---

## What This Project Demonstrates

- DOM selection with `getElementById`, `querySelector`, and `querySelectorAll`
- Event listeners for clicks, scroll, keyboard, and input events
- Dynamic class toggling to show/hide elements and change styles
- Creating and removing DOM elements at runtime
- CSS custom properties for consistent theming
- CSS Grid and Flexbox for responsive layouts
- Intersection Observer API for scroll-triggered animations
- `requestAnimationFrame` for smooth counter animations

---

## Rwandan Context

| Element | Detail |
|---|---|
| Shop name | Ikawa House (*ikawa* = coffee in Kinyarwanda) |
| Location | KG 7 Ave, Kimihurura, Kigali |
| Phone | +250 788 123 456 |
| Currency | Rwandan Franc (RWF) |
| Bean origins | Huye Mountain, Nyamasheke (Southern & Western Provinces) |
| Local food items | Mandazi, Isombe Toast, Fried Plantain, Banana Cake |
| Testimonial neighbourhoods | Kimihurura, Kacyiru, Nyamirambo, Remera |

---

## File Structure

```
├── index.html   — Page structure and content
├── style.css    — All styles, custom properties, and media queries
├── script.js    — All JavaScript interactions and DOM manipulation
└── README.md    — This file
```

---

## Running Locally

No build tools or dependencies required.

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

```bash
# Optional: serve with a local server
npx serve .
# or
python -m http.server 8080
```

---

## Student Information

- **Student Name:** [Your Name]
- **Course:** [Your Course Name]
- **Year:** 2025
