import type {
	ChartA11yColumn,
	ChartDataKey,
	ChartDatum,
	ChartFormatter,
	ChartSeries,
} from '../../../charts-core';
import { formatPlainValue } from '../../../charts-core';

export const toChartData = <T extends ChartDatum>(
	data: readonly T[],
): Record<string, unknown>[] => data as Record<string, unknown>[];

export const getDatumValue = <T extends ChartDatum>(
	datum: T,
	key: ChartDataKey<T> | string,
): unknown => datum[key];

export const getNumberValue = (value: unknown): number | null => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

export const getSeriesLabel = <T extends ChartDatum>(
	series: ChartSeries<T>,
): string => series.label ?? String(series.key);

export const getSeriesColumns = <T extends ChartDatum>(
	xKey: ChartDataKey<T> | string,
	series: readonly ChartSeries<T>[],
	xFormat?: ChartFormatter<T>,
	yFormat?: ChartFormatter<T>,
): ChartA11yColumn<T>[] => [
	{
		format: xFormat,
		header: String(xKey),
		key: xKey,
	},
	...series.map((item) => ({
		format: yFormat,
		header: getSeriesLabel(item),
		key: item.key,
	})),
];

export const getValueLabel = <T extends ChartDatum>(
	value: unknown,
	formatter?: ChartFormatter<T>,
): string => (formatter ? formatter(value) : formatPlainValue(value));

export const getChartId = (prefix: string): string =>
	`${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const getPercent = (value: number, total: number): number =>
	total <= 0 ? 0 : Math.max(0, value / total);
