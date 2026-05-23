import type {
	ChartA11yColumn,
	ChartDatum,
	ChartTableModel,
} from './types';

const escapeHtml = (value: unknown): string =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

export const createChartTableModel = <T extends ChartDatum>(
	data: readonly T[],
	columns: readonly ChartA11yColumn<T>[],
	caption?: string,
): ChartTableModel => ({
	caption,
	headers: columns.map((column) => column.header),
	rows: data.map((datum, index) =>
		columns.map((column) => {
			const value = datum[column.key];
			return column.format
				? column.format(value, { datum, index, dataKey: column.key })
				: String(value ?? '—');
		}),
	),
});

export const createChartDataTable = <T extends ChartDatum>(
	data: readonly T[],
	columns: readonly ChartA11yColumn<T>[],
	caption?: string,
): string => {
	const model = createChartTableModel(data, columns, caption);
	const captionHtml = model.caption
		? `<caption>${escapeHtml(model.caption)}</caption>`
		: '';
	const headers = model.headers
		.map((header) => `<th scope="col">${escapeHtml(header)}</th>`)
		.join('');
	const rows = model.rows
		.map(
			(row) =>
				`<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`,
		)
		.join('');

	return `<table>${captionHtml}<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
};
