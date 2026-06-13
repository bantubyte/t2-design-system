import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { Combobox, type ComboboxOption, type ComboboxProps } from './combobox';

const ADDRESSES: ComboboxOption[] = [
	{ value: '1', label: '1 Main Road, Sandton', description: 'Johannesburg' },
	{
		value: '2',
		label: '5 Loop Street, Cape Town CBD',
		description: 'Cape Town',
	},
	{ value: '3', label: '12 Florida Road, Morningside', description: 'Durban' },
];

function ControlledCombobox(args: Partial<ComboboxProps>) {
	const [value, setValue] = useState('');
	const [selected, setSelected] = useState<string | null>(null);
	const query = value.trim().toLowerCase();
	const options =
		query.length > 0
			? ADDRESSES.filter((option) =>
					String(option.label).toLowerCase().includes(query),
				)
			: [];

	return (
		<div style={{ maxWidth: 360 }}>
			<Combobox
				{...args}
				onOptionSelect={(option) => {
					setValue(String(option.label));
					setSelected(option.value);
				}}
				onValueChange={setValue}
				options={options}
				value={value}
			/>
			{selected ? (
				<p style={{ marginTop: '0.5rem' }}>Selected id: {selected}</p>
			) : null}
		</div>
	);
}

const meta = {
	title: 'Components/Combobox',
	component: Combobox,
	tags: ['autodocs', 'ai-generated'],
	argTypes: {
		status: {
			control: 'inline-radio',
			options: ['default', 'success', 'warning', 'danger'],
		},
		isLoading: { control: 'boolean' },
	},
	args: {
		// Required props are supplied by the stateful render wrapper below; these
		// stubs satisfy the type checker for the args-driven stories.
		value: '',
		onValueChange: () => {},
		options: [],
		onOptionSelect: () => {},
		placeholder: 'Search for an address…',
		status: 'default',
		isLoading: false,
	},
	render: (args) => <ControlledCombobox {...args} />,
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	play: async ({ canvas }) => {
		const input = canvas.getByRole('combobox');
		await expect(input).toBeVisible();
	},
};

export const TypeAndSelect: Story = {
	play: async ({ canvas, userEvent }) => {
		const input = canvas.getByRole('combobox');
		await expect(input).toHaveAttribute('aria-expanded', 'false');

		await userEvent.type(input, 'Cape');
		const option = await canvas.findByRole('option', { name: /Loop Street/i });
		await expect(option).toBeVisible();

		await userEvent.click(option);
		await expect(input).toHaveValue('5 Loop Street, Cape Town CBD');
	},
};
