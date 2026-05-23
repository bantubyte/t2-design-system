import { type HTMLAttributes, useMemo } from 'react';
import {
	Cell,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import type {
	ChartA11yColumn,
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { formatPercent, getChartAnimationProps } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartTooltip } from './_internal/chart-tooltip';
import { getNumberValue, getValueLabel, toChartData } from './_internal/chart-utils';

export interface PieChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	centerLabel?: string;
	data: readonly T[];
	innerRadius?: number;
	nameKey: ChartDataKey<T> | string;
	palette?: ChartPaletteName;
	showLegend?: boolean;
	showTooltip?: boolean;
	valueFormat?: ChartFormatter<T>;
	valueKey: ChartDataKey<T> | string;
	variant?: 'pie' | 'donut';
}

function PieChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	centerLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 280,
	innerRadius,
	loading,
	nameKey,
	showLegend = true,
	showTooltip = true,
	tableColumns,
	valueFormat,
	valueKey,
	variant = 'pie',
	...props
}: PieChartProps<T>) {
	const palette = useChartPalette();
	const total = useMemo(
		() =>
			data.reduce(
				(sum, datum) => sum + Math.max(getNumberValue(datum[valueKey]) ?? 0, 0),
				0,
			),
		[data, valueKey],
	);
	const percentFormatter = formatPercent();
	const columns: readonly ChartA11yColumn<T>[] =
		tableColumns ?? [
			{ header: 'Segment', key: nameKey },
			{ format: valueFormat, header: 'Value', key: valueKey },
		];
	const animation = getChartAnimationProps();

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--pie', `pds-chart--pie-${variant}`, className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			loadingVariant="donut"
			tableColumns={columns}
			{...props}
		>
			<div
				className={cx(
					'pds-chart-pie__layout',
					!showLegend && 'pds-chart-pie__layout--solo',
				)}
			>
				<div className="pds-chart__plot">
					<ResponsiveContainer height="100%" width="100%">
						<RechartsPieChart>
							{showTooltip ? (
								<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
							) : null}
							<Pie
								cx="50%"
								cy="50%"
								data={toChartData(data)}
								dataKey={String(valueKey)}
								innerRadius={variant === 'donut' ? (innerRadius ?? 58) : innerRadius}
								nameKey={String(nameKey)}
								outerRadius="82%"
								paddingAngle={2}
								stroke="var(--theme-surface)"
								strokeWidth={2}
								{...animation}
							>
								{data.map((datum, index) => (
									<Cell
										fill={palette.categorical[index % palette.categorical.length]}
										key={String(datum[nameKey] ?? index)}
									/>
								))}
							</Pie>
						</RechartsPieChart>
					</ResponsiveContainer>
					{variant === 'donut' && centerLabel ? (
						<div className="pds-chart-pie__center">{centerLabel}</div>
					) : null}
				</div>
				{showLegend ? (
					<ul className="pds-chart-pie__legend">
						{data.map((datum, index) => {
							const value = getNumberValue(datum[valueKey]) ?? 0;
							const percent = total > 0 ? value / total : 0;
							return (
								<li key={String(datum[nameKey] ?? index)}>
									<span
										className="pds-chart-pie__swatch"
										style={{
											background: palette.categorical[index % palette.categorical.length],
										}}
									/>
									<span>{getValueLabel(datum[nameKey])}</span>
									<strong>
										{valueFormat ? valueFormat(value, { datum }) : percentFormatter(percent)}
									</strong>
								</li>
							);
						})}
					</ul>
				) : null}
			</div>
		</ChartContainer>
	);
}

export function PieChart<T extends ChartDatum>(props: PieChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<PieChartContent {...props} />
		</ChartProvider>
	);
}
