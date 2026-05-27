import {
	type CSSProperties,
	forwardRef,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type LabelHTMLAttributes,
	type ReactNode,
	type SelectHTMLAttributes,
	type TextareaHTMLAttributes,
	useId,
	useState,
} from 'react';
import { cx } from '../utils/class-names';

export interface FieldProps extends LabelHTMLAttributes<HTMLLabelElement> {
	error?: ReactNode;
	hint?: ReactNode;
	label?: ReactNode;
	labelProps?: HTMLAttributes<HTMLSpanElement>;
}

export function Field({
	children,
	className,
	error,
	hint,
	label,
	labelProps,
	...props
}: FieldProps) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: control is provided via `children` (Input/Select/Textarea), giving implicit label association.
		<label className={cx('pds-field', className)} {...props}>
			{label ? (
				<span
					{...labelProps}
					className={cx('pds-field__label', labelProps?.className)}
				>
					{label}
				</span>
			) : null}
			{children}
			{hint && !error ? <p className="pds-field__hint">{hint}</p> : null}
			{error ? <p className="pds-field__error">{error}</p> : null}
		</label>
	);
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: ReactNode;
	formatValue?: (raw: string) => string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, formatValue, onChange, prefix, value, ...props }, ref) => {
		const displayValue = formatValue
			? formatValue(String(value ?? ''))
			: value;

		if (prefix) {
			return (
				<span className="pds-input-wrapper">
					<span aria-hidden="true" className="pds-input__prefix">
						{prefix}
					</span>
					<input
						className={cx('pds-input pds-input--with-prefix', className)}
						onChange={onChange}
						ref={ref}
						value={displayValue}
						{...props}
					/>
				</span>
			);
		}

		return (
			<input
				className={cx('pds-input', className)}
				onChange={onChange}
				ref={ref}
				value={displayValue}
				{...props}
			/>
		);
	},
);

Input.displayName = 'Input';

export const Textarea = forwardRef<
	HTMLTextAreaElement,
	TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
	<textarea
		className={cx('pds-input pds-textarea', className)}
		ref={ref}
		{...props}
	/>
));

Textarea.displayName = 'Textarea';

export const Select = forwardRef<
	HTMLSelectElement,
	SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
	<select
		className={cx('pds-input pds-select', className)}
		ref={ref}
		{...props}
	>
		{children}
	</select>
));

Select.displayName = 'Select';

export interface SwitchProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
	({ className, label, ...props }, ref) => (
		<label className={cx('pds-switch', className)}>
			<input
				className="pds-switch__input"
				ref={ref}
				type="checkbox"
				{...props}
			/>
			<span className="pds-switch__track">
				<span className="pds-switch__thumb" />
			</span>
			{label ? <span className="pds-switch__label">{label}</span> : null}
		</label>
	),
);

Switch.displayName = 'Switch';

const zarCurrencyFormatter = new Intl.NumberFormat('en-ZA', {
	currency: 'ZAR',
	maximumFractionDigits: 0,
	style: 'currency',
});

/**
 * Formats a numeric value as South African Rand with no decimal places, e.g.
 * `2500000` → `R 2 500 000`. Handy as a `formatValue` for {@link Slider} when
 * the slider represents a budget. Shared so currency presentation stays
 * consistent across consumers.
 */
export const formatZarCurrency = (value: number): string =>
	zarCurrencyFormatter.format(value);

export interface SliderProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
	> {
	defaultValue?: number;
	formatValue?: (value: number) => ReactNode;
	label?: ReactNode;
	max?: number;
	min?: number;
	onValueChange?: (value: number) => void;
	size?: 'md' | 'lg';
	step?: number;
	value?: number;
}

export function Slider({
	className,
	defaultValue,
	formatValue = (sliderValue) => sliderValue,
	label,
	max = 100,
	min = 0,
	onValueChange,
	size = 'md',
	step = 1,
	value,
	...props
}: SliderProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(
		() => defaultValue ?? min,
	);
	const sliderValue = value ?? uncontrolledValue;
	const percentage =
		max === min
			? 0
			: Math.max(0, Math.min(100, ((sliderValue - min) / (max - min)) * 100));

	const setValue = (nextValue: number) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<label
			className={cx('pds-slider', size === 'lg' && 'pds-slider--lg', className)}
		>
			{label ? (
				<span className="pds-slider__header">
					<span>{label}</span>
					<strong>{formatValue(sliderValue)}</strong>
				</span>
			) : null}
			<span
				className="pds-slider__track"
				style={{ '--pds-slider-value': `${percentage}%` } as CSSProperties}
			>
				<input
					max={max}
					min={min}
					onChange={(event) => setValue(Number(event.target.value))}
					step={step}
					type="range"
					value={sliderValue}
					{...props}
				/>
			</span>
			<span className="pds-slider__scale">
				<span>{formatValue(min)}</span>
				<span>{formatValue(max)}</span>
			</span>
		</label>
	);
}

export interface RadioCardOption<TValue extends string = string> {
	description?: ReactNode;
	disabled?: boolean;
	icon?: ReactNode;
	label: ReactNode;
	meta?: ReactNode;
	value: TValue;
}

export interface RadioCardGroupProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	columns?: 1 | 2 | 3 | 4;
	defaultValue?: TValue;
	label?: ReactNode;
	onValueChange?: (value: TValue) => void;
	options: readonly RadioCardOption<TValue>[];
	value?: TValue;
}

export function RadioCardGroup<TValue extends string = string>({
	className,
	columns = 2,
	defaultValue,
	label,
	onValueChange,
	options,
	value,
	...props
}: RadioCardGroupProps<TValue>) {
	const groupId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState<
		TValue | undefined
	>(() => defaultValue ?? options[0]?.value);
	const activeValue = value ?? uncontrolledValue;

	const setValue = (nextValue: TValue) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<div
			className={cx(
				'pds-radio-card-group',
				`pds-radio-card-group--${columns}`,
				className,
			)}
			role="radiogroup"
			{...props}
		>
			{label ? (
				<div className="pds-radio-card-group__label">{label}</div>
			) : null}
			{options.map((option) => {
				const selected = option.value === activeValue;
				const optionId = `${groupId}-${option.value}`;

				return (
					<label
						className={cx(
							'pds-radio-card',
							selected && 'pds-radio-card--selected',
							option.disabled && 'pds-radio-card--disabled',
						)}
						htmlFor={optionId}
						key={option.value}
					>
						<input
							checked={selected}
							disabled={option.disabled}
							id={optionId}
							name={groupId}
							onChange={() => setValue(option.value)}
							type="radio"
							value={option.value}
						/>
						<span className="pds-radio-card__indicator" />
						<span className="pds-radio-card__copy">
							<span className="pds-radio-card__header">
								{option.icon ? (
									<span className="pds-radio-card__icon">{option.icon}</span>
								) : null}
								<strong>{option.label}</strong>
							</span>
							{option.description ? <small>{option.description}</small> : null}
							{option.meta ? (
								<span className="pds-radio-card__meta">{option.meta}</span>
							) : null}
						</span>
					</label>
				);
			})}
		</div>
	);
}
