import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { HelpCenter, PaymentForm } from './index';

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

const inputValue = (element: Element | null, value: string) => {
	if (!(element instanceof HTMLInputElement)) {
		throw new Error('Input not found');
	}
	act(() => {
		const valueSetter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			'value',
		)?.set;
		valueSetter?.call(element, value);
		element.dispatchEvent(new Event('input', { bubbles: true }));
		element.dispatchEvent(new Event('change', { bubbles: true }));
	});
};

const click = (element: Element | null) => {
	if (!(element instanceof HTMLElement)) {
		throw new Error('Element not found for click');
	}
	act(() => {
		element.click();
	});
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
	it('filters FAQs by category and search while exposing contact actions', () => {
		const selectedCategories: string[] = [];
		const searchTerms: string[] = [];
		const container = render(
			<HelpCenter
				categories={[
					{ id: 'billing', label: 'Billing' },
					{ id: 'campaigns', label: 'Campaigns' },
				]}
				contactActions={[
					{
						description: 'Talk to a human',
						href: 'https://wa.me/27100000000',
						label: 'WhatsApp support',
					},
				]}
				faqs={[
					{
						answer: 'Invoices are available from the workspace billing area.',
						categoryId: 'billing',
						id: 'invoice',
						question: 'Where can I find invoices?',
						tags: ['receipts'],
					},
					{
						answer: 'Campaign drafts can be changed before launch approval.',
						categoryId: 'campaigns',
						id: 'campaign-editing',
						question: 'Can I edit campaign dates?',
						tags: ['planning'],
					},
				]}
				onCategoryChange={(categoryId) => selectedCategories.push(categoryId)}
				onSearchChange={(query) => searchTerms.push(query)}
			/>,
		);

		expect(container.textContent).toContain('Where can I find invoices?');
		expect(container.textContent).toContain('Can I edit campaign dates?');
		expect(container.textContent).toContain('WhatsApp support');

		click(container.querySelector('button[data-category-id="billing"]'));

		expect(selectedCategories).toEqual(['billing']);
		expect(container.textContent).toContain('Where can I find invoices?');
		expect(container.textContent).not.toContain('Can I edit campaign dates?');

		inputValue(container.querySelector('input[type="search"]'), 'receipts');

		expect(searchTerms).toEqual(['receipts']);
		expect(container.querySelectorAll('.pds-help-center__faq')).toHaveLength(1);
	});
});

describe('PaymentForm', () => {
	it('submits selected donation values with donor details and recurring state', () => {
		const submissions: unknown[] = [];
		const container = render(
			<PaymentForm
				amountOptions={[
					{ label: 'R250', value: 250 },
					{ label: 'R500', value: 500 },
				]}
				methods={[
					{ id: 'card', label: 'Card' },
					{ id: 'eft', label: 'EFT' },
				]}
				onSubmit={(values) => submissions.push(values)}
			/>,
		);

		click(container.querySelector('button[data-amount-value="500"]'));
		click(container.querySelector('button[data-method-id="eft"]'));
		inputValue(container.querySelector('input[name="name"]'), 'Lario Timbuk2');
		inputValue(
			container.querySelector('input[name="email"]'),
			'owner@example.com',
		);
		click(container.querySelector('input[name="recurring"]'));
		click(container.querySelector('button[type="submit"]'));

		expect(submissions).toEqual([
			{
				amount: 500,
				currency: 'ZAR',
				email: 'owner@example.com',
				methodId: 'eft',
				name: 'Lario Timbuk2',
				recurring: true,
			},
		]);
		expect(container.textContent).toContain('R500');
		expect(container.textContent).toContain('Monthly gift');
	});
});
