import {
	type FormEvent,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
	useState,
} from 'react';
import { useTheme } from '../theme';
import { cx } from '../utils/class-names';
import { BrandMark } from './brand';
import { Button } from './button';
import { Field, Input } from './form';

export interface AuthFeature {
	description: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

export interface AuthMetric {
	label: ReactNode;
	value: ReactNode;
}

export interface AuthSignUpValues {
	email: string;
}

export interface AuthSignUpScreenProps
	extends Omit<HTMLAttributes<HTMLElement>, 'onSubmit'> {
	defaultEmail?: string;
	emailInputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'defaultValue' | 'onChange' | 'type' | 'value'
	>;
	features?: readonly AuthFeature[];
	headline?: ReactNode;
	headlineAccent?: ReactNode;
	metrics?: readonly AuthMetric[];
	onEmailChange?: (email: string) => void;
	onSubmit?: (values: AuthSignUpValues) => void;
	poweredBy?: ReactNode;
	productName?: ReactNode;
	secureLabel?: ReactNode;
	submitLabel?: ReactNode;
	subtitle?: ReactNode;
	value?: string;
}

const defaultAuthMetrics: readonly AuthMetric[] = [
	{ label: 'Devices tracked monthly', value: '10M+' },
	{ label: 'Data points processed', value: '1B+' },
];

const defaultAuthFeatures: readonly AuthFeature[] = [
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

export function AuthSignUpScreen({
	className,
	defaultEmail = '',
	emailInputProps,
	features = defaultAuthFeatures,
	headline = "Unlock Africa's",
	headlineAccent = 'Hidden Markets',
	metrics = defaultAuthMetrics,
	onEmailChange,
	onSubmit,
	poweredBy = 'Stytch',
	productName,
	secureLabel = 'Secure authentication',
	submitLabel = 'Continue',
	subtitle,
	value,
	...props
}: AuthSignUpScreenProps) {
	const { theme } = useTheme();
	const [uncontrolledEmail, setUncontrolledEmail] = useState(defaultEmail);
	const email = value ?? uncontrolledEmail;
	const resolvedProductName = normalizeProductName(
		productName ?? theme.copy.productName,
		theme.copy.productName,
	);
	const resolvedSubtitle =
		subtitle ??
		`${resolvedProductName} transforms ground-level data into decision-grade location intelligence.`;
	const setEmail = (nextEmail: string) => {
		if (value === undefined) {
			setUncontrolledEmail(nextEmail);
		}
		onEmailChange?.(nextEmail);
	};
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit?.({ email });
	};

	return (
		<main className={cx('pds-auth-signup', className)} {...props}>
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
						<span>{headline}</span>
						<strong>{headlineAccent}</strong>
					</h1>
					<p className="pds-auth-signup__subtitle">
						<strong>{resolvedProductName}</strong>{' '}
						{stripLeadingProduct(resolvedSubtitle, resolvedProductName)}
					</p>
					<p className="pds-auth-signup__bullet">
						<span aria-hidden="true">•</span>
						Powered by cutting-edge <strong>Geo-LLMs</strong> for OOH
						measurement
					</p>
					<div className="pds-auth-signup__metrics">
						{metrics.map((metric, index) => (
							<div key={index}>
								<strong>{metric.value}</strong>
								<span>{metric.label}</span>
							</div>
						))}
					</div>
					<div className="pds-auth-signup__features">
						{features.map((feature, index) => (
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
						<h2>Continue to {resolvedProductName}</h2>
						<Field label="Email">
							<Input
								placeholder="example@email.com"
								required
								{...emailInputProps}
								onChange={(event) => setEmail(event.target.value)}
								type="email"
								value={email}
							/>
						</Field>
						<Button fullWidth type="submit">
							{submitLabel}
						</Button>
						<p className="pds-auth-signup__powered">
							Powered by <strong>{poweredBy}</strong>
						</p>
					</form>
					<div className="pds-auth-signup__pill">
						<span>Powered by</span>
						<i aria-hidden="true" />
						<strong>Location Intelligence</strong>
					</div>
					<p className="pds-auth-signup__secure">
						<span aria-hidden="true">♙</span> {secureLabel} by {poweredBy}
					</p>
				</div>
			</section>
		</main>
	);
}

const normalizeProductName = (
	productName: ReactNode,
	fallbackProductName: string,
): ReactNode => {
	if (typeof productName !== 'string') return productName;
	const normalized = productName.trim();
	return normalized && normalized !== '-' ? normalized : fallbackProductName;
};

const stripLeadingProduct = (subtitle: ReactNode, productName: ReactNode) => {
	if (typeof subtitle !== 'string' || typeof productName !== 'string') {
		return subtitle;
	}

	const normalizedSubtitle = subtitle.trim();
	if (normalizedSubtitle.toLowerCase().startsWith(productName.toLowerCase())) {
		return normalizedSubtitle.slice(productName.length).trimStart();
	}

	return subtitle;
};
