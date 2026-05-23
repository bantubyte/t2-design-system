import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider } from '../../../theme';
import { resolvePalette } from '../../../charts-core';

const meta = {
	title: 'Charts/Internal/ContrastAudit',
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PaletteSwatches: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: 18, width: 760 }}>
			{(['pikaboo', 'pikaboo-dark', 'primedia'] as const).map((theme) => (
				<ThemeProvider key={theme} theme={theme}>
					<div className="pds-chart-table" style={{ padding: 16 }}>
						<strong>{theme}</strong>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
							{resolvePalette('colorblind').categorical.map((color) => (
								<span
									key={color}
									style={{
										background: color,
										borderRadius: 999,
										color: theme === 'pikaboo-dark' ? '#0a0418' : '#ffffff',
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
};
