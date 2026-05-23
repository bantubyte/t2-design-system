import { type HTMLAttributes, useMemo, useState } from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
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
import { getRechartsTickFormatter } from './_internal/chart-axis';
import { getSeriesColumns, getSeriesLabel, toChartData } from './_internal/chart-utils';

export interface ComboChartProps<T extends ChartDatum>
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
	xFormat?: ChartFormatter<T>;
	xKey: ChartDataKey<T> | string;
	yFormat?: ChartFormatter<T>;
}

function ComboChartContent<T extends ChartDatum>({
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
	tableColumns,
	xFormat,
	xKey,
	yFormat,
	...props
}: ComboChartProps<T>) {
	const palette = useChartPalette();
	const [hiddenKeys, setHiddenKeys] = useState<ReadonlySet<string>>(new Set());
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
			className={cx('pds-chart--combo', className)}
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
					<ComposedChart data={toChartData(data)} margin={{ bottom: 10, left: 4, right: 18, top: 12 }}>
						{showGrid ? <CartesianGrid stroke={palette.grid} strokeDasharray="4 6" vertical={false} /> : null}
						<XAxis axisLine={false} dataKey={String(xKey)} tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }} tickFormatter={getRechartsTickFormatter(xFormat)} tickLine={false} />
						<YAxis axisLine={false} tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }} tickFormatter={getRechartsTickFormatter(yFormat)} tickLine={false} width={54} />
						{showTooltip ? <Tooltip content={<ChartTooltip labelFormatter={xFormat} valueFormatter={yFormat} />} /> : null}
						{visibleSeries.map((item, index) => {
							const color = item.color ?? palette.categorical[index % palette.categorical.length];
							return item.type === 'line' ? (
								<Line key={String(item.key)} dataKey={String(item.key)} name={getSeriesLabel(item)} stroke={color} strokeDasharray={getSeriesStrokeDasharray(index, item.strokeDasharray)} strokeWidth={2.5} type="monotone" {...animation} />
							) : (
								<Bar key={String(item.key)} dataKey={String(item.key)} fill={color} name={getSeriesLabel(item)} radius={[6, 6, 0, 0]} {...animation} />
							);
						})}
					</ComposedChart>
				</ResponsiveContainer>
			</div>
			{showLegend ? <ChartLegend hiddenKeys={hiddenKeys} onToggle={toggleSeries} palette={palette} series={series} /> : null}
		</ChartContainer>
	);
}

export function ComboChart<T extends ChartDatum>(props: ComboChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<ComboChartContent {...props} />
		</ChartProvider>
	);
}
