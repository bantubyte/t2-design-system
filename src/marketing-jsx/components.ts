import { cx } from '../utils/class-names';
import { Fragment, h, type RawJsxNode } from './runtime';

export type RawPikabooWordmarkTone = 'auto' | 'dark' | 'light' | 'mono';

export interface RawPikabooWordmarkProps {
	accentColor?: string;
	accessibleLabel?: string;
	className?: string;
	height?: number;
	textColor?: string;
	tone?: RawPikabooWordmarkTone;
}

export function RawPikabooWordmark({
	accentColor,
	accessibleLabel = 'Pikaboo',
	className,
	height = 32,
	textColor,
	tone = 'auto',
}: RawPikabooWordmarkProps): RawJsxNode {
	const aspectRatio = 280 / 64;
	const eye = (cx_: number) =>
		h(
			'g',
			{ className: 'pds-pikaboo-wordmark__eye' },
			h('circle', {
				className: 'pds-pikaboo-wordmark__iris',
				cx: cx_,
				cy: 30,
				fill: textColor ?? 'currentColor',
				r: 22,
			}),
			h('circle', {
				className: 'pds-pikaboo-wordmark__pupil',
				cx: cx_,
				cy: 34,
				fill: accentColor ?? 'var(--theme-accent)',
				r: 7,
			}),
		);
	return h(
		'svg',
		{
			'aria-label': accessibleLabel,
			className: cx(
				'pds-pikaboo-wordmark',
				`pds-pikaboo-wordmark--tone-${tone}`,
				className,
			),
			fill: 'none',
			height,
			role: 'img',
			viewBox: '0 0 280 64',
			width: height * aspectRatio,
		},
		h('title', null, accessibleLabel),
		h(
			'text',
			{
				className: 'pds-pikaboo-wordmark__text',
				dominantBaseline: 'auto',
				fill: textColor ?? 'currentColor',
				fontFamily:
					'"Bricolage Grotesque", var(--theme-font-heading), Helvetica Neue, Helvetica, Arial, sans-serif',
				fontSize: 58,
				fontWeight: 800,
				letterSpacing: '-2.4',
				x: 0,
				y: 48,
			},
			'pikab',
		),
		eye(180),
		eye(232),
	);
}

export type RawPageBlockBrand = 'pikaboo' | 'primedia';
export type RawPageBlockTone = 'expressive' | 'product' | 'relief' | 'serious';
export type RawPageBlockScheme = 'dark' | 'light';

export interface RawPageBlockThemeProps {
	brand?: RawPageBlockBrand;
	scheme?: RawPageBlockScheme;
	tone?: RawPageBlockTone;
}

interface RawHtmlAnchorAttrs {
	className?: string;
	download?: boolean | string;
	href?: string;
	id?: string;
	rel?: string;
	target?: string;
	title?: string;
}

interface RawHtmlSectionAttrs {
	className?: string;
	id?: string;
}

export interface RawPageBlockAction extends RawHtmlAnchorAttrs {
	icon?: RawJsxNode;
	intent?: 'default' | 'urgent';
	label: RawJsxNode;
	variant?: 'primary' | 'secondary' | 'text';
}

const themeClassNames = ({
	brand = 'pikaboo',
	scheme = 'light',
	tone = 'serious',
}: RawPageBlockThemeProps): string[] => [
	'pds-page-blocks',
	`pds-page-blocks--brand-${brand}`,
	`pds-page-blocks--scheme-${scheme}`,
	`pds-page-blocks--tone-${tone}`,
];

const renderPageAction = (
	action: RawPageBlockAction,
	key: number,
): RawJsxNode => {
	const {
		className,
		icon,
		intent = 'default',
		label,
		variant = 'primary',
		...rest
	} = action;
	return h(
		'a',
		{
			...rest,
			className: cx(
				'pds-page-action',
				`pds-page-action--${variant}`,
				`pds-page-action--${intent}`,
				className,
			),
			key,
		},
		icon ?? null,
		h('span', null, label),
	);
};

export interface RawPageHeroProps
	extends RawHtmlSectionAttrs,
		RawPageBlockThemeProps {
	actions?: readonly RawPageBlockAction[];
	description?: RawJsxNode;
	eyebrow?: RawJsxNode;
	media?: RawJsxNode;
	title: RawJsxNode;
	trustNote?: RawJsxNode;
}

export function RawPageHero({
	actions = [],
	brand = 'pikaboo',
	className,
	description,
	eyebrow,
	media,
	scheme = 'light',
	title,
	tone = 'serious',
	trustNote,
	...props
}: RawPageHeroProps): RawJsxNode {
	return h(
		'section',
		{
			...props,
			className: cx(
				...themeClassNames({ brand, scheme, tone }),
				'pds-page-hero',
				className,
			),
		},
		h(
			'div',
			{ className: 'pds-page-hero__copy' },
			eyebrow ? h('p', { className: 'pds-page-hero__eyebrow' }, eyebrow) : null,
			h('h1', null, title),
			description
				? h('p', { className: 'pds-page-hero__description' }, description)
				: null,
			actions.length
				? h(
						'div',
						{ className: 'pds-page-hero__actions' },
						...actions.map((action, index) => renderPageAction(action, index)),
					)
				: null,
			trustNote
				? h('p', { className: 'pds-page-hero__trust' }, trustNote)
				: null,
		),
		h(
			'div',
			{
				className: cx(
					'pds-page-hero__media',
					!media && 'pds-page-hero__media--generated',
				),
			},
			media ?? null,
		),
	);
}

// =============================================================================
// Icon
// =============================================================================

export const rawPdsIconNames = [
	'arrow-right',
	'calendar',
	'campaign',
	'chart',
	'check',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'close',
	'download',
	'filter',
	'github',
	'google',
	'grid',
	'help',
	'linkedin',
	'mail',
	'map',
	'menu',
	'minus',
	'moon',
	'plus',
	'quote',
	'search',
	'settings',
	'spark',
	'sun',
	'support',
	'twitter',
	'upload',
	'users',
	'whatsapp',
] as const;

export type RawPdsIconName = (typeof rawPdsIconNames)[number];

type RawIconPath = {
	d?: string;
	element?: 'circle' | 'line' | 'path' | 'polyline' | 'rect';
	fill?: string;
	points?: string;
	props?: Record<string, number | string>;
	stroke?: string;
};

