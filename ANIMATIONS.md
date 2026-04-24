# Animation & UX/UI Enhancement Guide

This guide documents all the animation effects and UX improvements integrated into TechNova Store.

## Overview

The application includes:
- **Lenis Smooth Scroll**: Smooth scrolling experience across the entire application
- **Next.js View Transitions API**: Smooth page transitions between routes
- **Framer Motion Animations**: Comprehensive animation system for components
- **Micro-interactions**: Button animations, hover effects, and loading states
- **Lazy Loading**: Optimized image and component loading

## Core Animation Components

### 1. SmoothScroll Provider

Enables smooth scrolling globally using Lenis.

**Location**: `components/smooth-scroll.tsx`

```tsx
// Automatically added to root layout
import { SmoothScroll } from '@/components/smooth-scroll'
```

**Features**:
- Duration: 1.2s with easing
- Smooth touch support disabled for better UX
- Automatically initialized on app load

### 2. TextReveal

Reveals text word by word when scrolling into view.

**Location**: `components/animations/text-reveal.tsx`

```tsx
import { TextReveal } from '@/components/animations'

export function MyComponent() {
  return (
    <TextReveal duration={0.05} delay={0}>
      This text will reveal word by word
    </TextReveal>
  )
}
```

**Props**:
- `children`: Text content (string)
- `duration`: Delay between word reveals (default: 0.05)
- `delay`: Initial delay before animation starts (default: 0)
- `className`: Additional CSS classes

### 3. AnimatedCard

Card component with border glow effect on hover.

**Location**: `components/animations/animated-card.tsx`

```tsx
import { AnimatedCard } from '@/components/animations'

export function MyCard() {
  return (
    <AnimatedCard glowColor="rgba(147, 51, 234, 0.5)" delay={0.2}>
      <div>Card content</div>
    </AnimatedCard>
  )
}
```

**Props**:
- `children`: Card content
- `glowColor`: Color for the glow effect (default: primary purple)
- `delay`: Animation delay (default: 0)
- `className`: Additional CSS classes

**Features**:
- Radial gradient glow following mouse position
- Border and shadow glow effect
- Smooth fade in/out on hover

### 4. StaggerContainer

Container that staggered animate children with delay.

**Location**: `components/animations/stagger-container.tsx`

```tsx
import { StaggerContainer } from '@/components/animations'

export function MyList() {
  return (
    <StaggerContainer delay={0} staggerDelay={0.1}>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </StaggerContainer>
  )
}
```

**Props**:
- `children`: Child elements (array or ReactNode)
- `delay`: Initial delay before animation (default: 0)
- `staggerDelay`: Delay between each child (default: 0.1)
- `className`: Container class names

### 5. FlyToCart System

Animates product images flying to the cart button.

**Location**: `components/animations/fly-to-cart.tsx`

```tsx
import { triggerFlyToCart } from '@/components/animations'

function ProductCard() {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerFlyToCart(productImage, productId, e)
    // Add to cart logic
  }

  return <button onClick={handleAddToCart}>Add to Cart</button>
}
```

**Features**:
- Automatically calculates endpoint position
- Rotation and scale animations
- Smooth easing with Framer Motion

### 6. Button Animations

Enhanced button components with micro-interactions.

**Location**: `components/animations/button-animations.tsx`

#### AnimatedButton

```tsx
import { AnimatedButton } from '@/components/animations'

<AnimatedButton onClick={handleClick}>
  Click me
</AnimatedButton>
```

**Features**:
- Scale hover effect
- Tap animation
- Shadow animation
- Disabled state support

#### PulseButton

```tsx
import { PulseButton } from '@/components/animations'

<PulseButton className="...">
  Important Action
</PulseButton>
```

**Features**:
- Pulse ring effect
- Draws attention to important buttons

#### LoadingButton

```tsx
import { LoadingButton } from '@/components/animations'

<LoadingButton loading={isLoading} loadingText="Submitting...">
  Submit
</LoadingButton>
```

**Features**:
- Animated loading spinner
- Smooth text swapping
- Prevents interaction while loading

### 7. Scroll Animations

Trigger animations when elements come into view.

