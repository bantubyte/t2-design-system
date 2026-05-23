import { type HTMLAttributes, useMemo, useState } from 'react';
import {
	Area,
	AreaChart as RechartsAreaChart,
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
import { getChartAnimationProps, getSeriesStrokeDasharray } from '../../charts-core';
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

export interface AreaChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	data: readonly T[];
	palette?: ChartPaletteName;
	series: readonly ChartSeries<T>[];
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	stacked?: boolean;
	xAxisPreset?: ChartAxisPreset;
	xFormat?: ChartFormatter<T>;
	xKey: ChartDataKey<T> | string;
	yAxisPreset?: ChartAxisPreset;
	yFormat?: ChartFormatter<T>;
}

function AreaChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	series,
	showGrid = true,
	showLegend = true,
	showTooltip = true,
	stacked = false,
	tableColumns,
	xAxisPreset,
	xFormat,
	xKey,
	yAxisPreset,
	yFormat,
	...props
}: AreaChartProps<T>) {
	const palette = useChartPalette();
	const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(new Set());
	const xFormatter = resolveAxisFormatter(xAxisPreset, xFormat);
	const yFormatter = resolveAxisFormatter(yAxisPreset, yFormat);
	const visibleSeries = useMemo(
		() => series.filter((item) => !hiddenKeys.has(String(item.key))),
		[hiddenKeys, series],
	);
	const animation = getChartAnimationProps();
	const toggleSeries = (key: string) => {
		setHiddenKeys((current) => {
			const next = new Set(current);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});
	};

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--area', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? getSeriesColumns(xKey, series, xFormat, yFormat)}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsAreaChart
						data={toChartData(data)}
						margin={{ bottom: 10, left: 4, right: 18, top: 12 }}
					>
						{showGrid ? (
							<CartesianGrid stroke={palette.grid} strokeDasharray="4 6" vertical={false} />
						) : null}
						<XAxis
							axisLine={false}
							dataKey={String(xKey)}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(xFormatter)}
							tickLine={false}
						/>
						<YAxis
							axisLine={false}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(yFormatter)}
							tickLine={false}
							width={54}
						/>
						{showTooltip ? (
							<Tooltip
								content={<ChartTooltip labelFormatter={xFormatter} valueFormatter={yFormatter} />}
							/>
						) : null}
						{visibleSeries.map((item, index) => {
							const color = item.color ?? palette.categorical[index % palette.categorical.length];
							return (
								<Area
									dataKey={String(item.key)}
									fill={color}
									fillOpacity={0.16}
									key={String(item.key)}
									name={getSeriesLabel(item)}
									stackId={stacked ? item.stackId ?? 'stack' : item.stackId}
									stroke={color}
									strokeDasharray={getSeriesStrokeDasharray(index, item.strokeDasharray)}
									strokeWidth={2.25}
									type="monotone"
									{...animation}
								/>
							);
						})}
					</RechartsAreaChart>
				</ResponsiveContainer>
			</div>
			{showLegend ? (
				<ChartLegend hiddenKeys={hiddenKeys} onToggle={toggleSeries} palette={palette} series={series} />
			) : null}
		</ChartContainer>
	);
}

export function AreaChart<T extends ChartDatum>(props: AreaChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<AreaChartContent {...props} />
		</ChartProvider>
	);
}
