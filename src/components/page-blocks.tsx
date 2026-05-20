import {
	type AnchorHTMLAttributes,
	type FormEvent,
	type HTMLAttributes,
	type ReactNode,
	useId,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { AuthAccessScreen, type AuthAccessScreenProps } from './auth';
import { Accordion } from './disclosure';
import { Footer, type FooterProps } from './footer';
import { Icon, isPdsIconName, type PdsIconName } from './icons';
import { PaymentForm, type PaymentFormProps } from './payment';

export type PageBlockBrand = 'pikaboo' | 'primedia';
export type PageBlockTone = 'expressive' | 'product' | 'relief' | 'serious';
export type PageBlockScheme = 'dark' | 'light';

export interface PageBlockThemeProps {
	brand?: PageBlockBrand;
	scheme?: PageBlockScheme;
	tone?: PageBlockTone;
}

export interface PageBlockAction
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	icon?: PdsIconName | ReactNode;
	intent?: 'default' | 'urgent';
	label: ReactNode;
	variant?: 'primary' | 'secondary' | 'text';
}

type PageSectionAttributes = Omit<HTMLAttributes<HTMLElement>, 'title'>;

const themeClassNames = ({
	brand = 'pikaboo',
	scheme = 'light',
	tone = 'serious',
}: PageBlockThemeProps) => [
	'pds-page-blocks',
	`pds-page-blocks--brand-${brand}`,
	`pds-page-blocks--scheme-${scheme}`,
	`pds-page-blocks--tone-${tone}`,
];

const renderBlockIcon = (icon: PdsIconName | ReactNode | undefined) => {
	if (!icon) return null;
	return isPdsIconName(icon) ? <Icon name={icon} size={20} /> : icon;
};

function PageAction({ action }: { action: PageBlockAction }) {
	const {
		className,
		icon,
		intent = 'default',
		label,
		variant = 'primary',
		...props
	} = action;

	return (
		<a
			className={cx(
				'pds-page-action',
				`pds-page-action--${variant}`,
				`pds-page-action--${intent}`,
				className,
			)}
			{...props}
		>
			{renderBlockIcon(icon)}
			<span>{label}</span>
		</a>
	);
}

export interface PageTemplateProps
	extends HTMLAttributes<HTMLDivElement>,
		PageBlockThemeProps {
	footer?: FooterProps | ReactNode;
}

export function PageTemplate({
	brand = 'pikaboo',
	children,
	className,
	footer,
	scheme = 'light',
	tone = 'serious',
	...props
}: PageTemplateProps) {
	const footerNode =
		footer === undefined ? null : isFooterProps(footer) ? (
			<Footer {...footer} />
		) : (
			footer
		);

	return (
		<div
			className={cx(
				...themeClassNames({ brand, scheme, tone }),
				'pds-page-template',
				className,
			)}
			{...props}
		>
			{children}
			{footerNode}
		</div>
	);
}

function isFooterProps(value: FooterProps | ReactNode): value is FooterProps {
	return (
		!!value &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		!('type' in value) &&
		('sections' in value || 'legalLinks' in value || 'socialLinks' in value)
	);
}

export interface PageHeroProps
	extends PageSectionAttributes,
		PageBlockThemeProps {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	eyebrow?: ReactNode;
	media?: ReactNode;
	title: ReactNode;
	trustNote?: ReactNode;
}

export function PageHero({
	actions = [],
	brand = 'pikaboo',
	className,
	description,
	eyebrow,
	media,
	scheme = 'light',
	title,
	tone = 'serious',
	trustNote,
	...props
}: PageHeroProps) {
	return (
		<section
			className={cx(
				...themeClassNames({ brand, scheme, tone }),
				'pds-page-hero',
				className,
			)}
			{...props}
		>
			<div className="pds-page-hero__copy">
				{eyebrow ? <p className="pds-page-hero__eyebrow">{eyebrow}</p> : null}
				<h1>{title}</h1>
				{description ? (
					<p className="pds-page-hero__description">{description}</p>
				) : null}
				{actions.length ? (
					<div className="pds-page-hero__actions">
						{actions.map((action, index) => (
							<PageAction action={action} key={index} />
						))}
					</div>
				) : null}
				{trustNote ? <p className="pds-page-hero__trust">{trustNote}</p> : null}
			</div>
			<div
				className={cx(
					'pds-page-hero__media',
					!media && 'pds-page-hero__media--generated',
				)}
			>
				{media}
			</div>
		</section>
	);
}

