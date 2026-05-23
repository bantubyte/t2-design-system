import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { clamp } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { getNumberValue } from './_internal/chart-utils';

export interface CalendarHeatmapProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartStatusProps {
	data: readonly T[];
	dateKey: ChartDataKey<T> | string;
	palette?: ChartPaletteName;
	valueFormat?: ChartFormatter<T>;
	valueKey: ChartDataKey<T> | string;
}

const parseDate = (value: unknown): Date | null => {
	const date = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(date.getTime()) ? null : date;
};

function CalendarHeatmapContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	data,
	dateKey,
	empty,
	emptyMessage,
	error,
	loading,
	tableColumns,
	valueFormat,
	valueKey,
	...props
}: CalendarHeatmapProps<T>) {
	const palette = useChartPalette();
	const values = data.map((datum) => getNumberValue(datum[valueKey]) ?? 0);
	const min = Math.min(...values, 0);
	const max = Math.max(...values, 1);
	const sorted = [...data].sort((a, b) => {
		const aDate = parseDate(a[dateKey])?.getTime() ?? 0;
		const bDate = parseDate(b[dateKey])?.getTime() ?? 0;
		return aDate - bDate;
	});

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--calendar-heatmap', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={180}
			loading={loading}
			loadingVariant="grid"
			tableColumns={tableColumns ?? [{ header: 'Date', key: dateKey }, { format: valueFormat, header: 'Value', key: valueKey }]}
			{...props}
		>
			<div className="pds-chart-calendar-heatmap">
				{sorted.map((datum, index) => {
					const date = parseDate(datum[dateKey]);
					const value = getNumberValue(datum[valueKey]) ?? 0;
					const paletteIndex = Math.round(clamp((value - min) / (max - min || 1)) * (palette.sequential.length - 1));
					return (
						<span
							key={`${date?.toISOString() ?? 'date'}-${index}`}
							style={{ background: palette.sequential[paletteIndex] }}
							title={`${date?.toLocaleDateString() ?? datum[dateKey]}: ${valueFormat ? valueFormat(value, { datum }) : value}`}
						/>
					);
				})}
			</div>
		</ChartContainer>
	);
}

export function CalendarHeatmap<T extends ChartDatum>(props: CalendarHeatmapProps<T>) {
	return (
		<ChartProvider palette={props.palette ?? 'sequential'}>
			<CalendarHeatmapContent {...props} />
		</ChartProvider>
	);
}
