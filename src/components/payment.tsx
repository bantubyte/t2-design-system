import {
	type FormEvent,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
	useMemo,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Badge } from './badge';
import { Button } from './button';
import { Field, Input, Textarea } from './form';
import { Icon, isPdsIconName, type PdsIconName } from './icons';

export interface PaymentAmountOption {
	description?: ReactNode;
	label: ReactNode;
	value: number;
}

export interface PaymentMethod {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	id: string;
	label: ReactNode;
}

export interface PaymentFormValues {
	amount: number;
	currency: string;
	email: string;
	message?: string;
	methodId: string;
	name: string;
	recurring: boolean;
}

export interface PaymentFormProps
	extends Omit<HTMLAttributes<HTMLElement>, 'onSubmit' | 'title'> {
	amountOptions?: readonly PaymentAmountOption[];
	currency?: string;
	customAmountLabel?: ReactNode;
	defaultAmount?: number;
	defaultEmail?: string;
	defaultMethodId?: string;
	defaultName?: string;
	description?: ReactNode;
	emailInputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'defaultValue' | 'name' | 'onChange' | 'type' | 'value'
	>;
	eyebrow?: ReactNode;
	messageLabel?: ReactNode;
	methods?: readonly PaymentMethod[];
	nameInputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'defaultValue' | 'name' | 'onChange' | 'type' | 'value'
	>;
	onAmountChange?: (amount: number) => void;
	onMethodChange?: (methodId: string) => void;
	onSubmit?: (values: PaymentFormValues) => void;
	recurringLabel?: ReactNode;
	showMessage?: boolean;
	submitLabel?: ReactNode;
	title?: ReactNode;
	trustCopy?: ReactNode;
}

const defaultAmountOptions: readonly PaymentAmountOption[] = [
	{ label: 'R100', value: 100 },
	{ label: 'R250', value: 250 },
	{ label: 'R500', value: 500 },
	{ label: 'R1,000', value: 1000 },
];

const defaultMethods: readonly PaymentMethod[] = [
	{
		description: 'Fast card checkout',
		icon: 'check',
		id: 'card',
		label: 'Card',
	},
	{
		description: 'Manual transfer or invoice',
		icon: 'download',
		id: 'eft',
		label: 'EFT',
	},
];

const currencyFormatters = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (currency: string) => {
	const key = `en-ZA-${currency}`;
	const existing = currencyFormatters.get(key);
	if (existing) return existing;
	const formatter = new Intl.NumberFormat('en-ZA', {
		currency,
		maximumFractionDigits: 0,
		style: 'currency',
	});
	currencyFormatters.set(key, formatter);
	return formatter;
};

const formatPaymentAmount = (amount: number, currency: string) => {
	if (currency === 'ZAR') {
		return `R${new Intl.NumberFormat('en-ZA', {
			maximumFractionDigits: 0,
		}).format(amount)}`;
	}
	return getCurrencyFormatter(currency).format(amount);
};

const renderPaymentIcon = (icon: PdsIconName | ReactNode | undefined) => {
	if (!icon) return null;
	return isPdsIconName(icon) ? <Icon name={icon} size={18} /> : icon;
};

