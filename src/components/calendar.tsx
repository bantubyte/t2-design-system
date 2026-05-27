import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { cx } from '../utils/class-names';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isSameDay = (left?: Date, right?: Date): boolean =>
	Boolean(
		left &&
			right &&
			left.getFullYear() === right.getFullYear() &&
			left.getMonth() === right.getMonth() &&
			left.getDate() === right.getDate(),
	);

const startOfDay = (date: Date): Date =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate());

const compareDays = (left: Date, right: Date): number =>
	startOfDay(left).getTime() - startOfDay(right).getTime();

const addDays = (date: Date, days: number): Date => {
	const nextDate = new Date(date);
	nextDate.setDate(nextDate.getDate() + days);
	return nextDate;
};

const addMonths = (date: Date, months: number): Date =>
	new Date(date.getFullYear(), date.getMonth() + months, 1);

const isDateInRange = (date: Date, range?: DateRange): boolean => {
	if (!range?.from || !range.to) return false;
	return compareDays(date, range.from) >= 0 && compareDays(date, range.to) <= 0;
};

const getRangeDays = (range?: DateRange): number | null => {
	if (!range?.from || !range.to) return null;
	const difference =
		startOfDay(range.to).getTime() - startOfDay(range.from).getTime();
	return Math.floor(difference / 86_400_000) + 1;
};

const toDateKey = (date: Date): string =>
	[
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
	].join('-');

export interface DateRange {
	from?: Date;
	to?: Date;
}

export interface CalendarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	defaultMonth?: Date;
	defaultRange?: DateRange;
	defaultSelectedDate?: Date;
	disableDate?: (date: Date) => boolean;
	minRangeDays?: number;
	month?: Date;
	onMonthChange?: (month: Date) => void;
	onSelectRange?: (range: DateRange) => void;
	onSelectDate?: (date: Date) => void;
	selectedDate?: Date;
	selectedRange?: DateRange;
	showMonthControls?: boolean;
}

