# Web Design System

Storybook workspace and package scaffold for the Pikaboo design system.

Pikaboo and Primedia are tenant themes in one shared brand system. The Pikaboo
tenant product name is `PIKABOO`. The Primedia tenant product name is
`Cortexx`, so tenant-facing Pikaboo product references should render as
`Cortexx` under the Primedia theme.

## Authenticate npm with the timbuk2 CodeArtifact registry

The `timbuk2` CodeArtifact registry (af-south-1) proxies `npmjs.org` and hosts internal packages. Run this once per session. The auth token lasts 12 hours, after which `npm install` or `npm publish` will start failing with 401s until you re-run it.

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
  --repository timbuk2 \
  --region af-south-1 \
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

Consumer projects should authenticate to the same CodeArtifact repository, then
install the package normally:

```bash
aws codeartifact login \
  --tool npm \
  --domain timbuk2 \
  --domain-owner 539247467239 \
  --repository timbuk2 \
  --region af-south-1 \
  --profile <AWS_PROFILE>

npm install @pikaboo/web-design-system
```

## Package Usage

```tsx
import {
	Badge,
	Button,
	Card,
	ThemeProvider,
	ThemeSwitcher,
} from '@pikaboo/web-design-system';
import '@pikaboo/web-design-system/styles.css';

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
import pikabooTailwindPreset from '@pikaboo/web-design-system/tailwind';

export default {
	content: ['./src/**/*.{ts,tsx}'],
	presets: [pikabooTailwindPreset],
};
```

Themes and report-only consumers can use package subpaths:

```tsx
import {
	createDesignTheme,
	ThemeProvider,
	ThemeSwitcher,
} from '@pikaboo/web-design-system/theme';
import { AuthSignUpScreen } from '@pikaboo/web-design-system/auth';
import {
	ReportComparisonBlock,
	ReportMetricRibbon,
	ReportMetricTile,
} from '@pikaboo/web-design-system/report';
import '@pikaboo/web-design-system/styles.css';
```

Creating a tenant theme is intended to be a small override rather than a copy of
the whole token file:

```tsx
import { createDesignTheme, ThemeProvider } from '@pikaboo/web-design-system/theme';

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

- Foundations: `ThemeProvider`, `ThemeSwitcher`, theme tokens, tenant copy helpers.
- Brand: `BrandMark`, `BrandLockup`, `ProductName`.
- Auth: `AuthSignUpScreen`.
- Primitives: `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`,
  `RemovableBadge`, `SelectionBadge`, `Surface`, `Card`, `Input`, `Select`,
  `Textarea`, `Switch`, `Slider`, `RadioCardGroup`, `Popover`,
  `DropdownMenu`, `DropdownItem`, `CommandMenu`, `SelectorGroup`,
  `SelectorOption`, `SearchableSelector`, `SegmentedControl`, `Calendar`,
  `DateRangePicker`, `TabList`, `Tab`, `Tabs`, `Accordion`,
  `DisclosureButton`, `FileDropzone`, `Tooltip`, `Divider`.
- Layout: `PageShell`, `SectionHeader`, `Toolbar`, `Breadcrumbs`,
  `Pagination`.
- Feedback: `Alert`, `Dialog`, `EmptyState`, `LoadingState`, `Progress`,
  `Skeleton`.
- Data: `MetricCard`, `StatGrid`, `DataTable`, `ChartCard`, `InsightCard`.
- Campaign patterns: `CampaignStatCard`, `CampaignListToolbar`,
  `CampaignCardGrid`, `CampaignListCard`, `CampaignSummaryCard`,
  `PlacementCard`, `AudienceCard`, `FilterChip`, `ActionBar`,
  `SupportRequestDialog`, `SiteInventoryPanel`, `SiteInventoryRow`,
  `CampaignScheduleDialog`, `KeyValueList`, `Timeline`.
- Report blocks: `ReportShell`, `ReportExportHeader`, `ReportSection`,
  `ReportBlock`, `ReportBlockGrid`, `ReportMetricBlock`,
  `ReportMetricRibbon`, `ReportMetricRibbonLoading`, `ReportMetricTile`,
  `ReportTourCallout`, `ReportEntityCard`, `ReportEmptyPanel`,
  `ReportChartLoadingBlock`, `ReportRankedListBlock`, `ReportToggleGroup`,
  `ReportActionCard`, `ReportEvidenceList`, `ReportComparisonBlock`,
  `ReportKpiStrip`, `ReportKpiTile`, `ReportSparkline`, `ReportTrendChart`,
  `ReportBarList`, `ReportDonut`, `ReportEvidencePanel`,
  `ReportInsightCallout`, `ReportRecommendationCard`, `ReportCommentary`,
  `ReportPlacementTable`, `ReportSourceFooter`.

## Theme Model

- `pikaboo`: Pikaboo tenant theme; product copy uses `PIKABOO`.
- `primedia`: tenant theme; product copy uses `Cortexx`.
- `cortexx`: accepted as a product-name alias and resolves to the `primedia`
  theme, but is not a separate switchable theme.

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
