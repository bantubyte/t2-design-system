import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';

export interface WaterfallDatum extends ChartDatum {
	label: string;
	value: number;
}

export interface WaterfallChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<WaterfallDatum>,
		ChartStatusProps {
	data: readonly WaterfallDatum[];
	height?: number;
	palette?: ChartPaletteName;
	valueFormat?: ChartFormatter<WaterfallDatum>;
}

function WaterfallChartContent({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 300,
	loading,
	tableColumns,
	valueFormat,
	...props
}: WaterfallChartProps) {
	const palette = useChartPalette('diverging');
	const running = data.reduce<number[]>((totals, datum) => {
		const previous = totals.length ? totals[totals.length - 1] : 0;
		totals.push(previous + datum.value);
		return totals;
	}, []);
	const min = Math.min(0, ...running);
	const max = Math.max(0, ...running);
	const range = max - min || 1;

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--waterfall', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			loadingVariant="bar"
			tableColumns={tableColumns ?? [{ header: 'Label', key: 'label' }, { format: valueFormat, header: 'Value', key: 'value' }]}
			{...props}
		>
			<div className="pds-chart-waterfall">
				{data.map((datum, index) => {
					const previous = index === 0 ? 0 : running[index - 1];
					const start = Math.min(previous, running[index]);
					const size = Math.abs(datum.value) / range;
					const bottom = ((start - min) / range) * 100;
					const color =
						datum.value < 0
							? palette.diverging[1]
							: datum.value > 0
								? palette.diverging[7]
								: palette.diverging[4];
					return (
						<div className="pds-chart-waterfall__item" key={datum.label}>
							<span
								className="pds-chart-waterfall__bar"
								style={{
									background: color,
									bottom: `${bottom}%`,
									height: `${Math.max(size * 100, 2)}%`,
								}}
								title={`${datum.label}: ${valueFormat ? valueFormat(datum.value) : datum.value}`}
							/>
							<strong>{datum.label}</strong>
						</div>
					);
				})}
			</div>
		</ChartContainer>
	);
}

export function WaterfallChart(props: WaterfallChartProps) {
	return (
		<ChartProvider palette={props.palette ?? 'diverging'}>
			<WaterfallChartContent {...props} />
		</ChartProvider>
	);
}
