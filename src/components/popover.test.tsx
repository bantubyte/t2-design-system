import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Popover } from './popover';

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

describe('Popover', () => {
	it('renders trigger button and no panel by default', () => {
		const container = render(<Popover label="Open">Content</Popover>);
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.textContent).toContain('Open');
		expect(container.querySelector('.pds-popover__panel')).toBeFalsy();
	});

	it('opens panel on click', () => {
		const container = render(<Popover label="Open">Content</Popover>);
		const button = container.querySelector('button')!;

		act(() => {
			button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const panel = container.querySelector('.pds-popover__panel');
		expect(panel).toBeTruthy();
		expect(panel?.textContent).toContain('Content');
	});
});
