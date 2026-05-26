import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect } from 'storybook/test';
import {
	Badge,
	Button,
	ReportActionCard,
	ReportAreaChart,
	ReportBarList,
	ReportBlock,
	ReportBlockGrid,
	ReportChartLoadingBlock,
	ReportComparisonBlock,
	ReportDonut,
	ReportEmptyPanel,
	ReportEntityCard,
	ReportEvidenceList,
	ReportExportHeader,
	ReportMetricBlock,
	ReportMetricRibbon,
	ReportMetricRibbonLoading,
	ReportMetricTile,
	ReportPlacementTable,
	ReportRankedListBlock,
	ReportSection,
	ReportShell,
	ReportSourceFooter,
	ReportToggleGroup,
	ReportTourCallout,
	ReportTrendChart,
	useTheme,
} from '../index';

const meta = {
	title: 'Reports/Interactive Blocks',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const dailyReachItems = [
	{ label: '1 May', value: 48_200 },
	{ label: '2 May', value: 51_400 },
	{ label: '3 May', value: 44_800 },
	{ label: '4 May', value: 62_100 },
	{ label: '5 May', value: 71_300 },
	{ label: '6 May', value: 80_500 },
	{ label: '7 May', value: 73_900 },
	{ label: '8 May', value: 55_200 },
	{ label: '9 May', value: 58_700 },
	{ label: '10 May', value: 64_400 },
	{ label: '11 May', value: 69_800 },
	{ label: '12 May', value: 78_600 },
	{ label: '13 May', value: 85_100 },
	{ label: '14 May', value: 91_300 },
];

const actualReach = [
	120_000, 180_000, 260_000, 360_000, 500_000, 690_000, 890_000, 1_120_000,
	1_380_000, 1_620_000, 1_760_000, 1_880_000,
];

const forecastReach = [
	132_000, 210_000, 310_000, 440_000, 620_000, 830_000, 1_090_000, 1_390_000,
	1_730_000, 2_050_000, 2_360_000, 2_640_000,
];

const formatShort = (value: number) =>
	new Intl.NumberFormat('en', {
		compactDisplay: 'short',
		maximumFractionDigits: 1,
		notation: 'compact',
	}).format(value);

const placementRows = [
	{
		code: 'SPEC/607/1',
		format: 'Spectacular',
		id: 'spec-607',
		name: 'Pretoria Central Gantry',
		pacing: 1.18,
		region: 'Gauteng',
		status: <Badge tone="success">Over</Badge>,
		value: '254k',
	},
	{
		code: 'RTV029',
		format: 'Digital freeway',
		id: 'rtv-029',
		name: 'Cape Town Upper Deck',
		pacing: 0.92,
		region: 'Western Cape',
		status: <Badge tone="warning">Watch</Badge>,
		value: '193k',
	},
	{
		code: 'B96/0045/1',
		format: '96 Sheet',
		id: 'b96-0045',
		name: 'Umlazi Gateway Corridor',
		pacing: 0.68,
		region: 'KwaZulu-Natal',
		status: <Badge tone="danger">Under</Badge>,
		value: '120k',
	},
] as const;

function ReportWorkbench() {
	const { theme } = useTheme();
	const [reportType, setReportType] = useState('insights');
	const [selectedMetric, setSelectedMetric] = useState('reach');
	const [loadingMode, setLoadingMode] = useState('loaded');
	const [selectedEntity, setSelectedEntity] = useState('mazda');
	const [selectedPlacementId, setSelectedPlacementId] = useState('spec-607');
	const [appliedRecommendation, setAppliedRecommendation] = useState(false);
	const [tourComplete, setTourComplete] = useState(false);

	const selectedPlacement = useMemo(
		() => placementRows.find((row) => row.id === selectedPlacementId),
		[selectedPlacementId],
	);

	const loading = loadingMode === 'loading';

	return (
		<ReportShell
			footer={
				<ReportSourceFooter
					items={[
						{ label: 'Refresh cadence', value: 'Every 4h' },
						{ label: 'Confidence', value: 'High' },
						{ label: 'Sources', value: 'Road 2.0, mobility, media plan' },
					]}
					left={`${theme.copy.productName} report components`}
					right="Reusable React package surface"
				/>
			}
			header={
				<ReportExportHeader
					actions={
						<>
							<ReportToggleGroup
								aria-label="Loading state"
								onValueChange={setLoadingMode}
								options={[
									{ label: 'Loaded', value: 'loaded' },
									{ label: 'Loading', value: 'loading' },
								]}
								value={loadingMode}
							/>
							<Button size="sm" variant="outline">
								Export
							</Button>
						</>
					}
					eyebrow="Report component workbench"
					metadata={[
						{ label: 'Tenant', value: theme.copy.tenantName },
						{ label: 'Product', value: theme.copy.productName },
						{ label: 'Selected metric', value: selectedMetric },
					]}
					productName={theme.copy.productName}
					subtitle="Every square below is an exported React component with props, variants, and callbacks. Stories only wire them together."
					title="Interactive Report Blocks"
				/>
			}
		>
			<ReportSection
				description="Switch report modes and see the blocks respond without changing components."
				eyebrow="Controls"
				title="Report Type And Loading State"
			>
				<ReportToggleGroup
					label="Report type"
					onValueChange={setReportType}
					options={[
						{
							description: 'Campaign performance and site outcomes',
							label: 'Insights',
							value: 'insights',
						},
						{
							description: 'Renewal candidates and upsell logic',
							label: 'Renewals',
							value: 'renewals',
						},
						{
							description: 'Two-entity decision support',
							label: 'A/B compare',
							value: 'compare',
						},
					]}
					value={reportType}
				/>
			</ReportSection>

			<ReportSection
				description="A reusable metric ribbon, including the guided-tour highlight shape from the dashboard."
				eyebrow="Metrics"
				title="KPI Ribbon"
			>
				{loading ? (
					<ReportMetricRibbonLoading count={6} />
				) : (
					<ReportMetricRibbon highlighted tourAnchor="bottom">
						<ReportMetricTile
							accent="violet"
							icon="👥"
							id="population"
							label="Total population"
							onInfoClick={() => setSelectedMetric('population-info')}
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'population'}
							value="38.8M"
						/>
						<ReportMetricTile
							accent="violet"
							icon="👥"
							id="reach"
							label="Reach"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'reach'}
							value="3.3M"
						/>
						<ReportMetricTile
							accent="magenta"
							icon="%"
							id="reach-rate"
							label="Reach %"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'reach-rate'}
							value="8.43%"
						/>
						<ReportMetricTile
							accent="cyan"
							icon="◎"
							id="vac"
							label="VAC"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'vac'}
							value="48.1M"
						/>
						<ReportMetricTile
							accent="green"
							icon="⌁"
							id="frequency"
							label="Avg. frequency"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'frequency'}
							value="14.70"
						/>
						<ReportMetricTile
							accent="orange"
							icon="▣"
							id="cpt"
							label="CPT"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'cpt'}
							value="R53.65"
						/>
						<ReportMetricTile
							accent="red"
							icon="▥"
							id="grp"
							label="GRP"
							onSelect={(id) => id && setSelectedMetric(id)}
							selected={selectedMetric === 'grp'}
							value="123.94"
						/>
					</ReportMetricRibbon>
				)}
			</ReportSection>

			{tourComplete ? null : (
				<ReportSection eyebrow="Guidance" title="Tour Callout">
					<ReportTourCallout
						onComplete={() => setTourComplete(true)}
						onSkip={() => setTourComplete(true)}
						steps={[
							{
								body: 'Total population, reach, frequency, CPT, and GRP summarize how the recommended set performs against your goals.',
								id: 'metrics',
								title: 'Performance metrics at a glance',
							},
							{
								body: 'Use the ranking blocks to identify which sites are driving each metric and where the plan needs attention.',
								id: 'rankings',
								title: 'Drill into evidence',
							},
						]}
					/>
				</ReportSection>
			)}

			<ReportSection
				description="Loading states preserve chart structure instead of showing generic blocks."
				eyebrow="Charts"
				title="Charts And Ranked Lists"
			>
				<ReportBlockGrid columns={3}>
					{loading ? (
						<>
							<ReportChartLoadingBlock title="Reach" variant="bars" />
							<ReportChartLoadingBlock title="VAC" variant="line" />
							<ReportChartLoadingBlock
								title="Average Frequency"
								variant="bars"
							/>
						</>
					) : (
						<>
							<ReportTrendChart
								actual={actualReach}
								forecast={forecastReach}
								formatValue={formatShort}
								label="Reach"
							/>
							<ReportBarList
								formatValue={formatShort}
								items={[
									{
										label: 'Gauteng',
										meta: '8 sites',
										tone: 'good',
										value: 1_800_000,
									},
									{ label: 'Western Cape', meta: '5 sites', value: 980_000 },
									{ label: 'KwaZulu-Natal', meta: '3 sites', value: 720_000 },
								]}
								title="Regional Reach"
							/>
							<ReportDonut
								centerLabel="18"
								segments={[
									{ label: 'Digital LED', value: 54 },
									{ label: 'Classic', value: 24 },
									{ label: 'Street furniture', value: 14 },
									{ label: 'Spectacular', value: 8 },
								]}
								title="Format Mix"
							/>
						</>
					)}
				</ReportBlockGrid>
			</ReportSection>

			<ReportSection
				description="Selectable ranked rows for site-level drilldowns."
				eyebrow="Performance by site"
				title="Ranked Site Components"
			>
				<ReportBlockGrid columns={4}>
					{loading ? (
						<>
							<ReportChartLoadingBlock title="Reach" variant="ranked" />
							<ReportChartLoadingBlock title="VAC" variant="ranked" />
							<ReportChartLoadingBlock title="Reach %" variant="ranked" />
							<ReportChartLoadingBlock title="Avg Frequency" variant="ranked" />
						</>
					) : (
						<>
							<ReportRankedListBlock
								items={[
									{
										id: 'spec-607',
										label: 'SPEC/607/1',
										value: 254_170,
										valueLabel: '254,170.80',
									},
									{
										id: 'spec-112',
										label: 'SPEC/112/1',
										value: 206_533,
										valueLabel: '206,533.68',
									},
									{
										id: 'rtv-029',
										label: 'RTV029 - Cape Town Upper Deck',
										tone: 'risk',
										value: 193_045,
										valueLabel: '193,045.75',
									},
								]}
								onItemSelect={(item) => setSelectedPlacementId(item.id)}
								selectedItemId={selectedPlacementId}
								title="Reach"
							/>
							<ReportRankedListBlock
								items={[
									{
										id: 'rtv-029',
										label: 'RTV029 - Cape Town Upper Deck',
										tone: 'risk',
										value: 1_418_560,
										valueLabel: '1,418,560.00',
									},
									{
										id: 'spec-607',
										label: 'SPEC/607/1',
										value: 1_408_017,
										valueLabel: '1,408,017.93',
									},
									{
										id: 'b96-0045',
										label: 'B96/0045/1',
										value: 1_069_954,
										valueLabel: '1,069,954.79',
									},
								]}
								onItemSelect={(item) => setSelectedPlacementId(item.id)}
								selectedItemId={selectedPlacementId}
								title="VAC"
							/>
							<ReportRankedListBlock
								items={[
									{
										id: 'rtv-019',
										label: 'RTV019 - Kimberley Rank',
										value: 18.47,
									},
									{
										id: 'kimberley',
										label: 'Kimberley Rank Branding',
										value: 6.48,
									},
									{ id: 'b144', label: 'B144/164/2', value: 4.99 },
								]}
								title="Reach %"
							/>
							<ReportRankedListBlock
								items={[
									{
										id: 'b48-0065',
										label: 'B48/0065/1',
										value: 576_326,
										valueLabel: '576,326.35',
									},
									{
										id: 'b48-0553',
										label: 'B48/0553/1',
										value: 238_197,
										valueLabel: '238,197.87',
									},
									{
										id: 'b48-0743',
										label: 'B48/0743/1',
										value: 176_641,
										valueLabel: '176,641.58',
									},
								]}
								title="Avg Frequency"
							/>
						</>
					)}
				</ReportBlockGrid>
			</ReportSection>

			<ReportSection
				description="Renewal screenshots map to selectable entity cards plus an empty/detail panel."
				eyebrow="Renewals"
				title="Entity Selection Pattern"
			>
				<ReportBlockGrid columns={2}>
					<div className="pds-story-stack">
						{[
							{
								id: 'mazda',
								title: 'Mazda',
								status: 'Expired',
								score: '100% likely to renew',
							},
							{
								id: 'mazda-01b',
								title: 'Mazda 01b',
								status: 'Expired',
								score: '100% likely to renew',
							},
							{
								id: 'dedt-kzn',
								title: 'Dedt Kzn',
								status: '2 days left',
								score: '65% likely to renew',
							},
						].map((candidate) => (
							<ReportEntityCard
								description="For Mazda Motor Corporation · MAZ001"
								id={candidate.id}
								key={candidate.id}
								meta={[
									{ label: 'Flight', value: 'May 4, 2026 - Jul 19, 2026' },
									{ label: 'Sites', value: '4 · 48 orders' },
									{ label: 'Media', value: 'Digital Urban Network' },
								]}
								onSelect={setSelectedEntity}
								score={candidate.score}
								selected={selectedEntity === candidate.id}
								status={candidate.status}
								title={candidate.title}
							/>
						))}
					</div>
					{selectedEntity ? (
						<ReportBlock title="Renewal detail">
							<ReportMetricBlock
								delta="+14%"
								label="Recommended renewal value"
								plan="Based on currently booked sites"
								tone="good"
								value="R4.02M"
							/>
							<ReportActionCard
								actionLabel={
									appliedRecommendation ? 'Applied' : 'Apply recommendation'
								}
								body="Keep the booked sites, add a two-week digital upsell, and prioritise premium inventory where current availability is strong."
								impact="+R612k projected upsell"
								onAction={() => setAppliedRecommendation(true)}
								status={appliedRecommendation ? 'Applied' : 'Suggested'}
								title="Renewal recommendation"
								tone="good"
							/>
						</ReportBlock>
					) : (
						<ReportEmptyPanel
							message="Recommendations start with the sites already in the chosen campaign."
							title="Pick a campaign to renew"
						/>
					)}
				</ReportBlockGrid>
			</ReportSection>

			<ReportSection
				description="A/B components compare two inputs and expose the selected winner."
				eyebrow="Comparison"
				title="A/B Entity Comparison"
			>
				<ReportComparisonBlock
					left={{
						description: 'Premium CBD and airport coverage',
						id: 'scenario-a',
						label: 'Scenario A',
						meta: 'Higher reach',
					}}
					metrics={[
						{ label: 'Reach', leftValue: 84, rightValue: 72, unit: '%' },
						{
							label: 'CPT',
							leftValue: 46,
							rightValue: 52,
							unit: ' index',
							winner: 'left',
						},
						{ label: 'Frequency', leftValue: 61, rightValue: 79, unit: '%' },
					]}
					right={{
						description: 'Retail-heavy renewal route',
						id: 'scenario-b',
						label: 'Scenario B',
						meta: 'Higher frequency',
					}}
				/>
			</ReportSection>

			<ReportSection
				description="Selectable placement table with row callbacks for drilldowns."
				eyebrow="Placements"
				title="Placement Performance Table"
			>
				<ReportPlacementTable
					onRowSelect={(row) => setSelectedPlacementId(row.id ?? '')}
					rows={placementRows}
					selectedRowId={selectedPlacementId}
				/>
				<ReportEvidenceList
					items={[
						{
							detail: selectedPlacement
								? `${selectedPlacement.name} is the active drilldown row.`
								: 'Select a row to inspect placement evidence.',
							id: 'selected-site',
							source: 'Placement table selection',
							title: 'Selected site evidence follows row interaction',
							tone: 'info',
						},
						{
							detail:
								'Under-pacing rows should drive recommendations, not hide inside static tables.',
							id: 'underpacing',
							source: 'Site-level pacing model',
							title: 'Pacing can open narrative evidence',
							tone: 'watch',
						},
					]}
					title="Evidence"
				/>
			</ReportSection>
		</ReportShell>
	);
}

export const Workbench: Story = {
	render: () => <ReportWorkbench />,
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('heading', { name: /interactive report blocks/i }),
		).toBeVisible();
	},
};

export const AreaChart: Story = {
	render: () => (
		<div style={{ padding: '2rem', width: 480 }}>
			<ReportAreaChart
				formatValue={formatShort}
				items={dailyReachItems}
				title="Daily Reach"
			/>
		</div>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole('heading', { name: /daily reach/i }),
		).toBeVisible();
	},
};
