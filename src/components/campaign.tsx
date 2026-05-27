import {
	type ButtonHTMLAttributes,
	type CSSProperties,
	type FormEvent,
	type HTMLAttributes,
	type KeyboardEvent,
	type LabelHTMLAttributes,
	type ReactNode,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Badge, type BadgeTone } from './badge';
import { Button, type ButtonProps } from './button';
import { type DateRange, DateRangePicker } from './calendar';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card';
import { CommandMenu } from './command';
import {
	Dialog,
	DialogBody,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './dialog';
import { Progress } from './feedback';
import { Field, Input, Select, Slider, Switch, Textarea } from './form';
import { Icon, isPdsIconName, type PdsIconName } from './icons';
import { Tooltip } from './tooltip';

export interface CampaignSummaryCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	budget?: ReactNode;
	client?: ReactNode;
	flightDates?: ReactNode;
	metrics?: readonly { label: ReactNode; value: ReactNode }[];
	status?: ReactNode;
	title: ReactNode;
}

export function CampaignSummaryCard({
	budget,
	className,
	client,
	flightDates,
	metrics = [],
	status,
	title,
	...props
}: CampaignSummaryCardProps) {
	return (
		<Card className={cx('pds-campaign-summary', className)} {...props}>
			<CardHeader>
				<div className="pds-campaign-summary__header">
					<div>
						<CardTitle>{title}</CardTitle>
						{client ? <CardDescription>{client}</CardDescription> : null}
					</div>
					{status ? (
						<Badge size="sm" tone="brand">
							{status}
						</Badge>
					) : null}
				</div>
			</CardHeader>
			<CardContent>
				<div className="pds-campaign-summary__meta">
					{flightDates ? (
						<div>
							<span>Flight</span>
							<strong>{flightDates}</strong>
						</div>
					) : null}
					{budget ? (
						<div>
							<span>Budget</span>
							<strong>{budget}</strong>
						</div>
					) : null}
				</div>
				{metrics.length ? (
					<div className="pds-campaign-summary__metrics">
						{metrics.map((metric, index) => (
							<div key={index}>
								<span>{metric.label}</span>
								<strong>{metric.value}</strong>
							</div>
						))}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

export interface PlacementCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	attributes?: readonly ReactNode[];
	image?: ReactNode;
	location?: ReactNode;
	meta?: ReactNode;
	title: ReactNode;
}

export function PlacementCard({
	attributes = [],
	className,
	image,
	location,
	meta,
	title,
	...props
}: PlacementCardProps) {
	return (
		<Card
			className={cx('pds-placement-card', className)}
			interactive
			{...props}
		>
			<div className="pds-placement-card__media">
				{image ?? <div className="pds-placement-card__placeholder" />}
			</div>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{location ? <CardDescription>{location}</CardDescription> : null}
			</CardHeader>
			<CardContent>
				{attributes.length ? (
					<div className="pds-placement-card__attributes">
						{attributes.map((attribute, index) => (
							<Badge key={index} size="sm">
								{attribute}
							</Badge>
						))}
					</div>
				) : null}
			</CardContent>
			{meta ? <CardFooter>{meta}</CardFooter> : null}
		</Card>
	);
}

export interface AudienceCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	segments: readonly { label: ReactNode; tone?: BadgeTone; value: number }[];
	title?: ReactNode;
}

export function AudienceCard({
	className,
	segments,
	title = 'Audience fit',
	...props
}: AudienceCardProps) {
	return (
		<Card className={cx('pds-audience-card', className)} {...props}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="pds-audience-card__segments">
					{segments.map((segment, index) => (
						<div className="pds-audience-card__segment" key={index}>
							<div className="pds-audience-card__segment-heading">
								<Badge size="sm" tone={segment.tone ?? 'neutral'}>
									{segment.label}
								</Badge>
								<strong>{segment.value}%</strong>
							</div>
							<Progress value={segment.value} />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export interface FilterChipProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	active?: boolean;
	count?: number;
}

export function FilterChip({
	active = false,
	children,
	className,
	count,
	...props
}: FilterChipProps) {
	return (
		<button
			aria-pressed={active}
			className={cx(
				'pds-filter-chip',
				active && 'pds-filter-chip--active',
				className,
			)}
			type="button"
			{...props}
		>
			<span>{children}</span>
			{typeof count === 'number' ? <strong>{count}</strong> : null}
		</button>
	);
}

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
	primaryAction?: ButtonProps;
	secondaryAction?: ButtonProps;
	supportingText?: ReactNode;
}

export function ActionBar({
	children,
	className,
	primaryAction,
	secondaryAction,
	supportingText,
	...props
}: ActionBarProps) {
	return (
		<div className={cx('pds-action-bar', className)} {...props}>
			<div className="pds-action-bar__content">
				{supportingText ? <p>{supportingText}</p> : null}
				{children}
			</div>
			<div className="pds-action-bar__actions">
				{secondaryAction ? (
					<Button variant="outline" {...secondaryAction} />
				) : null}
				{primaryAction ? <Button {...primaryAction} /> : null}
			</div>
		</div>
	);
}

export interface CampaignSetupWorkspaceProps
	extends HTMLAttributes<HTMLDivElement> {
	footer?: ReactNode;
	sidebar?: ReactNode;
}

export function CampaignSetupWorkspace({
	children,
	className,
	footer,
	sidebar,
	...props
}: CampaignSetupWorkspaceProps) {
	return (
		<div className={cx('pds-campaign-setup-workspace', className)} {...props}>
			<div className="pds-campaign-setup-workspace__main">{children}</div>
			{sidebar ? (
				<div className="pds-campaign-setup-workspace__sidebar">{sidebar}</div>
			) : null}
			{footer ? (
				<div className="pds-campaign-setup-workspace__footer">{footer}</div>
			) : null}
		</div>
	);
}

export interface CampaignControlCardProps
	extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	meta?: ReactNode;
	title: ReactNode;
}

export function CampaignControlCard({
	children,
	className,
	description,
	icon,
	meta,
	title,
	...props
}: CampaignControlCardProps) {
	return (
		<section className={cx('pds-campaign-control-card', className)} {...props}>
			<header className="pds-campaign-control-card__header">
				{icon ? (
					<span className="pds-campaign-control-card__icon">
						{renderCampaignIcon(icon)}
					</span>
				) : null}
				<div>
					<h2>{title}</h2>
					{description ? <p>{description}</p> : null}
				</div>
				{meta ? (
					<span className="pds-campaign-control-card__meta">{meta}</span>
				) : null}
			</header>
			<div className="pds-campaign-control-card__body">{children}</div>
		</section>
	);
}

export interface CampaignControlRowProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
	description?: ReactNode;
	title: ReactNode;
	value?: ReactNode;
}

export function CampaignControlRow({
	children,
	className,
	description,
	title,
	value,
	...props
}: CampaignControlRowProps) {
	return (
		<div className={cx('pds-campaign-control-row', className)} {...props}>
			<div className="pds-campaign-control-row__copy">
				<strong>{title}</strong>
				{description ? <span>{description}</span> : null}
			</div>
			{value ? <Badge tone="info">{value}</Badge> : null}
			<div className="pds-campaign-control-row__control">{children}</div>
		</div>
	);
}

export type CampaignRangeValue = number | readonly [number, number];

export interface CampaignRangeControlProps
	extends Omit<
		HTMLAttributes<HTMLDivElement>,
		'defaultValue' | 'onChange' | 'title'
	> {
	defaultValue?: CampaignRangeValue;
	formatValue?: (value: number) => ReactNode;
	label: ReactNode;
	max: number;
	min: number;
	onValueChange?: (value: CampaignRangeValue) => void;
	step?: number;
	unit?: ReactNode;
	value?: CampaignRangeValue;
}

export function CampaignRangeControl({
	className,
	defaultValue,
	formatValue = (value) => value,
	label,
	max,
	min,
	onValueChange,
	step = 1,
	unit,
	value,
	...props
}: CampaignRangeControlProps) {
	const rangeId = useId();
	const fromInputId = `${rangeId}-from`;
	const toInputId = `${rangeId}-to`;
	const valueInputId = `${rangeId}-value`;
	const [uncontrolledValue, setUncontrolledValue] =
		useState<CampaignRangeValue>(() => value ?? defaultValue ?? min);
	const currentValue = value ?? uncontrolledValue;
	const isRange = isCampaignRangeTuple(currentValue);
	const startValue = isRange ? currentValue[0] : min;
	const endValue = isRange ? currentValue[1] : currentValue;
	const normalizedStart = clampNumber(startValue, min, max);
	const normalizedEnd = clampNumber(endValue, min, max);
	const lowValue = Math.min(normalizedStart, normalizedEnd);
	const highValue = Math.max(normalizedStart, normalizedEnd);
	const lowPercent = rangeToPercent(lowValue, min, max);
	const highPercent = rangeToPercent(highValue, min, max);
	const rangeLabel = isRange
		? `${stringifyNode(formatValue(lowValue))} - ${stringifyNode(formatValue(highValue))}`
		: stringifyNode(formatValue(highValue));

	const setCurrentValue = (nextValue: CampaignRangeValue) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<div
			className={cx(
				'pds-campaign-range-control',
				isRange && 'pds-campaign-range-control--dual',
				className,
			)}
			style={
				{
					'--pds-range-end': `${highPercent}%`,
					'--pds-range-start': `${isRange ? lowPercent : 0}%`,
				} as CSSProperties
			}
			{...props}
		>
			<div className="pds-campaign-range-control__header">
				<span>{label}</span>
				<Badge tone="info">
					{rangeLabel}
					{unit ? ` ${stringifyNode(unit)}` : ''}
				</Badge>
			</div>
			<div className="pds-campaign-range-control__inputs">
				{isRange ? (
					<>
						<label htmlFor={fromInputId}>
							<span>From</span>
							<Input
								id={fromInputId}
								max={highValue}
								min={min}
								onChange={(event) =>
									setCurrentValue([Number(event.target.value), highValue])
								}
								step={step}
								type="number"
								value={lowValue}
							/>
						</label>
						<label htmlFor={toInputId}>
							<span>To</span>
							<Input
								id={toInputId}
								max={max}
								min={lowValue}
								onChange={(event) =>
									setCurrentValue([lowValue, Number(event.target.value)])
								}
								step={step}
								type="number"
								value={highValue}
							/>
						</label>
					</>
				) : (
					<>
						<label htmlFor={valueInputId}>
							<span>Value</span>
							<Input
								id={valueInputId}
								max={max}
								min={min}
								onChange={(event) =>
									setCurrentValue(Number(event.target.value))
								}
								step={step}
								type="number"
								value={highValue}
							/>
						</label>
						{unit ? <span>{unit}</span> : null}
					</>
				)}
			</div>
			{isRange ? (
				<div className="pds-campaign-range-control__track">
					<input
						aria-label={`${stringifyNode(label)} minimum`}
						max={highValue}
						min={min}
						onChange={(event) =>
							setCurrentValue([Number(event.target.value), highValue])
						}
						step={step}
						type="range"
						value={lowValue}
					/>
					<input
						aria-label={`${stringifyNode(label)} maximum`}
						max={max}
						min={lowValue}
						onChange={(event) =>
							setCurrentValue([lowValue, Number(event.target.value)])
						}
						step={step}
						type="range"
						value={highValue}
					/>
				</div>
			) : (
				<Slider
					aria-label={stringifyNode(label)}
					formatValue={formatValue}
					max={max}
					min={min}
					onValueChange={setCurrentValue}
					step={step}
					value={highValue}
				/>
			)}
			<div className="pds-campaign-range-control__scale">
				<span>
					{formatValue(min)}
					{unit ? ` ${stringifyNode(unit)}` : ''}
				</span>
				<span>
					{formatValue(max)}
					{unit ? ` ${stringifyNode(unit)}` : ''}
				</span>
			</div>
		</div>
	);
}

export interface CampaignChoiceOption {
	description?: ReactNode;
	label: ReactNode;
	value: string;
	icon?: ReactNode;
}

export interface CampaignChoiceChipsProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	defaultSelectedValues?: readonly string[];
	onSelectedValuesChange?: (values: string[]) => void;
	options: readonly CampaignChoiceOption[];
	selectedValues?: readonly string[];
}

export function CampaignChoiceChips({
	className,
	defaultSelectedValues = [],
	onSelectedValuesChange,
	options,
	selectedValues,
	...props
}: CampaignChoiceChipsProps) {
	const [uncontrolledValues, setUncontrolledValues] = useState(
		() => new Set(defaultSelectedValues),
	);
	const currentValues = new Set(selectedValues ?? uncontrolledValues);
	const toggleValue = (nextValue: string) => {
		const nextValues = new Set(currentValues);
		if (nextValues.has(nextValue)) {
			nextValues.delete(nextValue);
		} else {
			nextValues.add(nextValue);
		}
		if (selectedValues === undefined) {
			setUncontrolledValues(nextValues);
		}
		onSelectedValuesChange?.([...nextValues]);
	};

	return (
		<div className={cx('pds-campaign-choice-chips', className)} {...props}>
			{options.map((option) => {
				const selected = currentValues.has(option.value);
				return (
					<button
						aria-pressed={selected}
						className={cx(
							'pds-campaign-choice-chip',
							selected && 'pds-campaign-choice-chip--selected',
						)}
						key={option.value}
						onClick={() => toggleValue(option.value)}
						type="button"
					>
						<span>{option.label}</span>
						{option.description ? <small>{option.description}</small> : null}
					</button>
				);
			})}
		</div>
	);
}

export interface CampaignChoiceTilesProps extends CampaignChoiceChipsProps {
	size?: 'default' | 'compact';
}

export function CampaignChoiceTiles({
	className,
	defaultSelectedValues = [],
	onSelectedValuesChange,
	options,
	selectedValues,
	size = 'default',
	...props
}: CampaignChoiceTilesProps) {
	const [uncontrolledValues, setUncontrolledValues] = useState(
		() => new Set(defaultSelectedValues),
	);
	const currentValues = new Set(selectedValues ?? uncontrolledValues);
	const toggleValue = (nextValue: string) => {
		const nextValues = new Set(currentValues);
		if (nextValues.has(nextValue)) {
			nextValues.delete(nextValue);
		} else {
			nextValues.add(nextValue);
		}
		if (selectedValues === undefined) {
			setUncontrolledValues(nextValues);
		}
		onSelectedValuesChange?.([...nextValues]);
	};

	return (
		<div
			className={cx(
				'pds-campaign-choice-tiles',
				size === 'compact' && 'pds-campaign-choice-tiles--compact',
				className,
			)}
			{...props}
		>
			{options.map((option) => {
				const selected = currentValues.has(option.value);
				return (
					<button
						aria-pressed={selected}
						className={cx(
							'pds-campaign-choice-tile',
							selected && 'pds-campaign-choice-tile--selected',
						)}
						key={option.value}
						onClick={() => toggleValue(option.value)}
						type="button"
					>
						{option.icon && (
							<div className="pds-campaign-choice-tile__icon">
								{option.icon}
							</div>
						)}
						<span className="pds-campaign-choice-tile__content">
							<span className="pds-campaign-choice-tile__label">
								{option.label}
							</span>
							{option.description && (
								<small className="pds-campaign-choice-tile__description">
									{option.description}
								</small>
							)}
						</span>
					</button>
				);
			})}
		</div>
	);
}

export interface CampaignCollapsibleFieldProps {
	/** When false, the collapsed summary is shown instead of `children`. */
	expanded: boolean;
	/** Called when the user clicks the collapsed summary to edit again. */
	onExpand: () => void;
	/** Icon rendered inside the tinted square of the summary. */
	summaryIcon?: ReactNode;
	/** Primary line of the collapsed summary. */
	summaryTitle: ReactNode;
	/** Optional secondary line of the collapsed summary. */
	summaryDescription?: ReactNode;
	/** Optional trailing content (e.g. a Badge) shown before the change action. */
	summaryTrailing?: ReactNode;
	/** Text for the change affordance. Defaults to "Change". */
	changeLabel?: ReactNode;
	/** Expanded content (e.g. a picker or choice grid). */
	children: ReactNode;
	className?: string;
}

/**
 * A field that collapses to a compact, clickable summary once a value is
 * chosen, and expands back to its full editing UI on demand. Selection and
 * collapse timing are controlled by the caller via `expanded` / `onExpand`;
 * this component owns only the presentation (summary card + entrance
 * animation). Used for the campaign date range and objective pickers.
 */
export function CampaignCollapsibleField({
	expanded,
	onExpand,
	summaryIcon,
	summaryTitle,
	summaryDescription,
	summaryTrailing,
	changeLabel = 'Change',
	children,
	className,
}: CampaignCollapsibleFieldProps) {
	if (expanded) {
		return (
			<div className={cx('pds-campaign-collapsible__panel', className)}>
				{children}
			</div>
		);
	}

	return (
		<button
			className={cx('pds-campaign-collapsible__summary', className)}
			onClick={onExpand}
			type="button"
		>
			{summaryIcon ? (
				<span className="pds-campaign-collapsible__icon">{summaryIcon}</span>
			) : null}
			<span className="pds-campaign-collapsible__body">
				<span className="pds-campaign-collapsible__title">{summaryTitle}</span>
				{summaryDescription ? (
					<span className="pds-campaign-collapsible__description">
						{summaryDescription}
					</span>
				) : null}
			</span>
			<span className="pds-campaign-collapsible__trailing">
				{summaryTrailing}
				<span className="pds-campaign-collapsible__change">{changeLabel}</span>
			</span>
		</button>
	);
}

export interface CampaignHierarchyNode {
	children?: readonly CampaignHierarchyNode[];
	count?: ReactNode;
	defaultExpanded?: boolean;
	disabled?: boolean;
	id: string;
	label: ReactNode;
	meta?: ReactNode;
	type?: ReactNode;
}

export interface CampaignHierarchySelectorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	childrenPreviewLimit?: number;
	defaultExpandedIds?: readonly string[];
	defaultSelectedIds?: readonly string[];
	emptyLabel?: ReactNode;
	expandedIds?: readonly string[];
	maxHeight?: number | string;
	nodes: readonly CampaignHierarchyNode[];
	onExpandedIdsChange?: (ids: string[]) => void;
	onSelectedIdsChange?: (ids: string[]) => void;
	searchLabel?: string;
	searchPlaceholder?: string;
	showAllLabel?: (
		hiddenCount: number,
		node: CampaignHierarchyNode,
	) => ReactNode;
	selectedIds?: readonly string[];
}

