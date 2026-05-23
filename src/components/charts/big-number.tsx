import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/class-names';

export type BigNumberTone = 'neutral' | 'good' | 'watch' | 'risk' | 'info';

export interface BigNumberProps extends HTMLAttributes<HTMLDivElement> {
	delta?: ReactNode;
	label: ReactNode;
	metadata?: ReactNode;
	tone?: BigNumberTone;
	value: ReactNode;
}

export function BigNumber({
	className,
	delta,
	label,
	metadata,
	tone = 'neutral',
	value,
	...props
}: BigNumberProps) {
	return (
		<div className={cx('pds-chart-big-number', `pds-chart-big-number--${tone}`, className)} {...props}>
			<span className="pds-chart-big-number__label">{label}</span>
			<strong className="pds-chart-big-number__value">{value}</strong>
			{delta || metadata ? (
				<span className="pds-chart-big-number__meta">
					{delta ? <em>{delta}</em> : null}
					{metadata ? <small>{metadata}</small> : null}
				</span>
			) : null}
		</div>
	);
}
