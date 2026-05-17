import { type HTMLAttributes, type ReactNode, useEffect } from 'react';
import { cx } from '../utils/class-names';
import { IconButton } from './button';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
	descriptionId?: string;
	dismissible?: boolean;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	size?: DialogSize;
	titleId?: string;
}

export function Dialog({
	children,
	className,
	descriptionId,
	dismissible = true,
	onOpenChange,
	open = true,
	size = 'md',
	titleId,
	...props
}: DialogProps) {
	useEffect(() => {
		if (!open || !dismissible) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onOpenChange?.(false);
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [dismissible, onOpenChange, open]);

	if (!open) return null;

	return (
		<div className="pds-dialog-backdrop">
			<div
				aria-describedby={descriptionId}
				aria-labelledby={titleId}
				aria-modal="true"
				className={cx('pds-dialog', `pds-dialog--${size}`, className)}
				role="dialog"
				{...props}
			>
				{dismissible ? (
					<IconButton
						className="pds-dialog__close"
						icon="close"
						label="Close dialog"
						onClick={() => onOpenChange?.(false)}
						variant="ghost"
					/>
				) : null}
				{children}
			</div>
		</div>
	);
}

export function DialogHeader({
	actions,
	children,
	className,
	...props
}: HTMLAttributes<HTMLDivElement> & { actions?: ReactNode }) {
	return (
		<div className={cx('pds-dialog__header', className)} {...props}>
			<div>{children}</div>
			{actions ? <div className="pds-dialog__actions">{actions}</div> : null}
		</div>
	);
}

export function DialogTitle({
	className,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return <h2 className={cx('pds-dialog__title', className)} {...props} />;
}

export function DialogDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cx('pds-dialog__description', className)} {...props} />;
}

export function DialogBody({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div className={cx('pds-dialog__body', className)} {...props} />;
}

export function DialogFooter({
	actions,
	children,
	className,
	...props
}: HTMLAttributes<HTMLDivElement> & { actions?: ReactNode }) {
	return (
		<div
			className={cx(
				'pds-dialog__footer',
				!children && 'pds-dialog__footer--actions-only',
				className,
			)}
			{...props}
		>
			{children ? <div>{children}</div> : null}
			{actions ? <div className="pds-dialog__actions">{actions}</div> : null}
		</div>
	);
}
