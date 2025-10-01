# NextStep - Design Guidelines

## Design Approach & Philosophy

**Selected Approach:** Hybrid (Utility-Focused with Engaging Visuals)

**Rationale:** NextStep is an educational orientation tool targeting students, requiring a balance between professional credibility and youthful appeal. The design draws inspiration from modern educational platforms like Duolingo's approachability, Linear's clean interface, and Notion's organized layouts while maintaining the seriousness needed for life-changing educational decisions.

**Core Principles:**
- Trust and credibility through clean, professional layouts
- Youth engagement through vibrant, energetic color accents
- Clarity and simplicity for complex decision-making
- Progressive disclosure to avoid overwhelming users

---

## Color Palette

### Primary Colors
**Indigo/Purple Spectrum (Primary Brand)**
- Main: `250 70% 60%` - Vibrant indigo for primary actions, headers
- Deep: `250 70% 45%` - Darker variant for hover states, emphasis
- Light: `250 70% 95%` - Subtle backgrounds, cards

**Complementary Accent**
- Emerald Green: `160 85% 45%` - Success states, CTAs, positive reinforcement (results)
- Avoid gold/yellow accents

### Neutral Foundation
- Dark text: `220 15% 15%` - Primary text
- Medium gray: `220 10% 45%` - Secondary text
- Light gray: `220 15% 95%` - Backgrounds
- White: `0 0% 100%` - Cards, containers

### Semantic Colors
- Success: `160 85% 45%` (emerald)
- Warning: `35 90% 55%` (orange)
- Info: `210 100% 60%` (sky blue)

---

## Typography

### Font Stack
- **Primary:** 'Inter', system-ui, -apple-system, sans-serif
- **Fallback:** System fonts for performance

### Type Scale
**Headings:**
- H1 (Hero): 3rem (48px) / font-weight 700 / line-height 1.1
- H2 (Section): 2rem (32px) / font-weight 600 / line-height 1.2
- H3 (Cards): 1.5rem (24px) / font-weight 600 / line-height 1.3

**Body:**
- Large: 1.125rem (18px) / font-weight 400 / line-height 1.6
- Base: 1rem (16px) / font-weight 400 / line-height 1.5
- Small: 0.875rem (14px) / font-weight 400 / line-height 1.4

**UI Elements:**
- Buttons: 1rem / font-weight 600
- Labels: 0.875rem / font-weight 500

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 8, 12, 16, 20, 24, 32**

**Vertical Rhythm:**
- Component internal padding: `p-6` to `p-8`
- Section spacing: `py-16` to `py-20`
- Element gaps: `gap-4` to `gap-8`

**Container Widths:**
- Main content: `max-w-6xl` (1152px)
- Forms/Quiz: `max-w-4xl` (896px)
- Text content: `max-w-3xl` (768px)

### Grid System
- Hero carousel: Full-width with centered content overlay
- Questionnaire: Single column, max-width contained
- Card carousel: Responsive slides (mobile: 1, tablet: 2, desktop: 3 visible)
- Footer: Multi-column on desktop (3-4 cols), stacked mobile

---

## Component Library

### Hero Carousel
**Structure:**
- Full-viewport height (80-90vh)
- Background images with gradient overlay (indigo to purple, 50% opacity)
- Centered content: Logo, fixed title, rotating subtitles
- Smooth transitions (800ms ease-in-out)
- Navigation dots (bottom center)
- Auto-advance (5s intervals) with manual controls

**Content Overlay:**
- Semi-transparent dark background (`bg-black/30`)
- Glassmorphic effect with backdrop blur
- White text with subtle text-shadow for readability

### Questionnaire Cards
**Design:**
- White background with shadow-lg
- Rounded corners (16px)
- Indigo gradient header
- Progress indicators: filled circles, smooth transitions
- Form inputs: 2px border, 12px radius, focus ring (indigo)
- Range sliders: Custom thumb (indigo), labeled endpoints

**Page Transitions:**
- Fade + slide up animation (500ms)
- Smooth progress indicator updates

