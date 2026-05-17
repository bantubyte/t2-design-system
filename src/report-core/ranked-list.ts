import { clampReportPercent } from './comparison';
import type {
	ReportContent,
	ReportRankedListItem,
	ReportRankedListModel,
} from './types';

export function createReportRankedListModel<TContent = ReportContent>(
	items: readonly ReportRankedListItem<TContent>[],
	selectedItemId?: string,
): ReportRankedListModel<TContent> {
	const maxValue = Math.max(...items.map((item) => item.value), 1);

	return {
		items: items.map((item) => ({
			...item,
			percent: clampReportPercent((item.value / maxValue) * 100),
			selected: item.id === selectedItemId,
		})),
		maxValue,
	};
}
