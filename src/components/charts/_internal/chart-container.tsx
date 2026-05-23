import {
	createContext,
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import type {
	ChartA11yColumn,
	ChartDatum,
	ChartPalette,
	ChartPaletteName,
	ChartStatusProps,
} from '../../../charts-core';
import {
	defaultChartPalette,
	paletteFromCssVariables,
	resolvePalette,
} from '../../../charts-core';
import { useTheme } from '../../../theme/theme-provider';
import { cx } from '../../../utils/class-names';
import { A11yDataTable } from './a11y-data-table';
import { ChartEmpty } from './chart-empty';
import { ChartError } from './chart-error';
import { ChartLoading, type ChartLoadingVariant } from './chart-loading';

export interface ChartContextValue {
	palette: ChartPalette;
	resolvePalette: (name?: ChartPaletteName) => ChartPalette;
}

const ChartContext = createContext<ChartContextValue>({
	palette: defaultChartPalette,
	resolvePalette: (name = 'default') => resolvePalette(name),
});

export interface ChartProviderProps extends HTMLAttributes<HTMLDivElement> {
	palette?: ChartPaletteName;
}

const readPaletteFromElement = (
	element: HTMLElement | null,
	name: ChartPaletteName,
): ChartPalette => {
	if (typeof window === 'undefined' || !element) {
		return resolvePalette(name);
	}
	const styles = window.getComputedStyle(element);
	const readVariable = (variable: string) => {
		const value = styles.getPropertyValue(variable).trim();
		return value || undefined;
	};
	return resolvePalette(name, paletteFromCssVariables(readVariable));
};

export function ChartProvider({
	children,
	className,
	palette = 'default',
	...props
}: ChartProviderProps) {
	const { themeId } = useTheme();
	const ref = useRef<HTMLDivElement>(null);
	const [resolvedPalette, setResolvedPalette] = useState<ChartPalette>(() =>
		resolvePalette(palette),
	);

	useEffect(() => {
		setResolvedPalette(readPaletteFromElement(ref.current, palette));
	}, [palette, themeId]);

	const value = useMemo<ChartContextValue>(
		() => ({
			palette: resolvedPalette,
			resolvePalette: (name = palette) =>
				name === palette
					? resolvedPalette
					: readPaletteFromElement(ref.current, name),
		}),
		[palette, resolvedPalette],
	);

	return (
		<ChartContext.Provider value={value}>
			<div className={cx('pds-chart-provider', className)} ref={ref} {...props}>
				{children}
			</div>
		</ChartContext.Provider>
	);
}

export const useChartContext = (): ChartContextValue => useContext(ChartContext);

export const useChartPalette = (palette?: ChartPaletteName): ChartPalette => {
	const context = useChartContext();
	return palette ? context.resolvePalette(palette) : context.palette;
};

export interface ChartContainerProps<T extends ChartDatum>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartStatusProps {
	actions?: ReactNode;
	ariaDescription?: string;
	ariaLabel: string;
	children: ReactNode;
	data: readonly T[];
	height?: number;
	loadingVariant?: ChartLoadingVariant;
	style?: CSSProperties;
	tableCaption?: string;
	tableColumns?: readonly ChartA11yColumn<T>[];
	tableVisible?: boolean;
}

export function ChartContainer<T extends ChartDatum>({
	actions,
	ariaDescription,
	ariaLabel,
	children,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 320,
	loading,
	loadingVariant,
	style,
	tableCaption,
	tableColumns,
	tableVisible = false,
	...props
}: ChartContainerProps<T>) {
	const descriptionId = ariaDescription
		? `${ariaLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-description`
		: undefined;

	return (
		<>
			<div
				aria-describedby={descriptionId}
				aria-label={ariaLabel}
				className={cx('pds-chart', className)}
				role="img"
				style={{ '--pds-chart-height': `${height}px`, ...style } as CSSProperties}
				{...props}
			>
				{ariaDescription ? (
					<p className="pds-visually-hidden" id={descriptionId}>
						{ariaDescription}
					</p>
				) : null}
				{actions ? <div className="pds-chart__actions">{actions}</div> : null}
				<div className="pds-chart__body">
					{loading ? (
						<ChartLoading variant={loadingVariant} />
					) : error ? (
						<ChartError message={error} />
					) : empty || data.length === 0 ? (
						<ChartEmpty message={emptyMessage} />
					) : (
						children
					)}
				</div>
			</div>
			{tableColumns?.length ? (
				<A11yDataTable
					caption={tableCaption ?? ariaLabel}
					columns={tableColumns}
					data={data}
					visible={tableVisible}
				/>
			) : null}
		</>
	);
}
