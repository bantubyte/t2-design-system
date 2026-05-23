import { type HTMLAttributes, useMemo, useState } from 'react';
import {
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
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
import { getChartAnimationProps, normalizePercentStack } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartLegend } from './_internal/chart-legend';
import { ChartTooltip } from './_internal/chart-tooltip';
import {
	getRechartsTickFormatter,
	resolveAxisFormatter,
	type ChartAxisPreset,
} from './_internal/chart-axis';
import {
	getSeriesColumns,
	getSeriesLabel,
	toChartData,
} from './_internal/chart-utils';

export type BarChartOrientation = 'vertical' | 'horizontal';
export type BarChartVariant = 'grouped' | 'stacked' | 'stacked100';

export interface BarChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	data: readonly T[];
	orientation?: BarChartOrientation;
	palette?: ChartPaletteName;
	series: readonly ChartSeries<T>[];
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	variant?: BarChartVariant;
	xAxisPreset?: ChartAxisPreset;
	xFormat?: ChartFormatter<T>;
	xKey: ChartDataKey<T> | string;
	yAxisPreset?: ChartAxisPreset;
	yFormat?: ChartFormatter<T>;
}

function BarChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	orientation = 'vertical',
	series,
	showGrid = true,
	showLegend = true,
	showTooltip = true,
	tableColumns,
	variant = 'grouped',
	xAxisPreset,
	xFormat,
	xKey,
	yAxisPreset,
	yFormat,
	...props
}: BarChartProps<T>) {
	const palette = useChartPalette();
	const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(new Set());
	const xFormatter = resolveAxisFormatter(xAxisPreset, xFormat);
	const yFormatter = resolveAxisFormatter(
		variant === 'stacked100' ? 'percent' : yAxisPreset,
		yFormat,
	);
	const visibleSeries = useMemo(
		() => series.filter((item) => !hiddenKeys.has(String(item.key))),
		[hiddenKeys, series],
	);
	const chartData = useMemo(
		() =>
			variant === 'stacked100'
				? normalizePercentStack(data, series.map((item) => item.key))
				: data,
		[data, series, variant],
	);
	const animation = getChartAnimationProps();
	const toggleSeries = (key: string) => {
		setHiddenKeys((current) => {
			const next = new Set(current);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});
	};
	const horizontal = orientation === 'horizontal';

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--bar', `pds-chart--bar-${orientation}`, className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			loadingVariant="bar"
			tableColumns={tableColumns ?? getSeriesColumns(xKey, series, xFormat, yFormat)}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsBarChart
						data={toChartData(chartData)}
						layout={horizontal ? 'vertical' : 'horizontal'}
						margin={{ bottom: 10, left: horizontal ? 18 : 4, right: 18, top: 12 }}
					>
						{showGrid ? (
							<CartesianGrid stroke={palette.grid} strokeDasharray="4 6" vertical={horizontal} />
						) : null}
						<XAxis
							axisLine={false}
							dataKey={horizontal ? undefined : String(xKey)}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(horizontal ? yFormatter : xFormatter)}
							tickLine={false}
							type={horizontal ? 'number' : 'category'}
						/>
						<YAxis
							axisLine={false}
							dataKey={horizontal ? String(xKey) : undefined}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(horizontal ? xFormatter : yFormatter)}
							tickLine={false}
							type={horizontal ? 'category' : 'number'}
							width={horizontal ? 96 : 54}
						/>
						{showTooltip ? (
							<Tooltip
								content={<ChartTooltip labelFormatter={xFormatter} valueFormatter={yFormatter} />}
							/>
						) : null}
						{visibleSeries.map((item, index) => (
							<Bar
								dataKey={String(item.key)}
								fill={item.color ?? palette.categorical[index % palette.categorical.length]}
								key={String(item.key)}
								name={getSeriesLabel(item)}
								radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
								stackId={variant === 'grouped' ? item.stackId : item.stackId ?? 'stack'}
								{...animation}
							/>
						))}
					</RechartsBarChart>
				</ResponsiveContainer>
			</div>
			{showLegend ? (
				<ChartLegend hiddenKeys={hiddenKeys} onToggle={toggleSeries} palette={palette} series={series} />
			) : null}
		</ChartContainer>
	);
}

export function BarChart<T extends ChartDatum>(props: BarChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<BarChartContent {...props} />
		</ChartProvider>
	);
}
