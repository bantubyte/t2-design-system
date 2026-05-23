import { Fragment, type HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartPaletteName,
	ChartSizeProps,
	ChartStatusProps,
} from '../../charts-core';
import { clamp } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { getNumberValue } from './_internal/chart-utils';

export interface HeatmapProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartSizeProps,
		ChartStatusProps {
	columnKey: ChartDataKey<T> | string;
	data: readonly T[];
	palette?: ChartPaletteName;
	rowKey: ChartDataKey<T> | string;
	valueFormat?: ChartFormatter<T>;
	valueKey: ChartDataKey<T> | string;
}

function HeatmapContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	className,
	columnKey,
	data,
	empty,
	emptyMessage,
	error,
	height,
	loading,
	rowKey,
	tableColumns,
	valueFormat,
	valueKey,
	...props
}: HeatmapProps<T>) {
	const palette = useChartPalette();
	const rows = Array.from(new Set(data.map((datum) => String(datum[rowKey] ?? ''))));
	const columns = Array.from(new Set(data.map((datum) => String(datum[columnKey] ?? ''))));
	const values = data.map((datum) => getNumberValue(datum[valueKey]) ?? 0);
	const min = Math.min(...values, 0);
	const max = Math.max(...values, 1);

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--heatmap', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height ?? Math.max(rows.length * 42 + 60, 180)}
			loading={loading}
			loadingVariant="grid"
			tableColumns={
				tableColumns ?? [
					{ header: 'Row', key: rowKey },
					{ header: 'Column', key: columnKey },
					{ format: valueFormat, header: 'Value', key: valueKey },
				]
			}
			{...props}
		>
			<div
				className="pds-chart-heatmap"
				style={{
					gridTemplateColumns: `minmax(5rem, auto) repeat(${columns.length}, minmax(2.5rem, 1fr))`,
				}}
			>
				<span />
				{columns.map((column) => (
					<strong key={column}>{column}</strong>
				))}
				{rows.map((row) => (
					<Fragment key={row}>
						<strong key={`${row}-label`}>{row}</strong>
						{columns.map((column) => {
							const datum = data.find(
								(item) =>
									String(item[rowKey] ?? '') === row &&
									String(item[columnKey] ?? '') === column,
							);
							const value = datum ? (getNumberValue(datum[valueKey]) ?? 0) : 0;
							const index = Math.round(clamp((value - min) / (max - min || 1)) * (palette.sequential.length - 1));
							return (
								<span
									className="pds-chart-heatmap__cell"
									key={`${row}-${column}`}
									style={{ background: palette.sequential[index] }}
									title={`${row} / ${column}: ${valueFormat ? valueFormat(value, { datum }) : value}`}
								/>
							);
						})}
					</Fragment>
				))}
			</div>
		</ChartContainer>
	);
}

export function Heatmap<T extends ChartDatum>(props: HeatmapProps<T>) {
	return (
		<ChartProvider palette={props.palette ?? 'sequential'}>
			<HeatmapContent {...props} />
		</ChartProvider>
	);
}
