export const themeIds = ['pikaboo', 'pikaboo-dark', 'primedia'] as const;

export type ThemeId = (typeof themeIds)[number];
export type ThemeTenant = ThemeId | (string & {});
export type ThemeInput =
	| ThemeId
	| 'cortexx'
	| DesignTheme<string>
	| (string & {});
export type ThemeCssVariables = Record<`--${string}`, string>;

export interface ThemeCopyTokens {
	productName: string;
	brandName: string;
	tenantName: string;
	reportTitle: string;
	preparedByLabel: string;
	poweredByLabel: string;
}

export interface ThemeTypographyTokens {
	body: string;
	heading: string;
	ui: string;
}

export interface ThemeColorTokens {
	background: string;
	backgroundMuted: string;
	surface: string;
	surfaceElevated: string;
	foreground: string;
	foregroundMuted: string;
	foregroundSubtle: string;
	primary: string;
	primaryHover: string;
	primaryForeground: string;
	secondary: string;
	accent: string;
	accentForeground: string;
	border: string;
	ring: string;
	info: string;
	link: string;
	linkHover: string;
	success: string;
	warning: string;
	danger: string;
	magenta: string;
	cyan: string;
	slate: string;
	pearl: string;
}

export interface ThemeShadowTokens {
	sm: string;
	md: string;
	lg: string;
	card: string;
	glow: string;
}

export interface ThemeChartTokens {
	primary: string;
	secondary: string;
	tertiary: string;
	quaternary: string;
	quinary: string;
	senary: string;
	axis: string;
	grid: string;
}

export interface DesignTheme<TId extends string = ThemeId> {
	id: TId;
	name: string;
	description: string;
	tenant: ThemeTenant;
	aliases: string[];
	copy: ThemeCopyTokens;
	typography: ThemeTypographyTokens;
	colors: ThemeColorTokens;
	shadows: ThemeShadowTokens;
	charts: ThemeChartTokens;
	cssVariables: ThemeCssVariables;
}

export type AnyDesignTheme = DesignTheme<string>;

export interface ThemeTokenOverrides {
	charts?: Partial<ThemeChartTokens>;
	colors?: Partial<ThemeColorTokens>;
	copy?: Partial<ThemeCopyTokens>;
	cssVariables?: Partial<ThemeCssVariables>;
	shadows?: Partial<ThemeShadowTokens>;
	typography?: Partial<ThemeTypographyTokens>;
}

export interface CreateDesignThemeOptions<TId extends string>
	extends ThemeTokenOverrides {
	aliases?: readonly string[];
	baseTheme?: ThemeInput;
	description?: string;
	id: TId;
	name?: string;
	tenant?: ThemeTenant;
}

export const defaultThemeId: ThemeId = 'pikaboo';

