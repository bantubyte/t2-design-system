import type { HTMLAttributes, OutputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';
import { Button, type ButtonProps } from './button';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
export type LoaderMotion = 'none' | 'pulse' | 'shimmer' | 'wave' | 'orbit';
export type LoaderSize = 'sm' | 'md' | 'lg';

export interface AlertProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	action?: ReactNode;
	icon?: ReactNode;
	title?: ReactNode;
	tone?: AlertTone;
}

export function Alert({
	action,
	children,
	className,
	icon,
	title,
	tone = 'info',
	...props
}: AlertProps) {
	return (
		<div
			aria-live="polite"
			className={cx(
				'pds-alert',
				`pds-alert--${tone}`,
				!icon && 'pds-alert--no-icon',
				className,
			)}
			{...props}
		>
			{icon ? <div className="pds-alert__icon">{icon}</div> : null}
			<div className="pds-alert__body">
				{title ? <p className="pds-alert__title">{title}</p> : null}
				{children ? <div className="pds-alert__content">{children}</div> : null}
			</div>
			{action ? <div className="pds-alert__action">{action}</div> : null}
		</div>
	);
}

export interface EmptyStateProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	action?: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	title: ReactNode;
}

export function EmptyState({
	action,
	className,
	description,
	icon,
	title,
	...props
}: EmptyStateProps) {
	return (
		<div className={cx('pds-empty-state', className)} {...props}>
			{icon ? <div className="pds-empty-state__icon">{icon}</div> : null}
			<h3 className="pds-empty-state__title">{title}</h3>
			{description ? (
				<p className="pds-empty-state__description">{description}</p>
			) : null}
			{action ? <div className="pds-empty-state__action">{action}</div> : null}
		</div>
	);
}

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	motion?: LoaderMotion;
	size?: LoaderSize;
}

export function LoadingState({
	className,
	label = 'Loading',
	motion = 'orbit',
	size = 'md',
	...props
}: LoadingStateProps) {
	return (
		<div
			aria-live="polite"
			className={cx(
				'pds-loading-state',
				`pds-loading-state--${size}`,
				`pds-loader-motion--${motion}`,
				className,
			)}
			{...props}
		>
			<span className="pds-loading-state__spinner" />
			<span>{label}</span>
		</div>
	);
}

export interface BigLoaderProps
	extends OutputHTMLAttributes<HTMLOutputElement> {
	description?: ReactNode;
	label?: ReactNode;
	motion?: Extract<LoaderMotion, 'none' | 'orbit' | 'pulse'>;
}

export function BigLoader({
	className,
	description,
	label = 'Loading',
	motion = 'orbit',
	...props
}: BigLoaderProps) {
	return (
		<output
			aria-busy="true"
			aria-live="polite"
			className={cx(
				'pds-big-loader',
				`pds-loader-motion--${motion}`,
				className,
			)}
			{...props}
		>
			<div aria-hidden="true" className="pds-big-loader__mark">
				<span className="pds-big-loader__orb" />
				<span className="pds-big-loader__orb" />
				<span className="pds-big-loader__orb" />
			</div>
			<div className="pds-big-loader__copy">
				<strong>{label}</strong>
				{description ? <span>{description}</span> : null}
			</div>
		</output>
	);
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	value: number;
}

export function Progress({ className, label, value, ...props }: ProgressProps) {
	const safeValue = Math.max(0, Math.min(100, value));

	return (
		<div className={cx('pds-progress', className)} {...props}>
			{label ? (
				<div className="pds-progress__label">
					<span>{label}</span>
					<span>{safeValue}%</span>
				</div>
			) : null}
			<div
				aria-valuemax={100}
				aria-valuemin={0}
				aria-valuenow={safeValue}
				className="pds-progress__track"
				role="progressbar"
			>
				<span
					className="pds-progress__bar"
					style={{ width: `${safeValue}%` }}
				/>
			</div>
		</div>
	);
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	height?: number | string;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	radius?: 'full' | 'lg' | 'md' | 'sm';
	width?: number | string;
}

export function Skeleton({
	className,
	height,
	motion = 'shimmer',
	radius = 'md',
	style,
	width,
	...props
}: SkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={cx(
				'pds-skeleton',
				`pds-skeleton--${motion}`,
				`pds-skeleton--radius-${radius}`,
				className,
			)}
			style={{ height, width, ...style }}
			{...props}
		/>
	);
}

