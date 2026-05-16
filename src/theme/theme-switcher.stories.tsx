import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Surface } from '../components';
import { ThemeProvider, useTheme } from './theme-provider';
import { ThemeSwitcher } from './theme-switcher';
import { resolveThemeId, type ThemeId } from './tokens';

const meta = {
	title: 'Foundations/Theme Switcher',
	component: ThemeSwitcher,
	tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

function ThemeSwitcherDemo() {
	const { theme } = useTheme();

	return (
		<Surface style={{ minWidth: 360 }}>
			<ThemeSwitcher />
			<h2 style={{ fontFamily: 'var(--theme-font-heading)', marginBottom: 0 }}>
				{theme.copy.productName}
			</h2>
			<p style={{ color: 'var(--theme-foreground-muted)', marginBottom: 0 }}>
				{theme.id === 'primedia'
					? 'Cortexx is the Primedia-facing product name.'
					: 'PIKABOO is the Pikaboo tenant product name.'}
			</p>
		</Surface>
	);
}

export const Controlled: Story = {
	render: () => {
		const [themeId, setThemeId] = useState<ThemeId>('pikaboo');

		return (
			<ThemeProvider
				onThemeChange={(nextThemeId) => setThemeId(resolveThemeId(nextThemeId))}
				theme={themeId}
			>
				<ThemeSwitcherDemo />
			</ThemeProvider>
		);
	},
};
