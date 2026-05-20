import type { HTMLAttributes, SVGProps } from 'react';
import { useTheme } from '../theme';
import { cx } from '../utils/class-names';

export interface BrandMarkProps extends SVGProps<SVGSVGElement> {
	size?: number;
}

export function BrandMark({ className, size = 32, ...props }: BrandMarkProps) {
	return (
		<svg
			aria-hidden="true"
			className={cx('pds-brand-mark', className)}
			fill="none"
			height={size}
			viewBox="0 0 64 64"
			width={size}
			{...props}
		>
			<rect className="pds-brand-mark__field" height="64" rx="14" width="64" />
			<path
				className="pds-brand-mark__arc"
				d="M15 36c6.3-13 24.7-21 37-11"
				strokeLinecap="round"
				strokeWidth="8"
			/>
			<circle className="pds-brand-mark__dot" cx="25" cy="38" r="7" />
			<circle
				className="pds-brand-mark__dot pds-brand-mark__dot--accent"
				cx="43"
				cy="28"
				r="5"
			/>
		</svg>
	);
}

export type PikabooWordmarkTone = 'auto' | 'dark' | 'light' | 'mono';

export interface PikabooWordmarkProps
	extends Omit<SVGProps<SVGSVGElement>, 'title'> {
	accentColor?: string;
	accessibleLabel?: string;
	height?: number;
	textColor?: string;
	tone?: PikabooWordmarkTone;
}

export function PikabooWordmark({
	accentColor,
	accessibleLabel = 'Pikaboo',
	className,
	height = 32,
	textColor,
	tone = 'auto',
	...props
}: PikabooWordmarkProps) {
	const aspectRatio = 280 / 64;

	return (
		<svg
			aria-label={accessibleLabel}
			className={cx(
				'pds-pikaboo-wordmark',
				`pds-pikaboo-wordmark--tone-${tone}`,
				className,
			)}
			fill="none"
			height={height}
			role="img"
			viewBox="0 0 280 64"
			width={height * aspectRatio}
			{...props}
		>
			<title>{accessibleLabel}</title>
			<text
				className="pds-pikaboo-wordmark__text"
				dominantBaseline="auto"
				fill={textColor ?? 'currentColor'}
				fontFamily='"Bricolage Grotesque", var(--theme-font-heading), Helvetica Neue, Helvetica, Arial, sans-serif'
				fontSize="58"
				fontWeight="800"
				letterSpacing="-2.4"
				x="0"
				y="48"
			>
				pikab
			</text>
			<g className="pds-pikaboo-wordmark__eye">
				<circle
					className="pds-pikaboo-wordmark__iris"
					cx="180"
					cy="30"
					fill={textColor ?? 'currentColor'}
					r="22"
				/>
				<circle
					className="pds-pikaboo-wordmark__pupil"
					cx="180"
					cy="34"
					fill={accentColor ?? 'var(--theme-accent)'}
					r="7"
				/>
			</g>
			<g className="pds-pikaboo-wordmark__eye">
				<circle
					className="pds-pikaboo-wordmark__iris"
					cx="232"
					cy="30"
					fill={textColor ?? 'currentColor'}
					r="22"
				/>
				<circle
					className="pds-pikaboo-wordmark__pupil"
					cx="232"
					cy="34"
					fill={accentColor ?? 'var(--theme-accent)'}
					r="7"
				/>
			</g>
		</svg>
	);
}

export interface ProductNameProps extends HTMLAttributes<HTMLSpanElement> {
	withTenant?: boolean;
}

export function ProductName({
	className,
	withTenant = false,
	...props
}: ProductNameProps) {
	const { theme } = useTheme();
	const label =
		withTenant && theme.copy.tenantName
			? `${theme.copy.productName} for ${theme.copy.tenantName}`
			: theme.copy.productName;

	return (
		<span className={cx('pds-product-name', className)} {...props}>
			{label}
		</span>
	);
}

export type BrandLockupSurface = 'pearl' | 'purple' | 'slate' | 'violet-ink';

export interface BrandLockupProps extends HTMLAttributes<HTMLDivElement> {
	markSize?: number;
	showTenant?: boolean;
	subtitle?: string;
	surface?: BrandLockupSurface;
	useWordmark?: boolean;
	wordmarkHeight?: number;
}

export function BrandLockup({
	className,
	markSize = 36,
	showTenant = true,
	subtitle,
	surface,
	useWordmark = false,
	wordmarkHeight,
	...props
}: BrandLockupProps) {
	const { theme } = useTheme();
	const supportingText =
		subtitle ?? (showTenant ? theme.copy.tenantName : theme.name);

	return (
		<div
			className={cx(
				'pds-brand-lockup',
				surface && `pds-brand-lockup--surface-${surface}`,
				useWordmark && 'pds-brand-lockup--wordmark',
				className,
			)}
			{...props}
		>
			{useWordmark ? (
				<PikabooWordmark
					height={wordmarkHeight ?? markSize}
					tone={surface === 'pearl' ? 'light' : 'dark'}
				/>
			) : (
				<BrandMark size={markSize} />
			)}
			{supportingText ? (
				<div className="pds-brand-lockup__text">
					{useWordmark ? null : <ProductName />}
					<span className="pds-brand-lockup__meta">{supportingText}</span>
				</div>
			) : null}
		</div>
	);
}
