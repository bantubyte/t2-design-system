import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CommandMenu } from './command';

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

describe('CommandMenu', () => {
	const items = [
		{ label: 'Create Campaign', value: 'create_campaign', group: 'Actions' },
		{ label: 'Settings', value: 'settings', group: 'System' },
	];

	it('renders command menu with items grouped', () => {
		const container = render(<CommandMenu items={items} />);
		const groups = container.querySelectorAll('.pds-command-menu__group');
		expect(groups.length).toBe(2);
		expect(groups[0].querySelector('h4')?.textContent).toBe('Actions');
		expect(groups[1].querySelector('h4')?.textContent).toBe('System');
	});

	it('filters items by query', () => {
		const container = render(<CommandMenu items={items} query="sett" />);
		const groups = container.querySelectorAll('.pds-command-menu__group');
		expect(groups.length).toBe(1); // Only System should be visible
		expect(groups[0].querySelector('h4')?.textContent).toBe('System');
	});

	it('shows empty label if no results', () => {
		const container = render(
			<CommandMenu emptyLabel="No commands found" items={items} query="xyz" />,
		);
		expect(
			container.querySelector('.pds-command-menu__empty')?.textContent,
		).toBe('No commands found');
	});
});
