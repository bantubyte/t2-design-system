import { cx } from '../../../utils/class-names';

export type ChartLoadingVariant = 'line' | 'bar' | 'donut' | 'grid';

export interface ChartLoadingProps {
	className?: string;
	variant?: ChartLoadingVariant;
}

export function ChartLoading({
	className,
	variant = 'line',
}: ChartLoadingProps) {
	return (
		<div
			aria-label="Loading chart"
			className={cx(
				'pds-chart-loading',
				`pds-chart-loading--${variant}`,
				className,
			)}
			role="status"
		>
			<span />
			<span />
			<span />
			<span />
		</div>
	);
}
