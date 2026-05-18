import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	Alert,
	Badge,
	BigLoader,
	Button,
	Calendar,
	CampaignCardGrid,
	CampaignChoiceChips,
	CampaignListCard,
	CampaignRangeControl,
	CampaignScheduleDialog,
	CampaignStatCard,
	Card,
	CardContent,
	CardHeader,
	CardLoadingState,
	CardTitle,
	DateRangePicker,
	Field,
	FloatingButton,
	Input,
	PageContentLoader,
	RadioCardGroup,
	ReportBarList,
	ReportChartLoadingBlock,
	ReportComparisonBlock,
	ReportDonut,
	ReportEvidencePanel,
	ReportKpiStrip,
	ReportKpiTile,
	ReportPageLoadingState,
	ReportPlacementTable,
	ReportRecommendationCard,
	ReportTrendChart,
	SearchableSelector,
	SectionHeader,
	SegmentedControl,
	SelectorGroup,
	SelectorOption,
	SiteInventoryPanel,
	Skeleton,
	Slider,
	Switch,
} from '../index';

interface PlaygroundArgs {
	accent: 'blue' | 'cyan' | 'green' | 'magenta' | 'orange' | 'red' | 'violet';
	badgeTone: 'brand' | 'danger' | 'info' | 'neutral' | 'success' | 'warning';
	buttonSize: 'lg' | 'md' | 'sm';
	buttonVariant: 'danger' | 'ghost' | 'outline' | 'primary' | 'secondary';
	cardCount: number;
	chartVariant: 'bars' | 'line' | 'ranked';
	floatingCorner: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
	loaderMotion: 'none' | 'pulse' | 'shimmer' | 'wave';
	progress: number;
	reportTone: 'good' | 'info' | 'neutral' | 'risk' | 'watch';
	showDialog: boolean;
}

const meta = {
	title: 'Documentation/Interactive Playgrounds',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Prop playgrounds for the major design-system families. Use these alongside Documentation/Component Usage for copyable import snippets.',
			},
		},
	},
	argTypes: {
		accent: {
			control: 'select',
			options: ['blue', 'violet', 'magenta', 'cyan', 'green', 'orange', 'red'],
		},
		badgeTone: {
			control: 'select',
			options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
		},
		buttonSize: {
			control: 'inline-radio',
			options: ['sm', 'md', 'lg'],
		},
		buttonVariant: {
			control: 'select',
			options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
		},
		cardCount: {
			control: { max: 12, min: 1, step: 1, type: 'range' },
		},
		chartVariant: {
			control: 'inline-radio',
			options: ['bars', 'line', 'ranked'],
		},
		floatingCorner: {
			control: 'select',
			options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
		},
		loaderMotion: {
			control: 'select',
			options: ['shimmer', 'pulse', 'wave', 'none'],
		},
		progress: {
			control: { max: 100, min: 0, step: 1, type: 'range' },
		},
		reportTone: {
			control: 'select',
			options: ['neutral', 'good', 'watch', 'risk', 'info'],
		},
		showDialog: {
			control: 'boolean',
		},
	},
} satisfies Meta<PlaygroundArgs>;

export default meta;

type Story = StoryObj<PlaygroundArgs>;

const baseArgs = {
	accent: 'cyan',
	badgeTone: 'brand',
	buttonSize: 'md',
	buttonVariant: 'primary',
	cardCount: 6,
	chartVariant: 'bars',
	floatingCorner: 'bottom-right',
	loaderMotion: 'shimmer',
	progress: 46,
	reportTone: 'good',
	showDialog: true,
} satisfies PlaygroundArgs;

const toAlertTone = (tone: PlaygroundArgs['badgeTone']) =>
	tone === 'brand' || tone === 'neutral' ? 'info' : tone;

const toBigLoaderMotion = (motion: PlaygroundArgs['loaderMotion']) =>
	motion === 'pulse' || motion === 'none' ? motion : 'orbit';

