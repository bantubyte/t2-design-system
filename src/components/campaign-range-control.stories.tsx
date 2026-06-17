import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import { CampaignRangeControl } from './campaign';

const meta = {
	title: 'Components/CampaignRangeControl',
	component: CampaignRangeControl,
	tags: ['autodocs', 'ai-generated'],
	// Baseline args to satisfy the required props; each story's `render`
	// supplies its own controlled values.
	args: { label: 'Range', min: 0, max: 100 },
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '34rem', padding: '2rem' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof CampaignRangeControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// Real audience age-bracket boundaries — the dual-range handles snap to these.
const AGE_SNAP = [15, 18, 25, 35, 45, 55, 65, 75, 84];

/**
 * Dual-range with `snapValues`: drag either handle and it lands only on a real
 * bracket boundary (15 / 18 / 25 / 35 / 45 / 55 / 65 / 75 / 84) rather than every
 * integer. Also exercises the fill-alignment fix — the purple fill should sit
 * exactly under the thumb centres at both ends (no overhang at min/max).
 */
export const AgeBracketSnapping: Story = {
	render: () => {
		const [value, setValue] = useState<[number, number]>([25, 55]);
		return (
			<CampaignRangeControl
				formatValue={(v) => `${v} yrs`}
				label="Age Range (snaps to brackets)"
				max={84}
				min={15}
				onValueChange={(v) => {
					if (Array.isArray(v)) setValue([v[0], v[1]]);
				}}
				snapValues={AGE_SNAP}
				unit="years"
				value={value}
			/>
		);
	},
	play: async ({ canvas }) => {
		await expect(
			canvas.getByText('Age Range (snaps to brackets)'),
		).toBeVisible();
	},
};

/**
 * Continuous dual-range (no `snapValues`) for comparison — moves by `step`.
 * Use this to eyeball the fill/thumb alignment as the handles move inward.
 */
export const ContinuousRange: Story = {
	render: () => {
		const [value, setValue] = useState<[number, number]>([200, 1800]);
		return (
			<CampaignRangeControl
				formatValue={(v) => `R${v}k`}
				label="Income Range (continuous, step 50)"
				max={2500}
				min={0}
				onValueChange={(v) => {
					if (Array.isArray(v)) setValue([v[0], v[1]]);
				}}
				step={50}
				value={value}
			/>
		);
	},
};
