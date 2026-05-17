import {
	createReportComparisonModel,
	createReportEvidenceModel,
	createReportPlacementTableModel,
	createReportRankedListModel,
	createReportTourModel,
	type ReportComparisonEntity,
	type ReportComparisonMetric,
	type ReportComparisonWinner,
	type ReportEvidenceItem,
	type ReportMetricAccent,
	type ReportPlacementRow,
	type ReportRankedListItem,
	type ReportTone,
	type ReportTourStep,
	reduceReportEvidenceState,
	reduceReportTourState,
} from '../report-core';
import { cx } from '../utils/class-names';
import { h, type RawJsxNode } from './runtime';

type RawEventHandler<TEvent extends Event = Event> = (event: TEvent) => void;

interface RawHtmlProps {
	className?: string;
	disabled?: boolean;
	id?: string;
	key?: string | number;
	onClick?: RawEventHandler;
	onKeyDown?: RawEventHandler<KeyboardEvent>;
	role?: string;
	style?: Record<string, number | string>;
	tabIndex?: number;
	type?: string;
}

export type RawBadgeTone =
	| 'accent'
	| 'brand'
	| 'danger'
	| 'info'
	| 'neutral'
	| 'success'
	| 'warning';

export type RawLoaderMotion = 'none' | 'orbit' | 'pulse' | 'shimmer' | 'wave';
export type RawReportLoaderMotion = Exclude<RawLoaderMotion, 'orbit'>;

const toneToBadgeTone: Record<ReportTone, RawBadgeTone> = {
	good: 'success',
	info: 'info',
	neutral: 'neutral',
	risk: 'danger',
	watch: 'warning',
};

function rawBadge(
	children: RawJsxNode,
	tone: RawBadgeTone = 'neutral',
	size: 'md' | 'sm' = 'md',
): RawJsxNode {
	return h(
		'span',
		{ className: cx('pds-badge', `pds-badge--${tone}`, `pds-badge--${size}`) },
		h('span', null, children),
	);
}

function rawLoadingState(
	label: RawJsxNode,
	size: 'lg' | 'md' | 'sm' = 'sm',
	motion: RawLoaderMotion = 'orbit',
): RawJsxNode {
	return h(
		'div',
		{
			'aria-live': 'polite',
			className: cx(
				'pds-loading-state',
				`pds-loading-state--${size}`,
				`pds-loader-motion--${motion}`,
			),
		},
		h('span', { className: 'pds-loading-state__spinner' }),
		h('span', null, label),
	);
}

function rawSkeleton({
	className,
	height,
	motion = 'shimmer',
	radius = 'md',
	width,
}: {
	className?: string;
	height?: number | string;
	motion?: RawReportLoaderMotion;
	radius?: 'full' | 'lg' | 'md' | 'sm';
	width?: number | string;
}): RawJsxNode {
	return h('div', {
		'aria-hidden': 'true',
		className: cx(
			'pds-skeleton',
			`pds-skeleton--${motion}`,
			`pds-skeleton--radius-${radius}`,
			className,
		),
		style: { height, width },
	});
}

function rawCardLoadingState({
	media = false,
	motion = 'shimmer',
	rows = 3,
}: {
	media?: false | 'banner' | 'thumbnail';
	motion?: RawReportLoaderMotion;
	rows?: number;
}): RawJsxNode {
	return h(
		'output',
		{
			'aria-busy': 'true',
			className: cx(
				'pds-card-loader',
				'pds-card-loader--comfortable',
				media && `pds-card-loader--media-${media}`,
			),
		},
		media ? rawSkeleton({ className: 'pds-card-loader__media', motion }) : null,
		h(
			'div',
			{ className: 'pds-card-loader__header' },
			rawSkeleton({ height: '0.8rem', motion, width: '36%' }),
			rawSkeleton({ height: '1.6rem', motion, width: '2.8rem' }),
		),
		h(
			'div',
			{ className: 'pds-card-loader__rows' },
			Array.from({ length: rows }, (_, index) =>
				rawSkeleton({
					className: 'pds-card-loader__row',
					height: '0.72rem',
					motion,
					width: `${index === rows - 1 ? 48 : 94 - index * 7}%`,
				}),
			),
		),
	);
}

