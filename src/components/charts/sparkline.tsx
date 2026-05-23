import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartProvider, useChartPalette } from './_internal/chart-container';

export interface SparklineProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		Omit<Partial<ChartA11yProps>, 'tableColumns' | 'tableVisible'>,
		ChartStatusProps {
	forecast?: readonly (number | null | undefined)[];
	height?: number;
	palette?: ChartPaletteName;
	values: readonly (number | null | undefined)[];
	width?: number;
}

const getNumbers = (values: readonly (number | null | undefined)[]): number[] =>
	values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

export const createSparklinePath = (
	values: readonly (number | null | undefined)[],
	width: number,
	height: number,
): string => {
	const numbers = getNumbers(values);
	if (numbers.length < 2) return '';
	const min = Math.min(...numbers);
	const max = Math.max(...numbers);
	const range = max - min || 1;
	const step = values.length > 1 ? width / (values.length - 1) : width;
	return values
		.map((value, index) => {
			if (typeof value !== 'number' || !Number.isFinite(value)) return '';
			const x = index * step;
			const y = height - ((value - min) / range) * height;
			return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.filter(Boolean)
		.join(' ');
};

function SparklineContent({
	ariaDescription,
	ariaLabel = 'Sparkline chart',
	className,
	forecast,
	height = 32,
	values,
	width = 112,
	...props
}: SparklineProps) {
	const palette = useChartPalette();
	const actualPath = createSparklinePath(values, width, height);
	const forecastPath = forecast ? createSparklinePath(forecast, width, height) : '';

	return (
		<div
			aria-label={ariaLabel}
			className={cx('pds-chart-sparkline', className)}
			role="img"
			{...props}
		>
			{ariaDescription ? <span className="pds-visually-hidden">{ariaDescription}</span> : null}
			<svg aria-hidden="true" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
				{forecastPath ? (
					<path
						className="pds-chart-sparkline__forecast"
						d={forecastPath}
						stroke={palette.categorical[2] ?? palette.categorical[0]}
					/>
				) : null}
				{actualPath ? (
					<path
						className="pds-chart-sparkline__actual"
						d={actualPath}
						stroke={palette.categorical[0]}
					/>
				) : null}
			</svg>
		</div>
	);
}

export function Sparkline(props: SparklineProps) {
	return (
		<ChartProvider palette={props.palette}>
			<SparklineContent {...props} />
		</ChartProvider>
	);
}
