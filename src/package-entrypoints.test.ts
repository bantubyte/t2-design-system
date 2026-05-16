import { describe, expect, it } from 'vitest';
import { AuthSignUpScreen } from './auth';
import {
	ReportComparisonBlock,
	ReportMetricRibbon,
	ReportMetricTile,
} from './report';
import pikabooTailwindPreset from './tailwind';
import { createDesignTheme, ThemeProvider, ThemeSwitcher } from './theme';

describe('package entrypoints', () => {
	it('exports report components through the report subpath entry', () => {
		expect(ReportComparisonBlock).toBeTypeOf('function');
		expect(ReportMetricRibbon).toBeTypeOf('function');
		expect(ReportMetricTile).toBeTypeOf('function');
	});

	it('exports theme helpers and providers through the theme subpath entry', () => {
		expect(createDesignTheme).toBeTypeOf('function');
		expect(ThemeProvider).toBeTypeOf('function');
		expect(ThemeSwitcher).toBeTypeOf('function');
	});

	it('exports a Tailwind preset through the tailwind subpath entry', () => {
		expect(pikabooTailwindPreset.theme?.extend?.colors?.theme).toMatchObject({
			primary: 'var(--theme-primary)',
			surface: 'var(--theme-surface)',
		});
	});

	it('exports auth surfaces through the auth subpath entry', () => {
		expect(AuthSignUpScreen).toBeTypeOf('function');
	});
});