export type RawReportBlockVariant =
	| 'chart'
	| 'commentary'
	| 'comparison'
	| 'default'
	| 'entity'
	| 'evidence'
	| 'metric'
	| 'recommendation'
	| 'tour';

export interface RawReportBlockProps extends RawHtmlProps {
	actions?: RawJsxNode;
	children?: RawJsxNode;
	description?: RawJsxNode;
	eyebrow?: RawJsxNode;
	footer?: RawJsxNode;
	interactive?: boolean;
	selected?: boolean;
	title?: RawJsxNode;
	tone?: ReportTone;
	variant?: RawReportBlockVariant;
}

export function RawReportBlock({
	actions,
	children,
	className,
	description,
	eyebrow,
	footer,
	interactive = false,
	selected = false,
	title,
	tone = 'neutral',
	variant = 'default',
	...props
}: RawReportBlockProps): RawJsxNode {
	return h(
		'div',
		{
			className: cx(
				'pds-card',
				'pds-card--default',
				interactive && 'pds-card--interactive',
				'pds-report-block',
				`pds-report-block--${variant}`,
				`pds-report-block--${tone}`,
				selected && 'pds-report-block--selected',
				className,
			),
			...props,
		},
		eyebrow || title || description || actions
			? h(
					'div',
					{ className: 'pds-card__header pds-report-block__header' },
					h(
						'div',
						null,
						eyebrow
							? h('p', { className: 'pds-report-block__eyebrow' }, eyebrow)
							: null,
						title ? h('h3', { className: 'pds-card__title' }, title) : null,
						description
							? h(
									'p',
									{ className: 'pds-report-block__description' },
									description,
								)
							: null,
					),
					actions
						? h('div', { className: 'pds-report-block__actions' }, actions)
						: null,
				)
			: null,
		h(
			'div',
			{ className: 'pds-card__content pds-report-block__content' },
			children,
		),
		footer ? h('div', { className: 'pds-report-block__footer' }, footer) : null,
	);
}

export interface RawReportMetricTileProps
	extends Omit<
		RawReportBlockProps,
		'actions' | 'children' | 'title' | 'variant'
	> {
	accent?: ReportMetricAccent;
	helpLabel?: string;
	icon?: RawJsxNode;
	id?: string;
	label: RawJsxNode;
	onInfoClick?: () => void;
	onSelect?: (id?: string) => void;
	sublabel?: RawJsxNode;
	value: RawJsxNode;
}

export function RawReportMetricTile({
	accent = 'blue',
	className,
	helpLabel = 'Metric details',
	icon,
	id,
	label,
	onInfoClick,
	onSelect,
	selected = false,
	sublabel,
	value,
	...props
}: RawReportMetricTileProps): RawJsxNode {
	const interactive = Boolean(onSelect);
	const activate = () => onSelect?.(id);
	const onKeyDown: RawEventHandler<KeyboardEvent> = (event) => {
		if (!interactive) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activate();
		}
	};

	return RawReportBlock({
		...props,
		className: cx(
			'pds-report-metric-tile',
			`pds-report-metric-tile--${accent}`,
			className,
		),
		interactive,
		onClick: activate,
		onKeyDown,
		role: interactive ? 'button' : undefined,
		selected,
		tabIndex: interactive ? 0 : undefined,
		variant: 'metric',
		children: [
			h(
				'div',
				{ className: 'pds-report-metric-tile__topline' },
				h(
					'div',
					null,
					h('span', null, label),
					sublabel ? h('small', null, sublabel) : null,
				),
				icon
					? h('span', { className: 'pds-report-metric-tile__icon' }, icon)
					: null,
			),
			h('div', { className: 'pds-report-metric-tile__value' }, value),
			onInfoClick
				? h(
						'button',
						{
							'aria-label': helpLabel,
							className: 'pds-report-metric-tile__info',
							onClick: (event: Event) => {
								event.stopPropagation();
								onInfoClick();
							},
							type: 'button',
						},
						'i',
					)
				: null,
		],
	});
}

