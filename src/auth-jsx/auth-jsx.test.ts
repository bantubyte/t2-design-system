import { describe, expect, it } from 'vitest';
import {
	RawAuthAccessScreen,
	renderRawJsxToDom,
	renderRawJsxToHtml,
} from './index';

describe('auth-jsx raw renderer contract', () => {
	it('renders login and signup SSO affordances without React', () => {
		const html = renderRawJsxToHtml(
			RawAuthAccessScreen({
				mode: 'login',
				productName: 'Cortexx',
			}),
		);

		expect(html).toContain('Log in to Cortexx');
		expect(html).toContain('Log in with Google');
		expect(html).toContain('Log in with GitHub');
		expect(html).toContain('data-provider-id="google"');
		expect(html).toContain('data-provider-id="github"');
		expect(html).toContain('Need an account?');
		expect(html).toContain('Sign up');
		expect(html).toContain('Call us on WhatsApp');
	});

	it('submits the current email value from the raw DOM renderer', () => {
		let submittedEmail = '';
		const node = renderRawJsxToDom(
			RawAuthAccessScreen({
				mode: 'signup',
				onSubmit: ({ email }) => {
					submittedEmail = email;
				},
			}),
		);
		document.body.append(node);

		const input = document.querySelector<HTMLInputElement>(
			'input[name="email"]',
		);
		const form = document.querySelector('form');
		if (!input || !form) {
			throw new Error('Raw auth form not rendered');
		}
		input.value = 'lead@example.com';
		form.dispatchEvent(
			new SubmitEvent('submit', { bubbles: true, cancelable: true }),
		);
		document.body.innerHTML = '';

		expect(submittedEmail).toBe('lead@example.com');
	});
});
