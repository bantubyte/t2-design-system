# Web Design System

Storybook workspace and package scaffold for the Pikaboo design system.

Pikaboo and Primedia are tenant themes in one shared brand system. The Pikaboo
tenant product name is `PIKABOO`. The Primedia tenant product name is
`Cortexx`, so tenant-facing Pikaboo product references should render as
`Cortexx` under the Primedia theme.

## Commands

```bash
npm run dev
npm test
npm run type-check
npm run build
npm run build-storybook
```

## CodeArtifact npm registry

`npm install` resolves against the **timbuk2** CodeArtifact registry in af-south-1 (proxies `npmjs.org` + hosts internal packages). The auth token lasts 12 hours — re-run when you start hitting 401s on install:

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

## Component Inventory

- Foundations: `ThemeProvider`, `ThemeSwitcher`, theme tokens, tenant copy helpers.
- Brand: `BrandMark`, `BrandLockup`, `ProductName`.
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
- Campaign patterns: `CampaignSummaryCard`, `PlacementCard`, `AudienceCard`,
  `FilterChip`, `ActionBar`, `KeyValueList`, `Timeline`.
- Report blocks: `ReportShell`, `ReportExportHeader`, `ReportSection`,
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
