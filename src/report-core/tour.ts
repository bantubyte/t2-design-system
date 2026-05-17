import type {
	ReportContent,
	ReportTourAction,
	ReportTourModel,
	ReportTourReducerContext,
	ReportTourState,
	ReportTourStep,
} from './types';

export function getSafeReportTourStepIndex(
	stepIndex: number,
	stepCount: number,
): number {
	if (stepCount <= 0) return 0;
	if (!Number.isFinite(stepIndex)) return 0;
	return Math.max(0, Math.min(stepIndex, stepCount - 1));
}

export function reduceReportTourState(
	state: ReportTourState,
	action: ReportTourAction,
	context: ReportTourReducerContext,
): ReportTourState {
	switch (action.type) {
		case 'back':
			return {
				stepIndex: getSafeReportTourStepIndex(
					state.stepIndex - 1,
					context.stepCount,
				),
			};
		case 'go':
			return {
				stepIndex: getSafeReportTourStepIndex(
					action.stepIndex,
					context.stepCount,
				),
			};
		case 'next':
			return {
				stepIndex: getSafeReportTourStepIndex(
					state.stepIndex + 1,
					context.stepCount,
				),
			};
		case 'reset':
			return { stepIndex: 0 };
	}
}

export function createReportTourModel<TContent = ReportContent>(
	steps: readonly ReportTourStep<TContent>[],
	state: ReportTourState,
): ReportTourModel<TContent> {
	const stepCount = steps.length;
	const stepIndex = getSafeReportTourStepIndex(state.stepIndex, stepCount);
	const activeStep = steps[stepIndex];

	return {
		activeStep,
		isFirst: stepIndex === 0,
		isLast: stepCount === 0 || stepIndex >= stepCount - 1,
		progressPercent: stepCount > 0 ? ((stepIndex + 1) / stepCount) * 100 : 0,
		stepCount,
		stepIndex,
	};
}
