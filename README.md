# For Alyssa ♡ — A Digital Love Letter

A modern, interactive love letter website built with Next.js 14, Tailwind CSS, and Framer Motion.

## Features

### Visual Design
- Elegant cream/rose color palette inspired by the original design
- Cormorant Garamond serif + DM Sans typography
- Smooth scroll animations and parallax effects
- 3D interactive elements using Three.js / React Three Fiber

### Sections
1. **Hero** — Full-viewport hero with animated background shapes, floating particles, and 3D heart
2. **Our Story** — Animated timeline with scroll-progress effects
3. **Moments** — Bento-grid photo gallery with 3D hover effects
4. **Reasons** — Interactive reason cards with glow effects
5. **Letter** — Elegant letter reveal with decorative elements
6. **Final CTA** — Closing romantic message with floating hearts

### Interactions
- Magnetic button hover effects
- 3D card tilt effects on hover
- Smooth scroll-triggered animations (Framer Motion)
- Parallax scrolling throughout
- Mobile-responsive navigation with hamburger menu

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Customization

### Personalize Content
Edit these sections in `src/app/page.tsx`:
- Navigation name: Change "for alyssa ♡" to your person's name
- Timeline: Update the dates and story moments
- Photo labels: Replace "your photo here" with actual labels
- Reasons: Customize the reasons why you love them
- Letter: Personalize the love letter content

### Change Colors
Update the color palette in `tailwind.config.js`:
```js
colors: {
  cream: '#FAF8F5',
  ink: '#1A1714',
  rose: '#C8877A',
  // ...
}
```

### Add Photos
Replace the placeholder color blocks in the Moments section with actual images:
```jsx
<Image src="/your-photo.jpg" alt="..." fill className="object-cover" />
```

## Tech Stack

- **Next.js 14** — App Router, Server Components
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Scroll animations, page transitions
- **Three.js + React Three Fiber** — 3D elements
- **TypeScript** — Type safety

## License

Made with ♡# For-Lee-Ann
