import type { ChartFormatter } from '../../../charts-core';
import { formatCompactNumber, formatDate, formatPercent } from '../../../charts-core';

export type ChartAxisPreset = 'compact' | 'currency' | 'date' | 'percent';

export const resolveAxisFormatter = (
	preset?: ChartAxisPreset,
	formatter?: ChartFormatter,
): ChartFormatter | undefined => {
	if (formatter) return formatter;
	if (preset === 'compact') return formatCompactNumber();
	if (preset === 'date') return formatDate();
	if (preset === 'percent') return formatPercent();
	return undefined;
};

export const getRechartsTickFormatter =
	(formatter?: ChartFormatter): ((value: unknown) => string) | undefined =>
		formatter ? (value: unknown) => formatter(value) : undefined;
