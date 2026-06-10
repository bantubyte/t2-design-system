import {
	forwardRef,
	type InputHTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
	useId,
	useState,
} from 'react';
import { cx } from '../utils/class-names';

export interface ComboboxOption {
	value: string;
	label: ReactNode;
	description?: ReactNode;
}

export type ComboboxStatus = 'default' | 'success' | 'warning' | 'danger';

export interface ComboboxProps
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'value' | 'onChange' | 'onSelect' | 'prefix'
	> {
	/** Controlled text value of the input. */
	value: string;
	/** Fired as the user types. */
	onValueChange: (value: string) => void;
	/** Current suggestions to show. The consumer owns fetching/debouncing. */
	options: readonly ComboboxOption[];
	/** Fired when the user picks an option (click or Enter). */
	onSelect: (option: ComboboxOption) => void;
	/** Show a loading row in the dropdown while suggestions are being fetched. */
	isLoading?: boolean;
	/** Border treatment for validation state. */
	status?: ComboboxStatus;
	/** Leading adornment (e.g. an icon). */
	prefix?: ReactNode;
	/** Shown when open, not loading, with a non-empty query and no options. */
	emptyLabel?: ReactNode;
	/** Row shown while `isLoading`. */
	loadingLabel?: ReactNode;
}

/**
 * A controlled autocomplete: a text input with an async suggestions dropdown,
 * loading state, keyboard navigation and validation status. The consumer owns
 * the data (typing → fetch → `options`/`isLoading`), keeping it source-agnostic.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
	(
		{
			className,
			emptyLabel = 'No matches',
			isLoading = false,
			loadingLabel = 'Searching…',
			onBlur,
			onFocus,
			onKeyDown,
			onSelect,
			onValueChange,
			options,
			prefix,
			status = 'default',
			value,
			...props
		},
		ref,
	) => {
		const listId = useId();
		const [open, setOpen] = useState(false);
		const [activeIndex, setActiveIndex] = useState(-1);

		const hasQuery = value.trim().length > 0;
		const showEmpty = !isLoading && options.length === 0 && hasQuery;
		const panelOpen = open && (isLoading || options.length > 0 || showEmpty);
		const clampedActive =
			activeIndex >= 0 && activeIndex < options.length ? activeIndex : -1;

		const choose = (index: number) => {
			const option = options[index];
			if (!option) return;
			onSelect(option);
			setOpen(false);
			setActiveIndex(-1);
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(event);
			if (event.defaultPrevented) return;

			if (event.key === 'ArrowDown' && options.length > 0) {
				event.preventDefault();
				setOpen(true);
				setActiveIndex((prev) => (prev + 1) % options.length);
			} else if (event.key === 'ArrowUp' && options.length > 0) {
				event.preventDefault();
				setOpen(true);
				setActiveIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
			} else if (event.key === 'Enter' && panelOpen && clampedActive >= 0) {
				event.preventDefault();
				choose(clampedActive);
			} else if (event.key === 'Escape') {
				setOpen(false);
				setActiveIndex(-1);
			}
		};

		return (
			<div
				className={cx(
					'pds-combobox',
					status !== 'default' && `pds-combobox--${status}`,
					className,
				)}
			>
				<div className="pds-combobox__control">
					{prefix ? (
						<span aria-hidden="true" className="pds-combobox__prefix">
							{prefix}
						</span>
					) : null}
					<input
						aria-activedescendant={
							clampedActive >= 0 ? `${listId}-${clampedActive}` : undefined
						}
						aria-autocomplete="list"
						aria-controls={panelOpen ? listId : undefined}
						aria-expanded={panelOpen}
						className={cx(
							'pds-input pds-combobox__input',
							Boolean(prefix) && 'pds-input--with-prefix',
						)}
						onBlur={(event) => {
							// Delay close so an option mousedown registers before blur.
							setTimeout(() => setOpen(false), 120);
							onBlur?.(event);
						}}
						onChange={(event) => {
							onValueChange(event.target.value);
							setOpen(true);
							setActiveIndex(-1);
						}}
						onFocus={(event) => {
							setOpen(true);
							onFocus?.(event);
						}}
						onKeyDown={handleKeyDown}
						ref={ref}
						role="combobox"
						type="text"
						value={value}
						{...props}
					/>
				</div>

				{panelOpen ? (
					<div className="pds-combobox__panel">
						{isLoading ? (
							<div className="pds-combobox__status">{loadingLabel}</div>
						) : showEmpty ? (
							<div className="pds-combobox__status">{emptyLabel}</div>
						) : (
							<div className="pds-combobox__list" id={listId} role="listbox">
								{options.map((option, index) => (
									<button
										aria-selected={index === clampedActive}
										className={cx(
											'pds-combobox__option',
											index === clampedActive && 'pds-combobox__option--active',
										)}
										id={`${listId}-${index}`}
										key={option.value}
										// onMouseDown (not onClick) so it fires before the input blur.
										onMouseDown={(event) => {
											event.preventDefault();
											choose(index);
										}}
										onMouseEnter={() => setActiveIndex(index)}
										role="option"
										type="button"
									>
										<span className="pds-combobox__option-label">
											{option.label}
										</span>
										{option.description ? (
											<span className="pds-combobox__option-desc">
												{option.description}
											</span>
										) : null}
									</button>
								))}
							</div>
						)}
					</div>
				) : null}
			</div>
		);
	},
);

Combobox.displayName = 'Combobox';