export function Calendar({
	className,
	defaultMonth,
	defaultRange,
	defaultSelectedDate,
	disableDate,
	minRangeDays,
	month,
	onMonthChange,
	onSelectRange,
	onSelectDate,
	selectedDate,
	selectedRange,
	showMonthControls = true,
	...props
}: CalendarProps) {
	const isMonthControlled = month !== undefined && onMonthChange !== undefined;
	const [uncontrolledMonth, setUncontrolledMonth] = useState(
		() =>
			defaultMonth ??
			month ??
			selectedDate ??
			defaultSelectedDate ??
			new Date(),
	);
	const [uncontrolledSelectedDate, setUncontrolledSelectedDate] = useState<
		Date | undefined
	>(() => defaultSelectedDate);
	const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>(
		() => defaultRange ?? {},
	);
	const activeMonth = isMonthControlled ? month : uncontrolledMonth;
	const activeSelectedDate = selectedDate ?? uncontrolledSelectedDate;
	const activeRange = selectedRange ?? uncontrolledRange;
	const isRangeMode =
		Boolean(onSelectRange) ||
		selectedRange !== undefined ||
		defaultRange !== undefined;
	const visibleMonth = new Date(
		activeMonth.getFullYear(),
		activeMonth.getMonth(),
		1,
	);
	const firstDay = visibleMonth.getDay();
	const daysInMonth = new Date(
		visibleMonth.getFullYear(),
		visibleMonth.getMonth() + 1,
		0,
	).getDate();
	const cells = Array.from({ length: 42 }, (_, index) => {
		const dayNumber = index - firstDay + 1;
		return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
	});
	const changeMonth = (offset: number) => {
		const nextMonth = new Date(
			visibleMonth.getFullYear(),
			visibleMonth.getMonth() + offset,
			1,
		);

		if (!isMonthControlled) {
			setUncontrolledMonth(nextMonth);
		}
		onMonthChange?.(nextMonth);
	};
	const setRange = (nextRange: DateRange) => {
		if (selectedRange === undefined) {
			setUncontrolledRange(nextRange);
		}
		onSelectRange?.(nextRange);
	};
	const selectDate = (date: Date) => {
		if (!isRangeMode) {
			if (selectedDate === undefined) {
				setUncontrolledSelectedDate(date);
			}
			onSelectDate?.(date);
			return;
		}

		if (!activeRange?.from || activeRange.to) {
			setRange({ from: date, to: undefined });
			return;
		}

		if (compareDays(date, activeRange.from) < 0) {
			setRange({ from: date, to: undefined });
			return;
		}

		const nextRange = { from: activeRange.from, to: date };
		const nextRangeDays = getRangeDays(nextRange);
		if (
			minRangeDays &&
			nextRangeDays !== null &&
			nextRangeDays < minRangeDays
		) {
			setRange({ from: date, to: undefined });
			return;
		}

		setRange(nextRange);
	};

	return (
		<div className={cx('pds-calendar', className)} {...props}>
			<div className="pds-calendar__header">
				{showMonthControls ? (
					<button
						aria-label="Previous month"
						className="pds-calendar__nav-button"
						onClick={() => changeMonth(-1)}
						type="button"
					>
						‹
					</button>
				) : null}
				<strong>
					{visibleMonth.toLocaleString('en', {
						month: 'long',
						year: 'numeric',
					})}
				</strong>
				{showMonthControls ? (
					<button
						aria-label="Next month"
						className="pds-calendar__nav-button"
						onClick={() => changeMonth(1)}
						type="button"
					>
						›
					</button>
				) : null}
			</div>
			<div className="pds-calendar__weekdays">
				{dayLabels.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
			<div className="pds-calendar__grid">
				{cells.map((dayNumber, index) => {
					if (!dayNumber) {
						return (
							<span
								aria-hidden="true"
								className="pds-calendar__empty-day"
								key={`empty-${index}`}
							/>
						);
					}

					const date = new Date(
						visibleMonth.getFullYear(),
						visibleMonth.getMonth(),
						dayNumber,
					);
					const disabled = disableDate?.(date) ?? false;
					const rangeStart = isSameDay(date, activeRange?.from);
					const rangeEnd = isSameDay(date, activeRange?.to);
					const rangeMiddle =
						isDateInRange(date, activeRange) && !rangeStart && !rangeEnd;
					const selected =
						isSameDay(date, activeSelectedDate) || rangeStart || rangeEnd;

					return (
						<button
							aria-pressed={selected}
							className={cx(
								'pds-calendar__day',
								rangeMiddle && 'pds-calendar__day--range-middle',
								rangeStart && 'pds-calendar__day--range-start',
								rangeEnd && 'pds-calendar__day--range-end',
								selected && 'pds-calendar__day--selected',
							)}
							disabled={disabled}
							key={toDateKey(date)}
							onClick={() => selectDate(date)}
							type="button"
						>
							{dayNumber}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export interface DateRangePreset {
	/**
	 * Builds the range for this preset. Receives the in-progress start date
	 * (`anchor`) when one has been picked, so presets can anchor their range to
	 * the user's selected start instead of always starting from today. Presets
	 * that don't need it can ignore the argument.
	 */
	getRange: (anchor?: Date) => DateRange;
	label: ReactNode;
	value: string;
}

const makeForwardRange = (days: number): DateRange => {
	const from = startOfDay(new Date());
	return { from, to: addDays(from, days - 1) };
};

export const defaultDateRangePresets: readonly DateRangePreset[] = [
	{ getRange: () => makeForwardRange(30), label: '30 days', value: '30d' },
	{ getRange: () => makeForwardRange(60), label: '60 days', value: '60d' },
	{ getRange: () => makeForwardRange(90), label: '90 days', value: '90d' },
];

const formatDate = (date?: Date): string =>
	date
		? new Intl.DateTimeFormat('en', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			}).format(date)
		: 'Not selected';

export interface DateRangePickerProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	defaultRange?: DateRange;
	disableDate?: (date: Date) => boolean;
	label?: ReactNode;
	minRangeDays?: number;
	numberOfMonths?: 1 | 2;
	onRangeChange?: (range: DateRange) => void;
	presets?: readonly DateRangePreset[];
	range?: DateRange;
}

export function DateRangePicker({
	className,
	defaultRange,
	disableDate,
	label = 'Date range',
	minRangeDays = 1,
	numberOfMonths = 2,
	onRangeChange,
	presets = defaultDateRangePresets,
	range,
	...props
}: DateRangePickerProps) {
	const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>(
		() => defaultRange ?? {},
	);
	const [visibleMonth, setVisibleMonth] = useState(
		() => range?.from ?? defaultRange?.from ?? new Date(),
	);
	const selectedRange = range ?? uncontrolledRange;
	const rangeDays = getRangeDays(selectedRange);

	const setRange = (nextRange: DateRange) => {
		if (range === undefined) {
			setUncontrolledRange(nextRange);
		}
		if (nextRange.from) {
			setVisibleMonth(
				new Date(nextRange.from.getFullYear(), nextRange.from.getMonth(), 1),
			);
		}
		onRangeChange?.(nextRange);
	};

	return (
		<div className={cx('pds-date-range-picker', className)} {...props}>
			<div className="pds-date-range-picker__header">
				<strong>{label}</strong>
				<span>
					{formatDate(selectedRange.from)} → {formatDate(selectedRange.to)}
				</span>
			</div>

			<div className="pds-date-range-picker__presets">
				<span>Quick</span>
				{presets.map((preset) => (
					<button
						key={preset.value}
						onClick={() => setRange(preset.getRange(selectedRange.from))}
						type="button"
					>
						{preset.label}
					</button>
				))}
			</div>

			<div
				className={cx(
					'pds-date-range-picker__calendars',
					numberOfMonths === 1 && 'pds-date-range-picker__calendars--single',
				)}
			>
				{Array.from({ length: numberOfMonths }, (_, index) => {
					const monthDate = addMonths(visibleMonth, index);
					return (
						<Calendar
							disableDate={disableDate}
							key={index}
							minRangeDays={minRangeDays}
							month={monthDate}
							onMonthChange={(nextMonth) =>
								setVisibleMonth(addMonths(nextMonth, -index))
							}
							onSelectRange={setRange}
							selectedRange={selectedRange}
							showMonthControls={index === 0}
						/>
					);
				})}
			</div>

			<div
				className={cx(
					'pds-date-range-picker__summary',
					selectedRange.from &&
						!selectedRange.to &&
						'pds-date-range-picker__summary--pending',
				)}
			>
				{rangeDays ? (
					<strong>
						{rangeDays} {rangeDays === 1 ? 'day' : 'days'} selected
					</strong>
				) : selectedRange.from ? (
					<strong>
						Select an end date
						{minRangeDays > 1 ? ` (${minRangeDays} day minimum)` : ''}
					</strong>
				) : (
					<strong>Select a start date</strong>
				)}
			</div>
		</div>
	);
}
