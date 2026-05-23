import type { ChartDataKey, ChartDatum, PercentStackDatum } from './types';

const asNumber = (value: unknown): number | null => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

export const clamp = (value: number, min = 0, max = 1): number =>
	Math.min(max, Math.max(min, value));

export const getNumericExtent = <T extends ChartDatum>(
	data: readonly T[],
	keys: readonly (ChartDataKey<T> | string)[],
): { max: number; min: number } => {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;

	for (const datum of data) {
		for (const key of keys) {
			const value = asNumber(datum[key]);
			if (value == null) continue;
			min = Math.min(min, value);
			max = Math.max(max, value);
		}
	}

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		return { max: 0, min: 0 };
	}

	return { max, min };
};

export const niceNumber = (range: number, round = true): number => {
	if (!Number.isFinite(range) || range <= 0) return 1;
	const exponent = Math.floor(Math.log10(range));
	const fraction = range / 10 ** exponent;
	const niceFraction = round
		? fraction < 1.5
			? 1
			: fraction < 3
				? 2
				: fraction < 7
					? 5
					: 10
		: fraction <= 1
			? 1
			: fraction <= 2
				? 2
				: fraction <= 5
					? 5
					: 10;
	return niceFraction * 10 ** exponent;
};

export const niceDomain = (
	min: number,
	max: number,
	tickCount = 5,
): [number, number] => {
	if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
	if (min === max) {
		const padding = niceNumber(Math.abs(min || 1) * 0.2);
		return [min - padding, max + padding];
	}
	const range = niceNumber(max - min, false);
	const step = niceNumber(range / Math.max(tickCount - 1, 1), true);
	return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
};

export const getStackTotal = <T extends ChartDatum>(
	datum: T,
	keys: readonly (ChartDataKey<T> | string)[],
): number =>
	keys.reduce((sum, key) => {
		const value = asNumber(datum[key]);
		return sum + Math.max(value ?? 0, 0);
	}, 0);

export const normalizePercentStack = <T extends ChartDatum>(
	data: readonly T[],
	keys: readonly (ChartDataKey<T> | string)[],
): PercentStackDatum[] =>
	data.map((datum) => {
		const total = getStackTotal(datum, keys) || 1;
		const normalized: PercentStackDatum = { ...datum };
		for (const key of keys) {
			const value = asNumber(datum[key]) ?? 0;
			normalized[key] = value / total;
		}
		return normalized;
	});

export const getPositiveMax = <T extends ChartDatum>(
	data: readonly T[],
	keys: readonly (ChartDataKey<T> | string)[],
): number => Math.max(getNumericExtent(data, keys).max, 0);

export const getMaxAbs = <T extends ChartDatum>(
	data: readonly T[],
	keys: readonly (ChartDataKey<T> | string)[],
): number => {
	const { max, min } = getNumericExtent(data, keys);
	return Math.max(Math.abs(min), Math.abs(max));
};
