import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { PaymentForm } from './payment';

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

describe('PaymentForm', () => {
	it('renders form fields', () => {
		const container = render(<PaymentForm />);
		expect(container.querySelector('form')).toBeTruthy();
		expect(container.textContent).toContain('Support the work');
		expect(container.querySelector('input[name="name"]')).toBeTruthy();
		expect(container.querySelector('input[name="email"]')).toBeTruthy();
		expect(
			container.querySelectorAll('.pds-payment-form__amount').length,
		).toBeGreaterThan(0);
	});
});
