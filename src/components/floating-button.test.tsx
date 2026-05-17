import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FloatingButton } from './floating-button';

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

const pointer = (type: string, options: MouseEventInit = {}) =>
	new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		clientX: 0,
		clientY: 0,
		...options,
	});

beforeEach(() => {
	window.localStorage.clear();
	Object.defineProperty(window, 'innerWidth', {
		configurable: true,
		value: 1000,
	});
	Object.defineProperty(window, 'innerHeight', {
		configurable: true,
		value: 800,
	});
});

afterEach(() => {
	vi.useRealTimers();
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
	window.localStorage.clear();
});

describe('FloatingButton', () => {
	it('renders a generic floating button with icon, label, tooltip, and corner classes', () => {
		const clicks: string[] = [];
		const container = render(
			<FloatingButton
				defaultCorner="bottom-right"
				icon={<span data-testid="custom-icon">?</span>}
				label="Contact Help"
				onClick={() => clicks.push('clicked')}
				tooltip="Need help?"
			/>,
		);
		const button = container.querySelector('.pds-floating-button');

		expect(
			button?.classList.contains('pds-floating-button--bottom-right'),
		).toBe(true);
		expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
		expect(container.textContent).toContain('Contact Help');
		expect(container.textContent).toContain('Need help?');

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(clicks).toEqual(['clicked']);
	});

	it('collapses after idle and expands again on focus', () => {
		vi.useFakeTimers();
		const container = render(
			<FloatingButton collapseAfterMs={120} icon="help" label="Contact Help" />,
		);
		const button = container.querySelector('.pds-floating-button');

		expect(button?.classList.contains('pds-floating-button--collapsed')).toBe(
			false,
		);

		act(() => {
			vi.advanceTimersByTime(120);
		});

		expect(button?.classList.contains('pds-floating-button--collapsed')).toBe(
			true,
		);

		act(() => {
			button?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		});

		expect(button?.classList.contains('pds-floating-button--collapsed')).toBe(
			false,
		);
	});

	it('snaps to a dragged corner, persists it, and suppresses the drag click', () => {
		const clicks: string[] = [];
		const corners: string[] = [];
		const storageKey = 'pds-test-floating-corner';
		const container = render(
			<FloatingButton
				defaultCorner="bottom-right"
				icon="help"
				label="Contact Help"
				onClick={() => clicks.push('clicked')}
				onCornerChange={(corner) => corners.push(corner)}
				storageKey={storageKey}
			/>,
		);
		const button = container.querySelector('.pds-floating-button');

		act(() => {
			button?.dispatchEvent(
				pointer('pointerdown', { clientX: 960, clientY: 760 }),
			);
		});
		act(() => {
			document.dispatchEvent(
				pointer('pointermove', { clientX: 40, clientY: 40 }),
			);
		});
		act(() => {
			document.dispatchEvent(
				pointer('pointerup', { clientX: 40, clientY: 40 }),
			);
		});

		expect(button?.classList.contains('pds-floating-button--top-left')).toBe(
			true,
		);
		expect(window.localStorage.getItem(storageKey)).toBe('top-left');
		expect(corners).toEqual(['top-left']);

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(clicks).toEqual([]);

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(clicks).toEqual(['clicked']);
	});
});
