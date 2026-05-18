import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	BigLoader,
	CardLoadingState,
	ContentLoader,
	LoadingState,
	PageContentLoader,
	ReportChartLoadingBlock,
	ReportMetricRibbonLoading,
	ReportPageLoadingState,
	ReportSectionLoadingState,
	SectionHeader,
	Skeleton,
	useTheme,
} from '../index';

type LoaderStoryMotion = 'none' | 'pulse' | 'shimmer' | 'wave';

interface LoaderStoryArgs {
	motion: LoaderStoryMotion;
}

const meta = {
	title: 'Components/Loading States',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		motion: {
			control: 'select',
			options: ['shimmer', 'pulse', 'wave', 'none'],
		},
	},
} satisfies Meta<LoaderStoryArgs>;

export default meta;

type Story = StoryObj<LoaderStoryArgs>;

export const AppLoadingSystem: Story = {
	args: {
		motion: 'shimmer',
	},
	parameters: {
		docs: {
			source: {
				code: `import {
  BigLoader,
  CardLoadingState,
  ContentLoader,
  PageContentLoader,
} from '@pikaboo/t2-design-system';

<BigLoader label="Building report" description="Preparing campaign intelligence" />
<PageContentLoader title="Campaigns" motion="shimmer" />
<CardLoadingState media="thumbnail" motion="wave" rows={4} />
<ContentLoader media actions={2} lines={3} />`,
			},
		},
	},
	render: ({ motion }) => {
		const { theme } = useTheme();

		return (
			<main className="pds-story-frame">
				<SectionHeader
					description="Theme-aware loaders for app shells, content panels, cards, and inline waits."
					eyebrow={theme.copy.productName}
					title="Application Loading States"
				/>
				<BigLoader
					description="Preparing campaign intelligence, placements, and report blocks."
					label="Building workspace"
					motion={motion === 'wave' || motion === 'shimmer' ? 'orbit' : motion}
				/>
				<div className="pds-story-grid pds-story-grid--two">
					<ContentLoader actions={2} lines={4} media motion={motion} />
					<CardLoadingState media="thumbnail" motion={motion} rows={4} />
				</div>
				<div className="pds-story-grid pds-story-grid--four">
					<LoadingState label="Calculating reach" motion="orbit" />
					<Skeleton height="2.5rem" motion={motion} />
					<Skeleton height="2.5rem" motion="pulse" />
					<Skeleton height="2.5rem" motion="wave" />
				</div>
				<PageContentLoader
					cardCount={6}
					motion={motion}
					statCount={4}
					title="Campaign list"
					toolbar
				/>
			</main>
		);
	},
};

export const ReportLoadingSystem: Story = {
	args: {
		motion: 'shimmer',
	},
	parameters: {
		docs: {
			source: {
				code: `import {
  ReportChartLoadingBlock,
  ReportMetricRibbonLoading,
  ReportPageLoadingState,
  ReportSectionLoadingState,
} from '@pikaboo/t2-design-system';

<ReportPageLoadingState
  chartCount={6}
  metricCount={7}
  motion="wave"
  sectionCount={2}
  title="Enhanced Ads Reporting"
/>`,
			},
		},
	},
	render: ({ motion }) => {
		const { theme } = useTheme();

		return (
			<main className="pds-story-frame">
				<SectionHeader
					description="Report-ready loading components for KPI ribbons, chart cards, evidence sections, and full report pages."
					eyebrow={theme.copy.reportTitle}
					title="Report Loading States"
				/>
				<ReportMetricRibbonLoading count={7} motion={motion} />
				<div className="pds-story-grid">
					<ReportChartLoadingBlock
						motion={motion}
						title="Reach"
						variant="bars"
					/>
					<ReportChartLoadingBlock motion={motion} title="VAC" variant="line" />
					<ReportChartLoadingBlock
						motion={motion}
						title="Performance by site"
						variant="ranked"
					/>
				</div>
				<ReportSectionLoadingState
					chartCount={3}
					motion={motion}
					title="Evidence And Placements"
				/>
				<ReportPageLoadingState
					chartCount={6}
					metricCount={7}
					motion={motion}
					sectionCount={2}
					title="Enhanced Ads Reporting"
				/>
			</main>
		);
	},
};
