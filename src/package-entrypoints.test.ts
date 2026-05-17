import { describe, expect, it } from 'vitest';
import {
	DonationPanel,
	HelpCenter,
	PageHero,
	PageTemplate,
	PaymentForm,
	SignupPanel,
} from '.';
import { AuthAccessScreen, AuthSignUpScreen } from './auth';
import { createAuthAccessModel } from './auth-core';
import { RawAuthAccessScreen, renderRawJsxToHtml } from './auth-jsx';
import { jsx as authJsx } from './auth-jsx/jsx-runtime';
import { AuthLoginScreen } from './react/auth';
import { ReportEvidenceList as ReactReportEvidenceList } from './react/report';
import {
	ReportComparisonBlock,
	ReportMetricRibbon,
	ReportMetricTile,
} from './report';
import { createReportComparisonModel } from './report-core';
import { RawReportMetricTile } from './report-jsx';
import { jsx as reportJsx } from './report-jsx/jsx-runtime';
import pikabooTailwindPreset from './tailwind';
import { createDesignTheme, ThemeProvider, ThemeSwitcher } from './theme';

describe('package entrypoints', () => {
	it('exports report components through the report subpath entry', () => {
		expect(ReportComparisonBlock).toBeTypeOf('function');
		expect(ReportMetricRibbon).toBeTypeOf('function');
		expect(ReportMetricTile).toBeTypeOf('function');
	});

	it('exports report core, raw JSX, and explicit React report layers', () => {
		expect(createReportComparisonModel).toBeTypeOf('function');
		expect(RawReportMetricTile).toBeTypeOf('function');
		expect(reportJsx).toBeTypeOf('function');
		expect(ReactReportEvidenceList).toBeTypeOf('function');
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
		expect(AuthAccessScreen).toBeTypeOf('function');
		expect(AuthSignUpScreen).toBeTypeOf('function');
	});

	it('exports auth core, raw JSX, and explicit React auth layers', () => {
		expect(createAuthAccessModel).toBeTypeOf('function');
		expect(RawAuthAccessScreen).toBeTypeOf('function');
		expect(renderRawJsxToHtml).toBeTypeOf('function');
		expect(authJsx).toBeTypeOf('function');
		expect(AuthLoginScreen).toBeTypeOf('function');
	});

	it('exports support and payment patterns through the root entry', () => {
		expect(HelpCenter).toBeTypeOf('function');
		expect(PaymentForm).toBeTypeOf('function');
	});

	it('exports page block components through the root entry', () => {
		expect(PageTemplate).toBeTypeOf('function');
		expect(PageHero).toBeTypeOf('function');
		expect(DonationPanel).toBeTypeOf('function');
		expect(SignupPanel).toBeTypeOf('function');
	});
});
