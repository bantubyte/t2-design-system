import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ThemeProvider } from '../../theme';
import { LineChart } from './line-chart';

const data = [
	{ attention: 38, month: 'Jan', reach: 1_280_000 },
	{ attention: 42, month: 'Feb', reach: 1_520_000 },
	{ attention: 48, month: 'Mar', reach: 1_880_000 },
	{ attention: 45, month: 'Apr', reach: 1_740_000 },
	{ attention: 53, month: 'May', reach: 2_220_000 },
	{ attention: 58, month: 'Jun', reach: 2_610_000 },
];

const meta = {
	title: 'Charts/LineChart',
	component: LineChart,
	tags: ['autodocs'],
	args: {
		ariaLabel: 'Monthly campaign reach and attention',
		data,
		height: 320,
		series: [
			{ key: 'reach', label: 'Reach' },
			{ key: 'attention', label: 'Attention index' },
		],
		xKey: 'month',
		yFormat: (value: unknown) =>
			typeof value === 'number'
				? new Intl.NumberFormat('en-ZA', { notation: 'compact' }).format(value)
				: String(value ?? ''),
	},
} satisfies Meta<typeof LineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div style={{ width: 760 }}>
			<LineChart {...args} />
		</div>
	),
	play: async ({ canvas, userEvent }) => {
		const chart = canvas.getByRole('img', {
			name: /monthly campaign reach and attention/i,
		});
		await expect(chart).toBeVisible();
		const reachToggle = canvas.getByRole('button', { name: /reach/i });
		await userEvent.click(reachToggle);
		await expect(reachToggle).toHaveAttribute('aria-pressed', 'false');
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 24, width: 760 }}>
			<LineChart {...args} variant="default" />
			<LineChart {...args} variant="smooth" />
			<LineChart {...args} variant="stepped" />
			<LineChart {...args} palette="colorblind" />
		</div>
	),
};

export const Empty: Story = {
	args: {
		data: [],
		emptyMessage: 'No reach data for the selected campaign window.',
	},
	render: (args) => (
		<div style={{ width: 520 }}>
			<LineChart {...args} />
		</div>
	),
};

export const Loading: Story = {
	args: { loading: true },
	render: (args) => (
		<div style={{ width: 520 }}>
			<LineChart {...args} />
		</div>
	),
};

export const Error: Story = {
	args: { error: 'Insights service did not return trend data.' },
	render: (args) => (
		<div style={{ width: 520 }}>
			<LineChart {...args} />
		</div>
	),
};

export const RealisticPikabooData: Story = Playground;

export const RealisticPrimediaData: Story = {
	args: {
		data: [
			{ attention: 31, month: 'Jan', reach: 890_000 },
			{ attention: 36, month: 'Feb', reach: 1_120_000 },
			{ attention: 44, month: 'Mar', reach: 1_460_000 },
			{ attention: 51, month: 'Apr', reach: 1_680_000 },
			{ attention: 57, month: 'May', reach: 1_940_000 },
			{ attention: 62, month: 'Jun', reach: 2_080_000 },
		],
	},
	render: (args) => (
		<div style={{ width: 760 }}>
			<LineChart {...args} />
		</div>
	),
};

export const Themed: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 18, width: 760 }}>
			{(['pikaboo', 'pikaboo-dark', 'primedia'] as const).map((theme) => (
				<ThemeProvider key={theme} theme={theme}>
					<LineChart {...args} />
				</ThemeProvider>
			))}
		</div>
	),
};

export const KeyboardNavigation: Story = Playground;

export const A11yTableFallback: Story = {
	args: { tableVisible: true },
	render: (args) => (
		<div style={{ width: 760 }}>
			<LineChart {...args} />
		</div>
	),
};
