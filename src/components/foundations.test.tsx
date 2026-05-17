import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ThemeProvider } from '../theme';
import {
	Cluster,
	Container,
	Footer,
	Grid,
	GridItem,
	Icon,
	IconButton,
	pdsIconNames,
	Stack,
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

describe('foundation layout, icons, and footer', () => {
	it('exports stable grid primitives with predictable classes', () => {
		const container = render(
			<Container width="lg">
				<Grid columns={12} gap="lg">
					<GridItem span={7}>Main</GridItem>
					<GridItem span={5}>Aside</GridItem>
				</Grid>
				<Stack gap="sm">Stacked</Stack>
				<Cluster justify="between">Clustered</Cluster>
			</Container>,
		);

		expect(container.querySelector('.pds-container--lg')).toBeTruthy();
		expect(container.querySelector('.pds-grid--12')).toBeTruthy();
		expect(container.querySelector('.pds-grid--gap-lg')).toBeTruthy();
		expect(container.querySelector('.pds-grid-item--span-7')).toBeTruthy();
		expect(container.querySelector('.pds-stack--gap-sm')).toBeTruthy();
		expect(
			container.querySelector('.pds-cluster--justify-between'),
		).toBeTruthy();
	});

	it('renders named icons and icon buttons from the shared icon palette', () => {
		const container = render(
			<div>
				<Icon name="search" title="Search" />
				<IconButton icon="settings" label="Settings" variant="outline" />
			</div>,
		);

		expect(pdsIconNames).toContain('search');
		expect(pdsIconNames).toContain('whatsapp');
		expect(container.querySelector('svg[role="img"]')).toBeTruthy();
		expect(
			container.querySelector('button[aria-label="Settings"] .pds-icon'),
		).toBeTruthy();
	});

	it('renders a branded footer that works in Pikaboo dark mode', () => {
		const container = render(
			<ThemeProvider theme="pikaboo-dark">
				<Footer
					legalLinks={[{ href: '/privacy', label: 'Privacy' }]}
					sections={[
						{
							links: [
								{ href: '/platform', label: 'Platform' },
								{ href: '/contact', label: 'Contact' },
							],
							title: 'Product',
						},
					]}
					socialLinks={[
						{ href: 'https://wa.me/27100000000', label: 'WhatsApp' },
					]}
				/>
			</ThemeProvider>,
		);

		expect(container.querySelector('[data-theme="pikaboo-dark"]')).toBeTruthy();
		expect(container.textContent).toContain(
			'Building the ultimate dataset for Africa',
		);
		expect(container.textContent).toContain('Platform');
		expect(container.textContent).toContain('Privacy');
		expect(container.textContent).toContain('WhatsApp');
	});
});
