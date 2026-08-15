Task Breakdown: ScamShield Hub
Context
This document defines the implementation sequence for building ScamShield Hub using Vanilla HTML, CSS, JavaScript (ES6 Modules), and localStorage.
The goal is to prevent building the entire application at once by following a strict sequential build process.
Tasks should be completed sequentially. Each task must be completed and reviewed before moving to the next task.
Always reference:
 * prd.md
 * guideline.md (Style Guide)
before implementation.
Build Rules
 * Follow prd.md exactly.
 * Follow guideline.md exactly.
 * Do not use Node.js, Python, or build tools (Vite/Webpack/npm).
 * Do not introduce external AI dependencies in initial core tasks (reserve clean slots for future Gemini API integration).
 * Reuse utility modules and UI components whenever possible.
 * Complete tasks sequentially and validate each task before proceeding.
 * Maintain the dark cybersecurity theme and high-contrast risk indicator system throughout.
Phase 1 — Project Foundation
Task 1.1
Setup application folder structure.
Requirements:
 * Create basic project directories: css/, js/, assets/
 * Create index.html as the main Single Page Application entry point
 * Create static asset folders for icons and badges
Deliverables:
 * Clean and scalable directory layout
Success Criteria:
 * Folder structure matches prd.md
 * No unnecessary build files or package manifests
Task 1.2
Setup base CSS, theme variables, and global layout styles.
Requirements:
 * Setup css/style.css with CSS custom properties (color variables for Deep Navy background, Cyber Blue primary, and Semantic Risk Colors)
 * Link Tailwind CSS via CDN in index.html (or custom utility classes)
 * Apply global resetting, typography (Inter), and background grid styling
Success Criteria:
 * Opening index.html displays a dark cybersecurity theme without console errors
 * Color variables match guideline.md
Phase 2 — Shared / Common UI Components
Task 2.1
Build Pill Navigation Bar.
Requirements:
 * Floating capsule navigation bar (<nav>)
 * Sticky behavior on scroll with glassmorphism backdrop blur
 * Smooth section tab switching (Scanner, Threat Feed, Report Scam, SDG Impact) without page reloads
 * Responsive mobile drawer menu
Success Criteria:
 * Navigation stays floating and centered
 * Tab clicks toggle corresponding main section view via Vanilla JS DOM manipulation
Task 2.2
Build Footer Component.
Requirements:
 * Minimal dark footer with copyright, legal disclaimer, and SDG 9 alignment notes
 * Links to project documentation and repository
Success Criteria:
 * Matches dark cybersecurity style guide
Phase 3 — Local Storage Engine (Data Layer)
Task 3.1
Build Local Data Management Module (js/storage.js).
Requirements:
 * saveReport(reportData): Saves user-submitted scam reports into localStorage
 * getReports(): Retrieves all stored reports sorted by timestamp
 * searchReports(query): Checks if a domain or account exists in the local database
 * Initialize default seed data for live testing if localStorage is empty
Success Criteria:
 * Reports persist across browser refreshes
 * Search lookup runs in under 10ms
Phase 4 — Rule-Based Security Engine & Gauge Component
Task 4.1
Build Client-Side Security Heuristic Engine (js/scanner.js).
Requirements:
 * Validate URL structure (HTTPS check, IP address detection, domain length evaluation)
 * Check suspicious Top-Level Domains (e.g., .xyz, .top, .tk, .click)
 * Perform keyword matching for phishing patterns (e.g., login-bank, free-promo, verify-account)
 * Calculate rule-based Trust Score (0–100) and assign risk level (SAFE, SUSPICIOUS, DANGER)
Success Criteria:
 * analyzeUrl(url) returns a structured JS object containing score, risk level, and detected indicators
Task 4.2
Build Interactive SVG Score Gauge Renderer (js/gauge.js).
Requirements:
 * Render animated SVG circle ring representing Trust Score (0–100)
 * Dynamically update ring stroke color based on score (Cyber Green for Safe, Amber for Suspicious, Crimson Red for Danger)
 * Smooth animated stroke transition (< 500ms)
