import { type HTMLAttributes, useMemo, useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart as RechartsLineChart,
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

export type LineChartVariant = 'default' | 'smooth' | 'stepped';

export interface LineChartProps<T extends ChartDatum>
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
	xAxisPreset?: ChartAxisPreset;
	xFormat?: ChartFormatter<T>;
	xKey: ChartDataKey<T> | string;
	yAxisPreset?: ChartAxisPreset;
	yFormat?: ChartFormatter<T>;
	variant?: LineChartVariant;
}

const lineTypeForVariant = (variant: LineChartVariant) =>
	variant === 'smooth' ? 'monotone' : variant === 'stepped' ? 'step' : 'linear';

function LineChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	minHeight,
	series,
	showGrid = true,
	showLegend = true,
	showTooltip = true,
	tableColumns,
	variant = 'default',
	xAxisPreset,
	xFormat,
	xKey,
	yAxisPreset,
	yFormat,
	...props
}: LineChartProps<T>) {
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
			if (next.has(key)) {
				next.delete(key);
			} else {
				next.add(key);
			}
			return next;
		});
	};

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--line', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			style={minHeight ? { minHeight } : undefined}
			tableColumns={tableColumns ?? getSeriesColumns(xKey, series, xFormat, yFormat)}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsLineChart
						data={toChartData(data)}
						margin={{ bottom: 10, left: 4, right: 18, top: 12 }}
					>
						{showGrid ? (
							<CartesianGrid
								stroke={palette.grid}
								strokeDasharray="4 6"
								vertical={false}
							/>
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
								content={
									<ChartTooltip
										labelFormatter={xFormatter}
										valueFormatter={yFormatter}
									/>
								}
							/>
						) : null}
						{visibleSeries.map((item, index) => (
							<Line
								activeDot={{ r: 5, strokeWidth: 0 }}
								dataKey={String(item.key)}
								dot={{ r: 2, strokeWidth: 0, tabIndex: 0 }}
								key={String(item.key)}
								name={getSeriesLabel(item)}
								stroke={item.color ?? palette.categorical[index % palette.categorical.length]}
								strokeDasharray={getSeriesStrokeDasharray(index, item.strokeDasharray)}
								strokeLinecap="round"
								strokeWidth={2.5}
								type={lineTypeForVariant(variant)}
								{...animation}
							/>
						))}
					</RechartsLineChart>
				</ResponsiveContainer>
			</div>
			{showLegend ? (
				<ChartLegend
					hiddenKeys={hiddenKeys}
					onToggle={toggleSeries}
					palette={palette}
					series={series}
				/>
			) : null}
		</ChartContainer>
	);
}

export function LineChart<T extends ChartDatum>(props: LineChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<LineChartContent {...props} />
		</ChartProvider>
	);
}
