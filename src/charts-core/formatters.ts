import type { ChartFormatter } from './types';

export interface NumberFormatterOptions extends Intl.NumberFormatOptions {
	locale?: string;
}

const toNumber = (value: unknown): number | null => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

export const formatNumber = ({
	locale = 'en-ZA',
	...options
}: NumberFormatterOptions = {}): ChartFormatter => {
	const formatter = new Intl.NumberFormat(locale, options);
	return (value) => {
		const number = toNumber(value);
		return number == null ? '—' : formatter.format(number);
	};
};

export const formatCompactNumber = (
	options: NumberFormatterOptions = {},
): ChartFormatter =>
	formatNumber({
		locale: options.locale,
		maximumFractionDigits: 1,
		notation: 'compact',
		...options,
	});

export const formatCurrency = ({
	currency = 'ZAR',
	locale = 'en-ZA',
	...options
}: NumberFormatterOptions & { currency?: string } = {}): ChartFormatter =>
	formatNumber({
		currency,
		locale,
		maximumFractionDigits: 0,
		style: 'currency',
		...options,
	});

export const formatPercent = ({
	from = 'ratio',
	locale = 'en-ZA',
	...options
}: NumberFormatterOptions & { from?: 'ratio' | 'whole' } = {}): ChartFormatter => {
	const formatter = new Intl.NumberFormat(locale, {
		maximumFractionDigits: 1,
		style: 'percent',
		...options,
	});
	return (value) => {
		const number = toNumber(value);
		if (number == null) return '—';
		return formatter.format(from === 'whole' ? number / 100 : number);
	};
};

export const formatDate = ({
	locale = 'en-ZA',
	...options
}: Intl.DateTimeFormatOptions & { locale?: string } = {}): ChartFormatter => {
	const formatter = new Intl.DateTimeFormat(locale, {
		day: '2-digit',
		month: 'short',
		...options,
	});
	return (value) => {
		const date =
			value instanceof Date
				? value
				: typeof value === 'string' || typeof value === 'number'
					? new Date(value)
					: null;
		return date && !Number.isNaN(date.getTime()) ? formatter.format(date) : '—';
	};
};

export const formatDuration = ({
	unit = 'seconds',
}: {
	unit?: 'seconds' | 'minutes' | 'hours';
} = {}): ChartFormatter => {
	const factor = unit === 'hours' ? 3600 : unit === 'minutes' ? 60 : 1;
	return (value) => {
		const number = toNumber(value);
		if (number == null) return '—';
		const seconds = Math.round(number * factor);
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;
		if (hours > 0) return `${hours}h ${minutes}m`;
		if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
		return `${remainingSeconds}s`;
	};
};

export const formatPlainValue: ChartFormatter = (value) => {
	if (value == null || value === '') return '—';
	if (value instanceof Date) return formatDate()(value);
	return String(value);
};
