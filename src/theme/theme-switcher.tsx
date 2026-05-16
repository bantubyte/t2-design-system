import type { FieldsetHTMLAttributes } from 'react';
import { cx } from '../utils/class-names';
import { useTheme } from './theme-provider';
import {
	type AnyDesignTheme,
	resolveTheme,
	type ThemeId,
	type ThemeInput,
	themeIds,
} from './tokens';

export type ThemeSwitcherOption = ThemeId | AnyDesignTheme;

export interface ThemeSwitcherProps
	extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
	value?: ThemeInput;
	onThemeChange?: (themeId: string, theme: AnyDesignTheme) => void;
	options?: readonly ThemeSwitcherOption[];
	label?: string;
}

export function ThemeSwitcher({
	value,
	onThemeChange,
	options = themeIds,
	label = 'Theme',
	className,
	...props
}: ThemeSwitcherProps) {
	const context = useTheme();
	const selectedThemeId = resolveTheme(value ?? context.theme).id;

	return (
		<fieldset className={cx('pds-theme-switcher', className)} {...props}>
			<legend className="pds-visually-hidden">{label}</legend>
			{options.map((option) => {
				const theme = resolveTheme(option);
				const isSelected = theme.id === selectedThemeId;

				return (
					<button
						aria-pressed={isSelected}
						className="pds-theme-switcher__option"
						key={theme.id}
						onClick={() => {
							context.setTheme(option);
							onThemeChange?.(theme.id, theme);
						}}
						title={
							theme.tenant
								? `${theme.name}: ${theme.copy.productName}`
								: theme.name
						}
						type="button"
					>
						<span className="pds-theme-switcher__swatch" />
						<span>{theme.name}</span>
					</button>
				);
			})}
		</fieldset>
	);
}
