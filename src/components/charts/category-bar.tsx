import type { HTMLAttributes, ReactNode } from 'react';
import type {
	ChartA11yProps,
	ChartFormatter,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { formatPercent } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';

export interface CategoryBarSegment {
	color?: string;
	id?: string;
	label: ReactNode;
	value: number;
}

export interface CategoryBarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		Omit<Partial<ChartA11yProps>, 'tableColumns'>,
		ChartStatusProps {
	formatValue?: ChartFormatter;
	height?: number;
	palette?: ChartPaletteName;
	segments: readonly CategoryBarSegment[];
}

function CategoryBarContent({
	ariaDescription,
	ariaLabel = 'Category share',
	className,
	empty,
	emptyMessage,
	error,
	formatValue = formatPercent(),
	height = 96,
	loading,
	segments,
	tableVisible,
	...props
}: CategoryBarProps) {
	const palette = useChartPalette();
	const total = segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0) || 1;
	const data = segments.map((segment, index) => ({
		label: typeof segment.label === 'string' ? segment.label : `Segment ${index + 1}`,
		value: segment.value,
	}));

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--category-bar', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={[
				{ header: 'Segment', key: 'label' },
				{ header: 'Value', key: 'value' },
			]}
			tableVisible={tableVisible}
			{...props}
		>
			<div className="pds-chart-category-bar">
				<div className="pds-chart-category-bar__track">
					{segments.map((segment, index) => {
						const share = Math.max(segment.value, 0) / total;
						return (
							<span
								key={segment.id ?? index}
								style={{
									background: segment.color ?? palette.categorical[index % palette.categorical.length],
									width: `${share * 100}%`,
								}}
								title={`${segment.label}: ${formatValue(share)}`}
							/>
						);
					})}
				</div>
				<ul className="pds-chart-category-bar__legend">
					{segments.map((segment, index) => {
						const share = Math.max(segment.value, 0) / total;
						return (
							<li key={segment.id ?? index}>
								<span
									style={{
										background: segment.color ?? palette.categorical[index % palette.categorical.length],
									}}
								/>
								<strong>{segment.label}</strong>
								<em>{formatValue(share)}</em>
							</li>
						);
					})}
				</ul>
			</div>
		</ChartContainer>
	);
}

export function CategoryBar(props: CategoryBarProps) {
	return (
		<ChartProvider palette={props.palette}>
			<CategoryBarContent {...props} />
		</ChartProvider>
	);
}
