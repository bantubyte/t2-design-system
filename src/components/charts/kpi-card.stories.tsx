import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BigNumber } from './big-number';
import { CategoryBar } from './category-bar';
import { KpiCard } from './kpi-card';
import { KpiStrip } from './kpi-strip';
import { ProgressBar } from './progress-bar';
import { ProgressCircle } from './progress-circle';

const meta = {
	title: 'Charts/KPI',
	component: KpiCard,
	tags: ['autodocs'],
	args: {
		delta: '+12%',
		footnote: 'Ahead of booked audience delivery.',
		label: 'Reach',
		sparkline: [12, 18, 17, 24, 31, 36, 42],
		value: '2.6M',
	},
} satisfies Meta<typeof KpiCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div style={{ width: 320 }}>
			<KpiCard {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('2.6M')).toBeVisible();
	},
};

export const AllVariants: Story = {
	render: (args) => (
		<div style={{ display: 'grid', gap: 20, width: 860 }}>
			<KpiStrip>
				<KpiCard {...args} tone="good" />
				<KpiCard {...args} label="Pacing" tone="watch" value="88%" />
				<KpiCard {...args} label="Risk" tone="risk" value="3" />
				<KpiCard {...args} label="Attention" tone="info" value="58" />
			</KpiStrip>
			<BigNumber delta="+8.4%" label="Incremental visits" value="48,240" />
			<CategoryBar
				ariaLabel="Audience mix by segment"
				segments={[
					{ label: 'Commuters', value: 44 },
					{ label: 'Retail', value: 31 },
					{ label: 'Events', value: 25 },
				]}
			/>
			<ProgressBar label="Delivery pacing" value={0.82} />
			<ProgressCircle label="Confidence" value={0.76} />
		</div>
	),
};

export const Empty: Story = {
	args: { sparkline: undefined, value: '—' },
	render: (args) => (
		<div style={{ width: 320 }}>
			<KpiCard {...args} />
		</div>
	),
};

export const Loading: Story = Playground;
export const Error: Story = Playground;
export const RealisticPikabooData: Story = Playground;
export const RealisticPrimediaData: Story = {
	args: {
		delta: '+6%',
		footnote: 'Primedia inventory sites above benchmark.',
		label: 'Audience reach',
		value: '1.9M',
	},
	render: (args) => (
		<div style={{ width: 320 }}>
			<KpiCard {...args} />
		</div>
	),
};
