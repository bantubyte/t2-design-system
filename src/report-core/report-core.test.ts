import {
	createReportComparisonModel,
	createReportEvidenceModel,
	createReportPlacementTableModel,
	createReportRankedListModel,
	createReportTourModel,
	reduceReportEvidenceState,
	reduceReportTourState,
} from './index';

describe('report-core contracts', () => {
	it('derives comparison winners and normalized metric bars without React', () => {
		const model = createReportComparisonModel({
			left: { id: 'a', label: 'Audience A' },
			metrics: [
				{ label: 'Reach', leftValue: 10, rightValue: 20 },
				{ label: 'Cost', leftValue: 9, rightValue: 3, winner: 'right' },
				{ label: 'Frequency', leftValue: 7, rightValue: 7 },
			],
			right: { id: 'b', label: 'Audience B' },
		});

		expect(model.winner).toBe('right');
		expect(model.entities).toEqual([
			expect.objectContaining({ id: 'a', selected: false, side: 'left' }),
			expect.objectContaining({ id: 'b', selected: true, side: 'right' }),
		]);
		expect(model.metrics.map((metric) => metric.winner)).toEqual([
			'right',
			'right',
			'tie',
		]);
		expect(model.metrics[0]?.leftPercent).toBe(50);
		expect(model.metrics[0]?.rightPercent).toBe(100);
	});

	it('keeps evidence expansion as a framework-neutral reducer', () => {
		const items = [
			{ id: 'audience', title: 'Audience evidence' },
			{ id: 'pacing', title: 'Pacing evidence' },
		];

		const expanded = reduceReportEvidenceState(
			{ expandedItemId: 'audience' },
			{ itemId: 'pacing', type: 'toggle' },
		);
		const collapsed = reduceReportEvidenceState(expanded, {
			itemId: 'pacing',
			type: 'toggle',
		});
		const model = createReportEvidenceModel(items, expanded);

		expect(expanded.expandedItemId).toBe('pacing');
		expect(collapsed.expandedItemId).toBeUndefined();
		expect(model.items.map((item) => [item.id, item.expanded])).toEqual([
			['audience', false],
			['pacing', true],
		]);
	});

	it('clamps tour step navigation and reports completion state', () => {
		const steps = [
			{ body: 'One body', id: 'one', title: 'One' },
			{ body: 'Two body', id: 'two', title: 'Two' },
		];

		const first = createReportTourModel(steps, { stepIndex: -4 });
		const lastState = reduceReportTourState(
			{ stepIndex: 0 },
			{ type: 'next' },
			{ stepCount: steps.length },
		);
		const last = createReportTourModel(steps, lastState);
		const stillLast = reduceReportTourState(
			lastState,
			{ type: 'next' },
			{ stepCount: steps.length },
		);

		expect(first.activeStep?.id).toBe('one');
		expect(first.progressPercent).toBe(50);
		expect(last.activeStep?.id).toBe('two');
		expect(last.isLast).toBe(true);
		expect(stillLast.stepIndex).toBe(1);
	});

	it('normalizes ranked lists and placement pacing consistently', () => {
		const ranked = createReportRankedListModel([
			{ id: 'reach', label: 'Reach', value: 50 },
			{ id: 'vac', label: 'VAC', value: 200 },
		]);
		const placements = createReportPlacementTableModel(
			[
				{
					code: 'SPEC/1',
					id: 'spec-1',
					name: 'Pretoria',
					pacing: 0.4,
					value: '40k',
				},
				{
					code: 'SPEC/2',
					id: 'spec-2',
					name: 'Cape Town',
					pacing: 2,
					value: '20k',
				},
			],
			{ selectedRowId: 'spec-1', selectable: true },
		);

		expect(ranked.items.map((item) => item.percent)).toEqual([25, 100]);
		expect(placements.rows[0]).toEqual(
			expect.objectContaining({
				key: 'spec-1',
				pacingPercent: 40,
				selectable: true,
				selected: true,
			}),
		);
		expect(placements.rows[1]?.pacingPercent).toBe(120);
	});
});
