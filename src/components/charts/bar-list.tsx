import type { HTMLAttributes, ReactNode } from 'react';
import type {
	ChartA11yProps,
	ChartFormatter,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { formatPlainValue } from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';

export interface BarListItem {
	color?: string;
	id?: string;
	label: ReactNode;
	meta?: ReactNode;
	tone?: 'neutral' | 'good' | 'watch' | 'risk' | 'info';
	value: number;
}

export interface BarListProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		Omit<Partial<ChartA11yProps>, 'tableColumns'>,
		ChartStatusProps {
	formatValue?: ChartFormatter;
	height?: number;
	items: readonly BarListItem[];
	palette?: ChartPaletteName;
	title?: ReactNode;
}

function BarListContent({
	ariaDescription,
	ariaLabel = 'Ranked bar list',
	className,
	empty,
	emptyMessage,
	error,
	formatValue = formatPlainValue,
	height,
	items,
	loading,
	tableVisible,
	title,
	...props
}: BarListProps) {
	const palette = useChartPalette();
	const maxValue = Math.max(...items.map((item) => item.value), 1);
	const data = items.map((item, index) => ({
		label: typeof item.label === 'string' ? item.label : `Item ${index + 1}`,
		value: item.value,
	}));

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--bar-list', className)}
			data={data}
			empty={empty}
			emptyMessage={emptyMessage}
			error={error}
			height={height ?? Math.max(items.length * 48, 96)}
			loading={loading}
			loadingVariant="bar"
			tableColumns={[
				{ header: 'Label', key: 'label' },
				{ format: formatValue, header: 'Value', key: 'value' },
			]}
			tableVisible={tableVisible}
			{...props}
		>
			{title ? <h3 className="pds-chart__title">{title}</h3> : null}
			<div className="pds-chart-bar-list">
				{items.map((item, index) => (
					<div className="pds-chart-bar-list__row" key={item.id ?? index}>
						<span className="pds-chart-bar-list__label">{item.label}</span>
						<span className="pds-chart-bar-list__track">
							<span
								className={cx(
									'pds-chart-bar-list__bar',
									item.tone && `pds-chart-bar-list__bar--${item.tone}`,
								)}
								style={{
									background: item.color ?? palette.categorical[index % palette.categorical.length],
									width: `${Math.round((item.value / maxValue) * 100)}%`,
								}}
							/>
						</span>
						<strong>{formatValue(item.value)}</strong>
						{item.meta ? <small>{item.meta}</small> : null}
					</div>
				))}
			</div>
		</ChartContainer>
	);
}

export function BarList(props: BarListProps) {
	return (
		<ChartProvider palette={props.palette}>
			<BarListContent {...props} />
		</ChartProvider>
	);
}
