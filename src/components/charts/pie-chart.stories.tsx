import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PieChart } from './pie-chart';

const data = [
	{ format: 'Spectacular', share: 38 },
	{ format: 'Retail', share: 26 },
	{ format: 'Roadside', share: 22 },
	{ format: 'Transit', share: 14 },
];

const meta = {
	title: 'Charts/PieChart',
	component: PieChart,
	tags: ['autodocs'],
	args: {
		ariaLabel: 'Inventory mix by format',
		centerLabel: '100%',
		data,
		nameKey: 'format',
		valueKey: 'share',
		variant: 'donut',
	},
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div style={{ width: 560 }}>
			<PieChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /inventory mix/i }),
		).toBeVisible();
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 24, width: 620 }}>
			<PieChart {...args} variant="pie" />
			<PieChart {...args} variant="donut" />
			<PieChart {...args} palette="colorblind" />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getAllByRole('img', { name: /inventory mix/i }),
		).toHaveLength(3);
	},
};

export const Empty: Story = {
	args: { data: [] },
	render: (args) => (
		<div style={{ width: 520 }}>
			<PieChart {...args} />
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
			<PieChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('status', { name: /loading chart/i }),
		).toBeVisible();
	},
};

export const ErrorState: Story = {
	args: { error: 'Unable to load mix data.' },
	render: (args) => (
		<div style={{ width: 520 }}>
			<PieChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Unable to load mix data.')).toBeVisible();
	},
};

export const RealisticPikabooData: Story = Playground;
export const RealisticPrimediaData: Story = {
	args: {
		data: [
			{ format: 'Digital network', share: 41 },
			{ format: 'Static network', share: 33 },
			{ format: 'Retail environments', share: 16 },
			{ format: 'Transit nodes', share: 10 },
		],
	},
	render: (args) => (
		<div style={{ width: 560 }}>
			<PieChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /inventory mix/i }),
		).toBeVisible();
	},
};

export const A11yTableFallback: Story = {
	args: { tableVisible: true },
	render: (args) => (
		<div style={{ width: 560 }}>
			<PieChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /inventory mix/i }),
		).toBeVisible();
	},
};
