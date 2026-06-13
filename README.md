# Web Design System

Storybook workspace and package scaffold for the Pikaboo design system.

Pikaboo, Pikaboo Dark, and Primedia are tenant themes in one shared brand
system. The Pikaboo tenant product name is `PIKABOO`. The Primedia tenant
product name is `Cortexx`, so tenant-facing Pikaboo product references should
render as `Cortexx` under the Primedia theme.

## Documentation

| Topic | File |
|-------|------|
| React & JSX component exports, subpath entrypoints | [docs/react-jsx-exports.md](docs/react-jsx-exports.md) |
| Design patterns, theming, testing, component conventions | [docs/design-patterns.md](docs/design-patterns.md) |
| Known a11y and design issues, workarounds | [docs/common-issues.md](docs/common-issues.md) |

## Authenticate npm with the timbuk2 CodeArtifact registry

The `timbuk2` CodeArtifact registry is in eu-west-1 because CodeArtifact has no
af-south-1 service endpoint. It proxies `npmjs.org` and hosts internal packages.
Run this once per session. The auth token lasts 12 hours, after which
`npm install` or `npm publish` will start failing with 401s until you re-run it.

This repo keeps only the scoped registry in `.npmrc`; it does not commit any auth
token. `package.json` also pins `publishConfig.registry` so this package
publishes to CodeArtifact instead of public npm.

From this package, use the script form:

```bash
npm run artifact:login -- --profile <AWS_PROFILE>
```

The underlying command is:

```bash
aws codeartifact login \
  --tool npm \
  --domain timbuk2 \
  --domain-owner 539247467239 \
  --repository npm \
  --region eu-west-1 \
  --profile <AWS_PROFILE>
```

## Commands

```bash
npm run dev
npm test
npm run type-check
npm run check
npm run build
npm run build:package
npm run build-storybook
npm run pack:check
npm run publish:artifact:dry-run
npm run publish:artifact
```

`npm run build` is the library build and writes the reusable package output to
`dist/`. `npm run build:package` is the release gate: type-check, Biome check,
tests, and library build.

`npm run publish:artifact` is the real publish command. Run
`npm run publish:artifact:dry-run` first when you want to inspect the tarball and
publish metadata without uploading.

The pack and publish scripts use a temporary npm cache because this workstation
has previously hit `EPERM` under `~/.npm`:

```bash
npm_config_cache=/private/tmp/pds-npm-cache npm pack --dry-run
npm_config_cache=/private/tmp/pds-npm-cache npm publish --access restricted
```

## Testing

Storybook ships the recommended test suite end-to-end: every story runs as a
component test in a real Chromium browser, and every story is checked against
axe accessibility rules at the same time.

```bash
npm test                # unit + storybook projects
npm run test:unit       # vitest unit tests (jsdom)
npm run test:storybook  # all stories in chromium via @storybook/addon-vitest
```

`npm run test:storybook` boots a Vitest browser-mode run that:

- mounts every `*.stories.tsx` story in headless Chromium (`@vitest/browser` +
  `@vitest/browser-playwright`),
- runs the story's `play()` function as an interaction test,
- runs `@storybook/addon-a11y` against each story with axe and fails the run on
  any violation (`a11y.test: 'error'` is set in [.storybook/preview.tsx](.storybook/preview.tsx)).

To use the test widget interactively, start Storybook (`npm run dev`), open
<http://localhost:2050>, expand the bottom-left test widget, toggle the
**Accessibility** and **Component tests** checkboxes, then click **Run component
tests** to drive the same suite from the UI.

Visual regression tests (Chromatic) are not wired up; only component and
accessibility tests are enforced.

CI (`.github/workflows/test.yml`) runs `test:unit` and `test:storybook` on every
push and pull request.

## Storybook Manual

Storybook is the living usage manual for the package:

- `Documentation/Component Usage` is the searchable catalog. It lists component
  families, package entrypoints, key props, React snippets, and raw JSX snippets
  where raw adapters exist.
- `Documentation/Interactive Playgrounds` groups the main component families
  into controllable prop playgrounds.