export function CampaignHierarchySelector({
	childrenPreviewLimit = 4,
	className,
	defaultExpandedIds,
	defaultSelectedIds = [],
	emptyLabel = 'No matching options',
	expandedIds,
	maxHeight = '22rem',
	nodes,
	onExpandedIdsChange,
	onSelectedIdsChange,
	searchLabel = 'Search hierarchy',
	searchPlaceholder = 'Search...',
	showAllLabel = (hiddenCount) => `Show ${hiddenCount} more`,
	selectedIds,
	...props
}: CampaignHierarchySelectorProps) {
	const searchId = useId();
	const [query, setQuery] = useState('');
	const [expandedPreviewIds, setExpandedPreviewIds] = useState<Set<string>>(
		() => new Set(),
	);
	const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(
		() => new Set(defaultExpandedIds ?? collectDefaultExpandedIds(nodes)),
	);
	const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(
		() => new Set(defaultSelectedIds),
	);
	const currentExpandedIds = new Set(expandedIds ?? uncontrolledExpandedIds);
	const currentSelectedIds = new Set(selectedIds ?? uncontrolledSelectedIds);
	const normalizedQuery = query.trim().toLowerCase();
	const visibleNodes = useMemo(
		() =>
			normalizedQuery ? filterHierarchyNodes(nodes, normalizedQuery) : nodes,
		[nodes, normalizedQuery],
	);

	const setExpanded = (nextExpandedIds: Set<string>) => {
		if (expandedIds === undefined) {
			setUncontrolledExpandedIds(nextExpandedIds);
		}
		onExpandedIdsChange?.([...nextExpandedIds]);
	};

	const setSelected = (nextSelectedIds: Set<string>) => {
		if (selectedIds === undefined) {
			setUncontrolledSelectedIds(nextSelectedIds);
		}
		onSelectedIdsChange?.([...nextSelectedIds]);
	};

	const toggleExpanded = (id: string) => {
		const nextExpandedIds = new Set(currentExpandedIds);
		if (nextExpandedIds.has(id)) {
			nextExpandedIds.delete(id);
		} else {
			nextExpandedIds.add(id);
		}
		setExpanded(nextExpandedIds);
	};

	const toggleSelected = (id: string, selected: boolean) => {
		const nextSelectedIds = new Set(currentSelectedIds);
		if (selected) {
			nextSelectedIds.add(id);
		} else {
			nextSelectedIds.delete(id);
		}
		setSelected(nextSelectedIds);
	};

	const renderNode = (node: CampaignHierarchyNode, depth: number) => {
		const hasChildren = Boolean(node.children?.length);
		const expanded = normalizedQuery ? true : currentExpandedIds.has(node.id);
		const selected = currentSelectedIds.has(node.id);
		const children = node.children ?? [];
		const previewExpanded =
			normalizedQuery ||
			childrenPreviewLimit <= 0 ||
			expandedPreviewIds.has(node.id);
		const visibleChildren = previewExpanded
			? children
			: children.slice(0, childrenPreviewLimit);
		const hiddenChildCount = children.length - visibleChildren.length;

		return (
			<li key={node.id}>
				<div
					className={cx(
						'pds-campaign-hierarchy-selector__row',
						selected && 'pds-campaign-hierarchy-selector__row--selected',
					)}
					style={{ '--pds-tree-depth': depth } as CSSProperties}
				>
					<button
						aria-expanded={hasChildren ? expanded : undefined}
						aria-label={
							hasChildren
								? `${expanded ? 'Collapse' : 'Expand'} ${stringifyNode(node.label)}`
								: undefined
						}
						className="pds-campaign-hierarchy-selector__toggle"
						disabled={!hasChildren}
						onClick={() => toggleExpanded(node.id)}
						type="button"
					>
						{hasChildren ? <Icon name="chevron-right" size={16} /> : null}
					</button>
					<label>
						<input
							checked={selected}
							disabled={node.disabled}
							onChange={(event) =>
								toggleSelected(node.id, event.target.checked)
							}
							type="checkbox"
						/>
						<span>
							<strong>{node.label}</strong>
							{node.type || node.meta ? (
								<small>
									{node.type}
									{node.type && node.meta ? ' · ' : null}
									{node.meta}
								</small>
							) : null}
						</span>
					</label>
					{node.count ? (
						<span className="pds-campaign-hierarchy-selector__count">
							{node.count}
						</span>
					) : null}
				</div>
				{hasChildren && expanded ? (
					<ul>
						{visibleChildren.map((child) => renderNode(child, depth + 1))}
						{hiddenChildCount > 0 ? (
							<li>
								<button
									className="pds-campaign-hierarchy-selector__show-all"
									onClick={() => {
										const nextExpandedPreviewIds = new Set(expandedPreviewIds);
										nextExpandedPreviewIds.add(node.id);
										setExpandedPreviewIds(nextExpandedPreviewIds);
									}}
									style={{ '--pds-tree-depth': depth + 1 } as CSSProperties}
									type="button"
								>
									{showAllLabel(hiddenChildCount, node)}
								</button>
							</li>
						) : null}
					</ul>
				) : null}
			</li>
		);
	};

	return (
		<div
			className={cx('pds-campaign-hierarchy-selector', className)}
			{...props}
		>
			<label
				className="pds-campaign-hierarchy-selector__search"
				htmlFor={searchId}
			>
				<Icon aria-hidden="true" name="search" size={18} />
				<span className="pds-visually-hidden">{searchLabel}</span>
				<Input
					id={searchId}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={searchPlaceholder}
					type="search"
					value={query}
				/>
			</label>
			<div
				className="pds-campaign-hierarchy-selector__tree"
				style={{ maxHeight }}
			>
				{visibleNodes.length ? (
					<ul>{visibleNodes.map((node) => renderNode(node, 0))}</ul>
				) : (
					<div className="pds-campaign-hierarchy-selector__empty">
						{emptyLabel}
					</div>
				)}
			</div>
		</div>
	);
}