export function PaymentForm({
	amountOptions = defaultAmountOptions,
	className,
	currency = 'ZAR',
	customAmountLabel = 'Custom amount',
	defaultAmount,
	defaultEmail = '',
	defaultMethodId,
	defaultName = '',
	description = 'Choose a contribution amount and complete the secure payment details.',
	emailInputProps,
	eyebrow = 'Payments',
	messageLabel = 'Message',
	methods = defaultMethods,
	nameInputProps,
	onAmountChange,
	onMethodChange,
	onSubmit,
	recurringLabel = 'Make this a monthly gift',
	showMessage = true,
	submitLabel = 'Continue to payment',
	title = 'Support the work',
	trustCopy = 'Payment processing should be connected by the host product. This component never stores card details.',
	...props
}: PaymentFormProps) {
	const initialAmount = defaultAmount ?? amountOptions[0]?.value ?? 0;
	const initialMethodId = defaultMethodId ?? methods[0]?.id ?? '';
	const [amount, setAmountValue] = useState(initialAmount);
	const [customAmount, setCustomAmount] = useState('');
	const [email, setEmail] = useState(defaultEmail);
	const [methodId, setMethodIdValue] = useState(initialMethodId);
	const [message, setMessage] = useState('');
	const [name, setName] = useState(defaultName);
	const [recurring, setRecurring] = useState(false);
	const formattedAmount = useMemo(
		() => formatPaymentAmount(amount, currency),
		[amount, currency],
	);
	const activeMethod = methods.find((method) => method.id === methodId);
	const presetSelected = amountOptions.some(
		(option) => option.value === amount,
	);

	const setAmount = (nextAmount: number) => {
		const safeAmount = Number.isFinite(nextAmount)
			? Math.max(0, nextAmount)
			: 0;
		setAmountValue(safeAmount);
		onAmountChange?.(safeAmount);
	};

	const setMethodId = (nextMethodId: string) => {
		setMethodIdValue(nextMethodId);
		onMethodChange?.(nextMethodId);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit?.({
			amount,
			currency,
			email,
			message: message || undefined,
			methodId,
			name,
			recurring,
		});
	};

	return (
		<section className={cx('pds-payment-form', className)} {...props}>
			<form className="pds-payment-form__shell" onSubmit={handleSubmit}>
				<div className="pds-payment-form__main">
					<header className="pds-payment-form__header">
						<div>
							{eyebrow ? <p>{eyebrow}</p> : null}
							<h1>{title}</h1>
							{description ? <span>{description}</span> : null}
						</div>
						<Badge tone={recurring ? 'success' : 'brand'}>
							{recurring ? 'Monthly gift' : 'One-off'}
						</Badge>
					</header>

					<Field label="Amount">
						<div className="pds-payment-form__amount-grid">
							{amountOptions.map((option) => {
								const selected = option.value === amount && presetSelected;
								return (
									<button
										aria-pressed={selected}
										className={cx(
											'pds-payment-form__amount',
											selected && 'pds-payment-form__amount--selected',
										)}
										data-amount-value={option.value}
										key={option.value}
										onClick={() => {
											setCustomAmount('');
											setAmount(option.value);
										}}
										type="button"
									>
										<strong>{option.label}</strong>
										{option.description ? (
											<small>{option.description}</small>
										) : null}
									</button>
								);
							})}
						</div>
					</Field>

					<Field label={customAmountLabel}>
						<Input
							inputMode="decimal"
							min={0}
							onChange={(event) => {
								setCustomAmount(event.target.value);
								setAmount(Number(event.target.value));
							}}
							placeholder="Enter another amount"
							type="number"
							value={customAmount}
						/>
					</Field>

					<fieldset className="pds-payment-form__methods">
						<legend>Payment method</legend>
						<div>
							{methods.map((method) => {
								const selected = method.id === methodId;
								return (
									<button
										aria-pressed={selected}
										className={cx(
											'pds-payment-form__method',
											selected && 'pds-payment-form__method--selected',
										)}
										data-method-id={method.id}
										key={method.id}
										onClick={() => setMethodId(method.id)}
										type="button"
									>
										<span>
											{renderPaymentIcon(method.icon) ?? (
												<Icon name="check" size={16} />
											)}
										</span>
										<strong>{method.label}</strong>
										{method.description ? (
											<small>{method.description}</small>
										) : null}
									</button>
								);
							})}
						</div>
					</fieldset>

					<div className="pds-payment-form__identity">
						<Field label="Name">
							<Input
								placeholder="Your name"
								required
								{...nameInputProps}
								name="name"
								onChange={(event) => setName(event.target.value)}
								type="text"
								value={name}
							/>
						</Field>
						<Field label="Email">
							<Input
								placeholder="you@example.com"
								required
								{...emailInputProps}
								name="email"
								onChange={(event) => setEmail(event.target.value)}
								type="email"
								value={email}
							/>
						</Field>
					</div>

					<label className="pds-payment-form__recurring">
						<input
							checked={recurring}
							name="recurring"
							onChange={(event) => setRecurring(event.target.checked)}
							type="checkbox"
						/>
						<span>
							<strong>{recurringLabel}</strong>
							<small>Steady support helps teams plan ahead.</small>
						</span>
					</label>

					{showMessage ? (
						<Field label={messageLabel}>
							<Textarea
								onChange={(event) => setMessage(event.target.value)}
								placeholder="Optional note"
								value={message}
							/>
						</Field>
					) : null}
				</div>

				<aside className="pds-payment-form__summary">
					<div>
						<span>Total</span>
						<strong>{formattedAmount}</strong>
						<small>{recurring ? 'Monthly gift' : 'One-off payment'}</small>
					</div>
					<dl>
						<div>
							<dt>Currency</dt>
							<dd>{currency}</dd>
						</div>
						<div>
							<dt>Method</dt>
							<dd>{activeMethod?.label ?? methodId}</dd>
						</div>
					</dl>
					<Button fullWidth type="submit">
						{submitLabel}
					</Button>
					<p>{trustCopy}</p>
				</aside>
			</form>
		</section>
	);
}