export interface RawReportMetricRibbonProps extends RawHtmlProps {
	children?: RawJsxNode;
	highlighted?: boolean;
	tourAnchor?: 'bottom' | 'top';
}

export function RawReportMetricRibbon({
	children,
	className,
	highlighted = false,
	tourAnchor,
	...props
}: RawReportMetricRibbonProps): RawJsxNode {
	return h(
		'div',
		{
			className: cx(
				'pds-report-metric-ribbon',
				highlighted && 'pds-report-metric-ribbon--highlighted',
				tourAnchor && `pds-report-metric-ribbon--anchor-${tourAnchor}`,
				className,
			),
			...props,
		},
		children,
	);
}

export interface RawReportMetricRibbonLoadingProps extends RawHtmlProps {
	count?: number;
	motion?: RawReportLoaderMotion;
}

export function RawReportMetricRibbonLoading({
	className,
	count = 6,
	motion = 'shimmer',
	...props
}: RawReportMetricRibbonLoadingProps): RawJsxNode {
	return RawReportMetricRibbon({
		className: cx(
			'pds-report-metric-ribbon--loading',
			`pds-loader-motion--${motion}`,
			className,
		),
		...props,
		children: Array.from({ length: count }, (_, index) =>
			h(
				'div',
				{
					className: cx(
						'pds-report-metric-tile-loading',
						`pds-loader-motion--${motion}`,
					),
					key: index,
				},
				h('span'),
				h('strong'),
				h('small'),
			),
		),
	});
}

export interface RawReportEvidenceListProps
	extends Omit<RawReportBlockProps, 'children' | 'variant'> {
	defaultExpandedItemId?: string;
	expandedItemId?: string;
	items: readonly ReportEvidenceItem<RawJsxNode>[];
	onExpandedItemChange?: (itemId: string) => void;
}

export function RawReportEvidenceList({
	className,
	defaultExpandedItemId,
	expandedItemId,
	items,
	onExpandedItemChange,
	title = 'Evidence',
	...props
}: RawReportEvidenceListProps): RawJsxNode {
	const activeExpandedItemId =
		expandedItemId ?? defaultExpandedItemId ?? items[0]?.id;
	const model = createReportEvidenceModel(items, {
		expandedItemId: activeExpandedItemId,
	});

	return RawReportBlock({
		...props,
		className: cx('pds-report-evidence-list', className),
		title,
		variant: 'evidence',
		children: h(
			'div',
			{ className: 'pds-report-evidence-list__items' },
			model.items.map((item) =>
				h(
					'div',
					{
						className: cx(
							'pds-report-evidence-list__item',
							item.expanded && 'pds-report-evidence-list__item--expanded',
						),
						key: item.id,
					},
					h(
						'button',
						{
							'aria-expanded': item.expanded,
							onClick: () => {
								const next = reduceReportEvidenceState(
									{ expandedItemId: model.expandedItemId },
									{ itemId: item.id, type: 'toggle' },
								);
								if (next.expandedItemId)
									onExpandedItemChange?.(next.expandedItemId);
							},
							type: 'button',
						},
						rawBadge(
							item.tone ?? 'info',
							toneToBadgeTone[item.tone ?? 'info'],
							'sm',
						),
						h('span', null, item.title),
					),
					item.expanded
						? h(
								'div',
								{ className: 'pds-report-evidence-list__detail' },
								item.detail ? h('p', null, item.detail) : null,
								item.source ? h('small', null, item.source) : null,
							)
						: null,
				),
			),
		),
	});
}

