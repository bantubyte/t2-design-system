import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';

export type ContainerWidth = 'full' | 'lg' | 'md' | 'sm' | 'xl';
export type LayoutGap = 'lg' | 'md' | 'sm' | 'xl' | 'xs';
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12 | 'auto';
export type GridItemSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type LayoutAlign = 'center' | 'end' | 'start' | 'stretch';
export type ClusterJustify = 'between' | 'center' | 'end' | 'start';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	width?: ContainerWidth;
}

export function Container({
	className,
	width = 'xl',
	...props
}: ContainerProps) {
	return (
		<div
			className={cx('pds-container', `pds-container--${width}`, className)}
			{...props}
		/>
	);
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
	align?: LayoutAlign;
	columns?: GridColumns;
	gap?: LayoutGap;
}

export function Grid({
	align = 'stretch',
	className,
	columns = 12,
	gap = 'md',
	...props
}: GridProps) {
	return (
		<div
			className={cx(
				'pds-grid',
				`pds-grid--${columns}`,
				`pds-grid--gap-${gap}`,
				`pds-grid--align-${align}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
	span?: GridItemSpan;
}

export function GridItem({ className, span = 12, ...props }: GridItemProps) {
	return (
		<div
			className={cx('pds-grid-item', `pds-grid-item--span-${span}`, className)}
			{...props}
		/>
	);
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
	align?: LayoutAlign;
	gap?: LayoutGap;
}

export function Stack({
	align = 'stretch',
	className,
	gap = 'md',
	...props
}: StackProps) {
	return (
		<div
			className={cx(
				'pds-stack',
				`pds-stack--gap-${gap}`,
				`pds-stack--align-${align}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
	align?: LayoutAlign;
	gap?: LayoutGap;
	justify?: ClusterJustify;
}

export function Cluster({
	align = 'center',
	className,
	gap = 'md',
	justify = 'start',
	...props
}: ClusterProps) {
	return (
		<div
			className={cx(
				'pds-cluster',
				`pds-cluster--gap-${gap}`,
				`pds-cluster--align-${align}`,
				`pds-cluster--justify-${justify}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
	aside?: ReactNode;
	header?: ReactNode;
}

export function PageShell({
	aside,
	children,
	className,
	header,
	...props
}: PageShellProps) {
	return (
		<div className={cx('pds-page-shell', className)} {...props}>
			{aside ? <aside className="pds-page-shell__aside">{aside}</aside> : null}
			<div className="pds-page-shell__main">
				{header ? <div className="pds-page-shell__header">{header}</div> : null}
				{children}
			</div>
		</div>
	);
}

export interface SectionHeaderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	actions?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	title: ReactNode;
}

export function SectionHeader({
	actions,
	className,
	description,
	eyebrow,
	title,
	...props
}: SectionHeaderProps) {
	return (
		<div className={cx('pds-section-header', className)} {...props}>
			<div>
				{eyebrow ? (
					<p className="pds-section-header__eyebrow">{eyebrow}</p>
				) : null}
				<h2 className="pds-section-header__title">{title}</h2>
				{description ? (
					<p className="pds-section-header__description">{description}</p>
				) : null}
			</div>
			{actions ? (
				<div className="pds-section-header__actions">{actions}</div>
			) : null}
		</div>
	);
}

export function Toolbar({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div className={cx('pds-toolbar', className)} {...props} />;
}
