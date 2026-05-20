import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AnnotatedHeadline,
	AnnotatedText,
	ArticleCard,
	ArticleCardGrid,
	CoverageMap,
	FaqSection,
	LogoCloud,
	ProcessTimeline,
	SignupPanel,
	TeamGrid,
	TestimonialBand,
} from './page-blocks';

const meta = {
	title: 'Page Blocks/Marketing',
	tags: ['autodocs', 'ai-generated'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Marketing-website section blocks. All are theme-aware via tokens and render through both Pikaboo and Cortexx/Primedia themes — switch via the toolbar.',
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LogoCloudBand: Story = {
	render: () => (
		<LogoCloud
			eyebrow="Trusted by teams running real campaigns"
			items={[
				'PRIMEDIA',
				'SHOPRITE',
				'TAKEALOT',
				'STANDARD BANK',
				'NEDBANK',
				'VODACOM',
			]}
			title="Trusted by teams running real campaigns"
			variant="band"
		/>
	),
};

export const FaqAccordion: Story = {
	render: () => (
		<FaqSection
			defaultOpenId="ground"
			eyebrow="FAQ"
			faqs={[
				{
					answer:
						'We don’t sell inventory. We score it, verify it, and tell you exactly which panels move the audience you’re paying for — then hand you a proposal you can ship.',
					id: 'ground',
					question: 'How is Pikaboo different from a media buyer?',
				},
				{
					answer:
						'FOONA is our ground-truth verification network — community captains who physically check billboard panels, POIs, and audience proxies. They earn per verified job.',
					id: 'foona',
					question: 'What’s FOONA, and who runs it?',
				},
				{
					answer:
						'Today, yes — Johannesburg, Cape Town, eThekwini, with Langa and Khayelitsha as the originating fields. Lagos and Nairobi are next.',
					id: 'regions',
					question: 'Do you only operate in South Africa?',
				},
				{
					answer:
						'Every campaign exports a trust pack (PDF + slide deck) with audience attribution, panel coverage, and a first-draft proposal.',
					id: 'export',
					question: 'Can my team export proposals straight from the app?',
				},
			]}
			title="Things people ask us."
			variant="accordion"
		/>
	),
};

export const NewsletterSignup: Story = {
	render: () => (
		<div style={{ background: 'var(--theme-page-bg)', padding: '4rem 2rem' }}>
			<SignupPanel
				description="Real numbers from real campaigns. No fluff, no sales pitch. Unsubscribe in one click."
				disclaimer="~1 email a month. We never share your address."
				eyebrow="Field notes"
				onNewsletterSubmit={async ({ email }) =>
					new Promise((resolve) => {
						console.log('newsletter signup', email);
						setTimeout(resolve, 400);
					})
				}
				placeholder="you@email.com"
				submitLabel="Subscribe"
				title="What we’re learning, monthly."
				variant="newsletter"
			/>
		</div>
	),
};

export const NewsletterSignupLightScheme: Story = {
	render: () => (
		<div style={{ background: 'var(--theme-page-bg)', padding: '4rem 2rem' }}>
			<SignupPanel
				description="Real numbers from real campaigns. No fluff, no sales pitch."
				disclaimer="~1 email a month."
				eyebrow="Field notes"
				onNewsletterSubmit={async () => undefined}
				placeholder="you@email.com"
				scheme="light"
				submitLabel="Subscribe"
				title="What we’re learning, monthly."
				variant="newsletter"
			/>
		</div>
	),
};

export const NewsletterSignupPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<div style={{ background: 'var(--theme-page-bg)', padding: '4rem 2rem' }}>
			<SignupPanel
				description="Real numbers from real campaigns."
				disclaimer="~1 email a month."
				eyebrow="Field notes"
				onNewsletterSubmit={async () => undefined}
				placeholder="you@email.com"
				submitLabel="Subscribe"
				title="What we’re learning, monthly."
				variant="newsletter"
			/>
		</div>
	),
};

