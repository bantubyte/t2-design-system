import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { Checkbox, type CheckboxProps } from './form';

function ControlledCheckbox(args: Partial<CheckboxProps>) {
	const [checked, setChecked] = useState(false);
	return (
		<Checkbox
			{...args}
			checked={checked}
			onChange={(event) => setChecked(event.target.checked)}
		/>
	);
}

const meta = {
	title: 'Components/Checkbox',
	component: Checkbox,
	tags: ['autodocs', 'ai-generated'],
	argTypes: {
		indeterminate: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	args: {
		label: 'Within radius',
		indeterminate: false,
		disabled: false,
	},
	render: (args) => <ControlledCheckbox {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Indeterminate: Story = {
	args: { indeterminate: true },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const TogglesOnClick: Story = {
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('checkbox');
		await expect(input).not.toBeChecked();
		await userEvent.click(input);
		await expect(input).toBeChecked();
	},
};