- `Documentation/Plain JSX Exports` renders the raw auth and report JSX
  entrypoints as generated HTML, so consumers can see the non-React surface.
- `Components/Floating Button` documents the generic draggable floating action
  button used for help, quick-create, export, or any persistent action.

Consumer projects should authenticate to the same CodeArtifact repository, then
install the package normally:

```bash
aws codeartifact login \
  --tool npm \
  --domain timbuk2 \
  --domain-owner 539247467239 \
  --repository npm \
  --region eu-west-1 \
  --profile <AWS_PROFILE>

npm install @pikaboo/t2-design-system
```

## CodeArtifact npm registry

`npm install` resolves against the **timbuk2** CodeArtifact registry in eu-west-1 (CodeArtifact has no af-south-1 service endpoint). It proxies `npmjs.org` and hosts internal packages. The auth token lasts 12 hours — re-run when you start hitting 401s on install:

```bash
npm run init-timbuk2-npm <AWS_PROFILE>
# e.g. npm run init-timbuk2-npm 539247467239_AdministratorAccess
```

The script rewrites `~/.npmrc` with a fresh token. Same command works in the monorepo root and every other JS sub-repo.

## Package Usage

```tsx
import {
	Badge,
	Button,
	Card,
	ThemeProvider,
	ThemeSwitcher,
} from '@pikaboo/t2-design-system';
import '@pikaboo/t2-design-system/styles.css';

export function App() {
	return (
		<ThemeProvider defaultTheme="pikaboo" applyToRoot>
			<ThemeSwitcher />
			<Button>Create campaign</Button>
		</ThemeProvider>
	);
}
```

Tailwind consumers can share the same token names through the exported preset:

```ts
import pikabooTailwindPreset from '@pikaboo/t2-design-system/tailwind';

export default {
	content: ['./src/**/*.{ts,tsx}'],
	presets: [pikabooTailwindPreset],
};
```

Themes, auth, and report consumers can use package subpaths:

```tsx
import {
	createDesignTheme,
	ThemeProvider,
	ThemeSwitcher,
} from '@pikaboo/t2-design-system/theme';
import { AuthSignUpScreen } from '@pikaboo/t2-design-system/auth';
import { AuthAccessScreen } from '@pikaboo/t2-design-system/react/auth';
import { createAuthAccessModel } from '@pikaboo/t2-design-system/auth-core';
import {
	ReportComparisonBlock,
	ReportMetricRibbon,
	ReportMetricTile,
} from '@pikaboo/t2-design-system/report';
import { createReportComparisonModel } from '@pikaboo/t2-design-system/report-core';
import {
	BarChart,
	ChartProvider,
	LineChart,
	KpiCard,
} from '@pikaboo/t2-design-system/charts';
import { formatCurrency, resolvePalette } from '@pikaboo/t2-design-system/charts-core';
import '@pikaboo/t2-design-system/styles.css';
```

## Export Architecture

The reference pattern is:

```txt
*-core       -> framework-neutral data contracts, reducers, models, formatters
*-jsx        -> raw JSX-compatible render components and DOM/HTML helpers
react/*      -> explicit React wrappers/adapters
auth/report  -> compatibility React exports for current consumers
```

Reports and auth now follow this split:

- `@pikaboo/t2-design-system/charts`
- `@pikaboo/t2-design-system/charts-core`
- `@pikaboo/t2-design-system/report-core`
- `@pikaboo/t2-design-system/report-jsx`
- `@pikaboo/t2-design-system/report-jsx/jsx-runtime`
- `@pikaboo/t2-design-system/react/report`
- `@pikaboo/t2-design-system/report`
- `@pikaboo/t2-design-system/auth-core`
- `@pikaboo/t2-design-system/auth-jsx`
- `@pikaboo/t2-design-system/auth-jsx/jsx-runtime`
- `@pikaboo/t2-design-system/react/auth`
- `@pikaboo/t2-design-system/auth`

Creating a tenant theme is intended to be a small override rather than a copy of
the whole token file:

