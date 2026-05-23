import { describe, expect, it } from 'vitest';
import {
	colorblindCategorical,
	getSeriesColor,
	getSeriesStrokeDasharray,
	paletteFromCssVariables,
	resolvePalette,
} from './palette';

describe('chart palette contracts', () => {
	it('resolves the default, categorical, sequential, diverging, and colorblind palettes', () => {
		expect(resolvePalette().categorical).toHaveLength(12);
		expect(resolvePalette('categorical12').categorical).toHaveLength(12);
		expect(resolvePalette('sequential').categorical).toHaveLength(9);
		expect(resolvePalette('diverging').categorical).toHaveLength(9);
		expect(resolvePalette('colorblind').categorical).toEqual(
			colorblindCategorical,
		);
	});

	it('uses explicit series colors first and otherwise cycles through the palette', () => {
		const palette = resolvePalette('colorblind');
		expect(getSeriesColor(palette, 0)).toBe(colorblindCategorical[0]);
		expect(getSeriesColor(palette, colorblindCategorical.length)).toBe(
			colorblindCategorical[0],
		);
		expect(getSeriesColor(palette, 0, '#123456')).toBe('#123456');
	});

	it('adds non-color stroke patterns after the first series', () => {
		expect(getSeriesStrokeDasharray(0)).toBeUndefined();
		expect(getSeriesStrokeDasharray(1)).toBe('6 4');
		expect(getSeriesStrokeDasharray(4)).toBe('1 5');
		expect(getSeriesStrokeDasharray(2, '3 3')).toBe('3 3');
	});

	it('builds runtime palettes from CSS variables with sparse fallbacks', () => {
		const variables = new Map<string, string>([
			['--theme-chart-cat-1', '#111111'],
			['--theme-chart-cat-2', '#222222'],
			['--theme-chart-seq-1', '#eeeeee'],
			['--theme-chart-div-neutral', '#ffffff'],
			['--theme-chart-tooltip-bg', '#000000'],
		]);
		const palette = paletteFromCssVariables((name) => variables.get(name));
		expect(palette.categorical).toEqual(['#111111', '#222222']);
		expect(palette.sequential).toEqual(['#eeeeee']);
		expect(palette.diverging).toEqual(['#ffffff']);
		expect(palette.tooltipBackground).toBe('#000000');
	});
});
