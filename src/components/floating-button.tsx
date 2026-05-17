import {
	type ButtonHTMLAttributes,
	type CSSProperties,
	type FocusEvent as ReactFocusEvent,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import { Icon, isPdsIconName, type PdsIconName } from './icons';

export const floatingButtonCorners = [
	'top-left',
	'top-right',
	'bottom-left',
	'bottom-right',
] as const;

export type FloatingButtonCorner = (typeof floatingButtonCorners)[number];
export type FloatingButtonPosition = 'absolute' | 'fixed';

interface DragState {
	lastTime: number;
	lastX: number;
	lastY: number;
	moved: boolean;
	startCorner: FloatingButtonCorner;
	startX: number;
	startY: number;
	velocityX: number;
	velocityY: number;
}

type FloatingButtonStyle = CSSProperties & {
	'--pds-floating-button-bottom-inset'?: string;
	'--pds-floating-button-drag-x'?: string;
	'--pds-floating-button-drag-y'?: string;
	'--pds-floating-button-edge-inset'?: string;
	'--pds-floating-button-z-index'?: number | string;
};

export interface FloatingButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	bottomLiftInset?: number | string;
	collapseAfterMs?: number;
	corner?: FloatingButtonCorner;
	defaultCorner?: FloatingButtonCorner;
	dragClickThreshold?: number;
	dragDisabled?: boolean;
	edgeInset?: number | string;
	grabHintAfterMs?: number;
	icon?: PdsIconName | ReactNode;
	label: ReactNode;
	liftBottomCorners?: boolean;
	onCornerChange?: (corner: FloatingButtonCorner) => void;
	position?: FloatingButtonPosition;
	snapDurationMs?: number;
	storageKey?: string;
	tooltip?: ReactNode;
	tooltipSide?: 'auto' | 'bottom' | 'left' | 'right' | 'top';
	velocityThreshold?: number;
	zIndex?: number | string;
}

const defaultCorner: FloatingButtonCorner = 'bottom-right';
const defaultEdgeInset = 20;
const defaultBottomLiftInset = 96;

const validCorners: ReadonlySet<FloatingButtonCorner> = new Set(
	floatingButtonCorners,
);

function isFloatingButtonCorner(
	value: string | null,
): value is FloatingButtonCorner {
	return value !== null && validCorners.has(value as FloatingButtonCorner);
}

function safeGetStoredCorner(
	storageKey: string | undefined,
	fallback: FloatingButtonCorner,
): FloatingButtonCorner {
	if (!storageKey || typeof window === 'undefined') return fallback;
	try {
		const storedCorner = window.localStorage.getItem(storageKey);
		return isFloatingButtonCorner(storedCorner) ? storedCorner : fallback;
	} catch {
		return fallback;
	}
}

function safeSetStoredCorner(
	storageKey: string | undefined,
	corner: FloatingButtonCorner,
) {
	if (!storageKey || typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(storageKey, corner);
	} catch {
		// Corner preference is a convenience; storage failures should not block use.
	}
}

function toCssLength(value: number | string): string {
	return typeof value === 'number' ? `${value}px` : value;
}

