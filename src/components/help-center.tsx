import {
	type AnchorHTMLAttributes,
	type HTMLAttributes,
	type ReactNode,
	useMemo,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Badge } from './badge';
import { Accordion } from './disclosure';
import { Icon, isPdsIconName, type PdsIconName } from './icons';

export interface HelpCenterCategory {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	id: string;
	label: ReactNode;
}

export interface HelpCenterFaq {
	answer: ReactNode;
	categoryId: string;
	featured?: boolean;
	id: string;
	question: ReactNode;
	tags?: readonly string[];
}

export interface HelpCenterLink
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	label: ReactNode;
}

export interface HelpCenterContactAction
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	label: ReactNode;
}

export interface HelpCenterProps
	extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'title'> {
	categories: readonly HelpCenterCategory[];
	categoryId?: string;
	contactActions?: readonly HelpCenterContactAction[];
	defaultCategoryId?: string;
	defaultSearchValue?: string;
	description?: ReactNode;
	emptyDescription?: ReactNode;
	emptyTitle?: ReactNode;
	eyebrow?: ReactNode;
	faqs: readonly HelpCenterFaq[];
	featuredLinks?: readonly HelpCenterLink[];
	onCategoryChange?: (categoryId: string) => void;
	onSearchChange?: (query: string) => void;
	searchPlaceholder?: string;
	searchValue?: string;
	title?: ReactNode;
}

const allCategoryId = 'all';

const nodeText = (value: ReactNode): string => {
	if (typeof value === 'string' || typeof value === 'number') {
		return String(value);
	}
	if (Array.isArray(value)) {
		return value.map(nodeText).join(' ');
	}
	return '';
};

const renderIcon = (icon: PdsIconName | ReactNode | undefined) => {
	if (!icon) return null;
	return isPdsIconName(icon) ? <Icon name={icon} size={18} /> : icon;
};

