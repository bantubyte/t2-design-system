import type { HTMLAttributes } from 'react';
import { ResponsiveContainer, Tooltip, Treemap as RechartsTreemap } from 'recharts';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartTooltip } from './_internal/chart-tooltip';

export interface TreemapProps<T extends ChartDatum>
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

function TreemapContent<T extends ChartDatum>({
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
}: TreemapProps<T>) {
	const palette = useChartPalette();
	const chartData = data.map((datum, index) => ({
		...datum,
		fill: palette.categorical[index % palette.categorical.length],
	}));

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--treemap', className)}
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
					<RechartsTreemap
						data={chartData as Record<string, unknown>[]}
						dataKey={String(valueKey)}
						nameKey={String(nameKey)}
						stroke="var(--theme-surface)"
					>
						<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
					</RechartsTreemap>
				</ResponsiveContainer>
			</div>
		</ChartContainer>
	);
}

export function Treemap<T extends ChartDatum>(props: TreemapProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<TreemapContent {...props} />
		</ChartProvider>
	);
}
