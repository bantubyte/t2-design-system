import type { HTMLAttributes } from 'react';
import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart as RechartsRadarChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSeries,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { getChartAnimationProps } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartLegend } from './_internal/chart-legend';
import { ChartTooltip } from './_internal/chart-tooltip';
import { getSeriesColumns, getSeriesLabel, toChartData } from './_internal/chart-utils';

export interface RadarChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	angleKey: ChartDataKey<T> | string;
	data: readonly T[];
	palette?: ChartPaletteName;
	series: readonly ChartSeries<T>[];
	showLegend?: boolean;
	valueFormat?: ChartFormatter<T>;
}

function RadarChartContent<T extends ChartDatum>({
	angleKey,
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 320,
	loading,
	series,
	showLegend = true,
	tableColumns,
	valueFormat,
	...props
}: RadarChartProps<T>) {
	const palette = useChartPalette();
	const animation = getChartAnimationProps();

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--radar', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? getSeriesColumns(angleKey, series, undefined, valueFormat)}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsRadarChart data={toChartData(data)}>
						<PolarGrid stroke={palette.grid} />
						<PolarAngleAxis dataKey={String(angleKey)} tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }} />
						<PolarRadiusAxis tick={{ fill: palette.axis, fontSize: 11 }} tickFormatter={valueFormat} />
						<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
						{series.map((item, index) => {
							const color = item.color ?? palette.categorical[index % palette.categorical.length];
							return (
								<Radar
									dataKey={String(item.key)}
									fill={color}
									fillOpacity={0.16}
									key={String(item.key)}
									name={getSeriesLabel(item)}
									stroke={color}
									strokeWidth={2}
									{...animation}
								/>
							);
						})}
					</RechartsRadarChart>
				</ResponsiveContainer>
			</div>
			{showLegend ? <ChartLegend palette={palette} series={series} /> : null}
		</ChartContainer>
	);
}

export function RadarChart<T extends ChartDatum>(props: RadarChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<RadarChartContent {...props} />
		</ChartProvider>
	);
}
