import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { Accordion, DisclosureButton } from './disclosure';

const meta = {
	title: 'Components/Disclosure',
	component: Accordion,
	tags: ['autodocs', 'ai-generated'],
	args: {
		items: [
			{
				id: 'planning',
				title: 'Planning rules',
				content: 'How campaigns get scoped, scheduled, and approved.',
			},
			{
				id: 'reporting',
				title: 'Reporting cadence',
				content: 'Daily delivery snapshots and end-of-flight summaries.',
			},
			{
				id: 'support',
				title: 'Support coverage',
				content: '24/5 on WhatsApp with weekday escalation paths.',
			},
		],
	},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Planning rules')).toBeVisible();
		await expect(canvas.getByText('Reporting cadence')).toBeVisible();
	},
};

export const MultipleOpen: Story = {
	args: { defaultOpenItems: ['planning'], multiple: true },
	play: async ({ canvas, userEvent }) => {
		const planning = canvas.getByRole('button', { name: /planning rules/i });
		await expect(planning).toHaveAttribute('aria-expanded', 'true');

		const reporting = canvas.getByRole('button', {
			name: /reporting cadence/i,
		});
		await userEvent.click(reporting);
		await expect(reporting).toHaveAttribute('aria-expanded', 'true');
		// `multiple` means planning stays open after reporting opens.
		await expect(planning).toHaveAttribute('aria-expanded', 'true');
	},
};

export const DisclosureToggle: Story = {
	render: () => {
		function Toggle() {
			const [open, setOpen] = useState(false);
			return (
				<DisclosureButton
					onClick={() => setOpen((value) => !value)}
					open={open}
				>
					Advanced filters
				</DisclosureButton>
			);
		}
		return <Toggle />;
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Advanced filters')).toBeVisible();
	},
};
