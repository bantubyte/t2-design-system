# Web Design System

Storybook workspace and package scaffold for the Pikaboo design system.

Pikaboo, Pikaboo Dark, and Primedia are tenant themes in one shared brand
system. The Pikaboo tenant product name is `PIKABOO`. The Primedia tenant
product name is `Cortexx`, so tenant-facing Pikaboo product references should
render as `Cortexx` under the Primedia theme.

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

npm install @pikaboo/web-design-system
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
} from '@pikaboo/web-design-system/theme';
import { AuthSignUpScreen } from '@pikaboo/web-design-system/auth';
import { AuthAccessScreen } from '@pikaboo/web-design-system/react/auth';
import { createAuthAccessModel } from '@pikaboo/web-design-system/auth-core';
import {
	ReportComparisonBlock,
	ReportMetricRibbon,
	ReportMetricTile,
} from '@pikaboo/web-design-system/report';
import { createReportComparisonModel } from '@pikaboo/web-design-system/report-core';
import '@pikaboo/web-design-system/styles.css';
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

- `@pikaboo/web-design-system/report-core`
- `@pikaboo/web-design-system/report-jsx`
- `@pikaboo/web-design-system/report-jsx/jsx-runtime`
- `@pikaboo/web-design-system/react/report`
- `@pikaboo/web-design-system/report`
- `@pikaboo/web-design-system/auth-core`
- `@pikaboo/web-design-system/auth-jsx`
- `@pikaboo/web-design-system/auth-jsx/jsx-runtime`
- `@pikaboo/web-design-system/react/auth`
- `@pikaboo/web-design-system/auth`

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
  `DateRangePicker`, `TabList`, `Tab`, `Tabs`, `Accordion`,
  `DisclosureButton`, `FileDropzone`, `Tooltip`, `Divider`.
- Layout: `Container`, `Grid`, `GridItem`, `Stack`, `Cluster`, `PageShell`,
  `SectionHeader`, `Toolbar`, `Breadcrumbs`, `Pagination`.
- Feedback: `Alert`, `Dialog`, `EmptyState`, `LoadingState`, `Progress`,
  `Skeleton`, `GuidedWizardShell`, `GuidedWizardStepper`.
- Data: `MetricCard`, `StatGrid`, `DataTable`, `ChartCard`, `InsightCard`.
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
  `ReportChartLoadingBlock`, `ReportRankedListBlock`, `ReportToggleGroup`,
  `ReportActionCard`, `ReportEvidenceList`, `ReportComparisonBlock`,
  `ReportKpiStrip`, `ReportKpiTile`, `ReportSparkline`, `ReportTrendChart`,
  `ReportBarList`, `ReportDonut`, `ReportEvidencePanel`,
  `ReportInsightCallout`, `ReportRecommendationCard`, `ReportCommentary`,
  `ReportPlacementTable`, `ReportSourceFooter`.

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
