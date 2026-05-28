import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { ThemeToggle, type ThemeToggleMode } from './theme-toggle';

const meta = {
	title: 'Components/ThemeToggle',
	component: ThemeToggle,
	tags: ['autodocs', 'ai-generated'],
	parameters: {
		docs: {
			description: {
				component:
					'Pill-style sun/moon segmented toggle that switches the active design-system theme. Works uncontrolled (manages document `data-theme` + localStorage) or controlled (`value` + `onChange`).',
			},
		},
	},
	argTypes: {
		applyToDocument: { control: 'boolean' },
		persistKey: { control: 'text' },
	},
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		defaultValue: 'dark',
		applyToDocument: false,
		persistKey: false as unknown as string,
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: /dark/i })).toBeVisible();
	},
};

export const Light: Story = {
	args: {
		defaultValue: 'light',
		applyToDocument: false,
		persistKey: false as unknown as string,
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: /light/i })).toBeVisible();
	},
};

export const Dark: Story = {
	args: {
		defaultValue: 'dark',
		applyToDocument: false,
		persistKey: false as unknown as string,
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByRole('button', { name: /dark/i })).toBeVisible();
	},
};

export const Controlled: Story = {
	render: () => {
		const [mode, setMode] = useState<ThemeToggleMode>('dark');
		return (
			<div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
				<ThemeToggle
					applyToDocument={false}
					onChange={setMode}
					persistKey={false}
					value={mode}
				/>
				<code style={{ fontSize: 12 }}>current mode: {mode}</code>
			</div>
		);
	},
	play: async ({ canvas }) => {
		await expect(canvas.getByText(/current mode/)).toBeVisible();
		await expect(canvas.getByRole('button', { name: /dark/i })).toBeVisible();
	},
};

export const CustomLabels: Story = {
	args: {
		ariaLabel: 'Site theme',
		darkLabel: 'Night mode',
		defaultValue: 'dark',
		lightLabel: 'Day mode',
		applyToDocument: false,
		persistKey: false as unknown as string,
	},
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('button', { name: /night mode/i }),
		).toBeVisible();
		await expect(
			canvas.getByRole('button', { name: /day mode/i }),
		).toBeVisible();
	},
};
