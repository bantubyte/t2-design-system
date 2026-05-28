# React & JSX Component Exports

## Package Entrypoints

The design system exposes components through subpath exports defined in `package.json`. Each entrypoint targets a specific use case:

| Subpath | Source | Purpose |
|---------|--------|---------|
| `@pikaboo/t2-design-system` | `src/index.ts` | Main entrypoint: re-exports `components/`, `theme/`, and `utils/class-names` |
| `@pikaboo/t2-design-system/theme` | `src/theme/` | `ThemeProvider`, `ThemeSwitcher`, design tokens, `createDesignTheme()` |
| `@pikaboo/t2-design-system/auth` | `src/auth.ts` | React auth screens (legacy compatibility) |
| `@pikaboo/t2-design-system/auth-core` | `src/auth-core/` | Framework-neutral auth models, types, data contracts |
| `@pikaboo/t2-design-system/auth-jsx` | `src/auth-jsx/` | Raw JSX auth renderer, runtime helpers, adapter for non-React apps |
| `@pikaboo/t2-design-system/auth-jsx/jsx-runtime` | `src/auth-jsx/jsx-runtime.ts` | JSX runtime for auth (h, Fragment) |
| `@pikaboo/t2-design-system/react/auth` | `src/react/auth.ts` | Explicit React wrapper for auth (uses `useMemo` + effect hooks) |
| `@pikaboo/t2-design-system/report` | `src/report.ts` | React report blocks (legacy compatibility) |
| `@pikaboo/t2-design-system/report-core` | `src/report-core/` | Framework-neutral report models, reducers, formatters |
| `@pikaboo/t2-design-system/report-jsx` | `src/report-jsx/` | Raw JSX report renderer and runtime helpers |
| `@pikaboo/t2-design-system/report-jsx/jsx-runtime` | `src/report-jsx/jsx-runtime.ts` | JSX runtime for reports |
| `@pikaboo/t2-design-system/react/report` | `src/react/report.ts` | Explicit React wrapper for report blocks |
| `@pikaboo/t2-design-system/charts` | `src/charts.ts` | All chart components (`BarChart`, `LineChart`, `PieChart`, etc.) |
| `@pikaboo/t2-design-system/charts-core` | `src/charts-core/` | Chart utilities: palette resolution, formatters, scales, a11y data table |
| `@pikaboo/t2-design-system/marketing-jsx` | `src/marketing-jsx/` | Raw JSX marketing page blocks |
| `@pikaboo/t2-design-system/marketing-jsx/jsx-runtime` | `src/marketing-jsx/jsx-runtime.ts` | JSX runtime for marketing |
| `@pikaboo/t2-design-system/marketing-jsx/jsx-dev-runtime` | `src/marketing-jsx/jsx-dev-runtime.ts` | JSX dev runtime for marketing |
| `@pikaboo/t2-design-system/tailwind` | `src/tailwind.ts` | Tailwind CSS preset with design-token values |
| `@pikaboo/t2-design-system/styles.css` | `src/styles.css` | Global CSS (must be imported by consumers) |

## Export Architecture

```
*-core       -> framework-neutral data contracts, reducers, models, formatters
*-jsx        -> raw JSX-compatible render components and DOM/HTML helpers
react/*      -> explicit React wrappers/adapters
auth/report  -> compatibility React exports for current consumers
```

## Main Entrypoint Exports

### Theme (`src/theme/`)
- `ThemeProvider` — CSS custom property injection, `data-theme` attribute
- `ThemeSwitcher` — Dropdown to switch between pikaboo / pikaboo-dark / primedia
- `createDesignTheme()` — Factory to build custom tenant themes
- All design tokens (colors, spacing, typography, shadows)

### Component Exports (`src/components/`)