export interface CampaignSetupRailItem {
	label: ReactNode;
	status?: 'complete' | 'missing' | 'warning';
	value?: ReactNode;
}

export interface CampaignSetupRailSection {
	items: readonly CampaignSetupRailItem[];
	title: ReactNode;
}

export interface CampaignSetupReviewRailProps
	extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	action?: ReactNode;
	completionLabel?: ReactNode;
	completionValue?: number;
	sections: readonly CampaignSetupRailSection[];
	title?: ReactNode;
}

export function CampaignSetupReviewRail({
	action,
	className,
	completionLabel = 'Setup complete',
	completionValue = 0,
	sections,
	title = 'Campaign setup',
	...props
}: CampaignSetupReviewRailProps) {
	const missingItems = sections.flatMap((section) =>
		section.items.filter((item) => item.status === 'missing'),
	);
	const safeCompletion = Math.max(0, Math.min(100, completionValue));

	return (
		<aside className={cx('pds-campaign-setup-rail', className)} {...props}>
			<header className="pds-campaign-setup-rail__header">
				<div>
					<h2>{title}</h2>
					<span>{completionLabel}</span>
				</div>
				<strong>{safeCompletion}%</strong>
			</header>
			<Progress value={safeCompletion} />
			<div className="pds-campaign-setup-rail__sections">
				{sections.map((section, sectionIndex) => (
					<section key={sectionIndex}>
						<h3>{section.title}</h3>
						<ul>
							{section.items.map((item, itemIndex) => (
								<li
									className={cx(
										item.status &&
											`pds-campaign-setup-rail__item--${item.status}`,
									)}
									key={itemIndex}
								>
									<span>{item.label}</span>
									<strong>{item.value ?? 'Not set'}</strong>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
			{missingItems.length ? (
				<output className="pds-campaign-setup-rail__missing">
					<strong>Missing</strong>
					<span>{missingItems.map((item) => item.label).join(', ')}</span>
				</output>
			) : null}
			{action ? (
				<div className="pds-campaign-setup-rail__action">{action}</div>
			) : null}
		</aside>
	);
}

const renderCampaignIcon = (icon: PdsIconName | ReactNode) =>
	isPdsIconName(icon) ? <Icon name={icon} size={20} /> : icon;

const collectDefaultExpandedIds = (
	nodes: readonly CampaignHierarchyNode[],
): string[] =>
	nodes.flatMap((node) => [
		...(node.defaultExpanded ? [node.id] : []),
		...collectDefaultExpandedIds(node.children ?? []),
	]);

const filterHierarchyNodes = (
	nodes: readonly CampaignHierarchyNode[],
	query: string,
): CampaignHierarchyNode[] =>
	nodes.flatMap((node) => {
		const filteredChildren = filterHierarchyNodes(node.children ?? [], query);
		const nodeMatches = [
			node.id,
			stringifyNode(node.label),
			stringifyNode(node.meta),
			stringifyNode(node.type),
		]
			.join(' ')
			.toLowerCase()
			.includes(query);

		if (!nodeMatches && filteredChildren.length === 0) return [];
		return [
			{
				...node,
				children: nodeMatches ? node.children : filteredChildren,
			},
		];
	});

const isCampaignRangeTuple = (
	value: CampaignRangeValue,
): value is readonly [number, number] => Array.isArray(value);

const clampNumber = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

const rangeToPercent = (value: number, min: number, max: number) =>
	max === min ? 0 : ((value - min) / (max - min)) * 100;

const stringifyNode = (value: ReactNode): string => {
	if (typeof value === 'string' || typeof value === 'number') {
		return String(value);
	}
	if (Array.isArray(value)) {
		return value.map(stringifyNode).join('');
	}
	return '';
};

export type CampaignStatTone =
	| 'neutral'
	| 'brand'
	| 'success'
	| 'warning'
	| 'info';

export interface CampaignStatCardProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'value'> {
	description?: ReactNode;
	icon?: ReactNode;
	label: ReactNode;
	selected?: boolean;
	tone?: CampaignStatTone;
	value: ReactNode;
}

export function CampaignStatCard({
	className,
	description,
	icon,
	label,
	selected = false,
	tone = 'neutral',
	value,
	...props
}: CampaignStatCardProps) {
	return (
		<button
			aria-pressed={selected}
			className={cx(
				'pds-campaign-stat-card',
				`pds-campaign-stat-card--${tone}`,
				selected && 'pds-campaign-stat-card--selected',
				className,
			)}
			type="button"
			{...props}
		>
			{icon ? (
				<span className="pds-campaign-stat-card__icon">{icon}</span>
			) : null}
			<span className="pds-campaign-stat-card__body">
				<strong>{value}</strong>
				<span>{label}</span>
				{description ? <small>{description}</small> : null}
			</span>
		</button>
	);
}

export interface CampaignListCardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
	canEditLabel?: ReactNode;
	client?: ReactNode;
	dateRange?: ReactNode;
	duration?: ReactNode;
	onDelete?: () => void;
	onSelect?: () => void;
	onView?: () => void;
	progress?: number;
	progressLabel?: ReactNode;
	selected?: boolean;
	status?: ReactNode;
	statusTone?: BadgeTone;
	title: ReactNode;
	viewLabel?: ReactNode;
}

export function CampaignListCard({
	canEditLabel,
	className,
	client,
	dateRange,
	duration,
	onDelete,
	onKeyDown,
	onSelect,
	onView,
	progress,
	progressLabel,
	selected = false,
	status = 'Planning',
	statusTone = 'neutral',
	title,
	viewLabel = 'View Campaign',
	...props
}: CampaignListCardProps) {
	const interactive = Boolean(onSelect);
	const safeProgress =
		typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : null;
	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (!interactive || event.defaultPrevented) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect?.();
		}
	};

	return (
		<Card
			className={cx(
				'pds-campaign-list-card',
				selected && 'pds-campaign-list-card--selected',
				interactive && 'pds-campaign-list-card--interactive',
				className,
			)}
			onClick={onSelect}
			onKeyDown={handleKeyDown}
			role={interactive ? 'button' : undefined}
			tabIndex={interactive ? 0 : undefined}
			{...props}
		>
			<div className="pds-campaign-list-card__status-bar" />
			<CardHeader>
				<div className="pds-campaign-list-card__header">
					<div>
						<CardTitle>{title}</CardTitle>
						{client ? <CardDescription>{client}</CardDescription> : null}
					</div>
					<div className="pds-campaign-list-card__badges">
						{status ? (
							<Badge size="sm" tone={statusTone}>
								{status}
							</Badge>
						) : null}
						{canEditLabel ? (
							<Badge size="sm" tone="success">
								{canEditLabel}
							</Badge>
						) : null}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{dateRange ? (
					<div className="pds-campaign-list-card__dates">
						<span aria-hidden="true">□</span>
						<strong>{dateRange}</strong>
						{duration ? <small>{duration}</small> : null}
					</div>
				) : null}
				{safeProgress !== null ? (
					<Progress
						label={progressLabel ?? 'In Progress'}
						value={safeProgress}
					/>
				) : null}
			</CardContent>
			<CardFooter>
				<Button
					onClick={(event) => {
						event.stopPropagation();
						onView?.();
					}}
					rightIcon="›"
					size="sm"
					variant="primary"
				>
					{viewLabel}
				</Button>
				{onDelete ? (
					<button
						aria-label="Delete campaign"
						className="pds-campaign-list-card__delete"
						onClick={(event) => {
							event.stopPropagation();
							onDelete();
						}}
						type="button"
					>
						⌫
					</button>
				) : null}
			</CardFooter>
		</Card>
	);
}

export interface CampaignCardGridProps extends HTMLAttributes<HTMLDivElement> {
	columns?: 1 | 2 | 3;
}

export function CampaignCardGrid({
	children,
	className,
	columns = 3,
	...props
}: CampaignCardGridProps) {
	return (
		<div
			className={cx(
				'pds-campaign-card-grid',
				`pds-campaign-card-grid--${columns}`,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface CampaignListToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	actions?: ReactNode;
	defaultValue?: string;
	filterLabel?: ReactNode;
	onFilterClick?: () => void;
	onSortClick?: () => void;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	sortLabel?: ReactNode;
	value?: string;
}

export function CampaignListToolbar({
	actions,
	className,
	defaultValue = '',
	filterLabel = 'Filters',
	onFilterClick,
	onSortClick,
	onValueChange,
	placeholder = 'Search campaigns by name, client, or status...',
	sortLabel = 'Date',
	value,
	...props
}: CampaignListToolbarProps) {
	const searchId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const searchValue = value ?? uncontrolledValue;
	const setSearchValue = (nextValue: string) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<div className={cx('pds-campaign-list-toolbar', className)} {...props}>
			<label className="pds-campaign-list-toolbar__search" htmlFor={searchId}>
				<span aria-hidden="true">⌕</span>
				<Input
					id={searchId}
					onChange={(event) => setSearchValue(event.target.value)}
					placeholder={placeholder}
					value={searchValue}
				/>
			</label>
			<div className="pds-campaign-list-toolbar__actions">
				<Button leftIcon="◇" onClick={onFilterClick} variant="outline">
					{filterLabel}
				</Button>
				<Button
					leftIcon="↕"
					onClick={onSortClick}
					rightIcon="⌄"
					variant="outline"
				>
					{sortLabel}
				</Button>
				{actions}
			</div>
		</div>
	);
}

export interface SupportRequestValues {
	description: string;
	email: string;
	name: string;
	page: string;
	phone: string;
	subject: string;
}

const emptySupportRequestValues: SupportRequestValues = {
	description: '',
	email: '',
	name: '',
	page: 'Campaigns',
	phone: '',
	subject: '',
};

export interface SupportRequestDialogProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
	cancelLabel?: ReactNode;
	defaultValues?: Partial<SupportRequestValues>;
	onCancel?: () => void;
	onSubmit?: (values: SupportRequestValues) => void;
	onValuesChange?: (values: SupportRequestValues) => void;
	open?: boolean;
	pageOptions?: readonly string[];
	submitLabel?: ReactNode;
	values?: Partial<SupportRequestValues>;
}

export function SupportRequestDialog({
	cancelLabel = 'Cancel',
	className,
	defaultValues,
	onCancel,
	onSubmit,
	onValuesChange,
	open = true,
	pageOptions = [
		'Campaigns',
		'Create Campaign',
		'Location Intel',
		'Renewals',
		'Insights',
	],
	submitLabel = 'Submit',
	values,
	...props
}: SupportRequestDialogProps) {
	const [uncontrolledValues, setUncontrolledValues] =
		useState<SupportRequestValues>(() => ({
			...emptySupportRequestValues,
			...defaultValues,
		}));
	const currentValues = {
		...uncontrolledValues,
		...values,
	};
	const setField = <TKey extends keyof SupportRequestValues>(
		key: TKey,
		nextValue: SupportRequestValues[TKey],
	) => {
		const nextValues = { ...currentValues, [key]: nextValue };
		if (values === undefined) {
			setUncontrolledValues(nextValues);
		}
		onValuesChange?.(nextValues);
	};
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit?.(currentValues);
	};
	const canSubmit = Boolean(currentValues.subject && currentValues.description);

	return (
		<Dialog
			className={cx('pds-support-dialog', className)}
			open={open}
			titleId="pds-support-dialog-title"
			{...props}
		>
			<form onSubmit={handleSubmit}>
				<DialogHeader className="pds-support-dialog__header">
					<div aria-hidden="true" className="pds-support-dialog__icon">
						?
					</div>
					<div>
						<DialogTitle id="pds-support-dialog-title">
							How can we help?
						</DialogTitle>
						<DialogDescription>
							We typically respond within one business day.
						</DialogDescription>
					</div>
				</DialogHeader>
				<DialogBody className="pds-support-dialog__body">
					<div className="pds-support-dialog__split">
						<Field label="Name">
							<Input
								onChange={(event) => setField('name', event.target.value)}
								value={currentValues.name}
							/>
						</Field>
						<Field label="Email">
							<Input
								onChange={(event) => setField('email', event.target.value)}
								type="email"
								value={currentValues.email}
							/>
						</Field>
					</div>
					<Field label="Phone (optional)">
						<Input
							onChange={(event) => setField('phone', event.target.value)}
							placeholder="+27 ..."
							value={currentValues.phone}
						/>
					</Field>
					<Field label="Subject *">
						<Input
							onChange={(event) => setField('subject', event.target.value)}
							placeholder="Briefly, what's going on?"
							value={currentValues.subject}
						/>
					</Field>
					<Field label="Page">
						<Select
							onChange={(event) => setField('page', event.target.value)}
							value={currentValues.page}
						>
							{pageOptions.map((page) => (
								<option key={page} value={page}>
									{page}
								</option>
							))}
						</Select>
					</Field>
					<Field label="Description *">
						<Textarea
							maxLength={1500}
							onChange={(event) => setField('description', event.target.value)}
							placeholder="Tell us what you were doing, what you expected, and what happened."
							rows={5}
							value={currentValues.description}
						/>
						<span className="pds-support-dialog__counter">
							{currentValues.description.length} / 1500
						</span>
					</Field>
				</DialogBody>
				<DialogFooter
					actions={
						<>
							<Button onClick={onCancel} variant="ghost">
								{cancelLabel}
							</Button>
							<Button disabled={!canSubmit} type="submit">
								{submitLabel}
							</Button>
						</>
					}
				>
					We auto-collect browser context and the current URL to help debug
					faster.
				</DialogFooter>
			</form>
		</Dialog>
	);
}

export interface SiteInventoryItem {
	badge?: ReactNode;
	dimensions?: ReactNode;
	format?: ReactNode;
	id: string;
	location?: ReactNode;
	price?: ReactNode;
	recommended?: boolean;
	title: ReactNode;
}

export interface SiteInventoryRowProps
	extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange' | 'title'> {
	item: SiteInventoryItem;
	onSelectedChange?: (selected: boolean, item: SiteInventoryItem) => void;
	selected?: boolean;
}

export function SiteInventoryRow({
	className,
	item,
	onSelectedChange,
	selected = false,
	...props
}: SiteInventoryRowProps) {
	return (
		<label
			className={cx(
				'pds-site-inventory-row',
				selected && 'pds-site-inventory-row--selected',
				className,
			)}
			{...props}
		>
			<input
				checked={selected}
				onChange={(event) => onSelectedChange?.(event.target.checked, item)}
				type="checkbox"
			/>
			<span className="pds-site-inventory-row__content">
				<strong>{item.title}</strong>
				{item.location ? <span>{item.location}</span> : null}
				{item.format ? <span>{item.format}</span> : null}
				{item.badge ? <small>{item.badge}</small> : null}
			</span>
			<span className="pds-site-inventory-row__meta">
				{item.price ? <strong>{item.price}</strong> : null}
				{item.dimensions ? <span>{item.dimensions}</span> : null}
			</span>
		</label>
	);
}

export interface SiteInventoryTab {
	count?: ReactNode;
	icon?: ReactNode;
	label: ReactNode;
	value: string;
}

export interface SiteInventoryPanelProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	activeTab?: string;
	defaultActiveTab?: string;
	defaultSearchValue?: string;
	defaultSelectedIds?: readonly string[];
	items: readonly SiteInventoryItem[];
	onActiveTabChange?: (value: string) => void;
	onBulkAdd?: (ids: string[]) => void;
	onSearchValueChange?: (value: string) => void;
	onSelectedIdsChange?: (ids: string[]) => void;
	searchPlaceholder?: string;
	searchValue?: string;
	selectedIds?: readonly string[];
	sortActions?: ReactNode;
	tabs?: readonly SiteInventoryTab[];
}

export function SiteInventoryPanel({
	activeTab,
	className,
	defaultActiveTab = 'next-best',
	defaultSearchValue = '',
	defaultSelectedIds = [],
	items,
	onActiveTabChange,
	onBulkAdd,
	onSearchValueChange,
	onSelectedIdsChange,
	searchPlaceholder = 'Search by name, location, or site ID',
	searchValue,
	selectedIds,
	sortActions,
	tabs,
	...props
}: SiteInventoryPanelProps) {
	const searchId = useId();
	const panelTabs =
		tabs ??
		([
			{
				count: items.filter((item) => item.recommended).length,
				icon: '◎',
				label: 'Next Best',
				value: 'next-best',
			},
			{
				count: items.length,
				icon: '▦',
				label: 'All Sites',
				value: 'all',
			},
		] satisfies readonly SiteInventoryTab[]);
	const [uncontrolledTab, setUncontrolledTab] = useState(defaultActiveTab);
	const [uncontrolledSearchValue, setUncontrolledSearchValue] =
		useState(defaultSearchValue);
	const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(
		() => new Set(defaultSelectedIds),
	);
	const currentTab = activeTab ?? uncontrolledTab;
	const currentSearchValue = searchValue ?? uncontrolledSearchValue;
	const currentSelectedIds = new Set(selectedIds ?? uncontrolledSelectedIds);
	const normalizedSearch = currentSearchValue.trim().toLowerCase();
	const filteredItems = items.filter((item) => {
		const matchesTab = currentTab === 'all' || item.recommended;
		const searchable = [
			item.id,
			item.title,
			item.location,
			item.format,
			item.price,
			item.dimensions,
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();
		return (
			matchesTab && (!normalizedSearch || searchable.includes(normalizedSearch))
		);
	});
	const setTab = (nextTab: string) => {
		if (activeTab === undefined) {
			setUncontrolledTab(nextTab);
		}
		onActiveTabChange?.(nextTab);
	};
	const setSearch = (nextValue: string) => {
		if (searchValue === undefined) {
			setUncontrolledSearchValue(nextValue);
		}
		onSearchValueChange?.(nextValue);
	};
	const setSelected = (nextSelectedIds: Set<string>) => {
		if (selectedIds === undefined) {
			setUncontrolledSelectedIds(nextSelectedIds);
		}
		onSelectedIdsChange?.([...nextSelectedIds]);
	};
	const toggleSelected = (selected: boolean, item: SiteInventoryItem) => {
		const nextSelectedIds = new Set(currentSelectedIds);
		if (selected) {
			nextSelectedIds.add(item.id);
		} else {
			nextSelectedIds.delete(item.id);
		}
		setSelected(nextSelectedIds);
	};
	const selectedIdList = [...currentSelectedIds];

	return (
		<div className={cx('pds-site-inventory-panel', className)} {...props}>
			<div className="pds-site-inventory-panel__toolbar">
				<label className="pds-site-inventory-panel__search" htmlFor={searchId}>
					<span aria-hidden="true">⌕</span>
					<Input
						id={searchId}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={searchPlaceholder}
						value={currentSearchValue}
					/>
				</label>
				<div className="pds-site-inventory-panel__actions">
					{sortActions ?? (
						<>
							<Button size="sm" variant="outline">
								Sort by VAC
							</Button>
							<Button size="sm" variant="outline">
								Sort by Cost
							</Button>
						</>
					)}
					<Button
						disabled={!selectedIdList.length}
						leftIcon="+"
						onClick={() => onBulkAdd?.(selectedIdList)}
						size="sm"
						variant="outline"
					>
						Bulk Add
					</Button>
				</div>
			</div>
			<div className="pds-site-inventory-panel__tabs" role="tablist">
				{panelTabs.map((tab) => (
					<button
						aria-selected={tab.value === currentTab}
						className={cx(
							'pds-site-inventory-panel__tab',
							tab.value === currentTab &&
								'pds-site-inventory-panel__tab--active',
						)}
						key={tab.value}
						onClick={() => setTab(tab.value)}
						role="tab"
						type="button"
					>
						{tab.icon ? <span aria-hidden="true">{tab.icon}</span> : null}
						<span>{tab.label}</span>
						{tab.count !== undefined ? <strong>{tab.count}</strong> : null}
					</button>
				))}
			</div>
			<div className="pds-site-inventory-panel__list">
				{filteredItems.map((item) => (
					<SiteInventoryRow
						item={item}
						key={item.id}
						onSelectedChange={toggleSelected}
						selected={currentSelectedIds.has(item.id)}
					/>
				))}
				{filteredItems.length === 0 ? (
					<div className="pds-site-inventory-panel__empty">
						No sites match this filter.
					</div>
				) : null}
			</div>
		</div>
	);
}

export interface CampaignScheduleDialogProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'> {
	applyLabel?: ReactNode;
	cancelLabel?: ReactNode;
	defaultRange?: DateRange;
	description?: ReactNode;
	minRangeDays?: number;
	numberOfMonths?: 1 | 2;
	onApply?: (range: DateRange) => void;
	onCancel?: () => void;
	onRangeChange?: (range: DateRange) => void;
	open?: boolean;
	range?: DateRange;
	title?: ReactNode;
}

export function CampaignScheduleDialog({
	applyLabel = 'Set Dates',
	cancelLabel = 'Adjust schedule and apply',
	className,
	defaultRange,
	description = 'Select date range for your campaign',
	minRangeDays = 14,
	numberOfMonths = 1,
	onApply,
	onCancel,
	onRangeChange,
	open = true,
	range,
	title = 'Campaign Schedule',
	...props
}: CampaignScheduleDialogProps) {
	const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>(
		() => defaultRange ?? {},
	);
	const currentRange = range ?? uncontrolledRange;
	const setRange = (nextRange: DateRange) => {
		if (range === undefined) {
			setUncontrolledRange(nextRange);
		}
		onRangeChange?.(nextRange);
	};
	const rangeDays = getCampaignRangeDays(currentRange);

	return (
		<Dialog
			className={cx('pds-campaign-schedule-dialog', className)}
			open={open}
			titleId="pds-campaign-schedule-dialog-title"
			{...props}
		>
			<DialogHeader className="pds-campaign-schedule-dialog__header">
				<span aria-hidden="true" className="pds-campaign-schedule-dialog__icon">
					□
				</span>
				<div>
					<DialogTitle id="pds-campaign-schedule-dialog-title">
						{title}
					</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</div>
			</DialogHeader>
			<DialogBody>
				<DateRangePicker
					defaultRange={defaultRange}
					label="Quick"
					minRangeDays={minRangeDays}
					numberOfMonths={numberOfMonths}
					onRangeChange={setRange}
					range={currentRange}
				/>
				<div className="pds-campaign-schedule-dialog__summary">
					<span>{formatCampaignRange(currentRange)}</span>
					{rangeDays ? (
						<strong>
							{rangeDays} {rangeDays === 1 ? 'day' : 'days'}
						</strong>
					) : null}
				</div>
			</DialogBody>
			<DialogFooter
				actions={
					<Button
						disabled={!currentRange.from || !currentRange.to}
						onClick={() => onApply?.(currentRange)}
						rightIcon="→"
					>
						{applyLabel}
					</Button>
				}
			>
				<button
					className="pds-campaign-schedule-dialog__cancel"
					onClick={onCancel}
					type="button"
				>
					{cancelLabel}
				</button>
			</DialogFooter>
		</Dialog>
	);
}

const getCampaignRangeDays = (range?: DateRange): number | null => {
	if (!range?.from || !range.to) return null;
	const from = new Date(
		range.from.getFullYear(),
		range.from.getMonth(),
		range.from.getDate(),
	);
	const to = new Date(
		range.to.getFullYear(),
		range.to.getMonth(),
		range.to.getDate(),
	);
	return Math.floor((to.getTime() - from.getTime()) / 86_400_000) + 1;
};

const formatCampaignDate = (date?: Date): string =>
	date
		? new Intl.DateTimeFormat('en', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}).format(date)
		: 'Not selected';