const rawIconPaths: Record<RawPdsIconName, readonly RawIconPath[]> = {
	'arrow-right': [
		{ d: 'M5 12h14', element: 'path' },
		{ d: 'm13 6 6 6-6 6', element: 'path' },
	],
	calendar: [
		{ element: 'rect', props: { height: 16, rx: 2, width: 18, x: 3, y: 4 } },
		{ d: 'M8 2v4', element: 'path' },
		{ d: 'M16 2v4', element: 'path' },
		{ d: 'M3 10h18', element: 'path' },
		{ d: 'M8 14h.01', element: 'path' },
		{ d: 'M12 14h.01', element: 'path' },
		{ d: 'M16 14h.01', element: 'path' },
	],
	campaign: [
		{ d: 'M4 14h3l8 4V6L7 10H4v4Z', element: 'path' },
		{ d: 'M18 9c1 .8 1.5 1.8 1.5 3S19 14.2 18 15', element: 'path' },
		{ d: 'M7 14v5', element: 'path' },
	],
	chart: [
		{ d: 'M4 19V5', element: 'path' },
		{ d: 'M4 19h16', element: 'path' },
		{ d: 'M8 16V9', element: 'path' },
		{ d: 'M12 16V6', element: 'path' },
		{ d: 'M16 16v-4', element: 'path' },
	],
	check: [{ d: 'm5 12 4 4L19 6', element: 'path' }],
	'chevron-down': [{ d: 'm6 9 6 6 6-6', element: 'path' }],
	'chevron-left': [{ d: 'm15 18-6-6 6-6', element: 'path' }],
	'chevron-right': [{ d: 'm9 18 6-6-6-6', element: 'path' }],
	close: [
		{ d: 'm6 6 12 12', element: 'path' },
		{ d: 'M18 6 6 18', element: 'path' },
	],
	download: [
		{ d: 'M12 3v12', element: 'path' },
		{ d: 'm7 10 5 5 5-5', element: 'path' },
		{ d: 'M5 21h14', element: 'path' },
	],
	filter: [
		{ d: 'M4 5h16', element: 'path' },
		{ d: 'M7 12h10', element: 'path' },
		{ d: 'M10 19h4', element: 'path' },
	],
	github: [
		{
			d: 'M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.46.08.62-.2.62-.44v-1.55c-2.52.55-3.05-1.08-3.05-1.08-.41-1.05-1-1.33-1-1.33-.83-.57.06-.56.06-.56.92.06 1.4.94 1.4.94.82 1.4 2.14 1 2.66.76.08-.59.32-1 .58-1.23-2.01-.23-4.13-1-4.13-4.48 0-.99.35-1.8.94-2.43-.1-.23-.41-1.16.09-2.4 0 0 .77-.25 2.52.93A8.7 8.7 0 0 1 12 7.53c.78 0 1.55.1 2.28.31 1.75-1.18 2.52-.93 2.52-.93.5 1.24.19 2.17.09 2.4.59.63.94 1.44.94 2.43 0 3.49-2.12 4.25-4.14 4.48.33.28.62.83.62 1.68v2.36c0 .24.16.53.63.44A9.2 9.2 0 0 0 12 2.8Z',
			element: 'path',
			fill: 'currentColor',
			stroke: 'none',
		},
	],
	google: [
		{
			d: 'M21 12.2c0-.7-.06-1.38-.18-2.02H12v3.82h5.05a4.32 4.32 0 0 1-1.87 2.84v2.36h3.03C19.99 17.56 21 15.15 21 12.2Z',
			element: 'path',
		},
		{
			d: 'M12 21c2.43 0 4.47-.8 5.96-2.18l-3.03-2.36c-.84.56-1.91.89-2.93.89-2.25 0-4.16-1.52-4.84-3.56H4.03v2.43A9 9 0 0 0 12 21Z',
			element: 'path',
		},
		{
			d: 'M7.16 13.79A5.42 5.42 0 0 1 7.16 10.2V7.78H4.03a9 9 0 0 0 0 8.44l3.13-2.43Z',
			element: 'path',
		},
		{
			d: 'M12 6.65c1.32 0 2.5.45 3.43 1.34l2.57-2.57A8.64 8.64 0 0 0 12 3 9 9 0 0 0 4.03 7.78l3.13 2.43C7.84 8.17 9.75 6.65 12 6.65Z',
			element: 'path',
		},
	],
	grid: [
		{ element: 'rect', props: { height: 7, rx: 1, width: 7, x: 3, y: 3 } },
		{ element: 'rect', props: { height: 7, rx: 1, width: 7, x: 14, y: 3 } },
		{ element: 'rect', props: { height: 7, rx: 1, width: 7, x: 3, y: 14 } },
		{ element: 'rect', props: { height: 7, rx: 1, width: 7, x: 14, y: 14 } },
	],
	help: [
		{ element: 'circle', props: { cx: 12, cy: 12, r: 9 } },
		{
			d: 'M9.6 9a2.6 2.6 0 1 1 4.1 2.1c-.9.54-1.7 1.12-1.7 2.4',
			element: 'path',
		},
		{ d: 'M12 17h.01', element: 'path' },
	],
	linkedin: [
		{ element: 'rect', props: { height: 18, rx: 2, width: 18, x: 3, y: 3 } },
		{ d: 'M8 10v7', element: 'path' },
		{ d: 'M8 7h.01', element: 'path' },
		{ d: 'M12 17v-4a2 2 0 0 1 4 0v4', element: 'path' },
		{ d: 'M12 10v7', element: 'path' },
	],
	mail: [
		{ element: 'rect', props: { height: 16, rx: 2, width: 20, x: 2, y: 4 } },
		{ d: 'm2 7 10 6 10-6', element: 'path' },
	],
	map: [
		{ d: 'M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z', element: 'path' },
		{ d: 'M9 3v15', element: 'path' },
		{ d: 'M15 6v15', element: 'path' },
	],
	menu: [
		{ d: 'M4 7h16', element: 'path' },
		{ d: 'M4 12h16', element: 'path' },
		{ d: 'M4 17h16', element: 'path' },
	],
	minus: [{ d: 'M5 12h14', element: 'path' }],
	moon: [
		{
			d: 'M20.5 14.5A8 8 0 0 1 9.5 3.5 8 8 0 1 0 20.5 14.5Z',
			element: 'path',
		},
	],
	plus: [
		{ d: 'M12 5v14', element: 'path' },
		{ d: 'M5 12h14', element: 'path' },
	],
	quote: [
		{ d: 'M7 7h4v6c0 2.2-1.5 3.7-3.5 4', element: 'path' },
		{ d: 'M15 7h4v6c0 2.2-1.5 3.7-3.5 4', element: 'path' },
	],
	search: [
		{ element: 'circle', props: { cx: 11, cy: 11, r: 7 } },
		{ d: 'm16 16 4 4', element: 'path' },
	],
	settings: [
		{ element: 'circle', props: { cx: 12, cy: 12, r: 3 } },
		{
			d: 'M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.36a1.7 1.7 0 0 0-1 .64V20a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1-.64 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-.64-1H4a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 .64-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1-.64V4a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 .64 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9c.25.36.46.7.64 1H20a2 2 0 1 1 0 4h-.08c-.18.3-.39.64-.52 1Z',
			element: 'path',
		},
	],
	spark: [
		{
			d: 'M12 2 14.4 8.6 21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z',
			element: 'path',
		},
	],
	sun: [
		{ element: 'circle', props: { cx: 12, cy: 12, r: 4 } },
		{ d: 'M12 2v2', element: 'path' },
		{ d: 'M12 20v2', element: 'path' },
		{ d: 'M4.93 4.93l1.41 1.41', element: 'path' },
		{ d: 'M17.66 17.66l1.41 1.41', element: 'path' },
		{ d: 'M2 12h2', element: 'path' },
		{ d: 'M20 12h2', element: 'path' },
		{ d: 'M4.93 19.07l1.41-1.41', element: 'path' },
		{ d: 'M17.66 6.34l1.41-1.41', element: 'path' },
	],
	support: [
		{ element: 'circle', props: { cx: 12, cy: 12, r: 9 } },
		{ d: 'M8 12a4 4 0 0 1 8 0v4a2 2 0 0 1-2 2h-1', element: 'path' },
		{ d: 'M8 13v-1', element: 'path' },
		{ d: 'M16 13v-1', element: 'path' },
	],
	twitter: [
		{
			d: 'M4 4 11 13l-7 7h2.5L13 14.5 17.5 20H21l-7.5-9.5L20 4h-2.5l-5 5.5L8 4Z',
			element: 'path',
			fill: 'currentColor',
			stroke: 'none',
		},
	],
	upload: [
		{ d: 'M12 21V9', element: 'path' },
		{ d: 'm7 14 5-5 5 5', element: 'path' },
		{ d: 'M5 3h14', element: 'path' },
	],
	users: [
		{ element: 'circle', props: { cx: 9, cy: 8, r: 3 } },
		{ d: 'M3 20a6 6 0 0 1 12 0', element: 'path' },
		{ element: 'circle', props: { cx: 17, cy: 10, r: 2.5 } },
		{ d: 'M15.5 15.5A5 5 0 0 1 21 20', element: 'path' },
	],
	whatsapp: [
		{ d: 'M5.2 20.2 6.3 16A8 8 0 1 1 9 18.7l-3.8 1.5Z', element: 'path' },
		{
			d: 'M9.2 8.8c.2-.5.45-.5.73-.5h.54c.17 0 .43.06.66.48.25.46.84 1.62.91 1.74.08.12.12.27.02.44-.1.18-.16.28-.31.43l-.47.52c-.16.16-.33.34-.14.67.18.33.8 1.32 1.72 2.13 1.18 1.05 2.18 1.38 2.5 1.53.33.16.52.13.71-.08.2-.23.82-.96 1.04-1.29.22-.33.44-.27.74-.16.31.1 1.93.91 2.26 1.08.33.16.55.25.63.39.08.14.08.8-.2 1.56-.28.76-1.62 1.45-2.26 1.5-.58.05-1.3.07-2.1-.13-.48-.12-1.1-.36-1.9-.7-3.33-1.44-5.5-4.8-5.67-5.03-.16-.23-1.35-1.8-1.35-3.43 0-1.63.85-2.43 1.15-2.76Z',
			element: 'path',
		},
	],
};

