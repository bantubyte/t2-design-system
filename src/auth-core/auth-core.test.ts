import { describe, expect, it } from 'vitest';
import {
	createAuthAccessModel,
	defaultAuthSsoProviders,
	reduceAuthAccessState,
} from './index';

describe('auth-core', () => {
	it('normalizes product copy and default SSO providers for sign up', () => {
		const model = createAuthAccessModel({
			fallbackProductName: 'Cortexx',
			mode: 'signup',
			productName: '-',
		});

		expect(model.productName).toBe('Cortexx');
		expect(model.panelTitle).toBe('Sign up for Cortexx');
		expect(model.submitLabel).toBe('Continue with email');
		expect(model.ssoProviders.map((provider) => provider.id)).toEqual([
			'google',
			'github',
		]);
		expect(model.ssoProviders[0]).toMatchObject({
			ariaLabel: 'Sign up with Google',
			iconLabel: 'G',
			label: 'Google',
		});
		expect(model.supportAction).toMatchObject({
			iconLabel: 'WA',
			label: 'Call us on WhatsApp',
		});
	});

	it('switches copy for login mode without changing provider order', () => {
		const model = createAuthAccessModel({
			mode: 'login',
			productName: 'PIKABOO',
		});

		expect(model.panelTitle).toBe('Log in to PIKABOO');
		expect(model.modeSwitchLabel).toBe('Need an account?');
		expect(model.modeSwitchActionLabel).toBe('Sign up');
		expect(model.ssoProviders).toHaveLength(defaultAuthSsoProviders.length);
		expect(model.ssoProviders[1]?.ariaLabel).toBe('Log in with GitHub');
	});

	it('reduces mode and email state independently', () => {
		const withEmail = reduceAuthAccessState(
			{ email: '', mode: 'signup' },
			{ email: 'owner@example.com', type: 'set-email' },
		);
		const withLogin = reduceAuthAccessState(withEmail, {
			mode: 'login',
			type: 'set-mode',
		});

		expect(withLogin).toEqual({
			email: 'owner@example.com',
			mode: 'login',
		});
	});
});
