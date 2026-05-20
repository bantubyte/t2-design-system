import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';
import { BrandLockup } from './brand';
import { Icon, isPdsIconName, type PdsIconName } from './icons';

export interface FooterLink
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	icon?: PdsIconName | ReactNode;
	label: ReactNode;
}

export interface FooterSection {
	links: readonly FooterLink[];
	title: ReactNode;
}

export type FooterStatusTone = 'degraded' | 'down' | 'operational';

export interface FooterStatus {
	label: ReactNode;
	tone?: FooterStatusTone;
}

export type FooterVariant = 'default' | 'mega';

export type FooterScheme = 'dark' | 'light';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
	actions?: ReactNode;
	brand?: ReactNode;
	copyright?: ReactNode;
	description?: ReactNode;
	legalLinks?: readonly FooterLink[];
	scheme?: FooterScheme;
	sections?: readonly FooterSection[];
	socialLinks?: readonly FooterLink[];
	status?: FooterStatus;
	tagline?: ReactNode;
	variant?: FooterVariant;
}

const defaultFooterSections: readonly FooterSection[] = [
	{
		links: [
			{ href: '/platform', label: 'Platform' },
			{ href: '/insights', label: 'Insights' },
			{ href: '/contact', label: 'Contact' },
		],
		title: 'Product',
	},
	{
		links: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/terms', label: 'Terms' },
		],
		title: 'Company',
	},
];

const defaultLegalLinks: readonly FooterLink[] = [
	{ href: '/privacy', label: 'Privacy' },
	{ href: '/terms', label: 'Terms' },
];

export function Footer({
	actions,
	brand,
	className,
	copyright,
	description = 'Building the ultimate dataset for Africa',
	legalLinks = defaultLegalLinks,
	scheme = 'dark',
	sections = defaultFooterSections,
	socialLinks,
	status,
	tagline,
	variant = 'default',
	...props
}: FooterProps) {
	const year = new Date().getFullYear();
	const yearCopy = copyright ?? `© ${year} Pikaboo`;

	if (variant === 'mega') {
		return (
			<footer
				className={cx(
					'pds-footer',
					'pds-footer--mega',
					`pds-footer--scheme-${scheme}`,
					className,
				)}
				data-scheme={scheme}
				{...props}
			>
				<div className="pds-footer-mega__top">
					<div className="pds-footer-mega__brand-column">
						<div className="pds-footer-mega__brand">
							{brand ?? (
								<BrandLockup showTenant={false} subtitle="" useWordmark />
							)}
						</div>
						{tagline ? (
							<p className="pds-footer-mega__tagline">{tagline}</p>
						) : description ? (
							<p className="pds-footer-mega__tagline">{description}</p>
						) : null}
						{socialLinks?.length ? (
							<ul className="pds-footer-mega__social">
								{socialLinks.map((link, index) => (
									<li key={index}>
										<FooterSocialAnchor link={link} />
									</li>
								))}
							</ul>
						) : null}
					</div>
					<nav aria-label="Footer" className="pds-footer-mega__nav">
						{sections.map((section, index) => (
							<div className="pds-footer-mega__section" key={index}>
								<h2 className="pds-footer-mega__section-title">
									{section.title}
								</h2>
								<ul>
									{section.links.map((link, linkIndex) => (
										<li key={linkIndex}>
											<FooterAnchor link={link} />
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>
				<div className="pds-footer-mega__bottom">
					<span className="pds-footer-mega__copyright">{yearCopy}</span>
					{legalLinks.length ? (
						<div className="pds-footer-mega__legal">
							{legalLinks.map((link, index) => (
								<FooterAnchor key={index} link={link} />
							))}
						</div>
					) : null}
					{status ? <FooterStatusPulse status={status} /> : null}
				</div>
			</footer>
		);
	}

	return (
		<footer className={cx('pds-footer', className)} {...props}>
			<div className="pds-footer__main">
				<div className="pds-footer__brand">
					{brand ?? (
						<BrandLockup showTenant={false} subtitle={String(description)} />
					)}
					{actions ? (
						<div className="pds-footer__actions">{actions}</div>
					) : null}
				</div>
				<nav aria-label="Footer" className="pds-footer__nav">
					{sections.map((section, index) => (
						<div className="pds-footer__section" key={index}>
							<h2>{section.title}</h2>
							<ul>
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex}>
										<FooterAnchor link={link} />
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>
			<div className="pds-footer__bottom">
				<span>{yearCopy}</span>
				<div className="pds-footer__links">
					{legalLinks.map((link, index) => (
						<FooterAnchor key={index} link={link} />
					))}
				</div>
				{socialLinks?.length ? (
					<div className="pds-footer__social">
						{socialLinks.map((link, index) => (
							<FooterAnchor key={index} link={link} />
						))}
					</div>
				) : null}
			</div>
		</footer>
	);
}

function FooterAnchor({ link }: { link: FooterLink }) {
	const { icon, label, ...props } = link;
	const resolvedIcon =
		icon !== undefined ? (
			isPdsIconName(icon) ? (
				<Icon name={icon} size={16} />
			) : (
				icon
			)
		) : typeof label === 'string' &&
			label.toLowerCase().includes('whatsapp') ? (
			<Icon name="whatsapp" size={16} />
		) : null;

	return (
		<a {...props}>
			{resolvedIcon}
			<span>{label}</span>
		</a>
	);
}

function FooterSocialAnchor({ link }: { link: FooterLink }) {
	const { icon, label, ...props } = link;
	const resolvedIcon =
		icon !== undefined ? (
			isPdsIconName(icon) ? (
				<Icon name={icon} size={16} />
			) : (
				icon
			)
		) : null;
	const accessibleLabel = typeof label === 'string' ? label : undefined;

	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: footer social anchors always have href; aria-label provides a concise screen-reader name.
		<a
			aria-label={accessibleLabel}
			className="pds-footer-mega__social-link"
			title={accessibleLabel}
			{...props}
		>
			{resolvedIcon}
			<span className="pds-visually-hidden">{label}</span>
		</a>
	);
}

function FooterStatusPulse({ status }: { status: FooterStatus }) {
	const tone = status.tone ?? 'operational';
	return (
		<div
			aria-live="polite"
			className={cx(
				'pds-footer-mega__status',
				`pds-footer-mega__status--${tone}`,
			)}
		>
			<span aria-hidden="true" className="pds-footer-mega__status-dot" />
			<span>{status.label}</span>
		</div>
	);
}