export const ActionsFeedbackAndLoaders: Story = {
	args: baseArgs,
	parameters: {
		docs: {
			source: {
				code: `import {
  BigLoader,
  Button,
  CardLoadingState,
  FloatingButton,
  PageContentLoader,
} from '@pikaboo/t2-design-system';

<Button variant="primary" size="md">Create campaign</Button>
<FloatingButton label="Contact Help" icon="help" />
<PageContentLoader motion="shimmer" cardCount={6} />
<CardLoadingState media="thumbnail" rows={4} />`,
			},
		},
	},
	render: (args) => (
		<main className="pds-story-frame">
			<SectionHeader
				description="Buttons, badges, alert tones, floating action behaviour, and animated loaders share the same theme tokens."
				eyebrow="Playground"
				title="Actions, Feedback, and Loaders"
			/>
			<div className="pds-story-grid pds-story-grid--two">
				<Card>
					<CardHeader>
						<CardTitle>Actions</CardTitle>
					</CardHeader>
					<CardContent className="pds-story-stack">
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
							<Button size={args.buttonSize} variant={args.buttonVariant}>
								Create campaign
							</Button>
							<Button
								rightIcon="arrow-right"
								size={args.buttonSize}
								variant="outline"
							>
								Export report
							</Button>
							<Badge tone={args.badgeTone}>Interactive tone</Badge>
						</div>
						<div className="pds-floating-demo-stage">
							<FloatingButton
								collapseAfterMs={2200}
								defaultCorner={args.floatingCorner}
								icon="help"
								label="Contact Help"
								position="absolute"
								tooltip="Drag to snap corners"
							/>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Feedback</CardTitle>
					</CardHeader>
					<CardContent className="pds-story-stack">
						<Alert title="Budget variance" tone={toAlertTone(args.badgeTone)}>
							The recommendation is ready to review.
						</Alert>
						<BigLoader
							description="Preparing campaign intelligence"
							label="Building report"
							motion={toBigLoaderMotion(args.loaderMotion)}
						/>
						<Skeleton height={44} motion={args.loaderMotion} />
						<CardLoadingState media="thumbnail" motion={args.loaderMotion} />
					</CardContent>
				</Card>
			</div>
			<PageContentLoader
				cardCount={args.cardCount}
				motion={args.loaderMotion}
				statCount={4}
				title="Page content loader"
				toolbar
			/>
		</main>
	),
};

export const FormsSelectorsAndCalendar: Story = {
	args: baseArgs,
	parameters: {
		docs: {
			source: {
				code: `import {
  DateRangePicker,
  RadioCardGroup,
  SearchableSelector,
  Slider,
} from '@pikaboo/t2-design-system';

<SearchableSelector mode="multiple" options={markets} selectedValues={selectedMarkets} />
<DateRangePicker minRangeDays={14} />
<Slider label="Budget" value={budget} onValueChange={setBudget} />`,
			},
		},
	},
	render: (args) => (
		<main className="pds-story-frame">
			<SectionHeader
				description="Form controls are stateful, keyboard-friendly, and visible under both tenant themes."
				eyebrow="Playground"
				title="Forms, Selectors, and Calendar"
			/>
			<div className="pds-story-grid pds-story-grid--two">
				<Card>
					<CardHeader>
						<CardTitle>Planning Form</CardTitle>
					</CardHeader>
					<CardContent className="pds-story-stack">
						<Field
							hint="This updates reports and exported headers"
							label="Campaign name"
						>
							<Input defaultValue="National Reach Drive" />
						</Field>
						<SegmentedControl
							options={[
								{ label: 'Guided', value: 'guided' },
								{ label: 'Manual', value: 'manual' },
								{ label: 'Saved', value: 'saved' },
							]}
							value="guided"
						/>
						<RadioCardGroup
							label="Campaign objective"
							options={[
								{
									description: 'Maximise total audience delivery.',
									label: 'Awareness',
									value: 'awareness',
								},
								{
									description: 'Optimise around visits and intent.',
									label: 'Conversion',
									value: 'conversion',
								},
							]}
							value="awareness"
						/>
						<Slider
							formatValue={(value) => `R${value.toLocaleString('en-ZA')}`}
							label="Budget"
							max={2_500_000}
							min={0}
							step={50_000}
							value={args.progress * 25_000}
						/>
						<Switch defaultChecked label="Use premium audience model" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Selectors and Dates</CardTitle>
					</CardHeader>
					<CardContent className="pds-story-stack">
						<SearchableSelector
							mode="multiple"
							options={[
								{ label: 'Gauteng', meta: '12', value: 'gauteng' },
								{ label: 'Western Cape', meta: '8', value: 'western-cape' },
								{ label: 'KwaZulu-Natal', meta: '5', value: 'kzn' },
							]}
							selectedValues={['gauteng', 'western-cape']}
						/>
						<SelectorGroup columns={1}>
							<SelectorOption
								description="Use for rich option cards."
								selected
								status="Suggested"
								statusTone="success"
								title="Selector option"
							/>
							<SelectorOption
								description="Use as a lower-emphasis alternative."
								title="Secondary option"
							/>
						</SelectorGroup>
						<Calendar
							month={new Date(2026, 6, 1)}
							selectedDate={new Date(2026, 6, 9)}
						/>
						<DateRangePicker
							defaultRange={{
								from: new Date(2026, 6, 9),
								to: new Date(2026, 6, 22),
							}}
							label="Quick"
							minRangeDays={14}
						/>
					</CardContent>
				</Card>
			</div>
		</main>
	),
};

