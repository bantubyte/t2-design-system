import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PoiBulkAddTip } from './poi';

const meta = {
	title: 'Components/PoiBulkAddTip',
	component: PoiBulkAddTip,
	tags: ['autodocs', 'ai-generated'],
	argTypes: {
		tooltipSide: {
			control: 'inline-radio',
			options: ['top', 'right', 'bottom', 'left'],
		},
	},
	args: {
		tooltipSide: 'top',
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '28rem', padding: '2rem' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PoiBulkAddTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	play: async ({ canvas }) => {
		await expect(canvas.getByText('Top Tip: Bulk Add')).toBeVisible();
	},
};

export const CustomCopy: Story = {
	args: {
		text: 'Paste a column from your spreadsheet to add many at once.',
		tooltip: 'Each line becomes one verified location.',
	},
};
