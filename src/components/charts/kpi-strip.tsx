import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/class-names';

export interface KpiStripProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 2 | 3 | 4 | 6;
}

export function KpiStrip({ className, columns = 4, ...props }: KpiStripProps) {
	return (
		<div
			className={cx('pds-chart-kpi-strip', `pds-chart-kpi-strip--${columns}`, className)}
			{...props}
		/>
	);
}
