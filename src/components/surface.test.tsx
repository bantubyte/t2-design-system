import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Surface } from './surface';

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

describe('Surface', () => {
	it('renders section by default with tone and padding', () => {
		const container = render(
			<Surface padding="lg" tone="brand">
				Content
			</Surface>,
		);
		const el = container.querySelector('section.pds-surface');
		expect(el).toBeTruthy();
		expect(el?.classList.contains('pds-surface--brand')).toBe(true);
		expect(el?.classList.contains('pds-surface--padding-lg')).toBe(true);
		expect(el?.textContent).toBe('Content');
	});

	it('renders as different element', () => {
		const container = render(<Surface as="article">Article Content</Surface>);
		const el = container.querySelector('article.pds-surface');
		expect(el).toBeTruthy();
	});
});
