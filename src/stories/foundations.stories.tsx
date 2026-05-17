import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Badge,
	Button,
	Cluster,
	Container,
	Footer,
	Grid,
	GridItem,
	Icon,
	IconButton,
	pdsIconNames,
	SectionHeader,
	Stack,
	Surface,
} from '../components';
import { ThemeProvider, ThemeSwitcher } from '../theme';

const meta = {
	title: 'Foundations/System',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const typeSpecimens = [
	{
		label: 'Display',
		meta: 'Heading font / 64px / 900',
		sample: 'Africa-scale audience intelligence',
		size: 'display',
	},
	{
		label: 'Headline',
		meta: 'Heading font / 40px / 900',
		sample: 'Plan every placement with sharper local signal',
		size: 'headline',
	},
	{
		label: 'Title',
		meta: 'Heading font / 24px / 900',
		sample: 'Campaign performance by market',
		size: 'title',
	},
	{
		label: 'Body',
		meta: 'Body font / 16px / 700',
		sample:
			'Dense product surfaces need calm rhythm, readable contrast, and enough hierarchy for operators to scan without losing detail.',
		size: 'body',
	},
] as const;

export const Typography: Story = {
	render: () => (
		<main className="pds-story-frame pds-foundation-page">
			<Container width="lg">
				<SectionHeader
					actions={<ThemeSwitcher />}
					description="Product typography, tokenized across tenant themes and tuned for dense planning, reporting, and public brand surfaces."
					eyebrow="Foundations"
					title="Typography"
				/>

				<Grid columns={12} gap="lg" style={{ marginTop: '1.5rem' }}>
					<GridItem span={7}>
						<div className="pds-type-scale">
							{typeSpecimens.map((specimen) => (
								<div className="pds-type-specimen" key={specimen.label}>
									<p className="pds-type-specimen__label">{specimen.label}</p>
									<p
										className={`pds-type-specimen__sample pds-type-specimen__sample--${specimen.size}`}
									>
										{specimen.sample}
									</p>
									<p className="pds-type-specimen__meta">{specimen.meta}</p>
								</div>
							))}
						</div>
					</GridItem>
					<GridItem span={5}>
						<Stack gap="lg">
							<Surface>
								<Stack gap="sm">
									<Badge tone="brand">Type Tokens</Badge>
									<h2
										style={{
											fontFamily: 'var(--theme-font-heading)',
											margin: 0,
										}}
									>
										Bricolage for brand bite. Helvetica for operational calm.
									</h2>
									<p className="pds-story-copy" style={{ marginTop: 0 }}>
										Headings carry the Pikaboo personality; body and UI text
										stay deliberately plain for repeated work.
									</p>
								</Stack>
							</Surface>
							<Surface tone="muted">
								<div className="pds-type-meta">
									<span>--theme-font-heading</span>
									<span>--theme-font-body</span>
									<span>--theme-font-ui</span>
								</div>
							</Surface>
						</Stack>
					</GridItem>
				</Grid>
			</Container>
		</main>
	),
};

export const GridSystem: Story = {
	render: () => (
		<main className="pds-story-frame pds-foundation-page">
			<Container width="lg">
				<SectionHeader
					actions={<ThemeSwitcher />}
					description="A 12-column product grid, container widths, stack rhythm, and cluster alignment for repeatable application layout."
					eyebrow="Foundations"
					title="Grid System"
				/>

				<div className="pds-grid-demo" style={{ marginTop: '1.5rem' }}>
					{Array.from({ length: 12 }, (_, index) => (
						<div className="pds-grid-demo__cell" key={index} />
					))}
				</div>

				<Grid columns={12} gap="lg" style={{ marginTop: '1.5rem' }}>
					<GridItem span={7}>
						<Surface>
							<Stack gap="sm">
								<div className="pds-grid-demo__block">span 7</div>
								<h3 style={{ margin: 0 }}>Primary workspace</h3>
								<p className="pds-story-copy" style={{ marginTop: 0 }}>
									Enough width for maps, report tables, and campaign builders.
								</p>
							</Stack>
						</Surface>
					</GridItem>
					<GridItem span={5}>
						<Surface tone="muted">
							<Stack gap="sm">
								<div className="pds-grid-demo__block">span 5</div>
								<h3 style={{ margin: 0 }}>Decision panel</h3>
								<p className="pds-story-copy" style={{ marginTop: 0 }}>
									Room for filters, metrics, and next-best actions.
								</p>
							</Stack>
						</Surface>
					</GridItem>
				</Grid>

				<Cluster gap="sm" justify="between" style={{ marginTop: '1.5rem' }}>
					<Badge tone="brand">Container lg</Badge>
					<Badge tone="info">Grid 12</Badge>
					<Badge tone="accent">Gap lg</Badge>
					<Badge tone="success">Responsive collapse</Badge>
				</Cluster>
			</Container>
		</main>
	),
};

export const Icons: Story = {
	render: () => (
		<main className="pds-story-frame pds-foundation-page">
			<Container width="lg">
				<SectionHeader
					actions={<ThemeSwitcher />}
					description="Named SVG icons and icon-only buttons for tools, nav, SSO, reporting, support, and WhatsApp contact."
					eyebrow="Foundations"
					title="Icon Palette"
				/>

				<Grid columns={12} gap="lg" style={{ marginTop: '1.5rem' }}>
					<GridItem span={8}>
						<div className="pds-icon-palette">
							{pdsIconNames.map((name) => (
								<div className="pds-icon-swatch" key={name}>
									<Icon name={name} size={28} title={name} />
									<span>{name}</span>
								</div>
							))}
						</div>
					</GridItem>
					<GridItem span={4}>
						<Stack gap="lg">
							<Surface>
								<Stack gap="sm">
									<Badge tone="brand">Icon Buttons</Badge>
									<Cluster gap="sm">
										<IconButton
											icon="search"
											label="Search"
											variant="outline"
										/>
										<IconButton
											icon="filter"
											label="Filter"
											variant="outline"
										/>
										<IconButton
											icon="settings"
											label="Settings"
											variant="outline"
										/>
										<IconButton icon="download" label="Download" />
									</Cluster>
								</Stack>
							</Surface>
							<Surface tone="muted">
								<Stack gap="sm">
									<Badge tone="info">SSO and Support</Badge>
									<Button
										leftIcon={<Icon name="google" size={18} />}
										variant="outline"
									>
										Continue with Google
									</Button>
									<Button
										leftIcon={<Icon name="github" size={18} />}
										variant="outline"
									>
										Continue with GitHub
									</Button>
									<Button leftIcon={<Icon name="whatsapp" size={18} />}>
										Call us on WhatsApp
									</Button>
								</Stack>
							</Surface>
						</Stack>
					</GridItem>
				</Grid>
			</Container>
		</main>
	),
};

export const FooterAndDarkMode: Story = {
	render: () => (
		<ThemeProvider theme="pikaboo-dark">
			<div className="pds-dark-foundation">
				<div className="pds-dark-foundation__panel">
					<SectionHeader
						actions={
							<ThemeSwitcher
								options={['pikaboo-dark', 'pikaboo', 'primedia']}
							/>
						}
						description="Website-style Pikaboo dark mode plus a production footer for product and public surfaces."
						eyebrow="Pikaboo Dark"
						title="Footer"
					/>
					<Surface>
						<Grid columns={12} gap="lg">
							<GridItem span={7}>
								<Stack gap="sm">
									<Badge tone="brand">Pikaboo Dark</Badge>
									<h2
										style={{
											fontFamily: 'var(--theme-font-heading)',
											margin: 0,
										}}
									>
										The website palette is now a real design-system theme.
									</h2>
									<p className="pds-story-copy" style={{ marginTop: 0 }}>
										Deep night surfaces, purple brand energy, cyan signal, and
										yellow emphasis all flow through the same token contract.
									</p>
								</Stack>
							</GridItem>
							<GridItem span={5}>
								<Cluster gap="sm">
									<Badge tone="accent">#fdff2e</Badge>
									<Badge tone="info">#2fd7e6</Badge>
									<Badge tone="brand">#8b5cf6</Badge>
								</Cluster>
							</GridItem>
						</Grid>
					</Surface>
					<Footer
						actions={
							<Button
								leftIcon={<Icon name="whatsapp" size={18} />}
								variant="outline"
							>
								Call us on WhatsApp
							</Button>
						}
						sections={[
							{
								links: [
									{ href: '/platform', label: 'Platform' },
									{ href: '/insights', label: 'Insights' },
									{ href: '/campaigns', label: 'Campaigns' },
								],
								title: 'Product',
							},
							{
								links: [
									{ href: '/about', label: 'About' },
									{ href: '/contact', label: 'Contact' },
									{ href: 'https://wa.me/27100000000', label: 'WhatsApp' },
								],
								title: 'Company',
							},
						]}
						socialLinks={[
							{ href: 'https://github.com', label: 'GitHub' },
							{ href: 'https://wa.me/27100000000', label: 'WhatsApp' },
						]}
					/>
				</div>
			</div>
		</ThemeProvider>
	),
};