export interface RawReportComparisonBlockProps
	extends Omit<RawReportBlockProps, 'children' | 'variant'> {
	defaultWinner?: ReportComparisonWinner;
	left: ReportComparisonEntity<RawJsxNode>;
	metrics: readonly ReportComparisonMetric<RawJsxNode>[];
	onWinnerChange?: (winner: ReportComparisonWinner) => void;
	right: ReportComparisonEntity<RawJsxNode>;
	winner?: ReportComparisonWinner;
}

export function RawReportComparisonBlock({
	className,
	defaultWinner,
	left,
	metrics,
	onWinnerChange,
	right,
	title = 'Entity comparison',
	winner,
	...props
}: RawReportComparisonBlockProps): RawJsxNode {
	const model = createReportComparisonModel({
		defaultWinner,
		left,
		metrics,
		right,
		winner,
	});
	const winnerLabel =
		model.winner === 'tie'
			? 'Tie'
			: [model.winner === 'left' ? left.label : right.label, ' leads'];

	return RawReportBlock({
		...props,
		actions: rawBadge(
			winnerLabel,
			model.winner === 'tie' ? 'neutral' : 'success',
		),
		className: cx('pds-report-comparison', className),
		title,
		variant: 'comparison',
		children: [
			h(
				'div',
				{ className: 'pds-report-comparison__entities' },
				model.entities.map((entity) =>
					h(
						'button',
						{
							'aria-pressed': entity.selected,
							className: cx(
								'pds-report-comparison__entity',
								entity.selected && 'pds-report-comparison__entity--selected',
							),
							key: entity.id,
							onClick: () => onWinnerChange?.(entity.side),
							type: 'button',
						},
						h('strong', null, entity.label),
						entity.description ? h('span', null, entity.description) : null,
						entity.meta ? h('small', null, entity.meta) : null,
					),
				),
			),
			h(
				'div',
				{ className: 'pds-report-comparison__metrics' },
				model.metrics.map((metric, index) =>
					h(
						'div',
						{ className: 'pds-report-comparison__metric', key: index },
						h(
							'div',
							{ className: 'pds-report-comparison__metric-label' },
							h('strong', null, metric.label),
							metric.delta ? h('span', null, metric.delta) : null,
						),
						h(
							'div',
							{ className: 'pds-report-comparison__bars' },
							h(
								'span',
								{
									className: cx(
										'pds-report-comparison__bar',
										metric.winner === 'left' &&
											'pds-report-comparison__bar--winner',
									),
								},
								h('span', { style: { width: `${metric.leftPercent}%` } }),
								h('strong', null, metric.leftValue, metric.unit),
							),
							h(
								'span',
								{
									className: cx(
										'pds-report-comparison__bar',
										metric.winner === 'right' &&
											'pds-report-comparison__bar--winner',
									),
								},
								h('span', { style: { width: `${metric.rightPercent}%` } }),
								h('strong', null, metric.rightValue, metric.unit),
							),
						),
					),
				),
			),
		],
	});
}

export interface RawReportRankedListBlockProps
	extends Omit<RawReportBlockProps, 'children' | 'variant'> {
	formatValue?: (value: number) => RawJsxNode;
	items: readonly ReportRankedListItem<RawJsxNode>[];
	onItemSelect?: (item: ReportRankedListItem<RawJsxNode>) => void;
	selectedItemId?: string;
}

