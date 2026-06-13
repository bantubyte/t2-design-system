import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { resolvePalette } from '../../../charts-core';
import { ThemeProvider } from '../../../theme';

const meta = {
	title: 'Charts/Internal/ContrastAudit',
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const readableSwatchText = (color: string) =>
	color.toLowerCase() === '#0072b2' || color.toLowerCase() === '#000000'
		? '#ffffff'
		: '#000000';

export const PaletteSwatches: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: 18, width: 760 }}>
			{(['pikaboo', 'pikaboo-dark', 'primedia'] as const).map((theme) => (
				<ThemeProvider key={theme} theme={theme}>
					<div className="pds-chart-table" style={{ padding: 16 }}>
						<strong>{theme}</strong>
						<div
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 8,
								marginTop: 12,
							}}
						>
							{resolvePalette('colorblind').categorical.map((color) => (
								<span
									key={color}
									style={{
										background: color,
										borderRadius: 999,
										color: readableSwatchText(color),
										fontWeight: 900,
										padding: '0.35rem 0.5rem',
									}}
								>
									{color}
								</span>
							))}
						</div>
					</div>
				</ThemeProvider>
			))}
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('pikaboo')).toBeVisible();
		await expect(canvas.getByText('pikaboo-dark')).toBeVisible();
		await expect(canvas.getByText('primedia')).toBeVisible();
	},
};
