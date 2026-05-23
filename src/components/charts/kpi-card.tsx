import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/class-names';
import { Card } from '../card';
import { Sparkline } from './sparkline';

export type KpiTone = 'neutral' | 'good' | 'watch' | 'risk' | 'info';

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
	delta?: ReactNode;
	footnote?: ReactNode;
	label: ReactNode;
	sparkline?: readonly (number | null | undefined)[];
	tone?: KpiTone;
	value: ReactNode;
}

export function KpiCard({
	className,
	delta,
	footnote,
	label,
	sparkline,
	tone = 'neutral',
	value,
	...props
}: KpiCardProps) {
	return (
		<Card className={cx('pds-chart-kpi-card', `pds-chart-kpi-card--${tone}`, className)} {...props}>
			<div className="pds-chart-kpi-card__topline">
				<span>{label}</span>
				{delta ? <strong>{delta}</strong> : null}
			</div>
			<div className="pds-chart-kpi-card__value">{value}</div>
			{sparkline ? (
				<Sparkline
					ariaLabel={typeof label === 'string' ? `${label} trend` : 'KPI trend'}
					values={sparkline}
				/>
			) : null}
			{footnote ? <p className="pds-chart-kpi-card__footnote">{footnote}</p> : null}
		</Card>
	);
}
