import { describe, expect, it } from 'vitest';
import {
	formatCompactNumber,
	formatCurrency,
	formatDate,
	formatDuration,
	formatPercent,
	formatPlainValue,
} from './formatters';

describe('chart formatters', () => {
	it('formats compact numbers, currency, and percentages for chart labels', () => {
		expect(formatCompactNumber({ locale: 'en-US' })(1500)).toBe('1.5K');
		expect(formatCurrency({ currency: 'ZAR', locale: 'en-ZA' })(2500)).toContain(
			'2 500',
		);
		expect(formatPercent({ locale: 'en-US' })(0.255)).toBe('25.5%');
		expect(formatPercent({ from: 'whole', locale: 'en-US' })(25.5)).toBe(
			'25.5%',
		);
	});

	it('formats dates, durations, and missing values predictably', () => {
		expect(formatDate({ locale: 'en-US', month: 'short' })('2026-05-22')).toContain(
			'May',
		);
		const duration = formatDuration();
		expect(duration(125)).toBe('2m 5s');
		expect(formatPlainValue(null)).toBe('—');
	});
});
