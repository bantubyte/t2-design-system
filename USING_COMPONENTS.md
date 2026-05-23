# Using `@pikaboo/t2-design-system` in a consumer app

This guide walks through installing the Pikaboo design system in a consumer project (e.g. `app-timbuk2-marketing`). The package is published to the **private timbuk2 CodeArtifact registry** in `eu-west-1`, so consumers need to authenticate before installing.

---

## 1. Authenticate npm with CodeArtifact

The CodeArtifact auth token lasts **12 hours**. Re-run this whenever `npm install` starts returning `401`.

```bash
aws codeartifact login \
  --tool npm \
  --domain timbuk2 \
  --domain-owner 539247467239 \
  --repository npm \
  --region eu-west-1 \
  --profile timbuk2-infra
```

> Swap `--profile timbuk2-infra` for whichever local AWS profile has CodeArtifact read access.

---

## 2. Pin the scoped registry in the consumer

Add an `.npmrc` to the consumer (e.g. `submodules/app-timbuk2-marketing/.npmrc`) that mirrors the one in this repo:

```ini
@pikaboo:registry=https://timbuk2-539247467239.d.codeartifact.eu-west-1.amazonaws.com/npm/npm/
```

This pins the `@pikaboo` scope to CodeArtifact regardless of what the global `~/.npmrc` looks like. If the token expires, only the auth step fails — the registry lookup stays correct.

---

## 3. Install the package

```bash
cd submodules/app-timbuk2-marketing
npm install @pikaboo/t2-design-system
```

---

## 4. Use the package

The package ships **styled subpath exports**. Import the stylesheet once at the app root, then pull components and theme tokens from the named entry points declared in [`package.json`](./package.json).

```tsx
// app root (e.g. layout.tsx / _app.tsx)
import "@pikaboo/t2-design-system/styles.css";

// components
import { Badge, Button /* … */ } from "@pikaboo/t2-design-system";

// theme tokens
import { /* tokens */ } from "@pikaboo/t2-design-system/theme";
```

### Available subpath exports

| Import path | Purpose |
| --- | --- |
| `@pikaboo/t2-design-system` | Core components |
| `@pikaboo/t2-design-system/styles.css` | Compiled stylesheet (import once) |
| `@pikaboo/t2-design-system/theme` | Theme tokens |
| `@pikaboo/t2-design-system/tailwind` | Tailwind preset |
| `@pikaboo/t2-design-system/charts` · `/charts-core` | Recharts-backed BI components and framework-neutral chart helpers |
| `@pikaboo/t2-design-system/auth` · `/auth-core` · `/auth-jsx` · `/react/auth` | Auth surface |
| `@pikaboo/t2-design-system/report` · `/report-core` · `/report-jsx` · `/react/report` | Report surface |

## 5. Find usage snippets in Storybook

The Storybook docs are intended to be the fastest way to learn the package:

- `Documentation/Component Usage` has a searchable map of every component family, key props, import paths, React snippets, and raw JSX snippets where they exist.
- `Documentation/Interactive Playgrounds` exposes Storybook controls for the main component groups.
- `Documentation/Plain JSX Exports` renders the raw JSX auth/report entrypoints as generated HTML.
- `Components/Floating Button` shows the draggable floating action button used for help, quick-create, export, or other persistent actions.

## 6. Common snippets

React report blocks:

```tsx
import {
	ReportComparisonBlock,
	ReportKpiStrip,
	ReportKpiTile,
	ReportPlacementTable,
} from '@pikaboo/t2-design-system/report';
import '@pikaboo/t2-design-system/styles.css';

export function CampaignReport() {
	return (
		<>
			<ReportKpiStrip columns={4}>
				<ReportKpiTile label="Reach" value="4.2M" tone="good" />
				<ReportKpiTile label="VAC" value="68.9M" tone="info" />
			</ReportKpiStrip>
			<ReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
			<ReportPlacementTable rows={placements} />
		</>
	);
}
```

Charts:

```tsx
import {
	BarChart,
	ChartProvider,
	Heatmap,
	KpiCard,
	KpiStrip,
	LineChart,
} from '@pikaboo/t2-design-system/charts';
import { formatCompactNumber, formatPercent } from '@pikaboo/t2-design-system/charts-core';
import '@pikaboo/t2-design-system/styles.css';

const compact = formatCompactNumber();
const percent = formatPercent({ from: 'whole' });

export function CampaignBiPanel() {
	return (
		<ChartProvider palette="colorblind">
			<KpiStrip columns={3}>
				<KpiCard label="Reach" value="2.6M" delta="+12%" tone="good" />
				<KpiCard label="Pacing" value="88%" delta="-4%" tone="watch" />
				<KpiCard label="Attention" value="58" delta="+6" tone="info" />
			</KpiStrip>
			<LineChart
				ariaLabel="Monthly reach trend"
				data={[
					{ month: 'Jan', reach: 1280000, attention: 38 },
					{ month: 'Feb', reach: 1520000, attention: 42 },
					{ month: 'Mar', reach: 1880000, attention: 48 },
				]}
				series={[
					{ key: 'reach', label: 'Reach' },
					{ key: 'attention', label: 'Attention index' },
				]}
				xKey="month"
				yFormat={compact}
			/>
			<BarChart
				ariaLabel="Delivery by channel"
				data={[
					{ channel: 'Roadside', delivered: 51, planned: 42 },
					{ channel: 'Mall', delivered: 24, planned: 28 },
				]}
				series={[
					{ key: 'planned', label: 'Planned' },
					{ key: 'delivered', label: 'Delivered' },
				]}
				xKey="channel"
				yFormat={percent}
			/>
			<Heatmap
				ariaLabel="Attention heatmap by daypart"
				columnKey="daypart"
				data={[
					{ daypart: 'Morning', region: 'Gauteng', score: 84 },
					{ daypart: 'Evening', region: 'Gauteng', score: 91 },
				]}
				rowKey="region"
				valueKey="score"
			/>
		</ChartProvider>
	);
}
```