export const isRawPdsIconName = (value: unknown): value is RawPdsIconName =>
	typeof value === 'string' &&
	(rawPdsIconNames as readonly string[]).includes(value);

export interface RawIconProps {
	className?: string;
	name: RawPdsIconName;
	size?: number | string;
	title?: string;
}

export function RawIcon({
	className,
	name,
	size = 20,
	title,
}: RawIconProps): RawJsxNode {
	const titleId = title
		? `pds-icon-${name}-${title.replace(/\s+/g, '-')}`
		: undefined;
	const paths = rawIconPaths[name].map((path, index) => {
		const element = path.element ?? 'path';
		const commonProps: Record<string, unknown> = {
			fill: path.fill ?? 'none',
			key: `${name}-${index}`,
			stroke: path.stroke ?? 'currentColor',
			...path.props,
		};
		if (element === 'circle') return h('circle', commonProps);
		if (element === 'line') return h('line', commonProps);
		if (element === 'polyline')
			return h('polyline', { ...commonProps, points: path.points });
		if (element === 'rect') return h('rect', commonProps);
		return h('path', { ...commonProps, d: path.d });
	});
	return h(
		'svg',
		{
			'aria-hidden': title ? undefined : 'true',
			'aria-labelledby': titleId,
			className: cx('pds-icon', className),
			fill: 'none',
			height: size,
			role: title ? 'img' : undefined,
			stroke: 'currentColor',
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			strokeWidth: '2',
			viewBox: '0 0 24 24',
			width: size,
		},
		title ? h('title', { id: titleId }, title) : null,
		...paths,
	);
}

const renderRawBlockIcon = (
	icon: RawPdsIconName | RawJsxNode | undefined,
): RawJsxNode => {
	if (icon === null || icon === undefined) return null;
	return isRawPdsIconName(icon) ? RawIcon({ name: icon, size: 20 }) : icon;
};

// =============================================================================
// LogoCloud
// =============================================================================

export type RawLogoCloudVariant = 'band' | 'default';

export interface RawLogoCloudProps extends RawHtmlSectionAttrs {
	eyebrow?: RawJsxNode;
	items: readonly RawJsxNode[];
	title?: RawJsxNode;
	variant?: RawLogoCloudVariant;
}

export function RawLogoCloud({
	className,
	eyebrow,
	items,
	title = 'Trusted by teams building with the suite',
	variant = 'default',
	...props
}: RawLogoCloudProps): RawJsxNode {
	const isBand = variant === 'band';
	return h(
		'section',
		{
			...props,
			className: cx(
				'pds-logo-cloud',
				isBand && 'pds-logo-cloud--band',
				className,
			),
		},
		eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
		title && !isBand ? h('h2', null, title) : null,
		title && isBand
			? h('span', { className: 'pds-visually-hidden' }, title)
			: null,
		h('ul', null, ...items.map((item, index) => h('li', { key: index }, item))),
	);
}

// =============================================================================
// FeatureGrid
// =============================================================================

export interface RawPageFeatureItem {
	description?: RawJsxNode;
	icon?: RawPdsIconName | RawJsxNode;
	title: RawJsxNode;
}

export interface RawFeatureGridProps extends RawHtmlSectionAttrs {
	description?: RawJsxNode;
	items: readonly RawPageFeatureItem[];
	title?: RawJsxNode;
}

export function RawFeatureGrid({
	className,
	description,
	items,
	title = 'Built for the work around the page',
	...props
}: RawFeatureGridProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-feature-grid-section', className) },
		h(
			'header',
			{ className: 'pds-page-section-header' },
			h('h2', null, title),
			description ? h('p', null, description) : null,
		),
		h(
			'ul',
			{ className: 'pds-feature-grid' },
			...items.map((item, index) =>
				h(
					'li',
					{ className: 'pds-feature-card', key: index },
					item.icon
						? h(
								'span',
								{ className: 'pds-feature-card__icon' },
								renderRawBlockIcon(item.icon),
							)
						: null,
					h('strong', null, item.title),
					item.description ? h('p', null, item.description) : null,
				),
			),
		),
	);
}

// =============================================================================
// StatsStrip
// =============================================================================

export interface RawPageStatItem {
	label: RawJsxNode;
	value: RawJsxNode;
}

export interface RawStatsStripProps extends RawHtmlSectionAttrs {
	items: readonly RawPageStatItem[];
}

export function RawStatsStrip({
	className,
	items,
	...props
}: RawStatsStripProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-stats-strip', className) },
		h(
			'ul',
			null,
			...items.map((item, index) =>
				h(
					'li',
					{ key: index },
					h('strong', null, item.value),
					h('span', null, item.label),
				),
			),
		),
	);
}

// =============================================================================
// AnnotatedHeadline + AnnotatedText
// =============================================================================

export type RawAnnotatedHeadlineAnnotation =
	| 'highlight'
	| 'squiggle'
	| 'underline';

export interface RawAnnotatedTextProps {
	annotation?: RawAnnotatedHeadlineAnnotation;
	children?: RawJsxNode;
	className?: string;
}

export function RawAnnotatedText({
	annotation,
	children,
	className,
}: RawAnnotatedTextProps): RawJsxNode {
	return h(
		'span',
		{
			className: cx(
				'pds-annotated-headline__token',
				annotation && `pds-annotated-headline__token--${annotation}`,
				className,
			),
		},
		h('span', { className: 'pds-annotated-headline__token-text' }, children),
		annotation === 'squiggle'
			? h(
					'svg',
					{
						'aria-hidden': 'true',
						className: 'pds-annotated-headline__squiggle',
						preserveAspectRatio: 'none',
						viewBox: '0 0 200 14',
					},
					h('path', {
						d: 'M2 9 Q 20 2 40 8 T 80 8 T 120 8 T 160 8 T 198 8',
						fill: 'none',
						stroke: 'currentColor',
						strokeLinecap: 'round',
						strokeWidth: '5',
					}),
				)
			: null,
	);
}

export type RawAnnotatedHeadlineDoodleType = 'arrows' | 'crown' | 'squiggle';
export type RawAnnotatedHeadlineDoodlePosition =
	| 'bottom-left'
	| 'bottom-right'
	| 'top-left'
	| 'top-right';

export interface RawAnnotatedHeadlineDoodle {
	position: RawAnnotatedHeadlineDoodlePosition;
	type: RawAnnotatedHeadlineDoodleType;
}

export interface RawAnnotatedHeadlineProps extends RawHtmlSectionAttrs {
	body?: RawJsxNode;
	doodles?: readonly RawAnnotatedHeadlineDoodle[];
	eyebrow?: RawJsxNode;
	headline: RawJsxNode;
}

const rawAnnotatedHeadlineDoodlePath: Record<
	RawAnnotatedHeadlineDoodleType,
	string
> = {
	arrows: 'M2 30 Q 20 6 50 30 T 96 30 M 80 18 l 16 12 -16 12',
	crown: 'M4 26 L14 8 L24 22 L34 6 L44 22 L54 10 L60 30 Z',
	squiggle: 'M2 16 Q 14 2 26 16 T 50 16 T 74 16 T 96 16',
};

