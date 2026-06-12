import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Divider, KeyValueList } from './metadata';

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

describe('KeyValueList', () => {
	it('renders terms and descriptions', () => {
		const items = [{ label: 'Status', value: 'Active' }];
		const container = render(<KeyValueList items={items} />);
		expect(container.querySelector('dt')?.textContent).toBe('Status');
		expect(container.querySelector('dd')?.textContent).toBe('Active');
	});
});

describe('Divider', () => {
	it('renders hr with correct tone', () => {
		const container = render(<Divider tone="strong" />);
		const hr = container.querySelector('hr');
		expect(hr).toBeTruthy();
		expect(hr?.classList.contains('pds-divider--strong')).toBe(true);
	});
});
