import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';
import { BrandLockup } from './brand';
import { Icon } from './icons';

export interface FooterLink
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	label: ReactNode;
}

export interface FooterSection {
	links: readonly FooterLink[];
	title: ReactNode;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
	actions?: ReactNode;
	brand?: ReactNode;
	description?: ReactNode;
	legalLinks?: readonly FooterLink[];
	sections?: readonly FooterSection[];
	socialLinks?: readonly FooterLink[];
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
	description = 'Building the ultimate dataset for Africa',
	legalLinks = defaultLegalLinks,
	sections = defaultFooterSections,
	socialLinks,
	...props
}: FooterProps) {
	const year = new Date().getFullYear();

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
				<span>© {year} Pikaboo</span>
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
	const { label, ...props } = link;
	const icon =
		typeof label === 'string' && label.toLowerCase().includes('whatsapp') ? (
			<Icon name="whatsapp" size={16} />
		) : null;

	return (
		<a {...props}>
			{icon}
			<span>{label}</span>
		</a>
	);
}