export function RawAnnotatedHeadline({
	body,
	className,
	doodles,
	eyebrow,
	headline,
	...props
}: RawAnnotatedHeadlineProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-annotated-headline', className) },
		eyebrow
			? h(
					'p',
					{ className: 'pds-page-eyebrow pds-annotated-headline__eyebrow' },
					eyebrow,
				)
			: null,
		h(
			'h2',
			{ className: 'pds-annotated-headline__headline' },
			headline,
			...(doodles?.map((doodle, index) =>
				h(
					'svg',
					{
						'aria-hidden': 'true',
						className: cx(
							'pds-annotated-headline__doodle',
							`pds-annotated-headline__doodle--${doodle.type}`,
							`pds-annotated-headline__doodle--${doodle.position}`,
						),
						fill: 'none',
						key: index,
						stroke: 'currentColor',
						strokeLinecap: 'round',
						strokeLinejoin: 'round',
						strokeWidth: '3',
						viewBox: '0 0 100 40',
					},
					h('path', { d: rawAnnotatedHeadlineDoodlePath[doodle.type] }),
				),
			) ?? []),
		),
		body ? h('p', { className: 'pds-annotated-headline__body' }, body) : null,
	);
}

// =============================================================================
// ProcessTimeline
// =============================================================================

export interface RawProcessTimelineStep {
	description?: RawJsxNode;
	icon?: RawPdsIconName | RawJsxNode;
	id?: string;
	number?: RawJsxNode;
	title: RawJsxNode;
}

export interface RawProcessTimelineProps extends RawHtmlSectionAttrs {
	eyebrow?: RawJsxNode;
	headline?: RawJsxNode;
	steps: readonly RawProcessTimelineStep[];
}

export function RawProcessTimeline({
	className,
	eyebrow,
	headline,
	steps,
	...props
}: RawProcessTimelineProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-process-timeline', className) },
		eyebrow || headline
			? h(
					'header',
					{
						className:
							'pds-page-section-header pds-page-section-header--centered',
					},
					eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
					headline ? h('h2', null, headline) : null,
				)
			: null,
		h(
			'ol',
			{ className: 'pds-process-timeline__steps' },
			h('span', {
				'aria-hidden': 'true',
				className: 'pds-process-timeline__connector',
			}),
			...steps.map((step, index) => {
				const numberLabel = step.number ?? String(index + 1).padStart(2, '0');
				return h(
					'li',
					{ className: 'pds-process-timeline__step', key: step.id ?? index },
					h(
						'span',
						{ className: 'pds-process-timeline__icon' },
						renderRawBlockIcon(step.icon ?? 'spark'),
					),
					h('span', { className: 'pds-process-timeline__number' }, numberLabel),
					h('h3', { className: 'pds-process-timeline__title' }, step.title),
					step.description
						? h(
								'p',
								{ className: 'pds-process-timeline__description' },
								step.description,
							)
						: null,
				);
			}),
		),
	);
}

// =============================================================================
// TeamGrid
// =============================================================================

export type RawTeamMemberTone = 'magenta' | 'purple' | 'slate';

export interface RawTeamMember {
	bio?: RawJsxNode;
	brandTag?: RawJsxNode;
	id?: string;
	name: RawJsxNode;
	photo?: RawJsxNode;
	role?: RawJsxNode;
	tone?: RawTeamMemberTone;
}

export interface RawTeamGridProps extends RawHtmlSectionAttrs {
	eyebrow?: RawJsxNode;
	headline?: RawJsxNode;
	linkHref?: string;
	linkLabel?: RawJsxNode;
	people: readonly RawTeamMember[];
}

export function RawTeamGrid({
	className,
	eyebrow,
	headline,
	linkHref,
	linkLabel,
	people,
	...props
}: RawTeamGridProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-team-grid-section', className) },
		eyebrow || headline || linkLabel
			? h(
					'header',
					{ className: 'pds-team-grid-section__header' },
					h(
						'div',
						null,
						eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
						headline ? h('h2', null, headline) : null,
					),
					linkLabel
						? h(
								'a',
								{
									className: 'pds-team-grid-section__link',
									href: linkHref ?? '#',
								},
								h('span', null, linkLabel),
								RawIcon({ name: 'arrow-right', size: 14 }),
							)
						: null,
				)
			: null,
		h(
			'ul',
			{ className: 'pds-team-grid' },
			...people.map((person, index) =>
				h(
					'li',
					{
						className: cx(
							'pds-team-grid__person',
							person.tone && `pds-team-grid__person--tone-${person.tone}`,
						),
						key: person.id ?? index,
					},
					h(
						'div',
						{ className: 'pds-team-grid__photo' },
						person.photo ??
							h('div', { className: 'pds-team-grid__photo-placeholder' }),
						person.brandTag
							? h('span', { className: 'pds-team-grid__tag' }, person.brandTag)
							: null,
					),
					h('h3', { className: 'pds-team-grid__name' }, person.name),
					person.role
						? h('p', { className: 'pds-team-grid__role' }, person.role)
						: null,
					person.bio
						? h('p', { className: 'pds-team-grid__bio' }, person.bio)
						: null,
				),
			),
		),
	);
}

// =============================================================================
// TestimonialBand
// =============================================================================

export type RawTestimonialBandVariant = 'default' | 'pull';

export type RawTestimonialAccentDoodle =
	| 'arrows'
	| 'crown'
	| 'none'
	| 'squiggle';

export interface RawTestimonialBandProps extends RawHtmlSectionAttrs {
	accentDoodle?: RawTestimonialAccentDoodle;
	attribution?: RawJsxNode;
	authorAvatar?: RawJsxNode;
	authorName?: RawJsxNode;
	authorRole?: RawJsxNode;
	eyebrow?: RawJsxNode;
	photo?: RawJsxNode;
	quote: RawJsxNode;
	variant?: RawTestimonialBandVariant;
}

export function RawTestimonialBand({
	accentDoodle = 'none',
	attribution,
	authorAvatar,
	authorName,
	authorRole,
	className,
	eyebrow,
	photo,
	quote,
	variant = 'default',
	...props
}: RawTestimonialBandProps): RawJsxNode {
	if (variant === 'pull') {
		return h(
			'section',
			{
				...props,
				className: cx(
					'pds-testimonial-band',
					'pds-testimonial-band--pull',
					className,
				),
			},
			h(
				'div',
				{ className: 'pds-testimonial-band__photo' },
				photo,
				accentDoodle !== 'none'
					? h('span', {
							'aria-hidden': 'true',
							className: cx(
								'pds-testimonial-band__doodle',
								`pds-testimonial-band__doodle--${accentDoodle}`,
							),
						})
					: null,
			),
			h(
				'div',
				{ className: 'pds-testimonial-band__copy' },
				eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
				RawIcon({
					className: 'pds-testimonial-band__quote-icon',
					name: 'quote',
					size: 40,
				}),
				h('blockquote', null, h('p', null, quote)),
				authorName || authorRole || authorAvatar
					? h(
							'div',
							{ className: 'pds-testimonial-band__author' },
							authorAvatar
								? h(
										'span',
										{ className: 'pds-testimonial-band__avatar' },
										authorAvatar,
									)
								: null,
							h(
								'div',
								{ className: 'pds-testimonial-band__author-text' },
								authorName
									? h(
											'span',
											{ className: 'pds-testimonial-band__author-name' },
											authorName,
										)
									: null,
								authorRole
									? h(
											'span',
											{ className: 'pds-testimonial-band__author-role' },
											authorRole,
										)
									: null,
							),
						)
					: null,
			),
		);
	}
	return h(
		'section',
		{ ...props, className: cx('pds-testimonial-band', className) },
		h(
			'blockquote',
			null,
			h('p', null, quote),
			attribution ? h('footer', null, attribution) : null,
		),
	);
}

// =============================================================================
// FinalCta
// =============================================================================

export interface RawFinalCtaProps extends RawHtmlSectionAttrs {
	actions?: readonly RawPageBlockAction[];
	description?: RawJsxNode;
	title: RawJsxNode;
}

export function RawFinalCta({
	actions = [],
	className,
	description,
	title,
	...props
}: RawFinalCtaProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-final-cta', className) },
		h('h2', null, title),
		description ? h('p', null, description) : null,
		actions.length
			? h(
					'div',
					{ className: 'pds-page-actions' },
					...actions.map((action, index) => renderPageAction(action, index)),
				)
			: null,
	);
}

