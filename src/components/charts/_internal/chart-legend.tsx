import type { KeyboardEvent } from 'react';
import type { ChartDatum, ChartPalette, ChartSeries } from '../../../charts-core';
import { getSeriesColor } from '../../../charts-core';
import { cx } from '../../../utils/class-names';
import { getSeriesLabel } from './chart-utils';

export interface ChartLegendProps<T extends ChartDatum> {
	className?: string;
	hiddenKeys?: ReadonlySet<string>;
	onToggle?: (key: string) => void;
	palette: ChartPalette;
	series: readonly ChartSeries<T>[];
}

export function ChartLegend<T extends ChartDatum>({
	className,
	hiddenKeys,
	onToggle,
	palette,
	series,
}: ChartLegendProps<T>) {
	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, key: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onToggle?.(key);
		}
	};

	return (
		<div className={cx('pds-chart-legend', className)} role="toolbar">
			{series.map((item, index) => {
				const key = String(item.key);
				const isHidden = hiddenKeys?.has(key) ?? false;
				return (
					<button
						aria-pressed={!isHidden}
						className={cx(
							'pds-chart-legend__item',
							isHidden && 'pds-chart-legend__item--hidden',
						)}
						key={key}
						onClick={() => onToggle?.(key)}
						onKeyDown={(event) => handleKeyDown(event, key)}
						type="button"
					>
						<span
							className="pds-chart-legend__swatch"
							style={{ background: getSeriesColor(palette, index, item.color) }}
						/>
						<span>{getSeriesLabel(item)}</span>
					</button>
				);
			})}
		</div>
	);
}
