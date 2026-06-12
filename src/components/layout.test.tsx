import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Cluster,
	Container,
	Grid,
	GridItem,
	PageShell,
	SectionHeader,
	Stack,
	Toolbar,
} from './layout';

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

describe('Container', () => {
	it('renders with default width', () => {
		const container = render(<Container>Content</Container>);
		const el = container.querySelector('.pds-container');
		expect(el).toBeTruthy();
		expect(el?.classList.contains('pds-container--xl')).toBe(true);
	});
});

describe('Grid', () => {
	it('renders with grid classes', () => {
		const container = render(
			<Grid columns={4} gap="sm">
				<GridItem span={2}>Item 1</GridItem>
			</Grid>,
		);
		const grid = container.querySelector('.pds-grid');
		expect(grid?.classList.contains('pds-grid--4')).toBe(true);
		expect(grid?.classList.contains('pds-grid--gap-sm')).toBe(true);

		const item = container.querySelector('.pds-grid-item');
		expect(item?.classList.contains('pds-grid-item--span-2')).toBe(true);
	});
});

describe('Stack and Cluster', () => {
	it('renders Stack', () => {
		const container = render(
			<Stack align="center" gap="lg">
				Stack
			</Stack>,
		);
		const stack = container.querySelector('.pds-stack');
		expect(stack?.classList.contains('pds-stack--gap-lg')).toBe(true);
		expect(stack?.classList.contains('pds-stack--align-center')).toBe(true);
	});

	it('renders Cluster', () => {
		const container = render(
			<Cluster gap="md" justify="between">
				Cluster
			</Cluster>,
		);
		const cluster = container.querySelector('.pds-cluster');
		expect(cluster?.classList.contains('pds-cluster--gap-md')).toBe(true);
		expect(cluster?.classList.contains('pds-cluster--justify-between')).toBe(
			true,
		);
	});
});

describe('PageShell, SectionHeader, Toolbar', () => {
	it('renders PageShell components', () => {
		const container = render(
			<PageShell aside={<div>Aside</div>} header={<div>Header</div>}>
				Main Content
			</PageShell>,
		);
		expect(container.querySelector('.pds-page-shell__aside')?.textContent).toBe(
			'Aside',
		);
		expect(
			container.querySelector('.pds-page-shell__header')?.textContent,
		).toBe('Header');
		expect(
			container.querySelector('.pds-page-shell__main')?.textContent,
		).toContain('Main Content');
	});

	it('renders SectionHeader', () => {
		const container = render(
			<SectionHeader
				actions={<button type="button">Action</button>}
				description="Desc"
				eyebrow="Eyebrow"
				title="Title"
			/>,
		);
		expect(
			container.querySelector('.pds-section-header__title')?.textContent,
		).toBe('Title');
		expect(
			container.querySelector('.pds-section-header__eyebrow')?.textContent,
		).toBe('Eyebrow');
		expect(
			container.querySelector('.pds-section-header__description')?.textContent,
		).toBe('Desc');
		expect(
			container.querySelector('.pds-section-header__actions')?.textContent,
		).toBe('Action');
	});

	it('renders Toolbar', () => {
		const container = render(<Toolbar>Tools</Toolbar>);
		expect(container.querySelector('.pds-toolbar')?.textContent).toBe('Tools');
	});
});
