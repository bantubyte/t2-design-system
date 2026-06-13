import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Popover } from './popover';

const meta = {
	title: 'Components/Popover',
	component: Popover,
	tags: ['autodocs', 'ai-generated'],
	argTypes: {
		align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
		width: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
		triggerVariant: {
			control: 'select',
			options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
		},
	},
	args: {
		align: 'start',
		width: 'md',
		triggerVariant: 'outline',
		label: 'Markets',
		children: (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
				<span>Gauteng</span>
				<span>Western Cape</span>
				<span>KwaZulu-Natal</span>
			</div>
		),
	},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('button', { name: /markets/i }),
		).toBeVisible();
	},
};

export const OpensAndExposesPanel: Story = {
	args: {
		label: 'Filters',
		children: <p style={{ margin: 0 }}>Filter the campaigns list.</p>,
	},
	play: async ({ canvas, userEvent }) => {
		const trigger = canvas.getByRole('button', { name: /filters/i });
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');

		await userEvent.click(trigger);
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await expect(
			await canvas.findByRole('dialog', { name: /popover content/i }),
		).toBeVisible();
	},
};
