import type { ReactNode } from 'react';
import { cx } from '../../../utils/class-names';

export interface ChartEmptyProps {
	className?: string;
	message?: ReactNode;
}

export function ChartEmpty({
	className,
	message = 'No chart data available.',
}: ChartEmptyProps) {
	return (
		<div className={cx('pds-chart-state pds-chart-state--empty', className)}>
			<span className="pds-chart-state__mark" aria-hidden="true" />
			<p>{message}</p>
		</div>
	);
}
