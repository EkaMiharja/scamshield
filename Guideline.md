Style Guide: ScamShield Hub
Design Philosophy
The ScamShield Hub interface should feel high-tech, authoritative, and authoritative while remaining intuitive, accessible, and privacy-focused.
The experience should prioritize:
 * Data clarity and instant scannability
 * Visual urgency without panic (clear risk status indicators)
 * Smooth, responsive interaction
 * Strong first impression (cybersecurity authority)
 * Easy report navigation and content readability
Visitors should feel confident in the platform's analysis and secure in its privacy-first, client-side approach.
The interface should communicate:
 * Security & Trust
 * High-Tech Precision
 * Modern Craftsmanship
 * Authority & Reliability
 * Accessibility
Design References
Primary References:
 * CrowdStrike & Cloudflare Dashboards (data clarity & threat meters)
 * Linear (sleek dark mode aesthetic & precise borders)
 * Vercel (clean typography & subtle glows)
 * Raycast & Arc (pill navigation & modern inputs)
Secondary References:
 * VirusTotal & PhishTank (functional threat indicators)
 * Modern cybersecurity landing pages with high-contrast UI
Use these references for:
 * Clean dashboard layouts and grid structures
 * High-contrast alert indicator treatments
 * Typography hierarchy for data density
 * Subtle glowing border effects and animations
 * Overall technical polish
Do not copy designs directly. Use them as inspiration only.
Visual Personality
The product should feel:
 * Dark & High-Tech
 * Sleek & Authoritative
 * Precise & Modern
 * Trustworthy
 * Performant
Avoid making the product feel:
 * Light and washed out
 * Playful or cartoonish
 * Cluttered with excessive jargon
 * Corporate / outdated enterprise UI
 * Intimidating or overly complex for everyday users
Color System
Theme Direction
Dark cybersecurity theme with high-contrast semantic indicators.
Primary
Cyber Blue / Electric Cyan
Suggested Hex:
#0EA5E9
Usage:
 * Primary buttons
 * Active navigation states
 * Key interactive elements
 * Accent highlights and scan glows
Secondary
Deep Cobalt / Neon Indigo
Suggested Hex:
#6366F1
Usage:
 * Secondary accents
 * Hover states
 * Supporting card highlights
Neutral Palette (Dark Cybersecurity Theme)
Page Background:
#0B0F17 (Deep Navy / Charcoal)
Surface / Card Background:
#111827 (Dark Slate)
Elevated Surface:
#1F2937 (Muted Charcoal)
Border / Divider:
#374151 (Subtle Slate Border)
Text Primary:
#F9FAFB (Bright White for high readability)
Text Secondary:
#9CA3AF (Muted Gray for secondary labels)
Text Muted:
#6B7280 (Dimmed Gray for helpers and footers)
Semantic Threat Colors (Risk Status)
Safe (Low Risk / High Trust):
#10B981 (Cyber Green)
Warning / Suspicious (Medium Risk):
#F59E0B (Amber / Warning Yellow)
Danger / High Risk Scam (Critical Risk):
#EF4444 (Crimson Red)
Typography
Font Family:
Inter (or similar modern geometric sans-serif, e.g., JetBrains Mono for technical domain labels)
Fallback:
 * system-ui
 * -apple-system
 * sans-serif
Typography should feel crisp, modern, precise, and highly readable under dark background conditions.
Avoid:
 * Decorative fonts
 * Serif fonts
 * Low-contrast type treatments
Typography Hierarchy
Display
Used for:
 * Hero scanner headline
 * Major score numerical callouts (e.g., Trust Score "85/100")
Heading
Used for:
 * Section titles (Scanner, Threat Feed, Report Scam, SDG Impact)
Subheading
Used for:
 * Card titles
 * Indicator category headers
 * Threat report domain names
Body
Used for:
 * Security breakdown summaries
 * Threat descriptions
 * Educational SDG content
Caption
Used for:
 * Status tags (Verified Scam, Under Review)
 * Technical badges (HTTPS, Security Headers)
 * Helper text and timestamps
Layout System
Desktop First
Container Width:
1200px – 1280px
Spacing System:
8px base
Examples:
 * 8
 * 16
 * 24
 * 32
 * 48
 * 64
 * 80
 * 96
