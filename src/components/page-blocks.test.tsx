import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	AnnotatedHeadline,
	AnnotatedText,
	ArticleCard,
	ArticleCardGrid,
	ContactStrip,
	CoverageMap,
	coverageMapSilhouettes,
	DonationPanel,
	FaqSection,
	FeatureGrid,
	FinalCta,
	LogoCloud,
	PageHero,
	PageTemplate,
	PricingSection,
	ProcessTimeline,
	ReliefImpactSection,
	SignupPanel,
	StatsStrip,
	TeamGrid,
	TestimonialBand,
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

const setReactInputValue = (input: HTMLInputElement, value: string) => {
	const setter = Object.getOwnPropertyDescriptor(
		window.HTMLInputElement.prototype,
		'value',
	)?.set;
	setter?.call(input, value);
	input.dispatchEvent(new Event('input', { bubbles: true }));
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

	it('renders the LogoCloud band variant with eyebrow and items', () => {
		const container = render(
			<LogoCloud
				eyebrow="Trusted by"
				items={['PRIMEDIA', 'SHOPRITE', 'TAKEALOT']}
				title="Trusted by teams running real campaigns"
				variant="band"
			/>,
		);
		const section = container.querySelector('.pds-logo-cloud');
		expect(section?.classList.contains('pds-logo-cloud--band')).toBe(true);
		expect(container.textContent).toContain('Trusted by');
		expect(container.textContent).toContain('PRIMEDIA');
		// Title is rendered visually hidden in band variant.
		expect(container.querySelector('h2')).toBeNull();
		expect(container.querySelector('.pds-visually-hidden')?.textContent).toBe(
			'Trusted by teams running real campaigns',
		);
	});

	it('renders the FaqSection accordion variant with single-open behaviour', () => {
		const container = render(
			<FaqSection
				eyebrow="FAQ"
				faqs={[
					{ answer: 'Answer one.', id: 'a', question: 'Q1' },
					{ answer: 'Answer two.', id: 'b', question: 'Q2' },
				]}
				title="Things people ask"
				variant="accordion"
			/>,
		);
		const triggers = container.querySelectorAll('.pds-faq-accordion__trigger');
		expect(triggers.length).toBe(2);
		expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');

		act(() => {
			triggers[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true');
		expect(triggers[1]?.getAttribute('aria-expanded')).toBe('false');

		act(() => {
			triggers[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		// Single-open: opening trigger[1] closes trigger[0].
		expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');
		expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');

		act(() => {
			triggers[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(triggers[1]?.getAttribute('aria-expanded')).toBe('false');
	});

	it('honours defaultOpenId on the FaqSection accordion variant', () => {
		const container = render(
			<FaqSection
				defaultOpenId="b"
				faqs={[
					{ answer: 'A1', id: 'a', question: 'Q1' },
					{ answer: 'A2', id: 'b', question: 'Q2' },
				]}
				variant="accordion"
			/>,
		);
		const triggers = container.querySelectorAll('.pds-faq-accordion__trigger');
		expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');
		expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
	});

	it('renders the SignupPanel newsletter variant and submits the email', async () => {
		const submissions: { email: string }[] = [];
		const container = render(
			<SignupPanel
				description="Real numbers."
				eyebrow="Field notes"
				onNewsletterSubmit={(values) => {
					submissions.push(values);
				}}
				placeholder="you@pikaboo.ai"
				submitLabel="Join"
				title="What we're learning"
				variant="newsletter"
			/>,
		);
		expect(
			container
				.querySelector('.pds-signup-panel')
				?.classList.contains('pds-signup-panel--newsletter'),
		).toBe(true);
		expect(container.textContent).toContain('Field notes');
		expect(container.textContent).toContain('Real numbers.');

		const input = container.querySelector(
			'.pds-signup-panel__input',
		) as HTMLInputElement;
		const form = container.querySelector('form') as HTMLFormElement;
		expect(input.placeholder).toBe('you@pikaboo.ai');

		act(() => {
			setReactInputValue(input, 'hello@pikaboo.ai');
		});

		await act(async () => {
			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true }),
			);
		});
		expect(submissions).toEqual([{ email: 'hello@pikaboo.ai' }]);
		expect(container.textContent).toContain("you're subscribed");
	});

	it('defaults to scheme="dark" for the newsletter variant', () => {
		const container = render(
			<SignupPanel onNewsletterSubmit={() => undefined} variant="newsletter" />,
		);
		const section = container.querySelector('.pds-signup-panel');
		expect(section?.classList.contains('pds-signup-panel--scheme-dark')).toBe(
			true,
		);
		expect(section?.getAttribute('data-scheme')).toBe('dark');
	});

	it('applies the scheme="light" class to the newsletter variant', () => {
		const container = render(
			<SignupPanel
				onNewsletterSubmit={() => undefined}
				scheme="light"
				variant="newsletter"
			/>,
		);
		const section = container.querySelector('.pds-signup-panel');
		expect(section?.classList.contains('pds-signup-panel--scheme-light')).toBe(
			true,
		);
		expect(section?.classList.contains('pds-signup-panel--scheme-dark')).toBe(
			false,
		);
		expect(section?.getAttribute('data-scheme')).toBe('light');
	});

	it('shows an error when newsletter submit is attempted with empty email', async () => {
		const container = render(
			<SignupPanel
				onNewsletterSubmit={() => undefined}
				placeholder="email"
				variant="newsletter"
			/>,
		);
		const form = container.querySelector('form') as HTMLFormElement;
		await act(async () => {
			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true }),
			);
		});
		expect(container.textContent).toContain('Please enter an email address.');
	});

	it('surfaces submission errors thrown by the newsletter handler', async () => {
		const container = render(
			<SignupPanel
				onNewsletterSubmit={() => {
					throw new Error('Boom');
				}}
				variant="newsletter"
			/>,
		);
		const input = container.querySelector(
			'.pds-signup-panel__input',
		) as HTMLInputElement;
		const form = container.querySelector('form') as HTMLFormElement;
		act(() => {
			setReactInputValue(input, 'a@b.co');
		});
		await act(async () => {
			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true }),
			);
		});
		expect(container.textContent).toContain('Boom');
	});

	it('renders the TestimonialBand pull variant with photo, quote, attribution, and doodle', () => {
		const container = render(
			<TestimonialBand
				accentDoodle="squiggle"
				authorAvatar={<img alt="" data-testid="avatar" src="" />}
				authorName="Naledi Khumalo"
				authorRole="Head of OOH"
				eyebrow="What clients say"
				photo={<img alt="" data-testid="photo" src="" />}
				quote="Pikaboo cut our cycle to a single afternoon."
				variant="pull"
			/>,
		);
		const section = container.querySelector('.pds-testimonial-band');
		expect(section?.classList.contains('pds-testimonial-band--pull')).toBe(
			true,
		);
		expect(container.textContent).toContain('Naledi Khumalo');
		expect(container.textContent).toContain('Head of OOH');
		expect(container.textContent).toContain('Pikaboo cut');
		expect(container.querySelector('[data-testid="photo"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="avatar"]')).toBeTruthy();
		expect(
			container
				.querySelector('.pds-testimonial-band__doodle')
				?.classList.contains('pds-testimonial-band__doodle--squiggle'),
		).toBe(true);
	});

	it('falls back to the default TestimonialBand layout when no variant is set', () => {
		const container = render(
			<TestimonialBand attribution="— Field op" quote="Real numbers." />,
		);
		const section = container.querySelector('.pds-testimonial-band');
		expect(section?.classList.contains('pds-testimonial-band--pull')).toBe(
			false,
		);
		expect(container.querySelector('blockquote')).toBeTruthy();
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

describe('AnnotatedHeadline', () => {
	it('renders eyebrow, headline, body, and the requested doodles', () => {
		const container = render(
			<AnnotatedHeadline
				body="Pikaboo grew out of Langa and Khayelitsha first."
				doodles={[
					{ position: 'top-right', type: 'crown' },
					{ position: 'bottom-left', type: 'arrows' },
				]}
				eyebrow="Our story"
				headline={
					<>
						We were born in the{' '}
						<AnnotatedText annotation="squiggle">townships</AnnotatedText>.
					</>
				}
			/>,
		);
		const headline = container.querySelector(
			'.pds-annotated-headline__headline',
		);
		expect(headline?.textContent).toContain('We were born in the');
		expect(headline?.textContent).toContain('townships');
		expect(container.textContent).toContain('Our story');
		expect(container.textContent).toContain('Pikaboo grew out');
		expect(
			container.querySelectorAll('.pds-annotated-headline__doodle').length,
		).toBe(2);
		expect(
			container.querySelector('.pds-annotated-headline__doodle--crown'),
		).toBeTruthy();
		expect(
			container.querySelector('.pds-annotated-headline__doodle--arrows'),
		).toBeTruthy();
	});

	it('omits eyebrow and body when not provided', () => {
		const container = render(<AnnotatedHeadline headline="Hello" />);
		expect(
			container.querySelector('.pds-annotated-headline__eyebrow'),
		).toBeNull();
		expect(container.querySelector('.pds-annotated-headline__body')).toBeNull();
	});

	it('renders the squiggle SVG inside annotated tokens', () => {
		const container = render(
			<AnnotatedHeadline
				headline={
					<AnnotatedText annotation="squiggle">townships</AnnotatedText>
				}
			/>,
		);
		expect(
			container.querySelector('.pds-annotated-headline__squiggle'),
		).toBeTruthy();
	});

	it('applies highlight class when AnnotatedText annotation is highlight', () => {
		const container = render(
			<AnnotatedHeadline
				headline={
					<AnnotatedText annotation="highlight">measurable</AnnotatedText>
				}
			/>,
		);
		expect(
			container.querySelector('.pds-annotated-headline__token--highlight'),
		).toBeTruthy();
	});
});

describe('ProcessTimeline', () => {
	it('renders each step with title, description, icon, and auto-numbered label', () => {
		const container = render(
			<ProcessTimeline
				eyebrow="How it works"
				headline="Brief to proposal in 24 hours"
				steps={[
					{ description: 'Tell us audience.', icon: 'check', title: 'Brief' },
					{ description: 'Score panels.', icon: 'spark', title: 'Score' },
					{
						description: 'Verify on the ground.',
						icon: 'users',
						title: 'Verify',
					},
					{
						description: 'Export the trust pack.',
						icon: 'download',
						title: 'Export',
					},
				]}
			/>,
		);
		const steps = container.querySelectorAll('.pds-process-timeline__step');
		expect(steps.length).toBe(4);
		expect(container.textContent).toContain('How it works');
		expect(container.textContent).toContain('Brief to proposal in 24 hours');
		expect(container.textContent).toContain('Brief');
		expect(container.textContent).toContain('Score');
		expect(container.textContent).toContain('01');
		expect(container.textContent).toContain('04');
	});

	it('renders custom step numbers when provided', () => {
		const container = render(
			<ProcessTimeline
				steps={[
					{ number: 'A', title: 'Brief' },
					{ number: 'B', title: 'Score' },
				]}
			/>,
		);
		const numbers = container.querySelectorAll('.pds-process-timeline__number');
		expect(numbers[0]?.textContent).toBe('A');
		expect(numbers[1]?.textContent).toBe('B');
	});

	it('accepts ReactNode icons in addition to PDS icon names', () => {
		const container = render(
			<ProcessTimeline
				steps={[
					{
						icon: <span data-testid="custom-icon">★</span>,
						title: 'Custom',
					},
				]}
			/>,
		);
		expect(container.querySelector('[data-testid="custom-icon"]')).toBeTruthy();
	});

	it('omits the section header when neither eyebrow nor headline is provided', () => {
		const container = render(<ProcessTimeline steps={[{ title: 'Brief' }]} />);
		expect(container.querySelector('.pds-page-section-header')).toBeNull();
	});

	it('renders the connector decoration', () => {
		const container = render(
			<ProcessTimeline steps={[{ title: 'A' }, { title: 'B' }]} />,
		);
		expect(
			container.querySelector('.pds-process-timeline__connector'),
		).toBeTruthy();
	});
});

describe('TeamGrid', () => {
	it('renders each team member with name, role, bio, brandTag and tone class', () => {
		const container = render(
			<TeamGrid
				eyebrow="Who we are"
				headline="Built by people who live here"
				people={[
					{
						bio: 'Built the first FOONA pilots.',
						brandTag: 'Pikaboo',
						name: 'Sipho Mbeki',
						role: 'Co-founder & CEO',
						tone: 'purple',
					},
					{
						bio: 'Data science lead.',
						name: 'Aisha Patel',
						role: 'Head of Intelligence',
						tone: 'magenta',
					},
				]}
			/>,
		);
		const people = container.querySelectorAll('.pds-team-grid__person');
		expect(people.length).toBe(2);
		expect(container.textContent).toContain('Sipho Mbeki');
		expect(container.textContent).toContain('Co-founder & CEO');
		expect(container.textContent).toContain('Pikaboo');
		expect(
			people[0]?.classList.contains('pds-team-grid__person--tone-purple'),
		).toBe(true);
		expect(
			people[1]?.classList.contains('pds-team-grid__person--tone-magenta'),
		).toBe(true);
	});

	it('renders a link in the header when linkLabel is provided', () => {
		const container = render(
			<TeamGrid
				headline="Team"
				linkHref="/team"
				linkLabel="Meet the team"
				people={[{ name: 'A' }]}
			/>,
		);
		const link = container.querySelector('.pds-team-grid-section__link');
		expect(link?.getAttribute('href')).toBe('/team');
		expect(link?.textContent).toContain('Meet the team');
	});

	it('falls back to placeholder when no photo is provided', () => {
		const container = render(<TeamGrid people={[{ name: 'A' }]} />);
		expect(
			container.querySelector('.pds-team-grid__photo-placeholder'),
		).toBeTruthy();
	});

	it('uses provided photo node instead of placeholder', () => {
		const container = render(
			<TeamGrid
				people={[{ name: 'A', photo: <img alt="" data-testid="p" src="" /> }]}
			/>,
		);
		expect(container.querySelector('[data-testid="p"]')).toBeTruthy();
		expect(
			container.querySelector('.pds-team-grid__photo-placeholder'),
		).toBeNull();
	});

	it('omits header when no eyebrow, headline, or linkLabel is provided', () => {
		const container = render(<TeamGrid people={[{ name: 'A' }]} />);
		expect(
			container.querySelector('.pds-team-grid-section__header'),
		).toBeNull();
	});
});

describe('ArticleCardGrid', () => {
	it('renders cards with kind, reading time, title, and tone class', () => {
		const container = render(
			<ArticleCardGrid
				eyebrow="Latest"
				headline="From the field"
				items={[
					{
						href: '/case-1',
						kind: 'Case study',
						readingTime: '6 min read',
						title: 'How Shoprite reached 4M shoppers',
						tone: 'purple',
					},
					{
						href: '/notes-1',
						kind: 'Field notes',
						readingTime: '4 min read',
						title: 'Five days in Langa',
						tone: 'magenta',
					},
				]}
			/>,
		);
		const cards = container.querySelectorAll('.pds-article-card');
		expect(cards.length).toBe(2);
		expect(container.textContent).toContain('Case study');
		expect(container.textContent).toContain('6 min read');
		expect(container.textContent).toContain('How Shoprite reached 4M shoppers');
		expect(cards[0]?.classList.contains('pds-article-card--tone-purple')).toBe(
			true,
		);
		expect(cards[1]?.classList.contains('pds-article-card--tone-magenta')).toBe(
			true,
		);
	});

	it('renders standalone ArticleCard with href as anchor', () => {
		const container = render(
			<ArticleCard href="/post-1" kind="Field notes" title="Hello" />,
		);
		const anchor = container.querySelector('.pds-article-card');
		expect((anchor as HTMLAnchorElement | null)?.getAttribute('href')).toBe(
			'/post-1',
		);
	});

	it('renders kind without reading time when omitted', () => {
		const container = render(
			<ArticleCard href="/x" kind="Update" title="Hi" />,
		);
		expect(
			container.querySelector('.pds-article-card__reading-time'),
		).toBeNull();
		expect(container.querySelector('.pds-article-card__separator')).toBeNull();
	});

	it('hides the meta block when neither kind nor reading time is provided', () => {
		const container = render(<ArticleCard href="/x" title="Only title" />);
		expect(container.querySelector('.pds-article-card__meta')).toBeNull();
	});

	it('uses a placeholder media when no image is provided', () => {
		const container = render(<ArticleCard href="/x" title="t" />);
		expect(
			container.querySelector('.pds-article-card__media-placeholder'),
		).toBeTruthy();
	});

	it('renders provided image media instead of placeholder', () => {
		const container = render(
			<ArticleCard
				href="/x"
				image={<img alt="" data-testid="cover" src="" />}
				title="t"
			/>,
		);
		expect(container.querySelector('[data-testid="cover"]')).toBeTruthy();
		expect(
			container.querySelector('.pds-article-card__media-placeholder'),
		).toBeNull();
	});
});

describe('CoverageMap', () => {
	it('renders cities in both the SVG map and the list', () => {
		const container = render(
			<CoverageMap
				cities={[
					{
						detail: '12,400 panels',
						id: 'jhb',
						name: 'Johannesburg',
						status: 'live',
						x: 78,
						y: 70,
					},
					{
						detail: 'Q3 2026',
						id: 'polokwane',
						name: 'Polokwane',
						status: 'soon',
						x: 86,
						y: 56,
					},
				]}
				eyebrow="Coverage"
				headline="Where the network lives"
			/>,
		);
		expect(container.textContent).toContain('Coverage');
		expect(container.textContent).toContain('Johannesburg');
		expect(container.textContent).toContain('12,400 panels');
		expect(container.textContent).toContain('Q3 2026');
		expect(container.querySelectorAll('.pds-coverage-map__pin').length).toBe(2);
		expect(container.querySelectorAll('.pds-coverage-map__city').length).toBe(
			2,
		);
		expect(
			container
				.querySelector('.pds-coverage-map__city--live')
				?.classList.contains('pds-coverage-map__city--live'),
		).toBe(true);
	});

	it('renders the live city badge as "Live" and soon as "Coming"', () => {
		const container = render(
			<CoverageMap
				cities={[
					{ name: 'A', status: 'live', x: 10, y: 10 },
					{ name: 'B', status: 'soon', x: 20, y: 20 },
				]}
			/>,
		);
		const statuses = container.querySelectorAll(
			'.pds-coverage-map__city-status',
		);
		expect(statuses[0]?.textContent).toBe('Live');
		expect(statuses[1]?.textContent).toBe('Coming');
	});

	it('defaults to the south-africa silhouette path', () => {
		const container = render(
			<CoverageMap cities={[{ name: 'A', status: 'live', x: 10, y: 10 }]} />,
		);
		const path = container.querySelector('.pds-coverage-map__silhouette');
		expect(path?.getAttribute('d')).toBe(
			coverageMapSilhouettes['south-africa'],
		);
	});

	it('accepts a custom silhouettePath', () => {
		const container = render(
			<CoverageMap
				cities={[{ name: 'A', status: 'live', x: 10, y: 10 }]}
				silhouettePath="M0 0 L10 0 L10 10 L0 10 Z"
			/>,
		);
		expect(
			container
				.querySelector('.pds-coverage-map__silhouette')
				?.getAttribute('d'),
		).toBe('M0 0 L10 0 L10 10 L0 10 Z');
	});

	it('omits the section header when neither eyebrow nor headline is set', () => {
		const container = render(
			<CoverageMap cities={[{ name: 'A', status: 'live', x: 1, y: 1 }]} />,
		);
		expect(container.querySelector('.pds-page-section-header')).toBeNull();
	});

	it('renders a pin halo only for live cities', () => {
		const container = render(
			<CoverageMap
				cities={[
					{ name: 'A', status: 'live', x: 10, y: 10 },
					{ name: 'B', status: 'soon', x: 20, y: 20 },
				]}
			/>,
		);
		expect(
			container.querySelectorAll('.pds-coverage-map__pin-halo').length,
		).toBe(1);
	});
});
