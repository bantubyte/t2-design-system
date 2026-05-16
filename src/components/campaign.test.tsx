import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	CampaignListCard,
	CampaignListToolbar,
	CampaignScheduleDialog,
	SiteInventoryPanel,
	SupportRequestDialog,
} from './campaign';

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

const inputValue = (element: Element | null, value: string) => {
	if (
		!(
			element instanceof HTMLInputElement ||
			element instanceof HTMLTextAreaElement
		)
	) {
		throw new Error('Element not found for input');
	}
	act(() => {
		const prototype =
			element instanceof HTMLTextAreaElement
				? HTMLTextAreaElement.prototype
				: HTMLInputElement.prototype;
		const valueSetter = Object.getOwnPropertyDescriptor(
			prototype,
			'value',
		)?.set;
		valueSetter?.call(element, value);
		element.dispatchEvent(new Event('input', { bubbles: true }));
		element.dispatchEvent(new Event('change', { bubbles: true }));
	});
};

const findButton = (container: HTMLElement, text: string) =>
	Array.from(container.querySelectorAll('button')).find((button) =>
		button.textContent?.includes(text),
	) ?? null;

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('campaign workflow component interactions', () => {
	it('reports search changes from the campaign toolbar', () => {
		const values: string[] = [];
		const container = render(
			<CampaignListToolbar onValueChange={(value) => values.push(value)} />,
		);

		inputValue(container.querySelector('input'), 'Mazda');

		expect(values).toEqual(['Mazda']);
	});

	it('selects campaign cards without bubbling view actions into card selection', () => {
		let selected = 0;
		let viewed = 0;
		const container = render(
			<CampaignListCard
				client="No Client"
				onSelect={() => {
					selected += 1;
				}}
				onView={() => {
					viewed += 1;
				}}
				title="lario lario"
			/>,
		);
		const card = container.querySelector('[role="button"]');

		click(card);
		keyDown(card, 'Enter');
		click(findButton(container, 'View Campaign'));

		expect(selected).toBe(2);
		expect(viewed).toBe(1);
	});

	it('submits support request form values after required fields are filled', () => {
		let submittedSubject = '';
		let submittedDescription = '';
		const container = render(
			<SupportRequestDialog
				defaultValues={{
					email: 'owner@example.com',
					name: 'Lario Owner',
				}}
				onSubmit={(values) => {
					submittedSubject = values.subject;
					submittedDescription = values.description;
				}}
			/>,
		);

		expect(findButton(container, 'Submit')).toHaveProperty('disabled', true);
		inputValue(
			container.querySelector(
				'input[placeholder="Briefly, what\'s going on?"]',
			),
			'Campaign export failed',
		);
		inputValue(
			container.querySelector('textarea'),
			'Expected the campaign export to complete.',
		);
		click(findButton(container, 'Submit'));

		expect(submittedSubject).toBe('Campaign export failed');
		expect(submittedDescription).toBe(
			'Expected the campaign export to complete.',
		);
	});

	it('selects inventory rows and bulk-adds selected site ids', () => {
		let selectedIds: string[] = [];
		let bulkAddedIds: string[] = [];
		const container = render(
			<SiteInventoryPanel
				defaultSelectedIds={['AC003']}
				items={[
					{
						id: 'AC003',
						location: 'Acornhoek',
						price: 'R1,500',
						recommended: true,
						title: 'AC003 - Illum ID Lite Sign',
					},
					{
						id: 'AD014',
						location: 'University',
						price: 'R101,000.69',
						title: 'AD014 - Victory Plaza',
					},
				]}
				onBulkAdd={(ids) => {
					bulkAddedIds = ids;
				}}
				onSelectedIdsChange={(ids) => {
					selectedIds = ids;
				}}
			/>,
		);

		click(findButton(container, 'All Sites'));
		click(container.querySelectorAll('input[type="checkbox"]')[1]);
		click(findButton(container, 'Bulk Add'));

		expect(selectedIds).toEqual(['AC003', 'AD014']);
		expect(bulkAddedIds).toEqual(['AC003', 'AD014']);
	});

	it('applies the selected campaign schedule range', () => {
		let appliedDays = 0;
		const container = render(
			<CampaignScheduleDialog
				defaultRange={{
					from: new Date(2026, 6, 9),
					to: new Date(2026, 6, 22),
				}}
				onApply={(range) => {
					if (!range.from || !range.to) return;
					appliedDays =
						Math.floor(
							(range.to.getTime() - range.from.getTime()) / 86_400_000,
						) + 1;
				}}
			/>,
		);

		click(findButton(container, 'Set Dates'));

		expect(appliedDays).toBe(14);
	});
});