export const CampaignWorkflowComponents: Story = {
	args: baseArgs,
	parameters: {
		docs: {
			source: {
				code: `import {
  CampaignListCard,
  CampaignScheduleDialog,
  SiteInventoryPanel,
} from '@pikaboo/t2-design-system';

<CampaignListCard progress={46} status="Planning" />
<CampaignScheduleDialog numberOfMonths={2} />
<SiteInventoryPanel items={sites} />`,
			},
		},
	},
	render: (args) => (
		<main className="pds-story-frame">
			<SectionHeader
				description="Campaign primitives compose into list views, planning controls, schedule dialogs, and site-picking workflows."
				eyebrow="Playground"
				title="Campaign Workflow Components"
			/>
			<div className="pds-story-grid">
				<CampaignStatCard
					description="Visible campaigns"
					label="Total"
					selected
					tone="brand"
					value="162"
				/>
				<CampaignChoiceChips
					options={[
						{ label: 'All', value: 'all' },
						{ label: 'My campaigns', value: 'mine' },
						{ label: 'Shared', value: 'shared' },
					]}
					selectedValues={['mine']}
				/>
				<CampaignRangeControl
					formatValue={(value) => `${value}%`}
					label="Completion"
					max={100}
					min={0}
					value={args.progress}
				/>
			</div>
			<CampaignCardGrid columns={3}>
				<CampaignListCard
					canEditLabel="Can edit"
					client="Netcare Ltd"
					dateRange="26 Oct - 15 Nov 2026"
					duration="20 days"
					progress={args.progress}
					status="Planning"
					statusTone={args.badgeTone}
					title="National Reach Drive"
				/>
				<CampaignListCard
					canEditLabel="Can edit"
					client="Mondi Group"
					dateRange="6 Sep - 25 Dec 2026"
					duration="110 days"
					progress={Math.max(8, 100 - args.progress)}
					status="Planning"
					statusTone="neutral"
					title="Brand Presence Burst"
				/>
			</CampaignCardGrid>
			<div className="pds-story-grid pds-story-grid--two">
				{args.showDialog ? (
					<CampaignScheduleDialog
						defaultRange={{
							from: new Date(2026, 6, 9),
							to: new Date(2026, 6, 22),
						}}
						numberOfMonths={2}
					/>
				) : null}
				<SiteInventoryPanel
					defaultSelectedIds={['ac003']}
					items={[
						{
							dimensions: '1575mm x 1020mm',
							format: 'Illum ID Lite Sign',
							id: 'ac003',
							location: 'Acornhoek, Limpopo',
							price: 'R1,500',
							recommended: true,
							title: 'AC003 - Illum ID Lite Sign - Acornhoek',
						},
						{
							dimensions: '1575mm x 1020mm',
							format: 'Illum ID Lite Sign',
							id: 'ac006',
							location: 'Acornhoek, Limpopo',
							price: 'R1,500',
							recommended: true,
							title: 'AC006 - Illum ID Lite Sign - Acornhoek',
						},
						{
							dimensions: '12m x 3m',
							format: 'Spectacular',
							id: 'ad014',
							location: 'University corridor',
							price: 'R101,000.69',
							title: 'AD014 - Victory Plaza - University',
						},
					]}
				/>
			</div>
		</main>
	),
};

