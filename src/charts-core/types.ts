export type ChartPrimitiveValue = string | number | Date | boolean | null;
export type ChartDatum = Record<string, unknown>;
export type ChartDataKey<T extends ChartDatum = ChartDatum> = Extract<
	keyof T,
	string
>;

export type ChartPaletteName =
	| 'default'
	| 'colorblind'
	| 'categorical12'
	| 'sequential'
	| 'diverging';

export interface ChartPalette {
	axis: string;
	categorical: readonly string[];
	diverging: readonly string[];
	grid: string;
	name: ChartPaletteName;
	sequential: readonly string[];
	tooltipBackground: string;
	tooltipForeground: string;
}

export interface ChartFormatterContext<T extends ChartDatum = ChartDatum> {
	dataKey?: ChartDataKey<T> | string;
	datum?: T;
	index?: number;
	series?: ChartSeries<T>;
}

export type ChartFormatter<T extends ChartDatum = ChartDatum> = (
	value: unknown,
	context?: ChartFormatterContext<T>,
) => string;

export type ChartSeriesType = 'line' | 'area' | 'bar';

export interface ChartSeries<T extends ChartDatum = ChartDatum> {
	color?: string;
	key: ChartDataKey<T> | string;
	label?: string;
	stackId?: string;
	strokeDasharray?: string;
	type?: ChartSeriesType;
	yAxisId?: string | number;
}

export interface ChartA11yColumn<T extends ChartDatum = ChartDatum> {
	format?: ChartFormatter<T>;
	header: string;
	key: ChartDataKey<T> | string;
}

export interface ChartA11yProps<T extends ChartDatum = ChartDatum> {
	ariaDescription?: string;
	ariaLabel: string;
	tableColumns?: readonly ChartA11yColumn<T>[];
	tableVisible?: boolean;
}

export interface ChartStatusProps {
	empty?: boolean;
	emptyMessage?: string;
	error?: string | null;
	loading?: boolean;
}

export interface ChartSizeProps {
	height?: number;
	minHeight?: number;
}

export interface ChartExportColumn<T extends ChartDatum = ChartDatum> {
	format?: ChartFormatter<T>;
	header: string;
	key: ChartDataKey<T> | string;
}

export interface ChartTableModel {
	caption?: string;
	headers: readonly string[];
	rows: readonly (readonly string[])[];
}

export interface PercentStackDatum extends ChartDatum {
	[key: string]: unknown;
}
