import { type HTMLAttributes, type ReactNode, useMemo, useState } from 'react';
import { cx } from '../utils/class-names';

export interface CommandMenuItem<TValue extends string = string> {
	description?: ReactNode;
	disabled?: boolean;
	group?: string;
	keywords?: readonly string[];
	label: ReactNode;
	shortcut?: ReactNode;
	value: TValue;
}

export interface CommandMenuProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	emptyLabel?: ReactNode;
	items: readonly CommandMenuItem<TValue>[];
	onSelect?: (value: TValue) => void;
	placeholder?: string;
	query?: string;
	selectedValue?: TValue;
}

const commandSearchText = (value: ReactNode): string => {
	if (typeof value === 'string' || typeof value === 'number') {
		return String(value).toLowerCase();
	}
	if (Array.isArray(value)) return value.map(commandSearchText).join(' ');
	return '';
};

export function CommandMenu<TValue extends string = string>({
	className,
	emptyLabel = 'No results found',
	items,
	onSelect,
	placeholder = 'Search commands...',
	query,
	selectedValue,
	...props
}: CommandMenuProps<TValue>) {
	const [uncontrolledQuery, setUncontrolledQuery] = useState('');
	const activeQuery = query ?? uncontrolledQuery;
	const normalizedQuery = activeQuery.trim().toLowerCase();

	const filteredItems = useMemo(() => {
		if (!normalizedQuery) return items;

		return items.filter((item) => {
			const searchable = [
				item.value,
				item.group,
				commandSearchText(item.label),
				commandSearchText(item.description),
				...(item.keywords ?? []),
			]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();

			return searchable.includes(normalizedQuery);
		});
	}, [items, normalizedQuery]);

	const groupedItems = useMemo(() => {
		// Ungrouped items collapse under a sentinel ('') so we can omit the
		// group header entirely — otherwise a default "Commands" heading leaks
		// to the top of single-group dropdowns (e.g. Client/Agency/Brand).
		const groups = new Map<string, CommandMenuItem<TValue>[]>();
		for (const item of filteredItems) {
			const groupName = item.group ?? '';
			const groupItems = groups.get(groupName) ?? [];
			groupItems.push(item);
			groups.set(groupName, groupItems);
		}
		return Array.from(groups.entries());
	}, [filteredItems]);

	return (
		<div className={cx('pds-command-menu', className)} {...props}>
			<label className="pds-command-menu__search">
				<span aria-hidden="true">⌕</span>
				<input
					onChange={(event) => {
						if (query === undefined) {
							setUncontrolledQuery(event.target.value);
						}
					}}
					placeholder={placeholder}
					type="search"
					value={activeQuery}
				/>
			</label>
			<div className="pds-command-menu__list">
				{groupedItems.length > 0 ? (
					groupedItems.map(([groupName, groupItems]) => (
						<section
							className="pds-command-menu__group"
							key={groupName || '__ungrouped__'}
						>
							{groupName ? <h4>{groupName}</h4> : null}
							{groupItems.map((item) => (
								<button
									aria-pressed={item.value === selectedValue}
									className={cx(
										'pds-command-menu__item',
										item.value === selectedValue &&
											'pds-command-menu__item--selected',
									)}
									disabled={item.disabled}
									key={item.value}
									onClick={() => onSelect?.(item.value)}
									type="button"
								>
									<span className="pds-command-menu__copy">
										<strong>{item.label}</strong>
										{item.description ? (
											<small>{item.description}</small>
										) : null}
									</span>
									{item.shortcut ? (
										<kbd className="pds-command-menu__shortcut">
											{item.shortcut}
										</kbd>
									) : null}
								</button>
							))}
						</section>
					))
				) : (
					<div className="pds-command-menu__empty">{emptyLabel}</div>
				)}
			</div>
		</div>
	);
}
