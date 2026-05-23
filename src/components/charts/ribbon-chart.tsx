import type { HTMLAttributes } from 'react';
import type {
	ChartA11yProps,
	ChartDataKey,
	ChartDatum,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';

export interface RibbonChartProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps<T>,
		ChartStatusProps {
	categoryKey: ChartDataKey<T> | string;
	data: readonly T[];
	height?: number;
	palette?: ChartPaletteName;
	rankKey: ChartDataKey<T> | string;
	xKey: ChartDataKey<T> | string;
}

function RibbonChartContent<T extends ChartDatum>({
	ariaDescription,
	ariaLabel,
	categoryKey,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 300,
	loading,
	rankKey,
	tableColumns,
	xKey,
	...props
}: RibbonChartProps<T>) {
	const palette = useChartPalette();
	const periods = Array.from(new Set(data.map((datum) => String(datum[xKey] ?? ''))));
	const categories = Array.from(new Set(data.map((datum) => String(datum[categoryKey] ?? ''))));
	const maxRank = Math.max(...data.map((datum) => Number(datum[rankKey]) || 1), 1);
	const pointFor = (category: string, period: string, index: number) => {
		const datum = data.find(
			(item) => String(item[categoryKey] ?? '') === category && String(item[xKey] ?? '') === period,
		);
		const rank = Number(datum?.[rankKey]) || maxRank;
		const x = periods.length <= 1 ? 0 : (index / (periods.length - 1)) * 100;
		const y = ((rank - 1) / Math.max(maxRank - 1, 1)) * 100;
		return `${x},${y}`;
	};

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--ribbon', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={tableColumns ?? [{ header: 'Period', key: xKey }, { header: 'Category', key: categoryKey }, { header: 'Rank', key: rankKey }]}
			{...props}
		>
			<div className="pds-chart-ribbon">
				<svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
					{categories.map((category, categoryIndex) => (
						<polyline
							fill="none"
							key={category}
							points={periods.map((period, index) => pointFor(category, period, index)).join(' ')}
							stroke={palette.categorical[categoryIndex % palette.categorical.length]}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
							vectorEffect="non-scaling-stroke"
						/>
					))}
				</svg>
				<div className="pds-chart-ribbon__axis">
					{periods.map((period) => (
						<span key={period}>{period}</span>
					))}
				</div>
			</div>
		</ChartContainer>
	);
}

export function RibbonChart<T extends ChartDatum>(props: RibbonChartProps<T>) {
	return (
		<ChartProvider palette={props.palette}>
			<RibbonChartContent {...props} />
		</ChartProvider>
	);
}
