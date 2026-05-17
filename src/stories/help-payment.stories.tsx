import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Container,
	HelpCenter,
	PaymentForm,
	SectionHeader,
	ThemeProvider,
} from '../index';

const helpCategories = [
	{
		description: 'Invoices, plans, renewals',
		icon: 'download',
		id: 'billing',
		label: 'Billing',
	},
	{
		description: 'Campaign setup and approvals',
		icon: 'campaign',
		id: 'campaigns',
		label: 'Campaigns',
	},
	{
		description: 'Users, access, and SSO',
		icon: 'users',
		id: 'account',
		label: 'Account',
	},
] as const;

const helpFaqs = [
	{
		answer:
			'Open workspace billing, choose the invoice month, then download the PDF or CSV for reconciliation.',
		categoryId: 'billing',
		featured: true,
		id: 'invoices',
		question: 'Where can I find invoices?',
		tags: ['receipts', 'finance'],
	},
	{
		answer:
			'Campaign drafts can be edited until they are submitted for launch approval. Approved live campaigns should be changed through a revision request.',
		categoryId: 'campaigns',
		id: 'campaign-dates',
		question: 'Can I edit campaign dates?',
		tags: ['planning', 'approval'],
	},
	{
		answer:
			'Invite teammates from organisation settings. New users receive an email invitation and can sign in with Google, GitHub, or email.',
		categoryId: 'account',
		featured: true,
		id: 'teammates',
		question: 'How do I invite a teammate?',
		tags: ['team', 'sso'],
	},
	{
		answer:
			'Exports are available from report headers. Choose PDF for sharing or CSV when the media team needs raw rows.',
		categoryId: 'campaigns',
		id: 'exports',
		question: 'How do I export campaign reports?',
		tags: ['reports', 'csv'],
	},
] as const;

const helpMeta = {
	title: 'Patterns/Help Centre',
	component: HelpCenter,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof HelpCenter>;

export default helpMeta;

type HelpStory = StoryObj<typeof helpMeta>;

export const HelpCentre: HelpStory = {
	args: {
		categories: helpCategories,
		faqs: helpFaqs,
	},
	render: (args) => (
		<ThemeProvider theme="pikaboo">
			<Container className="pds-story-frame" width="xl">
				<SectionHeader
					description="Searchable support, FAQ filtering, quick links, and WhatsApp escalation for product and website surfaces."
					eyebrow="Support"
					title="Help centre"
				/>
				<HelpCenter
					{...args}
					contactActions={[
						{
							description: 'Talk to the support team',
							href: 'https://wa.me/27100000000',
							icon: 'whatsapp',
							label: 'Call us on WhatsApp',
						},
						{
							description: 'Send a structured request',
							href: 'mailto:support@pikaboo.ai',
							icon: 'support',
							label: 'Email support',
						},
					]}
					featuredLinks={[
						{
							description: 'Start with campaign, account, and billing basics',
							href: '#getting-started',
							icon: 'spark',
							label: 'Getting started',
						},
						{
							description: 'Shareable status, report, and approval guidance',
							href: '#operators',
							icon: 'grid',
							label: 'Operator guides',
						},
					]}
				/>
			</Container>
		</ThemeProvider>
	),
};

export const DonationPayment: StoryObj<typeof PaymentForm> = {
	parameters: {
		layout: 'fullscreen',
	},
	render: () => (
		<ThemeProvider theme="pikaboo-dark">
			<Container className="pds-story-frame" width="lg">
				<SectionHeader
					description="A UI-only payment pattern for donations, invoices, deposits, and contribution flows."
					eyebrow="Payments"
					title="Donation form"
				/>
				<PaymentForm
					amountOptions={[
						{ description: 'Starter contribution', label: 'R100', value: 100 },
						{ description: 'Most common', label: 'R250', value: 250 },
						{ description: 'Sustainer', label: 'R500', value: 500 },
						{ description: 'Sponsor', label: 'R1,000', value: 1000 },
					]}
					defaultAmount={250}
					methods={[
						{
							description: 'Card checkout adapter',
							icon: 'check',
							id: 'card',
							label: 'Card',
						},
						{
							description: 'Manual bank transfer',
							icon: 'download',
							id: 'eft',
							label: 'EFT',
						},
					]}
					onSubmit={() => undefined}
					title="Support Pikaboo"
				/>
			</Container>
		</ThemeProvider>
	),
};
