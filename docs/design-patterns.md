# Design Patterns

## Theming

### ThemeProvider
Every component renders under `ThemeProvider`, which injects CSS custom properties (`--theme-*`) and sets `data-theme` on a container or `document.documentElement`.

```tsx
import { ThemeProvider } from '@pikaboo/t2-design-system';

<ThemeProvider theme="pikaboo" applyToRoot>
  <App />
</ThemeProvider>
```

Three built-in themes: `pikaboo`, `pikaboo-dark`, `primedia`.

### Custom Tenant Themes
```tsx
const myTheme = createDesignTheme({
  id: 'demo',
  baseTheme: 'primedia',
  copy: { productName: 'Demo', tenantName: 'Demo Tenant' },
  colors: { primary: '#123456', secondary: '#2f6f73', accent: '#d8ff45' },
});
```

### Theme Switcher & Toggle
- `ThemeSwitcher` — dropdown selector for theme switching at the app level.
- `ThemeToggle` — pill-style sun/moon segmented control for light/dark within the active tenant.

---

## Testing Patterns

### Storybook Interaction Tests
Every story has a `play()` function using `expect` from `storybook/test`:

```tsx
import { expect } from 'storybook/test';

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hello')).toBeVisible();
  },
};
```

- **Render**: Every story renders — automated by `@storybook/addon-vitest`.
- **A11y**: Every story runs axe-core — configured globally in `.storybook/preview.tsx` with `test: 'error'`.
- **Interaction**: Every story has a `play()` function covering key assertions.

### Unit Tests
Unit tests use `react-dom/client` `createRoot` + `act()` directly (no `@testing-library/react`):

```tsx
import { act } from 'react';
import { createRoot } from 'react-dom/client';

const render = (ui: ReactNode) => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  act(() => { root.render(ui); });
  return container;
};
```

### Chart Test Patterns
Chart stories follow a consistent pattern: `Playground` (default data), `AllVariants` (all visual variants), `Empty` (empty data), `Loading` (loading state), `ErrorState` (error state), `A11yTableFallback` (visible data table). Each has a `play()` function that asserts key content is visible.

---

## Component Patterns

### Variant Pattern
Components expose visual variants via a `tone` or `variant` prop. The typical pattern is a `Playground` story with controls and a `Tones`/`Variants` story that renders all options:

```tsx
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="brand">Brand</Badge>
      <Badge tone="accent">Accent</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const label of ['Neutral', 'Brand', 'Accent']) {
      await expect(canvas.getByText(label)).toBeVisible();
    }
  },
};
```

### Chart State Pattern
Charts render 4–5 states consistently:
1. **Playground** — default data rendering
2. **AllVariants** — all type/palette/orientation variants in a grid
3. **Empty** — `data={[]}`, shows `ChartEmpty` ("No chart data available.")
4. **Loading** — `loading={true}`, shows `ChartLoading` skeleton
5. **ErrorState** — `error="message"`, shows `ChartError`
6. **A11yTableFallback** — `tableVisible={true}`, exposes the hidden data table

### Surface & Card Tones
`Surface` and `Card` accept a `tone` prop:
- `default`, `muted`, `brand`, `accent`
- `success`, `warning`, `danger` (Surface only)
- `ink` (Surface only)

---

## A11y Patterns

### Accessible Charts
- Every chart requires an `ariaLabel` prop.
- Charts render a visually hidden data table as an a11y fallback.
- Loading state uses `<output aria-label="Loading chart">`.
- Error state uses `role="alert"`.

### A11y Configuration
In `.storybook/preview.tsx`:
- `test: 'error'` — axe violations fail the build.
- `nested-interactive` is disabled (known issue with nav menus, tracked for fix).
- `.pds-report-donut__center` is excluded (decorative inner label area).

---

## CSS Conventions

### Class Name Prefix
All component class names use the `.pds-*` prefix (e.g., `.pds-badge`, `.pds-card`, `.pds-chart-table`).

### CSS Variables
Theme values flow through CSS custom properties (`--theme-*`, `--pds-*`). Components never hard-code color values.

### Styles Import
Consumers must import `@pikaboo/t2-design-system/styles.css` globally. Storybook imports it in `preview.tsx`.

---

## Package Architecture

### Framework-Neutral Core
The `*-core` packages (`charts-core`, `report-core`, `auth-core`) contain:
- Pure data models and factories
- Formatting utilities (date, number, compact notation)
- Palette resolution and scale helpers
- A11y data table generation

These have zero DOM or React dependencies.

### JSX Adapters
The `*-jsx` packages provide framework-independent rendering via custom `h()` and JSX runtimes. They target non-React consumers who compile JSX with the design system's runtime.
