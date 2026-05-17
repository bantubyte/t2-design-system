import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	ContactStrip,
	DonationPanel,
	FaqSection,
	FeatureGrid,
	FeatureSplit,
	FinalCta,
	Footer,
	LogoCloud,
	PageHero,
	PageTemplate,
	PricingSection,
	ReliefImpactSection,
	SignupPanel,
	StatsStrip,
	TestimonialBand,
	ThemeProvider,
	TransparencySection,
} from '../index';

const meta = {
	title: 'Page Blocks/Page Blocks',
	component: PageTemplate,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof PageTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

const suiteLogos = ['Optima', 'Cortexx', 'Primedia', 'Peekaboo'];

const footerSections = [
	{
		links: [
			{ href: '#platform', label: 'Platform' },
			{ href: '#templates', label: 'Templates' },
			{ href: '#support', label: 'Support' },
		],
		title: 'Suite',
	},
	{
		links: [
			{ href: '#privacy', label: 'Privacy' },
			{ href: '#terms', label: 'Terms' },
			{ href: 'https://wa.me/27100000000', label: 'Call us on WhatsApp' },
		],
		title: 'Company',
	},
] as const;

const reliefFaqs = [
	{
		answer:
			'Funds are assigned to verified relief partners for shelter, food, transport, and recovery supplies.',
		id: 'funds',
		question: 'Where does the money go?',
	},
	{
		answer:
			'The host product should connect the payment adapter, receipts, and reconciliation workflow for the campaign.',
		id: 'receipts',
		question: 'Can donors receive receipts?',
	},
	{
		answer:
			'Yes. The same blocks can support public giving, internal pledges, or corporate matching.',
		id: 'matching',
		question: 'Can a company match donations?',
	},
] as const;

function SuiteVisual({
	variant,
}: {
	variant: 'expressive' | 'product' | 'relief' | 'serious';
}) {
	return (
		<div
			aria-hidden="true"
			className={`pds-page-story-visual pds-page-story-visual--${variant}`}
		>
			<div className="pds-page-story-visual__map">
				<span />
				<span />
				<span />
				<span />
			</div>
			<div className="pds-page-story-visual__card pds-page-story-visual__card--top">
				<strong>{variant === 'relief' ? 'R320k' : '82%'}</strong>
				<span>
					{variant === 'relief' ? 'relief raised' : 'plan confidence'}
				</span>
			</div>
			<div className="pds-page-story-visual__card pds-page-story-visual__card--bottom">
				<strong>{variant === 'product' ? 'Cortexx' : 'Live'}</strong>
				<span>
					{variant === 'product' ? 'media intelligence' : 'status signal'}
				</span>
			</div>
		</div>
	);
}

export const PikabooExpressive: Story = {
	render: () => (
		<ThemeProvider theme="pikaboo">
			<PageTemplate
				brand="pikaboo"
				footer={<Footer sections={footerSections} />}
				scheme="light"
				tone="expressive"
			>
				<PageHero
					actions={[
						{ href: '#templates', icon: 'grid', label: 'Explore templates' },
						{ href: '#signup', label: 'Create account', variant: 'secondary' },
					]}
					brand="pikaboo"
					description="A public-facing template for softer expression, product warmth, and the fast path into the wider Pikaboo suite."
					eyebrow="Public expression"
					media={<SuiteVisual variant="expressive" />}
					scheme="light"
					title="Pikaboo pages that still mean business"
					tone="expressive"
					trustNote="Built for launch pages, partner pages, and lightweight product moments."
				/>
				<LogoCloud items={suiteLogos} />
				<FeatureGrid
					description="Compose complete pages without rebuilding hero, proof, contact, and CTA patterns each time."
					items={[
						{
							description:
								'Clear entry points for products that sit under the same suite.',
							icon: 'grid',
							title: 'Suite-aware blocks',
						},
						{
							description:
								'Brand tone can move from playful to serious without changing markup.',
							icon: 'spark',
							title: 'Tone presets',
						},
						{
							description:
								'WhatsApp, support, sign-up, and payment moments are ready to place.',
							icon: 'whatsapp',
							title: 'Action surfaces',
						},
					]}
					title="A page system for real product work"
				/>
				<FeatureSplit
					actions={[
						{ href: '#support', icon: 'support', label: 'Talk to support' },
					]}
					description="Keep the expressive website energy, but anchor it with product proof, readable type, and predictable action placement."
					eyebrow="Brand balance"
					media={<SuiteVisual variant="serious" />}
					title="Less corporate, still credible"
				/>
				<FinalCta
					actions={[
						{
							href: '#signup',
							icon: 'arrow-right',
							label: 'Start from this pattern',
						},
					]}
					description="Use the same block grammar for hero pages, support pages, and product launch pages."
					title="Ship the first page faster"
				/>
			</PageTemplate>
		</ThemeProvider>
	),
};

export const PikabooSerious: Story = {
	render: () => (
		<ThemeProvider theme="pikaboo-dark">
			<PageTemplate
				brand="pikaboo"
				footer={<Footer sections={footerSections} />}
				scheme="dark"
				tone="serious"
			>
				<PageHero
					actions={[
						{ href: '#demo', icon: 'calendar', label: 'Book a demo' },
						{
							href: '#support',
							icon: 'whatsapp',
							label: 'Call us on WhatsApp',
							variant: 'secondary',
						},
					]}
					brand="pikaboo"
					description="A darker Pikaboo surface for higher-trust sales, investor, or enterprise-facing pages."
					eyebrow="Serious Pikaboo"
					media={<SuiteVisual variant="serious" />}
					scheme="dark"
					title="Commercial pages with more gravity"
					tone="serious"
				/>
				<StatsStrip
					items={[
						{ label: 'active markets', value: '9' },
						{ label: 'campaign paths', value: '42' },
						{ label: 'report formats', value: '18' },
					]}
				/>
				<TestimonialBand
					attribution="Product leadership, Pikaboo suite"
					quote="The public brand can feel warmer without losing the seriousness of the operating system underneath."
				/>
				<PricingSection
					plans={[
						{
							ctaLabel: 'Start',
							features: [
								'Public page blocks',
								'Support patterns',
								'Basic reports',
							],
							name: 'Launch',
							price: 'R0',
						},
						{
							ctaLabel: 'Talk to sales',
							features: [
								'Tenant themes',
								'Auth patterns',
								'Campaign components',
							],
							highlighted: true,
							name: 'Suite',
							price: 'Custom',
						},
						{
							ctaLabel: 'View docs',
							features: ['Private package', 'Versioned exports', 'Design QA'],
							name: 'Platform',
							price: 'Internal',
						},
					]}
				/>
			</PageTemplate>
		</ThemeProvider>
	),
};

export const PrimediaProduct: Story = {
	render: () => (
		<ThemeProvider theme="primedia">
			<PageTemplate
				brand="primedia"
				footer={<Footer sections={footerSections} />}
				scheme="light"
				tone="product"
			>
				<PageHero
					actions={[
						{ href: '#signup', icon: 'google', label: 'Sign up with Google' },
						{
							href: '#github',
							icon: 'github',
							label: 'Continue with GitHub',
							variant: 'secondary',
						},
					]}
					brand="primedia"
					description="A blue-led product page for serious media planning, Cortexx intelligence, and operational trust."
					eyebrow="Cortexx product"
					media={<SuiteVisual variant="product" />}
					scheme="light"
					title="Plan campaigns with Cortexx"
					tone="product"
					trustNote="Primedia and Cortexx pages stay away from significant Pikaboo purple."
				/>
				<FeatureGrid
					items={[
						{
							description:
								'Prioritise placements, timing, and proof with calmer decision surfaces.',
							icon: 'campaign',
							title: 'Planning intelligence',
						},
						{
							description:
								'Keep user invites, SSO, and support in the same page language.',
							icon: 'users',
							title: 'Account entry',
						},
						{
							description:
								'Move from launch promises to reportable outcomes without a new pattern.',
							icon: 'chart',
							title: 'Performance proof',
						},
					]}
					title="Corporate without becoming anonymous"
				/>
				<SignupPanel
					authProps={{
						productName: 'Cortexx',
						supportAction: {
							href: 'https://wa.me/27100000000',
							iconLabel: 'WA',
							label: 'Call us on WhatsApp',
						},
					}}
					description="Use the auth adapter for Google, GitHub, and email entry while the host product wires the provider handlers."
					title="Create a Cortexx account"
				/>
				<ContactStrip
					actions={[
						{
							href: 'https://wa.me/27100000000',
							icon: 'whatsapp',
							label: 'Call us on WhatsApp',
						},
						{
							href: 'mailto:sales@primedia.example',
							icon: 'support',
							label: 'Email sales',
							variant: 'secondary',
						},
					]}
					description="Give procurement, media, and operator teams a direct support route."
					title="Need a managed rollout?"
				/>
			</PageTemplate>
		</ThemeProvider>
	),
};

export const ReliefDonation: Story = {
	render: () => (
		<ThemeProvider theme="pikaboo">
			<PageTemplate
				brand="pikaboo"
				footer={<Footer sections={footerSections} />}
				scheme="light"
				tone="relief"
			>
				<PageHero
					actions={[
						{
							href: '#donate',
							icon: 'whatsapp',
							intent: 'urgent',
							label: 'Donate now',
						},
						{ href: '#impact', label: 'See impact', variant: 'secondary' },
					]}
					brand="pikaboo"
					description="A relief landing page pattern for fundraising after flooding, with calmer green recovery cues and restrained red urgency."
					eyebrow="Flood relief"
					media={<SuiteVisual variant="relief" />}
					scheme="light"
					title="Help families recover after flooding"
					tone="relief"
					trustNote="For public donation pages, partner drives, and matched giving campaigns."
				/>
				<ReliefImpactSection
					items={[
						{
							description:
								'Emergency food, drinking water, and basic supplies in the first day.',
							label: 'Food and water',
							value: '24h',
						},
						{
							description:
								'Temporary shelter kits and transport for displaced families.',
							label: 'Safe shelter',
							value: 'R500',
						},
						{
							description:
								'Weekly reporting to help donors understand where support moved.',
							label: 'Transparent updates',
							value: '7d',
						},
					]}
				/>
				<DonationPanel
					description="The host app connects the processor, receipt rules, and donor records."
					paymentFormProps={{
						amountOptions: [
							{ description: 'Meals and water', label: 'R100', value: 100 },
							{ description: 'Most common', label: 'R250', value: 250 },
							{ description: 'Shelter kit', label: 'R500', value: 500 },
							{ description: 'Family support', label: 'R1,000', value: 1000 },
						],
						defaultAmount: 250,
						title: 'Support flood relief',
					}}
					title="Donate to urgent relief"
				/>
				<TransparencySection
					items={[
						{
							description:
								'Partners are verified before their campaign receives public traffic.',
							title: 'Verified partners',
						},
						{
							description:
								'Receipts and allocation summaries can be published by the host product.',
							title: 'Clear receipts',
						},
						{
							description:
								'Urgent copy stays direct without pushing the whole page into alarm.',
							title: 'Measured urgency',
						},
					]}
				/>
				<FaqSection faqs={reliefFaqs} />
			</PageTemplate>
		</ThemeProvider>
	),
};

export const SignupAndDonationFlow: Story = {
	render: () => (
		<ThemeProvider theme="pikaboo-dark">
			<PageTemplate brand="pikaboo" scheme="dark" tone="relief">
				<PageHero
					actions={[
						{ href: '#signup', icon: 'users', label: 'Create donor account' },
						{
							href: '#donate',
							icon: 'arrow-right',
							intent: 'urgent',
							label: 'Give now',
						},
					]}
					brand="pikaboo"
					description="A combined account and payment surface for donor portals, corporate matching, and campaign pledges."
					eyebrow="Account plus payment"
					media={<SuiteVisual variant="relief" />}
					scheme="dark"
					title="Make support easy to repeat"
					tone="relief"
				/>
				<div className="pds-page-story-duo">
					<SignupPanel
						authProps={{
							headline: 'Join the relief circle',
							headlineAccent: 'in one step',
							productName: 'Pikaboo Relief',
							showModeSwitch: false,
							subtitle:
								'Use Google, GitHub, or email to keep receipts and updates together.',
						}}
						description="SSO-ready signup for account-backed giving."
						title="Create a donor account"
					/>
					<DonationPanel
						description="Donation controls beside signup for compact campaign flows."
						paymentFormProps={{
							defaultAmount: 500,
							showMessage: false,
							submitLabel: 'Continue securely',
						}}
						title="Choose a contribution"
					/>
				</div>
			</PageTemplate>
		</ThemeProvider>
	),
};

export const DarkAndLightMatrix: Story = {
	render: () => (
		<div className="pds-page-story-matrix">
			<ThemeProvider theme="pikaboo">
				<PageTemplate brand="pikaboo" scheme="light" tone="expressive">
					<PageHero
						actions={[{ href: '#light', icon: 'spark', label: 'Light page' }]}
						brand="pikaboo"
						description="Warm public page treatment for Pikaboo surfaces."
						media={<SuiteVisual variant="expressive" />}
						scheme="light"
						title="Pikaboo light"
						tone="expressive"
					/>
				</PageTemplate>
			</ThemeProvider>
			<ThemeProvider theme="primedia">
				<PageTemplate brand="primedia" scheme="dark" tone="product">
					<PageHero
						actions={[{ href: '#dark', icon: 'chart', label: 'Dark page' }]}
						brand="primedia"
						description="Blue-led dark mode for corporate product pages."
						media={<SuiteVisual variant="product" />}
						scheme="dark"
						title="Cortexx dark"
						tone="product"
					/>
				</PageTemplate>
			</ThemeProvider>
		</div>
	),
};