`recharts` is an optional peer dependency on the package, but any consumer that
imports `@pikaboo/t2-design-system/charts` or the report chart wrappers must
install a compatible version (`>=2.13.0 <4`). Optima already has Recharts in its
dependency tree.

Plain JSX report blocks:

```tsx
/** @jsxImportSource @pikaboo/t2-design-system/report-jsx */
import {
	RawReportMetricRibbon,
	RawReportMetricTile,
	renderRawJsxToHtml,
} from '@pikaboo/t2-design-system/report-jsx';

const html = renderRawJsxToHtml(
	<RawReportMetricRibbon highlighted>
		<RawReportMetricTile accent="cyan" label="VAC" value="48.1M" />
	</RawReportMetricRibbon>,
);
```

Floating action button:

```tsx
import { FloatingButton } from '@pikaboo/t2-design-system';

export function HelpAction() {
	return (
		<FloatingButton
			icon="help"
			label="Contact Help"
			liftBottomCorners
			onClick={() => setHelpOpen(true)}
			storageKey="cortexx_help_fab_corner"
			tooltip="Drag me to another corner"
		/>
	);
}
```

Tooltip styling and the optional idle pulse are exposed as CSS variables on the
button so consumers can tune them via inline `style` (no need to target internal
classes):

```tsx
<FloatingButton
	icon="help"
	label="Contact Help"
	tooltip="Need a hand?"
	style={{
		// Tooltip shape — every var has a default that matches the current visuals
		'--pds-floating-button-tooltip-padding': '0.6rem 0.95rem',
		'--pds-floating-button-tooltip-font-size': '0.8125rem',
		'--pds-floating-button-tooltip-font-weight': '600',
		'--pds-floating-button-tooltip-radius': '14px',
		'--pds-floating-button-tooltip-shadow': '0 12px 28px -12px rgb(0 0 0 / 0.32)',
		'--pds-floating-button-tooltip-border-color': 'transparent',
		// Idle breathing-ring pulse — opt-in. Pauses on hover/focus/drag/snap and
		// respects `prefers-reduced-motion`.
		'--pds-floating-button-idle-animation': 'pds-floating-button-idle-pulse',
		'--pds-floating-button-idle-duration': '2.4s',
	}}
/>
```

Available tooltip variables (every one has a default that preserves current
visuals):

| Variable | Default |
| --- | --- |
| `--pds-floating-button-tooltip-max-width` | `14rem` |
| `--pds-floating-button-tooltip-padding` | `0.45rem 0.65rem` |
| `--pds-floating-button-tooltip-font-size` | `0.75rem` |
| `--pds-floating-button-tooltip-font-weight` | `inherit` |
| `--pds-floating-button-tooltip-line-height` | `1.25` |
| `--pds-floating-button-tooltip-color` | `var(--theme-foreground)` |
| `--pds-floating-button-tooltip-background` | `var(--theme-surface)` |
| `--pds-floating-button-tooltip-border-width` | `1px` |
| `--pds-floating-button-tooltip-border-color` | `var(--theme-border)` |
| `--pds-floating-button-tooltip-radius` | `calc(var(--radius) - 2px)` |
| `--pds-floating-button-tooltip-shadow` | `var(--theme-shadow-md)` |

The tooltip defaults to `white-space: nowrap` so short labels don't wrap when
you bump `padding` or `font-size`. Set `--pds-floating-button-tooltip-max-width`
and ship a wider tooltip if you need multi-line copy.

`data-*` attributes pass through to the underlying `<button>` element via the
component's rest-prop spread — `data-testid`, `data-analytics`, and friends
work without any extra wiring.

---

## Troubleshooting

- **`401 Unauthorized` on install** — CodeArtifact token expired. Re-run step 1.
- **`404 Not Found` for `@pikaboo/t2-design-system`** — the version in `package.json` hasn't been published yet. From this repo, run `npm run build:package && npm run publish:artifact`.
- **Peer dep warnings** — the package declares `react ^18.3.0 || ^19.0.0` as a peer. Make sure the consumer satisfies that.
