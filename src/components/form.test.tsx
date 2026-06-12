import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Checkbox, Input, Select, Switch, Textarea } from './form';

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

describe('Input', () => {
	it('renders correctly', () => {
		const container = render(<Input placeholder="Enter text" />);
		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.placeholder).toBe('Enter text');
		expect(input?.classList.contains('pds-input')).toBe(true);
	});
});

describe('Checkbox', () => {
	it('renders correctly', () => {
		const container = render(<Checkbox label="Agree" />);
		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.type).toBe('checkbox');
		expect(container.textContent).toContain('Agree');
	});

	it('handles indeterminate state', () => {
		const container = render(<Checkbox indeterminate />);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.indeterminate).toBe(true);
	});
});

describe('Switch', () => {
	it('renders correctly', () => {
		const container = render(<Switch label="Toggle" />);
		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input?.type).toBe('checkbox');
		expect(input?.classList.contains('pds-switch__input')).toBe(true);
		expect(container.textContent).toContain('Toggle');
	});
});

describe('Select', () => {
	it('renders correctly', () => {
		const container = render(
			<Select>
				<option value="1">One</option>
			</Select>,
		);
		const select = container.querySelector('select');
		expect(select).toBeTruthy();
		expect(select?.children.length).toBe(1);
	});
});

describe('Textarea', () => {
	it('renders correctly', () => {
		const container = render(<Textarea placeholder="Text" />);
		const textarea = container.querySelector('textarea');
		expect(textarea).toBeTruthy();
		expect(textarea?.placeholder).toBe('Text');
	});
});
