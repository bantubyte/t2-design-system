import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDatum,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';

export interface BoxPlotDatum extends ChartDatum {
	label: string;
	lower: number;
	max: number;
	median: number;
	min: number;
	upper: number;
}

export interface BoxPlotProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<BoxPlotDatum>,
		ChartStatusProps {
	data: readonly BoxPlotDatum[];
	height?: number;
	palette?: ChartPaletteName;
}

function BoxPlotContent({ ariaDescription, ariaLabel, className, data, empty, emptyMessage, error, height = 260, loading, tableColumns, ...props }: BoxPlotProps) {
	const palette = useChartPalette();
	const min = Math.min(...data.map((datum) => datum.min), 0);
	const max = Math.max(...data.map((datum) => datum.max), 1);
	const scale = (value: number) => ((value - min) / (max - min || 1)) * 100;

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--box-plot', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? [
				{ header: 'Label', key: 'label' },
				{ header: 'Min', key: 'min' },
				{ header: 'Lower quartile', key: 'lower' },
				{ header: 'Median', key: 'median' },
				{ header: 'Upper quartile', key: 'upper' },
				{ header: 'Max', key: 'max' },
			]}
			{...props}
		>
			<div className="pds-chart-box-plot">
				{data.map((datum, index) => (
					<div className="pds-chart-box-plot__row" key={datum.label}>
						<strong>{datum.label}</strong>
						<span className="pds-chart-box-plot__axis">
							<span className="pds-chart-box-plot__whisker" style={{ left: `${scale(datum.min)}%`, width: `${scale(datum.max) - scale(datum.min)}%` }} />
							<span className="pds-chart-box-plot__box" style={{ background: palette.categorical[index % palette.categorical.length], left: `${scale(datum.lower)}%`, width: `${scale(datum.upper) - scale(datum.lower)}%` }} />
							<span className="pds-chart-box-plot__median" style={{ left: `${scale(datum.median)}%` }} />
						</span>
					</div>
				))}
			</div>
		</ChartContainer>
	);
}

export function BoxPlot(props: BoxPlotProps) {
	return (
		<ChartProvider palette={props.palette}>
			<BoxPlotContent {...props} />
		</ChartProvider>
	);
}
