import type { SVGProps } from 'react';
import { cx } from '../utils/class-names';

export const pdsIconNames = [
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
	'map',
	'menu',
	'plus',
	'search',
	'settings',
	'spark',
	'support',
	'upload',
	'users',
	'whatsapp',
] as const;

export type PdsIconName = (typeof pdsIconNames)[number];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
	name: PdsIconName;
	size?: number | string;
	title?: string;
}

type IconPath = {
	d?: string;
	element?: 'circle' | 'line' | 'path' | 'polyline' | 'rect';
	fill?: string;
	points?: string;
	props?: Record<string, number | string>;
	stroke?: string;
};

const iconPaths: Record<PdsIconName, readonly IconPath[]> = {
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
	plus: [
		{ d: 'M12 5v14', element: 'path' },
		{ d: 'M5 12h14', element: 'path' },
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
	support: [
		{ element: 'circle', props: { cx: 12, cy: 12, r: 9 } },
		{ d: 'M8 12a4 4 0 0 1 8 0v4a2 2 0 0 1-2 2h-1', element: 'path' },
		{ d: 'M8 13v-1', element: 'path' },
		{ d: 'M16 13v-1', element: 'path' },
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

export const isPdsIconName = (value: unknown): value is PdsIconName =>
	typeof value === 'string' &&
	(pdsIconNames as readonly string[]).includes(value);

export function Icon({
	className,
	name,
	size = 20,
	title,
	...props
}: IconProps) {
	const titleId = title
		? `pds-icon-${name}-${title.replace(/\s+/g, '-')}`
		: undefined;

	return (
		<svg
			aria-hidden={title ? undefined : true}
			aria-labelledby={titleId}
			className={cx('pds-icon', className)}
			fill="none"
			height={size}
			role={title ? 'img' : undefined}
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			width={size}
			{...props}
		>
			{title ? <title id={titleId}>{title}</title> : null}
			{iconPaths[name].map((path, index) => {
				const key = `${name}-${index}`;
				const element = path.element ?? 'path';
				const commonProps = {
					fill: path.fill ?? 'none',
					stroke: path.stroke ?? 'currentColor',
					...path.props,
				};
				if (element === 'circle') return <circle key={key} {...commonProps} />;
				if (element === 'line') return <line key={key} {...commonProps} />;
				if (element === 'polyline') {
					return <polyline key={key} points={path.points} {...commonProps} />;
				}
				if (element === 'rect') return <rect key={key} {...commonProps} />;
				return <path d={path.d} key={key} {...commonProps} />;
			})}
		</svg>
	);
}
