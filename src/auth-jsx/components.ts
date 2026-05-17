import {
	type AuthAccessInput,
	type AuthAccessState,
	type AuthMode,
	type AuthSsoProviderModel,
	type AuthSupportActionModel,
	createAuthAccessModel,
} from '../auth-core';
import { cx } from '../utils/class-names';
import { h, type RawJsxNode } from './runtime';

type RawEventHandler<TEvent extends Event = Event> = (event: TEvent) => void;

interface RawHtmlProps {
	className?: string;
	id?: string;
}

export interface RawAuthAccessScreenProps
	extends AuthAccessInput<RawJsxNode>,
		RawHtmlProps {
	email?: string;
	onEmailChange?: (email: string) => void;
	onModeChange?: (mode: AuthMode) => void;
	onSubmit?: (values: AuthAccessState) => void;
	onSupportSelect?: (
		supportAction: AuthSupportActionModel<RawJsxNode>,
		values: AuthAccessState,
	) => void;
	onSsoSelect?: (
		provider: AuthSsoProviderModel<RawJsxNode>,
		values: AuthAccessState,
	) => void;
	showModeSwitch?: boolean;
}

export function RawAuthAccessScreen({
	className,
	email = '',
	mode = 'signup',
	onEmailChange,
	onModeChange,
	onSubmit,
	onSupportSelect,
	onSsoSelect,
	showModeSwitch = true,
	...modelInput
}: RawAuthAccessScreenProps): RawJsxNode {
	const model = createAuthAccessModel<RawJsxNode>({ ...modelInput, mode });
	const values = { email, mode };
	const handleSubmit: RawEventHandler = (event) => {
		event.preventDefault();
		const form = event.currentTarget;
		const nextEmail =
			form instanceof HTMLFormElement
				? String(new FormData(form).get('email') ?? email)
				: email;
		onSubmit?.({ email: nextEmail, mode });
	};

	return h(
		'main',
		{ className: cx('pds-auth-signup', className) },
		h(
			'div',
			{ 'aria-hidden': 'true', className: 'pds-auth-signup__background' },
			h(
				'span',
				{ className: 'pds-auth-signup__glyph pds-auth-signup__glyph--top' },
				'⌁',
			),
			h(
				'span',
				{ className: 'pds-auth-signup__glyph pds-auth-signup__glyph--cube' },
				'⬡',
			),
			h(
				'span',
				{
					className: 'pds-auth-signup__glyph pds-auth-signup__glyph--cross',
				},
				'×',
			),
		),
		h(
			'section',
			{ className: 'pds-auth-signup__content' },
			h(
				'div',
				{ className: 'pds-auth-signup__intro' },
				h(
					'div',
					{ 'aria-hidden': 'true', className: 'pds-auth-signup__crown' },
					'⌃',
				),
				h(
					'h1',
					null,
					h('span', null, model.headline),
					h('strong', null, model.headlineAccent),
				),
				h(
					'p',
					{ className: 'pds-auth-signup__subtitle' },
					h('strong', null, model.subtitleLead),
					' ',
					model.subtitleRest,
				),
				h(
					'p',
					{ className: 'pds-auth-signup__bullet' },
					h('span', { 'aria-hidden': 'true' }, '•'),
					model.bullet,
				),
				h(
					'div',
					{ className: 'pds-auth-signup__metrics' },
					model.metrics.map((metric, index) =>
						h(
							'div',
							{ key: index },
							h('strong', null, metric.value),
							h('span', null, metric.label),
						),
					),
				),
				h(
					'div',
					{ className: 'pds-auth-signup__features' },
					model.features.map((feature, index) =>
						h(
							'div',
							{ className: 'pds-auth-signup__feature', key: index },
							h('span', { 'aria-hidden': 'true' }, feature.icon ?? '◇'),
							h(
								'div',
								null,
								h('strong', null, feature.title),
								h('p', null, feature.description),
							),
						),
					),
				),
			),
			h(
				'div',
				{ className: 'pds-auth-signup__panel-stack' },
				h(
					'form',
					{ className: 'pds-auth-signup__card', onSubmit: handleSubmit },
					h(
						'div',
						{
							'aria-hidden': 'true',
							className: 'pds-auth-signup__brand-mark pds-brand-mark',
						},
						'P',
					),
					h('h2', null, model.panelTitle),
					showModeSwitch ? rawModeSwitch(model, onModeChange) : null,
					rawSsoProviders(model, values, onSsoSelect),
					h(
						'div',
						{ className: 'pds-auth-signup__divider' },
						h('span', null, 'or'),
					),
					h(
						'fieldset',
						{ className: 'pds-field' },
						h('span', { className: 'pds-field__label' }, model.emailLabel),
						h('input', {
							className: 'pds-input',
							onInput: (event: Event) => {
								const target = event.target;
								if (target instanceof HTMLInputElement) {
									onEmailChange?.(target.value);
								}
							},
							name: 'email',
							placeholder: model.emailPlaceholder,
							required: true,
							type: 'email',
							value: email,
						}),
					),
					h(
						'button',
						{
							className:
								'pds-button pds-button--primary pds-button--md pds-button--full',
							type: 'submit',
						},
						h('span', { className: 'pds-button__label' }, model.submitLabel),
					),
					h(
						'p',
						{ className: 'pds-auth-signup__powered' },
						'Powered by ',
						h('strong', null, model.poweredBy),
					),
				),
				model.supportAction
					? rawSupportAction(model.supportAction, values, onSupportSelect)
					: null,
				h(
					'div',
					{ className: 'pds-auth-signup__pill' },
					h('span', null, 'Powered by'),
					h('i', { 'aria-hidden': 'true' }),
					h('strong', null, 'Location Intelligence'),
				),
				h(
					'p',
					{ className: 'pds-auth-signup__secure' },
					h('span', { 'aria-hidden': 'true' }, '♙'),
					' ',
					model.secureLabel,
					' by ',
					model.poweredBy,
				),
			),
		),
	);
}

