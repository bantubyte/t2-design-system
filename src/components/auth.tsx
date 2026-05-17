import {
	type FormEvent,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
	useState,
} from 'react';
import {
	type AuthAccessInput,
	type AuthAccessState,
	type AuthFeature,
	type AuthMetric,
	type AuthMode,
	type AuthSsoProvider,
	type AuthSsoProviderModel,
	type AuthSupportAction,
	type AuthSupportActionModel,
	createAuthAccessModel,
	getInitialAuthAccessState,
	reduceAuthAccessState,
} from '../auth-core';
import { useTheme } from '../theme';
import { cx } from '../utils/class-names';
import { BrandMark } from './brand';
import { Button } from './button';
import { Field, Input } from './form';
import { Icon, isPdsIconName } from './icons';

export type {
	AuthFeature,
	AuthMetric,
	AuthMode,
	AuthSsoProvider,
	AuthSupportAction,
};

export interface AuthAccessValues extends AuthAccessState {}

export interface AuthAccessScreenProps
	extends Omit<HTMLAttributes<HTMLElement>, 'onSubmit'>,
		Omit<AuthAccessInput<ReactNode>, 'mode'> {
	defaultEmail?: string;
	defaultMode?: AuthMode;
	emailInputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'defaultValue' | 'name' | 'onChange' | 'type' | 'value'
	>;
	mode?: AuthMode;
	onEmailChange?: (email: string) => void;
	onModeChange?: (mode: AuthMode) => void;
	onSsoSelect?: (
		provider: AuthSsoProviderModel<ReactNode>,
		values: AuthAccessValues,
	) => void;
	onSubmit?: (values: AuthAccessValues) => void;
	onSupportSelect?: (
		supportAction: AuthSupportActionModel<ReactNode>,
		values: AuthAccessValues,
	) => void;
	showModeSwitch?: boolean;
	value?: string;
}

export interface AuthSignUpScreenProps
	extends Omit<AuthAccessScreenProps, 'defaultMode' | 'mode'> {}

export interface AuthLoginScreenProps
	extends Omit<AuthAccessScreenProps, 'defaultMode' | 'mode'> {}