// =============================================================================
// ArticleCard + ArticleCardGrid
// =============================================================================

export type RawArticleCardTone = 'magenta' | 'purple' | 'slate';

export interface RawArticleCardProps extends Omit<RawHtmlAnchorAttrs, 'title'> {
	image?: RawJsxNode;
	kind?: RawJsxNode;
	readingTime?: RawJsxNode;
	title: RawJsxNode;
	tone?: RawArticleCardTone;
}

export function RawArticleCard({
	className,
	image,
	kind,
	readingTime,
	title,
	tone,
	...props
}: RawArticleCardProps): RawJsxNode {
	return h(
		'a',
		{
			...props,
			className: cx(
				'pds-article-card',
				tone && `pds-article-card--tone-${tone}`,
				className,
			),
		},
		h(
			'div',
			{ className: 'pds-article-card__media' },
			image ?? h('div', { className: 'pds-article-card__media-placeholder' }),
		),
		h(
			'div',
			{ className: 'pds-article-card__body' },
			kind || readingTime
				? h(
						'p',
						{ className: 'pds-article-card__meta' },
						kind
							? h('span', { className: 'pds-article-card__kind' }, kind)
							: null,
						kind && readingTime
							? h(
									'span',
									{
										'aria-hidden': 'true',
										className: 'pds-article-card__separator',
									},
									'·',
								)
							: null,
						readingTime
							? h(
									'span',
									{ className: 'pds-article-card__reading-time' },
									readingTime,
								)
							: null,
					)
				: null,
			h('h3', { className: 'pds-article-card__title' }, title),
		),
	);
}

export interface RawArticleCardGridProps extends RawHtmlSectionAttrs {
	eyebrow?: RawJsxNode;
	headline?: RawJsxNode;
	items: readonly RawArticleCardProps[];
	linkHref?: string;
	linkLabel?: RawJsxNode;
}

export function RawArticleCardGrid({
	className,
	eyebrow,
	headline,
	items,
	linkHref,
	linkLabel,
	...props
}: RawArticleCardGridProps): RawJsxNode {
	return h(
		'section',
		{ ...props, className: cx('pds-article-card-grid', className) },
		eyebrow || headline || linkLabel
			? h(
					'header',
					{ className: 'pds-article-card-grid__header' },
					h(
						'div',
						null,
						eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
						headline ? h('h2', null, headline) : null,
					),
					linkLabel
						? h(
								'a',
								{
									className: 'pds-article-card-grid__link',
									href: linkHref ?? '#',
								},
								h('span', null, linkLabel),
								RawIcon({ name: 'arrow-right', size: 14 }),
							)
						: null,
				)
			: null,
		h(
			'ul',
			{ className: 'pds-article-card-grid__items' },
			...items.map((item, index) =>
				h('li', { key: index }, RawArticleCard(item)),
			),
		),
	);
}

// =============================================================================
// CoverageMap
// =============================================================================

export type RawCoverageMapCityStatus = 'live' | 'soon';

export interface RawCoverageMapCity {
	detail?: RawJsxNode;
	id?: string;
	name: RawJsxNode;
	status: RawCoverageMapCityStatus;
	x: number;
	y: number;
}

export type RawCoverageMapSilhouetteKey = 'south-africa';

export interface RawCoverageMapProps extends RawHtmlSectionAttrs {
	cities: readonly RawCoverageMapCity[];
	eyebrow?: RawJsxNode;
	headline?: RawJsxNode;
	silhouettePath?: string;
	silhouetteKey?: RawCoverageMapSilhouetteKey;
}

export const rawCoverageMapSilhouettes: Record<
	RawCoverageMapSilhouetteKey,
	string
> = {
	'south-africa':
		'M12 38 L18 30 L30 28 L42 24 L54 22 L66 24 L76 30 L86 34 L92 42 L94 54 L92 64 L86 70 L82 78 L72 86 L62 92 L52 94 L42 92 L34 88 L26 86 L20 80 L14 72 L10 60 L8 48 Z',
};

export function RawCoverageMap({
	cities,
	className,
	eyebrow,
	headline,
	silhouetteKey = 'south-africa',
	silhouettePath,
	...props
}: RawCoverageMapProps): RawJsxNode {
	const resolvedPath =
		silhouettePath ?? rawCoverageMapSilhouettes[silhouetteKey];
	return h(
		'section',
		{ ...props, className: cx('pds-coverage-map-section', className) },
		eyebrow || headline
			? h(
					'header',
					{
						className:
							'pds-page-section-header pds-page-section-header--centered',
					},
					eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
					headline ? h('h2', null, headline) : null,
				)
			: null,
		h(
			'div',
			{ className: 'pds-coverage-map' },
			h(
				'div',
				{ className: 'pds-coverage-map__map' },
				h(
					'svg',
					{
						'aria-hidden': 'true',
						className: 'pds-coverage-map__svg',
						preserveAspectRatio: 'xMidYMid meet',
						viewBox: '0 0 100 100',
					},
					h('path', {
						className: 'pds-coverage-map__silhouette',
						d: resolvedPath,
						fill: 'var(--theme-page-bg)',
						stroke: 'var(--theme-primary)',
						strokeDasharray: '1 1',
						strokeOpacity: '0.35',
						strokeWidth: '0.6',
					}),
					...cities.map((city, index) => {
						const isLive = city.status === 'live';
						return h(
							'g',
							{ key: city.id ?? index },
							h('circle', {
								className: cx(
									'pds-coverage-map__pin',
									`pds-coverage-map__pin--${city.status}`,
								),
								cx: city.x,
								cy: city.y,
								fill: isLive ? 'var(--theme-primary)' : 'transparent',
								r: isLive ? 4 : 2.5,
								stroke: 'var(--theme-primary)',
								strokeDasharray: isLive ? undefined : '1.2 1.2',
								strokeWidth: isLive ? 0.8 : 1.4,
							}),
							isLive
								? h('circle', {
										className: 'pds-coverage-map__pin-halo',
										cx: city.x,
										cy: city.y,
										fill: 'none',
										r: 7,
										stroke: 'var(--theme-primary)',
										strokeOpacity: '0.4',
										strokeWidth: '0.4',
									})
								: null,
						);
					}),
				),
			),
			h(
				'ul',
				{ className: 'pds-coverage-map__list' },
				...cities.map((city, index) =>
					h(
						'li',
						{
							className: cx(
								'pds-coverage-map__city',
								`pds-coverage-map__city--${city.status}`,
							),
							key: city.id ?? index,
						},
						h('span', {
							'aria-hidden': 'true',
							className: cx(
								'pds-coverage-map__city-dot',
								`pds-coverage-map__city-dot--${city.status}`,
							),
						}),
						h(
							'div',
							{ className: 'pds-coverage-map__city-text' },
							h(
								'span',
								{ className: 'pds-coverage-map__city-name' },
								city.name,
							),
							city.detail
								? h(
										'span',
										{ className: 'pds-coverage-map__city-detail' },
										city.detail,
									)
								: null,
						),
						h(
							'span',
							{
								className: cx(
									'pds-coverage-map__city-status',
									`pds-coverage-map__city-status--${city.status}`,
								),
							},
							city.status === 'live' ? 'Live' : 'Coming',
						),
					),
				),
			),
		),
	);
}

// =============================================================================
// FaqSection (accordion variant — controlled)
// =============================================================================

export interface RawFaqSectionItem {
	answer: RawJsxNode;
	id: string;
	question: RawJsxNode;
}

export type RawFaqSectionVariant = 'accordion' | 'default';

export interface RawFaqSectionProps extends RawHtmlSectionAttrs {
	eyebrow?: RawJsxNode;
	faqs: readonly RawFaqSectionItem[];
	openId?: string | null;
	title?: RawJsxNode;
	variant?: RawFaqSectionVariant;
}