const formatCampaignRange = (range?: DateRange): string => {
	if (!range?.from || !range.to) return 'Select a start and end date';
	return `${formatCampaignDate(range.from)} - ${formatCampaignDate(range.to)}`;
};
export interface CampaignPartialFlightsToggleProps {
	id?: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
}

export function CampaignPartialFlightsToggle({
	id = 'partial-flights-toggle',
	checked,
	disabled,
	onChange,
	className,
}: CampaignPartialFlightsToggleProps) {
	return (
		<label
			className={cx(
				'pds-campaign-partial-toggle',
				disabled ? 'pds-campaign-partial-toggle--disabled' : '',
				className,
			)}
			htmlFor={id}
		>
			<span className="pds-campaign-partial-toggle__label">
				<span>Include partial flights</span>
				<Tooltip content="Adds faces with hidden gaps in the campaign window. Pricing and metrics for these faces are already pro-rated to the available days.">
					<span className="pds-campaign-partial-toggle__icon">
						<Icon name="help" style={{ width: '12px', height: '12px' }} />
					</span>
				</Tooltip>
			</span>
			<Switch
				aria-label="Include partially available flights"
				checked={checked}
				disabled={disabled}
				id={id}
				onChange={(e: any) => onChange(e.target.checked)}
			/>
		</label>
	);
}

