import type {
	ReportContent,
	ReportEvidenceAction,
	ReportEvidenceItem,
	ReportEvidenceModel,
	ReportEvidenceState,
} from './types';

export function getInitialReportEvidenceState<TContent = ReportContent>(
	items: readonly ReportEvidenceItem<TContent>[],
	defaultExpandedItemId?: string,
): ReportEvidenceState {
	return { expandedItemId: defaultExpandedItemId ?? items[0]?.id };
}

export function reduceReportEvidenceState(
	state: ReportEvidenceState,
	action: ReportEvidenceAction,
): ReportEvidenceState {
	if (action.type === 'set') {
		return { expandedItemId: action.itemId };
	}

	return {
		expandedItemId:
			state.expandedItemId === action.itemId ? undefined : action.itemId,
	};
}

export function createReportEvidenceModel<TContent = ReportContent>(
	items: readonly ReportEvidenceItem<TContent>[],
	state: ReportEvidenceState = {},
): ReportEvidenceModel<TContent> {
	return {
		expandedItemId: state.expandedItemId,
		items: items.map((item) => ({
			...item,
			expanded: item.id === state.expandedItemId,
		})),
	};
}