export function RawFaqSection({
	className,
	eyebrow,
	faqs,
	openId = null,
	title = 'Frequently asked questions',
	variant = 'default',
	...props
}: RawFaqSectionProps): RawJsxNode {
	if (variant !== 'accordion') {
		return h(
			'section',
			{ ...props, className: cx('pds-faq-section', className) },
			h(
				'header',
				{ className: 'pds-page-section-header' },
				h('h2', null, title),
			),
			h(
				'div',
				null,
				...faqs.map((faq) =>
					h(
						'details',
						{ key: faq.id, open: faqs[0]?.id === faq.id ? '' : undefined },
						h('summary', null, faq.question),
						h('div', null, faq.answer),
					),
				),
			),
		);
	}
	return h(
		'section',
		{
			...props,
			className: cx('pds-faq-section', 'pds-faq-section--accordion', className),
		},
		h(
			'header',
			{
				className: 'pds-page-section-header pds-page-section-header--centered',
			},
			eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
			h('h2', null, title),
		),
		h(
			'div',
			{ className: 'pds-faq-accordion' },
			...faqs.map((faq) => {
				const isOpen = openId === faq.id;
				return h(
					'div',
					{ className: 'pds-faq-accordion__item', key: faq.id },
					h(
						'button',
						{
							'aria-controls': `${faq.id}-panel`,
							'aria-expanded': isOpen,
							className: 'pds-faq-accordion__trigger',
							'data-faq-id': faq.id,
							id: `${faq.id}-trigger`,
							type: 'button',
						},
						h(
							'span',
							{ className: 'pds-faq-accordion__question' },
							faq.question,
						),
						h(
							'span',
							{
								'aria-hidden': 'true',
								className: cx(
									'pds-faq-accordion__icon',
									isOpen && 'pds-faq-accordion__icon--open',
								),
							},
							RawIcon({ name: isOpen ? 'minus' : 'plus', size: 18 }),
						),
					),
					h(
						'section',
						{
							'aria-labelledby': `${faq.id}-trigger`,
							className: cx(
								'pds-faq-accordion__panel',
								isOpen && 'pds-faq-accordion__panel--open',
							),
							hidden: !isOpen,
							id: `${faq.id}-panel`,
						},
						h(
							'div',
							{ className: 'pds-faq-accordion__panel-inner' },
							faq.answer,
						),
					),
				);
			}),
		),
	);
}

// =============================================================================
// SignupPanel (newsletter variant — uncontrolled DOM form, behaviour wired client-side)
// =============================================================================

export type RawSignupPanelScheme = 'dark' | 'light';

export interface RawSignupPanelProps extends RawHtmlSectionAttrs {
	description?: RawJsxNode;
	disclaimer?: RawJsxNode;
	emailLabel?: string;
	eyebrow?: RawJsxNode;
	placeholder?: string;
	scheme?: RawSignupPanelScheme;
	submitLabel?: RawJsxNode;
	title?: RawJsxNode;
	formAction?: string;
	formMethod?: string;
}

export function RawSignupPanel({
	className,
	description,
	disclaimer,
	emailLabel = 'Email address',
	eyebrow,
	placeholder = 'your@email.com',
	scheme = 'dark',
	submitLabel = 'Subscribe',
	title = 'Stay in the loop',
	formAction,
	formMethod = 'post',
	...props
}: RawSignupPanelProps): RawJsxNode {
	const inputId = `pds-signup-panel-input-${Math.random().toString(36).slice(2, 9)}`;
	return h(
		'section',
		{
			...props,
			className: cx(
				'pds-signup-panel',
				'pds-signup-panel--newsletter',
				`pds-signup-panel--scheme-${scheme}`,
				className,
			),
			'data-scheme': scheme,
		},
		h(
			'div',
			{ className: 'pds-signup-panel__copy' },
			eyebrow ? h('p', { className: 'pds-page-eyebrow' }, eyebrow) : null,
			h('h2', null, title),
			description
				? h('p', { className: 'pds-signup-panel__description' }, description)
				: null,
		),
		h(
			'form',
			{
				action: formAction,
				className: 'pds-signup-panel__form',
				'data-newsletter-form': '',
				method: formMethod,
			},
			h(
				'label',
				{ className: 'pds-visually-hidden', htmlFor: inputId },
				emailLabel,
			),
			h(
				'span',
				{ 'aria-hidden': 'true', className: 'pds-signup-panel__form-icon' },
				RawIcon({ name: 'mail', size: 18 }),
			),
			h('input', {
				autoComplete: 'email',
				className: 'pds-signup-panel__input',
				id: inputId,
				inputMode: 'email',
				name: 'email',
				placeholder,
				required: true,
				type: 'email',
			}),
			h(
				'button',
				{ className: 'pds-signup-panel__submit', type: 'submit' },
				submitLabel,
			),
		),
		disclaimer
			? h('p', { className: 'pds-signup-panel__disclaimer' }, disclaimer)
			: null,
	);
}

// =============================================================================
// Footer (default + mega variants)
// =============================================================================

export interface RawFooterLink extends RawHtmlAnchorAttrs {
	icon?: RawPdsIconName | RawJsxNode;
	label: RawJsxNode;
}

export interface RawFooterSection {
	links: readonly RawFooterLink[];
	title: RawJsxNode;
}

export type RawFooterStatusTone = 'degraded' | 'down' | 'operational';

export interface RawFooterStatus {
	label: RawJsxNode;
	tone?: RawFooterStatusTone;
}

export type RawFooterVariant = 'default' | 'mega';
export type RawFooterScheme = 'dark' | 'light';

export interface RawFooterProps extends RawHtmlSectionAttrs {
	actions?: RawJsxNode;
	brand?: RawJsxNode;
	copyright?: RawJsxNode;
	description?: RawJsxNode;
	legalLinks?: readonly RawFooterLink[];
	scheme?: RawFooterScheme;
	sections?: readonly RawFooterSection[];
	socialLinks?: readonly RawFooterLink[];
	status?: RawFooterStatus;
	tagline?: RawJsxNode;
	variant?: RawFooterVariant;
}

const defaultRawFooterSections: readonly RawFooterSection[] = [
	{
		links: [
			{ href: '/platform', label: 'Platform' },
			{ href: '/insights', label: 'Insights' },
			{ href: '/contact', label: 'Contact' },
		],
		title: 'Product',
	},
	{
		links: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/terms', label: 'Terms' },
		],
		title: 'Company',
	},
];

const defaultRawFooterLegal: readonly RawFooterLink[] = [
	{ href: '/privacy', label: 'Privacy' },
	{ href: '/terms', label: 'Terms' },
];

function rawFooterAnchor(link: RawFooterLink, key: number): RawJsxNode {
	const { icon, label, ...rest } = link;
	const resolvedIcon =
		icon !== undefined
			? isRawPdsIconName(icon)
				? RawIcon({ name: icon, size: 16 })
				: icon
			: typeof label === 'string' && label.toLowerCase().includes('whatsapp')
				? RawIcon({ name: 'whatsapp', size: 16 })
				: null;
	return h('a', { ...rest, key }, resolvedIcon, h('span', null, label));
}

function rawFooterSocialAnchor(link: RawFooterLink, key: number): RawJsxNode {
	const { icon, label, ...rest } = link;
	const resolvedIcon =
		icon !== undefined
			? isRawPdsIconName(icon)
				? RawIcon({ name: icon, size: 16 })
				: icon
			: null;
	const accessibleLabel = typeof label === 'string' ? label : undefined;
	return h(
		'a',
		{
			...rest,
			'aria-label': accessibleLabel,
			className: 'pds-footer-mega__social-link',
			key,
			title: accessibleLabel,
		},
		resolvedIcon,
		h('span', { className: 'pds-visually-hidden' }, label),
	);
}

function rawFooterStatus({ status }: { status: RawFooterStatus }): RawJsxNode {
	const tone = status.tone ?? 'operational';
	return h(
		'div',
		{
			'aria-live': 'polite',
			className: cx(
				'pds-footer-mega__status',
				`pds-footer-mega__status--${tone}`,
			),
		},
		h('span', {
			'aria-hidden': 'true',
			className: 'pds-footer-mega__status-dot',
		}),
		h('span', null, status.label),
	);
}

