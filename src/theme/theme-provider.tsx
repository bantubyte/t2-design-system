import {
	type CSSProperties,
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { cx } from '../utils/class-names';
import {
	type AnyDesignTheme,
	defaultThemeId,
	designThemes,
	getThemeCssVariables,
	getThemeDataAttributes,
	resolveTheme,
	type ThemeInput,
} from './tokens';

export interface ThemeContextValue {
	themeId: string;
	theme: AnyDesignTheme;
	setTheme: (themeId: ThemeInput) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	themeId: defaultThemeId,
	theme: designThemes[defaultThemeId],
	setTheme: () => undefined,
});

export interface ThemeProviderProps extends PropsWithChildren {
	theme?: ThemeInput;
	defaultTheme?: ThemeInput;
	onThemeChange?: (themeId: string, theme: AnyDesignTheme) => void;
	applyToRoot?: boolean;
	className?: string;
	style?: CSSProperties;
}

export function ThemeProvider({
	theme,
	defaultTheme = defaultThemeId,
	onThemeChange,
	applyToRoot = false,
	className,
	style,
	children,
}: ThemeProviderProps) {
	const [uncontrolledTheme, setUncontrolledTheme] =
		useState<ThemeInput>(defaultTheme);
	const activeTheme = resolveTheme(theme ?? uncontrolledTheme);
	const themeId = activeTheme.id;

	const setTheme = useCallback(
		(nextTheme: ThemeInput) => {
			const nextActiveTheme = resolveTheme(nextTheme);
			if (theme === undefined) {
				setUncontrolledTheme(nextTheme);
			}
			onThemeChange?.(nextActiveTheme.id, nextActiveTheme);
		},
		[onThemeChange, theme],
	);

	useEffect(() => {
		if (!applyToRoot || typeof document === 'undefined') return;

		const root = document.documentElement;
		const previousTheme = root.dataset.theme;
		const previousBrand = root.dataset.brand;
		root.dataset.brand = 'pikaboo';
		root.dataset.theme = themeId;

		return () => {
			if (previousBrand) {
				root.dataset.brand = previousBrand;
			} else {
				delete root.dataset.brand;
			}

			if (previousTheme) {
				root.dataset.theme = previousTheme;
			} else {
				delete root.dataset.theme;
			}
		};
	}, [applyToRoot, themeId]);

	const value = useMemo(
		() => ({ themeId, theme: activeTheme, setTheme }),
		[activeTheme, setTheme, themeId],
	);

	return (
		<ThemeContext.Provider value={value}>
			<div
				{...getThemeDataAttributes(themeId)}
				className={cx('pds-root', className)}
				style={{ ...getThemeCssVariables(themeId), ...style }}
			>
				{children}
			</div>
		</ThemeContext.Provider>
	);
}

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
