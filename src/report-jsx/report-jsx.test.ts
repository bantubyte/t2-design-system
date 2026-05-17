import {
	RawReportComparisonBlock,
	RawReportEvidenceList,
	RawReportMetricTile,
	renderRawJsxToDom,
	renderRawJsxToHtml,
} from './index';

describe('report-jsx raw renderer contract', () => {
	it('renders report components to HTML without React', () => {
		const html = renderRawJsxToHtml(
			RawReportMetricTile({
				id: 'reach',
				label: 'Reach',
				value: '3.3M',
			}),
		);

		expect(html).toContain('pds-report-metric-tile');
		expect(html).toContain('Reach');
		expect(html).toContain('3.3M');
	});

	it('attaches raw DOM event handlers for metric selection', () => {
		const selectedIds: (string | undefined)[] = [];
		const dom = renderRawJsxToDom(
			RawReportMetricTile({
				id: 'reach',
				label: 'Reach',
				onSelect: (id) => selectedIds.push(id),
				value: '3.3M',
			}),
		);
		const root = dom as HTMLElement;
		const tile = root.matches('[role="button"]')
			? root
			: root.querySelector('[role="button"]');

		tile?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		tile?.dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
		);

		expect(selectedIds).toEqual(['reach', 'reach']);
	});

	it('uses report-core models for comparison and evidence behavior', () => {
		const winners: string[] = [];
		const expandedIds: string[] = [];
		const comparison = renderRawJsxToDom(
			RawReportComparisonBlock({
				left: { id: 'a', label: 'Audience A' },
				metrics: [{ label: 'Reach', leftValue: 10, rightValue: 20 }],
				onWinnerChange: (winner) => winners.push(winner),
				right: { id: 'b', label: 'Audience B' },
			}),
		);
		const evidence = renderRawJsxToDom(
			RawReportEvidenceList({
				expandedItemId: 'audience',
				items: [
					{
						detail: 'Audience fit is above plan.',
						id: 'audience',
						title: 'Audience',
					},
					{
						detail: 'Pacing is below benchmark.',
						id: 'pacing',
						title: 'Pacing',
					},
				],
				onExpandedItemChange: (itemId) => expandedIds.push(itemId),
			}),
		);

		(comparison as HTMLElement)
			.querySelector('.pds-report-comparison__entity')
			?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		(evidence as HTMLElement)
			.querySelectorAll('.pds-report-evidence-list__item button')[1]
			?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

		expect(winners).toEqual(['left']);
		expect(expandedIds).toEqual(['pacing']);
		expect((comparison as HTMLElement).textContent).toContain(
			'Audience B leads',
		);
		expect((evidence as HTMLElement).textContent).toContain(
			'Audience fit is above plan.',
		);
	});
});
