import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { HelpCenter } from './help-center';

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

describe('HelpCenter', () => {
	const categories = [{ id: 'billing', label: 'Billing' }];
	const faqs = [
		{
			id: '1',
			categoryId: 'billing',
			question: 'How to pay?',
			answer: 'Use card.',
		},
	];

	it('renders header, categories, and FAQs', () => {
		const container = render(
			<HelpCenter categories={categories} faqs={faqs} title="Help" />,
		);
		expect(container.querySelector('h1')?.textContent).toBe('Help');
		expect(container.querySelectorAll('.pds-help-center__topic').length).toBe(
			2,
		); // All + Billing
		expect(container.querySelector('.pds-help-center__faq')?.textContent).toBe(
			'How to pay?',
		);
	});

	it('filters faqs by search', () => {
		const container = render(
			<HelpCenter categories={categories} faqs={faqs} searchValue="notfound" />,
		);
		expect(container.querySelector('.pds-help-center__faq')).toBeFalsy();
		expect(container.querySelector('.pds-help-center__empty')).toBeTruthy();
	});
});
