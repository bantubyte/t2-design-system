import type {
	ReportContent,
	ReportPlacementRow,
	ReportPlacementTableModel,
	ReportPlacementTableOptions,
} from './types';

export function getReportPacingPercent(pacing?: number): number | undefined {
	if (typeof pacing !== 'number' || !Number.isFinite(pacing)) return undefined;
	return Math.max(0, Math.min(120, Math.round(pacing * 100)));
}

export function createReportPlacementTableModel<TContent = ReportContent>(
	rows: readonly ReportPlacementRow<TContent>[],
	options: ReportPlacementTableOptions = {},
): ReportPlacementTableModel<TContent> {
	return {
		rows: rows.map((row, index) => ({
			...row,
			key: row.id ?? String(index),
			pacingPercent: getReportPacingPercent(row.pacing),
			selectable: Boolean(options.selectable),
			selected: Boolean(row.id && row.id === options.selectedRowId),
		})),
	};
}