Maintain consistent spacing throughout all dashboard sections.
Border Radius
Buttons:
9999px (pill) or 10px
Cards / Dashboard Panels:
16px – 20px
Inputs (URL Bar):
12px – 9999px (pill search bar)
Badges & Tags:
9999px (full pill)
Shadows & Glows
Use subtle glowing borders and dark elevations rather than heavy black drop shadows.
Prefer:
 * Soft neon border glows (box-shadow: 0 0 15px rgba(14, 165, 233, 0.15))
 * Subtle backdrop blur on floating panels (backdrop-filter: blur(12px))
 * Muted border highlights (1px solid #374151)
Avoid:
 * Harsh light-mode shadows
 * Strong floating offset shadows
Navigation
Navbar Style
Pill Navigation (floating rounded capsule)
Behavior:
 * Sticky on scroll
 * Smooth active state transition across sections
 * Glassmorphic backdrop blur effect (backdrop-filter: blur(16px))
 * Collapses into a clean mobile drawer on smaller screens
Characteristics:
 * Fully rounded pill shape
 * Floating with subtle border glow
 * Clean, minimal items with status indicator dot
 * High-contrast hover and active states
Hero / Scanner Section
Background
Minimalist cyber grid pattern with subtle gradient mesh overlay.
Visual Badges
High-contrast "100% Client-Side Engine" status badge.
Component
Interactive URL Search Bar with primary "Analyze Website" CTA button + preset demo buttons for live testing.
Guidelines
 * Strong visual focal point centered around the input field
 * Clear value proposition headline
 * Smooth transition upon analysis execution into the Dashboard section
 * Preset buttons should offer 1-click test cases (Safe vs. Suspicious)
Analysis Dashboard & Indicator Cards
Each dashboard panel should contain:
 * SVG Score Gauge (Interactive ring showing 0–100 Trust Score with status colors)
 * Security Checklist (HTTPS status, Domain Heuristics, TLD Risk)
 * Rule-Based Threat Breakdown
 * Actionable recommendations
Style:
 * Dark slate card surface (#111827)
 * Subtle border matching current threat level (Green/Yellow/Red border glow)
 * Clear padding and logical grouping of risk factors
Buttons & Inputs
Primary (Scan / Submit):
 * Filled with Cyber Primary (#0EA5E9) or danger alert state when applicable
 * Pill or rounded rectangle with soft glow on hover
Secondary / Preset:
 * Ghost style with subtle slate border (#374151)
 * Hover background fill (#1F2937)
URL Input Bar:
 * High contrast against dark background
 * Prominent focus ring with primary cyan glow
Animation Guidelines
Preferred CSS/JS animations:
 * SVG Gauge Fill (Smooth circular progress stroke animation)
 * Fade & Slide Entrance for analysis results
 * Smooth tab switching for SPA navigation
 * Glowing pulse effect on active scanning state
Rules:
 * Motion must feel fast, crisp, and purposeful (< 300ms transitions)
 * Gauge fill should animate smoothly to reflect the calculated score
 * Maintain 60fps performance with GPU-accelerated CSS properties (transform, opacity)
 * Avoid distracting loop animations that clutter data reading
Responsive Rules
Desktop:
1024px+
Tablet:
768px – 1023px
Mobile:
Below 768px
Mobile should:
 * Stack dashboard panels vertically
 * Convert Pill Navbar into a compact hamburger/drawer menu
 * Keep the URL input bar prominent and easy to tap
 * Maintain high contrast and readable text sizes
Accessibility
Requirements:
 * High contrast text against dark background (#F9FAFB on #0B0F17 / #111827)
 * Color-blind accessible indicators (use text labels alongside color coding: Green + "SAFE", Red + "DANGER")
 * Keyboard navigation support for inputs, tabs, and buttons
 * Visible focus states with glowing outline rings
 * Semantic HTML tags (<header>, <nav>, <main>, <section>, <article>)
Accessibility is required.
AI / Implementation Rules
When building the UI:
 * Strictly follow this dark cybersecurity style guide
 * Use the defined color palette and semantic risk colors
 * Rely on Vanilla HTML, CSS, and JS (no framework or build-tool dependencies)
 * Persist data locally via localStorage
 * Maintain high data density while keeping spacing clean and readable
 * Keep overall visual design on par with modern developer and security tools (Linear, Cloudflare level of polish)
Design Success Criteria
The design is successful when:
 * The site feels authoritative, high-tech, and privacy-focused
 * The Hero Scanner provides an immediate, clear entry point for domain evaluation
 * The SVG Trust Score Gauge animates cleanly and communicates threat level instantly
 * The Pill Navbar feels smooth and modern when navigating sections
 * Technical checklists and threat breakdowns are effortless to scan
 * The entire application runs dependencies-free in any browser with 60fps visual polish