const rawFooterDefaultBrand = (): RawJsxNode =>
	h(
		'div',
		{ className: 'pds-brand-lockup pds-brand-lockup--wordmark' },
		RawPikabooWordmark({ height: 36, tone: 'dark' }),
	);

export function RawFooter({
	actions,
	brand,
	className,
	copyright,
	description = 'Building the ultimate dataset for Africa',
	legalLinks = defaultRawFooterLegal,
	scheme = 'dark',
	sections = defaultRawFooterSections,
	socialLinks,
	status,
	tagline,
	variant = 'default',
	...props
}: RawFooterProps): RawJsxNode {
	const year = new Date().getFullYear();
	const yearCopy = copyright ?? `© ${year} Pikaboo`;

	if (variant === 'mega') {
		return h(
			'footer',
			{
				...props,
				className: cx(
					'pds-footer',
					'pds-footer--mega',
					`pds-footer--scheme-${scheme}`,
					className,
				),
				'data-scheme': scheme,
			},
			h(
				'div',
				{ className: 'pds-footer-mega__top' },
				h(
					'div',
					{ className: 'pds-footer-mega__brand-column' },
					h(
						'div',
						{ className: 'pds-footer-mega__brand' },
						brand ?? rawFooterDefaultBrand(),
					),
					tagline
						? h('p', { className: 'pds-footer-mega__tagline' }, tagline)
						: description
							? h('p', { className: 'pds-footer-mega__tagline' }, description)
							: null,
					socialLinks?.length
						? h(
								'ul',
								{ className: 'pds-footer-mega__social' },
								...socialLinks.map((link, index) =>
									h('li', { key: index }, rawFooterSocialAnchor(link, index)),
								),
							)
						: null,
				),
				h(
					'nav',
					{ 'aria-label': 'Footer', className: 'pds-footer-mega__nav' },
					...sections.map((section, index) =>
						h(
							'div',
							{ className: 'pds-footer-mega__section', key: index },
							h(
								'h2',
								{ className: 'pds-footer-mega__section-title' },
								section.title,
							),
							h(
								'ul',
								null,
								...section.links.map((link, linkIndex) =>
									h('li', { key: linkIndex }, rawFooterAnchor(link, linkIndex)),
								),
							),
						),
					),
				),
			),
			h(
				'div',
				{ className: 'pds-footer-mega__bottom' },
				h('span', { className: 'pds-footer-mega__copyright' }, yearCopy),
				legalLinks.length
					? h(
							'div',
							{ className: 'pds-footer-mega__legal' },
							...legalLinks.map((link, index) => rawFooterAnchor(link, index)),
						)
					: null,
				status ? rawFooterStatus({ status }) : null,
			),
		);
	}

	return h(
		'footer',
		{ ...props, className: cx('pds-footer', className) },
		h(
			'div',
			{ className: 'pds-footer__main' },
			h(
				'div',
				{ className: 'pds-footer__brand' },
				brand ?? rawFooterDefaultBrand(),
				actions
					? h('div', { className: 'pds-footer__actions' }, actions)
					: null,
			),
			h(
				'nav',
				{ 'aria-label': 'Footer', className: 'pds-footer__nav' },
				...sections.map((section, index) =>
					h(
						'div',
						{ className: 'pds-footer__section', key: index },
						h('h2', null, section.title),
						h(
							'ul',
							null,
							...section.links.map((link, linkIndex) =>
								h('li', { key: linkIndex }, rawFooterAnchor(link, linkIndex)),
							),
						),
					),
				),
			),
		),
		h(
			'div',
			{ className: 'pds-footer__bottom' },
			h('span', null, yearCopy),
			h(
				'div',
				{ className: 'pds-footer__links' },
				...legalLinks.map((link, index) => rawFooterAnchor(link, index)),
			),
			socialLinks?.length
				? h(
						'div',
						{ className: 'pds-footer__social' },
						...socialLinks.map((link, index) => rawFooterAnchor(link, index)),
					)
				: null,
		),
	);
}

// =============================================================================
// ThemeToggle (raw-jsx — renders structure; client script wires interaction)
// =============================================================================

export type RawThemeToggleMode = 'dark' | 'light';

const RAW_THEME_STORAGE_DEFAULT = 'pikaboo:website:theme';
const _RAW_THEME_FOR_MODE: Record<RawThemeToggleMode, string> = {
	dark: 'pikaboo-dark',
	light: 'pikaboo',
};

export interface RawThemeToggleProps {
	active?: RawThemeToggleMode;
	ariaLabel?: string;
	className?: string;
	darkLabel?: string;
	lightLabel?: string;
	persistKey?: string;
}

export function RawThemeToggle({
	active = 'dark',
	ariaLabel = 'Theme',
	className,
	darkLabel = 'Dark',
	lightLabel = 'Light',
	persistKey = RAW_THEME_STORAGE_DEFAULT,
}: RawThemeToggleProps): RawJsxNode {
	return h(
		'fieldset',
		{
			'aria-label': ariaLabel,
			className: cx('pds-theme-toggle', className),
			'data-pds-theme-toggle': '',
			'data-pds-theme-persist-key': persistKey,
		},
		h('legend', { className: 'pds-visually-hidden' }, ariaLabel),
		h('span', {
			'aria-hidden': 'true',
			className: cx(
				'pds-theme-toggle__thumb',
				active === 'dark' && 'pds-theme-toggle__thumb--dark',
			),
			'data-pds-theme-thumb': '',
		}),
		h(
			'button',
			{
				'aria-label': lightLabel,
				'aria-pressed': active === 'light',
				className: cx(
					'pds-theme-toggle__option',
					active === 'light' && 'pds-theme-toggle__option--active',
				),
				'data-pds-theme-mode': 'light',
				type: 'button',
			},
			RawIcon({ name: 'sun', size: 16 }),
			h('span', { className: 'pds-visually-hidden' }, lightLabel),
		),
		h(
			'button',
			{
				'aria-label': darkLabel,
				'aria-pressed': active === 'dark',
				className: cx(
					'pds-theme-toggle__option',
					active === 'dark' && 'pds-theme-toggle__option--active',
				),
				'data-pds-theme-mode': 'dark',
				type: 'button',
			},
			RawIcon({ name: 'moon', size: 16 }),
			h('span', { className: 'pds-visually-hidden' }, darkLabel),
		),
	);
}

/**
 * Synchronous boot script that reads the persisted theme from localStorage
 * and applies it to `document.documentElement` before first paint, avoiding
 * a theme flash. Inline into your layout's `<head>` so it runs before any
 * styles paint.
 */
export const rawThemeToggleBootScript = (
	persistKey: string = RAW_THEME_STORAGE_DEFAULT,
): string => `(() => {
  try {
    var v = window.localStorage.getItem(${JSON.stringify(persistKey)});
    if (v === "pikaboo" || v === "pikaboo-dark") {
      document.documentElement.setAttribute("data-theme", v);
    }
  } catch (_) {}
})();`;

/**
 * Client-side script that wires up every `[data-pds-theme-toggle]` instance
 * on the page: syncs the active state with the document's data-theme, persists
 * the user's choice in localStorage on click, and updates aria-pressed +
 * active class names.
 */
