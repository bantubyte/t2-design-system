import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	ReportComparisonBlock,
	ReportEvidenceList,
	ReportMetricTile,
	ReportPlacementTable,
	ReportTourCallout,
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

const click = (element: Element | null) => {
	if (!element) {
		throw new Error('Element not found for click');
	}
	act(() => {
		element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
};

const keyDown = (element: Element | null, key: string) => {
	if (!element) {
		throw new Error('Element not found for keydown');
	}
	act(() => {
		element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
	});
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('report component interactions', () => {
	it('selects metric tiles by click and keyboard activation', () => {
		const selectedIds: (string | undefined)[] = [];
		const container = render(
			<ReportMetricTile
				id="reach"
				label="Reach"
				onSelect={(id) => selectedIds.push(id)}
				value="3.3M"
			/>,
		);
		const tile = container.querySelector('[role="button"]');

		click(tile);
		keyDown(tile, 'Enter');
		keyDown(tile, ' ');

		expect(selectedIds).toEqual(['reach', 'reach', 'reach']);
	});

	it('walks report tour steps and fires completion and skip callbacks', () => {
		const stepChanges: string[] = [];
		let completed = 0;
		let skipped = 0;
		const container = render(
			<ReportTourCallout
				onComplete={() => {
					completed += 1;
				}}
				onSkip={() => {
					skipped += 1;
				}}
				onStepChange={(_, step) => stepChanges.push(step.id)}
				steps={[
					{ body: 'First body', id: 'first', title: 'First' },
					{ body: 'Second body', id: 'second', title: 'Second' },
				]}
			/>,
		);

		click(
			container.querySelector(
				'.pds-report-tour-callout__actions button:last-child',
			),
		);
		click(
			container.querySelector(
				'.pds-report-tour-callout__actions button:last-child',
			),
		);
		click(container.querySelector('.pds-report-tour-callout__topline button'));

		expect(stepChanges).toEqual(['second']);
		expect(completed).toBe(1);
		expect(skipped).toBe(1);
	});

	it('expands evidence items and reports the active item id', () => {
		const expandedIds: string[] = [];
		const container = render(
			<ReportEvidenceList
				items={[
					{
						detail: 'Audience fit is above plan.',
						id: 'audience',
						title: 'Audience evidence',
					},
					{
						detail: 'Pacing is below the benchmark.',
						id: 'pacing',
						title: 'Pacing evidence',
					},
				]}
				onExpandedItemChange={(itemId) => expandedIds.push(itemId)}
			/>,
		);

		click(
			container.querySelectorAll('.pds-report-evidence-list__item button')[1],
		);

		expect(expandedIds).toEqual(['pacing']);
		expect(container.textContent).toContain('Pacing is below the benchmark.');
	});

	it('lets users override an A/B comparison winner', () => {
		const winners: string[] = [];
		const container = render(
			<ReportComparisonBlock
				left={{ id: 'a', label: 'Audience A' }}
				metrics={[
					{
						label: 'Reach',
						leftValue: 10,
						rightValue: 20,
					},
				]}
				onWinnerChange={(winner) => winners.push(winner)}
				right={{ id: 'b', label: 'Audience B' }}
			/>,
		);

		click(container.querySelector('.pds-report-comparison__entity'));

		expect(winners).toEqual(['left']);
		expect(container.textContent).toContain('Audience A leads');
	});

	it('makes placement table rows selectable by click and keyboard', () => {
		const selectedRows: string[] = [];
		const container = render(
			<ReportPlacementTable
				onRowSelect={(row) => selectedRows.push(String(row.id))}
				rows={[
					{
						code: 'SPEC/607/1',
						format: 'Spectacular',
						id: 'spec-607',
						name: 'Pretoria Central',
						value: '254k',
					},
				]}
			/>,
		);
		const row = container.querySelector('tbody tr');

		expect(row?.getAttribute('role')).toBe('button');
		click(row);
		keyDown(row, 'Enter');

		expect(selectedRows).toEqual(['spec-607', 'spec-607']);
	});
});
