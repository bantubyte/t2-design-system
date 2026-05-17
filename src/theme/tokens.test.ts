import { describe, expect, it } from 'vitest';
import {
	createDesignTheme,
	defaultThemeId,
	getProductName,
	getThemeById,
	getThemeCssVariables,
	getThemeDataAttributes,
	isDesignTheme,
	resolveTheme,
	resolveThemeId,
	themeIds,
} from './tokens';

describe('theme contract', () => {
	it('uses Pikaboo as the default brand theme and exposes Primedia as a tenant theme', () => {
		expect(defaultThemeId).toBe('pikaboo');
		expect(themeIds).toEqual(['pikaboo', 'pikaboo-dark', 'primedia']);
	});

	it('uses Cortexx as the Primedia-facing product name without adding a Cortexx theme', () => {
		expect(resolveThemeId('cortexx')).toBe('primedia');
		expect(getThemeById('pikaboo')).toMatchObject({
			id: 'pikaboo',
			tenant: 'pikaboo',
			copy: {
				productName: 'PIKABOO',
			},
		});
		expect(getThemeById('primedia')).toMatchObject({
			id: 'primedia',
			tenant: 'primedia',
			copy: {
				productName: 'Cortexx',
			},
		});
		expect(getProductName('cortexx')).toBe('Cortexx');
	});

	it('falls back to Pikaboo for unknown theme ids', () => {
		expect(resolveThemeId('missing-tenant')).toBe('pikaboo');
		expect(getThemeById('missing-tenant').id).toBe('pikaboo');
	});

	it('exports CSS variables compatible with the marketing app theme contract', () => {
		expect(getThemeCssVariables('pikaboo')).toMatchObject({
			'--theme-primary': '#6b3fe4',
			'--theme-accent': '#fdff2e',
			'--theme-page-bg': '#fffbf5',
		});
		expect(getThemeCssVariables('pikaboo-dark')).toMatchObject({
			'--theme-page-bg': '#0a0418',
			'--theme-surface': '#160c32',
			'--theme-foreground': '#ffffff',
		});
		expect(getThemeCssVariables('primedia')).toMatchObject({
			'--theme-primary': '#2647ed',
			'--theme-secondary': '#123f8a',
			'--theme-page-bg': '#f4f6fa',
		});
	});

	it('marks every scoped theme as part of the Pikaboo brand system', () => {
		expect(getThemeDataAttributes('primedia')).toEqual({
			'data-brand': 'pikaboo',
			'data-theme': 'primedia',
		});
	});

	it('can create and resolve a custom tenant theme from an existing base theme', () => {
		const demoTheme = createDesignTheme({
			id: 'demo',
			baseTheme: 'primedia',
			copy: {
				productName: 'Demo Intelligence',
				poweredByLabel: 'Powered by Demo Intelligence',
			},
			colors: {
				primary: '#123456',
				secondary: '#654321',
			},
		});

		expect(isDesignTheme(demoTheme)).toBe(true);
		expect(resolveTheme(demoTheme).id).toBe('demo');
		expect(getThemeDataAttributes(demoTheme)).toEqual({
			'data-brand': 'pikaboo',
			'data-theme': 'demo',
		});
		expect(getProductName(demoTheme)).toBe('Demo Intelligence');
		expect(getThemeCssVariables(demoTheme)).toMatchObject({
			'--theme-primary': '#123456',
			'--theme-primary-rgb': '18 52 86',
			'--theme-secondary': '#654321',
		});
	});
});