```tsx
import { createDesignTheme, ThemeProvider } from '@pikaboo/t2-design-system/theme';

const demoTheme = createDesignTheme({
	id: 'demo',
	baseTheme: 'primedia',
	copy: {
		productName: 'Demo Intelligence',
		tenantName: 'Demo Tenant',
	},
	colors: {
		primary: '#123456',
		secondary: '#2f6f73',
		accent: '#d8ff45',
	},
});

export function App() {
	return <ThemeProvider theme={demoTheme} applyToRoot>{/* app */}</ThemeProvider>;
}
```

## Component Inventory

- Foundations: `ThemeProvider`, `ThemeSwitcher`, theme tokens, tenant copy
  helpers, `Container`, `Grid`, `GridItem`, `Stack`, `Cluster`, `Icon`,
  `Footer`.
- Brand: `BrandMark`, `BrandLockup`, `ProductName`.
- Auth: `AuthAccessScreen`, `AuthSignUpScreen`, `AuthLoginScreen`, Google and
  GitHub SSO actions, WhatsApp support action.
- Support and payments: `HelpCenter` with searchable FAQs and WhatsApp contact
  actions, `PaymentForm` for donation, contribution, invoice, or deposit flows.
- Page blocks: `PageTemplate`, `PageHero`, `LogoCloud`, `FeatureGrid`,
  `FeatureSplit`, `StatsStrip`, `TestimonialBand`, `PricingSection`,
  `FaqSection`, `ContactStrip`, `FinalCta`, `SignupPanel`, `DonationPanel`,
  `ReliefImpactSection`, `TransparencySection`.
- Primitives: `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`,
  `RemovableBadge`, `SelectionBadge`, `Surface`, `Card`, `Input`, `Select`,
  `Textarea`, `Switch`, `Slider`, `RadioCardGroup`, `Popover`,
  `DropdownMenu`, `DropdownItem`, `CommandMenu`, `SelectorGroup`,
  `SelectorOption`, `SearchableSelector`, `SegmentedControl`, `Calendar`,
  `DateRangePicker`, `FloatingButton`, `TabList`, `Tab`, `Tabs`, `Accordion`,
  `DisclosureButton`, `FileDropzone`, `Tooltip`, `Divider`.
- Layout: `Container`, `Grid`, `GridItem`, `Stack`, `Cluster`, `PageShell`,
  `SectionHeader`, `Toolbar`, `Breadcrumbs`, `Pagination`.
- Feedback: `Alert`, `Dialog`, `EmptyState`, `LoadingState`, `BigLoader`,
  `ContentLoader`, `CardLoadingState`, `PageContentLoader`, `Progress`,
  `Skeleton`, `GuidedWizardShell`, `GuidedWizardStepper`.
- Data: `MetricCard`, `StatGrid`, `DataTable`, `ChartCard`, `InsightCard`.
- Charts: `ChartProvider`, `LineChart`, `AreaChart`, `BarChart`,
  `ComboChart`, `PieChart`, `ScatterChart`, `RadarChart`,
  `RadialBarChart`, `Treemap`, `FunnelChart`, `Heatmap`,
  `CalendarHeatmap`, `Histogram`, `BoxPlot`, `RibbonChart`,
  `WaterfallChart`, `SankeyChart`, `Sparkline`, `BarList`,
  `CategoryBar`, `KpiCard`, `KpiStrip`, `BigNumber`, `Gauge`,
  `ProgressBar`, `ProgressCircle`.
- Campaign patterns: `CampaignStatCard`, `CampaignListToolbar`,
  `CampaignCardGrid`, `CampaignListCard`, `CampaignSummaryCard`,
  `PlacementCard`, `AudienceCard`, `FilterChip`, `ActionBar`,
  `CampaignSetupWorkspace`, `CampaignControlCard`, `CampaignControlRow`,
  `CampaignHierarchySelector`, `CampaignRangeControl`, `CampaignChoiceChips`,
  `CampaignSetupReviewRail`, `SupportRequestDialog`, `SiteInventoryPanel`,
  `SiteInventoryRow`, `CampaignScheduleDialog`, `KeyValueList`, `Timeline`.
