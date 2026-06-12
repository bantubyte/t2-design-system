import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Combobox } from './combobox';

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

describe('Combobox', () => {
	it('renders an input with combobox role', () => {
		const container = render(
			<Combobox
				onSelect={() => {}}
				onValueChange={() => {}}
				options={[]}
				value=""
			/>,
		);
		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('role')).toBe('combobox');
	});

	it('renders options when panel is open', () => {
		const container = render(
			<Combobox
				onSelect={() => {}}
				onValueChange={() => {}}
				options={[
					{ label: 'Option 1', value: '1' },
					{ label: 'Option 2', value: '2' },
				]}
				value=""
			/>,
		);
		const input = container.querySelector('input')!;

		act(() => {
			input.focus();
		});

		const listbox = container.querySelector('[role="listbox"]');
		expect(listbox).toBeTruthy();
		const options = container.querySelectorAll('[role="option"]');
		expect(options.length).toBe(2);
		expect(options[0].textContent).toContain('Option 1');
	});

	it('displays loading state', () => {
		const container = render(
			<Combobox
				isLoading
				loadingLabel="Loading..."
				onSelect={() => {}}
				onValueChange={() => {}}
				options={[]}
				value=""
			/>,
		);
		const input = container.querySelector('input')!;

		act(() => {
			input.focus();
		});

		expect(container.textContent).toContain('Loading...');
	});
});
