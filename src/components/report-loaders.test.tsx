import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	ReportChartLoadingBlock,
	ReportMetricRibbonLoading,
	ReportPageLoadingState,
	ReportSectionLoadingState,
} from './report';

(
	globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: Root[] = [];
const mountedContainers: HTMLElement[] = [];

const render = (ui: ReactNode) => {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);
	mountedRoots.push(root);
	mountedContainers.push(container);

	act(() => {
		root.render(ui);
	});

	return container;
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('report loading states', () => {
	it('renders animated metric and chart loading blocks', () => {
		const container = render(
			<div>
				<ReportMetricRibbonLoading count={7} motion="pulse" />
				<ReportChartLoadingBlock rows={5} title="Reach" variant="line" />
			</div>,
		);

		expect(
			container.querySelector('.pds-report-metric-ribbon--loading'),
		).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-report-metric-tile-loading'),
		).toHaveLength(7);
		expect(
			container.querySelector('.pds-report-chart-loading--line'),
		).toBeTruthy();
		expect(container.textContent).toContain('Reach');
	});

	it('renders section and full page report loaders with realistic report scaffolding', () => {
		const container = render(
			<ReportPageLoadingState
				chartCount={3}
				metricCount={6}
				sectionCount={2}
				title="Enhanced Ads Reporting"
			/>,
		);

		expect(container.querySelector('.pds-report-page-loader')).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-report-section-loader'),
		).toHaveLength(2);
		expect(
			container.querySelectorAll('.pds-report-metric-tile-loading'),
		).toHaveLength(6);
		expect(
			container.querySelectorAll('.pds-report-chart-loading'),
		).toHaveLength(3);
		expect(container.textContent).toContain('Enhanced Ads Reporting');
	});

	it('supports standalone report section loading states', () => {
		const container = render(
			<ReportSectionLoadingState chartCount={2} title="Performance Trends" />,
		);

		expect(container.querySelector('.pds-report-section-loader')).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-report-chart-loading'),
		).toHaveLength(2);
		expect(container.textContent).toContain('Performance Trends');
	});
});
