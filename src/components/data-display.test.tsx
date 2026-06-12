import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	ChartCard,
	DataTable,
	InsightCard,
	MetricCard,
	StatGrid,
} from './data-display';

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

describe('MetricCard', () => {
	it('renders label, value, and change', () => {
		const container = render(
			<MetricCard change="+12%" label="Users" status="success" value="1,200" />,
		);
		expect(
			container.querySelector('.pds-metric-card__label')?.textContent,
		).toBe('Users');
		expect(
			container.querySelector('.pds-metric-card__value')?.textContent,
		).toBe('1,200');
		expect(container.querySelector('.pds-badge')?.textContent).toBe('+12%');
		expect(
			container
				.querySelector('.pds-badge')
				?.classList.contains('pds-badge--success'),
		).toBe(true);
	});
});

describe('StatGrid', () => {
	it('renders grid with correct columns', () => {
		const container = render(<StatGrid columns={3}>Content</StatGrid>);
		const el = container.querySelector('.pds-stat-grid');
		expect(el?.classList.contains('pds-stat-grid--3')).toBe(true);
	});
});

describe('DataTable', () => {
	it('renders table with columns and rows', () => {
		const columns = [
			{ key: 'name', header: 'Name' },
			{ key: 'age', header: 'Age', align: 'right' as const },
		];
		const rows = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 },
		];
		const container = render(
			<DataTable columns={columns} getRowKey={(row) => row.name} rows={rows} />,
		);

		const headers = container.querySelectorAll('th');
		expect(headers.length).toBe(2);
		expect(headers[0].textContent).toBe('Name');

		const cells = container.querySelectorAll('td');
		expect(cells.length).toBe(4);
		expect(cells[0].textContent).toBe('John');
		expect(cells[1].textContent).toBe('30');
	});

	it('renders empty label when no rows', () => {
		const columns = [{ key: 'id', header: 'ID' }];
		const container = render(
			<DataTable columns={columns} emptyLabel="Empty" rows={[]} />,
		);
		expect(container.querySelector('.pds-data-table__empty')?.textContent).toBe(
			'Empty',
		);
	});
});

describe('ChartCard and InsightCard', () => {
	it('renders ChartCard', () => {
		const data = [
			{ label: 'A', value: 10 },
			{ label: 'B', value: 20 },
		];
		const container = render(<ChartCard data={data} title="Chart" />);
		expect(container.querySelector('.pds-card__title')?.textContent).toBe(
			'Chart',
		);
		expect(container.querySelectorAll('.pds-chart-card__row').length).toBe(2);
	});

	it('renders InsightCard', () => {
		const container = render(
			<InsightCard
				confidence="High"
				evidence={['Item 1', 'Item 2']}
				title="Insight"
			>
				Content
			</InsightCard>,
		);
		expect(container.querySelector('.pds-card__title')?.textContent).toBe(
			'Insight',
		);
		expect(container.querySelector('.pds-badge')?.textContent).toBe('High');
		expect(container.querySelectorAll('li').length).toBe(2);
	});
});
