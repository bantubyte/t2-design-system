import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Badge, RemovableBadge, SelectionBadge } from './badge';

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

describe('Badge', () => {
	it('renders badge content and defaults', () => {
		const container = render(<Badge>New</Badge>);
		const badge = container.querySelector('.pds-badge');
		expect(badge).toBeTruthy();
		expect(badge?.textContent).toBe('New');
		expect(badge?.classList.contains('pds-badge--neutral')).toBe(true);
	});
});

describe('RemovableBadge', () => {
	it('renders label and remove button', () => {
		let clicked = false;
		const container = render(
			<RemovableBadge
				label="Filter"
				onRemove={() => {
					clicked = true;
				}}
			/>,
		);
		expect(container.textContent).toContain('Filter');

		const btn = container.querySelector('button')!;
		expect(btn).toBeTruthy();

		act(() => {
			btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(clicked).toBe(true);
	});
});

describe('SelectionBadge', () => {
	it('renders empty label when no items', () => {
		const container = render(
			<SelectionBadge emptyLabel="Nothing" items={[]} />,
		);
		expect(container.textContent).toContain('Nothing');
	});

	it('renders items and overflow', () => {
		const container = render(
			<SelectionBadge items={['A', 'B', 'C']} maxVisible={2} />,
		);
		const badges = container.querySelectorAll('.pds-badge');
		expect(badges.length).toBe(2);
		expect(container.textContent).toContain('+1');
	});
});