export const rawThemeToggleClientScript = (): string =>
	`(() => {
  var THEME_FOR_MODE = { dark: "pikaboo-dark", light: "pikaboo" };
  var MODE_FOR_THEME = function (t) {
    if (t === "pikaboo-dark") return "dark";
    if (t === "pikaboo") return "light";
    return null;
  };
  function setMode(fieldset, next) {
    var persistKey = fieldset.getAttribute("data-pds-theme-persist-key") || "${RAW_THEME_STORAGE_DEFAULT}";
    document.documentElement.setAttribute("data-theme", THEME_FOR_MODE[next]);
    try { window.localStorage.setItem(persistKey, THEME_FOR_MODE[next]); } catch (_) {}
    fieldset.querySelectorAll('[data-pds-theme-mode]').forEach(function (btn) {
      var mode = btn.getAttribute('data-pds-theme-mode');
      var active = mode === next;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('pds-theme-toggle__option--active', active);
    });
    var thumb = fieldset.querySelector('[data-pds-theme-thumb]');
    if (thumb) thumb.classList.toggle('pds-theme-toggle__thumb--dark', next === 'dark');
  }
  document.querySelectorAll('[data-pds-theme-toggle]').forEach(function (fieldset) {
    var current = MODE_FOR_THEME(document.documentElement.getAttribute('data-theme'));
    if (current) setMode(fieldset, current);
    fieldset.addEventListener('click', function (event) {
      var target = event.target;
      var btn = target && target.closest && target.closest('[data-pds-theme-mode]');
      if (!btn) return;
      var mode = btn.getAttribute('data-pds-theme-mode');
      if (mode === 'dark' || mode === 'light') setMode(fieldset, mode);
    });
  });
})();`;

// =============================================================================
// SiteNav + MobileMenuSheet (raw-jsx; client script wires toggle/Escape/body-lock)
// =============================================================================

export type RawSiteNavScheme = 'auto' | 'dark' | 'light';

export interface RawSiteNavLink extends RawHtmlAnchorAttrs {
	active?: boolean;
	description?: RawJsxNode;
	label: RawJsxNode;
}

export interface RawSiteNavProps extends RawHtmlSectionAttrs {
	ariaLabel?: string;
	cta?: RawJsxNode;
	links: readonly RawSiteNavLink[];
	logo?: RawJsxNode;
	mobileCta?: RawJsxNode;
	open?: boolean;
	scheme?: RawSiteNavScheme;
	sticky?: boolean;
}

function rawSiteNavAnchor(link: RawSiteNavLink, key: number): RawJsxNode {
	const { active, description: _description, label, className, ...rest } = link;
	return h(
		'a',
		{
			...rest,
			'aria-current': active ? 'page' : undefined,
			className: cx(
				'pds-site-nav__link',
				active && 'pds-site-nav__link--active',
				className,
			),
			key,
		},
		label,
	);
}

function rawMobileMenuRow(link: RawSiteNavLink, key: number): RawJsxNode {
	const { active, description, label, className, ...rest } = link;
	return h(
		'a',
		{
			...rest,
			'aria-current': active ? 'page' : undefined,
			className: cx(
				'pds-mobile-menu-sheet__row',
				active && 'pds-mobile-menu-sheet__row--active',
				className,
			),
			'data-pds-mobile-menu-row': '',
			key,
		},
		h(
			'span',
			{ className: 'pds-mobile-menu-sheet__row-text' },
			h('span', { className: 'pds-mobile-menu-sheet__row-label' }, label),
			description
				? h(
						'span',
						{ className: 'pds-mobile-menu-sheet__row-description' },
						description,
					)
				: null,
		),
		RawIcon({ name: 'chevron-right', size: 16 }),
	);
}

export type RawMobileMenuSheetScheme = 'dark' | 'light';

export interface RawMobileMenuSheetProps extends RawHtmlSectionAttrs {
	cta?: RawJsxNode;
	links: readonly RawSiteNavLink[];
	logo?: RawJsxNode;
	open?: boolean;
	scheme?: RawMobileMenuSheetScheme;
}

export function RawMobileMenuSheet({
	className,
	cta,
	id,
	links,
	logo,
	open = false,
	scheme = 'dark',
	...props
}: RawMobileMenuSheetProps): RawJsxNode {
	return h(
		'div',
		{
			...props,
			'aria-hidden': !open,
			'aria-label': 'Mobile menu',
			className: cx(
				'pds-mobile-menu-sheet',
				`pds-mobile-menu-sheet--scheme-${scheme}`,
				open && 'pds-mobile-menu-sheet--open',
				className,
			),
			'data-pds-mobile-menu-sheet': '',
			'data-scheme': scheme,
			id,
			role: 'dialog',
		},
		h(
			'div',
			{ className: 'pds-mobile-menu-sheet__header' },
			h('div', { className: 'pds-mobile-menu-sheet__brand' }, logo),
			h(
				'button',
				{
					'aria-label': 'Close menu',
					className: 'pds-mobile-menu-sheet__close',
					'data-pds-mobile-menu-close': '',
					type: 'button',
				},
				RawIcon({ name: 'close', size: 20 }),
			),
		),
		h(
			'nav',
			{
				'aria-label': 'Mobile sections',
				className: 'pds-mobile-menu-sheet__nav',
			},
			...links.map((link, index) => rawMobileMenuRow(link, index)),
		),
		cta ? h('div', { className: 'pds-mobile-menu-sheet__cta' }, cta) : null,
	);
}

export function RawSiteNav({
	ariaLabel = 'Primary',
	className,
	cta,
	links,
	logo,
	mobileCta,
	open = false,
	scheme = 'auto',
	sticky = true,
	...props
}: RawSiteNavProps): RawJsxNode {
	const sheetId = 'pds-site-nav-mobile-sheet';
	return h(
		Fragment,
		null,
		h(
			'header',
			{
				...props,
				className: cx(
					'pds-site-nav',
					sticky && 'pds-site-nav--sticky',
					`pds-site-nav--scheme-${scheme}`,
					className,
				),
				'data-pds-site-nav': '',
			},
			h(
				'div',
				{ className: 'pds-site-nav__inner' },
				h('div', { className: 'pds-site-nav__brand' }, logo),
				h(
					'nav',
					{ 'aria-label': ariaLabel, className: 'pds-site-nav__links' },
					...links.map((link, index) => rawSiteNavAnchor(link, index)),
				),
				h(
					'div',
					{ className: 'pds-site-nav__actions' },
					cta ? h('span', { className: 'pds-site-nav__cta' }, cta) : null,
					h(
						'button',
						{
							'aria-controls': sheetId,
							'aria-expanded': open,
							'aria-label': open ? 'Close menu' : 'Open menu',
							className: 'pds-site-nav__menu-toggle',
							'data-pds-mobile-menu-toggle': '',
							type: 'button',
						},
						RawIcon({ name: open ? 'close' : 'menu', size: 20 }),
					),
				),
			),
		),
		RawMobileMenuSheet({
			cta: mobileCta ?? cta,
			id: sheetId,
			links,
			logo,
			open,
			scheme: scheme === 'light' ? 'light' : 'dark',
		}),
	);
}

/**
 * Client-side script that wires up every `[data-pds-site-nav]` instance on
 * the page: toggles the mobile menu sheet, closes it on Escape, locks body
 * overflow while open, and closes after a link click.
 */
export const rawSiteNavClientScript = (): string =>
	`(() => {
  function setOpen(toggle, sheet, next) {
    var openClass = 'pds-mobile-menu-sheet--open';
    if (next) sheet.classList.add(openClass); else sheet.classList.remove(openClass);
    sheet.setAttribute('aria-hidden', String(!next));
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    document.body.style.overflow = next ? 'hidden' : '';
  }
  document.querySelectorAll('[data-pds-site-nav]').forEach(function (nav) {
    var toggle = nav.querySelector('[data-pds-mobile-menu-toggle]');
    var sheetId = toggle && toggle.getAttribute('aria-controls');
    var sheet = sheetId && document.getElementById(sheetId);
    if (!toggle || !sheet) return;
    toggle.addEventListener('click', function () {
      var isOpen = sheet.classList.contains('pds-mobile-menu-sheet--open');
      setOpen(toggle, sheet, !isOpen);
    });
    var closeBtn = sheet.querySelector('[data-pds-mobile-menu-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(toggle, sheet, false); });
    sheet.querySelectorAll('[data-pds-mobile-menu-row]').forEach(function (row) {
      row.addEventListener('click', function () { setOpen(toggle, sheet, false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sheet.classList.contains('pds-mobile-menu-sheet--open')) {
        setOpen(toggle, sheet, false);
      }
    });
  });
})();`;

export { Fragment };