export type LogoCloudVariant = 'band' | 'default';

export interface LogoCloudProps extends PageSectionAttributes {
	eyebrow?: ReactNode;
	items: readonly ReactNode[];
	title?: ReactNode;
	variant?: LogoCloudVariant;
}

export function LogoCloud({
	className,
	eyebrow,
	items,
	title = 'Trusted by teams building with the suite',
	variant = 'default',
	...props
}: LogoCloudProps) {
	const isBand = variant === 'band';

	return (
		<section
			className={cx(
				'pds-logo-cloud',
				isBand && 'pds-logo-cloud--band',
				className,
			)}
			{...props}
		>
			{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
			{title && !isBand ? <h2>{title}</h2> : null}
			{title && isBand ? (
				<span className="pds-visually-hidden">{title}</span>
			) : null}
			<ul>
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</section>
	);
}

export interface PageFeatureItem {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	title: ReactNode;
}

export interface FeatureGridProps extends PageSectionAttributes {
	description?: ReactNode;
	items: readonly PageFeatureItem[];
	title?: ReactNode;
}

export function FeatureGrid({
	className,
	description,
	items,
	title = 'Built for the work around the page',
	...props
}: FeatureGridProps) {
	return (
		<section className={cx('pds-feature-grid-section', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
			</header>
			<ul className="pds-feature-grid">
				{items.map((item, index) => (
					<li className="pds-feature-card" key={index}>
						{item.icon ? (
							<span className="pds-feature-card__icon">
								{renderBlockIcon(item.icon)}
							</span>
						) : null}
						<strong>{item.title}</strong>
						{item.description ? <p>{item.description}</p> : null}
					</li>
				))}
			</ul>
		</section>
	);
}

export interface FeatureSplitProps extends PageSectionAttributes {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	eyebrow?: ReactNode;
	media?: ReactNode;
	reverse?: boolean;
	title: ReactNode;
}

export function FeatureSplit({
	actions = [],
	className,
	description,
	eyebrow,
	media,
	reverse = false,
	title,
	...props
}: FeatureSplitProps) {
	return (
		<section
			className={cx(
				'pds-feature-split',
				reverse && 'pds-feature-split--reverse',
				className,
			)}
			{...props}
		>
			<div>
				{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
				{actions.length ? (
					<div className="pds-page-actions">
						{actions.map((action, index) => (
							<PageAction action={action} key={index} />
						))}
					</div>
				) : null}
			</div>
			<div className="pds-feature-split__media">{media}</div>
		</section>
	);
}

export interface PageStatItem {
	label: ReactNode;
	value: ReactNode;
}

export interface StatsStripProps extends HTMLAttributes<HTMLElement> {
	items: readonly PageStatItem[];
}

export function StatsStrip({ className, items, ...props }: StatsStripProps) {
	return (
		<section className={cx('pds-stats-strip', className)} {...props}>
			<ul>
				{items.map((item, index) => (
					<li key={index}>
						<strong>{item.value}</strong>
						<span>{item.label}</span>
					</li>
				))}
			</ul>
		</section>
	);
}

export type TestimonialBandVariant = 'default' | 'pull';

export type TestimonialAccentDoodle = 'arrows' | 'crown' | 'none' | 'squiggle';

export interface TestimonialBandProps extends HTMLAttributes<HTMLElement> {
	accentDoodle?: TestimonialAccentDoodle;
	attribution?: ReactNode;
	authorAvatar?: ReactNode;
	authorName?: ReactNode;
	authorRole?: ReactNode;
	eyebrow?: ReactNode;
	photo?: ReactNode;
	quote: ReactNode;
	variant?: TestimonialBandVariant;
}

export function TestimonialBand({
	accentDoodle = 'none',
	attribution,
	authorAvatar,
	authorName,
	authorRole,
	className,
	eyebrow,
	photo,
	quote,
	variant = 'default',
	...props
}: TestimonialBandProps) {
	if (variant === 'pull') {
		return (
			<section
				className={cx(
					'pds-testimonial-band',
					'pds-testimonial-band--pull',
					className,
				)}
				{...props}
			>
				<div className="pds-testimonial-band__photo">
					{photo}
					{accentDoodle !== 'none' ? (
						<span
							aria-hidden="true"
							className={cx(
								'pds-testimonial-band__doodle',
								`pds-testimonial-band__doodle--${accentDoodle}`,
							)}
						/>
					) : null}
				</div>
				<div className="pds-testimonial-band__copy">
					{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
					<Icon
						className="pds-testimonial-band__quote-icon"
						name="quote"
						size={40}
					/>
					<blockquote>
						<p>{quote}</p>
					</blockquote>
					{authorName || authorRole || authorAvatar ? (
						<div className="pds-testimonial-band__author">
							{authorAvatar ? (
								<span className="pds-testimonial-band__avatar">
									{authorAvatar}
								</span>
							) : null}
							<div className="pds-testimonial-band__author-text">
								{authorName ? (
									<span className="pds-testimonial-band__author-name">
										{authorName}
									</span>
								) : null}
								{authorRole ? (
									<span className="pds-testimonial-band__author-role">
										{authorRole}
									</span>
								) : null}
							</div>
						</div>
					) : null}
				</div>
			</section>
		);
	}

	return (
		<section className={cx('pds-testimonial-band', className)} {...props}>
			<blockquote>
				<p>{quote}</p>
				{attribution ? <footer>{attribution}</footer> : null}
			</blockquote>
		</section>
	);
}

export interface PricingPlan {
	ctaHref?: string;
	ctaLabel?: ReactNode;
	features?: readonly ReactNode[];
	highlighted?: boolean;
	name: ReactNode;
	price: ReactNode;
}

export interface PricingSectionProps extends PageSectionAttributes {
	plans: readonly PricingPlan[];
	title?: ReactNode;
}

export function PricingSection({
	className,
	plans,
	title = 'Choose the right level of support',
	...props
}: PricingSectionProps) {
	return (
		<section className={cx('pds-pricing-section', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
			</header>
			<ul className="pds-pricing-grid">
				{plans.map((plan, index) => (
					<li
						className={cx(
							'pds-pricing-card',
							plan.highlighted && 'pds-pricing-card--highlighted',
						)}
						key={index}
					>
						<div>
							<strong>{plan.name}</strong>
							<span>{plan.price}</span>
						</div>
						{plan.features?.length ? (
							<ul>
								{plan.features.map((feature, featureIndex) => (
									<li key={featureIndex}>{feature}</li>
								))}
							</ul>
						) : null}
						{plan.ctaLabel ? (
							<PageAction
								action={{
									href: plan.ctaHref ?? '#',
									label: plan.ctaLabel,
									variant: plan.highlighted ? 'primary' : 'secondary',
								}}
							/>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}

export interface FaqSectionItem {
	answer: ReactNode;
	id: string;
	question: ReactNode;
}

export type FaqSectionVariant = 'accordion' | 'default';

export interface FaqSectionProps extends PageSectionAttributes {
	defaultOpenId?: string;
	eyebrow?: ReactNode;
	faqs: readonly FaqSectionItem[];
	title?: ReactNode;
	variant?: FaqSectionVariant;
}

export function FaqSection({
	className,
	defaultOpenId,
	eyebrow,
	faqs,
	title = 'Frequently asked questions',
	variant = 'default',
	...props
}: FaqSectionProps) {
	if (variant === 'accordion') {
		return (
			<FaqSectionAccordion
				className={className}
				defaultOpenId={defaultOpenId}
				eyebrow={eyebrow}
				faqs={faqs}
				title={title}
				{...props}
			/>
		);
	}

	return (
		<section className={cx('pds-faq-section', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
			</header>
			<Accordion
				defaultOpenItems={[faqs[0]?.id ?? '']}
				items={faqs.map((faq) => ({
					content: faq.answer,
					id: faq.id,
					title: faq.question,
				}))}
			/>
		</section>
	);
}

function FaqSectionAccordion({
	className,
	defaultOpenId,
	eyebrow,
	faqs,
	title,
	...props
}: {
	className?: string;
	defaultOpenId?: string;
	eyebrow?: ReactNode;
	faqs: readonly FaqSectionItem[];
	title?: ReactNode;
}) {
	const [openId, setOpenId] = useState<string | null>(
		() => defaultOpenId ?? null,
	);

	return (
		<section
			className={cx('pds-faq-section', 'pds-faq-section--accordion', className)}
			{...props}
		>
			<header className="pds-page-section-header pds-page-section-header--centered">
				{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
				<h2>{title}</h2>
			</header>
			<div className="pds-faq-accordion">
				{faqs.map((faq) => {
					const isOpen = openId === faq.id;
					return (
						<div className="pds-faq-accordion__item" key={faq.id}>
							<button
								aria-controls={`${faq.id}-panel`}
								aria-expanded={isOpen}
								className="pds-faq-accordion__trigger"
								id={`${faq.id}-trigger`}
								onClick={() => setOpenId(isOpen ? null : faq.id)}
								type="button"
							>
								<span className="pds-faq-accordion__question">
									{faq.question}
								</span>
								<span
									aria-hidden="true"
									className={cx(
										'pds-faq-accordion__icon',
										isOpen && 'pds-faq-accordion__icon--open',
									)}
								>
									<Icon name={isOpen ? 'minus' : 'plus'} size={18} />
								</span>
							</button>
							<section
								aria-labelledby={`${faq.id}-trigger`}
								className={cx(
									'pds-faq-accordion__panel',
									isOpen && 'pds-faq-accordion__panel--open',
								)}
								hidden={!isOpen}
								id={`${faq.id}-panel`}
							>
								<div className="pds-faq-accordion__panel-inner">
									{faq.answer}
								</div>
							</section>
						</div>
					);
				})}
			</div>
		</section>
	);
}

export interface ContactStripProps extends PageSectionAttributes {
	actions: readonly PageBlockAction[];
	description?: ReactNode;
	title?: ReactNode;
}

export function ContactStrip({
	actions,
	className,
	description = 'Reach the right team quickly.',
	title = 'Need help?',
	...props
}: ContactStripProps) {
	return (
		<section className={cx('pds-contact-strip', className)} {...props}>
			<div>
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
			</div>
			<div className="pds-page-actions">
				{actions.map((action, index) => (
					<PageAction action={action} key={index} />
				))}
			</div>
		</section>
	);
}

export interface FinalCtaProps extends PageSectionAttributes {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	title: ReactNode;
}

export function FinalCta({
	actions = [],
	className,
	description,
	title,
	...props
}: FinalCtaProps) {
	return (
		<section className={cx('pds-final-cta', className)} {...props}>
			<h2>{title}</h2>
			{description ? <p>{description}</p> : null}
			{actions.length ? (
				<div className="pds-page-actions">
					{actions.map((action, index) => (
						<PageAction action={action} key={index} />
					))}
				</div>
			) : null}
		</section>
	);
}

export type SignupPanelVariant = 'auth' | 'newsletter';

export type SignupPanelScheme = 'dark' | 'light';

export interface NewsletterSubmitValues {
	email: string;
}

export interface SignupPanelProps extends PageSectionAttributes {
	authProps?: Partial<AuthAccessScreenProps>;
	description?: ReactNode;
	disclaimer?: ReactNode;
	emailLabel?: string;
	eyebrow?: ReactNode;
	onNewsletterSubmit?: (values: NewsletterSubmitValues) => void | Promise<void>;
	placeholder?: string;
	scheme?: SignupPanelScheme;
	submitLabel?: ReactNode;
	title?: ReactNode;
	variant?: SignupPanelVariant;
}

export function SignupPanel({
	authProps,
	className,
	description,
	disclaimer,
	emailLabel = 'Email address',
	eyebrow,
	onNewsletterSubmit,
	placeholder = 'your@email.com',
	scheme = 'dark',
	submitLabel = 'Subscribe',
	title = 'Create an account',
	variant = 'auth',
	...props
}: SignupPanelProps) {
	if (variant === 'newsletter') {
		const { onSubmit: _onSubmit, ...sectionProps } =
			props as HTMLAttributes<HTMLElement>;
		return (
			<NewsletterPanelContent
				className={className}
				description={description}
				disclaimer={disclaimer}
				emailLabel={emailLabel}
				eyebrow={eyebrow}
				onNewsletterSubmit={onNewsletterSubmit}
				placeholder={placeholder}
				scheme={scheme}
				submitLabel={submitLabel}
				title={title === 'Create an account' ? 'Stay in the loop' : title}
				{...sectionProps}
			/>
		);
	}

	return (
		<section className={cx('pds-signup-panel', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
			</header>
			<AuthAccessScreen defaultMode="signup" {...authProps} />
		</section>
	);
}

function NewsletterPanelContent({
	className,
	description,
	disclaimer,
	emailLabel,
	eyebrow,
	onNewsletterSubmit,
	placeholder,
	scheme,
	submitLabel,
	title,
	...props
}: {
	className?: string;
	description?: ReactNode;
	disclaimer?: ReactNode;
	emailLabel: string;
	eyebrow?: ReactNode;
	onNewsletterSubmit?: (values: NewsletterSubmitValues) => void | Promise<void>;
	placeholder: string;
	scheme: SignupPanelScheme;
	submitLabel: ReactNode;
	title: ReactNode;
}) {
	const inputId = useId();
	const [email, setEmail] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const value = email.trim();
		if (!value) {
			setError('Please enter an email address.');
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			await onNewsletterSubmit?.({ email: value });
			setSuccess(true);
			setEmail('');
		} catch (submissionError) {
			setError(
				submissionError instanceof Error
					? submissionError.message
					: 'Something went wrong. Please try again.',
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section
			className={cx(
				'pds-signup-panel',
				'pds-signup-panel--newsletter',
				`pds-signup-panel--scheme-${scheme}`,
				className,
			)}
			data-scheme={scheme}
			{...props}
		>
			<div className="pds-signup-panel__copy">
				{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
				<h2>{title}</h2>
				{description ? (
					<p className="pds-signup-panel__description">{description}</p>
				) : null}
			</div>
			<form
				aria-busy={submitting}
				className="pds-signup-panel__form"
				onSubmit={handleSubmit}
			>
				<label className="pds-visually-hidden" htmlFor={inputId}>
					{emailLabel}
				</label>
				<span aria-hidden="true" className="pds-signup-panel__form-icon">
					<Icon name="mail" size={18} />
				</span>
				<input
					aria-invalid={Boolean(error)}
					autoComplete="email"
					className="pds-signup-panel__input"
					disabled={submitting}
					id={inputId}
					inputMode="email"
					name="email"
					onChange={(event) => {
						setEmail(event.target.value);
						if (error) setError(null);
						if (success) setSuccess(false);
					}}
					placeholder={placeholder}
					required
					type="email"
					value={email}
				/>
				<button
					className="pds-signup-panel__submit"
					disabled={submitting}
					type="submit"
				>
					{submitting ? 'Submitting…' : submitLabel}
				</button>
			</form>
			{error ? (
				<p
					className="pds-signup-panel__feedback pds-signup-panel__feedback--error"
					role="alert"
				>
					{error}
				</p>
			) : null}
			{success ? (
				<output className="pds-signup-panel__feedback pds-signup-panel__feedback--success">
					Thanks — you're subscribed.
				</output>
			) : null}
			{disclaimer ? (
				<p className="pds-signup-panel__disclaimer">{disclaimer}</p>
			) : null}
		</section>
	);
}

export interface DonationPanelProps extends PageSectionAttributes {
	description?: ReactNode;
	paymentFormProps?: Partial<PaymentFormProps>;
	title?: ReactNode;
}

export function DonationPanel({
	className,
	description,
	paymentFormProps,
	title = 'Donate to urgent relief',
	...props
}: DonationPanelProps) {
	return (
		<section className={cx('pds-donation-panel', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
				{description ? <p>{description}</p> : null}
			</header>
			<PaymentForm
				title={typeof title === 'string' ? title : 'Support the work'}
				{...paymentFormProps}
			/>
		</section>
	);
}

export interface ReliefImpactItem {
	description: ReactNode;
	label: ReactNode;
	value: ReactNode;
}

export interface ReliefImpactSectionProps extends PageSectionAttributes {
	items: readonly ReliefImpactItem[];
	title?: ReactNode;
}

export function ReliefImpactSection({
	className,
	items,
	title = 'What your support funds',
	...props
}: ReliefImpactSectionProps) {
	return (
		<section className={cx('pds-relief-impact', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
			</header>
			<ul>
				{items.map((item, index) => (
					<li key={index}>
						<strong>{item.value}</strong>
						<span>{item.label}</span>
						<p>{item.description}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

export interface TransparencyItem {
	description: ReactNode;
	title: ReactNode;
}

export interface TransparencySectionProps extends PageSectionAttributes {
	items: readonly TransparencyItem[];
	title?: ReactNode;
}

export function TransparencySection({
	className,
	items,
	title = 'How funds are handled',
	...props
}: TransparencySectionProps) {
	return (
		<section className={cx('pds-transparency-section', className)} {...props}>
			<header className="pds-page-section-header">
				<h2>{title}</h2>
			</header>
			<ul>
				{items.map((item, index) => (
					<li key={index}>
						<strong>{item.title}</strong>
						<p>{item.description}</p>
					</li>
				))}
			</ul>
		</section>
	);
}

export type AnnotatedHeadlineAnnotation =
	| 'highlight'
	| 'squiggle'
	| 'underline';

export interface AnnotatedTextProps extends HTMLAttributes<HTMLSpanElement> {
	annotation?: AnnotatedHeadlineAnnotation;
}

export function AnnotatedText({
	annotation,
	children,
	className,
	...props
}: AnnotatedTextProps) {
	return (
		<span
			className={cx(
				'pds-annotated-headline__token',
				annotation && `pds-annotated-headline__token--${annotation}`,
				className,
			)}
			{...props}
		>
			<span className="pds-annotated-headline__token-text">{children}</span>
			{annotation === 'squiggle' ? (
				<svg
					aria-hidden="true"
					className="pds-annotated-headline__squiggle"
					preserveAspectRatio="none"
					viewBox="0 0 200 14"
				>
					<path
						d="M2 9 Q 20 2 40 8 T 80 8 T 120 8 T 160 8 T 198 8"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeWidth="5"
					/>
				</svg>
			) : null}
		</span>
	);
}

export type AnnotatedHeadlineDoodleType = 'arrows' | 'crown' | 'squiggle';
export type AnnotatedHeadlineDoodlePosition =
	| 'bottom-left'
	| 'bottom-right'
	| 'top-left'
	| 'top-right';

export interface AnnotatedHeadlineDoodle {
	position: AnnotatedHeadlineDoodlePosition;
	type: AnnotatedHeadlineDoodleType;
}

export interface AnnotatedHeadlineProps extends PageSectionAttributes {
	body?: ReactNode;
	doodles?: readonly AnnotatedHeadlineDoodle[];
	eyebrow?: ReactNode;
	headline: ReactNode;
}

const annotatedHeadlineDoodlePath: Record<AnnotatedHeadlineDoodleType, string> =
	{
		arrows: 'M2 30 Q 20 6 50 30 T 96 30 M 80 18 l 16 12 -16 12',
		crown: 'M4 26 L14 8 L24 22 L34 6 L44 22 L54 10 L60 30 Z',
		squiggle: 'M2 16 Q 14 2 26 16 T 50 16 T 74 16 T 96 16',
	};

export function AnnotatedHeadline({
	body,
	className,
	doodles,
	eyebrow,
	headline,
	...props
}: AnnotatedHeadlineProps) {
	return (
		<section className={cx('pds-annotated-headline', className)} {...props}>
			{eyebrow ? (
				<p className="pds-page-eyebrow pds-annotated-headline__eyebrow">
					{eyebrow}
				</p>
			) : null}
			<h2 className="pds-annotated-headline__headline">
				{headline}
				{doodles?.map((doodle, index) => (
					<svg
						aria-hidden="true"
						className={cx(
							'pds-annotated-headline__doodle',
							`pds-annotated-headline__doodle--${doodle.type}`,
							`pds-annotated-headline__doodle--${doodle.position}`,
						)}
						fill="none"
						key={index}
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="3"
						viewBox="0 0 100 40"
					>
						<path d={annotatedHeadlineDoodlePath[doodle.type]} />
					</svg>
				))}
			</h2>
			{body ? <p className="pds-annotated-headline__body">{body}</p> : null}
		</section>
	);
}

export interface ProcessTimelineStep {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	id?: string;
	number?: ReactNode;
	title: ReactNode;
}

export interface ProcessTimelineProps extends PageSectionAttributes {
	eyebrow?: ReactNode;
	headline?: ReactNode;
	steps: readonly ProcessTimelineStep[];
}

export function ProcessTimeline({
	className,
	eyebrow,
	headline,
	steps,
	...props
}: ProcessTimelineProps) {
	return (
		<section className={cx('pds-process-timeline', className)} {...props}>
			{eyebrow || headline ? (
				<header className="pds-page-section-header pds-page-section-header--centered">
					{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
					{headline ? <h2>{headline}</h2> : null}
				</header>
			) : null}
			<ol className="pds-process-timeline__steps">
				<span aria-hidden="true" className="pds-process-timeline__connector" />
				{steps.map((step, index) => {
					const numberLabel = step.number ?? String(index + 1).padStart(2, '0');
					return (
						<li className="pds-process-timeline__step" key={step.id ?? index}>
							<span className="pds-process-timeline__icon">
								{renderBlockIcon(step.icon ?? 'spark')}
							</span>
							<span className="pds-process-timeline__number">
								{numberLabel}
							</span>
							<h3 className="pds-process-timeline__title">{step.title}</h3>
							{step.description ? (
								<p className="pds-process-timeline__description">
									{step.description}
								</p>
							) : null}
						</li>
					);
				})}
			</ol>
		</section>
	);
}

export type TeamMemberTone = 'magenta' | 'purple' | 'slate';

export interface TeamMember {
	bio?: ReactNode;
	brandTag?: ReactNode;
	id?: string;
	name: ReactNode;
	photo?: ReactNode;
	role?: ReactNode;
	tone?: TeamMemberTone;
}

export interface TeamGridProps extends PageSectionAttributes {
	eyebrow?: ReactNode;
	headline?: ReactNode;
	linkHref?: string;
	linkLabel?: ReactNode;
	people: readonly TeamMember[];
}

export function TeamGrid({
	className,
	eyebrow,
	headline,
	linkHref,
	linkLabel,
	people,
	...props
}: TeamGridProps) {
	return (
		<section className={cx('pds-team-grid-section', className)} {...props}>
			{eyebrow || headline || linkLabel ? (
				<header className="pds-team-grid-section__header">
					<div>
						{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
						{headline ? <h2>{headline}</h2> : null}
					</div>
					{linkLabel ? (
						<a className="pds-team-grid-section__link" href={linkHref ?? '#'}>
							<span>{linkLabel}</span>
							<Icon name="arrow-right" size={14} />
						</a>
					) : null}
				</header>
			) : null}
			<ul className="pds-team-grid">
				{people.map((person, index) => (
					<li
						className={cx(
							'pds-team-grid__person',
							person.tone && `pds-team-grid__person--tone-${person.tone}`,
						)}
						key={person.id ?? index}
					>
						<div className="pds-team-grid__photo">
							{person.photo ?? (
								<div className="pds-team-grid__photo-placeholder" />
							)}
							{person.brandTag ? (
								<span className="pds-team-grid__tag">{person.brandTag}</span>
							) : null}
						</div>
						<h3 className="pds-team-grid__name">{person.name}</h3>
						{person.role ? (
							<p className="pds-team-grid__role">{person.role}</p>
						) : null}
						{person.bio ? (
							<p className="pds-team-grid__bio">{person.bio}</p>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}

export type ArticleCardTone = 'magenta' | 'purple' | 'slate';

export interface ArticleCardProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'title'> {
	image?: ReactNode;
	kind?: ReactNode;
	readingTime?: ReactNode;
	title: ReactNode;
	tone?: ArticleCardTone;
}

export function ArticleCard({
	className,
	image,
	kind,
	readingTime,
	title,
	tone,
	...props
}: ArticleCardProps) {
	return (
		<a
			className={cx(
				'pds-article-card',
				tone && `pds-article-card--tone-${tone}`,
				className,
			)}
			{...props}
		>
			<div className="pds-article-card__media">
				{image ?? <div className="pds-article-card__media-placeholder" />}
			</div>
			<div className="pds-article-card__body">
				{kind || readingTime ? (
					<p className="pds-article-card__meta">
						{kind ? (
							<span className="pds-article-card__kind">{kind}</span>
						) : null}
						{kind && readingTime ? (
							<span aria-hidden="true" className="pds-article-card__separator">
								·
							</span>
						) : null}
						{readingTime ? (
							<span className="pds-article-card__reading-time">
								{readingTime}
							</span>
						) : null}
					</p>
				) : null}
				<h3 className="pds-article-card__title">{title}</h3>
			</div>
		</a>
	);
}

export interface ArticleCardGridProps extends PageSectionAttributes {
	eyebrow?: ReactNode;
	headline?: ReactNode;
	items: readonly ArticleCardProps[];
	linkHref?: string;
	linkLabel?: ReactNode;
}

export function ArticleCardGrid({
	className,
	eyebrow,
	headline,
	items,
	linkHref,
	linkLabel,
	...props
}: ArticleCardGridProps) {
	return (
		<section className={cx('pds-article-card-grid', className)} {...props}>
			{eyebrow || headline || linkLabel ? (
				<header className="pds-article-card-grid__header">
					<div>
						{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
						{headline ? <h2>{headline}</h2> : null}
					</div>
					{linkLabel ? (
						<a className="pds-article-card-grid__link" href={linkHref ?? '#'}>
							<span>{linkLabel}</span>
							<Icon name="arrow-right" size={14} />
						</a>
					) : null}
				</header>
			) : null}
			<ul className="pds-article-card-grid__items">
				{items.map((item, index) => (
					<li key={index}>
						<ArticleCard {...item} />
					</li>
				))}
			</ul>
		</section>
	);
}

export type CoverageMapCityStatus = 'live' | 'soon';

export interface CoverageMapCity {
	detail?: ReactNode;
	id?: string;
	name: ReactNode;
	status: CoverageMapCityStatus;
	x: number;
	y: number;
}

export type CoverageMapSilhouetteKey = 'south-africa';

export interface CoverageMapProps extends PageSectionAttributes {
	cities: readonly CoverageMapCity[];
	eyebrow?: ReactNode;
	headline?: ReactNode;
	silhouettePath?: string;
	silhouetteKey?: CoverageMapSilhouetteKey;
}

export const coverageMapSilhouettes: Record<CoverageMapSilhouetteKey, string> =
	{
		'south-africa':
			'M12 38 L18 30 L30 28 L42 24 L54 22 L66 24 L76 30 L86 34 L92 42 L94 54 L92 64 L86 70 L82 78 L72 86 L62 92 L52 94 L42 92 L34 88 L26 86 L20 80 L14 72 L10 60 L8 48 Z',
	};

export function CoverageMap({
	cities,
	className,
	eyebrow,
	headline,
	silhouetteKey = 'south-africa',
	silhouettePath,
	...props
}: CoverageMapProps) {
	const resolvedPath = silhouettePath ?? coverageMapSilhouettes[silhouetteKey];

	return (
		<section className={cx('pds-coverage-map-section', className)} {...props}>
			{eyebrow || headline ? (
				<header className="pds-page-section-header pds-page-section-header--centered">
					{eyebrow ? <p className="pds-page-eyebrow">{eyebrow}</p> : null}
					{headline ? <h2>{headline}</h2> : null}
				</header>
			) : null}
			<div className="pds-coverage-map">
				<div className="pds-coverage-map__map">
					<svg
						aria-hidden="true"
						className="pds-coverage-map__svg"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 100 100"
					>
						<path
							className="pds-coverage-map__silhouette"
							d={resolvedPath}
							fill="var(--theme-page-bg)"
							stroke="var(--theme-primary)"
							strokeDasharray="1 1"
							strokeOpacity="0.35"
							strokeWidth="0.6"
						/>
						{cities.map((city, index) => {
							const isLive = city.status === 'live';
							return (
								<g key={city.id ?? index}>
									<circle
										className={cx(
											'pds-coverage-map__pin',
											`pds-coverage-map__pin--${city.status}`,
										)}
										cx={city.x}
										cy={city.y}
										fill={isLive ? 'var(--theme-primary)' : 'transparent'}
										r={isLive ? 4 : 2.5}
										stroke="var(--theme-primary)"
										strokeDasharray={isLive ? undefined : '1.2 1.2'}
										strokeWidth={isLive ? 0.8 : 1.4}
									/>
									{isLive ? (
										<circle
											className="pds-coverage-map__pin-halo"
											cx={city.x}
											cy={city.y}
											fill="none"
											r="7"
											stroke="var(--theme-primary)"
											strokeOpacity="0.4"
											strokeWidth="0.4"
										/>
									) : null}
								</g>
							);
						})}
					</svg>
				</div>
				<ul className="pds-coverage-map__list">
					{cities.map((city, index) => (
						<li
							className={cx(
								'pds-coverage-map__city',
								`pds-coverage-map__city--${city.status}`,
							)}
							key={city.id ?? index}
						>
							<span
								aria-hidden="true"
								className={cx(
									'pds-coverage-map__city-dot',
									`pds-coverage-map__city-dot--${city.status}`,
								)}
							/>
							<div className="pds-coverage-map__city-text">
								<span className="pds-coverage-map__city-name">{city.name}</span>
								{city.detail ? (
									<span className="pds-coverage-map__city-detail">
										{city.detail}
									</span>
								) : null}
							</div>
							<span
								className={cx(
									'pds-coverage-map__city-status',
									`pds-coverage-map__city-status--${city.status}`,
								)}
							>
								{city.status === 'live' ? 'Live' : 'Coming'}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
