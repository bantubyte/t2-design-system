import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MobileMenuSheet, SiteNav, type SiteNavLink } from './navigation';

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

const click = (element: Element | null | undefined) => {
	act(() => {
		element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
	document.body.style.overflow = '';
});

const links: SiteNavLink[] = [
	{ active: true, description: 'Overview', href: '#product', label: 'Product' },
	{ description: 'Brief to proposal', href: '#how', label: 'How it works' },
	{ description: '2M+ commuters', href: '#impact', label: 'Impact' },
];

describe('SiteNav', () => {
	it('renders logo, links, and CTA', () => {
		const container = render(
			<SiteNav
				cta={<button type="button">Book demo</button>}
				links={links}
				logo={<span data-testid="logo">Pikaboo</span>}
			/>,
		);
		expect(container.querySelector('[data-testid="logo"]')).toBeTruthy();
		expect(container.querySelectorAll('.pds-site-nav__link').length).toBe(
			links.length,
		);
		expect(container.textContent).toContain('Book demo');
	});

	it('marks the active link with aria-current="page"', () => {
		const container = render(<SiteNav links={links} />);
		const activeLink = container.querySelector(
			'.pds-site-nav__link[aria-current="page"]',
		);
		expect(activeLink?.textContent).toBe('Product');
	});

	it('applies sticky class when sticky=true (default)', () => {
		const container = render(<SiteNav links={links} />);
		expect(
			container
				.querySelector('.pds-site-nav')
				?.classList.contains('pds-site-nav--sticky'),
		).toBe(true);
	});

	it('omits the sticky class when sticky=false', () => {
		const container = render(<SiteNav links={links} sticky={false} />);
		expect(
			container
				.querySelector('.pds-site-nav')
				?.classList.contains('pds-site-nav--sticky'),
		).toBe(false);
	});

	it('applies the requested colour scheme class', () => {
		const container = render(<SiteNav links={links} scheme="dark" />);
		expect(
			container
				.querySelector('.pds-site-nav')
				?.classList.contains('pds-site-nav--scheme-dark'),
		).toBe(true);
	});

	it('toggles the mobile menu sheet open via the toggle button (uncontrolled)', () => {
		const container = render(<SiteNav links={links} />);
		const toggle = container.querySelector('.pds-site-nav__menu-toggle');
		expect(toggle?.getAttribute('aria-expanded')).toBe('false');
		const sheet = container.querySelector('.pds-mobile-menu-sheet');
		expect(sheet?.classList.contains('pds-mobile-menu-sheet--open')).toBe(
			false,
		);

		click(toggle);
		expect(toggle?.getAttribute('aria-expanded')).toBe('true');
		expect(sheet?.classList.contains('pds-mobile-menu-sheet--open')).toBe(true);

		click(toggle);
		expect(toggle?.getAttribute('aria-expanded')).toBe('false');
		expect(sheet?.classList.contains('pds-mobile-menu-sheet--open')).toBe(
			false,
		);
	});

	it('honours controlled mobileOpen / onMobileOpenChange', () => {
		const changes: boolean[] = [];
		const container = render(
			<SiteNav
				links={links}
				mobileOpen={false}
				onMobileOpenChange={(value) => changes.push(value)}
			/>,
		);
		const toggle = container.querySelector('.pds-site-nav__menu-toggle');
		const sheet = container.querySelector('.pds-mobile-menu-sheet');
		expect(sheet?.classList.contains('pds-mobile-menu-sheet--open')).toBe(
			false,
		);
		click(toggle);
		expect(changes).toEqual([true]);
		// Sheet stays closed because controlled state hasn't been updated.
		expect(sheet?.classList.contains('pds-mobile-menu-sheet--open')).toBe(
			false,
		);
	});

	it('uses mobileCta when provided, falling back to cta otherwise', () => {
		const container = render(
			<SiteNav
				cta={<span>Book demo</span>}
				links={links}
				mobileCta={<span>Mobile demo</span>}
			/>,
		);
		expect(
			container.querySelector('.pds-mobile-menu-sheet__cta')?.textContent,
		).toBe('Mobile demo');
	});
});

describe('MobileMenuSheet', () => {
	it('renders rows with labels and descriptions, marks the active one', () => {
		const container = render(
			<MobileMenuSheet links={links} onClose={() => undefined} open />,
		);
		const rows = container.querySelectorAll('.pds-mobile-menu-sheet__row');
		expect(rows.length).toBe(links.length);
		const active = container.querySelector(
			'.pds-mobile-menu-sheet__row[aria-current="page"]',
		);
		expect(
			active?.classList.contains('pds-mobile-menu-sheet__row--active'),
		).toBe(true);
		expect(container.textContent).toContain('Overview');
	});

	it('invokes onClose when the close button is clicked', () => {
		const closes: string[] = [];
		const container = render(
			<MobileMenuSheet
				links={links}
				onClose={() => closes.push('close')}
				open
			/>,
		);
		click(container.querySelector('.pds-mobile-menu-sheet__close'));
		expect(closes).toEqual(['close']);
	});

	it('invokes onClose when the user clicks a menu row and forwards link onClick', () => {
		const closes: string[] = [];
		const linkClicks: string[] = [];
		const itemLinks: SiteNavLink[] = [
			{
				description: 'Overview',
				href: '#product',
				label: 'Product',
				onClick: () => linkClicks.push('product'),
			},
		];
		const container = render(
			<MobileMenuSheet
				links={itemLinks}
				onClose={() => closes.push('close')}
				open
			/>,
		);
		click(container.querySelector('.pds-mobile-menu-sheet__row'));
		expect(closes).toEqual(['close']);
		expect(linkClicks).toEqual(['product']);
	});

	it('locks document body scroll when open and restores it on close', () => {
		document.body.style.overflow = 'auto';
		const container = render(
			<MobileMenuSheet links={links} onClose={() => undefined} open />,
		);
		expect(document.body.style.overflow).toBe('hidden');
		act(() => {
			mountedRoots[mountedRoots.length - 1].render(
				<MobileMenuSheet
					links={links}
					onClose={() => undefined}
					open={false}
				/>,
			);
		});
		// Force render path so the cleanup effect runs.
		expect(container.querySelector('.pds-mobile-menu-sheet--open')).toBeNull();
		expect(document.body.style.overflow).toBe('auto');
	});

	it('closes via the Escape key when open', () => {
		const closes: string[] = [];
		render(
			<MobileMenuSheet
				links={links}
				onClose={() => closes.push('escape')}
				open
			/>,
		);
		act(() => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
			);
		});
		expect(closes).toEqual(['escape']);
	});

	it('defaults to scheme="dark"', () => {
		const container = render(
			<MobileMenuSheet links={links} onClose={() => undefined} open />,
		);
		const sheet = container.querySelector('.pds-mobile-menu-sheet');
		expect(
			sheet?.classList.contains('pds-mobile-menu-sheet--scheme-dark'),
		).toBe(true);
		expect(sheet?.getAttribute('data-scheme')).toBe('dark');
	});

	it('applies the scheme="light" class when explicitly requested', () => {
		const container = render(
			<MobileMenuSheet
				links={links}
				onClose={() => undefined}
				open
				scheme="light"
			/>,
		);
		const sheet = container.querySelector('.pds-mobile-menu-sheet');
		expect(
			sheet?.classList.contains('pds-mobile-menu-sheet--scheme-light'),
		).toBe(true);
		expect(
			sheet?.classList.contains('pds-mobile-menu-sheet--scheme-dark'),
		).toBe(false);
		expect(sheet?.getAttribute('data-scheme')).toBe('light');
	});

	it('does not lock scroll or react to escape while closed', () => {
		document.body.style.overflow = 'auto';
		const closes: string[] = [];
		render(
			<MobileMenuSheet
				links={links}
				onClose={() => closes.push('escape')}
				open={false}
			/>,
		);
		expect(document.body.style.overflow).toBe('auto');
		act(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		});
		expect(closes).toEqual([]);
	});
});
