# The Obsidian - Design System

**A luxury shortlet rental property design system**  
*Elegant • Minimalist • Premium*

---

## Design Philosophy

### Core Principles

1. **Luxury Through Simplicity**
   - Clean, uncluttered layouts
   - Generous white space
   - Subtle, refined interactions
   - Quality over quantity

2. **Architectural Elegance**
   - Inspired by modern architecture
   - Strong geometric foundations
   - Balance between form and function
   - Sophisticated color palette

3. **Premium Experience**
   - Smooth, polished animations
   - High-quality imagery
   - Attention to micro-interactions
   - Seamless user journey

4. **Natural Sophistication**
   - Earth tones with metallic accents
   - Organic shapes with clean lines
   - Glass morphism for depth
   - Light and shadow interplay

---

## Color Palette

### Primary Colors

```css
/* Stone - Base neutrals */
--stone-50: #FAFAF9;    /* Background, light surfaces */
--stone-900: #1C1917;   /* Text, dark surfaces */

/* Gold - Accent color */
--gold: #A18058;        /* Primary accent, CTAs, highlights */
```

### Extended Palette

```css
/* Stone scale (from Tailwind) */
--stone-100: #F5F5F4;   /* Subtle backgrounds */
--stone-200: #E7E5E4;   /* Borders, dividers */
--stone-300: #D6D3D1;   /* Disabled states */
--stone-400: #A8A29E;   /* Placeholder text */
--stone-500: #78716C;   /* Secondary text */
--stone-600: #57534E;   /* Body text */
--stone-700: #44403C;   /* Headings */
--stone-800: #292524;   /* Dark backgrounds */

/* Semantic colors */
--background: #FAFAF9;
--foreground: #1C1917;
--accent: #A18058;
```

### Color Usage Guidelines

| Color | Usage | Examples |
|-------|-------|----------|
| `stone-50` | Page backgrounds, light cards | Body, sections |
| `stone-900` | Primary text, dark sections | Headings, footer |
| `gold` | Accents, CTAs, highlights | Buttons, icons, badges |
| `stone-500` | Secondary text | Descriptions, captions |
| `stone-200` | Borders, dividers | Cards, inputs |

---

## Typography

### Font Families

```typescript
// Sans-serif - Body text, UI elements
font-sans: ['Inter', 'sans-serif']

// Serif - Headlines, emphasis
font-serif: ['Playfair Display', 'serif']
```

### Type Scale

#### Headings (Serif)

```css
/* Hero Headlines */
.text-hero {
  font-family: 'Playfair Display', serif;
  font-size: 5rem;        /* 80px */
  line-height: 0.95;
  font-weight: 300;       /* Light */
  letter-spacing: -0.02em;
}

/* Section Headlines */
.text-section {
  font-family: 'Playfair Display', serif;
  font-size: 2.25rem;     /* 36px */
  line-height: 1.2;
  font-weight: 300;
}

/* Card Headlines */
.text-card {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;     /* 20px */
  line-height: 1.4;
  font-weight: 400;
}
```

#### Body Text (Sans)

```css
/* Large body */
.text-lg {
  font-size: 1.125rem;    /* 18px */
  line-height: 1.75;
  font-weight: 300;
}

/* Regular body */
.text-base {
  font-size: 1rem;        /* 16px */
  line-height: 1.5;
  font-weight: 400;
}

/* Small text */
.text-sm {
  font-size: 0.875rem;    /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

/* Micro text */
.text-xs {
  font-size: 0.75rem;     /* 12px */
  line-height: 1.4;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
```

### Typography Patterns

**Headlines**:
- Use serif (`font-serif`) for elegance
- Light weight (300) for sophistication
- Tight line-height (0.95-1.2) for impact
- Italics for secondary emphasis

**Body Text**:
- Use sans-serif (`font-sans`) for readability
- Light weight (300) for large text
- Regular weight (400) for standard text
- Generous line-height (1.5-1.75) for comfort

**Labels & Metadata**:
- Uppercase for hierarchy
- Wide letter-spacing (0.2em) for elegance
- Small size (10-12px) with medium weight
- Gold color for emphasis

---

## Spacing System

### Base Unit: 4px (0.25rem)

```css
/* Spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

### Spacing Patterns

**Section Padding**:
- Vertical: `py-24` (96px) for major sections
- Horizontal: `px-6` (24px) on mobile, `max-w-7xl mx-auto` for desktop

**Component Spacing**:
- Cards: `p-6` to `p-8` (24-32px)
- Buttons: `px-6 py-3` to `px-8 py-4` (24-32px horizontal, 12-16px vertical)
- Input fields: `px-4 py-3` (16px horizontal, 12px vertical)

**Content Spacing**:
- Between sections: `mb-16` to `mb-24` (64-96px)
- Between elements: `mb-6` to `mb-8` (24-32px)
- Between lines: `gap-4` to `gap-6` (16-24px)

---

## Border Radius

### Radius Scale

```css
/* Subtle - Inputs, small cards */
--radius-lg: 0.75rem;   /* 12px */

