import type { HTMLAttributes, ReactNode } from 'react';
import { clamp } from '../../charts-core';
import { cx } from '../../utils/class-names';

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	max?: number;
	size?: number;
	value: number;
}

export function ProgressCircle({
	className,
	label,
	max = 1,
	size = 116,
	value,
	...props
}: ProgressCircleProps) {
	const ratio = clamp(max ? value / max : 0);
	const radius = 42;
	const circumference = 2 * Math.PI * radius;
	const percent = Math.round(ratio * 100);

	return (
		<div
			aria-label={typeof label === 'string' ? label : 'Progress'}
			aria-valuemax={max}
			aria-valuemin={0}
			aria-valuenow={value}
			className={cx('pds-chart-progress-circle', className)}
			role="progressbar"
			style={{ width: size }}
			{...props}
		>
			<svg aria-hidden="true" viewBox="0 0 100 100">
				<circle className="pds-chart-progress-circle__track" cx="50" cy="50" r={radius} />
				<circle
					className="pds-chart-progress-circle__value"
					cx="50"
					cy="50"
					r={radius}
					strokeDasharray={`${circumference * ratio} ${circumference}`}
				/>
			</svg>
			<span>
				<strong>{percent}%</strong>
				{label ? <small>{label}</small> : null}
			</span>
		</div>
	);
}
