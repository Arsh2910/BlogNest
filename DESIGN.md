# BlogNest Web App - Design System

## Core Philosophy: The Modern Curator
This design system is a high-end editorial framework designed to transform a standard blogging platform into a prestigious digital publication. It prioritizes intentional asymmetry and tonal depth over rigid grids, using generous whitespace as a functional element.

---

## Typography

The system uses a pairing of **Manrope** for its geometric authority and **Public Sans** for its neutral, high-legibility neutrality.

- **Display Font:** Manrope
- **Headline Font:** Manrope
- **Body Font:** Public Sans
- **Label Font:** Public Sans

### Usage Guidelines
- **Display:** `display-lg` (3.5rem) with negative letter-spacing (-0.02em) for hero titles. Mimics high-end editorial mastheads.
- **Headline:** `headline-md` (1.75rem) for article subsections to maintain a strong hierarchy.
- **Body:** `body-lg` (1rem). Use a line height of `1.6` for a comfortable, rhythmic reading experience.
- **Labels:** `label-md` (0.75rem) in all-caps with `0.05em` tracking for pill-shaped tags or categories.
- **Do not use pure black text.** Always use `#1a1c1c` (On Background / On Surface) to avoid visual vibrating.

---

## Color Palette

### Primary Brand
- **Primary:** `#3525cd`
- **Primary Container:** `#4f46e5`
- **On Primary:** `#ffffff`

### Secondary Features
- **Secondary:** `#58579b`
- **Secondary Container:** `#b6b4ff`

### Surface Architecture
Treat the UI as a physical stack of fine paper. **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts:
- **Background / Base Layer:** `#f9f9f9`
- **Surface:** `#f9f9f9`
- **Content Cards (Surface Container Lowest):** `#ffffff` (creates a subtle "pop" from the off-white background)
- **Sections (Surface Container Low):** `#f3f3f3`
- **Sidebar/Meta (Surface Container):** `#eeeeee`
- **High-density Wells (Surface Container Highest):** `#e2e2e2`

### Text Elements
- **On Background / On Surface:** `#1a1c1c`
- **On Surface Variant:** `#464555`

### Feedback & Accents
- **Tertiary:** `#7e3000` (Use sparingly for "Editor's Choice" or "Trending" highlights)
- **Error:** `#ba1a1a`

---

## Interactive & Visual Elements

### The "Glass & Gradient" Rule
- For floating navigation or interactive overlays, use **Glassmorphism**: Apply `#ffffff` at 80% opacity with a `24px` backdrop blur.
- Signature Polish: Apply a subtle linear gradient to main CTAs transitioning from `#3525cd` to `#4f46e5`.

### Elevation & Depth
- **Do not use standard, heavy drop shadows.** 
- **Ambient Shadows:** For interactive cards, use a shadow with a blur of `40px`, Y-offset of `12px`, and an opacity of `4%` using the `on_surface` color (`#1a1c1c`).

### Shapes & Components
- **General Corner Roundness:** Fully Rounded (`ROUND_FULL`)
- **Tags & Chips:** Pill geometry (`9999px` / `full`). Use `#e2dfff` for background and `#3323cc` for text.
- **Article Cards:** Use `1.5rem` (`md`) rounding to maintain a soft, approachable professional look.
- **Inputs & Fields:** Background `#f3f3f3`. Active state: `#ffffff` background with 1px "Ghost Border" of `#3525cd`.

### Layout & Composition
- **Forbid dividers.** Use `3rem` (xl) spacing between card elements.
- **Asymmetric Layout:** On desktop, experiment with 2-column cards where the image takes 60% and text takes 40% with an overlapping offset of `-2rem`.