### Results Carousel (School Cards)
**Individual Cards:**
- Light background (`bg-indigo-50`)
- Elevated on hover (translateY -4px, shadow-xl)
- Border-left accent (4px indigo)
- School name: H3, indigo color
- Address/info: Small gray text
- CTA button: Emerald green, rounded-full

**Carousel Controls:**
- Arrow buttons: Circular, white bg, shadow
- Dots indicator: Below cards, indigo active state
- Swipe gestures on mobile

### Navigation Bar
**Fixed Top Design:**
- White background, 95% opacity
- Backdrop blur effect
- Logo (left): NextStep branding + school logo
- Minimal, clean, shadow-sm
- Height: 80px, padding: px-6

### Footer
**Multi-Section Layout:**
- Light gray background
- 3 columns (desktop): Brand/About | Quick Links | Contact/Social
- Centered logo and tagline
- Social icons: Circular, indigo hover
- Copyright: Small, centered, gray text

---

## Animations & Interactions

**Guiding Principle:** Minimal, purposeful animations

**Applied Animations:**
1. **Hero carousel transitions:** Cross-fade between slides
2. **Questionnaire pages:** Fade + slide-up (500ms)
3. **Card carousel:** Smooth horizontal slide
4. **Buttons:** Scale (1.02) + shadow on hover
5. **Form inputs:** Focus ring expansion (200ms)
6. **School cards:** Hover lift effect

**No Animations On:**
- Text content
- Static sections
- Navigation elements (except active states)

---

## Images

### Hero Carousel (3 Slides)
**Slide 1:** Students collaborating in modern classroom/library setting
- Bright, welcoming atmosphere
- Diverse group working together
- Professional photography style

**Slide 2:** Student confidently making decision/pointing forward
- Empowering, inspirational mood
- Individual focus, determined expression
- Natural lighting, vibrant colors

**Slide 3:** Successful student/graduation moment or pathway visualization
- Forward-looking, hopeful tone
- Clear educational theme
- Clean, modern aesthetic

**Image Treatment:**
- High-quality (1920x1080 minimum)
- Gradient overlay: `linear-gradient(135deg, indigo 30%, purple 70%)` at 50% opacity
- Subtle vignette effect for text readability

### Card Carousel (Optional Background Icons)
- Subtle education-themed SVG patterns
- Light indigo tint, 5% opacity
- Non-distracting, decorative purpose

---

## Accessibility & Dark Mode

**Note:** Single theme implementation (light mode)

**Accessibility Focus:**
- WCAG AA contrast ratios (4.5:1 text, 3:1 UI)
- Focus indicators: 3px indigo ring
- Form labels clearly associated
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for carousel controls

**Form Accessibility:**
- Required field indicators (*)
- Error messages: Red text + icon
- Success states: Emerald border + checkmark
- Clear validation feedback

---

## Responsive Behavior

### Breakpoints
- Mobile: 0-640px
- Tablet: 641-1024px  
- Desktop: 1025px+

### Adaptations
**Mobile:**
- Hero: 60vh height, larger text
- Questionnaire: Full-width, increased padding
- Carousel: Single card view, swipe gestures
- Footer: Stacked columns

**Tablet:**
- Hero: 70vh height
- Carousel: 2 cards visible
- Footer: 2-column layout

**Desktop:**
- Hero: 85vh height
- Carousel: 3 cards visible
- Footer: 3-4 column layout
- Wider containers, more whitespace

---

## Brand Voice & Messaging

**Tone:** Friendly yet professional, empowering, student-first

**Hero Subtitles (Carousel):**
1. "Siamo felici di averti qui - il tuo futuro inizia oggi"
2. "Non dare retta a chi decide per te - questa è la TUA scelta"
3. "Fidati di te stesso, noi ti aiutiamo a trovare la strada giusta"

**Microcopy:**
- Button CTAs: "Inizia il Test", "Continua", "Scopri i Risultati", "Trova Scuole"
- Encouragement: "Stai andando benissimo!", "Quasi fatto!"
- Results: "Il percorso perfetto per te", "Scuole consigliate nella tua zona"