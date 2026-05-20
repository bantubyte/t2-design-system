import {
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Button } from './button';
import { Icon } from './icons';

export interface BreadcrumbItem {
	current?: boolean;
	href?: string;
	label: ReactNode;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
	items: readonly BreadcrumbItem[];
}

export function Breadcrumbs({ className, items, ...props }: BreadcrumbsProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cx('pds-breadcrumbs', className)}
			{...props}
		>
			<ol>
				{items.map((item, index) => (
					<li key={index}>
						{item.href && !item.current ? (
							<a href={item.href}>{item.label}</a>
						) : (
							<span aria-current={item.current ? 'page' : undefined}>
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}

export interface SegmentedOption<TValue extends string = string> {
	disabled?: boolean;
	label: ReactNode;
	value: TValue;
}

export interface SegmentedControlProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	onChange?: (value: TValue) => void;
	options: readonly SegmentedOption<TValue>[];
	value: TValue;
}

export function SegmentedControl<TValue extends string = string>({
	className,
	onChange,
	options,
	value,
	...props
}: SegmentedControlProps<TValue>) {
	return (
		<div className={cx('pds-segmented-control', className)} {...props}>
			{options.map((option) => (
				<button
					aria-pressed={option.value === value}
					className="pds-segmented-control__option"
					disabled={option.disabled}
					key={option.value}
					onClick={() => onChange?.(option.value)}
					type="button"
				>
					{option.label}
				</button>
			))}
		</div>
	);
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
	ariaLabel?: string;
}

export function TabList({
	ariaLabel = 'Tabs',
	className,
	...props
}: TabListProps) {
	return (
		<div
			aria-label={ariaLabel}
			className={cx('pds-tab-list', className)}
			role="tablist"
			{...props}
		/>
	);
}

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	selected?: boolean;
}

export function Tab({ className, selected = false, ...props }: TabProps) {
	return (
		<button
			aria-selected={selected}
			className={cx('pds-tab', selected && 'pds-tab--selected', className)}
			role="tab"
			type="button"
			{...props}
		/>
	);
}

export interface TabsItem<TValue extends string = string> {
	badge?: ReactNode;
	disabled?: boolean;
	label: ReactNode;
	panel: ReactNode;
	value: TValue;
}

export interface TabsProps<TValue extends string = string>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	ariaLabel?: string;
	defaultValue?: TValue;
	items: readonly TabsItem<TValue>[];
	onValueChange?: (value: TValue) => void;
	value?: TValue;
}

const getInitialTabValue = <TValue extends string>(
	items: readonly TabsItem<TValue>[],
	defaultValue?: TValue,
) =>
	defaultValue ??
	items.find((item) => !item.disabled)?.value ??
	items[0]?.value;

export function Tabs<TValue extends string = string>({
	ariaLabel = 'Tabs',
	className,
	defaultValue,
	items,
	onValueChange,
	value,
	...props
}: TabsProps<TValue>) {
	const baseId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState<
		TValue | undefined
	>(() => getInitialTabValue(items, defaultValue));
	const activeValue = value ?? uncontrolledValue;
	const activeItem =
		items.find((item) => item.value === activeValue) ??
		items.find((item) => !item.disabled) ??
		items[0];

	const setValue = (nextValue: TValue) => {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	};

	return (
		<div className={cx('pds-tabs', className)} {...props}>
			<div aria-label={ariaLabel} className="pds-tabs__list" role="tablist">
				{items.map((item) => {
					const selected = item.value === activeItem?.value;
					const tabId = `${baseId}-${item.value}-tab`;
					const panelId = `${baseId}-${item.value}-panel`;

					return (
						<button
							aria-controls={panelId}
							aria-selected={selected}
							className={cx(
								'pds-tabs__tab',
								selected && 'pds-tabs__tab--active',
							)}
							disabled={item.disabled}
							id={tabId}
							key={item.value}
							onClick={() => setValue(item.value)}
							role="tab"
							tabIndex={selected ? 0 : -1}
							type="button"
						>
							<span>{item.label}</span>
							{item.badge ? (
								<span className="pds-tabs__badge">{item.badge}</span>
							) : null}
						</button>
					);
				})}
			</div>
			{activeItem ? (
				<div
					aria-labelledby={`${baseId}-${activeItem.value}-tab`}
					className="pds-tabs__panel"
					id={`${baseId}-${activeItem.value}-panel`}
					role="tabpanel"
				>
					{activeItem.panel}
				</div>
			) : null}
		</div>
	);
}

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
	onNext?: () => void;
	onPrevious?: () => void;
	page: number;
	pageCount: number;
}

export function Pagination({
	className,
	onNext,
	onPrevious,
	page,
	pageCount,
	...props
}: PaginationProps) {
	const totalPages = Math.max(1, pageCount);
	const safePage = Math.max(1, Math.min(page, totalPages));

	return (
		<div className={cx('pds-pagination', className)} {...props}>
			<Button
				disabled={safePage <= 1}
				onClick={onPrevious}
				size="sm"
				variant="outline"
			>
				Previous
			</Button>
			<span>
				Page {safePage} of {totalPages}
			</span>
			<Button
				disabled={safePage >= totalPages}
				onClick={onNext}
				size="sm"
				variant="outline"
			>
				Next
			</Button>
		</div>
	);
}

export interface SiteNavLink
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	active?: boolean;
	description?: ReactNode;
	label: ReactNode;
}

export type SiteNavScheme = 'auto' | 'dark' | 'light';

