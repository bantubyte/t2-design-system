import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLockup } from './brand';
import {
	Footer,
	type FooterLink,
	type FooterSection,
	type FooterStatus,
} from './footer';

const meta = {
	title: 'Components/Footer',
	component: Footer,
	tags: ['autodocs', 'ai-generated'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The default footer is compact (Pikaboo product surfaces). The mega variant is the marketing-website footer with a brand column, four link columns, social icons, and a status pulse.',
			},
		},
	},
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSections: FooterSection[] = [
	{
		title: 'Product',
		links: [
			{ href: '/overview', label: 'Overview' },
			{ href: '/intelligence', label: 'Intelligence engine' },
			{ href: '/foona', label: 'FOONA network' },
			{ href: '/trust-packs', label: 'Trust packs' },
			{ href: '/pricing', label: 'Pricing' },
		],
	},
	{
		title: 'Company',
		links: [
			{ href: '/story', label: 'Story' },
			{ href: '/team', label: 'Team' },
			{ href: '/careers', label: 'Careers' },
			{ href: '/press', label: 'Press' },
			{ href: '/field-notes', label: 'Field notes' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ href: '/case-studies', label: 'Case studies' },
			{ href: '/docs', label: 'Documentation' },
			{ href: '/api', label: 'API' },
			{ href: '/brand', label: 'Brand kit' },
			{ href: '/support', label: 'Support' },
		],
	},
	{
		title: 'Legal',
		links: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/terms', label: 'Terms' },
			{ href: '/cookies', label: 'Cookies' },
			{ href: '/popi', label: 'POPI Act' },
			{ href: '/dpa', label: 'DPA' },
		],
	},
];

const sampleSocialLinks: FooterLink[] = [
	{ href: 'https://twitter.com/pikaboo', icon: 'twitter', label: 'Twitter' },
	{
		href: 'https://linkedin.com/company/pikaboo',
		icon: 'linkedin',
		label: 'LinkedIn',
	},
	{ href: 'https://github.com/pikaboo', icon: 'github', label: 'GitHub' },
];

const operationalStatus: FooterStatus = {
	label: 'All systems operational',
	tone: 'operational',
};

export const Playground: Story = {
	args: {
		brand: (
			<BrandLockup showTenant={false} subtitle="The OOH intelligence layer." />
		),
		sections: sampleSections,
		legalLinks: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/terms', label: 'Terms' },
		],
	},
};

export const Mega: Story = {
	args: {
		copyright: '© 2026 Timbuk2.ai · Built in Johannesburg, ZA',
		legalLinks: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/terms', label: 'Terms' },
		],
		sections: sampleSections,
		socialLinks: sampleSocialLinks,
		status: operationalStatus,
		tagline:
			'The intelligence layer for out-of-home media. Built in Johannesburg, scored for performance.',
		variant: 'mega',
	},
};

export const MegaDegradedStatus: Story = {
	args: {
		...Mega.args,
		status: { label: 'Investigating elevated latency', tone: 'degraded' },
	},
};

export const MegaLightScheme: Story = {
	args: {
		...Mega.args,
		scheme: 'light',
	},
};

export const MegaPikabooDark: Story = {
	args: Mega.args,
	globals: { theme: 'pikaboo-dark' },
};