export interface ContentLoaderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	actions?: number;
	lines?: number;
	media?: boolean;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	title?: boolean;
}

export function ContentLoader({
	actions = 0,
	className,
	lines = 3,
	media = false,
	motion = 'shimmer',
	title = true,
	...props
}: ContentLoaderProps) {
	return (
		<div
			aria-hidden="true"
			className={cx(
				'pds-content-loader',
				`pds-loader-motion--${motion}`,
				className,
			)}
			{...props}
		>
			{media ? (
				<Skeleton className="pds-content-loader__media" motion={motion} />
			) : null}
			<div className="pds-content-loader__body">
				{title ? (
					<Skeleton
						className="pds-content-loader__title"
						height="1.1rem"
						motion={motion}
						width="42%"
					/>
				) : null}
				{Array.from({ length: lines }, (_, index) => (
					<Skeleton
						className="pds-content-loader__line"
						height="0.68rem"
						key={index}
						motion={motion}
						width={`${index === lines - 1 ? 62 : 92 - index * 8}%`}
					/>
				))}
				{actions ? (
					<div className="pds-content-loader__actions">
						{Array.from({ length: actions }, (_, index) => (
							<Skeleton
								className="pds-content-loader__action"
								height="2.1rem"
								key={index}
								motion={motion}
								width={index === 0 ? '7rem' : '5.5rem'}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

export interface CardLoadingStateProps
	extends OutputHTMLAttributes<HTMLOutputElement> {
	density?: 'compact' | 'comfortable';
	media?: false | 'banner' | 'thumbnail';
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	rows?: number;
}

export function CardLoadingState({
	className,
	density = 'comfortable',
	media = false,
	motion = 'shimmer',
	rows = 3,
	...props
}: CardLoadingStateProps) {
	return (
		<output
			aria-busy="true"
			className={cx(
				'pds-card-loader',
				`pds-card-loader--${density}`,
				media && `pds-card-loader--media-${media}`,
				className,
			)}
			{...props}
		>
			{media ? (
				<Skeleton className="pds-card-loader__media" motion={motion} />
			) : null}
			<div className="pds-card-loader__header">
				<Skeleton height="0.8rem" motion={motion} width="36%" />
				<Skeleton height="1.6rem" motion={motion} width="2.8rem" />
			</div>
			<div className="pds-card-loader__rows">
				{Array.from({ length: rows }, (_, index) => (
					<Skeleton
						className="pds-card-loader__row"
						height="0.72rem"
						key={index}
						motion={motion}
						width={`${index === rows - 1 ? 48 : 94 - index * 7}%`}
					/>
				))}
			</div>
		</output>
	);
}

export interface PageContentLoaderProps
	extends Omit<OutputHTMLAttributes<HTMLOutputElement>, 'title'> {
	cardCount?: number;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	statCount?: number;
	title?: ReactNode;
	toolbar?: boolean;
}

export function PageContentLoader({
	cardCount = 6,
	className,
	motion = 'shimmer',
	statCount = 4,
	title = 'Loading content',
	toolbar = true,
	...props
}: PageContentLoaderProps) {
	return (
		<output
			aria-busy="true"
			aria-live="polite"
			className={cx('pds-page-content-loader', className)}
			{...props}
		>
			<div className="pds-page-content-loader__header">
				<div>
					<span className="pds-page-content-loader__eyebrow">Loading</span>
					<h2>{title}</h2>
				</div>
				<LoadingState label="Syncing data" motion="orbit" size="sm" />
			</div>
			{toolbar ? (
				<div className="pds-page-content-loader__toolbar">
					<Skeleton height="2.7rem" motion={motion} width="min(100%, 34rem)" />
					<Skeleton height="2.7rem" motion={motion} width="8rem" />
					<Skeleton height="2.7rem" motion={motion} width="6rem" />
				</div>
			) : null}
			<div className="pds-page-content-loader__stats">
				{Array.from({ length: statCount }, (_, index) => (
					<div className="pds-page-content-loader__stat" key={index}>
						<Skeleton height="0.65rem" motion={motion} width="42%" />
						<Skeleton height="1.75rem" motion={motion} width="34%" />
					</div>
				))}
			</div>
			<div className="pds-page-content-loader__cards">
				{Array.from({ length: cardCount }, (_, index) => (
					<CardLoadingState key={index} motion={motion} rows={3} />
				))}
			</div>
		</output>
	);
}

export function EmptyAction(props: ButtonProps) {
	return <Button size="sm" variant="outline" {...props} />;
}