- Report blocks: `ReportShell`, `ReportExportHeader`, `ReportSection`,
  `ReportBlock`, `ReportBlockGrid`, `ReportMetricBlock`,
  `ReportMetricRibbon`, `ReportMetricRibbonLoading`, `ReportMetricTile`,
  `ReportTourCallout`, `ReportEntityCard`, `ReportEmptyPanel`,
  `ReportChartLoadingBlock`, `ReportSectionLoadingState`,
  `ReportPageLoadingState`, `ReportRankedListBlock`, `ReportToggleGroup`,
  `ReportActionCard`, `ReportEvidenceList`, `ReportComparisonBlock`,
  `ReportKpiStrip`, `ReportKpiTile`, `ReportSparkline`, `ReportTrendChart`,
  `ReportBarList`, `ReportDonut`, `ReportEvidencePanel`,
  `ReportInsightCallout`, `ReportRecommendationCard`, `ReportCommentary`,
  `ReportPlacementTable`, `ReportSourceFooter`.

## Charts

Charts live on the explicit `./charts` subpath so consumers only load the BI
surface when they import it. `recharts` is a peer dependency, kept external from
the package bundle; Optima already provides it. Framework-neutral utilities live
under `./charts-core` for palette resolution, formatters, scale helpers,
reduced-motion checks, and screen-reader table generation.

```tsx
import {
	ChartProvider,
	LineChart,
	KpiStrip,
	KpiCard,
} from '@pikaboo/t2-design-system/charts';
import { formatCompactNumber } from '@pikaboo/t2-design-system/charts-core';

const reachFormat = formatCompactNumber();

export function CampaignDashboard() {
	return (
		<ChartProvider palette="colorblind">
			<KpiStrip columns={3}>
				<KpiCard label="Reach" value="2.6M" delta="+12%" />
				<KpiCard label="Attention" value="58" delta="+6" />
				<KpiCard label="Pacing" value="88%" tone="watch" />
			</KpiStrip>
			<LineChart
				ariaLabel="Monthly reach trend"
				data={[
					{ month: 'Jan', reach: 1280000 },
					{ month: 'Feb', reach: 1520000 },
				]}
				series={[{ key: 'reach', label: 'Reach' }]}
				xKey="month"
				yFormat={reachFormat}
			/>
		</ChartProvider>
	);
}
```

Every chart requires `ariaLabel`, renders a visually hidden data-table fallback,
honors reduced motion, and uses theme CSS variables for palettes, grid, axes,
and tooltip surfaces. Existing report chart exports (`ReportTrendChart`,
`ReportSparkline`, `ReportDonut`, `ReportBarList`) keep their public APIs and
now render through the shared chart primitives.

## Theme Model

- `pikaboo`: Pikaboo tenant theme; product copy uses `PIKABOO`.
- `pikaboo-dark`: website-style dark Pikaboo theme for public and future product
  surfaces.
- `primedia`: tenant theme; product copy uses `Cortexx`.
- `cortexx`: accepted as a product-name alias and resolves to the `primedia`
  theme, but is not a separate switchable theme.

Page-block presets are customer-facing only: `pikaboo` and `primedia`.
`timbuk2` is internal/corporate metadata and should not be used as a page-block
visual theme. Primedia/Cortexx page blocks are blue-led and avoid significant
Pikaboo purple.

## Current Scope

This package is intentionally standalone right now. It exports tokens,
providers, primitives, and Storybook examples, but it does not yet replace
components inside `app-timbuk2-marketing` or the website packages.

When a basic implementation is still useful for compatibility, keep it and
label it `Old`. Add the stronger production-ready version next to it and label
that `Suggested`. For example, native `Select` remains available, while
`DropdownMenu`, `CommandMenu`, `SearchableSelector`, `DateRangePicker`,
`RadioCardGroup`, `Accordion`, `FileDropzone`, and `Tabs` are the suggested
controls for new themed product work.
