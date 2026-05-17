import {
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Button, IconButton } from './button';

export interface GuidedWizardStep<TValue extends string = string> {
	disabled?: boolean;
	label: ReactNode;
	status?: 'complete' | 'current' | 'upcoming' | 'blocked';
	value: TValue;
}

export interface GuidedWizardStepperProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	activeStep?: TValue;
	defaultStep?: TValue;
	onStepChange?: (step: TValue) => void;
	steps: readonly GuidedWizardStep<TValue>[];
}

export function GuidedWizardStepper<TValue extends string = string>({
	activeStep,
	className,
	defaultStep,
	onStepChange,
	steps,
	...props
}: GuidedWizardStepperProps<TValue>) {
	const [uncontrolledStep, setUncontrolledStep] = useState<TValue | undefined>(
		() => defaultStep ?? steps.find((step) => !step.disabled)?.value,
	);
	const selectedStep = activeStep ?? uncontrolledStep;
	const selectedIndex = Math.max(
		0,
		steps.findIndex((step) => step.value === selectedStep),
	);

	const setStep = (nextStep: TValue) => {
		if (activeStep === undefined) {
			setUncontrolledStep(nextStep);
		}
		onStepChange?.(nextStep);
	};

	return (
		<div className={cx('pds-guided-wizard-stepper', className)} {...props}>
			{steps.map((step, index) => {
				const selected = step.value === selectedStep;
				const status =
					step.status ??
					(selected
						? 'current'
						: index < selectedIndex
							? 'complete'
							: 'upcoming');

				return (
					<button
						aria-current={selected ? 'step' : undefined}
						aria-pressed={selected}
						className={cx(
							'pds-guided-wizard-stepper__step',
							`pds-guided-wizard-stepper__step--${status}`,
						)}
						disabled={step.disabled}
						key={step.value}
						onClick={() => setStep(step.value)}
						type="button"
					>
						<span>{index + 1}.</span>
						<strong>{step.label}</strong>
					</button>
				);
			})}
		</div>
	);
}

export type GuidedWizardSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GuidedWizardShellProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	backAction?: ButtonHTMLAttributes<HTMLButtonElement>;
	descriptionId?: string;
	dismissible?: boolean;
	footer?: ReactNode;
	heading?: ReactNode;
	icon?: ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	size?: GuidedWizardSize;
	title?: ReactNode;
	titleId?: string;
}

export function GuidedWizardShell({
	backAction,
	children,
	className,
	descriptionId,
	dismissible = true,
	footer,
	heading,
	icon,
	onOpenChange,
	open = true,
	size = 'md',
	title,
	titleId,
	...props
}: GuidedWizardShellProps) {
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
		<div className="pds-guided-wizard-overlay">
			<div
				aria-describedby={descriptionId}
				aria-labelledby={titleId}
				aria-modal="true"
				className={cx(
					'pds-guided-wizard',
					`pds-guided-wizard--${size}`,
					className,
				)}
				role="dialog"
				{...props}
			>
				<div className="pds-guided-wizard__header">
					<div className="pds-guided-wizard__title">
						{icon ? <span>{icon}</span> : null}
						{title ? <strong id={titleId}>{title}</strong> : null}
					</div>
					{backAction || dismissible ? (
						<div className="pds-guided-wizard__actions">
							{backAction ? (
								<Button size="sm" variant="outline" {...backAction}>
									{backAction.children ?? 'Back'}
								</Button>
							) : null}
							{dismissible ? (
								<IconButton
									icon="close"
									label="Close wizard"
									onClick={() => onOpenChange?.(false)}
									variant="ghost"
								/>
							) : null}
						</div>
					) : null}
				</div>
				{heading ? (
					<div className="pds-guided-wizard__heading">{heading}</div>
				) : null}
				<div className="pds-guided-wizard__body">{children}</div>
				{footer ? (
					<div className="pds-guided-wizard__footer">{footer}</div>
				) : null}
			</div>
		</div>
	);
}

export interface GuidedWizardPanelProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	description?: ReactNode;
	icon?: ReactNode;
	required?: boolean;
	title: ReactNode;
	tone?: 'default' | 'danger' | 'highlight';
}

export function GuidedWizardPanel({
	children,
	className,
	description,
	icon,
	required = false,
	title,
	tone = 'default',
	...props
}: GuidedWizardPanelProps) {
	return (
		<section
			className={cx(
				'pds-guided-wizard-panel',
				`pds-guided-wizard-panel--${tone}`,
				className,
			)}
			{...props}
		>
			<header className="pds-guided-wizard-panel__header">
				{icon ? (
					<span className="pds-guided-wizard-panel__icon">{icon}</span>
				) : null}
				<div>
					<h3>
						{title}
						{required ? <span aria-hidden="true"> *</span> : null}
					</h3>
					{description ? <p>{description}</p> : null}
				</div>
			</header>
			<div className="pds-guided-wizard-panel__body">{children}</div>
		</section>
	);
}

export interface GuidedWizardStatusBarProps
	extends HTMLAttributes<HTMLDivElement> {
	action?: ReactNode;
	message: ReactNode;
	tone?: 'neutral' | 'warning' | 'success' | 'danger';
}

export function GuidedWizardStatusBar({
	action,
	className,
	message,
	tone = 'neutral',
	...props
}: GuidedWizardStatusBarProps) {
	return (
		<div
			className={cx(
				'pds-guided-wizard-status',
				`pds-guided-wizard-status--${tone}`,
				className,
			)}
			{...props}
		>
			<span>{message}</span>
			{action ? <div>{action}</div> : null}
		</div>
	);
}

export interface GuidedWizardToastProps extends HTMLAttributes<HTMLDivElement> {
	action?: ReactNode;
	message: ReactNode;
	onDismiss?: () => void;
	replayAction?: ReactNode;
}

export function GuidedWizardToast({
	action,
	className,
	message,
	onDismiss,
	replayAction,
	...props
}: GuidedWizardToastProps) {
	return (
		<div className={cx('pds-guided-wizard-toast', className)} {...props}>
			<span className="pds-guided-wizard-toast__check">✓</span>
			<strong>{message}</strong>
			{replayAction}
			{action}
			{onDismiss ? (
				<button aria-label="Dismiss" onClick={onDismiss} type="button">
					×
				</button>
			) : null}
		</div>
	);
}
