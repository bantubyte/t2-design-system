import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BrandLockup, PikabooWordmark } from './brand';

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

describe('PikabooWordmark', () => {
	it('renders an accessible SVG wordmark with default tone', () => {
		const container = render(<PikabooWordmark />);
		const svg = container.querySelector('.pds-pikaboo-wordmark');
		expect(svg).toBeTruthy();
		expect(svg?.getAttribute('role')).toBe('img');
		expect(svg?.getAttribute('aria-label')).toBe('Pikaboo');
		expect(svg?.classList.contains('pds-pikaboo-wordmark--tone-auto')).toBe(
			true,
		);
		expect(container.querySelector('title')?.textContent).toBe('Pikaboo');
	});

	it('applies the requested tone class', () => {
		const container = render(<PikabooWordmark tone="dark" />);
		const svg = container.querySelector('.pds-pikaboo-wordmark');
		expect(svg?.classList.contains('pds-pikaboo-wordmark--tone-dark')).toBe(
			true,
		);
	});

	it('honours a custom accessible label and renders matching title', () => {
		const container = render(
			<PikabooWordmark accessibleLabel="Pikaboo home" />,
		);
		const svg = container.querySelector('.pds-pikaboo-wordmark');
		expect(svg?.getAttribute('aria-label')).toBe('Pikaboo home');
		expect(container.querySelector('title')?.textContent).toBe('Pikaboo home');
	});

	it('scales height and computes proportional width', () => {
		const container = render(<PikabooWordmark height={64} />);
		const svg = container.querySelector('.pds-pikaboo-wordmark');
		expect(svg?.getAttribute('height')).toBe('64');
		expect(Number(svg?.getAttribute('width'))).toBeCloseTo((64 * 280) / 64, 2);
	});

	it('applies text and accent colours when explicitly provided', () => {
		const container = render(
			<PikabooWordmark accentColor="#FF00FF" textColor="#001122" />,
		);
		const irises = container.querySelectorAll('.pds-pikaboo-wordmark__iris');
		const pupils = container.querySelectorAll('.pds-pikaboo-wordmark__pupil');
		expect(irises.length).toBe(2);
		expect(pupils.length).toBe(2);
		for (const iris of Array.from(irises)) {
			expect(iris.getAttribute('fill')).toBe('#001122');
		}
		for (const pupil of Array.from(pupils)) {
			expect(pupil.getAttribute('fill')).toBe('#FF00FF');
		}
	});

	it('forwards SVG props such as className and data attributes', () => {
		const container = render(
			<PikabooWordmark className="custom" data-testid="wordmark" />,
		);
		const svg = container.querySelector('[data-testid="wordmark"]');
		expect(svg?.classList.contains('custom')).toBe(true);
	});
});

describe('BrandLockup', () => {
	it('renders the default BrandMark + product name + subtitle', () => {
		const container = render(<BrandLockup subtitle="Marketing" />);
		expect(container.querySelector('.pds-brand-mark')).toBeTruthy();
		expect(container.querySelector('.pds-product-name')).toBeTruthy();
		expect(container.textContent).toContain('Marketing');
	});

	it('swaps the BrandMark for the PikabooWordmark when useWordmark is set', () => {
		const container = render(<BrandLockup useWordmark wordmarkHeight={40} />);
		expect(container.querySelector('.pds-brand-mark')).toBeNull();
		const wordmark = container.querySelector('.pds-pikaboo-wordmark');
		expect(wordmark).toBeTruthy();
		expect(wordmark?.getAttribute('height')).toBe('40');
	});

	it('hides the product name when using the wordmark', () => {
		const container = render(<BrandLockup subtitle="Pikaboo" useWordmark />);
		expect(container.querySelector('.pds-product-name')).toBeNull();
		expect(container.textContent).toContain('Pikaboo');
	});

	it('omits the supporting text block when no subtitle and showTenant is off', () => {
		const container = render(
			<BrandLockup showTenant={false} subtitle="" useWordmark />,
		);
		expect(container.querySelector('.pds-brand-lockup__text')).toBeNull();
	});

	it('applies the requested surface class', () => {
		const container = render(<BrandLockup surface="slate" />);
		expect(
			container
				.querySelector('.pds-brand-lockup')
				?.classList.contains('pds-brand-lockup--surface-slate'),
		).toBe(true);
	});

	it('passes the wordmark dark tone for non-pearl surfaces', () => {
		const container = render(
			<BrandLockup surface="violet-ink" useWordmark wordmarkHeight={32} />,
		);
		const wordmark = container.querySelector('.pds-pikaboo-wordmark');
		expect(
			wordmark?.classList.contains('pds-pikaboo-wordmark--tone-dark'),
		).toBe(true);
	});

	it('passes the wordmark light tone for the pearl surface', () => {
		const container = render(
			<BrandLockup surface="pearl" useWordmark wordmarkHeight={32} />,
		);
		const wordmark = container.querySelector('.pds-pikaboo-wordmark');
		expect(
			wordmark?.classList.contains('pds-pikaboo-wordmark--tone-light'),
		).toBe(true);
	});
});
