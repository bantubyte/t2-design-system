import {
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type OutputHTMLAttributes,
	type ReactNode,
	useState,
} from 'react';
import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import {
	createReportComparisonModel,
	createReportEvidenceModel,
	createReportPlacementTableModel,
	createReportRankedListModel,
	createReportTourModel,
	getInitialReportEvidenceState,
	getReportNumbers,
	getReportRange,
	reduceReportEvidenceState,
	reduceReportTourState,
} from '../report-core';
import { cx } from '../utils/class-names';
import { Badge, type BadgeTone } from './badge';
import { Button, type ButtonProps } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import {
	AreaChart as ChartAreaChart,
	BarList as ChartBarList,
	LineChart as ChartLineChart,
	PieChart as ChartPieChart,
	Sparkline as ChartSparkline,
} from './charts';
import {
	CardLoadingState,
	type LoaderMotion,
	LoadingState,
	Skeleton,
} from './feedback';

export type ReportTone = 'neutral' | 'good' | 'watch' | 'risk' | 'info';

const toneToBadgeTone: Record<ReportTone, BadgeTone> = {
	good: 'success',
	info: 'info',
	neutral: 'neutral',
	risk: 'danger',
	watch: 'warning',
};

export type ReportBlockVariant =
	| 'default'
	| 'metric'
	| 'chart'
	| 'evidence'
	| 'recommendation'
	| 'commentary'
	| 'comparison'
	| 'tour'
	| 'entity';

export interface ReportBlockProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	actions?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	footer?: ReactNode;
	interactive?: boolean;
	selected?: boolean;
	title?: ReactNode;
	tone?: ReportTone;
	variant?: ReportBlockVariant;
}

export function ReportBlock({
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
}: ReportBlockProps) {
	return (
		<Card
			className={cx(
				'pds-report-block',
				`pds-report-block--${variant}`,
				`pds-report-block--${tone}`,
				selected && 'pds-report-block--selected',
				className,
			)}
			interactive={interactive}
			{...props}
		>
			{eyebrow || title || description || actions ? (
				<CardHeader className="pds-report-block__header">
					<div>
						{eyebrow ? (
							<p className="pds-report-block__eyebrow">{eyebrow}</p>
						) : null}
						{title ? <CardTitle>{title}</CardTitle> : null}
						{description ? (
							<p className="pds-report-block__description">{description}</p>
						) : null}
					</div>
					{actions ? (
						<div className="pds-report-block__actions">{actions}</div>
					) : null}
				</CardHeader>
			) : null}
			<CardContent className="pds-report-block__content">
				{children}
			</CardContent>
			{footer ? <div className="pds-report-block__footer">{footer}</div> : null}
		</Card>
	);
}

export interface ReportBlockGridProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 1 | 2 | 3 | 4;
}

