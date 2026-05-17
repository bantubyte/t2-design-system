import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ThemeProvider } from '../theme';
import { AuthSignUpScreen } from './auth';

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

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('AuthSignUpScreen', () => {
	it('falls back from a dash product name to the active tenant product name', () => {
		const container = render(
			<ThemeProvider theme="primedia">
				<AuthSignUpScreen productName="-" />
			</ThemeProvider>,
		);

		expect(container.textContent).toContain('Sign up for Cortexx');
		expect(container.textContent).not.toContain('Sign up for -');
	});

	it('submits the entered email address', () => {
		let submittedEmail = '';
		const container = render(
			<ThemeProvider theme="pikaboo">
				<AuthSignUpScreen
					onSubmit={({ email }) => {
						submittedEmail = email;
					}}
				/>
			</ThemeProvider>,
		);

		inputValue(
			container.querySelector('input[type="email"]'),
			'owner@example.com',
		);
		act(() => {
			container
				.querySelector('form')
				?.dispatchEvent(
					new SubmitEvent('submit', { bubbles: true, cancelable: true }),
				);
		});

		expect(submittedEmail).toBe('owner@example.com');
	});
});