| Family | Exports |
|--------|---------|
| Brand | `BrandMark`, `BrandLockup`, `PikabooWordmark`, `ProductName` |
| Button | `Button`, `IconButton` |
| Badge | `Badge`, `RemovableBadge`, `SelectionBadge` |
| Avatar | `Avatar`, `AvatarGroup` |
| Surface | `Surface` (tone + padding variants) |
| Card | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` |
| Dialog | `Dialog`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`, `DialogDescription` |
| Disclosure | `Accordion`, `DisclosureButton` |
| Popover | `Popover` (controlled trigger + floating panel) |
| Tooltip | `Tooltip` |
| Navigation | `SiteNav`, `MobileMenuSheet`, `Footer` |
| Page Blocks | `PageTemplate`, `PageHero`, `LogoCloud`, `FeatureGrid`, `FeatureSplit`, `StatsStrip`, `TestimonialBand`, `PricingSection`, `FaqSection`, `SignupPanel`, `DonationPanel`, `AnnotatedHeadline`, `ArticleCard`, `ArticleCardGrid`, `TeamGrid`, `CoverageMap`, `ProcessTimeline` |
| Floating Button | `FloatingButton` (draggable FAB with pill/menu shapes) |
| Theme Toggle | `ThemeToggle` (sun/moon segmented toggle) |
| Form Controls | `Input`, `Select`, `Textarea`, `Switch`, `Slider`, `FileDropzone`, `RadioCardGroup`, `SearchableSelector`, `SegmentedControl`, `Calendar`, `DateRangePicker` |
| Data Display | `DataTable`, `MetricCard`, `StatGrid`, `ChartCard`, `InsightCard` |
| Feedback | `Alert`, `EmptyState`, `LoadingState`, `BigLoader`, `ContentLoader`, `CardLoadingState`, `PageContentLoader`, `Progress`, `Skeleton` |
| Layout | `Container`, `Grid`, `GridItem`, `Stack`, `Cluster`, `PageShell`, `SectionHeader`, `Toolbar`, `Breadcrumbs`, `Pagination` |
| Wizard | `GuidedWizardShell`, `GuidedWizardStepper` |
| Report | `ReportShell`, `ReportExportHeader`, `ReportSection`, `ReportBlock`, `ReportBlockGrid`, `ReportMetricTile`, `ReportMetricRibbon`, `ReportComparisonBlock`, `ReportRankedListBlock`, `ReportPlacementTable`, `ReportEntityCard`, `ReportEvidencePanel`, `ReportTourCallout`, and more |

### Chart Exports (`src/components/charts/`)
- `ChartProvider` (palette context), `ChartContainer`
- `LineChart`, `AreaChart`, `BarChart`, `ComboChart`, `PieChart`, `ScatterChart`
- `RadarChart`, `RadialBarChart`, `Treemap`, `FunnelChart`, `Heatmap`
- `CalendarHeatmap`, `Histogram`, `BoxPlot`, `RibbonChart`, `WaterfallChart`
- `SankeyChart`, `Sparkline`, `BarList`, `CategoryBar`
- `KpiCard`, `KpiStrip`, `BigNumber`, `Gauge`, `ProgressBar`, `ProgressCircle`

## JSX Runtime Exports

For non-React consumers, the `*-jsx` packages export:

- **Components**: `create<Domain>Model()`, render functions that return `JSX.Element`
- **Runtimes**: `h()` (hyperscript), `Fragment`, `render()` (DOM mount helper)
- **JSX runtimes**: `jsx()`, `jsxs()`, `jsxDEV()` for transpiled JSX

### Marketing JSX (`marketing-jsx`)
```tsx
import { h, render, MarketingPage } from '@pikaboo/t2-design-system/marketing-jsx';

const container = document.getElementById('root');
render(h(MarketingPage, { theme: 'pikaboo' }), container);
```

### Auth JSX (`auth-jsx`)
```tsx
import { h, AuthSignUp } from '@pikaboo/t2-design-system/auth-jsx';

const vdom = h(AuthSignUp, { onSuccess: handleSignUp });
```

### Report JSX (`report-jsx`)
```tsx
import { h, ReportComparison } from '@pikaboo/t2-design-system/report-jsx';

const vdom = h(ReportComparison, { data: comparisonData });
```

## React Wrappers

React wrappers in `react/auth` and `react/report` bridge JSX adapters into idiomatic React via `useMemo` and `useEffect`:

```tsx
import { AuthAccessScreen } from '@pikaboo/t2-design-system/react/auth';
import { ReportComparisonBlock } from '@pikaboo/t2-design-system/react/report';
```

## Usage Example

```tsx
import { ThemeProvider, Button, Card } from '@pikaboo/t2-design-system';
import { LineChart, ChartProvider } from '@pikaboo/t2-design-system/charts';
import { createDesignTheme } from '@pikaboo/t2-design-system/theme';
import '@pikaboo/t2-design-system/styles.css';
```