export function AuthAccessScreen({
	bullet,
	className,
	defaultEmail = '',
	defaultMode = 'signup',
	emailLabel,
	emailPlaceholder,
	emailInputProps,
	fallbackProductName,
	features,
	headline,
	headlineAccent,
	metrics,
	mode,
	onEmailChange,
	onModeChange,
	onSsoSelect,
	onSubmit,
	onSupportSelect,
	poweredBy,
	productName,
	secureLabel,
	showModeSwitch = true,
	ssoProviders,
	submitLabel,
	subtitle,
	supportAction,
	value,
	...htmlProps
}: AuthAccessScreenProps) {
	const { theme } = useTheme();
	const [state, setState] = useState(() =>
		getInitialAuthAccessState({ defaultEmail, defaultMode }),
	);
	const activeMode = mode ?? state.mode;
	const email = value ?? state.email;
	const values: AuthAccessValues = { email, mode: activeMode };
	const model = createAuthAccessModel<ReactNode>({
		bullet,
		emailLabel,
		emailPlaceholder,
		fallbackProductName: fallbackProductName ?? theme.copy.productName,
		features,
		headline,
		headlineAccent,
		metrics,
		mode: activeMode,
		poweredBy,
		productName: productName ?? theme.copy.productName,
		secureLabel,
		ssoProviders,
		submitLabel,
		subtitle,
		supportAction,
	});

	const setEmail = (nextEmail: string) => {
		if (value === undefined) {
			setState((currentState) =>
				reduceAuthAccessState(currentState, {
					email: nextEmail,
					type: 'set-email',
				}),
			);
		}
		onEmailChange?.(nextEmail);
	};

	const setMode = (nextMode: AuthMode) => {
		if (mode === undefined) {
			setState((currentState) =>
				reduceAuthAccessState(currentState, {
					mode: nextMode,
					type: 'set-mode',
				}),
			);
		}
		onModeChange?.(nextMode);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit?.({ email, mode: activeMode });
	};

	return (
		<main className={cx('pds-auth-signup', className)} {...htmlProps}>
			<div aria-hidden="true" className="pds-auth-signup__background">
				<span className="pds-auth-signup__glyph pds-auth-signup__glyph--top">
					⌁
				</span>
				<span className="pds-auth-signup__glyph pds-auth-signup__glyph--cube">
					⬡
				</span>
				<span className="pds-auth-signup__glyph pds-auth-signup__glyph--cross">
					×
				</span>
			</div>
			<section className="pds-auth-signup__content">
				<div className="pds-auth-signup__intro">
					<div aria-hidden="true" className="pds-auth-signup__crown">
						⌃
					</div>
					<h1>
						<span>{model.headline}</span>
						<strong>{model.headlineAccent}</strong>
					</h1>
					<p className="pds-auth-signup__subtitle">
						<strong>{model.subtitleLead}</strong> {model.subtitleRest}
					</p>
					<p className="pds-auth-signup__bullet">
						<span aria-hidden="true">•</span>
						{model.bullet}
					</p>
					<div className="pds-auth-signup__metrics">
						{model.metrics.map((metric, index) => (
							<div key={index}>
								<strong>{metric.value}</strong>
								<span>{metric.label}</span>
							</div>
						))}
					</div>
					<div className="pds-auth-signup__features">
						{model.features.map((feature, index) => (
							<div className="pds-auth-signup__feature" key={index}>
								<span aria-hidden="true">{feature.icon ?? '◇'}</span>
								<div>
									<strong>{feature.title}</strong>
									<p>{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="pds-auth-signup__panel-stack">
					<form className="pds-auth-signup__card" onSubmit={handleSubmit}>
						<BrandMark className="pds-auth-signup__brand-mark" size={52} />
						<h2>{model.panelTitle}</h2>
						{showModeSwitch ? (
							<div className="pds-auth-signup__mode-switch">
								<span>{model.modeSwitchLabel}</span>
								<button
									className="pds-auth-signup__mode-button"
									onClick={() => setMode(model.nextMode)}
									type="button"
								>
									{model.modeSwitchActionLabel}
								</button>
							</div>
						) : null}
						<div className="pds-auth-signup__sso">
							{model.ssoProviders.map((provider) => (
								<button
									aria-label={provider.ariaLabel}
									className="pds-auth-signup__sso-button"
									data-provider-id={provider.id}
									key={provider.key}
									onClick={() => onSsoSelect?.(provider, values)}
									type="button"
								>
									<span aria-hidden="true">
										{isPdsIconName(provider.id) ? (
											<Icon name={provider.id} size={18} />
										) : (
											provider.iconLabel
										)}
									</span>
									<strong>{provider.ariaLabel}</strong>
								</button>
							))}
						</div>
						<div className="pds-auth-signup__divider">
							<span>or</span>
						</div>
						<Field label={model.emailLabel}>
							<Input
								placeholder={model.emailPlaceholder}
								required
								{...emailInputProps}
								name="email"
								onChange={(event) => setEmail(event.target.value)}
								type="email"
								value={email}
							/>
						</Field>
						<Button fullWidth type="submit">
							{model.submitLabel}
						</Button>
						<p className="pds-auth-signup__powered">
							Powered by <strong>{model.poweredBy}</strong>
						</p>
					</form>
					{model.supportAction ? (
						<AuthSupportButton
							onSupportSelect={onSupportSelect}
							supportAction={model.supportAction}
							values={values}
						/>
					) : null}
					<div className="pds-auth-signup__pill">
						<span>Powered by</span>
						<i aria-hidden="true" />
						<strong>Location Intelligence</strong>
					</div>
					<p className="pds-auth-signup__secure">
						<span aria-hidden="true">♙</span> {model.secureLabel} by{' '}
						{model.poweredBy}
					</p>
				</div>
			</section>
		</main>
	);
}

export function AuthSignUpScreen(props: AuthSignUpScreenProps) {
	return <AuthAccessScreen defaultMode="signup" {...props} />;
}

export function AuthLoginScreen(props: AuthLoginScreenProps) {
	return <AuthAccessScreen defaultMode="login" {...props} />;
}

function AuthSupportButton({
	onSupportSelect,
	supportAction,
	values,
}: {
	onSupportSelect?: (
		supportAction: AuthSupportActionModel<ReactNode>,
		values: AuthAccessValues,
	) => void;
	supportAction: AuthSupportActionModel<ReactNode>;
	values: AuthAccessValues;
}) {
	const content = (
		<>
			<span aria-hidden="true">{supportAction.iconLabel ?? 'WA'}</span>
			<strong>{supportAction.label}</strong>
			<small>Talk to a human before you commit</small>
		</>
	);

	if (supportAction.href) {
		return (
			<a
				aria-label={supportAction.ariaLabel}
				className="pds-auth-signup__support-action"
				href={supportAction.href}
				onClick={() => onSupportSelect?.(supportAction, values)}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			aria-label={supportAction.ariaLabel}
			className="pds-auth-signup__support-action"
			onClick={(event) => {
				event.preventDefault();
				onSupportSelect?.(supportAction, values);
			}}
			type="button"
		>
			{content}
		</button>
	);
}
