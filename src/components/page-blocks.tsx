import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
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

export interface LogoCloudProps extends PageSectionAttributes {
	items: readonly ReactNode[];
	title?: ReactNode;
}

export function LogoCloud({
	className,
	items,
	title = 'Trusted by teams building with the suite',
	...props
}: LogoCloudProps) {
	return (
		<section className={cx('pds-logo-cloud', className)} {...props}>
			{title ? <h2>{title}</h2> : null}
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

export interface TestimonialBandProps extends HTMLAttributes<HTMLElement> {
	attribution?: ReactNode;
	quote: ReactNode;
}

export function TestimonialBand({
	attribution,
	className,
	quote,
	...props
}: TestimonialBandProps) {
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

export interface FaqSectionProps extends PageSectionAttributes {
	faqs: readonly FaqSectionItem[];
	title?: ReactNode;
}

export function FaqSection({
	className,
	faqs,
	title = 'Frequently asked questions',
	...props
}: FaqSectionProps) {
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

export interface SignupPanelProps extends PageSectionAttributes {
	authProps?: Partial<AuthAccessScreenProps>;
	description?: ReactNode;
	title?: ReactNode;
}

export function SignupPanel({
	authProps,
	className,
	description,
	title = 'Create an account',
	...props
}: SignupPanelProps) {
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
