import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Accordion, DisclosureButton } from './disclosure';

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

describe('Accordion', () => {
	const items = [
		{ id: '1', title: 'Item 1', content: 'Content 1' },
		{ id: '2', title: 'Item 2', content: 'Content 2' },
	];

	it('renders items and toggles open state', () => {
		const container = render(<Accordion items={items} />);
		const triggers = container.querySelectorAll('.pds-accordion__trigger');
		expect(triggers.length).toBe(2);
		expect(container.querySelector('.pds-accordion__panel')).toBeFalsy();

		act(() => {
			triggers[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const panel = container.querySelector('.pds-accordion__panel');
		expect(panel).toBeTruthy();
		expect(panel?.textContent).toBe('Content 1');
	});

	it('handles multiple open items if enabled', () => {
		const container = render(
			<Accordion defaultOpenItems={['1', '2']} items={items} multiple />,
		);
		const panels = container.querySelectorAll('.pds-accordion__panel');
		expect(panels.length).toBe(2);
	});
});

describe('DisclosureButton', () => {
	it('renders disclosure button with open state', () => {
		const container = render(
			<DisclosureButton open={true}>Toggle</DisclosureButton>,
		);
		const btn = container.querySelector('button');
		expect(btn?.getAttribute('aria-expanded')).toBe('true');
		expect(btn?.textContent).toContain('Toggle');
	});
});