export const ReportComponents: Story = {
	args: baseArgs,
	parameters: {
		docs: {
			source: {
				code: `import {
  ReportComparisonBlock,
  ReportKpiStrip,
  ReportPlacementTable,
  ReportTrendChart,
} from '@pikaboo/t2-design-system/report';

<ReportKpiStrip columns={4}>...</ReportKpiStrip>
<ReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
<ReportPlacementTable rows={rows} />`,
			},
		},
	},
	render: (args) => (
		<main className="pds-story-frame">
			<SectionHeader
				description="Report blocks are exported from the root and the report subpath, with raw JSX mirrors for static rendering where available."
				eyebrow="Playground"
				title="Report Components"
			/>
			<ReportKpiStrip columns={4}>
				<ReportKpiTile
					delta="+12%"
					label="Reach"
					sparkline={[12, 18, 21, 28, 34, 42]}
					tone={args.reportTone}
					value="4.2M"
				/>
				<ReportKpiTile
					delta="+3.4%"
					label="VAC"
					sparkline={[8, 15, 14, 19, 24, 32]}
					tone="info"
					value="68.9M"
				/>
				<ReportKpiTile label="CPT" tone="watch" value="R55.48" />
				<ReportKpiTile label="GRP" tone="good" value="161.34" />
			</ReportKpiStrip>
			<div className="pds-story-grid">
				<ReportTrendChart
					actual={[20, 28, 35, 42, 48, 61]}
					forecast={[30, 38, 47, 58, 66, 72]}
					formatValue={(value) => `${value}k`}
					label="Reach trend"
				/>
				<ReportBarList
					items={[
						{ label: 'SPEC/607/1', tone: 'good', value: 254_170 },
						{
							label: 'RTV029 - Cape Town Upper Deck',
							tone: 'watch',
							value: 193_045,
						},
						{ label: 'SPEC/112/1', tone: 'info', value: 206_533 },
					]}
					title="Performance by site"
				/>
				<ReportDonut
					centerLabel="50"
					segments={[
						{ label: 'Female', value: 51 },
						{ label: 'Male', value: 49 },
					]}
					title="Gender"
				/>
			</div>
			<div className="pds-story-grid pds-story-grid--two">
				<ReportComparisonBlock
					left={{
						description: 'Premium CBD and airport coverage',
						id: 'scenario-a',
						label: 'Scenario A',
						meta: 'Higher reach',
					}}
					metrics={[
						{
							label: 'Reach',
							leftValue: 84,
							rightValue: 72,
							unit: '%',
							winner: 'left',
						},
						{
							label: 'CPT',
							leftValue: 46,
							rightValue: 52,
							unit: ' index',
							winner: 'left',
						},
						{
							label: 'Frequency',
							leftValue: 61,
							rightValue: 79,
							unit: '%',
							winner: 'right',
						},
					]}
					right={{
						description: 'Retail-heavy renewal route',
						id: 'scenario-b',
						label: 'Scenario B',
						meta: 'Higher frequency',
					}}
				/>
				<ReportEvidencePanel
					confidence="High confidence"
					items={[
						'CBD placements create most of the incremental reach.',
						'Retail placements improve frequency but raise CPT.',
					]}
					title="Evidence"
				/>
			</div>
			<ReportPlacementTable
				rows={[
					{
						code: 'SPEC/607/1',
						format: 'Spectacular',
						id: 'spec-607',
						name: 'Pretoria Central Gantry',
						pacing: 1.18,
						region: 'Gauteng',
						value: '254k',
					},
					{
						code: 'RTV029',
						format: 'Digital freeway',
						id: 'rtv-029',
						name: 'Cape Town Upper Deck',
						pacing: 0.92,
						region: 'Western Cape',
						value: '193k',
					},
				]}
			/>
			<div className="pds-story-grid pds-story-grid--two">
				<ReportChartLoadingBlock
					motion={args.loaderMotion}
					title="Loading chart block"
					variant={args.chartVariant}
				/>
				<ReportRecommendationCard
					impact="High impact"
					recommendation="Move 10% of budget into the corridor producing stronger reach at lower CPT."
					title="Recommendation"
				/>
			</div>
			<ReportPageLoadingState
				chartCount={args.cardCount}
				metricCount={4}
				motion={args.loaderMotion}
				title="Full report loading state"
			/>
		</main>
	),
};