Success Criteria:
 * SVG Gauge renders smoothly at 60fps with high-contrast text numerical callout
Phase 5 — Hero & Scanner Section
Task 5.1
Build Hero & Search Bar Layout.
Requirements:
 * Display headline and "100% Client-Side Engine" status badge
 * Interactive URL search bar input with "Analyze Website" action button
 * Preset demo quick-fill buttons ("Try Safe Site", "Try Phishing Demo") for 1-click test cases
Success Criteria:
 * Clicking preset buttons populates search input instantly
 * Input field features a prominent cyber cyan focus ring
Task 5.2
Integrate Analysis Dashboard View.
Requirements:
 * Wire search button click to trigger scanner.js evaluation
 * Dynamically populate Analysis Dashboard: SVG Gauge, Security Checklist (HTTPS, TLD, Heuristics), Threat Breakdown List, and Local Database Match Alert
 * Display clear recommendations based on status
Success Criteria:
 * Submitting a URL updates the dashboard dynamically without reloading the page
Phase 6 — Community Threat Feed Section
Task 6.1
Build Community Threat Feed Component.
Requirements:
 * Fetch and render list of scam reports from js/storage.js
 * Render cards with domain name, scam category, timestamp, and status badges (Verified Scam, Under Review)
 * Add search filter bar to filter reported domains in real-time
Success Criteria:
 * Threat Feed updates automatically whenever a new report is added
 * High readability against dark slate card backgrounds
Phase 7 — Report Scam Section
Task 7.1
Build Report Scam Form Component.
Requirements:
 * HTML form fields for Target URL, Category, Scammer Contact/Account Details, Chronology, and Proof Notes
 * Client-side form validation
 * Form submission triggers storage.js to save the entry and shows a success toast notification
Success Criteria:
 * Submitting the form clears inputs and instantly pushes the new report to the Threat Feed
Phase 8 — SDG Impact Section
Task 8.1
Build SDG 9 Educational Content.
Requirements:
 * Structured card layout explaining platform contribution to SDG 9 (Industry, Innovation, and Infrastructure)
 * Overview of Explainable Security methodology and client-side privacy preservation
Success Criteria:
 * Clean typography and logical spacing consistent with the Style Guide
Phase 9 — Integration & Polish
Task 9.1
Assemble SPA Router & Section Controller (js/app.js).
Requirements:
 * Coordinate single-page navigation across Navbar tabs
 * Handle deep-linking / URL hash state if applicable
 * Ensure smooth transition animations between sections
Task 9.2
Responsive Refinement & Dark Theme Audit.
Requirements:
 * Audit layouts across Desktop (1024px+), Tablet (768px–1023px), and Mobile (< 768px)
 * Ensure Pill Navbar collapses cleanly into a mobile menu
 * Verify text contrast and accessibility focus indicators
Task 9.3
Final Verification & Decoupled AI Architecture Audit.
Requirements:
 * Ensure no console errors or missing file references
 * Verify all code is structured cleanly so Gemini API client modules can be attached seamlessly in future phases
Success Criteria:
 * Entire app opens and functions 100% locally by double-clicking index.html in any browser
Final Review Checklist
Before marking the project complete:
 * [ ] Verify index.html launches directly in browser with zero dependencies or server commands
 * [ ] Verify Pill Navbar navigates all sections smoothly without page reload
 * [ ] Verify SVG Trust Gauge animates and updates colors based on score
 * [ ] Verify client-side scanner accurately detects insecure protocols and suspicious domain patterns
 * [ ] Verify scam reporting form saves data to localStorage and updates the Threat Feed
 * [ ] Verify dark cybersecurity theme strictly matches guideline.md
 * [ ] Verify responsive layouts on desktop, tablet, and mobile viewports
Definition of Done
The project is complete when:
 * All core sections (Scanner, Dashboard, Feed, Report Form, SDG Impact) exist and function cleanly
 * The platform runs 100% client-side in Vanilla HTML/CSS/JS with local data persistence
 * The UI strictly adheres to guideline.md
 * The application architecture fulfills prd.md requirements
 * The overall experience feels fast, authoritative, modern, and polished