**Location**: `components/animations/scroll-animations.tsx`

#### ScrollTrigger

```tsx
import { ScrollTrigger } from '@/components/animations'

<ScrollTrigger>
  <div>This fades in and slides up when scrolled into view</div>
</ScrollTrigger>
```

#### RevealOnScroll

```tsx
import { RevealOnScroll } from '@/components/animations'

<RevealOnScroll direction="left" delay={0.2}>
  <div>Reveals from the left</div>
</RevealOnScroll>
```

**Directions**: 'up', 'down', 'left', 'right'

#### Parallax

```tsx
import { Parallax } from '@/components/animations'

<Parallax offset={50}>
  <img src="..." alt="..." />
</Parallax>
```

**Features**:
- Creates depth with scroll offset
- Smooth animations linked to scroll progress

#### CountUp

```tsx
import { CountUp } from '@/components/animations'

<CountUp from={0} to={1000} suffix=" units sold" />
```

## CSS Animation Classes

Custom Tailwind-compatible animation classes available:

```tsx
// Utility classes
<div className="animate-shimmer">Shimmer effect</div>
<div className="animate-float">Floating animation</div>
<div className="animate-pulse-glow">Pulsing glow</div>
<div className="animate-slide-in-left">Slide from left</div>
<div className="animate-slide-in-right">Slide from right</div>
<div className="animate-scale-in">Scale in</div>
<div className="animate-bounce-in">Bounce in</div>

// Stagger delays
<div className="animate-delay-100">100ms delay</div>
<div className="animate-delay-200">200ms delay</div>
<div className="animate-delay-300">300ms delay</div>
```

## View Transitions API

Next.js 15+ View Transitions are configured in the root layout for smooth page transitions.

```tsx
// Automatic on all navigation
// No additional setup required
// Transitions between /products and /products/[slug]
```

## Implementation Examples

### Product Card with Animations

```tsx
'use client'

import { motion } from 'framer-motion'
import { triggerFlyToCart } from '@/components/animations'

export function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    triggerFlyToCart(product.image, product.id, e)
    // Cart logic
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Card content */}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </motion.div>
  )
}
```

### Products Page with Stagger

```tsx
import { motion } from 'framer-motion'

export function ProductsPage() {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      layout
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            delay: index * 0.05,
            duration: 0.5,
          }}
          layout
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## Performance Optimization

### Lazy Loading

Components use `whileInView` with `once: true` to trigger animations only once:

```tsx
whileInView={{ opacity: 1 }}
viewport={{ once: true, margin: '-100px' }}
```

### Layout Animations

Use `layout` prop for smooth layout transitions:

```tsx
<motion.div layout>
  {/* Dynamic content */}
</motion.div>
```

### Will-change CSS

Critical animations use will-change:

```css
.animated-element {
  will-change: transform, opacity;
}
```

## Browser Support

- **Smooth Scroll**: All modern browsers
- **View Transitions**: Chrome 111+, Edge 111+
- **Framer Motion**: All modern browsers
- **Fallbacks**: Graceful degradation for older browsers

## Best Practices

1. **Use `once: true` on scroll triggers** to prevent repeated animations
2. **Stagger animations** for better visual feedback
3. **Keep animation durations** between 0.3s - 0.8s
4. **Use ease functions** like `easeOut` for natural motion
5. **Consider accessibility** - provide `prefers-reduced-motion` support
6. **Lazy load** heavy components
7. **Test on real devices** for smooth performance

## Accessibility

Respects `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Troubleshooting

### Animations not triggering

- Check `viewport={{ once: true }}` isn't preventing re-triggers
- Ensure component is within scrollable container
- Check z-index and visibility issues

### Performance issues

- Reduce number of animated elements
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for performance
- Disable animations on lower-end devices

### Smooth scroll conflicts

- Lenis automatically handles scroll hijacking
- Disable if using other scroll libraries
- Check for `scroll-behavior: auto` overrides

## Resources

- **Lenis**: https://lenis.darkroom.engineering
- **Framer Motion**: https://www.framer.com/motion
- **Next.js View Transitions**: https://nextjs.org/docs/app/building-your-application/user-experience/view-transitions

---

Last Updated: 2024
