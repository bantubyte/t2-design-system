import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { BarChart } from './bar-chart';
import { getNumberValue } from './_internal/chart-utils';

export interface HistogramProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	bins?: number;
	data: readonly T[];
	palette?: ChartPaletteName;
	valueFormat?: ChartFormatter;
	valueKey: ChartDataKey<T> | string;
}

export function Histogram<T extends ChartDatum>({
	bins = 8,
	data,
	tableColumns: _tableColumns,
	valueFormat,
	valueKey,
	...props
}: HistogramProps<T>) {
	const values = data
		.map((datum) => getNumberValue(datum[valueKey]))
		.filter((value): value is number => value != null);
	const min = Math.min(...values, 0);
	const max = Math.max(...values, 1);
	const step = (max - min || 1) / bins;
	const histogram = Array.from({ length: bins }, (_, index) => {
		const start = min + index * step;
		const end = index === bins - 1 ? max : start + step;
		const count = values.filter((value) =>
			index === bins - 1 ? value >= start && value <= end : value >= start && value < end,
		).length;
		const label = `${valueFormat ? valueFormat(start) : Math.round(start)}-${valueFormat ? valueFormat(end) : Math.round(end)}`;
		return { count, label };
	});

	return (
		<BarChart
			data={histogram}
			series={[{ key: 'count', label: 'Count' }]}
			xKey="label"
			yFormat={(value) => String(value)}
			{...props}
		/>
	);
}
