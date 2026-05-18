import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import {
	Badge,
	FloatingButton,
	type FloatingButtonCorner,
	floatingButtonCorners,
	pdsIconNames,
	SectionHeader,
} from '../index';

interface FloatingButtonStoryArgs {
	bottomLiftInset: number;
	collapseAfterMs: number;
	defaultCorner: FloatingButtonCorner;
	dragDisabled: boolean;
	edgeInset: number;
	icon: (typeof pdsIconNames)[number];
	label: string;
	liftBottomCorners: boolean;
	position: 'absolute' | 'fixed';
	tooltip: string;
	tooltipSide: 'auto' | 'bottom' | 'left' | 'right' | 'top';
	zIndex: number;
}

const meta = {
	title: 'Components/Floating Button',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A generic draggable floating button. Use it for help, support, quick create, export, or any persistent action that should not own the dialog implementation.',
			},
			source: {
				code: `import { FloatingButton } from '@pikaboo/t2-design-system';

<FloatingButton
  icon="help"
  label="Contact Help"
  liftBottomCorners
  onClick={() => setHelpOpen(true)}
  storageKey="cortexx_help_fab_corner"
  tooltip="Drag me to another corner"
/>`,
			},
		},
	},
	argTypes: {
		defaultCorner: {
			control: 'select',
			options: floatingButtonCorners,
		},
		icon: {
			control: 'select',
			options: pdsIconNames,
		},
		position: {
			control: 'inline-radio',
			options: ['absolute', 'fixed'],
		},
		tooltipSide: {
			control: 'select',
			options: ['auto', 'left', 'right', 'top', 'bottom'],
		},
	},
} satisfies Meta<FloatingButtonStoryArgs>;

export default meta;

type Story = StoryObj<FloatingButtonStoryArgs>;

function FloatingButtonDemo(args: FloatingButtonStoryArgs) {
	const [corner, setCorner] = useState<FloatingButtonCorner>(
		args.defaultCorner,
	);
	const [clicks, setClicks] = useState(0);

	useEffect(() => {
		setCorner(args.defaultCorner);
	}, [args.defaultCorner]);

	return (
		<main className="pds-story-frame pds-floating-demo-page">
			<SectionHeader
				description="Change the args, drag the button to a corner, wait for idle collapse, then focus or hover it back open. Position absolute keeps the demo contained; fixed shows the production viewport behavior."
				eyebrow="Interactive primitive"
				title="Floating Button"
			/>

			<div className="pds-floating-demo-stage">
				<div className="pds-floating-demo-stage__panel">
					<Badge tone="info">Current corner: {corner}</Badge>
					<Badge tone="success">Clicks: {clicks}</Badge>
					<p>
						This component deliberately stays generic: icon, label, text,
						corner, persistence key, and click handler are props. The consuming
						app decides whether the click opens help, create campaign, export,
						chat, or anything else.
					</p>
				</div>

				<FloatingButton
					{...args}
					corner={corner}
					onClick={() => setClicks((count) => count + 1)}
					onCornerChange={setCorner}
					storageKey="pds-story-floating-button-corner"
				/>
			</div>
		</main>
	);
}

export const Playground: Story = {
	args: {
		bottomLiftInset: 20,
		collapseAfterMs: 4000,
		defaultCorner: 'bottom-right',
		dragDisabled: false,
		edgeInset: 20,
		icon: 'help',
		label: 'Contact Help',
		liftBottomCorners: true,
		position: 'absolute',
		tooltip: 'Drag me to another corner',
		tooltipSide: 'auto',
		zIndex: 10,
	},
	render: (args) => <FloatingButtonDemo {...args} />,
};

export const QuickCreateAction: Story = {
	args: {
		...Playground.args,
		defaultCorner: 'bottom-left',
		icon: 'plus',
		label: 'Create Campaign',
		tooltip: 'Start a new campaign',
	} as FloatingButtonStoryArgs,
	render: (args) => <FloatingButtonDemo {...args} />,
};
