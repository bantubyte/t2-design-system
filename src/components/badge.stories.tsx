import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge, RemovableBadge, SelectionBadge } from './badge';

const meta = {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs', 'ai-generated'],
	argTypes: {
		tone: {
			control: 'select',
			options: [
				'neutral',
				'brand',
				'accent',
				'success',
				'warning',
				'danger',
				'info',
			],
		},
		size: {
			control: 'inline-radio',
			options: ['sm', 'md'],
		},
	},
	args: {
		children: 'Active',
		tone: 'brand',
		size: 'md',
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Active')).toBeVisible();
	},
};

export const Tones: Story = {
	render: () => (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
			<Badge tone="neutral">Neutral</Badge>
			<Badge tone="brand">Brand</Badge>
			<Badge tone="accent">Accent</Badge>
			<Badge tone="success">Ready</Badge>
			<Badge tone="warning">Review</Badge>
			<Badge tone="danger">Blocked</Badge>
			<Badge tone="info">Insight</Badge>
		</div>
	),
	play: async ({ canvas }) => {
		const labels = [
			'Neutral',
			'Brand',
			'Accent',
			'Ready',
			'Review',
			'Blocked',
			'Insight',
		];
		for (const label of labels) {
			await expect(canvas.getByText(label)).toBeVisible();
		}
	},
};

export const Removable: Story = {
	render: () => (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
			<RemovableBadge label="Gauteng" tone="brand" />
			<RemovableBadge label="Western Cape" suffix="primary" tone="brand" />
			<RemovableBadge label="KwaZulu-Natal" tone="info" />
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Gauteng')).toBeVisible();
		await expect(canvas.getByText('Western Cape')).toBeVisible();
		await expect(canvas.getByText('KwaZulu-Natal')).toBeVisible();
	},
};

export const Selection: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
			<SelectionBadge items={[]} />
			<SelectionBadge items={['Gauteng']} />
			<SelectionBadge
				items={['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape']}
				maxVisible={2}
			/>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Gauteng')).toBeVisible();
	},
};

// pds-badge has border-radius: 999px — fails if styles.css did not load through
// the shared preview.
export const CssCheck: Story = {
	args: { children: 'Brand', tone: 'brand' },
	play: async ({ canvas }) => {
		const badge = canvas
			.getByText('Brand')
			.closest('.pds-badge') as HTMLElement;
		await expect(badge).toBeInstanceOf(HTMLElement);
		await expect(getComputedStyle(badge).borderRadius).toBe('999px');
	},
};
