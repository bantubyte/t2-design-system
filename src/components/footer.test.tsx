import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Footer,
	type FooterLink,
	type FooterSection,
	type FooterStatus,
} from './footer';

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

const productSection: FooterSection = {
	links: [
		{ href: '/product', label: 'Overview' },
		{ href: '/intelligence', label: 'Intelligence engine' },
	],
	title: 'Product',
};

const companySection: FooterSection = {
	links: [
		{ href: '/story', label: 'Story' },
		{ href: '/team', label: 'Team' },
	],
	title: 'Company',
};

const socialLinks: readonly FooterLink[] = [
	{ href: 'https://twitter.com/pikaboo', icon: 'twitter', label: 'Twitter' },
	{
		href: 'https://linkedin.com/company/pikaboo',
		icon: 'linkedin',
		label: 'LinkedIn',
	},
];

const status: FooterStatus = {
	label: 'All systems operational',
	tone: 'operational',
};

describe('Footer (default variant)', () => {
	it('renders sections and legal links with default copy', () => {
		const container = render(
			<Footer sections={[productSection, companySection]} />,
		);
		expect(container.textContent).toContain('Product');
		expect(container.textContent).toContain('Company');
		expect(container.textContent).toContain('Privacy');
		expect(container.textContent).toContain(String(new Date().getFullYear()));
	});

	it('shows whatsapp icon for matching legal links', () => {
		const container = render(
			<Footer
				legalLinks={[
					{ href: 'https://wa.me/0', label: 'WhatsApp the team' },
					{ href: '/terms', label: 'Terms' },
				]}
				sections={[productSection]}
			/>,
		);
		expect(container.querySelectorAll('.pds-icon').length).toBeGreaterThan(0);
	});

	it('renders custom copyright when provided', () => {
		const container = render(
			<Footer copyright="© 2026 Pikaboo Studios" sections={[productSection]} />,
		);
		expect(container.textContent).toContain('© 2026 Pikaboo Studios');
	});

	it('applies a custom className', () => {
		const container = render(
			<Footer className="custom" sections={[productSection]} />,
		);
		expect(
			container.querySelector('.pds-footer')?.classList.contains('custom'),
		).toBe(true);
	});
});

describe('Footer (mega variant)', () => {
	it('renders brand column, tagline, social, sections, legal, and status', () => {
		const container = render(
			<Footer
				legalLinks={[{ href: '/privacy', label: 'Privacy' }]}
				sections={[productSection, companySection]}
				socialLinks={socialLinks}
				status={status}
				tagline="The intelligence layer for OOH."
				variant="mega"
			/>,
		);
		expect(
			container
				.querySelector('.pds-footer')
				?.classList.contains('pds-footer--mega'),
		).toBe(true);
		expect(container.textContent).toContain('The intelligence layer for OOH.');
		expect(container.textContent).toContain('Product');
		expect(container.textContent).toContain('Company');
		expect(container.textContent).toContain('Privacy');
		expect(container.textContent).toContain('All systems operational');
		expect(
			container.querySelectorAll('.pds-footer-mega__social-link').length,
		).toBe(socialLinks.length);
	});

	it('falls back to description if tagline is omitted', () => {
		const container = render(
			<Footer
				description="Built in Johannesburg."
				sections={[productSection]}
				variant="mega"
			/>,
		);
		expect(container.textContent).toContain('Built in Johannesburg.');
	});

	it('applies the correct status tone modifier class', () => {
		const container = render(
			<Footer
				sections={[productSection]}
				status={{ label: 'Investigating', tone: 'degraded' }}
				variant="mega"
			/>,
		);
		expect(
			container
				.querySelector('.pds-footer-mega__status')
				?.classList.contains('pds-footer-mega__status--degraded'),
		).toBe(true);
	});

	it('defaults to scheme="dark" for the mega variant', () => {
		const container = render(
			<Footer sections={[productSection]} variant="mega" />,
		);
		const footer = container.querySelector('.pds-footer');
		expect(footer?.classList.contains('pds-footer--scheme-dark')).toBe(true);
		expect(footer?.getAttribute('data-scheme')).toBe('dark');
	});

	it('applies the scheme="light" class when explicitly requested', () => {
		const container = render(
			<Footer scheme="light" sections={[productSection]} variant="mega" />,
		);
		const footer = container.querySelector('.pds-footer');
		expect(footer?.classList.contains('pds-footer--scheme-light')).toBe(true);
		expect(footer?.classList.contains('pds-footer--scheme-dark')).toBe(false);
		expect(footer?.getAttribute('data-scheme')).toBe('light');
	});

	it('renders social links with aria-label and visually hidden text', () => {
		const container = render(
			<Footer
				sections={[productSection]}
				socialLinks={socialLinks}
				variant="mega"
			/>,
		);
		const social = container.querySelectorAll('.pds-footer-mega__social-link');
		expect(social[0]?.getAttribute('aria-label')).toBe('Twitter');
		expect(social[0]?.querySelector('.pds-visually-hidden')?.textContent).toBe(
			'Twitter',
		);
	});

	it('omits the status pulse when status is not provided', () => {
		const container = render(
			<Footer sections={[productSection]} variant="mega" />,
		);
		expect(container.querySelector('.pds-footer-mega__status')).toBeNull();
	});

	it('omits the social list when none are provided', () => {
		const container = render(
			<Footer sections={[productSection]} variant="mega" />,
		);
		expect(container.querySelector('.pds-footer-mega__social')).toBeNull();
	});

	it('uses a ReactNode icon when supplied rather than the pds icon name', () => {
		const container = render(
			<Footer
				sections={[
					{
						links: [
							{
								href: '/x',
								icon: <span data-testid="custom-icon">★</span>,
								label: 'Featured',
							},
						],
						title: 'Highlight',
					},
				]}
				variant="mega"
			/>,
		);
		expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
	});
});
