import type { HTMLAttributes } from 'react';
import {
	CartesianGrid,
	ResponsiveContainer,
	Scatter,
	ScatterChart as RechartsScatterChart,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
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
import { getRechartsTickFormatter } from './_internal/chart-axis';
import { toChartData } from './_internal/chart-utils';

export interface ScatterChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	data: readonly T[];
	name?: string;
	palette?: ChartPaletteName;
	sizeKey?: ChartDataKey<T> | string;
	xFormat?: ChartFormatter<T>;
	xKey: ChartDataKey<T> | string;
	yFormat?: ChartFormatter<T>;
	yKey: ChartDataKey<T> | string;
}

function ScatterChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	name = 'Series',
	sizeKey,
	tableColumns,
	xFormat,
	xKey,
	yFormat,
	yKey,
	...props
}: ScatterChartProps<T>) {
	const palette = useChartPalette();
	const animation = getChartAnimationProps();

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--scatter', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={
				tableColumns ?? [
					{ format: xFormat, header: String(xKey), key: xKey },
					{ format: yFormat, header: String(yKey), key: yKey },
				]
			}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsScatterChart margin={{ bottom: 10, left: 4, right: 18, top: 12 }}>
						<CartesianGrid stroke={palette.grid} strokeDasharray="4 6" />
						<XAxis
							axisLine={false}
							dataKey={String(xKey)}
							name={String(xKey)}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(xFormat)}
							tickLine={false}
							type="number"
						/>
						<YAxis
							axisLine={false}
							dataKey={String(yKey)}
							name={String(yKey)}
							tick={{ fill: palette.axis, fontSize: 12, fontWeight: 700 }}
							tickFormatter={getRechartsTickFormatter(yFormat)}
							tickLine={false}
							type="number"
							width={54}
						/>
						{sizeKey ? <ZAxis dataKey={String(sizeKey)} range={[60, 520]} /> : null}
						<Tooltip content={<ChartTooltip valueFormatter={yFormat} />} />
						<Scatter data={toChartData(data)} fill={palette.categorical[0]} name={name} {...animation} />
					</RechartsScatterChart>
				</ResponsiveContainer>
			</div>
		</ChartContainer>
	);
}

export function ScatterChart<T extends ChartDatum>(props: ScatterChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<ScatterChartContent {...props} />
		</ChartProvider>
	);
}
