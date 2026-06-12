import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Tooltip } from './tooltip';

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

describe('Tooltip', () => {
	it('renders children and tooltip content', () => {
		const container = render(<Tooltip content="Info">Hover me</Tooltip>);
		expect(container.textContent).toContain('Hover me');

		const content = container.querySelector('.pds-tooltip__content');
		expect(content).toBeTruthy();
		expect(content?.textContent).toBe('Info');
	});

	it('applies the correct side class', () => {
		const container = render(
			<Tooltip content="Info" side="right">
				Hover me
			</Tooltip>,
		);
		const content = container.querySelector('.pds-tooltip__content');
		expect(content?.classList.contains('pds-tooltip__content--right')).toBe(
			true,
		);
	});
});
