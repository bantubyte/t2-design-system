import type { HTMLAttributes } from 'react';
import {
	Funnel,
	FunnelChart as RechartsFunnelChart,
	LabelList,
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

export interface FunnelChartProps<T extends ChartDatum>
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

function FunnelChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	nameKey,
	tableColumns,
	valueFormat,
	valueKey,
	...props
}: FunnelChartProps<T>) {
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
			className={cx('pds-chart--funnel', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? [{ header: 'Stage', key: nameKey }, { format: valueFormat, header: 'Value', key: valueKey }]}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<RechartsFunnelChart>
						<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
						<Funnel data={toChartData(chartData)} dataKey={String(valueKey)} nameKey={String(nameKey)} {...animation}>
							<LabelList dataKey={String(nameKey)} fill="var(--theme-foreground)" position="right" />
						</Funnel>
					</RechartsFunnelChart>
				</ResponsiveContainer>
			</div>
		</ChartContainer>
	);
}

export function FunnelChart<T extends ChartDatum>(props: FunnelChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<FunnelChartContent {...props} />
		</ChartProvider>
	);
}