export interface SiteNavProps extends HTMLAttributes<HTMLElement> {
	ariaLabel?: string;
	cta?: ReactNode;
	links: readonly SiteNavLink[];
	logo?: ReactNode;
	mobileCta?: ReactNode;
	mobileOpen?: boolean;
	onMobileOpenChange?: (open: boolean) => void;
	scheme?: SiteNavScheme;
	sticky?: boolean;
}

export function SiteNav({
	ariaLabel = 'Primary',
	className,
	cta,
	links,
	logo,
	mobileCta,
	mobileOpen,
	onMobileOpenChange,
	scheme = 'auto',
	sticky = true,
	...props
}: SiteNavProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const isControlled = typeof mobileOpen === 'boolean';
	const open = isControlled ? mobileOpen : uncontrolledOpen;

	const setOpen = useCallback(
		(next: boolean) => {
			if (!isControlled) setUncontrolledOpen(next);
			onMobileOpenChange?.(next);
		},
		[isControlled, onMobileOpenChange],
	);

	const handleToggle = () => setOpen(!open);
	const handleClose = useCallback(() => setOpen(false), [setOpen]);

	return (
		<>
			<header
				className={cx(
					'pds-site-nav',
					sticky && 'pds-site-nav--sticky',
					`pds-site-nav--scheme-${scheme}`,
					className,
				)}
				{...props}
			>
				<div className="pds-site-nav__inner">
					<div className="pds-site-nav__brand">{logo}</div>
					<nav aria-label={ariaLabel} className="pds-site-nav__links">
						{links.map((link, index) => (
							<SiteNavAnchor key={index} link={link} />
						))}
					</nav>
					<div className="pds-site-nav__actions">
						{cta ? <span className="pds-site-nav__cta">{cta}</span> : null}
						<button
							aria-controls="pds-site-nav-mobile-sheet"
							aria-expanded={open}
							aria-label={open ? 'Close menu' : 'Open menu'}
							className="pds-site-nav__menu-toggle"
							onClick={handleToggle}
							type="button"
						>
							<Icon name={open ? 'close' : 'menu'} size={20} />
						</button>
					</div>
				</div>
			</header>
			<MobileMenuSheet
				cta={mobileCta ?? cta}
				id="pds-site-nav-mobile-sheet"
				links={links}
				logo={logo}
				onClose={handleClose}
				open={open}
				scheme={scheme === 'light' ? 'light' : 'dark'}
			/>
		</>
	);
}

function SiteNavAnchor({ link }: { link: SiteNavLink }) {
	const { active, description: _description, label, className, ...rest } = link;
	return (
		<a
			aria-current={active ? 'page' : undefined}
			className={cx(
				'pds-site-nav__link',
				active && 'pds-site-nav__link--active',
				className,
			)}
			{...rest}
		>
			{label}
		</a>
	);
}

export type MobileMenuSheetScheme = 'dark' | 'light';

export interface MobileMenuSheetProps extends HTMLAttributes<HTMLDivElement> {
	cta?: ReactNode;
	links: readonly SiteNavLink[];
	logo?: ReactNode;
	onClose?: () => void;
	open: boolean;
	scheme?: MobileMenuSheetScheme;
}

export function MobileMenuSheet({
	className,
	cta,
	links,
	logo,
	onClose,
	open,
	scheme = 'dark',
	...props
}: MobileMenuSheetProps) {
	useEffect(() => {
		if (!open) return;
		const handleKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose?.();
		};
		document.addEventListener('keydown', handleKey);
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = originalOverflow;
		};
	}, [open, onClose]);

	return (
		<div
			aria-hidden={!open}
			aria-label="Mobile menu"
			className={cx(
				'pds-mobile-menu-sheet',
				`pds-mobile-menu-sheet--scheme-${scheme}`,
				open && 'pds-mobile-menu-sheet--open',
				className,
			)}
			data-scheme={scheme}
			role="dialog"
			{...props}
		>
			<div className="pds-mobile-menu-sheet__header">
				<div className="pds-mobile-menu-sheet__brand">{logo}</div>
				<button
					aria-label="Close menu"
					className="pds-mobile-menu-sheet__close"
					onClick={onClose}
					type="button"
				>
					<Icon name="close" size={20} />
				</button>
			</div>
			<nav aria-label="Mobile sections" className="pds-mobile-menu-sheet__nav">
				{links.map((link, index) => (
					<MobileMenuRow key={index} link={link} onSelect={onClose} />
				))}
			</nav>
			{cta ? <div className="pds-mobile-menu-sheet__cta">{cta}</div> : null}
		</div>
	);
}

function MobileMenuRow({
	link,
	onSelect,
}: {
	link: SiteNavLink;
	onSelect?: () => void;
}) {
	const { active, description, label, className, onClick, ...rest } = link;
	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);
		onSelect?.();
	};
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: mobile menu rows are anchors with an onSelect hook that closes the sheet after default navigation.
		<a
			aria-current={active ? 'page' : undefined}
			className={cx(
				'pds-mobile-menu-sheet__row',
				active && 'pds-mobile-menu-sheet__row--active',
				className,
			)}
			// biome-ignore lint/a11y/useValidAnchor: this anchor navigates via href; onClick exists only to close the sheet on selection.
			onClick={handleClick}
			{...rest}
		>
			<span className="pds-mobile-menu-sheet__row-text">
				<span className="pds-mobile-menu-sheet__row-label">{label}</span>
				{description ? (
					<span className="pds-mobile-menu-sheet__row-description">
						{description}
					</span>
				) : null}
			</span>
			<Icon name="chevron-right" size={16} />
		</a>
	);
}
