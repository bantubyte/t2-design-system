import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Icon, isPdsIconName } from './icons';

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

describe('Icons', () => {
	it('renders an SVG icon', () => {
		const container = render(
			<Icon name="search" size={24} title="Search icon" />,
		);
		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('width')).toBe('24');
		expect(container.querySelector('title')?.textContent).toBe('Search icon');
	});

	it('validates icon names', () => {
		expect(isPdsIconName('search')).toBe(true);
		expect(isPdsIconName('not-a-real-icon')).toBe(false);
	});
});
