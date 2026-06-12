import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { SearchableSelector, SelectorGroup, SelectorOption } from './selector';

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

describe('Selector components', () => {
	it('renders SelectorGroup', () => {
		const container = render(
			<SelectorGroup columns={3}>Content</SelectorGroup>,
		);
		expect(container.querySelector('.pds-selector-group--3')).toBeTruthy();
	});

	it('renders SelectorOption', () => {
		const container = render(
			<SelectorOption description="Desc" selected title="Option 1" />,
		);
		const btn = container.querySelector('button');
		expect(btn?.getAttribute('aria-pressed')).toBe('true');
		expect(btn?.textContent).toContain('Option 1');
		expect(btn?.textContent).toContain('Desc');
	});

	it('renders SearchableSelector', () => {
		const options = [
			{ label: 'Apple', value: 'apple' },
			{ label: 'Banana', value: 'banana' },
		];
		const container = render(<SearchableSelector options={options} />);

		expect(
			container.querySelectorAll('.pds-searchable-selector__option').length,
		).toBe(2);
		expect(container.textContent).toContain('Apple');
		expect(container.textContent).toContain('Banana');
	});
});
