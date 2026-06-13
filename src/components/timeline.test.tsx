import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Timeline } from './timeline';

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

describe('Timeline', () => {
	it('renders timeline items', () => {
		const items = [
			{ title: 'Step 1', state: 'complete' as const, label: 'Done' },
			{ title: 'Step 2', state: 'current' as const },
		];
		const container = render(<Timeline items={items} />);
		const li = container.querySelectorAll('.pds-timeline__item');
		expect(li.length).toBe(2);
		expect(li[0].classList.contains('pds-timeline__item--complete')).toBe(true);
		expect(li[1].classList.contains('pds-timeline__item--current')).toBe(true);
		expect(container.textContent).toContain('Step 1');
		expect(container.textContent).toContain('Done');
	});
});
