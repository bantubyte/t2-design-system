import type {
	AuthAccessAction,
	AuthAccessInput,
	AuthAccessModel,
	AuthAccessState,
	AuthContent,
	AuthFeature,
	AuthMetric,
	AuthMode,
	AuthSsoProvider,
	AuthSsoProviderModel,
	AuthSupportAction,
	AuthSupportActionModel,
} from './types';

export const defaultAuthMetrics: readonly AuthMetric<string>[] = [
	{ label: 'Devices tracked monthly', value: '10M+' },
	{ label: 'Data points processed', value: '1B+' },
];

export const defaultAuthFeatures: readonly AuthFeature<string>[] = [
	{
		description:
			'Our Akili model transforms raw data into actionable intelligence using advanced geo-LLMs.',
		icon: '◇',
		title: 'AI-Powered Insights',
	},
	{
		description:
			'Local communities earn while mapping their neighborhoods, creating ground-truth data at scale.',
		icon: '◇',
		title: 'Gamified Collection',
	},
	{
		description:
			'Decision-grade insights for marketers and enterprises seeking African market intelligence.',
		icon: '⬡',
		title: 'Real-Time Analytics',
	},
];

export const defaultAuthSsoProviders: readonly AuthSsoProvider<string>[] = [
	{ iconLabel: 'G', id: 'google', label: 'Google' },
	{ iconLabel: 'GH', id: 'github', label: 'GitHub' },
];

export const defaultAuthSupportAction: AuthSupportAction<string> = {
	iconLabel: 'WA',
	label: 'Call us on WhatsApp',
};

const modeCopy: Record<
	AuthMode,
	{
		modeSwitchActionLabel: string;
		modeSwitchLabel: string;
		nextMode: AuthMode;
		panelTitlePrefix: string;
		providerAction: string;
		submitLabel: string;
	}
> = {
	login: {
		modeSwitchActionLabel: 'Sign up',
		modeSwitchLabel: 'Need an account?',
		nextMode: 'signup',
		panelTitlePrefix: 'Log in to',
		providerAction: 'Log in with',
		submitLabel: 'Continue with email',
	},
	signup: {
		modeSwitchActionLabel: 'Log in',
		modeSwitchLabel: 'Already have an account?',
		nextMode: 'login',
		panelTitlePrefix: 'Sign up for',
		providerAction: 'Sign up with',
		submitLabel: 'Continue with email',
	},
};

export function reduceAuthAccessState(
	state: AuthAccessState,
	action: AuthAccessAction,
): AuthAccessState {
	switch (action.type) {
		case 'set-email':
			return { ...state, email: action.email };
		case 'set-mode':
			return { ...state, mode: action.mode };
	}
}

export function getInitialAuthAccessState({
	defaultEmail = '',
	defaultMode = 'signup',
}: {
	defaultEmail?: string;
	defaultMode?: AuthMode;
} = {}): AuthAccessState {
	return {
		email: defaultEmail,
		mode: defaultMode,
	};
}

export function createAuthAccessModel<TContent = AuthContent>({
	bullet,
	emailLabel,
	emailPlaceholder = 'example@email.com',
	fallbackProductName = 'PIKABOO',
	features,
	headline,
	headlineAccent,
	metrics,
	mode = 'signup',
	poweredBy,
	productName,
	secureLabel,
	ssoProviders,
	submitLabel,
	subtitle,
	supportAction,
}: AuthAccessInput<TContent> = {}): AuthAccessModel<TContent> {
	const copy = modeCopy[mode];
	const resolvedProductName = normalizeProductName(
		productName,
		fallbackProductName,
	);
	const productNameText = contentToText(
		resolvedProductName,
		fallbackProductName,
	);
	const resolvedSubtitle =
		subtitle ??
		(`${productNameText} transforms ground-level data into decision-grade location intelligence.` as TContent);

	return {
		bullet:
			bullet ??
			('Powered by cutting-edge Geo-LLMs for OOH measurement' as TContent),
		emailLabel: emailLabel ?? ('Email' as TContent),
		emailPlaceholder,
		features:
			features ??
			(defaultAuthFeatures as readonly AuthFeature<unknown>[] as readonly AuthFeature<TContent>[]),
		headline: headline ?? ("Unlock Africa's" as TContent),
		headlineAccent: headlineAccent ?? ('Hidden Markets' as TContent),
		metrics:
			metrics ??
			(defaultAuthMetrics as readonly AuthMetric<unknown>[] as readonly AuthMetric<TContent>[]),
		mode,
		modeSwitchActionLabel: copy.modeSwitchActionLabel as TContent,
		modeSwitchLabel: copy.modeSwitchLabel as TContent,
		nextMode: copy.nextMode,
		panelTitle: `${copy.panelTitlePrefix} ${productNameText}`,
		poweredBy: poweredBy ?? ('Stytch' as TContent),
		productName: resolvedProductName,
		secureLabel: secureLabel ?? ('Secure authentication' as TContent),
		ssoProviders: normalizeSsoProviders(
			ssoProviders ??
				(defaultAuthSsoProviders as readonly AuthSsoProvider<unknown>[] as readonly AuthSsoProvider<TContent>[]),
			copy.providerAction,
		),
		submitLabel: submitLabel ?? (copy.submitLabel as TContent),
		subtitleLead: resolvedProductName,
		subtitleRest: stripLeadingProduct(resolvedSubtitle, productNameText),
		supportAction: normalizeSupportAction(
			supportAction === undefined
				? (defaultAuthSupportAction as AuthSupportAction<unknown> as AuthSupportAction<TContent>)
				: supportAction,
		),
	};
}

function normalizeSsoProviders<TContent>(
	providers: readonly AuthSsoProvider<TContent>[],
	providerAction: string,
): readonly AuthSsoProviderModel<TContent>[] {
	return providers.map((provider) => {
		const label = contentToText(provider.label, provider.id);
		const ariaLabel = provider.ariaLabel ?? `${providerAction} ${label}`;

		return {
			...provider,
			ariaLabel,
			key: provider.id,
		};
	});
}

function normalizeSupportAction<TContent>(
	supportAction: AuthSupportAction<TContent> | null,
): AuthSupportActionModel<TContent> | undefined {
	if (!supportAction) return undefined;
	const label = contentToText(supportAction.label, 'Contact support');

	return {
		...supportAction,
		ariaLabel: supportAction.ariaLabel ?? label,
	};
}

function normalizeProductName<TContent>(
	productName: TContent | undefined,
	fallbackProductName: string,
): TContent | string {
	if (typeof productName !== 'string') {
		return productName ?? fallbackProductName;
	}

	const normalized = productName.trim();
	return normalized && normalized !== '-' ? normalized : fallbackProductName;
}

function stripLeadingProduct<TContent>(
	subtitle: TContent,
	productName: string,
): TContent {
	if (typeof subtitle !== 'string') {
		return subtitle;
	}

	const normalizedSubtitle = subtitle.trim();
	if (normalizedSubtitle.toLowerCase().startsWith(productName.toLowerCase())) {
		return normalizedSubtitle.slice(productName.length).trimStart() as TContent;
	}

	return subtitle;
}

function contentToText(content: unknown, fallback: string): string {
	if (typeof content === 'string') {
		const normalized = content.trim();
		return normalized && normalized !== '-' ? normalized : fallback;
	}
	if (typeof content === 'number') return String(content);
	return fallback;
}