export const TestimonialPull: Story = {
	render: () => (
		<TestimonialBand
			accentDoodle="squiggle"
			authorAvatar={
				<div
					style={{
						width: '100%',
						height: '100%',
						background: 'linear-gradient(135deg, #E03381, #6B3FE4)',
					}}
				/>
			}
			authorName="Naledi Khumalo"
			authorRole="Head of OOH · Primedia Outdoor"
			eyebrow="What clients say"
			photo={
				<div
					style={{
						width: '100%',
						height: '100%',
						background: 'linear-gradient(135deg, #E03381, #6B3FE4)',
					}}
				/>
			}
			quote="Pikaboo cut our brief-to-proposal cycle from three weeks to a single afternoon. The recommendations land closer to brief than anything we’ve used."
			variant="pull"
		/>
	),
};

export const AnnotatedHeadlineExample: Story = {
	render: () => (
		<AnnotatedHeadline
			body="Pikaboo grew out of Langa and Khayelitsha first — built by people who actually walk these streets."
			doodles={[
				{ position: 'top-right', type: 'crown' },
				{ position: 'bottom-left', type: 'arrows' },
			]}
			eyebrow="Our story"
			headline={
				<>
					We were born in the{' '}
					<AnnotatedText annotation="squiggle">townships</AnnotatedText>,<br />
					not the boardrooms.
				</>
			}
		/>
	),
};

export const ProcessTimelineExample: Story = {
	render: () => (
		<ProcessTimeline
			eyebrow="How it works"
			headline="Brief to proposal in under 24 hours."
			steps={[
				{
					description: 'Tell us audience, geography, budget. 5 minutes.',
					icon: 'check',
					title: 'Brief',
				},
				{
					description: 'Our engine ranks every panel against your audience.',
					icon: 'spark',
					title: 'Score',
				},
				{
					description: 'FOONA captains check inventory on the ground.',
					icon: 'users',
					title: 'Verify',
				},
				{
					description: 'Proposal-ready trust pack lands in your inbox.',
					icon: 'download',
					title: 'Export',
				},
			]}
		/>
	),
};

export const TeamGridExample: Story = {
	render: () => (
		<TeamGrid
			eyebrow="Who we are"
			headline="Built by people who live where the billboards are."
			linkHref="/team"
			linkLabel="Meet the full team"
			people={[
				{
					bio: 'Ex-Shoprite Group. Built the first FOONA pilots in Langa.',
					brandTag: 'Pikaboo',
					name: 'Sipho Mbeki',
					role: 'Co-founder & CEO',
					tone: 'purple',
				},
				{
					bio: 'Data science lead. Previously at AWS Cape Town.',
					brandTag: 'Pikaboo',
					name: 'Aisha Patel',
					role: 'Head of Intelligence',
					tone: 'magenta',
				},
				{
					bio: '10+ years running on-the-ground retail audits.',
					brandTag: 'Pikaboo',
					name: 'Themba Dlamini',
					role: 'Head of Field Ops',
					tone: 'slate',
				},
				{
					bio: 'Built the Pikaboo + CortexX tenant-isolated platform.',
					brandTag: 'Pikaboo',
					name: 'Reza Kader',
					role: 'Product Engineering',
					tone: 'purple',
				},
			]}
		/>
	),
};

export const ArticleCards: Story = {
	render: () => (
		<ArticleCardGrid
			eyebrow="Latest"
			headline="From the field."
			items={[
				{
					href: '/case-shoprite',
					kind: 'Case study',
					readingTime: '6 min read',
					title: 'How Shoprite reached 4M shoppers with 38% less spend.',
					tone: 'purple',
				},
				{
					href: '/field-langa',
					kind: 'Field notes',
					readingTime: '4 min read',
					title: 'Five days in Langa: what FOONA captains actually see.',
					tone: 'magenta',
				},
				{
					href: '/trust-packs-v2',
					kind: 'Product update',
					readingTime: '3 min read',
					title: 'Trust packs v2 — auto-attached audience attribution.',
					tone: 'slate',
				},
			]}
			linkHref="/blog"
			linkLabel="All stories"
		/>
	),
};

export const SingleArticleCard: Story = {
	render: () => (
		<div style={{ maxWidth: 360, padding: '2rem' }}>
			<ArticleCard
				href="#"
				kind="Case study"
				readingTime="6 min read"
				title="How Shoprite reached 4M shoppers with 38% less spend."
				tone="purple"
			/>
		</div>
	),
};

export const AnnotatedHeadlinePikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<AnnotatedHeadline
			body="Same component, dark theme."
			doodles={[{ position: 'top-right', type: 'crown' }]}
			eyebrow="Our story"
			headline={
				<>
					We were born in the{' '}
					<AnnotatedText annotation="squiggle">townships</AnnotatedText>.
				</>
			}
		/>
	),
};

export const ProcessTimelinePikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<ProcessTimeline
			eyebrow="How it works"
			headline="Brief to proposal in under 24 hours."
			steps={[
				{ description: '5 minutes.', icon: 'check', title: 'Brief' },
				{ description: 'Engine scores panels.', icon: 'spark', title: 'Score' },
				{ description: 'Captains verify.', icon: 'users', title: 'Verify' },
				{ description: 'Trust pack lands.', icon: 'download', title: 'Export' },
			]}
		/>
	),
};

export const TeamGridPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<TeamGrid
			eyebrow="Who we are"
			headline="Built by people who live where the billboards are."
			people={[
				{
					bio: 'Built the first FOONA pilots.',
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
		/>
	),
};

export const ArticleCardsPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<ArticleCardGrid
			eyebrow="Latest"
			headline="From the field."
			items={[
				{
					href: '/case-shoprite',
					kind: 'Case study',
					readingTime: '6 min read',
					title: 'How Shoprite reached 4M shoppers with 38% less spend.',
					tone: 'purple',
				},
				{
					href: '/field-langa',
					kind: 'Field notes',
					readingTime: '4 min read',
					title: 'Five days in Langa.',
					tone: 'magenta',
				},
			]}
		/>
	),
};

export const FaqAccordionPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<FaqSection
			defaultOpenId="a"
			eyebrow="FAQ"
			faqs={[
				{ answer: 'Answer A.', id: 'a', question: 'Question A?' },
				{ answer: 'Answer B.', id: 'b', question: 'Question B?' },
			]}
			title="Things people ask us."
			variant="accordion"
		/>
	),
};

export const TestimonialPullPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<TestimonialBand
			accentDoodle="squiggle"
			authorAvatar={
				<div
					style={{
						width: '100%',
						height: '100%',
						background:
							'linear-gradient(135deg, var(--theme-brand-magenta), var(--theme-primary))',
					}}
				/>
			}
			authorName="Naledi Khumalo"
			authorRole="Head of OOH"
			eyebrow="What clients say"
			photo={
				<div
					style={{
						width: '100%',
						height: '100%',
						background:
							'linear-gradient(135deg, var(--theme-brand-magenta), var(--theme-primary))',
					}}
				/>
			}
			quote="Pikaboo cut our brief-to-proposal cycle from three weeks to a single afternoon."
			variant="pull"
		/>
	),
};

export const LogoCloudBandPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
		<LogoCloud
			eyebrow="Trusted by teams running real campaigns"
			items={['PRIMEDIA', 'SHOPRITE', 'TAKEALOT', 'STANDARD BANK']}
			title="Trusted by teams"
			variant="band"
		/>
	),
};

export const CoverageMapPikabooDark: Story = {
	globals: { theme: 'pikaboo-dark' },
	render: () => (
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
			headline="Where the network lives."
		/>
	),
};

export const CoverageMapExample: Story = {
	render: () => (
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
					detail: '4,100 panels',
					id: 'ethekwini',
					name: 'eThekwini',
					status: 'live',
					x: 60,
					y: 78,
				},
				{
					detail: '6,800 panels',
					id: 'cpt',
					name: 'Cape Town',
					status: 'live',
					x: 30,
					y: 90,
				},
				{
					detail: 'Q3 2026',
					id: 'polokwane',
					name: 'Polokwane',
					status: 'soon',
					x: 86,
					y: 56,
				},
				{
					detail: 'Q4 2026',
					id: 'saldanha',
					name: 'Saldanha',
					status: 'soon',
					x: 14,
					y: 86,
				},
			]}
			eyebrow="Coverage"
			headline="Where the network lives."
		/>
	),
};
