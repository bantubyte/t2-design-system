export type RawJsxPrimitive = string | number | boolean | null | undefined;

export type RawJsxChild = RawJsxNode | RawJsxNode[];

export type RawJsxNode = RawJsxElement | RawJsxPrimitive | RawJsxNode[];

export type RawJsxComponent<TProps = Record<string, unknown>> = (
	props: TProps,
) => RawJsxNode;

export type RawJsxElementType = string | typeof Fragment | RawJsxComponent;

export interface RawJsxElement<
	TProps extends Record<string, unknown> = Record<string, unknown>,
> {
	key?: string | number;
	props: TProps & { children?: RawJsxChild };
	type: RawJsxElementType;
}

export const Fragment = Symbol.for('pikaboo.raw-jsx.fragment');

export function h<TProps extends Record<string, unknown>>(
	type: RawJsxElementType,
	props?: TProps | null,
	...children: RawJsxNode[]
): RawJsxNode {
	const nextProps = {
		...(props ?? {}),
		...(children.length > 0 ? { children } : {}),
	} as TProps & { children?: RawJsxChild };

	if (typeof type === 'function') {
		return type(nextProps);
	}

	return {
		key:
			typeof nextProps.key === 'string' || typeof nextProps.key === 'number'
				? nextProps.key
				: undefined,
		props: nextProps,
		type,
	};
}

export function jsx<TProps extends Record<string, unknown>>(
	type: RawJsxElementType,
	props?: TProps | null,
	key?: string | number,
): RawJsxNode {
	return h(
		type,
		key === undefined
			? props
			: ({ ...(props ?? {}), key } as unknown as TProps),
	);
}

export const jsxs = jsx;

function flattenChildren(children: RawJsxChild | undefined): RawJsxNode[] {
	if (children === undefined) return [];
	const list = Array.isArray(children) ? children : [children];
	return list.flatMap((child) =>
		Array.isArray(child) ? flattenChildren(child) : [child],
	);
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function toKebabCase(value: string): string {
	return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function styleObjectToString(value: unknown): string {
	if (!value || typeof value !== 'object') return '';

	return Object.entries(value as Record<string, string | number>)
		.map(([property, propertyValue]) => {
			if (propertyValue === undefined || propertyValue === null) return '';
			return `${toKebabCase(property)}:${String(propertyValue)}`;
		})
		.filter(Boolean)
		.join(';');
}

function propToAttributeName(name: string): string {
	if (name === 'className') return 'class';
	if (name === 'htmlFor') return 'for';
	return name;
}

function propsToHtmlAttributes(props: Record<string, unknown>): string {
	return Object.entries(props)
		.map(([name, value]) => {
			if (
				name === 'children' ||
				name === 'key' ||
				name === 'ref' ||
				/^on[A-Z]/.test(name) ||
				value === false ||
				value === null ||
				value === undefined
			) {
				return '';
			}
			const attributeName = propToAttributeName(name);
			if (value === true) return attributeName;
			if (name === 'style' && typeof value === 'object') {
				const style = styleObjectToString(value);
				return style ? `style="${escapeHtml(style)}"` : '';
			}
			return `${attributeName}="${escapeHtml(String(value))}"`;
		})
		.filter(Boolean)
		.join(' ');
}

function isRawJsxElement(node: RawJsxNode): node is RawJsxElement {
	return (
		typeof node === 'object' &&
		node !== null &&
		!Array.isArray(node) &&
		'type' in node &&
		'props' in node
	);
}

export function renderRawJsxToHtml(node: RawJsxNode): string {
	if (node === null || node === undefined || typeof node === 'boolean')
		return '';
	if (typeof node === 'string' || typeof node === 'number') {
		return escapeHtml(String(node));
	}
	if (Array.isArray(node)) {
		return node.map(renderRawJsxToHtml).join('');
	}
	if (!isRawJsxElement(node)) return '';
	if (typeof node.type === 'function') {
		return renderRawJsxToHtml(node.type(node.props));
	}

	const children = flattenChildren(node.props.children)
		.map(renderRawJsxToHtml)
		.join('');
	if (node.type === Fragment) return children;

	const attributes = propsToHtmlAttributes(node.props);
	const opening = attributes
		? `<${node.type} ${attributes}>`
		: `<${node.type}>`;
	return `${opening}${children}</${node.type}>`;
}

function appendChildren(element: Node, children: RawJsxChild | undefined) {
	for (const child of flattenChildren(children)) {
		element.appendChild(renderRawJsxToDom(child));
	}
}

function setDomProps(element: Element, props: Record<string, unknown>) {
	for (const [name, value] of Object.entries(props)) {
		if (
			name === 'children' ||
			name === 'key' ||
			name === 'ref' ||
			value === false ||
			value === null ||
			value === undefined
		) {
			continue;
		}

		if (/^on[A-Z]/.test(name) && typeof value === 'function') {
			const eventName = name.slice(2).toLowerCase();
			element.addEventListener(eventName, value as EventListener);
			continue;
		}

		if (name === 'style' && value && typeof value === 'object') {
			Object.assign((element as HTMLElement).style, value);
			continue;
		}

		if (name === 'className') {
			element.setAttribute('class', String(value));
			continue;
		}

		element.setAttribute(propToAttributeName(name), String(value));
	}
}

export function renderRawJsxToDom(node: RawJsxNode): Node {
	if (node === null || node === undefined || typeof node === 'boolean') {
		return document.createTextNode('');
	}
	if (typeof node === 'string' || typeof node === 'number') {
		return document.createTextNode(String(node));
	}
	if (Array.isArray(node)) {
		const fragment = document.createDocumentFragment();
		appendChildren(fragment, node);
		return fragment;
	}
	if (!isRawJsxElement(node)) {
		return document.createTextNode('');
	}
	if (typeof node.type === 'function') {
		return renderRawJsxToDom(node.type(node.props));
	}
	if (node.type === Fragment) {
		const fragment = document.createDocumentFragment();
		appendChildren(fragment, node.props.children);
		return fragment;
	}

	const element = document.createElement(node.type);
	setDomProps(element, node.props);
	appendChildren(element, node.props.children);
	return element;
}

export namespace JSX {
	export type Element = RawJsxNode;
	export interface IntrinsicElements {
		[tagName: string]: Record<string, unknown>;
	}
}
