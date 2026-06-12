import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Alert,
	ContentLoader,
	EmptyState,
	LoadingState,
	Progress,
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

describe('Alert', () => {
	it('renders alert with title and content', () => {
		const container = render(
			<Alert
				action={<button type="button">Close</button>}
				icon={<span />}
				title="Success!"
				tone="success"
			>
				It worked.
			</Alert>,
		);
		const alert = container.querySelector('.pds-alert');
		expect(alert?.classList.contains('pds-alert--success')).toBe(true);
		expect(container.querySelector('.pds-alert__title')?.textContent).toBe(
			'Success!',
		);
		expect(container.querySelector('.pds-alert__content')?.textContent).toBe(
			'It worked.',
		);
		expect(container.querySelector('.pds-alert__action')?.textContent).toBe(
			'Close',
		);
	});
});

describe('EmptyState', () => {
	it('renders empty state', () => {
		const container = render(
			<EmptyState
				action={<button type="button">Add</button>}
				description="Try creating one"
				title="No items"
			/>,
		);
		expect(
			container.querySelector('.pds-empty-state__title')?.textContent,
		).toBe('No items');
		expect(
			container.querySelector('.pds-empty-state__description')?.textContent,
		).toBe('Try creating one');
	});
});

describe('LoadingState and Progress', () => {
	it('renders LoadingState', () => {
		const container = render(
			<LoadingState label="Wait..." motion="pulse" size="lg" />,
		);
		const loader = container.querySelector('.pds-loading-state');
		expect(loader?.classList.contains('pds-loading-state--lg')).toBe(true);
		expect(loader?.classList.contains('pds-loader-motion--pulse')).toBe(true);
		expect(loader?.textContent).toContain('Wait...');
	});

	it('renders Progress', () => {
		const container = render(<Progress label="Uploading" value={45} />);
		const track = container.querySelector('.pds-progress__track');
		expect(track?.getAttribute('aria-valuenow')).toBe('45');
		expect(
			container.querySelector('.pds-progress__label')?.textContent,
		).toContain('Uploading');
		expect(
			container.querySelector('.pds-progress__label')?.textContent,
		).toContain('45%');

		const bar = container.querySelector('.pds-progress__bar') as HTMLElement;
		expect(bar?.style.width).toBe('45%');
	});
});

describe('Skeleton and ContentLoader', () => {
	it('renders Skeleton', () => {
		const container = render(
			<Skeleton height="100px" motion="wave" radius="full" width="50%" />,
		);
		const skeleton = container.querySelector('.pds-skeleton') as HTMLElement;
		expect(skeleton.style.height).toBe('100px');
		expect(skeleton.style.width).toBe('50%');
		expect(skeleton.classList.contains('pds-skeleton--wave')).toBe(true);
		expect(skeleton.classList.contains('pds-skeleton--radius-full')).toBe(true);
	});

	it('renders ContentLoader', () => {
		const container = render(
			<ContentLoader actions={1} lines={2} media title />,
		);
		expect(container.querySelector('.pds-content-loader__media')).toBeTruthy();
		expect(container.querySelector('.pds-content-loader__title')).toBeTruthy();
		expect(container.querySelectorAll('.pds-content-loader__line').length).toBe(
			2,
		);
		expect(
			container.querySelectorAll('.pds-content-loader__action').length,
		).toBe(1);
	});
});