export function RawReportRankedListBlock({
	className,
	formatValue = (value) => value,
	items,
	onItemSelect,
	selectedItemId,
	title = 'Ranked list',
	...props
}: RawReportRankedListBlockProps): RawJsxNode {
	const model = createReportRankedListModel(items, selectedItemId);

	return RawReportBlock({
		...props,
		className: cx('pds-report-ranked-list', className),
		title,
		variant: 'chart',
		children: h(
			'div',
			{ className: 'pds-report-ranked-list__items' },
			model.items.map((item) =>
				h(
					'button',
					{
						'aria-pressed': item.selected,
						className: cx(
							'pds-report-ranked-list__item',
							item.selected && 'pds-report-ranked-list__item--selected',
						),
						key: item.id,
						onClick: () => onItemSelect?.(item),
						type: 'button',
					},
					h('span', {
						className: `pds-report-ranked-list__dot pds-report-ranked-list__dot--${item.tone ?? 'info'}`,
					}),
					h(
						'span',
						{ className: 'pds-report-ranked-list__copy' },
						h('strong', null, item.label),
						item.meta ? h('small', null, item.meta) : null,
					),
					h(
						'span',
						{ className: 'pds-report-ranked-list__track' },
						h('span', { style: { width: `${item.percent}%` } }),
					),
					h(
						'strong',
						{ className: 'pds-report-ranked-list__value' },
						item.valueLabel ?? formatValue(item.value),
					),
				),
			),
		),
	});
}

export interface RawReportTourCalloutProps extends RawHtmlProps {
	backLabel?: RawJsxNode;
	nextLabel?: RawJsxNode;
	onAction?: (
		action: 'back' | 'complete' | 'next' | 'skip',
		stepIndex: number,
	) => void;
	progressLabel?: RawJsxNode;
	skipLabel?: RawJsxNode;
	stepIndex?: number;
	steps: readonly ReportTourStep<RawJsxNode>[];
}

export function RawReportTourCallout({
	backLabel = 'Back',
	className,
	nextLabel = 'Next',
	onAction,
	progressLabel,
	skipLabel = 'Skip',
	stepIndex = 0,
	steps,
	...props
}: RawReportTourCalloutProps): RawJsxNode {
	const model = createReportTourModel(steps, { stepIndex });
	if (!model.activeStep) return null;

	return h(
		'div',
		{ className: cx('pds-report-tour-callout', className), ...props },
		h(
			'div',
			{ className: 'pds-report-tour-callout__topline' },
			rawBadge(
				progressLabel ??
					`Dashboard · ${String(model.stepIndex + 1).padStart(2, '0')}`,
				'brand',
			),
			h(
				'button',
				{ onClick: () => onAction?.('skip', model.stepIndex), type: 'button' },
				skipLabel,
			),
		),
		h(
			'div',
			{ className: 'pds-report-tour-callout__progress' },
			h('span', { style: { width: `${model.progressPercent}%` } }),
		),
		h(
			'div',
			{ className: 'pds-report-tour-callout__copy' },
			model.activeStep.kicker ? h('p', null, model.activeStep.kicker) : null,
			h('h3', null, model.activeStep.title),
			h('div', null, model.activeStep.body),
		),
		h(
			'div',
			{ className: 'pds-report-tour-callout__actions' },
			h(
				'button',
				{
					className: 'pds-button pds-button--ghost pds-button--md',
					disabled: model.isFirst,
					onClick: () =>
						onAction?.(
							'back',
							reduceReportTourState(
								{ stepIndex: model.stepIndex },
								{ type: 'back' },
								{ stepCount: model.stepCount },
							).stepIndex,
						),
					type: 'button',
				},
				h('span', { className: 'pds-button__label' }, backLabel),
			),
			h(
				'button',
				{
					className: 'pds-button pds-button--primary pds-button--md',
					onClick: () =>
						onAction?.(
							model.isLast ? 'complete' : 'next',
							reduceReportTourState(
								{ stepIndex: model.stepIndex },
								{ type: 'next' },
								{ stepCount: model.stepCount },
							).stepIndex,
						),
					type: 'button',
				},
				h(
					'span',
					{ className: 'pds-button__label' },
					model.isLast ? 'Done' : nextLabel,
				),
			),
		),
	);
}

export interface RawReportPlacementTableProps extends RawHtmlProps {
	onRowSelect?: (row: ReportPlacementRow<RawJsxNode>, index: number) => void;
	rows: readonly ReportPlacementRow<RawJsxNode>[];
	selectedRowId?: string;
	valueLabel?: RawJsxNode;
}

