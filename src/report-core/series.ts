import type { ReportNumberRange } from './types';

export function getReportNumbers(
	values: readonly (number | null | undefined)[],
): number[] {
	return values.filter((value): value is number => typeof value === 'number');
}

export function getReportRange(
	values: readonly (number | null | undefined)[],
): ReportNumberRange {
	const numbers = getReportNumbers(values);
	const min = Math.min(...numbers, 0);
	const max = Math.max(...numbers, 1);
	return { max, min, span: max - min || 1 };
}

export function createReportSeriesPath(
	values: readonly (number | null | undefined)[],
	width: number,
	height: number,
): string {
	const { min, span } = getReportRange(values);
	const xStep = values.length > 1 ? width / (values.length - 1) : width;
	let isFirstPoint = true;

	return values
		.map((value, index) => {
			if (value == null) return '';
			const x = index * xStep;
			const y = height - ((value - min) / span) * height;
			const command = isFirstPoint ? 'M' : 'L';
			isFirstPoint = false;
			return `${command} ${x.toFixed(2)} ${y.toFixed(2)}`;
		})
		.filter(Boolean)
		.join(' ');
}
