import type { ChartA11yColumn, ChartDatum } from '../../../charts-core';
import { createChartTableModel } from '../../../charts-core';

export interface A11yDataTableProps<T extends ChartDatum> {
	caption?: string;
	columns: readonly ChartA11yColumn<T>[];
	data: readonly T[];
	visible?: boolean;
}

export function A11yDataTable<T extends ChartDatum>({
	caption,
	columns,
	data,
	visible = false,
}: A11yDataTableProps<T>) {
	const model = createChartTableModel(data, columns, caption);

	return (
		<table className={visible ? 'pds-chart-table' : 'pds-visually-hidden'}>
			{model.caption ? <caption>{model.caption}</caption> : null}
			<thead>
				<tr>
					{model.headers.map((header) => (
						<th key={header} scope="col">
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{model.rows.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{row.map((cell, cellIndex) => (
							<td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