export function RawReportPlacementTable({
	className,
	onRowSelect,
	rows,
	selectedRowId,
	valueLabel = 'Reach',
	...props
}: RawReportPlacementTableProps): RawJsxNode {
	const model = createReportPlacementTableModel(rows, {
		selectable: Boolean(onRowSelect),
		selectedRowId,
	});

	return h(
		'div',
		{ className: cx('pds-report-placement-table', className), ...props },
		h(
			'table',
			null,
			h(
				'thead',
				null,
				h(
					'tr',
					null,
					h('th', { scope: 'col' }, 'Placement'),
					h('th', { scope: 'col' }, 'Region'),
					h('th', { scope: 'col' }, 'Format'),
					h('th', { scope: 'col' }, valueLabel),
					h('th', { scope: 'col' }, 'Pacing'),
					h('th', { scope: 'col' }, 'Status'),
				),
			),
			h(
				'tbody',
				null,
				model.rows.map((row, index) => {
					const sourceRow = rows[index];
					return h(
						'tr',
						{
							'aria-selected': row.selected ? true : undefined,
							className: cx(
								row.selectable && 'pds-report-placement-table__row--selectable',
								row.selected && 'pds-report-placement-table__row--selected',
							),
							key: row.key,
							onClick: () => {
								if (sourceRow) onRowSelect?.(sourceRow, index);
							},
							onKeyDown: (event: KeyboardEvent) => {
								if (!onRowSelect || !sourceRow) return;
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									onRowSelect(sourceRow, index);
								}
							},
							role: row.selectable ? 'button' : undefined,
							tabIndex: row.selectable ? 0 : undefined,
						},
						h(
							'td',
							null,
							h('strong', null, row.code),
							h('span', null, row.name),
						),
						h('td', null, row.region),
						h('td', null, row.format),
						h('td', null, row.value),
						h(
							'td',
							null,
							typeof row.pacingPercent === 'number'
								? h(
										'span',
										{ className: 'pds-report-placement-table__pacing' },
										h('span', { style: { width: `${row.pacingPercent}%` } }),
									)
								: null,
						),
						h('td', null, row.status),
					);
				}),
			),
		),
	);
}

export interface RawReportChartLoadingBlockProps
	extends Omit<RawReportBlockProps, 'children' | 'variant'> {
	motion?: RawReportLoaderMotion;
	rows?: number;
	shine?: boolean;
	variant?: 'bars' | 'line' | 'ranked';
}

export function RawReportChartLoadingBlock({
	className,
	motion = 'shimmer',
	rows = 6,
	shine = true,
	title = 'Loading report data',
	variant = 'bars',
	...props
}: RawReportChartLoadingBlockProps): RawJsxNode {
	return RawReportBlock({
		...props,
		className: cx(
			'pds-report-chart-loading',
			`pds-report-chart-loading--${variant}`,
			`pds-loader-motion--${motion}`,
			shine && 'pds-report-chart-loading--shine',
			className,
		),
		title,
		variant: 'chart',
		children: h(
			'div',
			{ className: 'pds-report-chart-loading__canvas' },
			variant === 'line'
				? h(
						'svg',
						{ 'aria-hidden': 'true', viewBox: '0 0 640 220' },
						h('path', {
							d: 'M 20 180 C 130 150 180 170 260 120 S 420 80 620 52',
						}),
						h('path', { d: 'M 20 190 H 620 M 20 140 H 620 M 20 90 H 620' }),
					)
				: variant === 'ranked'
					? h(
							'div',
							{ className: 'pds-report-chart-loading__ranked' },
							Array.from({ length: rows }, (_, index) =>
								h(
									'span',
									{ key: index },
									h('i'),
									h('strong', { style: { width: `${96 - index * 9}%` } }),
									h('small'),
								),
							),
						)
					: h(
							'div',
							{ className: 'pds-report-chart-loading__bars' },
							Array.from({ length: rows }, (_, index) =>
								h('span', {
									key: index,
									style: { height: `${26 + index * 9}%` },
								}),
							),
						),
		),
	});
}

