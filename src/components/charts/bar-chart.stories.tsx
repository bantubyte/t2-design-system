import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BarChart } from './bar-chart';

const data = [
	{ channel: 'Roadside', planned: 42, delivered: 51 },
	{ channel: 'Mall', planned: 28, delivered: 24 },
	{ channel: 'Transit', planned: 18, delivered: 22 },
	{ channel: 'Airport', planned: 12, delivered: 15 },
];

const meta = {
	title: 'Charts/BarChart',
	component: BarChart,
	tags: ['autodocs'],
	args: {
		ariaLabel: 'Channel delivery by format',
		data,
		series: [
			{ key: 'planned', label: 'Planned' },
			{ key: 'delivered', label: 'Delivered' },
		],
		xKey: 'channel',
		yFormat: (value: unknown) => `${value}%`,
	},
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div style={{ width: 760 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /channel delivery/i }),
		).toBeVisible();
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 24, width: 760 }}>
			<BarChart {...args} variant="grouped" />
			<BarChart {...args} variant="stacked" />
			<BarChart {...args} variant="stacked100" />
			<BarChart {...args} orientation="horizontal" />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getAllByRole('img', { name: /channel delivery/i }),
		).toHaveLength(4);
	},
};

export const Empty: Story = {
	args: { data: [] },
	render: (args) => (
		<div style={{ width: 520 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /channel delivery/i }),
		).toBeVisible();
	},
};

export const Loading: Story = {
	args: { loading: true },
	render: (args) => (
		<div style={{ width: 520 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /channel delivery/i }),
		).toBeVisible();
	},
};

export const ErrorState: Story = {
	args: { error: 'Unable to load bar chart data.' },
	render: (args) => (
		<div style={{ width: 520 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText('Unable to load bar chart data.'),
		).toBeVisible();
	},
};

export const RealisticPikabooData: Story = Playground;

export const RealisticPrimediaData: Story = {
	args: {
		data: [
			{ channel: 'Digital', delivered: 37, planned: 34 },
			{ channel: 'Static', delivered: 29, planned: 31 },
			{ channel: 'Transit', delivered: 21, planned: 20 },
			{ channel: 'Retail', delivered: 13, planned: 15 },
		],
	},
	render: (args) => (
		<div style={{ width: 760 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /channel delivery/i }),
		).toBeVisible();
	},
};

export const KeyboardNavigation: Story = Playground;

export const A11yTableFallback: Story = {
	args: { tableVisible: true },
	render: (args) => (
		<div style={{ width: 760 }}>
			<BarChart {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('img', { name: /channel delivery/i }),
		).toBeVisible();
	},
};
