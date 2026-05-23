import { describe, expect, it } from 'vitest';
import { createChartDataTable, createChartTableModel } from './a11y-data-table';

describe('chart a11y data table', () => {
	it('creates a framework-neutral table model from chart data', () => {
		const model = createChartTableModel(
			[
				{ month: 'Jan', reach: 1200 },
				{ month: 'Feb', reach: 1400 },
			],
			[
				{ header: 'Month', key: 'month' },
				{
					format: (value) => `${value} people`,
					header: 'Reach',
					key: 'reach',
				},
			],
			'Campaign reach',
		);
		expect(model.caption).toBe('Campaign reach');
		expect(model.rows[1]).toEqual(['Feb', '1400 people']);
	});

	it('escapes generated HTML table output', () => {
		const html = createChartDataTable(
			[{ label: '<script>', value: 1 }],
			[
				{ header: 'Label', key: 'label' },
				{ header: 'Value', key: 'value' },
			],
			'Unsafe <caption>',
		);
		expect(html).toContain('&lt;script&gt;');
		expect(html).toContain('Unsafe &lt;caption&gt;');
	});
});
