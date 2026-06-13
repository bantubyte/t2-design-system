import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	CampaignsListPageLoading,
	DashboardCompanySelectorSkeleton,
	DashboardInsightsPanelSkeleton,
	DashboardMetricCardsSkeleton,
	DashboardPageLoading,
	DashboardPlacementsCardSkeleton,
	DashboardTopFilterBarSkeleton,
} from './dashboard';

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

describe('Dashboard components', () => {
	it('renders DashboardMetricCardsSkeleton', () => {
		const container = render(<DashboardMetricCardsSkeleton />);
		expect(container.querySelectorAll('.pds-card').length).toBe(6);
	});

	it('renders DashboardPlacementsCardSkeleton', () => {
		const container = render(<DashboardPlacementsCardSkeleton />);
		expect(container.textContent).toBeDefined();
	});

	it('renders DashboardInsightsPanelSkeleton', () => {
		const container = render(<DashboardInsightsPanelSkeleton />);
		expect(container.textContent).toContain('Insights');
	});

	it('renders DashboardCompanySelectorSkeleton', () => {
		const container = render(<DashboardCompanySelectorSkeleton />);
		expect(container.textContent).toBeDefined();
	});

	it('renders DashboardTopFilterBarSkeleton', () => {
		const container = render(<DashboardTopFilterBarSkeleton />);
		expect(container.textContent).toContain('Select Campaign');
	});

	it('renders DashboardPageLoading', () => {
		const container = render(<DashboardPageLoading />);
		expect(container.textContent).toContain('Select Campaign');
		expect(container.textContent).toContain('Insights');
	});

	it('renders CampaignsListPageLoading', () => {
		const container = render(<CampaignsListPageLoading />);
		expect(container.textContent).toBeDefined();
	});
});
