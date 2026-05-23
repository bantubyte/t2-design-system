import type { ChartPalette, ChartPaletteName } from './types';

const defaultCategorical = [
	'#6b3fe4',
	'#2f80ed',
	'#e03381',
	'#00a8a8',
	'#1f9d63',
	'#d98708',
	'#8b5cf6',
	'#cf3f2f',
	'#5a6d8f',
	'#7c6f00',
	'#0f7a8a',
	'#a855f7',
] as const;

export const colorblindCategorical = [
	'#0072b2',
	'#e69f00',
	'#009e73',
	'#cc79a7',
	'#56b4e9',
	'#d55e00',
	'#f0e442',
	'#000000',
] as const;

const sequential = [
	'#f7fbff',
	'#deebf7',
	'#c6dbef',
	'#9ecae1',
	'#6baed6',
	'#4292c6',
	'#2171b5',
	'#08519c',
	'#08306b',
] as const;

const diverging = [
	'#b91c1c',
	'#dc2626',
	'#f87171',
	'#fecaca',
	'#f8fafc',
	'#bbf7d0',
	'#4ade80',
	'#16a34a',
	'#166534',
] as const;

export const defaultChartPalette: ChartPalette = {
	axis: 'rgb(18 18 18 / 0.56)',
	categorical: defaultCategorical,
	diverging,
	grid: 'rgb(107 63 228 / 0.14)',
	name: 'default',
	sequential,
	tooltipBackground: '#121212',
	tooltipForeground: '#ffffff',
};

const paletteMap: Record<ChartPaletteName, ChartPalette> = {
	default: defaultChartPalette,
	categorical12: {
		...defaultChartPalette,
		name: 'categorical12',
	},
	colorblind: {
		...defaultChartPalette,
		categorical: colorblindCategorical,
		name: 'colorblind',
	},
	diverging: {
		...defaultChartPalette,
		categorical: diverging,
		name: 'diverging',
	},
	sequential: {
		...defaultChartPalette,
		categorical: sequential,
		name: 'sequential',
	},
};

export const chartStrokePatterns = [
	'none',
	'6 4',
	'2 4',
	'10 4 2 4',
	'1 5',
] as const;

export const resolvePalette = (
	name: ChartPaletteName = 'default',
	overrides: Partial<Omit<ChartPalette, 'name'>> = {},
): ChartPalette => {
	const base = paletteMap[name] ?? defaultChartPalette;
	return {
		...base,
		...overrides,
		categorical: overrides.categorical ?? base.categorical,
		diverging: overrides.diverging ?? base.diverging,
		name,
		sequential: overrides.sequential ?? base.sequential,
	};
};

export const getSeriesColor = (
	palette: ChartPalette,
	index: number,
	explicitColor?: string,
): string => {
	if (explicitColor) return explicitColor;
	return palette.categorical[index % palette.categorical.length] ?? '#6b3fe4';
};

export const getSeriesStrokeDasharray = (
	index: number,
	explicitPattern?: string,
): string | undefined => {
	if (explicitPattern) return explicitPattern;
	const pattern = chartStrokePatterns[index % chartStrokePatterns.length];
	return pattern === 'none' ? undefined : pattern;
};

export const paletteFromCssVariables = (
	readVariable: (name: string) => string | undefined,
): Partial<Omit<ChartPalette, 'name'>> => {
	const categorical = Array.from({ length: 12 }, (_, index) =>
		readVariable(`--theme-chart-cat-${index + 1}`),
	).filter((value): value is string => Boolean(value));
	const sequentialValues = Array.from({ length: 9 }, (_, index) =>
		readVariable(`--theme-chart-seq-${index + 1}`),
	).filter((value): value is string => Boolean(value));
	const divergingValues = [
		readVariable('--theme-chart-div-neg-4'),
		readVariable('--theme-chart-div-neg-3'),
		readVariable('--theme-chart-div-neg-2'),
		readVariable('--theme-chart-div-neg-1'),
		readVariable('--theme-chart-div-neutral'),
		readVariable('--theme-chart-div-pos-1'),
		readVariable('--theme-chart-div-pos-2'),
		readVariable('--theme-chart-div-pos-3'),
		readVariable('--theme-chart-div-pos-4'),
	].filter((value): value is string => Boolean(value));

	return {
		axis: readVariable('--theme-chart-axis'),
		categorical: categorical.length ? categorical : undefined,
		diverging: divergingValues.length ? divergingValues : undefined,
		grid: readVariable('--theme-chart-grid'),
		sequential: sequentialValues.length ? sequentialValues : undefined,
		tooltipBackground: readVariable('--theme-chart-tooltip-bg'),
		tooltipForeground: readVariable('--theme-chart-tooltip-fg'),
	};
};