export function ReportBlockGrid({
	className,
	columns = 2,
	...props
}: ReportBlockGridProps) {
	return (
		<div
			className={cx(
				'pds-report-block-grid',
				`pds-report-block-grid--${columns}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface ReportMetricBlockProps
	extends Omit<ReportBlockProps, 'title' | 'variant'> {
	comparisonLabel?: ReactNode;
	definition?: ReactNode;
	delta?: ReactNode;
	forecast?: readonly (number | null | undefined)[];
	label: ReactNode;
	plan?: ReactNode;
	sparkline?: readonly (number | null | undefined)[];
	value: ReactNode;
}

export function ReportMetricBlock({
	className,
	comparisonLabel,
	definition,
	delta,
	forecast,
	label,
	plan,
	sparkline,
	tone = 'neutral',
	value,
	...props
}: ReportMetricBlockProps) {
	return (
		<ReportBlock
			className={cx('pds-report-metric-block', className)}
			tone={tone}
			variant="metric"
			{...props}
		>
			<div className="pds-report-metric-block__topline">
				<span>{label}</span>
				{delta ? (
					<Badge size="sm" tone={toneToBadgeTone[tone]}>
						{delta}
					</Badge>
				) : null}
			</div>
			<div className="pds-report-metric-block__value">{value}</div>
			{plan || comparisonLabel ? (
				<div className="pds-report-metric-block__meta">
					{plan ? <span>{plan}</span> : null}
					{comparisonLabel ? <strong>{comparisonLabel}</strong> : null}
				</div>
			) : null}
			{sparkline ? (
				<ReportSparkline forecast={forecast} values={sparkline} />
			) : null}
			{definition ? (
				<p className="pds-report-metric-block__definition">{definition}</p>
			) : null}
		</ReportBlock>
	);
}

export type ReportMetricAccent =
	| 'blue'
	| 'cyan'
	| 'green'
	| 'magenta'
	| 'orange'
	| 'red'
	| 'violet';

export interface ReportMetricTileProps
	extends Omit<
		ReportBlockProps,
		'actions' | 'children' | 'onSelect' | 'title' | 'variant'
	> {
	accent?: ReportMetricAccent;
	helpLabel?: string;
	icon?: ReactNode;
	id?: string;
	label: ReactNode;
	onInfoClick?: () => void;
	onSelect?: (id?: string) => void;
	sublabel?: ReactNode;
	value: ReactNode;
}

export function ReportMetricTile({
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
}: ReportMetricTileProps) {
	const interactive = Boolean(onSelect);

	return (
		<ReportBlock
			className={cx(
				'pds-report-metric-tile',
				`pds-report-metric-tile--${accent}`,
				className,
			)}
			interactive={interactive}
			onClick={() => onSelect?.(id)}
			onKeyDown={(event) => {
				if (!interactive) return;
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					onSelect?.(id);
				}
			}}
			role={interactive ? 'button' : undefined}
			selected={selected}
			tabIndex={interactive ? 0 : undefined}
			variant="metric"
			{...props}
		>
			<div className="pds-report-metric-tile__topline">
				<div>
					<span>{label}</span>
					{sublabel ? <small>{sublabel}</small> : null}
				</div>
				{icon ? (
					<span className="pds-report-metric-tile__icon">{icon}</span>
				) : null}
			</div>
			<div className="pds-report-metric-tile__value">{value}</div>
			{onInfoClick ? (
				<button
					aria-label={helpLabel}
					className="pds-report-metric-tile__info"
					onClick={(event) => {
						event.stopPropagation();
						onInfoClick();
					}}
					type="button"
				>
					i
				</button>
			) : null}
		</ReportBlock>
	);
}

export interface ReportMetricRibbonProps
	extends HTMLAttributes<HTMLDivElement> {
	highlighted?: boolean;
	tourAnchor?: 'bottom' | 'top';
}

export function ReportMetricRibbon({
	className,
	highlighted = false,
	tourAnchor,
	...props
}: ReportMetricRibbonProps) {
	return (
		<div
			className={cx(
				'pds-report-metric-ribbon',
				highlighted && 'pds-report-metric-ribbon--highlighted',
				tourAnchor && `pds-report-metric-ribbon--anchor-${tourAnchor}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface ReportMetricRibbonLoadingProps
	extends HTMLAttributes<HTMLDivElement> {
	count?: number;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
}

export function ReportMetricRibbonLoading({
	className,
	count = 6,
	motion = 'shimmer',
	...props
}: ReportMetricRibbonLoadingProps) {
	return (
		<ReportMetricRibbon
			className={cx(
				'pds-report-metric-ribbon--loading',
				`pds-loader-motion--${motion}`,
				className,
			)}
			{...props}
		>
			{Array.from({ length: count }, (_, index) => (
				<div
					className={cx(
						'pds-report-metric-tile-loading',
						`pds-loader-motion--${motion}`,
					)}
					key={index}
				>
					<span />
					<strong />
					<small />
				</div>
			))}
		</ReportMetricRibbon>
	);
}

export interface ReportTourStep {
	body: ReactNode;
	id: string;
	kicker?: ReactNode;
	title: ReactNode;
}

export interface ReportTourCalloutProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	backLabel?: ReactNode;
	defaultStepIndex?: number;
	nextLabel?: ReactNode;
	onComplete?: () => void;
	onSkip?: () => void;
	onStepChange?: (stepIndex: number, step: ReportTourStep) => void;
	progressLabel?: ReactNode;
	skipLabel?: ReactNode;
	stepIndex?: number;
	steps: readonly ReportTourStep[];
}

export function ReportTourCallout({
	backLabel = 'Back',
	className,
	defaultStepIndex = 0,
	nextLabel = 'Next',
	onComplete,
	onSkip,
	onStepChange,
	progressLabel,
	skipLabel = 'Skip',
	stepIndex,
	steps,
	...props
}: ReportTourCalloutProps) {
	const [uncontrolledStepIndex, setUncontrolledStepIndex] =
		useState(defaultStepIndex);
	const tourModel = createReportTourModel(steps, {
		stepIndex: stepIndex ?? uncontrolledStepIndex,
	});
	const activeStep = tourModel.activeStep;

	const setStep = (nextStepIndex: number) => {
		const nextState = reduceReportTourState(
			{ stepIndex: tourModel.stepIndex },
			{ stepIndex: nextStepIndex, type: 'go' },
			{ stepCount: steps.length },
		);
		if (stepIndex === undefined) {
			setUncontrolledStepIndex(nextState.stepIndex);
		}
		const nextStep = steps[nextState.stepIndex];
		if (nextStep) {
			onStepChange?.(nextState.stepIndex, nextStep);
		}
	};

	if (!activeStep) return null;

	return (
		<div className={cx('pds-report-tour-callout', className)} {...props}>
			<div className="pds-report-tour-callout__topline">
				<Badge tone="brand">
					{progressLabel ??
						`Dashboard · ${String(tourModel.stepIndex + 1).padStart(2, '0')}`}
				</Badge>
				<button onClick={onSkip} type="button">
					{skipLabel}
				</button>
			</div>
			<div className="pds-report-tour-callout__progress">
				<span style={{ width: `${tourModel.progressPercent}%` }} />
			</div>
			<div className="pds-report-tour-callout__copy">
				{activeStep.kicker ? <p>{activeStep.kicker}</p> : null}
				<h3>{activeStep.title}</h3>
				<div>{activeStep.body}</div>
			</div>
			<div className="pds-report-tour-callout__actions">
				<Button
					disabled={tourModel.isFirst}
					onClick={() => setStep(tourModel.stepIndex - 1)}
					variant="ghost"
				>
					{backLabel}
				</Button>
				<Button
					onClick={() => {
						if (tourModel.isLast) {
							onComplete?.();
							return;
						}
						setStep(tourModel.stepIndex + 1);
					}}
				>
					{tourModel.isLast ? 'Done' : nextLabel}
				</Button>
			</div>
		</div>
	);
}

export interface ReportEntityCardMetaItem {
	label: ReactNode;
	value: ReactNode;
}

export interface ReportEntityCardProps
	extends Omit<
		ReportBlockProps,
		'children' | 'description' | 'onSelect' | 'title' | 'variant'
	> {
	description?: ReactNode;
	id: string;
	meta?: readonly ReportEntityCardMetaItem[];
	onSelect?: (id: string) => void;
	score?: ReactNode;
	status?: ReactNode;
	title: ReactNode;
}

export function ReportEntityCard({
	className,
	description,
	id,
	meta = [],
	onSelect,
	score,
	selected = false,
	status,
	title,
	...props
}: ReportEntityCardProps) {
	const interactive = Boolean(onSelect);

	return (
		<ReportBlock
			className={cx('pds-report-entity-card', className)}
			interactive={interactive}
			onClick={() => onSelect?.(id)}
			onKeyDown={(event) => {
				if (!interactive) return;
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					onSelect?.(id);
				}
			}}
			role={interactive ? 'button' : undefined}
			selected={selected}
			tabIndex={interactive ? 0 : undefined}
			variant="entity"
			{...props}
		>
			<div className="pds-report-entity-card__header">
				<div>
					<h3>{title}</h3>
					{description ? <p>{description}</p> : null}
				</div>
				{status ? <Badge tone="info">{status}</Badge> : null}
			</div>
			{meta.length ? (
				<dl className="pds-report-entity-card__meta">
					{meta.map((item, index) => (
						<div key={index}>
							<dt>{item.label}</dt>
							<dd>{item.value}</dd>
						</div>
					))}
				</dl>
			) : null}
			{score ? (
				<strong className="pds-report-entity-card__score">{score}</strong>
			) : null}
		</ReportBlock>
	);
}

export interface ReportEmptyPanelProps
	extends Omit<ReportBlockProps, 'children' | 'variant'> {
	action?: ButtonProps;
	message?: ReactNode;
}

export function ReportEmptyPanel({
	action,
	className,
	message,
	title = 'No selection',
	...props
}: ReportEmptyPanelProps) {
	return (
		<ReportBlock
			className={cx('pds-report-empty-panel', className)}
			title={title}
			variant="entity"
			{...props}
		>
			{message ? <p>{message}</p> : null}
			{action ? <Button size="sm" {...action} /> : null}
		</ReportBlock>
	);
}

export type ReportChartLoadingVariant = 'bars' | 'line' | 'ranked';

export interface ReportChartLoadingBlockProps
	extends Omit<ReportBlockProps, 'children' | 'variant'> {
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	rows?: number;
	shine?: boolean;
	variant?: ReportChartLoadingVariant;
}

export function ReportChartLoadingBlock({
	className,
	motion = 'shimmer',
	rows = 6,
	shine = true,
	title = 'Loading report data',
	variant = 'bars',
	...props
}: ReportChartLoadingBlockProps) {
	return (
		<ReportBlock
			className={cx(
				'pds-report-chart-loading',
				`pds-report-chart-loading--${variant}`,
				`pds-loader-motion--${motion}`,
				shine && 'pds-report-chart-loading--shine',
				className,
			)}
			title={title}
			variant="chart"
			{...props}
		>
			<div className="pds-report-chart-loading__canvas">
				{variant === 'line' ? (
					<svg aria-hidden="true" viewBox="0 0 640 220">
						<path d="M 20 180 C 130 150 180 170 260 120 S 420 80 620 52" />
						<path d="M 20 190 H 620 M 20 140 H 620 M 20 90 H 620" />
					</svg>
				) : variant === 'ranked' ? (
					<div className="pds-report-chart-loading__ranked">
						{Array.from({ length: rows }, (_, index) => (
							<span key={index}>
								<i />
								<strong style={{ width: `${96 - index * 9}%` }} />
								<small />
							</span>
						))}
					</div>
				) : (
					<div className="pds-report-chart-loading__bars">
						{Array.from({ length: rows }, (_, index) => (
							<span key={index} style={{ height: `${26 + index * 9}%` }} />
						))}
					</div>
				)}
			</div>
		</ReportBlock>
	);
}

export interface ReportSectionLoadingStateProps
	extends Omit<OutputHTMLAttributes<HTMLOutputElement>, 'title'> {
	chartCount?: number;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	title?: ReactNode;
}

export function ReportSectionLoadingState({
	chartCount = 2,
	className,
	motion = 'shimmer',
	title = 'Loading report section',
	...props
}: ReportSectionLoadingStateProps) {
	return (
		<output
			aria-busy="true"
			className={cx('pds-report-section-loader', className)}
			{...props}
		>
			<div className="pds-report-section-loader__header">
				<div>
					<Skeleton height="0.65rem" motion={motion} width="7rem" />
					<h3>{title}</h3>
				</div>
				<LoadingState label="Processing" motion="orbit" size="sm" />
			</div>
			<div className="pds-report-section-loader__charts">
				{Array.from({ length: chartCount }, (_, index) => (
					<ReportChartLoadingBlock
						key={index}
						motion={motion}
						title={index === 0 ? 'Reach' : index === 1 ? 'VAC' : 'Frequency'}
						variant={
							index % 3 === 1 ? 'line' : index % 3 === 2 ? 'ranked' : 'bars'
						}
					/>
				))}
			</div>
		</output>
	);
}

export interface ReportPageLoadingStateProps
	extends Omit<OutputHTMLAttributes<HTMLOutputElement>, 'title'> {
	chartCount?: number;
	metricCount?: number;
	motion?: Extract<LoaderMotion, 'none' | 'pulse' | 'shimmer' | 'wave'>;
	sectionCount?: number;
	title?: ReactNode;
}

export function ReportPageLoadingState({
	chartCount = 3,
	className,
	metricCount = 6,
	motion = 'shimmer',
	sectionCount = 2,
	title = 'Loading report',
	...props
}: ReportPageLoadingStateProps) {
	const safeChartCount = Math.max(1, chartCount);
	const safeMetricCount = Math.max(1, metricCount);
	const safeSectionCount = Math.max(1, sectionCount);
	const chartsPerSection = Math.max(
		1,
		Math.ceil(safeChartCount / safeSectionCount),
	);

	return (
		<output
			aria-busy="true"
			aria-live="polite"
			className={cx('pds-report-page-loader', className)}
			{...props}
		>
			<div className="pds-report-page-loader__header">
				<div>
					<span className="pds-report-page-loader__eyebrow">Reporting</span>
					<h2>{title}</h2>
				</div>
				<LoadingState
					label="Building insight blocks"
					motion="orbit"
					size="sm"
				/>
			</div>
			<ReportMetricRibbonLoading count={safeMetricCount} motion={motion} />
			<div className="pds-report-page-loader__summary">
				<CardLoadingState media="banner" motion={motion} rows={4} />
				<CardLoadingState motion={motion} rows={5} />
			</div>
			{Array.from({ length: safeSectionCount }, (_, index) => (
				<ReportSectionLoadingState
					chartCount={
						index === safeSectionCount - 1
							? Math.max(1, safeChartCount - chartsPerSection * index)
							: chartsPerSection
					}
					key={index}
					motion={motion}
					title={index === 0 ? 'Performance Trends' : 'Evidence And Placements'}
				/>
			))}
		</output>
	);
}

export interface ReportRankedListItem {
	id: string;
	label: ReactNode;
	meta?: ReactNode;
	tone?: ReportTone;
	value: number;
	valueLabel?: ReactNode;
}

export interface ReportRankedListBlockProps
	extends Omit<ReportBlockProps, 'children' | 'variant'> {
	formatValue?: (value: number) => ReactNode;
	items: readonly ReportRankedListItem[];
	onItemSelect?: (item: ReportRankedListItem) => void;
	selectedItemId?: string;
}

export function ReportRankedListBlock({
	className,
	formatValue = (value) => value,
	items,
	onItemSelect,
	selectedItemId,
	title = 'Ranked list',
	...props
}: ReportRankedListBlockProps) {
	const rankedList = createReportRankedListModel(items, selectedItemId);

	return (
		<ReportBlock
			className={cx('pds-report-ranked-list', className)}
			title={title}
			variant="chart"
			{...props}
		>
			<div className="pds-report-ranked-list__items">
				{rankedList.items.map((item) => {
					const tone = item.tone ?? 'info';
					return (
						<button
							aria-pressed={item.selected}
							className={cx(
								'pds-report-ranked-list__item',
								item.selected && 'pds-report-ranked-list__item--selected',
							)}
							key={item.id}
							onClick={() => onItemSelect?.(item)}
							type="button"
						>
							<span
								className={`pds-report-ranked-list__dot pds-report-ranked-list__dot--${tone}`}
							/>
							<span className="pds-report-ranked-list__copy">
								<strong>{item.label}</strong>
								{item.meta ? <small>{item.meta}</small> : null}
							</span>
							<span className="pds-report-ranked-list__track">
								<span
									style={{
										width: `${item.percent}%`,
									}}
								/>
							</span>
							<strong className="pds-report-ranked-list__value">
								{item.valueLabel ?? formatValue(item.value)}
							</strong>
						</button>
					);
				})}
			</div>
		</ReportBlock>
	);
}

export interface ReportToggleOption<TValue extends string = string> {
	description?: ReactNode;
	disabled?: boolean;
	meta?: ReactNode;
	label: ReactNode;
	value: TValue;
}

export interface ReportToggleGroupProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	defaultValue?: TValue;
	label?: ReactNode;
	onValueChange?: (value: TValue) => void;
	options: readonly ReportToggleOption<TValue>[];
	value?: TValue;
}

export function ReportToggleGroup<TValue extends string = string>({
	className,
	defaultValue,
	label,
	onValueChange,
	options,
	value,
	...props
}: ReportToggleGroupProps<TValue>) {
	const [uncontrolledValue, setUncontrolledValue] = useState<
		TValue | undefined
	>(() => defaultValue ?? options.find((option) => !option.disabled)?.value);
	const activeValue = value ?? uncontrolledValue;

	const setValue = (nextValue: TValue) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<div className={cx('pds-report-toggle', className)} {...props}>
			{label ? <span className="pds-report-toggle__label">{label}</span> : null}
			<div className="pds-report-toggle__options">
				{options.map((option) => {
					const selected = option.value === activeValue;
					return (
						<button
							aria-pressed={selected}
							className={cx(
								'pds-report-toggle__option',
								selected && 'pds-report-toggle__option--selected',
							)}
							disabled={option.disabled}
							key={option.value}
							onClick={() => setValue(option.value)}
							type="button"
						>
							<strong>{option.label}</strong>
							{option.description || option.meta ? (
								<span>
									{option.description}
									{option.meta ? <em>{option.meta}</em> : null}
								</span>
							) : null}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export interface ReportActionCardProps
	extends Omit<ReportBlockProps, 'actions' | 'children' | 'variant'> {
	actionLabel?: ReactNode;
	actionProps?: ButtonHTMLAttributes<HTMLButtonElement>;
	body?: ReactNode;
	impact?: ReactNode;
	onAction?: () => void;
	status?: ReactNode;
}

export function ReportActionCard({
	actionLabel = 'Apply',
	actionProps,
	body,
	className,
	impact,
	onAction,
	status,
	tone = 'info',
	title,
	...props
}: ReportActionCardProps) {
	return (
		<ReportBlock
			actions={
				status ? (
					<Badge tone={toneToBadgeTone[tone]}>{status}</Badge>
				) : undefined
			}
			className={cx('pds-report-action-card', className)}
			title={title}
			tone={tone}
			variant="recommendation"
			{...props}
		>
			{body ? <p>{body}</p> : null}
			<div className="pds-report-action-card__footer">
				{impact ? <strong>{impact}</strong> : null}
				<Button
					size="sm"
					variant={tone === 'risk' ? 'danger' : 'primary'}
					{...actionProps}
					onClick={(event) => {
						actionProps?.onClick?.(event);
						onAction?.();
					}}
				>
					{actionLabel}
				</Button>
			</div>
		</ReportBlock>
	);
}

export interface ReportEvidenceItem {
	detail?: ReactNode;
	id: string;
	source?: ReactNode;
	title: ReactNode;
	tone?: ReportTone;
}

export interface ReportEvidenceListProps
	extends Omit<ReportBlockProps, 'children' | 'variant'> {
	defaultExpandedItemId?: string;
	expandedItemId?: string;
	items: readonly ReportEvidenceItem[];
	onExpandedItemChange?: (itemId: string) => void;
}

export function ReportEvidenceList({
	className,
	defaultExpandedItemId,
	expandedItemId,
	items,
	onExpandedItemChange,
	title = 'Evidence',
	...props
}: ReportEvidenceListProps) {
	const [uncontrolledExpandedItemId, setUncontrolledExpandedItemId] = useState<
		string | undefined
	>(
		() =>
			getInitialReportEvidenceState(items, defaultExpandedItemId)
				.expandedItemId,
	);
	const activeExpandedItemId = expandedItemId ?? uncontrolledExpandedItemId;
	const evidenceModel = createReportEvidenceModel(items, {
		expandedItemId: activeExpandedItemId,
	});

	const setExpandedItem = (itemId: string) => {
		const nextState = reduceReportEvidenceState(
			{ expandedItemId: activeExpandedItemId },
			{ itemId, type: 'toggle' },
		);
		if (expandedItemId === undefined) {
			setUncontrolledExpandedItemId(nextState.expandedItemId);
		}
		onExpandedItemChange?.(itemId);
	};

	return (
		<ReportBlock
			className={cx('pds-report-evidence-list', className)}
			title={title}
			variant="evidence"
			{...props}
		>
			<div className="pds-report-evidence-list__items">
				{evidenceModel.items.map((item) => {
					const tone = item.tone ?? 'info';
					return (
						<div
							className={cx(
								'pds-report-evidence-list__item',
								item.expanded && 'pds-report-evidence-list__item--expanded',
							)}
							key={item.id}
						>
							<button
								aria-expanded={item.expanded}
								onClick={() => setExpandedItem(item.id)}
								type="button"
							>
								<Badge size="sm" tone={toneToBadgeTone[tone]}>
									{tone}
								</Badge>
								<span>{item.title}</span>
							</button>
							{item.expanded ? (
								<div className="pds-report-evidence-list__detail">
									{item.detail ? <p>{item.detail}</p> : null}
									{item.source ? <small>{item.source}</small> : null}
								</div>
							) : null}
						</div>
					);
				})}
			</div>
		</ReportBlock>
	);
}

export interface ReportComparisonMetric {
	delta?: ReactNode;
	label: ReactNode;
	leftValue: number;
	rightValue: number;
	unit?: ReactNode;
	winner?: 'left' | 'right' | 'tie';
}

export interface ReportComparisonEntity {
	description?: ReactNode;
	id: string;
	label: ReactNode;
	meta?: ReactNode;
}

export interface ReportComparisonBlockProps
	extends Omit<ReportBlockProps, 'children' | 'variant'> {
	defaultWinner?: 'left' | 'right' | 'tie';
	left: ReportComparisonEntity;
	metrics: readonly ReportComparisonMetric[];
	onWinnerChange?: (winner: 'left' | 'right' | 'tie') => void;
	right: ReportComparisonEntity;
	winner?: 'left' | 'right' | 'tie';
}

export function ReportComparisonBlock({
	className,
	defaultWinner,
	left,
	metrics,
	onWinnerChange,
	right,
	title = 'Entity comparison',
	winner,
	...props
}: ReportComparisonBlockProps) {
	const computedWinner = createReportComparisonModel({
		defaultWinner,
		left,
		metrics,
		right,
		winner,
	}).winner;
	const [uncontrolledWinner, setUncontrolledWinner] = useState<
		'left' | 'right' | 'tie'
	>(() => computedWinner);
	const activeWinner = winner ?? uncontrolledWinner;
	const comparison = createReportComparisonModel({
		defaultWinner,
		left,
		metrics,
		right,
		winner: activeWinner,
	});

	const setWinner = (nextWinner: 'left' | 'right' | 'tie') => {
		if (winner === undefined) {
			setUncontrolledWinner(nextWinner);
		}
		onWinnerChange?.(nextWinner);
	};

	return (
		<ReportBlock
			actions={
				<Badge tone={comparison.winner === 'tie' ? 'neutral' : 'success'}>
					{comparison.winner === 'tie'
						? 'Tie'
						: `${
								comparison.winner === 'left' ? left.label : right.label
							} leads`}
				</Badge>
			}
			className={cx('pds-report-comparison', className)}
			title={title}
			variant="comparison"
			{...props}
		>
			<div className="pds-report-comparison__entities">
				{comparison.entities.map((entity) => {
					return (
						<button
							aria-pressed={entity.selected}
							className={cx(
								'pds-report-comparison__entity',
								entity.selected && 'pds-report-comparison__entity--selected',
							)}
							key={entity.id}
							onClick={() => setWinner(entity.side)}
							type="button"
						>
							<strong>{entity.label}</strong>
							{entity.description ? <span>{entity.description}</span> : null}
							{entity.meta ? <small>{entity.meta}</small> : null}
						</button>
					);
				})}
			</div>
			<div className="pds-report-comparison__metrics">
				{comparison.metrics.map((metric, index) => {
					return (
						<div className="pds-report-comparison__metric" key={index}>
							<div className="pds-report-comparison__metric-label">
								<strong>{metric.label}</strong>
								{metric.delta ? <span>{metric.delta}</span> : null}
							</div>
							<div className="pds-report-comparison__bars">
								<span
									className={cx(
										'pds-report-comparison__bar',
										metric.winner === 'left' &&
											'pds-report-comparison__bar--winner',
									)}
								>
									<span
										style={{
											width: `${metric.leftPercent}%`,
										}}
									/>
									<strong>
										{metric.leftValue}
										{metric.unit}
									</strong>
								</span>
								<span
									className={cx(
										'pds-report-comparison__bar',
										metric.winner === 'right' &&
											'pds-report-comparison__bar--winner',
									)}
								>
									<span
										style={{
											width: `${metric.rightPercent}%`,
										}}
									/>
									<strong>
										{metric.rightValue}
										{metric.unit}
									</strong>
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</ReportBlock>
	);
}

const getNumbers = getReportNumbers;
const getRange = getReportRange;

const reportNodeToText = (value: ReactNode): string => {
	if (typeof value === 'string' || typeof value === 'number') {
		return String(value);
	}
	return '';
};

export interface ReportShellProps extends HTMLAttributes<HTMLDivElement> {
	footer?: ReactNode;
	header?: ReactNode;
}

export function ReportShell({
	children,
	className,
	footer,
	header,
	...props
}: ReportShellProps) {
	return (
		<div className={cx('pds-report-shell', className)} {...props}>
			{header ? <div className="pds-report-shell__header">{header}</div> : null}
			<div className="pds-report-shell__body">{children}</div>
			{footer ? <div className="pds-report-shell__footer">{footer}</div> : null}
		</div>
	);
}

export interface ReportMetadataItem {
	label: ReactNode;
	value: ReactNode;
}

export interface ReportExportHeaderProps
	extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	actions?: ReactNode;
	eyebrow?: ReactNode;
	metadata?: readonly ReportMetadataItem[];
	productName?: ReactNode;
	subtitle?: ReactNode;
	title: ReactNode;
}

export function ReportExportHeader({
	actions,
	className,
	eyebrow,
	metadata = [],
	productName,
	subtitle,
	title,
	...props
}: ReportExportHeaderProps) {
	return (
		<header className={cx('pds-report-header', className)} {...props}>
			<div className="pds-report-header__main">
				<div>
					{eyebrow ? (
						<p className="pds-report-header__eyebrow">{eyebrow}</p>
					) : null}
					<h1>{title}</h1>
					{subtitle ? (
						<p className="pds-report-header__subtitle">{subtitle}</p>
					) : null}
				</div>
				{productName ? (
					<div className="pds-report-header__brand">{productName}</div>
				) : null}
			</div>
			{metadata.length || actions ? (
				<div className="pds-report-header__meta-row">
					{metadata.length ? (
						<dl className="pds-report-header__metadata">
							{metadata.map((item, index) => (
								<div key={index}>
									<dt>{item.label}</dt>
									<dd>{item.value}</dd>
								</div>
							))}
						</dl>
					) : null}
					{actions ? (
						<div className="pds-report-header__actions">{actions}</div>
					) : null}
				</div>
			) : null}
		</header>
	);
}

export interface ReportSectionProps
	extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	actions?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	title: ReactNode;
}

export function ReportSection({
	actions,
	children,
	className,
	description,
	eyebrow,
	title,
	...props
}: ReportSectionProps) {
	return (
		<section className={cx('pds-report-section', className)} {...props}>
			<div className="pds-report-section__header">
				<div>
					{eyebrow ? <p>{eyebrow}</p> : null}
					<h2>{title}</h2>
					{description ? <span>{description}</span> : null}
				</div>
				{actions ? <div>{actions}</div> : null}
			</div>
			{children}
		</section>
	);
}

export interface ReportSparklineProps extends HTMLAttributes<SVGElement> {
	forecast?: readonly (number | null | undefined)[];
	height?: number;
	values: readonly (number | null | undefined)[];
	width?: number;
}

export function ReportSparkline({
	className,
	forecast,
	height = 32,
	values,
	width = 112,
	...props
}: ReportSparklineProps) {
	return (
		<ChartSparkline
			aria-hidden
			className={cx('pds-report-sparkline', className)}
			forecast={forecast}
			height={height}
			values={values}
			width={width}
			{...(props as HTMLAttributes<HTMLDivElement>)}
		/>
	);
}

export interface ReportKpiTileProps extends HTMLAttributes<HTMLDivElement> {
	definition?: ReactNode;
	delta?: ReactNode;
	forecast?: readonly (number | null | undefined)[];
	label: ReactNode;
	plan?: ReactNode;
	sparkline?: readonly (number | null | undefined)[];
	tone?: ReportTone;
	value: ReactNode;
}

export function ReportKpiTile({
	className,
	definition,
	delta,
	forecast,
	label,
	plan,
	sparkline,
	tone = 'neutral',
	value,
	...props
}: ReportKpiTileProps) {
	return (
		<Card
			className={cx('pds-report-kpi', `pds-report-kpi--${tone}`, className)}
			{...props}
		>
			<div className="pds-report-kpi__topline">
				<span>{label}</span>
				{delta ? (
					<Badge size="sm" tone={toneToBadgeTone[tone]}>
						{delta}
					</Badge>
				) : null}
			</div>
			<div className="pds-report-kpi__value">{value}</div>
			{plan ? <p className="pds-report-kpi__plan">{plan}</p> : null}
			{sparkline ? (
				<ReportSparkline forecast={forecast} values={sparkline} />
			) : null}
			{definition ? (
				<p className="pds-report-kpi__definition">{definition}</p>
			) : null}
		</Card>
	);
}

export interface ReportKpiStripProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 3 | 4 | 6;
}

export function ReportKpiStrip({
	className,
	columns = 6,
	...props
}: ReportKpiStripProps) {
	return (
		<div
			className={cx(
				'pds-report-kpi-strip',
				`pds-report-kpi-strip--${columns}`,
				className,
			)}
			{...props}
		/>
	);
}

export interface ReportTrendChartProps extends HTMLAttributes<HTMLDivElement> {
	actual: readonly (number | null | undefined)[];
	forecast?: readonly (number | null | undefined)[];
	formatValue?: (value: number) => ReactNode;
	label?: ReactNode;
}

export function ReportTrendChart({
	actual,
	className,
	forecast,
	formatValue = (value) => value,
	label,
	...props
}: ReportTrendChartProps) {
	const allValues = [...actual, ...(forecast ?? [])];
	const { max } = getRange(allValues);
	const actualNumbers = getNumbers(actual);
	const lastActual = actualNumbers[actualNumbers.length - 1];
	const chartData = Array.from(
		{ length: Math.max(actual.length, forecast?.length ?? 0) },
		(_, index) => ({
			actual: actual[index],
			forecast: forecast?.[index],
			index: index + 1,
		}),
	);
	const formatChartValue = (value: unknown) =>
		typeof value === 'number' ? reportNodeToText(formatValue(value)) : '';

	return (
		<Card className={cx('pds-report-trend', className)} {...props}>
			<CardHeader>
				<CardTitle>{label}</CardTitle>
				{lastActual != null ? (
					<Badge tone="brand">{formatValue(lastActual)}</Badge>
				) : null}
			</CardHeader>
			<CardContent>
				<ChartLineChart
					ariaLabel={typeof label === 'string' ? label : 'Report trend chart'}
					className="pds-report-trend__chart"
					data={chartData}
					height={220}
					series={[
						{ key: 'actual', label: 'Actual' },
						...(forecast
							? [{ key: 'forecast', label: 'Forecast', strokeDasharray: '8 6' }]
							: []),
					]}
					showLegend={false}
					xKey="index"
					yFormat={formatChartValue}
				/>
				<div className="pds-report-trend__legend">
					<span>Actual</span>
					{forecast ? <span>Forecast</span> : null}
					<span>Scale max {formatValue(max)}</span>
				</div>
			</CardContent>
		</Card>
	);
}

export interface ReportBarListItem {
	label: ReactNode;
	meta?: ReactNode;
	tone?: ReportTone;
	value: number;
}

export interface ReportBarListProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	formatValue?: (value: number) => ReactNode;
	items: readonly ReportBarListItem[];
	title?: ReactNode;
}

export function ReportBarList({
	className,
	formatValue = (value) => value,
	items,
	title,
	...props
}: ReportBarListProps) {
	return (
		<Card className={cx('pds-report-bar-list', className)} {...props}>
			{title ? (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				<ChartBarList
					ariaLabel={typeof title === 'string' ? title : 'Report bar list'}
					formatValue={(value) =>
						typeof value === 'number'
							? reportNodeToText(formatValue(value))
							: String(value ?? '')
					}
					items={items}
				/>
			</CardContent>
		</Card>
	);
}

export interface ReportDonutSegment {
	label: ReactNode;
	value: number;
}

export interface ReportDonutProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	centerLabel?: ReactNode;
	segments: readonly ReportDonutSegment[];
	title?: ReactNode;
}

export function ReportDonut({
	centerLabel,
	className,
	segments,
	title,
	...props
}: ReportDonutProps) {
	const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
	const chartData = segments.map((segment, index) => ({
		label: reportNodeToText(segment.label) || `Segment ${index + 1}`,
		value: segment.value,
	}));

	return (
		<Card className={cx('pds-report-donut', className)} {...props}>
			{title ? (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				<div className="pds-report-donut__layout">
					<ChartPieChart
						ariaLabel={typeof title === 'string' ? title : 'Report donut chart'}
						centerLabel={reportNodeToText(centerLabel)}
						className="pds-report-donut__chart"
						data={chartData}
						height={150}
						nameKey="label"
						showLegend={false}
						valueKey="value"
						variant="donut"
					/>
					<div className="pds-report-donut__legend">
						{segments.map((segment, index) => (
							<div key={index}>
								<span
									className={`pds-report-donut__dot pds-report-donut__dot--${index + 1}`}
								/>
								<span>{segment.label}</span>
								<strong>{Math.round((segment.value / total) * 100)}%</strong>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export interface ReportEvidencePanelProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	confidence?: ReactNode;
	items: readonly ReactNode[];
	source?: ReactNode;
	title?: ReactNode;
}

export function ReportEvidencePanel({
	className,
	confidence,
	items,
	source,
	title = 'Evidence',
	...props
}: ReportEvidencePanelProps) {
	return (
		<Card
			className={cx('pds-report-evidence', className)}
			tone="muted"
			{...props}
		>
			<CardHeader>
				<div className="pds-report-evidence__header">
					<CardTitle>{title}</CardTitle>
					{confidence ? <Badge tone="info">{confidence}</Badge> : null}
				</div>
			</CardHeader>
			<CardContent>
				<ul>
					{items.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
				{source ? (
					<p className="pds-report-evidence__source">{source}</p>
				) : null}
			</CardContent>
		</Card>
	);
}

export interface ReportInsightCalloutProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	action?: ButtonProps;
	evidence?: ReactNode;
	title: ReactNode;
	tone?: ReportTone;
}

export function ReportInsightCallout({
	action,
	children,
	className,
	evidence,
	title,
	tone = 'info',
	...props
}: ReportInsightCalloutProps) {
	return (
		<Card
			className={cx(
				'pds-report-insight',
				`pds-report-insight--${tone}`,
				className,
			)}
			{...props}
		>
			<CardContent>
				<div className="pds-report-insight__body">
					<Badge tone={toneToBadgeTone[tone]}>{tone}</Badge>
					<div>
						<h3>{title}</h3>
						{children ? <div>{children}</div> : null}
						{evidence ? <p>{evidence}</p> : null}
					</div>
				</div>
				{action ? (
					<div className="pds-report-insight__action">
						<Button size="sm" variant="outline" {...action} />
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

export interface ReportRecommendationCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	impact?: ReactNode;
	primaryAction?: ButtonProps;
	recommendation: ReactNode;
	title: ReactNode;
}

export function ReportRecommendationCard({
	className,
	impact,
	primaryAction,
	recommendation,
	title,
	...props
}: ReportRecommendationCardProps) {
	return (
		<Card className={cx('pds-report-recommendation', className)} {...props}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{impact ? <Badge tone="success">{impact}</Badge> : null}
			</CardHeader>
			<CardContent>
				<p>{recommendation}</p>
				{primaryAction ? <Button size="sm" {...primaryAction} /> : null}
			</CardContent>
		</Card>
	);
}

export interface ReportCommentaryProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	byline?: ReactNode;
	title?: ReactNode;
}

export function ReportCommentary({
	byline,
	children,
	className,
	title,
	...props
}: ReportCommentaryProps) {
	return (
		<aside className={cx('pds-report-commentary', className)} {...props}>
			{title ? <h3>{title}</h3> : null}
			<div>{children}</div>
			{byline ? <p>{byline}</p> : null}
		</aside>
	);
}

export interface ReportPlacementRow {
	code: ReactNode;
	format?: ReactNode;
	id?: string;
	name: ReactNode;
	pacing?: number;
	region?: ReactNode;
	status?: ReactNode;
	value: ReactNode;
}

export interface ReportPlacementTableProps
	extends HTMLAttributes<HTMLDivElement> {
	onRowSelect?: (row: ReportPlacementRow, index: number) => void;
	rows: readonly ReportPlacementRow[];
	selectedRowId?: string;
	valueLabel?: ReactNode;
}

export function ReportPlacementTable({
	className,
	onRowSelect,
	rows,
	selectedRowId,
	valueLabel = 'Reach',
	...props
}: ReportPlacementTableProps) {
	const tableModel = createReportPlacementTableModel(rows, {
		selectable: Boolean(onRowSelect),
		selectedRowId,
	});

	return (
		<div className={cx('pds-report-placement-table', className)} {...props}>
			<table>
				<thead>
					<tr>
						<th scope="col">Placement</th>
						<th scope="col">Region</th>
						<th scope="col">Format</th>
						<th scope="col">{valueLabel}</th>
						<th scope="col">Pacing</th>
						<th scope="col">Status</th>
					</tr>
				</thead>
				<tbody>
					{tableModel.rows.map((row, index) => (
						// biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-pressed is only set when role="button" is also set on this row.
						<tr
							aria-pressed={onRowSelect ? Boolean(row.selected) : undefined}
							className={cx(
								row.selectable && 'pds-report-placement-table__row--selectable',
								row.selected && 'pds-report-placement-table__row--selected',
							)}
							key={row.key}
							onClick={() => onRowSelect?.(row, index)}
							onKeyDown={(event) => {
								if (!onRowSelect) return;
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									onRowSelect(row, index);
								}
							}}
							role={onRowSelect ? 'button' : undefined}
							tabIndex={onRowSelect ? 0 : undefined}
						>
							<td>
								<strong>{row.code}</strong>
								<span>{row.name}</span>
							</td>
							<td>{row.region}</td>
							<td>{row.format}</td>
							<td>{row.value}</td>
							<td>
								{typeof row.pacingPercent === 'number' ? (
									<span className="pds-report-placement-table__pacing">
										<span
											style={{
												width: `${row.pacingPercent}%`,
											}}
										/>
									</span>
								) : null}
							</td>
							<td>{row.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export interface ReportSourceFooterProps extends HTMLAttributes<HTMLElement> {
	items?: readonly ReportMetadataItem[];
	left?: ReactNode;
	right?: ReactNode;
}

export function ReportSourceFooter({
	className,
	items = [],
	left,
	right,
	...props
}: ReportSourceFooterProps) {
	return (
		<footer className={cx('pds-report-source-footer', className)} {...props}>
			<div>
				{left ? <strong>{left}</strong> : null}
				{items.length ? (
					<dl>
						{items.map((item, index) => (
							<div key={index}>
								<dt>{item.label}</dt>
								<dd>{item.value}</dd>
							</div>
						))}
					</dl>
				) : null}
			</div>
			{right ? <span>{right}</span> : null}
		</footer>
	);
}

export interface ReportAreaChartItem {
	label: string;
	value: number | null | undefined;
}

export interface ReportAreaChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	formatValue?: (value: number) => ReactNode;
	items: readonly ReportAreaChartItem[];
	title?: ReactNode;
}

export function ReportAreaChart({
	className,
	formatValue = (value) => value,
	items,
	title,
	...props
}: ReportAreaChartProps) {
	const chartData = items.map((item) => ({
		label: item.label,
		value: item.value,
	}));
	const formatChartValue = (value: unknown) =>
		typeof value === 'number' ? reportNodeToText(formatValue(value)) : '';

	return (
		<Card className={cx('pds-report-area-chart', className)} {...props}>
			{title ? (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				<ChartAreaChart
					ariaLabel={typeof title === 'string' ? title : 'Report area chart'}
					className="pds-report-area-chart__chart"
					data={chartData}
					height={220}
					series={[
						{
							key: 'value',
							label: typeof title === 'string' ? title : 'Value',
						},
					]}
					showLegend={false}
					xKey="label"
					yFormat={formatChartValue}
				/>
			</CardContent>
		</Card>
	);
}

export interface ReportActualForecastChartItem {
	actual: number | null | undefined;
	forecast: number | null | undefined;
	fullDate?: string;
	label: string;
}

export interface ReportActualForecastChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	formatValue?: (value: number) => ReactNode;
	items: readonly ReportActualForecastChartItem[];
	title?: ReactNode;
}

const ACTUAL_GRADIENT_ID = 'pds-actual-gradient';
const ACTUAL_COLOR = '#7B8FE4';
const FORECAST_COLOR = '#5B6FD4';
const AREA_THRESHOLD = 14;

function formatAxisTick(value: unknown): string {
	if (typeof value !== 'number') return String(value);
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
	return value.toFixed(0);
}

export function ReportActualForecastChart({
	className,
	formatValue = (value) => value,
	items,
	title,
	...props
}: ReportActualForecastChartProps) {
	const useArea = items.length >= AREA_THRESHOLD;

	return (
		<Card className={cx('pds-report-actual-forecast', className)} {...props}>
			{title ? (
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold">{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent className="px-2 pb-4">
				<ResponsiveContainer height={260} width="100%">
					<ComposedChart
						data={items as unknown as Record<string, unknown>[]}
						margin={{ bottom: 8, left: 0, right: 8, top: 8 }}
					>
						<defs>
							<linearGradient
								id={ACTUAL_GRADIENT_ID}
								x1="0"
								x2="0"
								y1="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor={ACTUAL_COLOR}
									stopOpacity={useArea ? 0.75 : 0.85}
								/>
								<stop
									offset="100%"
									stopColor={ACTUAL_COLOR}
									stopOpacity={useArea ? 0.15 : 0.2}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							stroke="#e5e7eb"
							strokeDasharray="4 6"
							vertical={false}
						/>
						<XAxis
							axisLine={false}
							dataKey="label"
							tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
							tickLine={false}
						/>
						<YAxis
							axisLine={false}
							tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
							tickFormatter={formatAxisTick}
							tickLine={false}
							width={48}
						/>
						<Tooltip
							formatter={(value: number | string, name: string) => [
								typeof value === 'number'
									? reportNodeToText(formatValue(value))
									: String(value),
								name === 'actual' ? 'Actual' : 'Forecast',
							]}
							labelStyle={{ fontWeight: 600 }}
						/>
						{useArea ? (
							<Area
								dataKey="actual"
								dot={false}
								fill={`url(#${ACTUAL_GRADIENT_ID})`}
								name="actual"
								stroke={ACTUAL_COLOR}
								strokeWidth={2}
								type="monotone"
							/>
						) : (
							<Bar
								barSize={12}
								dataKey="actual"
								fill={`url(#${ACTUAL_GRADIENT_ID})`}
								name="actual"
								radius={[4, 4, 0, 0]}
							/>
						)}
						<Line
							activeDot={{
								cursor: 'pointer',
								fill: FORECAST_COLOR,
								r: 5,
								stroke: '#f5c842',
								strokeWidth: 2.5,
							}}
							dataKey="forecast"
							dot={{
								fill: FORECAST_COLOR,
								r: 3.5,
								stroke: FORECAST_COLOR,
								strokeWidth: 0,
							}}
							name="forecast"
							stroke={FORECAST_COLOR}
							strokeDasharray="5 4"
							strokeWidth={2}
							type="monotone"
						/>
					</ComposedChart>
				</ResponsiveContainer>
				<div className="mt-2 flex items-center justify-center gap-6">
					<div className="flex items-center gap-1.5">
						<span
							className="inline-block h-3 w-4 rounded-sm"
							style={{ background: ACTUAL_COLOR, opacity: 0.7 }}
						/>
						<span className="text-xs font-medium text-gray-600">Actual</span>
					</div>
					<div className="flex items-center gap-1.5">
						<svg height="12" width="22">
							<line
								stroke={FORECAST_COLOR}
								strokeDasharray="4 3"
								strokeWidth="2"
								x1="0"
								x2="22"
								y1="6"
								y2="6"
							/>
							<circle
								cx="11"
								cy="6"
								fill={FORECAST_COLOR}
								r="3.5"
								stroke="none"
							/>
						</svg>
						<span className="text-xs font-medium text-gray-600">Forecast</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export interface ReportSiteBarListItem {
	color?: string;
	id: string;
	label: ReactNode;
	value: number;
}

export interface ReportSiteBarListProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	formatValue?: (value: number) => ReactNode;
	items: readonly ReportSiteBarListItem[];
	title?: ReactNode;
}

// ---------------------------------------------------------------------------
// Insights page skeleton components
// ---------------------------------------------------------------------------

const INSIGHTS_CHART_BAR_HEIGHTS = [48, 65, 38, 80, 55, 72] as const;

export interface InsightsChartLoadingCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	title?: ReactNode;
}

export function InsightsChartLoadingCard({
	className,
	title,
	...props
}: InsightsChartLoadingCardProps) {
	return (
		<Card
			className={cx(
				'rounded-2xl border border-pikaboo-purple/10 bg-white/90 shadow-pikaboo-card',
				className,
			)}
			{...props}
		>
			{title ? (
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold text-pikaboo-slate">
						{title}
					</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				<div className="relative h-[260px] overflow-hidden rounded-2xl border border-pikaboo-purple/10 bg-pikaboo-purple/5">
					<div className="p-6">
						<div className="flex items-center gap-2">
							<Skeleton
								height="0.5rem"
								style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
								width="2.5rem"
							/>
							<Skeleton
								height="0.5rem"
								style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
								width="4rem"
							/>
						</div>
						<div
							className="mt-6 grid items-end gap-2"
							style={{ gridTemplateColumns: 'repeat(6, 1fr)', height: 170 }}
						>
							{INSIGHTS_CHART_BAR_HEIGHTS.map((barHeight, index) => (
								<Skeleton
									key={index}
									radius="lg"
									style={{
										backgroundColor: 'rgba(255,255,255,0.8)',
										height: `${barHeight}%`,
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function InsightsCampaignSummaryLoading({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx(
				'flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between',
				className,
			)}
			{...props}
		>
			<div className="space-y-3">
				<Skeleton height="0.75rem" width="6rem" />
				<Skeleton height="2rem" width="12rem" />
				<Skeleton height="1rem" width="10rem" />
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{[0, 1, 2].map((i) => (
					<div
						className="rounded-2xl border border-pikaboo-purple/10 bg-pikaboo-purple/5 px-4 py-3"
						key={i}
					>
						<Skeleton height="0.75rem" width="5rem" />
						<Skeleton className="mt-2" height="1.5rem" width="4rem" />
					</div>
				))}
			</div>
		</div>
	);
}

export interface InsightsAiInsightsLoadingProps
	extends HTMLAttributes<HTMLDivElement> {
	count?: number;
}

export function InsightsAiInsightsLoading({
	className,
	count = 2,
	...props
}: InsightsAiInsightsLoadingProps) {
	return (
		<div className={cx('space-y-3', className)} {...props}>
			{Array.from({ length: count }, (_, i) => (
				<div
					className="rounded-xl border border-pikaboo-purple/10 bg-white/80 p-4"
					key={i}
				>
					<Skeleton height="0.75rem" width="4rem" />
					<Skeleton className="mt-3" height="1rem" width="100%" />
					<Skeleton className="mt-2" height="1rem" width="75%" />
				</div>
			))}
		</div>
	);
}

export function InsightsPageLoading({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cx('flex-1 overflow-auto', className)} {...props}>
			<header className="sticky top-0 z-40 border-b border-pikaboo-purple/10 bg-white/95 backdrop-blur">
				<div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-pikaboo-purple/70">
							Enhanced Ads Reporting
						</p>
						<Skeleton height="2rem" width="6rem" />
						<Skeleton height="1rem" width="16rem" />
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex h-10 w-[220px] items-center justify-between rounded-xl border border-pikaboo-purple/20 bg-white/80 px-3 shadow-sm">
							<span className="text-sm text-slate-400">Select Campaign</span>
							<Skeleton height="1rem" width="1rem" />
						</div>
						<div className="flex h-10 w-[220px] items-center gap-2 rounded-xl border border-pikaboo-purple/20 bg-white/80 px-3 shadow-sm">
							<Skeleton height="1rem" radius="full" width="1rem" />
							<span className="text-sm text-slate-400">Date Range</span>
						</div>
						<div className="flex h-10 items-center gap-2 rounded-xl bg-pikaboo-purple px-4 opacity-60 shadow-sm">
							<Skeleton
								height="1rem"
								style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
								width="1rem"
							/>
							<span className="text-sm font-medium text-white">
								Export to Excel
							</span>
						</div>
					</div>
				</div>
			</header>
			<main className="space-y-8 px-6 pb-10 pt-6">
				<section className="space-y-4">
					<div>
						<Skeleton height="1.5rem" width="11rem" />
						<Skeleton className="mt-1" height="1rem" width="16rem" />
					</div>
					<div className="rounded-2xl border border-pikaboo-purple/10 bg-white/90 p-6 shadow-sm">
						<InsightsCampaignSummaryLoading />
					</div>
				</section>
				<section className="space-y-4">
					<div>
						<Skeleton height="1.5rem" width="7rem" />
						<Skeleton className="mt-1" height="1rem" width="18rem" />
					</div>
					<div className="rounded-2xl border border-pikaboo-purple/10 bg-white/90 p-6 shadow-sm">
						<InsightsAiInsightsLoading />
					</div>
				</section>
				<section className="space-y-4">
					<div>
						<Skeleton height="1.5rem" width="8rem" />
						<Skeleton className="mt-1" height="1rem" width="16rem" />
					</div>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
						{['Reach', 'VAC', 'Reach %', 'Avg Freq', 'CPT', 'GRP'].map(
							(metric) => (
								<div
									className="rounded-2xl border border-pikaboo-purple/10 bg-white/90 p-4 shadow-sm"
									key={metric}
								>
									<span className="text-sm text-slate-500">{metric}</span>
									<Skeleton className="mt-2" height="2rem" width="5rem" />
									<Skeleton className="mt-1" height="0.75rem" width="4rem" />
								</div>
							),
						)}
					</div>
				</section>
				<section className="space-y-4">
					<div>
						<Skeleton height="1.5rem" width="11rem" />
						<Skeleton className="mt-1" height="1rem" width="18rem" />
					</div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{['Reach', 'VAC', 'Average Frequency'].map((chart) => (
							<InsightsChartLoadingCard key={chart} title={chart} />
						))}
					</div>
				</section>
				<section className="space-y-4">
					<div>
						<Skeleton height="1.5rem" width="11rem" />
						<Skeleton className="mt-1" height="1rem" width="16rem" />
					</div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{['Reach', 'VAC', 'Reach %', 'Avg Frequency'].map((metric) => (
							<InsightsChartLoadingCard key={metric} title={metric} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
}

export function ReportSiteBarList({
	className,
	formatValue = (value) => value,
	items,
	title,
	...props
}: ReportSiteBarListProps) {
	const sorted = [...items].sort((a, b) => b.value - a.value);
	const max = Math.max(...items.map((i) => i.value), 1);

	return (
		<Card className={cx('pds-report-site-bar-list', className)} {...props}>
			{title ? (
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold">{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent className="px-4 pb-4">
				<div
					className="flex flex-col gap-3 overflow-y-auto pr-3 [scrollbar-color:theme(colors.gray.300)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
					style={{ maxHeight: 320 }}
				>
					{sorted.map((item) => (
						<div
							className="flex flex-col gap-1.5"
							data-testid="site-bar-item"
							key={item.id}
						>
							<div className="flex items-center justify-between gap-2">
								<span
									className="truncate text-sm text-gray-600"
									data-testid="site-bar-label"
									title={
										typeof item.label === 'string' ? item.label : undefined
									}
								>
									{item.label}
								</span>
								<span className="shrink-0 text-sm font-medium text-gray-700">
									{formatValue(item.value)}
								</span>
							</div>
							<div
								className="w-full overflow-hidden rounded-full bg-gray-200"
								style={{ height: 14 }}
							>
								<div
									className="h-full rounded-full transition-all"
									style={{
										backgroundColor:
											item.color ?? 'var(--pds-color-primary-500)',
										opacity: 0.85,
										width: `${((item.value / max) * 100).toFixed(1)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
