import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	RawAuthAccessScreen,
	renderRawJsxToHtml as renderAuthRawJsxToHtml,
} from '../auth-jsx';
import { SectionHeader, ThemeSwitcher } from '../index';
import {
	RawReportChartLoadingBlock,
	RawReportComparisonBlock,
	RawReportMetricRibbon,
	RawReportMetricTile,
	RawReportPageLoadingState,
	RawReportPlacementTable,
	renderRawJsxToHtml as renderReportRawJsxToHtml,
} from '../report-jsx';

interface RawJsxStoryArgs {
	accent: 'blue' | 'cyan' | 'green' | 'magenta' | 'orange' | 'red' | 'violet';
	loadingMotion: 'none' | 'pulse' | 'shimmer' | 'wave';
	productName: string;
	showLoading: boolean;
}

const meta = {
	title: 'Documentation/Plain JSX Exports',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Rendered examples from the raw JSX entrypoints. These do not use React components underneath; Storybook is only displaying the generated HTML.',
			},
		},
	},
	argTypes: {
		accent: {
			control: 'select',
			options: ['blue', 'violet', 'magenta', 'cyan', 'green', 'orange', 'red'],
		},
		loadingMotion: {
			control: 'select',
			options: ['shimmer', 'pulse', 'wave', 'none'],
		},
		productName: {
			control: 'text',
		},
		showLoading: {
			control: 'boolean',
		},
	},
} satisfies Meta<RawJsxStoryArgs>;

export default meta;

type Story = StoryObj<RawJsxStoryArgs>;

function RawHtmlPreview({ html }: { html: string }) {
	return (
		<div
			className="pds-raw-html-preview"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

export const ReportPlainJsx: Story = {
	args: {
		accent: 'cyan',
		loadingMotion: 'wave',
		productName: 'Cortexx',
		showLoading: true,
	},
	parameters: {
		docs: {
			source: {
				code: `/** @jsxImportSource @pikaboo/web-design-system/report-jsx */
import {
  RawReportComparisonBlock,
  RawReportMetricRibbon,
  RawReportMetricTile,
  renderRawJsxToHtml,
} from '@pikaboo/web-design-system/report-jsx';

const html = renderRawJsxToHtml(
  <RawReportMetricRibbon highlighted>
    <RawReportMetricTile accent="cyan" label="VAC" value="48.1M" />
    <RawReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
  </RawReportMetricRibbon>,
);`,
			},
		},
	},
	render: ({ accent, loadingMotion, showLoading }) => {
		const reportHtml = renderReportRawJsxToHtml([
			RawReportMetricRibbon({
				children: [
					RawReportMetricTile({
						accent,
						icon: '◎',
						label: 'VAC',
						sublabel: 'Projected delivery',
						value: '48.1M',
					}),
					RawReportMetricTile({
						accent: 'green',
						icon: '↗',
						label: 'Avg. frequency',
						value: '14.70',
					}),
					RawReportMetricTile({
						accent: 'orange',
						icon: 'R',
						label: 'CPT',
						value: 'R53.65',
					}),
				],
				highlighted: true,
			}),
			RawReportComparisonBlock({
				left: {
					description: 'CBD and airport coverage',
					id: 'scenario-a',
					label: 'Scenario A',
					meta: 'Higher reach',
				},
				metrics: [
					{
						label: 'Reach',
						leftValue: 84,
						rightValue: 72,
						unit: '%',
						winner: 'left',
					},
					{
						label: 'Frequency',
						leftValue: 61,
						rightValue: 79,
						unit: '%',
						winner: 'right',
					},
				],
				right: {
					description: 'Retail-heavy renewal route',
					id: 'scenario-b',
					label: 'Scenario B',
					meta: 'Higher frequency',
				},
			}),
			RawReportPlacementTable({
				rows: [
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
				],
			}),
			showLoading
				? RawReportChartLoadingBlock({
						motion: loadingMotion,
						title: 'Loading raw chart',
						variant: 'ranked',
					})
				: null,
			showLoading
				? RawReportPageLoadingState({
						chartCount: 3,
						metricCount: 4,
						motion: loadingMotion,
						title: 'Static report loading',
					})
				: null,
		]);

		return (
			<main className="pds-story-frame">
				<SectionHeader
					actions={<ThemeSwitcher />}
					description="This preview renders HTML returned by the raw report JSX runtime. It is useful for static exports and non-React hosts."
					eyebrow="Plain JSX"
					title="Raw Report Exports"
				/>
				<RawHtmlPreview html={reportHtml} />
			</main>
		);
	},
};

export const AuthPlainJsx: Story = {
	args: {
		accent: 'cyan',
		loadingMotion: 'wave',
		productName: 'Cortexx',
		showLoading: false,
	},
	parameters: {
		docs: {
			source: {
				code: `/** @jsxImportSource @pikaboo/web-design-system/auth-jsx */
import {
  RawAuthAccessScreen,
  renderRawJsxToHtml,
} from '@pikaboo/web-design-system/auth-jsx';

const html = renderRawJsxToHtml(
  <RawAuthAccessScreen mode="login" productName="Cortexx" />
);`,
			},
		},
	},
	render: ({ productName }) => {
		const authHtml = renderAuthRawJsxToHtml(
			RawAuthAccessScreen({
				mode: 'login',
				productName,
			}),
		);

		return (
			<main className="pds-story-frame">
				<SectionHeader
					actions={<ThemeSwitcher />}
					description="This is the auth raw JSX screen rendered into HTML without the React auth component."
					eyebrow="Plain JSX"
					title="Raw Auth Export"
				/>
				<RawHtmlPreview html={authHtml} />
			</main>
		);
	},
};