/* Standard - Cards, modals */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */

/* Dramatic - Hero elements, feature cards */
--radius-3xl: 2rem;     /* 32px */
--radius-4xl: 2.5rem;   /* 40px */

/* Full - Buttons, badges, pills */
--radius-full: 9999px;
```

### Usage Guidelines

| Element | Radius | Example |
|---------|--------|---------|
| Buttons | `rounded-full` | CTAs, pills |
| Cards | `rounded-2xl` to `rounded-[2rem]` | Property cards, sections |
| Inputs | `rounded-xl` to `rounded-2xl` | Forms, search |
| Images | `rounded-2xl` | Gallery, thumbnails |
| Badges | `rounded-full` | Status, labels |
| Sections | `rounded-[2.5rem]` | Footer, hero widgets |

---

## Shadows & Depth

### Shadow Scale

```css
/* Subtle elevation */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Card elevation */
.shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
              0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* Prominent elevation */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
              0 4px 6px -4px rgb(0 0 0 / 0.1);
}

/* Dramatic elevation */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

### Glass Morphism

```css
.glass-panel {
  background: rgba(250, 250, 249, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

**Usage**: Hero booking widget, navbar on scroll, overlays

---

## Animations & Transitions

### Animation Principles

1. **Subtle & Smooth**: Animations should enhance, not distract
2. **Performance First**: Use `transform` and `opacity` for 60fps
3. **Purposeful**: Every animation should have a reason
4. **Consistent Timing**: Use standard easing curves

### Timing Functions

```css
/* Standard easing */
ease-out: cubic-bezier(0, 0, 0.2, 1)    /* Entering elements */
ease-in: cubic-bezier(0.4, 0, 1, 1)     /* Exiting elements */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) /* Both */
```

### Duration Scale

```css
--duration-fast: 150ms;     /* Micro-interactions */
--duration-base: 300ms;     /* Standard transitions */
--duration-slow: 500ms;     /* Emphasis */
--duration-slower: 700ms;   /* Hero elements */
--duration-slowest: 1000ms; /* Page transitions */
```

### Common Animations

#### Fade In Up (Entry)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

#### Scale In (Cards)

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

#### Slide In (Horizontal)

```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
>
```

#### Hover Effects

```css
/* Lift on hover */
.hover-lift {
  transition: transform 300ms ease-out;
}
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Scale on hover */
.hover-scale {
  transition: transform 700ms ease-out;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### Custom Animations

```css
/* Infinite scroll (testimonials) */
@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* Slow pulse (status indicators) */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Component Patterns

### Buttons

#### Primary CTA

```tsx
<button className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1">
  Book Your Stay
  <ArrowRight size={14} />
</button>
```

**Characteristics**:
- Dark background (`stone-900`)
- White text
- Full rounded corners
- Uppercase with wide tracking
- Icon on right
- Lift on hover

#### Secondary CTA

```tsx
<button className="inline-flex items-center gap-2 border border-stone-300 hover:border-stone-900 text-stone-900 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all">
  Learn More
</button>
```

### Cards

#### Feature Card

```tsx
<div className="rounded-2xl p-6 border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all">
  {/* Icon */}
  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-[#A18058] mb-4">
    <Icon size={20} />
  </div>
  
  {/* Content */}
  <h3 className="text-lg serif text-stone-900 mb-2">Title</h3>
  <p className="text-stone-500 text-sm font-light">Description</p>
</div>
```

#### Image Card

```tsx
<div className="relative rounded-2xl overflow-hidden group">
  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  
  {/* Content overlay */}
  <div className="absolute bottom-0 p-8 text-white">
    <h3 className="text-xl serif italic mb-2">Title</h3>
    <p className="text-xs font-light">Description</p>
  </div>
</div>
```

### Input Fields

```tsx
<div className="px-4 py-3 rounded-2xl border border-stone-200 bg-white hover:border-[#A18058]/50 focus-within:border-[#A18058] transition-colors">
  <label className="block text-[9px] font-semibold text-[#A18058] uppercase tracking-widest mb-1">
    Label
  </label>
  <input className="w-full bg-transparent border-none outline-none text-sm font-medium text-stone-900" />
</div>
```

### Badges

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAF9]/10 backdrop-blur-md border border-[#FAFAF9]/20 text-[#FAFAF9] text-[10px] font-medium tracking-[0.2em] uppercase">
  <span className="w-1.5 h-1.5 rounded-full bg-[#A18058] animate-pulse-slow" />
  Status Text
</div>
```

### Section Headers

```tsx
<div className="text-center mb-16">
  <span className="text-[#A18058] font-semibold tracking-[0.2em] text-[10px] uppercase mb-3 block">
    Section Label
  </span>
  <h2 className="text-3xl md:text-4xl serif text-stone-900 font-light">
    Section Headline
  </h2>
</div>
```

---

## Layout Patterns

### Container

```tsx
<div className="max-w-7xl mx-auto px-6">
  {/* Content */}
</div>
```

**Max width**: `1280px`  
**Horizontal padding**: `24px` (mobile), auto margins (desktop)

### Section

```tsx
<section className="bg-[#FAFAF9] pt-24 pb-24" id="section-name">
  <div className="max-w-7xl mx-auto px-6">
    {/* Section content */}
  </div>
</section>
```

**Vertical padding**: `96px` top and bottom  
**Background**: Alternates between `stone-50` and `stone-100`

### Grid Layouts

```tsx
{/* 2-column responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">

{/* 3-column responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* 4-column responsive */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Flex Layouts

```tsx
{/* Horizontal with gap */}
<div className="flex items-center gap-4">

{/* Vertical stack */}
<div className="flex flex-col gap-6">

{/* Space between */}
<div className="flex justify-between items-center">

{/* Responsive flex */}
<div className="flex flex-col lg:flex-row gap-8">
```

---

## Imagery Guidelines

### Image Treatment

1. **High Quality**: Minimum 1920px width for hero images
2. **Aspect Ratios**:
   - Hero: `16:9` or full viewport
   - Cards: `4:5` portrait or `16:9` landscape
   - Gallery: Variable (masonry)
3. **Overlays**: Dark gradient (`from-black/60 to-transparent`) for text readability
4. **Hover**: Subtle scale (`scale-105`) on 700ms transition

### Image Sources

```tsx
{/* Unsplash pattern */}
src="https://images.unsplash.com/photo-[id]?q=80&w=2670&auto=format&fit=crop"
```

**Parameters**:
- `q=80`: Quality
- `w=2670`: Width (2x for retina)
- `auto=format`: WebP when supported
- `fit=crop`: Crop to aspect ratio

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Mobile Patterns

- Stack layouts vertically (`flex-col`)
- Reduce font sizes (use responsive classes)
- Simplify navigation (hamburger menu)
- Full-width CTAs
- Reduce padding (`px-6` instead of `px-12`)

### Desktop Patterns

- Multi-column layouts (`lg:flex-row`)
- Larger typography (`md:text-7xl lg:text-8xl`)
- Expanded navigation
- Hover states
- Generous spacing

---

## Accessibility

### Color Contrast

- Text on light: Minimum `stone-600` (4.5:1 ratio)
- Text on dark: Use `stone-50` or white
- Gold accent: Use on light backgrounds only

### Interactive Elements

```tsx
{/* Focus states */}
<button className="focus:outline-none focus:ring-2 focus:ring-[#A18058] focus:ring-offset-2">

{/* Keyboard navigation */}
<a href="#section" className="focus-visible:ring-2 focus-visible:ring-[#A18058]">
```

### Semantic HTML

- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Use `<nav>` for navigation
- Use `<section>` for content sections
- Use `<article>` for independent content
- Use `alt` text for all images

---

## Custom Utilities

### Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #FAFAF9;
}

::-webkit-scrollbar-thumb {
  background: #D6D3D1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #A8A29E;
}
```

### Text Shadow

```css
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
          drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
```

---

## Voice & Tone

### Writing Style

- **Elegant**: Use sophisticated language
- **Concise**: Short, impactful sentences
- **Descriptive**: Paint a picture with words
- **Exclusive**: Emphasize privacy and luxury

### Examples

**Good**:
- "Sanctuary in the hills"
- "A masterfully designed architectural gem"
- "Absolute privacy and panoramic views"

**Avoid**:
- "Nice house in the mountains"
- "Good place to stay"
- "Has a pool and kitchen"

### Microcopy

- **CTAs**: "Book Your Stay", "Request Reservation", "Explore Property"
- **Labels**: "Direct Booking Exclusive", "Instant Book", "Premium Amenities"
- **Descriptions**: Focus on experience, not features

---

## Implementation Checklist

When creating new pages or components:

- [ ] Use serif fonts for headlines
- [ ] Use sans-serif for body text
- [ ] Apply gold accent color sparingly
- [ ] Use generous spacing (py-24 for sections)
- [ ] Add subtle animations (fade-in, scale)
- [ ] Implement glass morphism for overlays
- [ ] Use rounded corners (2xl minimum)
- [ ] Add hover states to interactive elements
- [ ] Ensure mobile responsiveness
- [ ] Test color contrast for accessibility
- [ ] Use high-quality images with overlays
- [ ] Add proper semantic HTML
- [ ] Include focus states for keyboard navigation
- [ ] Use uppercase labels with wide tracking
- [ ] Implement smooth transitions (300-700ms)

---

## Resources

### Fonts
- [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter)
- [Playfair Display (Google Fonts)](https://fonts.google.com/specimen/Playfair+Display)

### Icons
- [Lucide React](https://lucide.dev/) - Consistent, minimal icon set

### Animation
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animations

### Images
- [Unsplash](https://unsplash.com/) - High-quality architectural photography

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Project**: The Obsidian - Private Residence