const hexToRgbTriplet = (value?: string): string | undefined => {
	const match = value?.trim().match(/^#(?<hex>[0-9a-f]{6})$/i);
	const hex = match?.groups?.hex;
	if (!hex) return undefined;

	const red = Number.parseInt(hex.slice(0, 2), 16);
	const green = Number.parseInt(hex.slice(2, 4), 16);
	const blue = Number.parseInt(hex.slice(4, 6), 16);
	return `${red} ${green} ${blue}`;
};

const cssVariablesFromTokenOverrides = ({
	charts,
	colors,
	shadows,
	typography,
}: ThemeTokenOverrides): ThemeCssVariables => {
	const variables: ThemeCssVariables = {};
	const setVariable = (name: `--${string}`, value?: string) => {
		if (value) {
			variables[name] = value;
		}
	};

	setVariable('--theme-font-body', typography?.body);
	setVariable('--theme-font-heading', typography?.heading);
	setVariable('--theme-font-ui', typography?.ui);

	setVariable('--theme-page-bg', colors?.background);
	setVariable('--theme-bg-muted', colors?.backgroundMuted);
	setVariable('--theme-surface', colors?.surface);
	setVariable('--theme-surface-elevated', colors?.surfaceElevated);
	setVariable('--theme-foreground', colors?.foreground);
	setVariable('--theme-foreground-muted', colors?.foregroundMuted);
	setVariable('--theme-foreground-subtle', colors?.foregroundSubtle);
	setVariable('--theme-primary', colors?.primary);
	setVariable('--theme-primary-hover', colors?.primaryHover);
	setVariable('--theme-primary-foreground', colors?.primaryForeground);
	setVariable('--theme-secondary', colors?.secondary);
	setVariable('--theme-accent', colors?.accent);
	setVariable('--theme-accent-foreground', colors?.accentForeground);
	setVariable('--theme-border', colors?.border);
	setVariable('--theme-ring', colors?.ring);
	setVariable('--theme-info', colors?.info);
	setVariable('--theme-link', colors?.link);
	setVariable('--theme-link-hover', colors?.linkHover);
	setVariable('--theme-success', colors?.success);
	setVariable('--theme-warning', colors?.warning);
	setVariable('--theme-danger', colors?.danger);
	setVariable('--theme-brand-magenta', colors?.magenta);
	setVariable('--theme-brand-cyan', colors?.cyan);
	setVariable('--theme-brand-text', colors?.slate);
	setVariable('--theme-brand-surface', colors?.pearl);
	setVariable('--theme-primary-rgb', hexToRgbTriplet(colors?.primary));
	setVariable('--theme-secondary-rgb', hexToRgbTriplet(colors?.secondary));
	setVariable('--theme-foreground-rgb', hexToRgbTriplet(colors?.foreground));

	setVariable('--theme-shadow-sm', shadows?.sm);
	setVariable('--theme-shadow-md', shadows?.md);
	setVariable('--theme-shadow-lg', shadows?.lg);
	setVariable('--theme-shadow-card', shadows?.card);
	setVariable('--theme-brand-glow', shadows?.glow);

	setVariable('--theme-chart-primary', charts?.primary);
	setVariable('--theme-chart-secondary', charts?.secondary);
	setVariable('--theme-chart-tertiary', charts?.tertiary);
	setVariable('--theme-chart-quaternary', charts?.quaternary);
	setVariable('--theme-chart-quinary', charts?.quinary);
	setVariable('--theme-chart-senary', charts?.senary);
	setVariable('--theme-chart-axis', charts?.axis);
	setVariable('--theme-chart-grid', charts?.grid);

	return variables;
};

const mergeCssVariables = (
	...sets: readonly (Partial<ThemeCssVariables> | undefined)[]
): ThemeCssVariables => {
	const variables: ThemeCssVariables = {};

	for (const set of sets) {
		if (!set) continue;
		for (const [name, value] of Object.entries(set)) {
			if (typeof value === 'string') {
				variables[name as `--${string}`] = value;
			}
		}
	}

	return variables;
};

const pikabooCssVariables = {
	'--theme-font-body': 'Helvetica Neue, Helvetica, Arial, sans-serif',
	'--theme-font-heading':
		'"Bricolage Grotesque", Helvetica Neue, Helvetica, Arial, sans-serif',
	'--theme-font-ui': 'Helvetica Neue, Helvetica, Arial, sans-serif',
	'--theme-primary': '#6b3fe4',
	'--theme-primary-hover': '#5b2fd4',
	'--theme-primary-foreground': '#ffffff',
	'--theme-primary-tint': 'rgb(107 63 228 / 0.15)',
	'--theme-secondary': '#8b5cf6',
	'--theme-accent': '#fdff2e',
	'--theme-info': '#2fd7e6',
	'--theme-success': '#10b981',
	'--theme-warning': '#f59e0b',
	'--theme-danger': '#dc2626',
	'--theme-foreground': '#121212',
	'--theme-foreground-muted': '#374151',
	'--theme-foreground-subtle': '#6b7280',
	'--theme-link': '#6b3fe4',
	'--theme-link-hover': '#5b2fd4',
	'--theme-page-bg': '#fffbf5',
	'--theme-bg-muted': '#f5f3ff',
	'--theme-surface': '#ffffff',
	'--theme-surface-elevated': '#ffffff',
	'--theme-border': 'rgb(107 63 228 / 0.2)',
	'--theme-border-strong': 'rgb(107 63 228 / 0.34)',
	'--theme-page-gradient':
		'linear-gradient(135deg, #121212 0%, #351b85 48%, #6b3fe4 100%)',
	'--theme-auth-bg-start': '#f8f7ff',
	'--theme-auth-bg-end': '#ffffff',
	'--theme-nav-surface': '#fffbf5',
	'--theme-primary-rgb': '107 63 228',
	'--theme-secondary-rgb': '139 92 246',
	'--theme-foreground-rgb': '18 18 18',
	'--theme-brand-surface-rgb': '255 251 245',
	'--theme-brand-primary-light-rgb': '139 92 246',
	'--theme-brand-primary-dark-rgb': '91 47 212',
	'--theme-brand-surface': '#fffbf5',
	'--theme-brand-primary': '#6b3fe4',
	'--theme-brand-primary-light': '#8b5cf6',
	'--theme-brand-primary-dark': '#5b2fd4',
	'--theme-brand-text': '#121212',
	'--theme-brand-magenta': '#e03381',
	'--theme-brand-cyan': '#2fd7e6',
	'--theme-brand-glow': 'rgb(107 63 228 / 0.25)',
	'--theme-brand-glow-intense': 'rgb(107 63 228 / 0.4)',
	'--theme-shadow-sm': '0 2px 8px rgb(18 18 18 / 0.04)',
	'--theme-shadow-md': '0 4px 16px rgb(18 18 18 / 0.08)',
	'--theme-shadow-lg': '0 8px 32px rgb(18 18 18 / 0.12)',
	'--theme-shadow-card': '0 2px 12px rgb(107 63 228 / 0.08)',
	'--theme-chart-primary': '#6b3fe4',
	'--theme-chart-secondary': '#8b5cf6',
	'--theme-chart-tertiary': '#e03381',
	'--theme-chart-quaternary': '#2fd7e6',
	'--theme-chart-quinary': '#10b981',
	'--theme-chart-senary': '#f59e0b',
	'--theme-chart-axis': 'rgb(18 18 18 / 0.5)',
	'--theme-chart-grid': 'rgb(107 63 228 / 0.14)',
	'--background': '36 100% 98%',
	'--foreground': '0 0% 7%',
	'--card': '0 0% 100%',
	'--card-foreground': '0 0% 7%',
	'--popover': '0 0% 100%',
	'--popover-foreground': '0 0% 7%',
	'--primary': '257 76% 57%',
	'--primary-foreground': '0 0% 100%',
	'--secondary': '258 90% 96%',
	'--secondary-foreground': '0 0% 7%',
	'--muted': '240 5% 96%',
	'--muted-foreground': '217 11% 35%',
	'--accent': '257 76% 57%',
	'--accent-foreground': '0 0% 100%',
	'--destructive': '0 84% 60%',
	'--destructive-foreground': '0 0% 98%',
	'--border': '257 65% 90%',
	'--input': '257 65% 90%',
	'--ring': '257 76% 57%',
	'--chart-1': '257 76% 57%',
	'--chart-2': '328 73% 53%',
	'--chart-3': '185 78% 54%',
	'--chart-4': '158 64% 42%',
	'--chart-5': '38 92% 50%',
	'--radius': '0.5rem',
} satisfies ThemeCssVariables;

const pikabooDarkCssVariables = {
	...pikabooCssVariables,
	'--theme-primary': '#8b5cf6',
	'--theme-primary-hover': '#a78bfa',
	'--theme-primary-foreground': '#ffffff',
	'--theme-primary-tint': 'rgb(139 92 246 / 0.2)',
	'--theme-secondary': '#2fd7e6',
	'--theme-accent': '#fdff2e',
	'--theme-info': '#2fd7e6',
	'--theme-success': '#34d399',
	'--theme-warning': '#fbbf24',
	'--theme-danger': '#f87171',
	'--theme-foreground': '#ffffff',
	'--theme-foreground-muted': '#d9d4ff',
	'--theme-foreground-subtle': '#a99fd6',
	'--theme-link': '#2fd7e6',
	'--theme-link-hover': '#fdff2e',
	'--theme-page-bg': '#0a0418',
	'--theme-bg-muted': '#160c32',
	'--theme-surface': '#160c32',
	'--theme-surface-elevated': '#211044',
	'--theme-border': 'rgb(255 255 255 / 0.16)',
	'--theme-border-strong': 'rgb(255 255 255 / 0.28)',
	'--theme-page-gradient':
		'linear-gradient(180deg, #0a0418 0%, #160c32 52%, #131213 100%)',
	'--theme-auth-bg-start': '#0a0418',
	'--theme-auth-bg-end': '#160c32',
	'--theme-nav-surface': '#100824',
	'--theme-primary-rgb': '139 92 246',
	'--theme-secondary-rgb': '47 215 230',
	'--theme-foreground-rgb': '255 255 255',
	'--theme-brand-surface-rgb': '10 4 24',
	'--theme-brand-primary-light-rgb': '167 139 250',
	'--theme-brand-primary-dark-rgb': '107 63 228',
	'--theme-brand-surface': '#0a0418',
	'--theme-brand-primary': '#8b5cf6',
	'--theme-brand-primary-light': '#a78bfa',
	'--theme-brand-primary-dark': '#6b3fe4',
	'--theme-brand-text': '#ffffff',
	'--theme-brand-magenta': '#e03381',
	'--theme-brand-cyan': '#2fd7e6',
	'--theme-brand-glow': 'rgb(139 92 246 / 0.4)',
	'--theme-brand-glow-intense': 'rgb(47 215 230 / 0.38)',
	'--theme-shadow-sm': '0 2px 12px rgb(0 0 0 / 0.28)',
	'--theme-shadow-md': '0 14px 36px rgb(0 0 0 / 0.34)',
	'--theme-shadow-lg': '0 26px 70px rgb(0 0 0 / 0.42)',
	'--theme-shadow-card': '0 18px 44px rgb(0 0 0 / 0.28)',
	'--theme-chart-primary': '#8b5cf6',
	'--theme-chart-secondary': '#2fd7e6',
	'--theme-chart-tertiary': '#fdff2e',
	'--theme-chart-quaternary': '#e03381',
	'--theme-chart-quinary': '#34d399',
	'--theme-chart-senary': '#fbbf24',
	'--theme-chart-axis': 'rgb(255 255 255 / 0.56)',
	'--theme-chart-grid': 'rgb(255 255 255 / 0.13)',
	'--background': '260 71% 5%',
	'--foreground': '0 0% 100%',
	'--card': '258 61% 12%',
	'--card-foreground': '0 0% 100%',
	'--popover': '258 61% 12%',
	'--popover-foreground': '0 0% 100%',
	'--primary': '258 90% 66%',
	'--primary-foreground': '0 0% 100%',
	'--secondary': '185 78% 54%',
	'--secondary-foreground': '0 0% 7%',
	'--muted': '258 61% 12%',
	'--muted-foreground': '252 55% 84%',
	'--accent': '61 100% 59%',
	'--accent-foreground': '0 0% 7%',
	'--destructive': '0 91% 71%',
	'--destructive-foreground': '0 0% 7%',
	'--border': '258 44% 28%',
	'--input': '258 44% 28%',
	'--ring': '258 90% 66%',
	'--chart-1': '258 90% 66%',
	'--chart-2': '185 78% 54%',
	'--chart-3': '61 100% 59%',
	'--chart-4': '328 73% 53%',
	'--chart-5': '158 64% 52%',
} satisfies ThemeCssVariables;

const primediaCssVariables = {
	...pikabooCssVariables,
	'--theme-primary': '#2647ed',
	'--theme-primary-hover': '#1f3ed1',
	'--theme-primary-foreground': '#ffffff',
	'--theme-primary-tint': 'rgb(38 71 237 / 0.15)',
	'--theme-secondary': '#123f8a',
	'--theme-accent': '#2647ed',
	'--theme-info': '#2647ed',
	'--theme-success': '#1f7a64',
	'--theme-warning': '#d98708',
	'--theme-danger': '#c62828',
	'--theme-foreground': '#0c2e63',
	'--theme-foreground-muted': '#5a6d8f',
	'--theme-foreground-subtle': '#7c8da8',
	'--theme-link': '#2647ed',
	'--theme-link-hover': '#123f8a',
	'--theme-page-bg': '#f4f6fa',
	'--theme-bg-muted': '#e9eef7',
	'--theme-surface': '#ffffff',
	'--theme-surface-elevated': '#ffffff',
	'--theme-border': 'rgb(12 46 99 / 0.16)',
	'--theme-border-strong': 'rgb(12 46 99 / 0.28)',
	'--theme-page-gradient':
		'linear-gradient(180deg, #f4f6fa 0%, #ffffff 34%, #f6f8fc 100%)',
	'--theme-auth-bg-start': '#eef3fb',
	'--theme-auth-bg-end': '#ffffff',
	'--theme-nav-surface': '#f4f6fa',
	'--theme-primary-rgb': '38 71 237',
	'--theme-secondary-rgb': '18 63 138',
	'--theme-foreground-rgb': '12 46 99',
	'--theme-brand-surface-rgb': '255 255 255',
	'--theme-brand-primary-light-rgb': '109 143 239',
	'--theme-brand-primary-dark-rgb': '18 63 138',
	'--theme-brand-surface': '#ffffff',
	'--theme-brand-primary': '#2647ed',
	'--theme-brand-primary-light': '#6d8fef',
	'--theme-brand-primary-dark': '#123f8a',
	'--theme-brand-text': '#0c2e63',
	'--theme-brand-magenta': '#5a6d8f',
	'--theme-brand-cyan': '#1f7a64',
	'--theme-brand-glow': 'rgb(38 71 237 / 0.22)',
	'--theme-brand-glow-intense': 'rgb(38 71 237 / 0.34)',
	'--theme-shadow-sm': '0 1px 6px rgb(12 46 99 / 0.06)',
	'--theme-shadow-md': '0 6px 16px rgb(12 46 99 / 0.1)',
	'--theme-shadow-lg': '0 12px 28px rgb(12 46 99 / 0.14)',
	'--theme-shadow-card': '0 2px 10px rgb(12 46 99 / 0.08)',
	'--theme-chart-primary': '#2647ed',
	'--theme-chart-secondary': '#123f8a',
	'--theme-chart-tertiary': '#6d8fef',
	'--theme-chart-quaternary': '#5a6d8f',
	'--theme-chart-quinary': '#1f7a64',
	'--theme-chart-senary': '#c62828',
	'--theme-chart-axis': 'rgb(12 46 99 / 0.55)',
	'--theme-chart-grid': 'rgb(38 71 237 / 0.14)',
	'--background': '220 37% 97%',
	'--foreground': '217 78% 22%',
	'--card': '0 0% 100%',
	'--card-foreground': '217 78% 22%',
	'--popover': '0 0% 100%',
	'--popover-foreground': '217 78% 22%',
	'--primary': '230 85% 54%',
	'--primary-foreground': '0 0% 100%',
	'--secondary': '218 77% 31%',
	'--secondary-foreground': '0 0% 100%',
	'--muted': '219 44% 92%',
	'--muted-foreground': '218 23% 46%',
	'--accent': '230 85% 54%',
	'--accent-foreground': '0 0% 100%',
	'--border': '219 33% 88%',
	'--input': '219 33% 88%',
	'--ring': '230 85% 54%',
	'--chart-1': '230 85% 54%',
	'--chart-2': '218 77% 31%',
	'--chart-3': '152 59% 30%',
	'--chart-4': '65 65% 46%',
	'--chart-5': '25 72% 49%',
} satisfies ThemeCssVariables;

const themes = {
	pikaboo: {
		id: 'pikaboo',
		name: 'Pikaboo',
		description: 'Pikaboo tenant theme for the canonical product experience.',
		tenant: 'pikaboo',
		aliases: [],
		copy: {
			productName: 'PIKABOO',
			brandName: 'Pikaboo',
			tenantName: 'Pikaboo',
			reportTitle: 'Campaign Report',
			preparedByLabel: 'Prepared by PIKABOO',
			poweredByLabel: 'Powered by PIKABOO',
		},
		typography: {
			body: pikabooCssVariables['--theme-font-body'],
			heading: pikabooCssVariables['--theme-font-heading'],
			ui: pikabooCssVariables['--theme-font-ui'],
		},
		colors: {
			background: '#fffbf5',
			backgroundMuted: '#f5f3ff',
			surface: '#ffffff',
			surfaceElevated: '#ffffff',
			foreground: '#121212',
			foregroundMuted: '#374151',
			foregroundSubtle: '#6b7280',
			primary: '#6b3fe4',
			primaryHover: '#5b2fd4',
			primaryForeground: '#ffffff',
			secondary: '#8b5cf6',
			accent: '#fdff2e',
			accentForeground: '#121212',
			border: 'rgba(107, 63, 228, 0.20)',
			ring: 'rgba(107, 63, 228, 0.45)',
			info: '#2fd7e6',
			link: '#6b3fe4',
			linkHover: '#5b2fd4',
			success: '#10b981',
			warning: '#f59e0b',
			danger: '#dc2626',
			magenta: '#e03381',
			cyan: '#2fd7e6',
			slate: '#121212',
			pearl: '#fffbf5',
		},
		shadows: {
			sm: pikabooCssVariables['--theme-shadow-sm'],
			md: pikabooCssVariables['--theme-shadow-md'],
			lg: pikabooCssVariables['--theme-shadow-lg'],
			card: pikabooCssVariables['--theme-shadow-card'],
			glow: pikabooCssVariables['--theme-brand-glow'],
		},
		charts: {
			primary: '#6b3fe4',
			secondary: '#8b5cf6',
			tertiary: '#e03381',
			quaternary: '#2fd7e6',
			quinary: '#10b981',
			senary: '#f59e0b',
			axis: 'rgb(18 18 18 / 0.5)',
			grid: 'rgb(107 63 228 / 0.14)',
		},
		cssVariables: pikabooCssVariables,
	},
	'pikaboo-dark': {
		id: 'pikaboo-dark',
		name: 'Pikaboo Dark',
		description:
			'Website-style dark Pikaboo theme for public and future product surfaces.',
		tenant: 'pikaboo',
		aliases: ['dark', 'website-dark', 'pikaboo-website'],
		copy: {
			productName: 'PIKABOO',
			brandName: 'Pikaboo',
			tenantName: 'Pikaboo',
			reportTitle: 'Campaign Report',
			preparedByLabel: 'Prepared by PIKABOO',
			poweredByLabel: 'Powered by PIKABOO',
		},
		typography: {
			body: pikabooDarkCssVariables['--theme-font-body'],
			heading: pikabooDarkCssVariables['--theme-font-heading'],
			ui: pikabooDarkCssVariables['--theme-font-ui'],
		},
		colors: {
			background: '#0a0418',
			backgroundMuted: '#160c32',
			surface: '#160c32',
			surfaceElevated: '#211044',
			foreground: '#ffffff',
			foregroundMuted: '#d9d4ff',
			foregroundSubtle: '#a99fd6',
			primary: '#8b5cf6',
			primaryHover: '#a78bfa',
			primaryForeground: '#ffffff',
			secondary: '#2fd7e6',
			accent: '#fdff2e',
			accentForeground: '#121212',
			border: 'rgba(255, 255, 255, 0.16)',
			ring: 'rgba(139, 92, 246, 0.48)',
			info: '#2fd7e6',
			link: '#2fd7e6',
			linkHover: '#fdff2e',
			success: '#34d399',
			warning: '#fbbf24',
			danger: '#f87171',
			magenta: '#e03381',
			cyan: '#2fd7e6',
			slate: '#ffffff',
			pearl: '#0a0418',
		},
		shadows: {
			sm: pikabooDarkCssVariables['--theme-shadow-sm'],
			md: pikabooDarkCssVariables['--theme-shadow-md'],
			lg: pikabooDarkCssVariables['--theme-shadow-lg'],
			card: pikabooDarkCssVariables['--theme-shadow-card'],
			glow: pikabooDarkCssVariables['--theme-brand-glow'],
		},
		charts: {
			primary: '#8b5cf6',
			secondary: '#2fd7e6',
			tertiary: '#fdff2e',
			quaternary: '#e03381',
			quinary: '#34d399',
			senary: '#fbbf24',
			axis: 'rgb(255 255 255 / 0.56)',
			grid: 'rgb(255 255 255 / 0.13)',
		},
		cssVariables: pikabooDarkCssVariables,
	},
	primedia: {
		id: 'primedia',
		name: 'Primedia',
		description:
			'Primedia tenant theme. Tenant-facing Pikaboo product references use Cortexx.',
		tenant: 'primedia',
		aliases: ['cortexx'],
		copy: {
			productName: 'Cortexx',
			brandName: 'Pikaboo',
			tenantName: 'Primedia',
			reportTitle: 'Primedia Campaign Report',
			preparedByLabel: 'Prepared by Primedia Outdoor',
			poweredByLabel: 'Powered by Cortexx',
		},
		typography: {
			body: primediaCssVariables['--theme-font-body'],
			heading: primediaCssVariables['--theme-font-heading'],
			ui: primediaCssVariables['--theme-font-ui'],
		},
		colors: {
			background: '#f4f6fa',
			backgroundMuted: '#e9eef7',
			surface: '#ffffff',
			surfaceElevated: '#ffffff',
			foreground: '#0c2e63',
			foregroundMuted: '#5a6d8f',
			foregroundSubtle: '#7c8da8',
			primary: '#2647ed',
			primaryHover: '#1f3ed1',
			primaryForeground: '#ffffff',
			secondary: '#123f8a',
			accent: '#2647ed',
			accentForeground: '#ffffff',
			border: 'rgba(12, 46, 99, 0.16)',
			ring: 'rgba(38, 71, 237, 0.38)',
			info: '#2647ed',
			link: '#2647ed',
			linkHover: '#123f8a',
			success: '#1f7a64',
			warning: '#d98708',
			danger: '#c62828',
			magenta: '#5a6d8f',
			cyan: '#1f7a64',
			slate: '#0c2e63',
			pearl: '#ffffff',
		},
		shadows: {
			sm: primediaCssVariables['--theme-shadow-sm'],
			md: primediaCssVariables['--theme-shadow-md'],
			lg: primediaCssVariables['--theme-shadow-lg'],
			card: primediaCssVariables['--theme-shadow-card'],
			glow: primediaCssVariables['--theme-brand-glow'],
		},
		charts: {
			primary: '#2647ed',
			secondary: '#123f8a',
			tertiary: '#6d8fef',
			quaternary: '#5a6d8f',
			quinary: '#1f7a64',
			senary: '#c62828',
			axis: 'rgb(12 46 99 / 0.55)',
			grid: 'rgb(38 71 237 / 0.14)',
		},
		cssVariables: primediaCssVariables,
	},
} satisfies Record<ThemeId, DesignTheme<ThemeId>>;

export const designThemes: Readonly<Record<ThemeId, DesignTheme<ThemeId>>> =
	themes;

export const isDesignTheme = (value: unknown): value is AnyDesignTheme => {
	if (!value || typeof value !== 'object') return false;
	const theme = value as Partial<AnyDesignTheme>;
	return Boolean(
		theme.id &&
			typeof theme.id === 'string' &&
			theme.copy &&
			theme.colors &&
			theme.cssVariables,
	);
};

export const isThemeId = (value: unknown): value is ThemeId =>
	typeof value === 'string' &&
	(themeIds as readonly string[]).includes(value.trim().toLowerCase());

export const resolveThemeId = (themeId?: unknown): ThemeId => {
	if (isDesignTheme(themeId)) {
		return isThemeId(themeId.id) ? themeId.id : defaultThemeId;
	}

	if (typeof themeId !== 'string') return defaultThemeId;

	const normalizedThemeId = themeId.trim().toLowerCase();
	const aliasThemeId = themeIds.find((id) =>
		designThemes[id].aliases.includes(normalizedThemeId),
	);
	if (aliasThemeId) return aliasThemeId;
	return isThemeId(normalizedThemeId) ? normalizedThemeId : defaultThemeId;
};

export const getThemeById = (themeId?: unknown): DesignTheme =>
	designThemes[resolveThemeId(themeId)];

export const resolveTheme = (theme?: unknown): AnyDesignTheme =>
	isDesignTheme(theme) ? theme : getThemeById(theme);

export const getThemeCopy = (themeId?: unknown): ThemeCopyTokens =>
	resolveTheme(themeId).copy;

export const getProductName = (themeId?: unknown): string =>
	getThemeCopy(themeId).productName;

export const getThemeCssVariables = (themeId?: unknown): ThemeCssVariables => ({
	...resolveTheme(themeId).cssVariables,
});

export const getThemeDataAttributes = (
	themeId?: unknown,
): {
	'data-brand': 'pikaboo';
	'data-theme': string;
} => ({
	'data-brand': 'pikaboo',
	'data-theme': resolveTheme(themeId).id,
});

export const applyThemeToElement = (
	element: HTMLElement,
	themeId?: unknown,
): AnyDesignTheme => {
	const theme = resolveTheme(themeId);
	element.dataset.brand = 'pikaboo';
	element.dataset.theme = theme.id;

	for (const [variable, value] of Object.entries(theme.cssVariables)) {
		element.style.setProperty(variable, value);
	}

	return theme;
};

export const createDesignTheme = <TId extends string>({
	aliases = [],
	baseTheme = defaultThemeId,
	charts,
	colors,
	copy,
	cssVariables,
	description,
	id,
	name,
	shadows,
	tenant,
	typography,
}: CreateDesignThemeOptions<TId>): DesignTheme<TId> => {
	const base = resolveTheme(baseTheme);
	const displayName = name ?? id;

	return {
		...base,
		id,
		name: displayName,
		description: description ?? `${displayName} tenant theme.`,
		tenant: tenant ?? id,
		aliases: [...aliases],
		copy: {
			...base.copy,
			...copy,
		},
		typography: {
			...base.typography,
			...typography,
		},
		colors: {
			...base.colors,
			...colors,
		},
		shadows: {
			...base.shadows,
			...shadows,
		},
		charts: {
			...base.charts,
			...charts,
		},
		cssVariables: mergeCssVariables(
			base.cssVariables,
			cssVariablesFromTokenOverrides({
				charts,
				colors,
				shadows,
				typography,
			}),
			cssVariables,
		),
	};
};