export interface RawReportSectionLoadingStateProps extends RawHtmlProps {
	chartCount?: number;
	motion?: RawReportLoaderMotion;
	title?: RawJsxNode;
}

export function RawReportSectionLoadingState({
	chartCount = 2,
	className,
	motion = 'shimmer',
	title = 'Loading report section',
	...props
}: RawReportSectionLoadingStateProps): RawJsxNode {
	const chartVariants = ['bars', 'line', 'ranked'] as const;

	return h(
		'output',
		{
			'aria-busy': 'true',
			className: cx('pds-report-section-loader', className),
			...props,
		},
		h(
			'div',
			{ className: 'pds-report-section-loader__header' },
			h(
				'div',
				null,
				rawSkeleton({ height: '0.65rem', motion, width: '7rem' }),
				h('h3', null, title),
			),
			rawLoadingState('Processing', 'sm'),
		),
		h(
			'div',
			{ className: 'pds-report-section-loader__charts' },
			Array.from({ length: chartCount }, (_, index) =>
				RawReportChartLoadingBlock({
					key: index,
					motion,
					title: index === 0 ? 'Reach' : index === 1 ? 'VAC' : 'Frequency',
					variant: chartVariants[index % chartVariants.length],
				}),
			),
		),
	);
}

export interface RawReportPageLoadingStateProps extends RawHtmlProps {
	chartCount?: number;
	metricCount?: number;
	motion?: RawReportLoaderMotion;
	sectionCount?: number;
	title?: RawJsxNode;
}

export function RawReportPageLoadingState({
	chartCount = 3,
	className,
	metricCount = 6,
	motion = 'shimmer',
	sectionCount = 2,
	title = 'Loading report',
	...props
}: RawReportPageLoadingStateProps): RawJsxNode {
	const safeChartCount = Math.max(1, chartCount);
	const safeMetricCount = Math.max(1, metricCount);
	const safeSectionCount = Math.max(1, sectionCount);
	const chartsPerSection = Math.max(
		1,
		Math.ceil(safeChartCount / safeSectionCount),
	);

	return h(
		'output',
		{
			'aria-busy': 'true',
			'aria-live': 'polite',
			className: cx('pds-report-page-loader', className),
			...props,
		},
		h(
			'div',
			{ className: 'pds-report-page-loader__header' },
			h(
				'div',
				null,
				h(
					'span',
					{ className: 'pds-report-page-loader__eyebrow' },
					'Reporting',
				),
				h('h2', null, title),
			),
			rawLoadingState('Building insight blocks', 'sm'),
		),
		RawReportMetricRibbonLoading({
			count: safeMetricCount,
			motion,
		}),
		h(
			'div',
			{ className: 'pds-report-page-loader__summary' },
			rawCardLoadingState({ media: 'banner', motion, rows: 4 }),
			rawCardLoadingState({ motion, rows: 5 }),
		),
		Array.from({ length: safeSectionCount }, (_, index) =>
			RawReportSectionLoadingState({
				chartCount:
					index === safeSectionCount - 1
						? Math.max(1, safeChartCount - chartsPerSection * index)
						: chartsPerSection,
				key: index,
				motion,
				title: index === 0 ? 'Performance Trends' : 'Evidence And Placements',
			}),
		),
	);
}

export const ReportMetricTile = RawReportMetricTile;
export const ReportMetricRibbon = RawReportMetricRibbon;
export const ReportMetricRibbonLoading = RawReportMetricRibbonLoading;
export const ReportEvidenceList = RawReportEvidenceList;
export const ReportComparisonBlock = RawReportComparisonBlock;
export const ReportRankedListBlock = RawReportRankedListBlock;
export const ReportTourCallout = RawReportTourCallout;
export const ReportPlacementTable = RawReportPlacementTable;
export const ReportChartLoadingBlock = RawReportChartLoadingBlock;
export const ReportSectionLoadingState = RawReportSectionLoadingState;
export const ReportPageLoadingState = RawReportPageLoadingState;
