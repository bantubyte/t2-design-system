import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	ContactStrip,
	DonationPanel,
	FaqSection,
	FeatureGrid,
	FinalCta,
	PageHero,
	PageTemplate,
	PricingSection,
	ReliefImpactSection,
	SignupPanel,
	StatsStrip,
	TransparencySection,
} from './index';

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

describe('page blocks', () => {
	it('renders a themed hero with semantic actions', () => {
		const container = render(
			<PageHero
				actions={[
					{ href: '#donate', intent: 'urgent', label: 'Donate now' },
					{ href: '#impact', label: 'See impact', variant: 'secondary' },
				]}
				brand="pikaboo"
				description="Support shelter, food, and recovery work."
				eyebrow="Urgent relief appeal"
				media={<div data-testid="relief-media">Relief image</div>}
				scheme="light"
				title="Help families recover after flooding"
				tone="relief"
			/>,
		);

		expect(container.querySelector('section')?.className).toContain(
			'pds-page-blocks--brand-pikaboo',
		);
		expect(container.querySelector('section')?.className).toContain(
			'pds-page-blocks--tone-relief',
		);
		expect(container.querySelector('h1')?.textContent).toBe(
			'Help families recover after flooding',
		);
		expect(container.querySelector('a[href="#donate"]')?.textContent).toContain(
			'Donate now',
		);
		expect(container.textContent).toContain('Relief image');
	});

	it('composes relief donation content from impact, donation, FAQ, and contact sections', () => {
		const submissions: unknown[] = [];
		const container = render(
			<PageTemplate brand="pikaboo" scheme="light" tone="relief">
				<ReliefImpactSection
					items={[
						{
							description: 'Emergency meals and water',
							label: 'Food and water',
							value: '24h',
						},
						{
							description: 'Temporary safe places to sleep',
							label: 'Shelter',
							value: 'R500',
						},
					]}
				/>
				<DonationPanel
					paymentFormProps={{
						amountOptions: [{ label: 'R250', value: 250 }],
						defaultEmail: 'donor@example.com',
						defaultName: 'Relief Donor',
						onSubmit: (values) => submissions.push(values),
						showMessage: false,
					}}
				/>
				<FaqSection
					faqs={[
						{
							answer: 'Funds are allocated to verified relief partners.',
							id: 'funds',
							question: 'Where does the money go?',
						},
					]}
				/>
				<ContactStrip
					actions={[
						{
							href: 'https://wa.me/27100000000',
							icon: 'whatsapp',
							label: 'Call us on WhatsApp',
						},
					]}
				/>
			</PageTemplate>,
		);

		expect(container.textContent).toContain('Food and water');
		expect(container.textContent).toContain('R250');
		expect(container.textContent).toContain('Where does the money go?');
		expect(container.textContent).toContain('Call us on WhatsApp');

		act(() => {
			(
				container.querySelector('button[type="submit"]') as HTMLButtonElement
			).click();
		});

		expect(submissions).toHaveLength(1);
	});

	it('keeps Primedia/Cortexx blocks blue-led without Pikaboo brand classes', () => {
		const container = render(
			<PageHero
				brand="primedia"
				description="Operational planning for serious media teams."
				scheme="light"
				title="Plan campaigns with Cortexx"
				tone="product"
			/>,
		);

		const className = container.querySelector('section')?.className ?? '';
		expect(className).toContain('pds-page-blocks--brand-primedia');
		expect(className).not.toContain('brand-pikaboo');
		expect(container.textContent).toContain('Plan campaigns with Cortexx');
	});

	it('renders sign-up, pricing, proof, transparency, and CTA blocks', () => {
		const container = render(
			<PageTemplate brand="pikaboo" scheme="dark" tone="serious">
				<StatsStrip items={[{ label: 'Raised', value: 'R124k' }]} />
				<FeatureGrid
					items={[
						{
							description: 'Trusted partner reporting',
							icon: 'check',
							title: 'Transparent',
						},
					]}
				/>
				<PricingSection
					plans={[
						{
							ctaLabel: 'Start',
							features: ['Receipts'],
							name: 'Supporter',
							price: 'R250',
						},
					]}
				/>
				<TransparencySection
					items={[
						{
							description: 'Allocation and receipts are published weekly.',
							title: 'Receipts',
						},
					]}
				/>
				<SignupPanel
					authProps={{ showModeSwitch: false }}
					title="Create an account"
				/>
				<FinalCta
					actions={[{ href: '#donate', intent: 'urgent', label: 'Donate now' }]}
					title="Ready to help?"
				/>
			</PageTemplate>,
		);

		expect(container.textContent).toContain('R124k');
		expect(container.textContent).toContain('Transparent');
		expect(container.textContent).toContain('Supporter');
		expect(container.textContent).toContain('Receipts');
		expect(container.textContent).toContain('Create an account');
		expect(container.textContent).toContain('Ready to help?');
	});
});
