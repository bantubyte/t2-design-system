# Using `@pikaboo/web-design-system` in a consumer app

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
npm install @pikaboo/web-design-system
```

---

## 4. Use the package

The package ships **styled subpath exports**. Import the stylesheet once at the app root, then pull components and theme tokens from the named entry points declared in [`package.json`](./package.json).

```tsx
// app root (e.g. layout.tsx / _app.tsx)
import "@pikaboo/web-design-system/styles.css";

// components
import { Badge, Button /* … */ } from "@pikaboo/web-design-system";

// theme tokens
import { /* tokens */ } from "@pikaboo/web-design-system/theme";
```

### Available subpath exports

| Import path | Purpose |
| --- | --- |
| `@pikaboo/web-design-system` | Core components |
| `@pikaboo/web-design-system/styles.css` | Compiled stylesheet (import once) |
| `@pikaboo/web-design-system/theme` | Theme tokens |
| `@pikaboo/web-design-system/tailwind` | Tailwind preset |
| `@pikaboo/web-design-system/auth` · `/auth-core` · `/auth-jsx` · `/react/auth` | Auth surface |
| `@pikaboo/web-design-system/report` · `/report-core` · `/report-jsx` · `/react/report` | Report surface |

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
} from '@pikaboo/web-design-system/report';
import '@pikaboo/web-design-system/styles.css';

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

Plain JSX report blocks:

```tsx
/** @jsxImportSource @pikaboo/web-design-system/report-jsx */
import {
	RawReportMetricRibbon,
	RawReportMetricTile,
	renderRawJsxToHtml,
} from '@pikaboo/web-design-system/report-jsx';

const html = renderRawJsxToHtml(
	<RawReportMetricRibbon highlighted>
		<RawReportMetricTile accent="cyan" label="VAC" value="48.1M" />
	</RawReportMetricRibbon>,
);
```

Floating action button:

```tsx
import { FloatingButton } from '@pikaboo/web-design-system';

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

---

## Troubleshooting

- **`401 Unauthorized` on install** — CodeArtifact token expired. Re-run step 1.
- **`404 Not Found` for `@pikaboo/web-design-system`** — the version in `package.json` hasn't been published yet. From this repo, run `npm run build:package && npm run publish:artifact`.
- **Peer dep warnings** — the package declares `react ^18.3.0 || ^19.0.0` as a peer. Make sure the consumer satisfies that.