function toNumber(value: number | string, fallback: number): number {
	if (typeof value === 'number') return value;
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function isBottomCorner(corner: FloatingButtonCorner): boolean {
	return corner.startsWith('bottom');
}

function getRestPosition({
	bottomLiftInset,
	buttonHeight,
	buttonWidth,
	corner,
	edgeInset,
	liftBottomCorners,
}: {
	bottomLiftInset: number;
	buttonHeight: number;
	buttonWidth: number;
	corner: FloatingButtonCorner;
	edgeInset: number;
	liftBottomCorners: boolean;
}) {
	const bottomInset =
		liftBottomCorners && isBottomCorner(corner) ? bottomLiftInset : edgeInset;
	const x = corner.endsWith('left')
		? edgeInset
		: window.innerWidth - buttonWidth - edgeInset;
	const y = corner.startsWith('top')
		? edgeInset
		: window.innerHeight - buttonHeight - bottomInset;
	return { x, y };
}

function chooseFloatingButtonCorner({
	releaseX,
	releaseY,
	velocityThreshold,
	velocityX,
	velocityY,
}: {
	releaseX: number;
	releaseY: number;
	velocityThreshold: number;
	velocityX: number;
	velocityY: number;
}): FloatingButtonCorner {
	const horizontal =
		Math.abs(velocityX) > velocityThreshold
			? velocityX < 0
				? 'left'
				: 'right'
			: releaseX < window.innerWidth / 2
				? 'left'
				: 'right';
	const vertical =
		Math.abs(velocityY) > velocityThreshold
			? velocityY < 0
				? 'top'
				: 'bottom'
			: releaseY < window.innerHeight / 2
				? 'top'
				: 'bottom';

	return `${vertical}-${horizontal}` as FloatingButtonCorner;
}

function renderFloatingButtonIcon(icon: PdsIconName | ReactNode | undefined) {
	if (!icon) return <Icon name="help" size={20} />;
	return isPdsIconName(icon) ? <Icon name={icon} size={20} /> : icon;
}

export function FloatingButton({
	bottomLiftInset = defaultBottomLiftInset,
	className,
	collapseAfterMs = 4000,
	corner,
	defaultCorner: defaultCornerProp = defaultCorner,
	disabled,
	dragClickThreshold = 6,
	dragDisabled = false,
	edgeInset = defaultEdgeInset,
	grabHintAfterMs = 500,
	icon,
	label,
	liftBottomCorners = false,
	onClick,
	onCornerChange,
	onPointerDown,
	onPointerEnter,
	onPointerLeave,
	onPointerMove,
	onFocus,
	onBlur,
	position = 'fixed',
	snapDurationMs = 260,
	storageKey,
	style,
	tooltip,
	tooltipSide = 'auto',
	type = 'button',
	velocityThreshold = 500,
	zIndex,
	...props
}: FloatingButtonProps) {
	const [uncontrolledCorner, setUncontrolledCorner] =
		useState<FloatingButtonCorner>(() =>
			safeGetStoredCorner(storageKey, defaultCornerProp),
		);
	const [collapsed, setCollapsed] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [showGrabCursor, setShowGrabCursor] = useState(false);
	const [snapping, setSnapping] = useState(false);
	const activeCorner = corner ?? uncontrolledCorner;
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const grabHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const snapFrameRef = useRef<number | null>(null);
	const dragStateRef = useRef<DragState | null>(null);
	const suppressClickRef = useRef(false);

	useEffect(() => {
		if (corner === undefined) {
			setUncontrolledCorner(safeGetStoredCorner(storageKey, defaultCornerProp));
		}
	}, [corner, defaultCornerProp, storageKey]);

	const clearCollapseTimer = useCallback(() => {
		if (collapseTimerRef.current !== null) {
			clearTimeout(collapseTimerRef.current);
			collapseTimerRef.current = null;
		}
	}, []);

	const clearGrabHintTimer = useCallback(() => {
		if (grabHintTimerRef.current !== null) {
			clearTimeout(grabHintTimerRef.current);
			grabHintTimerRef.current = null;
		}
	}, []);

	const scheduleCollapse = useCallback(() => {
		clearCollapseTimer();
		if (collapseAfterMs <= 0 || disabled) return;
		collapseTimerRef.current = setTimeout(() => {
			setCollapsed(true);
			collapseTimerRef.current = null;
		}, collapseAfterMs);
	}, [clearCollapseTimer, collapseAfterMs, disabled]);

	const scheduleGrabHint = useCallback(() => {
		clearGrabHintTimer();
		if (dragDisabled || disabled || grabHintAfterMs <= 0) return;
		grabHintTimerRef.current = setTimeout(() => {
			setShowGrabCursor(true);
			grabHintTimerRef.current = null;
		}, grabHintAfterMs);
	}, [clearGrabHintTimer, disabled, dragDisabled, grabHintAfterMs]);

	useEffect(() => {
		if (dragging) {
			clearCollapseTimer();
			return;
		}
		setCollapsed(false);
		scheduleCollapse();
		return clearCollapseTimer;
	}, [clearCollapseTimer, dragging, scheduleCollapse]);

	useEffect(
		() => () => {
			clearCollapseTimer();
			clearGrabHintTimer();
			if (snapTimerRef.current !== null) {
				clearTimeout(snapTimerRef.current);
			}
			if (snapFrameRef.current !== null) {
				window.cancelAnimationFrame(snapFrameRef.current);
			}
		},
		[clearCollapseTimer, clearGrabHintTimer],
	);

	const setNextCorner = useCallback(
		(nextCorner: FloatingButtonCorner) => {
			if (corner === undefined) {
				setUncontrolledCorner(nextCorner);
			}
			safeSetStoredCorner(storageKey, nextCorner);
			onCornerChange?.(nextCorner);
		},
		[corner, onCornerChange, storageKey],
	);

	const beginRest = useCallback(() => {
		clearGrabHintTimer();
		setShowGrabCursor(false);
		if (!dragging) {
			scheduleCollapse();
		}
	}, [clearGrabHintTimer, dragging, scheduleCollapse]);

	const expandForInteraction = useCallback(() => {
		if (dragging) return;
		clearCollapseTimer();
		setCollapsed(false);
		setShowGrabCursor(false);
		scheduleGrabHint();
	}, [clearCollapseTimer, dragging, scheduleGrabHint]);

	const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
		onPointerDown?.(event);
		if (
			event.defaultPrevented ||
			disabled ||
			dragDisabled ||
			event.button !== 0
		) {
			return;
		}
		clearCollapseTimer();
		clearGrabHintTimer();
		suppressClickRef.current = false;
		dragStateRef.current = {
			lastTime: performance.now(),
			lastX: event.clientX,
			lastY: event.clientY,
			moved: false,
			startCorner: activeCorner,
			startX: event.clientX,
			startY: event.clientY,
			velocityX: 0,
			velocityY: 0,
		};
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// Pointer capture is not available in every test/runtime environment.
		}
	};

	const moveDrag = useCallback(
		(event: PointerEvent | MouseEvent) => {
			const dragState = dragStateRef.current;
			if (!dragState) return;
			const dx = event.clientX - dragState.startX;
			const dy = event.clientY - dragState.startY;
			const now = performance.now();
			const elapsedMs = Math.max(1, now - dragState.lastTime);
			dragState.velocityX =
				((event.clientX - dragState.lastX) / elapsedMs) * 1000;
			dragState.velocityY =
				((event.clientY - dragState.lastY) / elapsedMs) * 1000;
			dragState.lastX = event.clientX;
			dragState.lastY = event.clientY;
			dragState.lastTime = now;

			if (!dragState.moved && Math.hypot(dx, dy) > dragClickThreshold) {
				dragState.moved = true;
				setDragging(true);
				setCollapsed(true);
				setShowGrabCursor(true);
			}

			if (dragState.moved) {
				event.preventDefault();
				setDragOffset({ x: dx, y: dy });
			}
		},
		[dragClickThreshold],
	);

	const endDrag = useCallback(
		(event: PointerEvent | MouseEvent) => {
			const dragState = dragStateRef.current;
			if (!dragState) return;
			dragStateRef.current = null;
			setDragging(false);

			if (!dragState.moved || !buttonRef.current) {
				setDragOffset({ x: 0, y: 0 });
				scheduleCollapse();
				return;
			}

			event.preventDefault();
			const targetCorner = chooseFloatingButtonCorner({
				releaseX: Math.max(0, Math.min(window.innerWidth, event.clientX)),
				releaseY: Math.max(0, Math.min(window.innerHeight, event.clientY)),
				velocityThreshold,
				velocityX: dragState.velocityX,
				velocityY: dragState.velocityY,
			});
			const rect = buttonRef.current.getBoundingClientRect();
			const numericEdgeInset = toNumber(edgeInset, defaultEdgeInset);
			const numericBottomLiftInset = toNumber(
				bottomLiftInset,
				defaultBottomLiftInset,
			);
			const startRest = getRestPosition({
				bottomLiftInset: numericBottomLiftInset,
				buttonHeight: rect.height,
				buttonWidth: rect.width,
				corner: dragState.startCorner,
				edgeInset: numericEdgeInset,
				liftBottomCorners,
			});
			const targetRest = getRestPosition({
				bottomLiftInset: numericBottomLiftInset,
				buttonHeight: rect.height,
				buttonWidth: rect.width,
				corner: targetCorner,
				edgeInset: numericEdgeInset,
				liftBottomCorners,
			});
			const snapOffset = {
				x: startRest.x + dragOffset.x - targetRest.x,
				y: startRest.y + dragOffset.y - targetRest.y,
			};

			suppressClickRef.current = true;
			setNextCorner(targetCorner);
			setSnapping(true);
			setDragOffset(snapOffset);
			if (snapFrameRef.current !== null) {
				window.cancelAnimationFrame(snapFrameRef.current);
			}
			snapFrameRef.current = window.requestAnimationFrame(() => {
				setDragOffset({ x: 0, y: 0 });
				snapFrameRef.current = null;
			});
			if (snapTimerRef.current !== null) {
				clearTimeout(snapTimerRef.current);
			}
			snapTimerRef.current = setTimeout(() => {
				setSnapping(false);
				snapTimerRef.current = null;
			}, snapDurationMs);
			scheduleCollapse();
		},
		[
			bottomLiftInset,
			dragOffset.x,
			dragOffset.y,
			edgeInset,
			liftBottomCorners,
			scheduleCollapse,
			setNextCorner,
			snapDurationMs,
			velocityThreshold,
		],
	);

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent | MouseEvent) =>
			moveDrag(event);
		const handlePointerUp = (event: PointerEvent | MouseEvent) =>
			endDrag(event);

		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);
		return () => {
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		};
	}, [endDrag, moveDrag]);

	const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
		onPointerEnter?.(event);
		if (!event.defaultPrevented) {
			expandForInteraction();
		}
	};

	const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
		onPointerMove?.(event);
		if (!event.defaultPrevented && !showGrabCursor && !dragging) {
			scheduleGrabHint();
		}
	};

	const handlePointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
		onPointerLeave?.(event);
		if (!event.defaultPrevented) {
			beginRest();
		}
	};

	const handleFocus = (event: ReactFocusEvent<HTMLButtonElement>) => {
		onFocus?.(event);
		if (!event.defaultPrevented) {
			expandForInteraction();
		}
	};

	const handleBlur = (event: ReactFocusEvent<HTMLButtonElement>) => {
		onBlur?.(event);
		if (!event.defaultPrevented) {
			beginRest();
		}
	};

	const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
		if (suppressClickRef.current) {
			suppressClickRef.current = false;
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		onClick?.(event);
	};

	const resolvedTooltipSide = useMemo(() => {
		if (tooltipSide !== 'auto') return tooltipSide;
		return activeCorner.endsWith('left') ? 'right' : 'left';
	}, [activeCorner, tooltipSide]);
	const bottomInset =
		liftBottomCorners && isBottomCorner(activeCorner)
			? bottomLiftInset
			: edgeInset;
	const floatingStyle: FloatingButtonStyle = {
		...style,
		'--pds-floating-button-bottom-inset': toCssLength(bottomInset),
		'--pds-floating-button-drag-x': `${dragOffset.x}px`,
		'--pds-floating-button-drag-y': `${dragOffset.y}px`,
		'--pds-floating-button-edge-inset': toCssLength(edgeInset),
		'--pds-floating-button-z-index': zIndex,
	};

	const ariaLabel =
		props['aria-label'] ?? (typeof label === 'string' ? label : undefined);

	return (
		<button
			{...props}
			aria-label={ariaLabel}
			className={cx(
				'pds-floating-button',
				`pds-floating-button--${position}`,
				`pds-floating-button--${activeCorner}`,
				collapsed && 'pds-floating-button--collapsed',
				dragging && 'pds-floating-button--dragging',
				snapping && 'pds-floating-button--snapping',
				showGrabCursor && 'pds-floating-button--grab-ready',
				disabled && 'pds-floating-button--disabled',
				className,
			)}
			disabled={disabled}
			onBlur={handleBlur}
			onClick={handleClick}
			onFocus={handleFocus}
			onPointerDown={handlePointerDown}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
			onPointerMove={handlePointerMove}
			ref={buttonRef}
			style={floatingStyle}
			type={type}
		>
			<span aria-hidden="true" className="pds-floating-button__icon">
				{renderFloatingButtonIcon(icon)}
			</span>
			<span className="pds-floating-button__label">{label}</span>
			{tooltip ? (
				<span
					className={cx(
						'pds-floating-button__tooltip',
						`pds-floating-button__tooltip--${resolvedTooltipSide}`,
					)}
					role="tooltip"
				>
					{tooltip}
				</span>
			) : null}
		</button>
	);
}
