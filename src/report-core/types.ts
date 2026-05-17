export type ReportContent = unknown;

export type ReportTone = 'neutral' | 'good' | 'watch' | 'risk' | 'info';

export type ReportMetricAccent =
	| 'blue'
	| 'cyan'
	| 'green'
	| 'magenta'
	| 'orange'
	| 'red'
	| 'violet';

export type ReportComparisonWinner = 'left' | 'right' | 'tie';

export type ReportComparisonSide = Exclude<ReportComparisonWinner, 'tie'>;

export interface ReportComparisonEntity<TContent = ReportContent> {
	description?: TContent;
	id: string;
	label: TContent;
	meta?: TContent;
}

export interface ReportComparisonMetric<TContent = ReportContent> {
	delta?: TContent;
	label: TContent;
	leftValue: number;
	rightValue: number;
	unit?: TContent;
	winner?: ReportComparisonWinner;
}

export interface ReportComparisonEntityModel<TContent = ReportContent>
	extends ReportComparisonEntity<TContent> {
	selected: boolean;
	side: ReportComparisonSide;
}

export interface ReportComparisonMetricModel<TContent = ReportContent>
	extends ReportComparisonMetric<TContent> {
	leftPercent: number;
	rightPercent: number;
	winner: ReportComparisonWinner;
}

export interface ReportComparisonModel<TContent = ReportContent> {
	entities: readonly [
		ReportComparisonEntityModel<TContent>,
		ReportComparisonEntityModel<TContent>,
	];
	metrics: readonly ReportComparisonMetricModel<TContent>[];
	winner: ReportComparisonWinner;
}

export interface ReportComparisonInput<TContent = ReportContent> {
	defaultWinner?: ReportComparisonWinner;
	left: ReportComparisonEntity<TContent>;
	metrics: readonly ReportComparisonMetric<TContent>[];
	right: ReportComparisonEntity<TContent>;
	winner?: ReportComparisonWinner;
}

export interface ReportEvidenceItem<TContent = ReportContent> {
	detail?: TContent;
	id: string;
	source?: TContent;
	title: TContent;
	tone?: ReportTone;
}

export interface ReportEvidenceItemModel<TContent = ReportContent>
	extends ReportEvidenceItem<TContent> {
	expanded: boolean;
}

export interface ReportEvidenceState {
	expandedItemId?: string;
}

export type ReportEvidenceAction =
	| { itemId: string; type: 'toggle' }
	| { itemId?: string; type: 'set' };

export interface ReportEvidenceModel<TContent = ReportContent> {
	expandedItemId?: string;
	items: readonly ReportEvidenceItemModel<TContent>[];
}

export interface ReportTourStep<TContent = ReportContent> {
	body: TContent;
	id: string;
	kicker?: TContent;
	title: TContent;
}

export interface ReportTourState {
	stepIndex: number;
}

export type ReportTourAction =
	| { stepIndex: number; type: 'go' }
	| { type: 'back' }
	| { type: 'next' }
	| { type: 'reset' };

export interface ReportTourReducerContext {
	stepCount: number;
}

export interface ReportTourModel<TContent = ReportContent> {
	activeStep?: ReportTourStep<TContent>;
	isFirst: boolean;
	isLast: boolean;
	progressPercent: number;
	stepCount: number;
	stepIndex: number;
}

export interface ReportRankedListItem<TContent = ReportContent> {
	id: string;
	label: TContent;
	meta?: TContent;
	tone?: ReportTone;
	value: number;
	valueLabel?: TContent;
}

export interface ReportRankedListItemModel<TContent = ReportContent>
	extends ReportRankedListItem<TContent> {
	percent: number;
	selected: boolean;
}

export interface ReportRankedListModel<TContent = ReportContent> {
	items: readonly ReportRankedListItemModel<TContent>[];
	maxValue: number;
}

export interface ReportPlacementRow<TContent = ReportContent> {
	code: TContent;
	format?: TContent;
	id?: string;
	name: TContent;
	pacing?: number;
	region?: TContent;
	status?: TContent;
	value: TContent;
}

export interface ReportPlacementRowModel<TContent = ReportContent>
	extends ReportPlacementRow<TContent> {
	key: string;
	pacingPercent?: number;
	selectable: boolean;
	selected: boolean;
}

export interface ReportPlacementTableOptions {
	selectable?: boolean;
	selectedRowId?: string;
}

export interface ReportPlacementTableModel<TContent = ReportContent> {
	rows: readonly ReportPlacementRowModel<TContent>[];
}

export interface ReportNumberRange {
	max: number;
	min: number;
	span: number;
}
