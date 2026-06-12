import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DropdownItem, DropdownMenu, DropdownSeparator } from './dropdown';

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

describe('DropdownMenu', () => {
	it('renders a button and no menu by default', () => {
		const container = render(
			<DropdownMenu label="Options">
				<DropdownItem>Item 1</DropdownItem>
			</DropdownMenu>,
		);
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.textContent).toContain('Options');

		const menu = container.querySelector('.pds-dropdown__menu');
		expect(menu).toBeFalsy();
	});

	it('opens menu on click', () => {
		const container = render(
			<DropdownMenu label="Options">
				<DropdownItem>Item 1</DropdownItem>
			</DropdownMenu>,
		);
		const button = container.querySelector('button')!;

		act(() => {
			button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const menu = container.querySelector('.pds-dropdown__menu');
		expect(menu).toBeTruthy();
		expect(menu?.textContent).toContain('Item 1');
	});

	it('renders separator and items correctly', () => {
		const container = render(
			<DropdownMenu defaultOpen label="Options">
				<DropdownItem description="Desc" selected>
					Item 1
				</DropdownItem>
				<DropdownSeparator />
				<DropdownItem>Item 2</DropdownItem>
			</DropdownMenu>,
		);
		const items = container.querySelectorAll('.pds-dropdown__item');
		expect(items.length).toBe(2);
		expect(items[0].classList.contains('pds-dropdown__item--selected')).toBe(
			true,
		);
		expect(items[0].textContent).toContain('Desc');
		expect(container.querySelector('.pds-dropdown__separator')).toBeTruthy();
	});
});
