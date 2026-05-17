import type {
	ReportComparisonInput,
	ReportComparisonMetric,
	ReportComparisonModel,
	ReportComparisonWinner,
	ReportContent,
} from './types';

export function clampReportPercent(value: number): number {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(100, Math.round(value)));
}

export function getReportMetricWinner(
	metric: ReportComparisonMetric,
): ReportComparisonWinner {
	if (metric.winner) return metric.winner;
	if (metric.leftValue === metric.rightValue) return 'tie';
	return metric.leftValue > metric.rightValue ? 'left' : 'right';
}

export function getReportComparisonWinner<TContent = ReportContent>(
	input: Pick<
		ReportComparisonInput<TContent>,
		'defaultWinner' | 'metrics' | 'winner'
	>,
): ReportComparisonWinner {
	if (input.winner) return input.winner;
	if (input.defaultWinner) return input.defaultWinner;

	const score = input.metrics.reduce((total, metric) => {
		const winner = getReportMetricWinner(metric);
		if (winner === 'left') return total + 1;
		if (winner === 'right') return total - 1;
		return total;
	}, 0);

	if (score === 0) return 'tie';
	return score > 0 ? 'left' : 'right';
}

export function createReportComparisonModel<TContent = ReportContent>(
	input: ReportComparisonInput<TContent>,
): ReportComparisonModel<TContent> {
	const winner = getReportComparisonWinner(input);

	return {
		entities: [
			{ ...input.left, selected: winner === 'left', side: 'left' },
			{ ...input.right, selected: winner === 'right', side: 'right' },
		],
		metrics: input.metrics.map((metric) => {
			const max = Math.max(metric.leftValue, metric.rightValue, 1);
			return {
				...metric,
				leftPercent: clampReportPercent((metric.leftValue / max) * 100),
				rightPercent: clampReportPercent((metric.rightValue / max) * 100),
				winner: getReportMetricWinner(metric),
			};
		}),
		winner,
	};
}
