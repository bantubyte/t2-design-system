import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BrandLockup, PikabooWordmark } from './brand';
import { Button } from './button';
import { MobileMenuSheet, SiteNav, type SiteNavLink } from './navigation';

const meta = {
	title: 'Components/SiteNav',
	component: SiteNav,
	tags: ['autodocs', 'ai-generated'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Marketing-website nav with sticky translucent backdrop. Renders a desktop link row + book-demo CTA, and a mobile menu sheet behind a hamburger toggle below ~810px. Use the dark scheme over violet-ink pages.',
			},
		},
	},
} satisfies Meta<typeof SiteNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLinks: SiteNavLink[] = [
	{
		active: true,
		description: 'Intelligence + FOONA',
		href: '#product',
		label: 'Product',
	},
	{
		description: 'Brief → Score → Verify → Export',
		href: '#how',
		label: 'How it works',
	},
	{
		description: '2M+ commuters · 98% verified',
		href: '#impact',
		label: 'Impact',
	},
	{
		description: 'Born in Langa, built for Africa',
		href: '#story',
		label: 'Story',
	},
	{ description: 'Demo + sales', href: '#contact', label: 'Contact' },
];

export const Playground: Story = {
	args: {
		links: sampleLinks,
		logo: <PikabooWordmark height={26} tone="light" />,
		cta: <Button size="sm">Book demo</Button>,
	},
	render: (args) => (
		<div style={{ minHeight: '120vh', background: '#fffbf5' }}>
			<SiteNav {...args} />
			<div
				style={{
					padding: '4rem 3.75rem',
					color: '#94a3b8',
					textAlign: 'center',
					textTransform: 'uppercase',
					letterSpacing: '0.2em',
					fontSize: 12,
				}}
			>
				↓ Scroll to see the sticky nav over content.
			</div>
		</div>
	),
};

export const DarkSchemeOverHero: Story = {
	args: {
		links: sampleLinks,
		logo: <PikabooWordmark height={26} tone="dark" />,
		cta: <Button size="sm">Book demo</Button>,
		scheme: 'dark',
	},
	render: (args) => (
		<div style={{ background: '#160c32', minHeight: '60vh' }}>
			<SiteNav {...args} />
			<div
				style={{
					padding: '5rem 3.75rem',
					color: '#fff',
					textAlign: 'center',
				}}
			>
				<h1
					style={{
						fontFamily: '"Bricolage Grotesque"',
						fontSize: '4.75rem',
						margin: '0 0 1rem',
						letterSpacing: '-0.02em',
					}}
				>
					Turn billboards into measurable audiences.
				</h1>
			</div>
		</div>
	),
};

export const PikabooDarkTheme: Story = {
	args: {
		links: sampleLinks,
		logo: <PikabooWordmark height={26} tone="light" />,
		cta: <Button size="sm">Book demo</Button>,
	},
	globals: { theme: 'pikaboo-dark' },
	render: (args) => (
		<div style={{ minHeight: '60vh', background: 'var(--theme-page-bg)' }}>
			<SiteNav {...args} />
		</div>
	),
};

export const MobileMenu: Story = {
	args: { links: sampleLinks },
	render: () => {
		const ExampleSheet = () => {
			const [open, setOpen] = useState(true);
			return (
				<div
					style={{
						background: '#160c32',
						color: '#fff',
						height: 640,
						width: 360,
						position: 'relative',
						overflow: 'hidden',
						borderRadius: 28,
						boxShadow: '0 18px 40px rgba(0,0,0,0.2)',
					}}
				>
					<div style={{ height: 36, background: 'rgba(0,0,0,0.3)' }} />
					<div
						style={{
							padding: '1rem 1.25rem',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							borderBottom: '1px solid rgba(255,255,255,0.08)',
						}}
					>
						<BrandLockup
							showTenant={false}
							subtitle=""
							useWordmark
							wordmarkHeight={20}
						/>
						<button
							onClick={() => setOpen((value) => !value)}
							style={{
								width: 36,
								height: 36,
								borderRadius: 8,
								background: 'rgba(255,255,255,0.06)',
								color: '#fff',
								border: 0,
								cursor: 'pointer',
							}}
							type="button"
						>
							☰
						</button>
					</div>
					<MobileMenuSheet
						cta={<Button size="md">Book demo</Button>}
						links={sampleLinks}
						onClose={() => setOpen(false)}
						open={open}
						style={{ position: 'absolute', inset: 0 }}
					/>
				</div>
			);
		};
		return <ExampleSheet />;
	},
};
