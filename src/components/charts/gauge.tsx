import type { HTMLAttributes, ReactNode } from 'react';
import { clamp } from '../../charts-core';
import { cx } from '../../utils/class-names';

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	max?: number;
	min?: number;
	value: number;
	valueLabel?: ReactNode;
}

export function Gauge({
	className,
	label,
	max = 100,
	min = 0,
	value,
	valueLabel,
	...props
}: GaugeProps) {
	const ratio = clamp((value - min) / (max - min || 1));
	const angle = -90 + ratio * 180;

	return (
		<div
			aria-label={typeof label === 'string' ? label : 'Gauge'}
			aria-valuemax={max}
			aria-valuemin={min}
			aria-valuenow={value}
			className={cx('pds-chart-gauge', className)}
			role="meter"
			{...props}
		>
			<svg aria-hidden="true" viewBox="0 0 160 92">
				<path className="pds-chart-gauge__track" d="M 20 80 A 60 60 0 0 1 140 80" />
				<path
					className="pds-chart-gauge__value"
					d="M 20 80 A 60 60 0 0 1 140 80"
					pathLength={1}
					strokeDasharray={`${ratio} 1`}
				/>
				<line
					className="pds-chart-gauge__needle"
					style={{ transform: `rotate(${angle}deg)` }}
					x1="80"
					x2="80"
					y1="80"
					y2="30"
				/>
				<circle className="pds-chart-gauge__pin" cx="80" cy="80" r="5" />
			</svg>
			<span>
				<strong>{valueLabel ?? value}</strong>
				{label ? <small>{label}</small> : null}
			</span>
		</div>
	);
}
