import {
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type OutputHTMLAttributes,
	type ReactNode,
	useState,
} from 'react';
import {
	createReportComparisonModel,
	createReportEvidenceModel,
	createReportPlacementTableModel,
	createReportRankedListModel,
	createReportSeriesPath,
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
const pointsToPath = createReportSeriesPath;

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
	const actualPath = pointsToPath(values, width, height);
	const forecastPath = forecast ? pointsToPath(forecast, width, height) : '';

	return (
		<svg
			aria-hidden="true"
			className={cx('pds-report-sparkline', className)}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			{...props}
		>
			{forecastPath ? (
				<path className="pds-report-sparkline__forecast" d={forecastPath} />
			) : null}
			{actualPath ? (
				<path className="pds-report-sparkline__actual" d={actualPath} />
			) : null}
		</svg>
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

	return (
		<Card className={cx('pds-report-trend', className)} {...props}>
			<CardHeader>
				<CardTitle>{label}</CardTitle>
				{lastActual != null ? (
					<Badge tone="brand">{formatValue(lastActual)}</Badge>
				) : null}
			</CardHeader>
			<CardContent>
				<div className="pds-report-trend__chart">
					<svg preserveAspectRatio="none" viewBox="0 0 700 220">
						<path
							className="pds-report-trend__grid"
							d="M 0 55 H 700 M 0 110 H 700 M 0 165 H 700"
						/>
						{forecast ? (
							<path
								className="pds-report-trend__forecast"
								d={pointsToPath(forecast, 700, 200)}
								transform="translate(0 10)"
							/>
						) : null}
						<path
							className="pds-report-trend__actual"
							d={pointsToPath(actual, 700, 200)}
							transform="translate(0 10)"
						/>
					</svg>
				</div>
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
	const maxValue = Math.max(...items.map((item) => item.value), 1);

	return (
		<Card className={cx('pds-report-bar-list', className)} {...props}>
			{title ? (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				{items.map((item, index) => (
					<div className="pds-report-bar-list__row" key={index}>
						<span className="pds-report-bar-list__label">{item.label}</span>
						<span className="pds-report-bar-list__track">
							<span
								className={cx(
									'pds-report-bar-list__bar',
									item.tone && `pds-report-bar-list__bar--${item.tone}`,
								)}
								style={{
									width: `${Math.round((item.value / maxValue) * 100)}%`,
								}}
							/>
						</span>
						<strong>{formatValue(item.value)}</strong>
						{item.meta ? <small>{item.meta}</small> : null}
					</div>
				))}
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
	const radius = 42;
	const circumference = 2 * Math.PI * radius;
	let offset = 0;

	return (
		<Card className={cx('pds-report-donut', className)} {...props}>
			{title ? (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			) : null}
			<CardContent>
				<div className="pds-report-donut__layout">
					<svg role="img" viewBox="0 0 120 120">
						<title>{typeof title === 'string' ? title : 'Donut chart'}</title>
						<circle
							className="pds-report-donut__track"
							cx="60"
							cy="60"
							r={radius}
						/>
						{segments.map((segment, index) => {
							const dash = (segment.value / total) * circumference;
							const strokeDasharray = `${dash} ${circumference - dash}`;
							const strokeDashoffset = -offset;
							offset += dash;
							return (
								<circle
									className={`pds-report-donut__segment pds-report-donut__segment--${index + 1}`}
									cx="60"
									cy="60"
									key={index}
									r={radius}
									strokeDasharray={strokeDasharray}
									strokeDashoffset={strokeDashoffset}
								/>
							);
						})}
						{centerLabel ? (
							<text className="pds-report-donut__center" x="60" y="64">
								{centerLabel}
							</text>
						) : null}
					</svg>
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
						<tr
							aria-selected={row.selected ? true : undefined}
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
