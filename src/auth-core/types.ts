export type AuthContent = unknown;

export type AuthMode = 'login' | 'signup';

export interface AuthFeature<TContent = AuthContent> {
	description: TContent;
	icon?: TContent;
	title: TContent;
}

export interface AuthMetric<TContent = AuthContent> {
	label: TContent;
	value: TContent;
}

export interface AuthSsoProvider<TContent = AuthContent> {
	ariaLabel?: string;
	iconLabel?: TContent;
	id: string;
	label: TContent;
}

export interface AuthSsoProviderModel<TContent = AuthContent>
	extends AuthSsoProvider<TContent> {
	ariaLabel: string;
	key: string;
}

export interface AuthSupportAction<TContent = AuthContent> {
	ariaLabel?: string;
	href?: string;
	iconLabel?: TContent;
	label: TContent;
}

export interface AuthSupportActionModel<TContent = AuthContent>
	extends AuthSupportAction<TContent> {
	ariaLabel: string;
}

export interface AuthAccessInput<TContent = AuthContent> {
	bullet?: TContent;
	emailLabel?: TContent;
	emailPlaceholder?: string;
	fallbackProductName?: string;
	features?: readonly AuthFeature<TContent>[];
	headline?: TContent;
	headlineAccent?: TContent;
	metrics?: readonly AuthMetric<TContent>[];
	mode?: AuthMode;
	poweredBy?: TContent;
	productName?: TContent;
	secureLabel?: TContent;
	ssoProviders?: readonly AuthSsoProvider<TContent>[];
	submitLabel?: TContent;
	subtitle?: TContent;
	supportAction?: AuthSupportAction<TContent> | null;
}

export interface AuthAccessModel<TContent = AuthContent> {
	bullet: TContent;
	emailLabel: TContent;
	emailPlaceholder: string;
	features: readonly AuthFeature<TContent>[];
	headline: TContent;
	headlineAccent: TContent;
	metrics: readonly AuthMetric<TContent>[];
	mode: AuthMode;
	modeSwitchActionLabel: TContent;
	modeSwitchLabel: TContent;
	nextMode: AuthMode;
	panelTitle: string;
	poweredBy: TContent;
	productName: TContent | string;
	secureLabel: TContent;
	ssoProviders: readonly AuthSsoProviderModel<TContent>[];
	submitLabel: TContent;
	subtitleLead: TContent | string;
	subtitleRest: TContent;
	supportAction?: AuthSupportActionModel<TContent>;
}

export interface AuthAccessState {
	email: string;
	mode: AuthMode;
}

export type AuthAccessAction =
	| { email: string; type: 'set-email' }
	| { mode: AuthMode; type: 'set-mode' };
