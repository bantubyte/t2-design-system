import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoxPlot } from './box-plot';
import { ComboChart } from './combo-chart';
import { FunnelChart } from './funnel-chart';
import { Gauge } from './gauge';
import { Histogram } from './histogram';
import { RadarChart } from './radar-chart';
import { RadialBarChart } from './radial-bar-chart';
import { RibbonChart } from './ribbon-chart';
import { SankeyChart } from './sankey-chart';
import { ScatterChart } from './scatter-chart';
import { Treemap } from './treemap';
import { WaterfallChart } from './waterfall-chart';

const meta = {
	title: 'Charts/Extended',
	tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const trendData = [
	{ month: 'Jan', spend: 30, visits: 12 },
	{ month: 'Feb', spend: 34, visits: 16 },
	{ month: 'Mar', spend: 42, visits: 24 },
	{ month: 'Apr', spend: 39, visits: 21 },
];

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: 28, width: 860 }}>
			<ComboChart
				ariaLabel="Spend and visits combo chart"
				data={trendData}
				series={[
					{ key: 'spend', label: 'Spend', type: 'bar' },
					{ key: 'visits', label: 'Visits', type: 'line' },
				]}
				xKey="month"
			/>
			<ScatterChart
				ariaLabel="Reach versus frequency bubble chart"
				data={[
					{ frequency: 3.1, reach: 1.2, spend: 120 },
					{ frequency: 4.8, reach: 1.8, spend: 180 },
					{ frequency: 5.2, reach: 2.4, spend: 260 },
				]}
				sizeKey="spend"
				xKey="reach"
				yKey="frequency"
			/>
			<RadarChart
				angleKey="metric"
				ariaLabel="Plan strength radar"
				data={[
					{ metric: 'Reach', plan: 82, actual: 91 },
					{ metric: 'Frequency', plan: 68, actual: 73 },
					{ metric: 'Attention', plan: 74, actual: 79 },
					{ metric: 'Efficiency', plan: 88, actual: 76 },
				]}
				series={[
					{ key: 'plan', label: 'Plan' },
					{ key: 'actual', label: 'Actual' },
				]}
			/>
			<RadialBarChart
				ariaLabel="Creative recall by audience"
				data={[
					{ audience: 'Commuters', value: 72 },
					{ audience: 'Retail', value: 64 },
					{ audience: 'Events', value: 54 },
				]}
				nameKey="audience"
				valueKey="value"
			/>
			<Treemap
				ariaLabel="Inventory value treemap"
				data={[
					{ name: 'Spectacular', value: 42 },
					{ name: 'Roadside', value: 31 },
					{ name: 'Retail', value: 19 },
					{ name: 'Transit', value: 15 },
				]}
				nameKey="name"
				valueKey="value"
			/>
			<FunnelChart
				ariaLabel="Campaign setup funnel"
				data={[
					{ stage: 'Briefs', value: 240 },
					{ stage: 'Plans', value: 164 },
					{ stage: 'Approved', value: 98 },
					{ stage: 'Live', value: 74 },
				]}
				nameKey="stage"
				valueKey="value"
			/>
			<Histogram
				ariaLabel="Site score histogram"
				data={[12, 18, 22, 35, 41, 42, 48, 52, 66, 71, 74, 86].map(
					(value) => ({ value }),
				)}
				valueKey="value"
			/>
			<BoxPlot
				ariaLabel="Attention distribution box plot"
				data={[
					{ label: 'Pikaboo', lower: 42, max: 92, median: 63, min: 22, upper: 78 },
					{ label: 'Primedia', lower: 38, max: 86, median: 59, min: 18, upper: 72 },
				]}
			/>
			<WaterfallChart
				ariaLabel="Plan contribution waterfall"
				data={[
					{ label: 'Base', value: 100 },
					{ label: 'OOH', value: 34 },
					{ label: 'Retail', value: 18 },
					{ label: 'Waste', value: -12 },
					{ label: 'Final', value: 24 },
				]}
			/>
			<RibbonChart
				ariaLabel="Format rank over time"
				categoryKey="format"
				data={[
					{ format: 'Roadside', month: 'Jan', rank: 1 },
					{ format: 'Roadside', month: 'Feb', rank: 2 },
					{ format: 'Roadside', month: 'Mar', rank: 1 },
					{ format: 'Retail', month: 'Jan', rank: 2 },
					{ format: 'Retail', month: 'Feb', rank: 1 },
					{ format: 'Retail', month: 'Mar', rank: 3 },
					{ format: 'Transit', month: 'Jan', rank: 3 },
					{ format: 'Transit', month: 'Feb', rank: 3 },
					{ format: 'Transit', month: 'Mar', rank: 2 },
				]}
				rankKey="rank"
				xKey="month"
			/>
			<SankeyChart
				ariaLabel="Audience flow sankey"
				data={{
					links: [
						{ source: 0, target: 1, value: 42 },
						{ source: 0, target: 2, value: 28 },
						{ source: 1, target: 3, value: 24 },
						{ source: 2, target: 3, value: 18 },
					],
					nodes: [
						{ name: 'Audience' },
						{ name: 'Roadside' },
						{ name: 'Retail' },
						{ name: 'Visits' },
					],
				}}
			/>
			<Gauge label="Model confidence" value={78} />
		</div>
	),
};

export const Playground: Story = AllVariants;
export const Empty: Story = AllVariants;
export const Loading: Story = AllVariants;
export const Error: Story = AllVariants;
export const RealisticPikabooData: Story = AllVariants;
export const RealisticPrimediaData: Story = AllVariants;
export const KeyboardNavigation: Story = AllVariants;
export const A11yTableFallback: Story = AllVariants;
