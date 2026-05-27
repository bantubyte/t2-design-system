import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DateRangePicker, type DateRangePreset } from './index';

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

describe('DateRangePicker preset anchoring', () => {
	const addDays = (date: Date, days: number): Date => {
		const next = new Date(date);
		next.setDate(next.getDate() + days);
		return next;
	};

	const anchoredPreset: DateRangePreset = {
		value: '7d',
		label: '7 days',
		getRange: (anchor) => {
			const from = anchor ?? new Date(2024, 0, 1);
			return { from, to: addDays(from, 6) };
		},
	};

	it('passes the in-progress start date to the preset getRange', () => {
		const ranges: Array<{ from?: Date; to?: Date }> = [];
		const selectedStart = new Date(2024, 5, 10);

		const container = render(
			<DateRangePicker
				onRangeChange={(range) => ranges.push(range)}
				presets={[anchoredPreset]}
				range={{ from: selectedStart, to: undefined }}
			/>,
		);

		click(findButton(container, '7 days'));

		expect(ranges).toHaveLength(1);
		expect(ranges[0].from?.getTime()).toBe(selectedStart.getTime());
		expect(ranges[0].to?.getTime()).toBe(addDays(selectedStart, 6).getTime());
	});

	it('falls back to the preset default when no start date is selected', () => {
		const ranges: Array<{ from?: Date; to?: Date }> = [];

		const container = render(
			<DateRangePicker
				onRangeChange={(range) => ranges.push(range)}
				presets={[anchoredPreset]}
			/>,
		);

		click(findButton(container, '7 days'));

		expect(ranges).toHaveLength(1);
		expect(ranges[0].from?.getTime()).toBe(new Date(2024, 0, 1).getTime());
	});
});
