import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BarList } from './bar-list';
import { CategoryBar } from './category-bar';
import { KpiCard } from './kpi-card';
import { Sparkline } from './sparkline';

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

describe('chart component accessibility contracts', () => {
	it('renders sparkline SVG paths inside an accessible chart wrapper', () => {
		const container = render(
			<Sparkline
				ariaLabel="Reach trend"
				forecast={[2, 3, 4, 5]}
				values={[1, 4, 3, 8]}
			/>,
		);

		expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
			'Reach trend',
		);
		expect(container.querySelectorAll('path')).toHaveLength(2);
	});

	it('renders a hidden data table fallback for ranked bar lists', () => {
		const container = render(
			<BarList
				ariaLabel="Top regions"
				items={[
					{ label: 'Gauteng', value: 42 },
					{ label: 'Western Cape', value: 31 },
				]}
			/>,
		);

		expect(container.querySelector('.pds-visually-hidden table, table.pds-visually-hidden')).toBeTruthy();
		expect(container.textContent).toContain('Gauteng');
	});

	it('renders KPI and category primitives without relying on chart colour alone', () => {
		const container = render(
			<div>
				<KpiCard delta="+8%" label="Reach" value="2.4M" />
				<CategoryBar
					ariaLabel="Audience mix"
					segments={[
						{ label: 'Commuters', value: 60 },
						{ label: 'Retail', value: 40 },
					]}
				/>
			</div>,
		);

		expect(container.textContent).toContain('Reach');
		expect(container.textContent).toContain('Commuters');
		expect(container.textContent).toContain('Retail');
	});
});
