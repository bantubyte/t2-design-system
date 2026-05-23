import { describe, expect, it } from 'vitest';
import {
	clamp,
	getMaxAbs,
	getNumericExtent,
	niceDomain,
	niceNumber,
	normalizePercentStack,
} from './scales';

describe('chart scale helpers', () => {
	it('finds numeric extents across one or more keys', () => {
		const data = [
			{ actual: 10, forecast: 12 },
			{ actual: -4, forecast: '18' },
			{ actual: null, forecast: 'n/a' },
		];
		expect(getNumericExtent(data, ['actual', 'forecast'])).toEqual({
			max: 18,
			min: -4,
		});
		expect(getMaxAbs(data, ['actual', 'forecast'])).toBe(18);
	});

	it('creates human-friendly nice numbers and domains', () => {
		expect(niceNumber(123)).toBe(100);
		expect(niceDomain(3, 97, 5)).toEqual([0, 100]);
		expect(niceDomain(10, 10, 5)[0]).toBeLessThan(10);
	});

	it('normalizes stacked values to percentages without mutating source data', () => {
		const data = [{ channel: 'OOH', reach: 30, attention: 70 }];
		const normalized = normalizePercentStack(data, ['reach', 'attention']);
		expect(normalized[0].reach).toBe(0.3);
		expect(normalized[0].attention).toBe(0.7);
		expect(data[0].reach).toBe(30);
	});

	it('clamps values inside the requested interval', () => {
		expect(clamp(-1)).toBe(0);
		expect(clamp(2)).toBe(1);
		expect(clamp(12, 10, 20)).toBe(12);
	});
});
