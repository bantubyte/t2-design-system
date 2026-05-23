import type { HTMLAttributes } from 'react';
import {
	RadialBar,
	RadialBarChart as RechartsRadialBarChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { getChartAnimationProps } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartTooltip } from './_internal/chart-tooltip';
import { toChartData } from './_internal/chart-utils';

export interface RadialBarChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	data: readonly T[];
	nameKey: ChartDataKey<T> | string;
	palette?: ChartPaletteName;
	valueFormat?: ChartFormatter<T>;
	valueKey: ChartDataKey<T> | string;
}

function RadialBarChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 300,
	loading,
	nameKey,
	tableColumns,
	valueFormat,
	valueKey,
	...props
}: RadialBarChartProps<T>) {
	const palette = useChartPalette();
	const chartData = data.map((datum, index) => ({
		...datum,
		fill: palette.categorical[index % palette.categorical.length],
	}));
	const animation = getChartAnimationProps();

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--radial-bar', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? [{ header: 'Label', key: nameKey }, { format: valueFormat, header: 'Value', key: valueKey }]}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsRadialBarChart
						barSize={18}
						cx="50%"
						cy="50%"
						data={toChartData(chartData)}
						endAngle={-270}
						innerRadius="22%"
						outerRadius="92%"
						startAngle={90}
					>
						<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
						<RadialBar background cornerRadius={10} dataKey={String(valueKey)} name={String(nameKey)} {...animation} />
					</RechartsRadialBarChart>
				</ResponsiveContainer>
			</div>
		</ChartContainer>
	);
}

export function RadialBarChart<T extends ChartDatum>(props: RadialBarChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<RadialBarChartContent {...props} />
		</ChartProvider>
	);
}
