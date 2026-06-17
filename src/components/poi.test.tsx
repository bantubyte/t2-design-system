import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { PoiBulkAddTip } from './poi';

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

describe('PoiBulkAddTip', () => {
	it('renders the default bold bulk-add copy', () => {
		const container = render(<PoiBulkAddTip />);
		expect(container.textContent).toContain('Top Tip: Bulk Add');
		// The "Top Tip" label is emphasised.
		expect(container.querySelector('strong')?.textContent).toBe(
			'Top Tip: Bulk Add',
		);
	});

	it('exposes a help tooltip with a worked example', () => {
		const container = render(<PoiBulkAddTip />);
		const tooltip = container.querySelector('.pds-tooltip__content');
		expect(tooltip).toBeTruthy();
		expect(tooltip?.textContent).toContain('12 Long St, Cape Town, 8001');
	});

	it('allows overriding the text and tooltip', () => {
		const container = render(
			<PoiBulkAddTip text="Paste away" tooltip="Custom help" />,
		);
		expect(container.querySelector('.pds-poi-tip__text')?.textContent).toBe(
			'Paste away',
		);
		expect(container.querySelector('.pds-tooltip__content')?.textContent).toBe(
			'Custom help',
		);
	});
});