function rawModeSwitch(
	model: ReturnType<typeof createAuthAccessModel<RawJsxNode>>,
	onModeChange?: (mode: AuthMode) => void,
): RawJsxNode {
	return h(
		'div',
		{ className: 'pds-auth-signup__mode-switch' },
		h('span', null, model.modeSwitchLabel),
		h(
			'button',
			{
				className: 'pds-auth-signup__mode-button',
				onClick: () => onModeChange?.(model.nextMode),
				type: 'button',
			},
			model.modeSwitchActionLabel,
		),
	);
}

function rawSsoProviders(
	model: ReturnType<typeof createAuthAccessModel<RawJsxNode>>,
	values: AuthAccessState,
	onSsoSelect?: (
		provider: AuthSsoProviderModel<RawJsxNode>,
		values: AuthAccessState,
	) => void,
): RawJsxNode {
	return h(
		'div',
		{ className: 'pds-auth-signup__sso' },
		model.ssoProviders.map((provider) =>
			h(
				'button',
				{
					'aria-label': provider.ariaLabel,
					className: 'pds-auth-signup__sso-button',
					'data-provider-id': provider.id,
					key: provider.key,
					onClick: () => onSsoSelect?.(provider, values),
					type: 'button',
				},
				h('span', { 'aria-hidden': 'true' }, provider.iconLabel),
				h('strong', null, provider.ariaLabel),
			),
		),
	);
}

function rawSupportAction(
	supportAction: AuthSupportActionModel<RawJsxNode>,
	values: AuthAccessState,
	onSupportSelect?: (
		supportAction: AuthSupportActionModel<RawJsxNode>,
		values: AuthAccessState,
	) => void,
): RawJsxNode {
	const tagName = supportAction.href ? 'a' : 'button';
	const props = {
		'aria-label': supportAction.ariaLabel,
		className: 'pds-auth-signup__support-action',
		href: supportAction.href,
		onClick: (event: Event) => {
			if (!supportAction.href) {
				event.preventDefault();
			}
			onSupportSelect?.(supportAction, values);
		},
		type: supportAction.href ? undefined : 'button',
	};

	return h(
		tagName,
		props,
		h('span', { 'aria-hidden': 'true' }, supportAction.iconLabel),
		h('strong', null, supportAction.label),
		h('small', null, 'Talk to a human before you commit'),
	);
}