export function HelpCenter({
	categories,
	categoryId,
	className,
	contactActions = [],
	defaultCategoryId = allCategoryId,
	defaultSearchValue = '',
	description = 'Find quick answers, product guidance, and the right support route.',
	emptyDescription = 'Try a different search term or choose another help topic.',
	emptyTitle = 'No matching answers',
	eyebrow = 'Help Centre',
	faqs,
	featuredLinks = [],
	onCategoryChange,
	onSearchChange,
	searchPlaceholder = 'Search help articles',
	searchValue,
	title = 'How can we help?',
	...props
}: HelpCenterProps) {
	const [uncontrolledCategoryId, setUncontrolledCategoryId] =
		useState(defaultCategoryId);
	const [uncontrolledSearchValue, setUncontrolledSearchValue] =
		useState(defaultSearchValue);
	const activeCategoryId = categoryId ?? uncontrolledCategoryId;
	const activeSearchValue = searchValue ?? uncontrolledSearchValue;
	const categoryOptions = [
		{
			id: allCategoryId,
			label: 'All',
		},
		...categories,
	];
	const categoryLookup = new Map(
		categories.map((category) => [category.id, category]),
	);
	const normalizedQuery = activeSearchValue.trim().toLowerCase();
	const filteredFaqs = useMemo(
		() =>
			faqs.filter((faq) => {
				const categoryMatches =
					activeCategoryId === allCategoryId ||
					faq.categoryId === activeCategoryId;
				if (!categoryMatches) return false;
				if (!normalizedQuery) return true;

				const haystack = [
					nodeText(faq.question),
					nodeText(faq.answer),
					faq.categoryId,
					...(faq.tags ?? []),
				]
					.join(' ')
					.toLowerCase();
				return haystack.includes(normalizedQuery);
			}),
		[activeCategoryId, faqs, normalizedQuery],
	);
	const featuredFaqs = faqs.filter((faq) => faq.featured).slice(0, 3);

	const setCategory = (nextCategoryId: string) => {
		if (categoryId === undefined) {
			setUncontrolledCategoryId(nextCategoryId);
		}
		onCategoryChange?.(nextCategoryId);
	};

	const setSearch = (nextSearchValue: string) => {
		if (searchValue === undefined) {
			setUncontrolledSearchValue(nextSearchValue);
		}
		onSearchChange?.(nextSearchValue);
	};

	return (
		<section className={cx('pds-help-center', className)} {...props}>
			<header className="pds-help-center__hero">
				<div>
					{eyebrow ? (
						<p className="pds-help-center__eyebrow">{eyebrow}</p>
					) : null}
					<h1>{title}</h1>
					{description ? <p>{description}</p> : null}
				</div>
				<label className="pds-help-center__search">
					<span className="pds-visually-hidden">Search help centre</span>
					<Icon aria-hidden="true" name="search" size={18} />
					<input
						onChange={(event) => setSearch(event.target.value)}
						placeholder={searchPlaceholder}
						type="search"
						value={activeSearchValue}
					/>
				</label>
			</header>

			<div className="pds-help-center__body">
				<aside className="pds-help-center__rail">
					<nav aria-label="Help categories" className="pds-help-center__topics">
						{categoryOptions.map((category) => {
							const selected = category.id === activeCategoryId;
							return (
								<button
									aria-pressed={selected}
									className={cx(
										'pds-help-center__topic',
										selected && 'pds-help-center__topic--selected',
									)}
									data-category-id={category.id}
									key={category.id}
									onClick={() => setCategory(category.id)}
									type="button"
								>
									<span>
										{renderIcon(category.icon) ?? (
											<Icon name="help" size={16} />
										)}
									</span>
									<strong>{category.label}</strong>
									{category.description ? (
										<small>{category.description}</small>
									) : null}
								</button>
							);
						})}
					</nav>

					{contactActions.length ? (
						<div className="pds-help-center__contact">
							<strong>Still need help?</strong>
							{contactActions.map((action, index) => (
								<a {...action} key={index}>
									<span>
										{renderIcon(action.icon) ?? (
											<Icon name="support" size={16} />
										)}
									</span>
									<span>
										<strong>{action.label}</strong>
										{action.description ? (
											<small>{action.description}</small>
										) : null}
									</span>
								</a>
							))}
						</div>
					) : null}
				</aside>

				<div className="pds-help-center__main">
					{featuredLinks.length || featuredFaqs.length ? (
						<div className="pds-help-center__featured">
							{featuredLinks.map((link, index) => (
								<a {...link} key={`link-${index}`}>
									<span>
										{renderIcon(link.icon) ?? <Icon name="spark" size={18} />}
									</span>
									<span>
										<strong>{link.label}</strong>
										{link.description ? (
											<small>{link.description}</small>
										) : null}
									</span>
									<Icon aria-hidden="true" name="arrow-right" size={16} />
								</a>
							))}
							{featuredFaqs.map((faq) => (
								<div className="pds-help-center__featured-faq" key={faq.id}>
									<Badge tone="brand">Popular</Badge>
									<strong>{faq.question}</strong>
								</div>
							))}
						</div>
					) : null}

					<div className="pds-help-center__section-header">
						<div>
							<h2>Frequently asked questions</h2>
							<p>
								{filteredFaqs.length} answer
								{filteredFaqs.length === 1 ? '' : 's'}
								{activeCategoryId !== allCategoryId
									? ` in ${nodeText(categoryLookup.get(activeCategoryId)?.label ?? activeCategoryId)}`
									: ''}
							</p>
						</div>
					</div>

					{filteredFaqs.length ? (
						<Accordion
							className="pds-help-center__faqs"
							defaultOpenItems={[filteredFaqs[0]?.id ?? '']}
							items={filteredFaqs.map((faq) => ({
								content: (
									<div className="pds-help-center__faq-content">
										<div>{faq.answer}</div>
										{faq.tags?.length ? (
											<div className="pds-help-center__tags">
												{faq.tags.map((tag) => (
													<Badge key={tag} size="sm" tone="neutral">
														{tag}
													</Badge>
												))}
											</div>
										) : null}
									</div>
								),
								id: faq.id,
								title: (
									<span className="pds-help-center__faq">{faq.question}</span>
								),
							}))}
						/>
					) : (
						<div className="pds-help-center__empty">
							<Icon name="search" size={28} />
							<strong>{emptyTitle}</strong>
							<p>{emptyDescription}</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
