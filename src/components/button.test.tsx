import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Button, IconButton } from './button';

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

describe('Button', () => {
	it('renders correctly', () => {
		const container = render(<Button>Click me</Button>);
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.textContent).toBe('Click me');
		expect(button?.classList.contains('pds-button')).toBe(true);
		expect(button?.classList.contains('pds-button--primary')).toBe(true);
	});

	it('applies variant and size classes', () => {
		const container = render(
			<Button size="sm" variant="ghost">
				Small Ghost
			</Button>,
		);
		const button = container.querySelector('button');
		expect(button?.classList.contains('pds-button--ghost')).toBe(true);
		expect(button?.classList.contains('pds-button--sm')).toBe(true);
	});

	it('renders loading state', () => {
		const container = render(<Button isLoading>Loading</Button>);
		const button = container.querySelector('button');
		expect(button?.disabled).toBe(true);
		expect(button?.getAttribute('aria-busy')).toBe('true');
		expect(container.querySelector('.pds-button__spinner')).toBeTruthy();
	});

	it('renders icons', () => {
		const container = render(
			<Button
				leftIcon={<span className="left-icon" />}
				rightIcon={<span className="right-icon" />}
			>
				Icon Button
			</Button>,
		);
		expect(container.querySelector('.left-icon')).toBeTruthy();
		expect(container.querySelector('.right-icon')).toBeTruthy();
	});
});

describe('IconButton', () => {
	it('renders an icon button', () => {
		const container = render(<IconButton icon="close" label="Close" />);
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		expect(button?.getAttribute('aria-label')).toBe('Close');
		expect(button?.title).toBe('Close');
		expect(button?.classList.contains('pds-icon-button')).toBe(true);
	});
});
