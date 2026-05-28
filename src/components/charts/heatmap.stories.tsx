import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CalendarHeatmap } from './calendar-heatmap';
import { Heatmap } from './heatmap';

const data = [
	{ daypart: 'Morning', region: 'Gauteng', score: 84 },
	{ daypart: 'Midday', region: 'Gauteng', score: 62 },
	{ daypart: 'Evening', region: 'Gauteng', score: 91 },
	{ daypart: 'Morning', region: 'Western Cape', score: 58 },
	{ daypart: 'Midday', region: 'Western Cape', score: 73 },
	{ daypart: 'Evening', region: 'Western Cape', score: 79 },
	{ daypart: 'Morning', region: 'KZN', score: 47 },
	{ daypart: 'Midday', region: 'KZN', score: 66 },
	{ daypart: 'Evening', region: 'KZN', score: 71 },
];

const meta = {
	title: 'Charts/Heatmap',
	component: Heatmap,
	tags: ['autodocs'],
	args: {
		ariaLabel: 'Attention score heatmap',
		columnKey: 'daypart',
		data,
		rowKey: 'region',
		valueKey: 'score',
	},
} satisfies Meta<typeof Heatmap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div style={{ width: 680 }}>
			<Heatmap {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /attention score/i }),
		).toBeVisible();
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 24, width: 680 }}>
			<Heatmap {...args} />
			<CalendarHeatmap
				ariaLabel="Daily site activity"
				data={Array.from({ length: 42 }, (_, index) => ({
					date: new Date(2026, 0, index + 1).toISOString(),
					value: Math.round(20 + Math.sin(index / 3) * 18 + index),
				}))}
				dateKey="date"
				valueKey="value"
			/>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /attention score/i }),
		).toBeVisible();
		await expect(
			canvas.getByRole('img', { name: /daily site activity/i }),
		).toBeVisible();
	},
};

export const Empty: Story = {
	args: { data: [] },
	render: (args) => (
		<div style={{ width: 520 }}>
			<Heatmap {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('No chart data available.')).toBeVisible();
	},
};

export const Loading: Story = {
	args: { loading: true },
	render: (args) => (
		<div style={{ width: 520 }}>
			<Heatmap {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('status', { name: /loading chart/i }),
		).toBeVisible();
	},
};

export const ErrorState: Story = {
	args: { error: 'Unable to load heatmap data.' },
	render: (args) => (
		<div style={{ width: 520 }}>
			<Heatmap {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText('Unable to load heatmap data.'),
		).toBeVisible();
	},
};

export const A11yTableFallback: Story = {
	args: { tableVisible: true },
	render: (args) => (
		<div style={{ width: 680 }}>
			<Heatmap {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /attention score/i }),
		).toBeVisible();
	},
};
