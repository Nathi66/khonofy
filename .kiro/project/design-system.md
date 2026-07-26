# Design System

## UI primitives

- shadcn/Radix components under `src/components/ui/`
- Utility class composition via Tailwind + `cn` helper (`src/lib/utils.js`)
- Theme: light/dark toggle (`ThemeToggleFAB`); respect existing CSS variables / theme tokens

## Patterns

- Use existing cards, tables, dialogs, forms, and toasts rather than inventing parallel primitives
- Charts via Recharts / `components/ui/chart.jsx`
- Keep pages consistent with Layout sidebar and role-based nav

## Accessibility

- Label form controls
- Keyboard-reachable interactive elements
- Do not rely on color alone for status
