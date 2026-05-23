import type { HTMLAttributes, ReactNode } from 'react';
import { clamp } from '../../charts-core';
import { cx } from '../../utils/class-names';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	max?: number;
	showValue?: boolean;
	value: number;
}

export function ProgressBar({
	className,
	label,
	max = 1,
	showValue = true,
	value,
	...props
}: ProgressBarProps) {
	const ratio = clamp(max ? value / max : 0);
	const percent = Math.round(ratio * 100);

	return (
		<div
			aria-label={typeof label === 'string' ? label : undefined}
			aria-valuemax={max}
			aria-valuemin={0}
			aria-valuenow={value}
			className={cx('pds-chart-progress-bar', className)}
			role="progressbar"
			{...props}
		>
			{label || showValue ? (
				<div className="pds-chart-progress-bar__header">
					{label ? <span>{label}</span> : null}
					{showValue ? <strong>{percent}%</strong> : null}
				</div>
			) : null}
			<span className="pds-chart-progress-bar__track">
				<span style={{ width: `${percent}%` }} />
			</span>
		</div>
	);
}
