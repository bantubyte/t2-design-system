import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	BigLoader,
	CardLoadingState,
	ContentLoader,
	LoadingState,
	PageContentLoader,
	Skeleton,
} from './feedback';

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

describe('loading components', () => {
	it('keeps LoadingState backwards compatible while adding size and motion variants', () => {
		const container = render(
			<LoadingState label="Calculating reach" motion="orbit" size="lg" />,
		);
		const loadingState = container.querySelector('.pds-loading-state');

		expect(loadingState?.getAttribute('aria-live')).toBe('polite');
		expect(loadingState?.className).toContain('pds-loading-state--lg');
		expect(loadingState?.className).toContain('pds-loader-motion--orbit');
		expect(container.textContent).toContain('Calculating reach');
	});

	it('renders a big loader suitable for page-level waits', () => {
		const container = render(
			<BigLoader
				description="Preparing campaign intelligence"
				label="Building report"
			/>,
		);

		expect(container.querySelector('.pds-big-loader')).toBeTruthy();
		expect(container.querySelectorAll('.pds-big-loader__orb')).toHaveLength(3);
		expect(container.textContent).toContain('Building report');
	});

	it('renders content and card loader structures with animated skeleton rows', () => {
		const container = render(
			<div>
				<ContentLoader actions={2} lines={3} media title />
				<CardLoadingState density="compact" media="thumbnail" rows={4} />
				<Skeleton motion="wave" width="60%" />
			</div>,
		);

		expect(container.querySelector('.pds-content-loader')).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-content-loader__line'),
		).toHaveLength(3);
		expect(
			container.querySelectorAll('.pds-content-loader__action'),
		).toHaveLength(2);
		expect(container.querySelector('.pds-card-loader--compact')).toBeTruthy();
		expect(container.querySelectorAll('.pds-card-loader__row')).toHaveLength(4);
		expect(container.querySelector('.pds-skeleton--wave')).toBeTruthy();
	});

	it('renders a page content loader with header, toolbar, stat, and card placeholders', () => {
		const container = render(
			<PageContentLoader
				cardCount={5}
				statCount={4}
				title="Campaigns"
				toolbar
			/>,
		);

		expect(container.querySelector('.pds-page-content-loader')).toBeTruthy();
		expect(
			container.querySelector('.pds-page-content-loader__toolbar'),
		).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-page-content-loader__stat'),
		).toHaveLength(4);
		expect(container.querySelectorAll('.pds-card-loader')).toHaveLength(5);
		expect(container.textContent).toContain('Campaigns');
	});
});