export interface CampaignSelectOption {
	label: string;
	value: string;
}

export interface CampaignSelectFieldProps {
	className?: string;
	disabled?: boolean;
	emptyLabel?: ReactNode;
	onChange: (value: string) => void;
	options: ReadonlyArray<CampaignSelectOption>;
	placeholder?: string;
	searchPlaceholder?: string;
	value: string;
}

export function CampaignSelectField({
	className,
	disabled = false,
	emptyLabel = 'No options found',
	onChange,
	options,
	placeholder = 'Select…',
	searchPlaceholder = 'Search…',
	value,
}: CampaignSelectFieldProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [open]);

	const selectedLabel = options.find((o) => o.value === value)?.label;

	const handleSelect = (nextValue: string) => {
		onChange(nextValue);
		setOpen(false);
		triggerRef.current?.focus();
	};

	return (
		<div className={cx('pds-select-field', className)} ref={containerRef}>
			<button
				aria-expanded={open}
				aria-haspopup="listbox"
				className={cx(
					'pds-select-field__trigger',
					open && 'pds-select-field__trigger--open',
					!selectedLabel && 'pds-select-field__trigger--placeholder',
				)}
				disabled={disabled}
				onClick={() => setOpen(!open)}
				onKeyDown={(e) => {
					if (e.key === 'Escape') setOpen(false);
				}}
				ref={triggerRef}
				type="button"
			>
				{selectedLabel ?? placeholder}
			</button>
			{open && (
				<div className="pds-select-field__panel">
					<CommandMenu
						emptyLabel={emptyLabel}
						items={options}
						onSelect={handleSelect}
						placeholder={searchPlaceholder}
						selectedValue={value}
					/>
				</div>
			)}
		</div>
	);
}
