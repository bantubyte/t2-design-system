import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLockup, BrandMark, PikabooWordmark, ProductName } from './brand';

const meta = {
	title: 'Components/Brand',
	component: BrandLockup,
	tags: ['autodocs', 'ai-generated'],
	parameters: {
		docs: {
			description: {
				component:
					'Brand primitives. Switch the tenant theme via the toolbar to see Pikaboo, Pikaboo Dark, and Primedia/Cortexx product copy.',
			},
		},
	},
} satisfies Meta<typeof BrandLockup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MarkSizes: Story = {
	render: () => (
		<div style={{ alignItems: 'center', display: 'flex', gap: '1rem' }}>
			<BrandMark size={24} />
			<BrandMark size={36} />
			<BrandMark size={56} />
		</div>
	),
};

export const ProductNameOnly: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
			<ProductName />
			<ProductName withTenant />
		</div>
	),
};

export const Wordmark: Story = {
	render: () => (
		<div
			style={{
				alignItems: 'center',
				display: 'grid',
				gap: '1rem',
				gridTemplateColumns: 'repeat(2, 1fr)',
			}}
		>
			<div style={{ padding: '2rem', background: '#fffbf5', borderRadius: 8 }}>
				<PikabooWordmark height={32} tone="light" />
			</div>
			<div style={{ padding: '2rem', background: '#121212', borderRadius: 8 }}>
				<PikabooWordmark height={32} tone="dark" />
			</div>
			<div style={{ padding: '2rem', background: '#160c32', borderRadius: 8 }}>
				<PikabooWordmark height={32} tone="dark" />
			</div>
			<div style={{ padding: '2rem', background: '#6b3fe4', borderRadius: 8 }}>
				<PikabooWordmark
					accentColor="#fff"
					height={32}
					textColor="#fff"
					tone="mono"
				/>
			</div>
		</div>
	),
};

export const LockupSurfaces: Story = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gap: '1rem',
				gridTemplateColumns: 'repeat(2, 1fr)',
			}}
		>
			<BrandLockup
				showTenant={false}
				subtitle="The intelligence layer for OOH"
				surface="pearl"
				useWordmark
				wordmarkHeight={28}
			/>
			<BrandLockup
				showTenant={false}
				subtitle="The intelligence layer for OOH"
				surface="slate"
				useWordmark
				wordmarkHeight={28}
			/>
			<BrandLockup
				showTenant={false}
				subtitle="The intelligence layer for OOH"
				surface="violet-ink"
				useWordmark
				wordmarkHeight={28}
			/>
			<BrandLockup
				showTenant={false}
				subtitle="The intelligence layer for OOH"
				surface="purple"
				useWordmark
				wordmarkHeight={28}
			/>
		</div>
	),
};
