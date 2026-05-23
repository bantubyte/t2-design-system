import type { RefObject } from 'react';
import type { ChartDatum, ChartExportColumn } from '../../../charts-core';
import { createChartTableModel } from '../../../charts-core';

export interface ChartExportMenuProps<T extends ChartDatum> {
	columns: readonly ChartExportColumn<T>[];
	data: readonly T[];
	fileName?: string;
	targetRef?: RefObject<HTMLElement | null>;
}

const downloadBlob = (blob: Blob, fileName: string) => {
	if (typeof document === 'undefined') return;
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(url);
};

const quoteCsvCell = (value: string): string => `"${value.replaceAll('"', '""')}"`;

export function ChartExportMenu<T extends ChartDatum>({
	columns,
	data,
	fileName = 'chart-data',
	targetRef,
}: ChartExportMenuProps<T>) {
	const handleCsvExport = () => {
		const table = createChartTableModel(data, columns);
		const csv = [
			table.headers.map(quoteCsvCell).join(','),
			...table.rows.map((row) => row.map(quoteCsvCell).join(',')),
		].join('\n');
		downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${fileName}.csv`);
	};

	const handlePngExport = async () => {
		const svg = targetRef?.current?.querySelector('svg');
		if (!svg) return;
		const source = new XMLSerializer().serializeToString(svg);
		const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);
		const image = new Image();
		image.decoding = 'async';
		const loaded = new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error('Unable to render chart image.'));
		});
		image.src = url;
		await loaded;
		const canvas = document.createElement('canvas');
		canvas.width = svg.clientWidth || 1200;
		canvas.height = svg.clientHeight || 800;
		const context = canvas.getContext('2d');
		context?.drawImage(image, 0, 0, canvas.width, canvas.height);
		URL.revokeObjectURL(url);
		canvas.toBlob((blob) => {
			if (blob) downloadBlob(blob, `${fileName}.png`);
		}, 'image/png');
	};

	return (
		<div className="pds-chart-export-menu">
			<button onClick={handleCsvExport} type="button">
				CSV
			</button>
			<button onClick={() => void handlePngExport()} type="button">
				PNG
			</button>
		</div>
	);
}
