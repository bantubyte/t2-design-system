import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button, Surface } from '../components';
import {
	createDesignTheme,
	ThemeProvider,
	ThemeSwitcher,
	useTheme,
} from '../theme';

const meta = {
	title: 'Foundations/Theme Overview',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const swatchNames = [
	['Primary', '--theme-primary'],
	['Secondary', '--theme-secondary'],
	['Accent', '--theme-accent'],
	['Slate', '--theme-brand-text'],
	['Magenta', '--theme-brand-magenta'],
	['Cyan', '--theme-brand-cyan'],
] as const;

function TokenSwatch({
	name,
	variable,
}: {
	name: string;
	variable: `--${string}`;
}) {
	return (
		<div className="pds-token-swatch">
			<div
				className="pds-token-swatch__color"
				style={
					{ '--swatch-color': `var(${variable})` } as CSSProperties & {
						'--swatch-color': string;
					}
				}
			/>
			<div>
				<p className="pds-token-swatch__name">{name}</p>
				<p className="pds-token-swatch__value">{variable}</p>
			</div>
		</div>
	);
}

function ThemeOverview() {
	const { theme } = useTheme();

	return (
		<main className="pds-story-frame">
			<ThemeSwitcher />
			<div style={{ marginTop: '2.5rem' }}>
				<p className="pds-story-kicker">{theme.name} tenant</p>
				<h1 className="pds-story-title">{theme.copy.productName}</h1>
				<p className="pds-story-copy">
					PIKABOO is the product name for the Pikaboo tenant. In the Primedia
					tenant, product-facing Pikaboo references become Cortexx while the
					underlying token and component system stays shared.
				</p>
			</div>

			<div className="pds-story-grid">
				<Surface>
					<h2 style={{ fontFamily: 'var(--theme-font-heading)', marginTop: 0 }}>
						Actions
					</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
						<Button>Create campaign</Button>
						<Button variant="outline">View report</Button>
					</div>
				</Surface>
				<Surface tone="brand">
					<h2 style={{ fontFamily: 'var(--theme-font-heading)', marginTop: 0 }}>
						{theme.copy.reportTitle}
					</h2>
					<p style={{ marginBottom: 0 }}>{theme.copy.poweredByLabel}</p>
				</Surface>
				<Surface tone="muted">
					<h2 style={{ fontFamily: 'var(--theme-font-heading)', marginTop: 0 }}>
						Tenant Copy
					</h2>
					<p style={{ marginBottom: 0 }}>
						{theme.id === 'primedia'
							? 'Primedia sees Cortexx naming on tenant-facing surfaces.'
							: 'Pikaboo tenant surfaces use PIKABOO product naming.'}
					</p>
				</Surface>
			</div>

			<div className="pds-story-grid">
				{swatchNames.map(([name, variable]) => (
					<TokenSwatch key={variable} name={name} variable={variable} />
				))}
			</div>
		</main>
	);
}

export const Overview: Story = {
	render: () => <ThemeOverview />,
};

function ThemeComparisonPanel() {
	const { theme } = useTheme();

	return (
		<Surface>
			<p className="pds-story-kicker">{theme.copy.tenantName}</p>
			<h2 style={{ fontFamily: 'var(--theme-font-heading)', margin: 0 }}>
				{theme.copy.productName}
			</h2>
			<p style={{ color: 'var(--theme-foreground-muted)' }}>
				{theme.copy.poweredByLabel}
			</p>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
				<Button size="sm">Primary</Button>
				<Button size="sm" variant="outline">
					Secondary
				</Button>
			</div>
		</Surface>
	);
}

export const TenantComparison: Story = {
	render: () => (
		<div className="pds-story-frame">
			<div className="pds-story-grid">
				<ThemeProvider theme="pikaboo">
					<ThemeComparisonPanel />
				</ThemeProvider>
				<ThemeProvider theme="primedia">
					<ThemeComparisonPanel />
				</ThemeProvider>
			</div>
		</div>
	),
};

const demoTheme = createDesignTheme({
	id: 'demo',
	name: 'Demo Tenant',
	baseTheme: 'primedia',
	copy: {
		productName: 'Demo Intelligence',
		tenantName: 'Demo Tenant',
		reportTitle: 'Demo Campaign Report',
		poweredByLabel: 'Powered by Demo Intelligence',
	},
	colors: {
		primary: '#123456',
		primaryHover: '#0d2a45',
		secondary: '#2f6f73',
		accent: '#d8ff45',
		accentForeground: '#123456',
		foreground: '#0d2238',
	},
});

export const CustomThemeFactory: Story = {
	parameters: {
		docs: {
			source: {
				code: `import { createDesignTheme, ThemeProvider, ThemeSwitcher } from '@pikaboo/web-design-system/theme';

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

<ThemeProvider theme={demoTheme}>
  <ThemeSwitcher options={['pikaboo', 'primedia', demoTheme]} />
  <YourApp />
</ThemeProvider>`,
			},
		},
	},
	render: () => (
		<ThemeProvider defaultTheme={demoTheme}>
			<main className="pds-story-frame">
				<ThemeSwitcher
					options={['pikaboo' as const, 'primedia' as const, demoTheme]}
				/>
				<div style={{ marginTop: '2rem' }}>
					<ThemeComparisonPanel />
				</div>
			</main>
		</ThemeProvider>
	),
};
