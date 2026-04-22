# Antigravity Design: Aesthetic & Polish Rules

These rules ensure every UI element created by Antigravity feels "Premium" and "State-of-the-Art".

## 1. The "WOW" Principle
- **Aesthetics First**: If a component looks "Basic" or "Default", it is a failure.
- **Visual Depth**: Use gradients, glassmorphism, and layered elevations (shadows) to create depth.
- **Consistency**: All styles must strictly derive from `ai_improvement_machine/design/K_SPIRITS_DESIGN_SYSTEM.md`.

## 2. Token Integrity
- **No Hardcoded Colors**: Always use HSL variables from the design system.
- **Fluid Layouts**: Prefer clamped typography (`clamp()`) and relative spacing (`rem`, `em`, `%`) to ensure premium feel across all viewport sizes.

## 3. Micro-Animations (The Soul of the App)
- **Life in Motion**: Every interactive element MUST have a hover state and a click transition.
- **Transitions**: Non-interactive elements (like page content) should use smooth entrance transitions (staggered fade-ins).

## 4. Documentation & Identity
- **Descriptive IDs**: All interactive elements must have unique, descriptive IDs for readability and automated testing.
- **Component Rationale**: Document the *design intent* behind complex UI structures.
