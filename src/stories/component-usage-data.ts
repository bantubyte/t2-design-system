export const componentUsageCategories = [
	'Foundations',
	'Actions',
	'Forms',
	'Feedback',
	'Navigation',
	'Data Display',
	'Campaign',
	'Reports',
	'Auth',
	'Page Blocks',
	'Raw JSX',
] as const;

export type ComponentUsageCategory = (typeof componentUsageCategories)[number];

export interface ComponentUsageDoc {
	category: ComponentUsageCategory;
	components: readonly string[];
	description: string;
	keyProps: readonly string[];
	rawPackage?: string;
	rawSnippet?: string;
	reactPackage: string;
	reactSnippet: string;
	storyPath?: string;
	title: string;
}

export const componentUsageDocs: readonly ComponentUsageDoc[] = [
	{
		category: 'Foundations',
		components: [
			'ThemeProvider',
			'ThemeSwitcher',
			'useTheme',
			'createDesignTheme',
			'themeIds',
			'themes',
			'BrandMark',
			'ProductName',
			'BrandLockup',
			'Icon',
		],
		description:
			'Tenant theme, product copy, brand marks, exported CSS variables, and the icon wrapper used across the system.',
		keyProps: ['theme', 'children', 'brand', 'size', 'showDescriptor'],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  BrandLockup,
  ProductName,
  ThemeProvider,
  ThemeSwitcher,
} from '@pikaboo/web-design-system';
import '@pikaboo/web-design-system/styles.css';

export function TenantFrame() {
  return (
    <ThemeProvider theme="primedia">
      <header>
        <BrandLockup />
        <ProductName />
        <ThemeSwitcher />
      </header>
    </ThemeProvider>
  );
}`,
		storyPath: 'Components/Library/Foundations',
		title: 'Theme and Brand Foundations',
	},
	{
		category: 'Actions',
		components: [
			'Button',
			'IconButton',
			'Badge',
			'RemovableBadge',
			'SelectionBadge',
			'Avatar',
			'AvatarGroup',
		],
		description:
			'Primary actions, compact icon actions, status labels, removable filters, selected item chips, and collaborator avatars.',
		keyProps: [
			'variant',
			'size',
			'tone',
			'label',
			'items',
			'people',
			'onRemove',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  AvatarGroup,
  Badge,
  Button,
  IconButton,
  RemovableBadge,
} from '@pikaboo/web-design-system';

export function CampaignToolbar() {
  return (
    <div>
      <Button icon="plus">Create campaign</Button>
      <IconButton icon="filter" label="Open filters" variant="outline" />
      <Badge tone="success">Can edit</Badge>
      <RemovableBadge label="Gauteng" onRemove={() => {}} />
      <AvatarGroup people={[{ initials: 'LO', alt: 'Lario Owner' }]} />
    </div>
  );
}`,
		storyPath: 'Components/Library/Foundations',
		title: 'Buttons, Badges, and Avatars',
	},
	{
		category: 'Actions',
		components: ['FloatingButton'],
		description:
			'Generic fixed or absolute floating action button with icon, label, tooltip, idle collapse, draggable snap corners, and optional localStorage persistence.',
		keyProps: [
			'label',
			'icon',
			'tooltip',
			'position',
			'defaultCorner',
			'storageKey',
			'collapseAfterMs',
			'dragDisabled',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import { FloatingButton } from '@pikaboo/web-design-system';

export function HelpAction() {
  return (
    <FloatingButton
      bottomLiftInset={96}
      icon="help"
      label="Contact Help"
      liftBottomCorners
      onClick={() => setHelpOpen(true)}
      storageKey="cortexx_help_fab_corner"
      tooltip="Drag me to another corner"
    />
  );
}`,
		storyPath: 'Components/Floating Button/Playground',
		title: 'FloatingButton',
	},
	{
		category: 'Forms',
		components: [
			'Field',
			'Input',
			'Textarea',
			'Select',
			'Switch',
			'Slider',
			'RadioCardGroup',
			'Calendar',
			'DateRangePicker',
		],
		description:
			'Accessible base controls, campaign-friendly cards, range controls, single-date calendars, and date-range pickers.',
		keyProps: [
			'label',
			'hint',
			'error',
			'value',
			'onValueChange',
			'selectedDate',
			'defaultRange',
			'minRangeDays',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  Calendar,
  DateRangePicker,
  Field,
  Input,
  RadioCardGroup,
  Slider,
  Switch,
} from '@pikaboo/web-design-system';

export function CampaignBasics() {
  return (
    <form>
      <Field label="Campaign name" hint="Shown in reports and exports">
        <Input placeholder="Summer reach flight" />
      </Field>
      <DateRangePicker label="Flight dates" minRangeDays={14} />
      <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
      <Slider label="Budget" min={0} max={2500000} value={budget} onValueChange={setBudget} />
      <Switch label="Use premium audience model" />
      <RadioCardGroup label="Objective" options={objectiveOptions} value={objective} onValueChange={setObjective} />
    </form>
  );
}`,
		storyPath: 'Components/Library/Forms And Controls',
		title: 'Forms and Date Controls',
	},
	{
		category: 'Forms',
		components: [
			'DropdownMenu',
			'DropdownItem',
			'DropdownSeparator',
			'Popover',
			'CommandMenu',
			'SearchableSelector',
			'SelectorGroup',
			'SelectorOption',
			'SegmentedControl',
			'FileDropzone',
			'Tooltip',
		],
		description:
			'Richer selectors, searchable choice lists, command menus, disclosure panels, segmented choices, uploads, and hover/focus help.',
		keyProps: [
			'options',
			'items',
			'mode',
			'selectedValues',
			'onValueChange',
			'panelLabel',
			'content',
			'accept',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  CommandMenu,
  DropdownItem,
  DropdownMenu,
  Popover,
  SearchableSelector,
  SegmentedControl,
  SelectorGroup,
  SelectorOption,
  Tooltip,
} from '@pikaboo/web-design-system';

export function PlanningSelectors() {
  return (
    <section>
      <DropdownMenu label="Objective">
        <DropdownItem selected>Awareness</DropdownItem>
        <DropdownItem>Conversion</DropdownItem>
      </DropdownMenu>
      <Popover label="Markets" panelLabel="Market selector">
        <SearchableSelector
          mode="multiple"
          options={marketOptions}
          selectedValues={selectedMarkets}
          onValueChange={setSelectedMarkets}
        />
      </Popover>
      <SegmentedControl options={viewOptions} value={view} onChange={setView} />
      <SelectorGroup columns={1}>
        <SelectorOption selected title="Suggested selector" status="Suggested" />
      </SelectorGroup>
      <CommandMenu items={commands} onSelect={setCommand} />
      <Tooltip content="This value is tenant-token aware">...</Tooltip>
    </section>
  );
}`,
		storyPath: 'Components/Library/Forms And Controls',
		title: 'Selectors, Menus, and Uploads',
	},
	{
		category: 'Feedback',
		components: [
			'Alert',
			'EmptyState',
			'EmptyAction',
			'LoadingState',
			'BigLoader',
			'ContentLoader',
			'CardLoadingState',
			'PageContentLoader',
			'Skeleton',
			'Progress',
		],
		description:
			'Status messaging, empty states, progress bars, animated loaders, page/content/card skeletons, and report-friendly loading movement.',
		keyProps: [
			'tone',
			'title',
			'label',
			'motion',
			'size',
			'rows',
			'cards',
			'value',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  Alert,
  BigLoader,
  CardLoadingState,
  EmptyAction,
  EmptyState,
  PageContentLoader,
  Progress,
} from '@pikaboo/web-design-system';

export function LoadingAndEmptyStates() {
  return (
    <>
      <BigLoader label="Building campaign report" motion="orbit" />
      <PageContentLoader cards={6} motion="wave" title="Loading insights" />
      <CardLoadingState lines={4} media motion="shimmer" />
      <Progress label="Brief completeness" value={72} />
      <Alert tone="warning" title="Budget variance">Review recommended spend.</Alert>
      <EmptyState title="No campaigns" action={<EmptyAction>Create campaign</EmptyAction>} />
    </>
  );
}`,
		storyPath: 'Feedback/Loading States',
		title: 'Feedback and Loading States',
	},
	{
		category: 'Feedback',
		components: [
			'Dialog',
			'DialogHeader',
			'DialogTitle',
			'DialogDescription',
			'DialogBody',
			'DialogFooter',
			'GuidedWizardShell',
			'GuidedWizardStepper',
			'GuidedWizardPanel',
			'GuidedWizardStatusBar',
			'GuidedWizardToast',
		],
		description:
			'Modal shells and guided wizard primitives for onboarding, campaign setup, and multi-step flows.',
		keyProps: [
			'open',
			'size',
			'title',
			'steps',
			'currentStep',
			'status',
			'actions',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  GuidedWizardPanel,
  GuidedWizardShell,
  GuidedWizardStepper,
} from '@pikaboo/web-design-system';

export function GuidedSetupDialog() {
  return (
    <Dialog open size="lg">
      <DialogHeader>
        <DialogTitle>Create campaign</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <GuidedWizardShell title="Quick setup">
          <GuidedWizardStepper steps={steps} value={step} onChange={setStep} />
          <GuidedWizardPanel title="Campaign name">...</GuidedWizardPanel>
        </GuidedWizardShell>
      </DialogBody>
      <DialogFooter>...</DialogFooter>
    </Dialog>
  );
}`,
		storyPath: 'Components/Wizard',
		title: 'Dialogs and Guided Wizards',
	},
	{
		category: 'Navigation',
		components: [
			'PageShell',
			'Container',
			'Grid',
			'GridItem',
			'Stack',
			'Cluster',
			'Toolbar',
			'SectionHeader',
			'Breadcrumbs',
			'Pagination',
			'Tabs',
			'TabList',
			'Tab',
			'Accordion',
			'DisclosureButton',
			'Surface',
			'Card',
			'CardHeader',
			'CardTitle',
			'CardDescription',
			'CardContent',
			'CardFooter',
			'Footer',
			'KeyValueList',
			'Divider',
			'Timeline',
		],
		description:
			'Layout primitives, page shells, cards, toolbars, tabs, accordions, breadcrumbs, pagination, metadata rows, and timelines.',
		keyProps: [
			'aside',
			'header',
			'columns',
			'gap',
			'tone',
			'padding',
			'items',
			'page',
			'pageCount',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  PageShell,
  SectionHeader,
  Tabs,
  Timeline,
  Toolbar,
} from '@pikaboo/web-design-system';

export function CampaignPage() {
  return (
    <PageShell aside={<Nav />} header={<SectionHeader title="Campaigns" actions={<Toolbar />} />}>
      <Breadcrumbs items={breadcrumbItems} />
      <Tabs items={tabItems} value={tab} onValueChange={setTab} />
      <Grid columns={3}>
        <Card><CardContent>...</CardContent></Card>
      </Grid>
      <Timeline items={workflowItems} />
    </PageShell>
  );
}`,
		storyPath: 'Components/Library/Campaign Workspace',
		title: 'Layout and Navigation',
	},
	{
		category: 'Data Display',
		components: [
			'MetricCard',
			'StatGrid',
			'DataTable',
			'ChartCard',
			'InsightCard',
		],
		description:
			'Metric summaries, tabular records, lightweight chart cards, and insight/evidence panels for dashboard surfaces.',
		keyProps: [
			'columns',
			'rows',
			'data',
			'evidence',
			'confidence',
			'status',
			'change',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  ChartCard,
  DataTable,
  InsightCard,
  MetricCard,
  StatGrid,
} from '@pikaboo/web-design-system';

export function CampaignAnalytics() {
  return (
    <>
      <StatGrid columns={4}>
        <MetricCard label="Reach" value="2.4M" change="+12%" status="success" />
      </StatGrid>
      <ChartCard title="Channel mix" data={channelMix} />
      <InsightCard title="AI placement insight" evidence={evidence} confidence="High confidence">
        Shift budget toward the high-performing corridor.
      </InsightCard>
      <DataTable columns={columns} rows={rows} />
    </>
  );
}`,
		storyPath: 'Components/Library/Campaign Workspace',
		title: 'Metrics, Tables, and Insight Cards',
	},
	{
		category: 'Campaign',
		components: [
			'CampaignSummaryCard',
			'PlacementCard',
			'AudienceCard',
			'FilterChip',
			'ActionBar',
			'CampaignSetupWorkspace',
			'CampaignControlCard',
			'CampaignControlRow',
			'CampaignRangeControl',
			'CampaignChoiceChips',
			'CampaignHierarchySelector',
			'CampaignSetupReviewRail',
			'CampaignStatCard',
			'CampaignListCard',
			'CampaignCardGrid',
			'CampaignListToolbar',
			'SupportRequestDialog',
			'SiteInventoryRow',
			'SiteInventoryPanel',
			'CampaignScheduleDialog',
		],
		description:
			'Application-grade campaign planning, list management, site inventory, scheduling, support, and review rail components.',
		keyProps: [
			'status',
			'progress',
			'metrics',
			'selected',
			'onSelect',
			'items',
			'range',
			'onRangeChange',
			'filters',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  CampaignCardGrid,
  CampaignListCard,
  CampaignListToolbar,
  CampaignScheduleDialog,
  CampaignSetupWorkspace,
  SiteInventoryPanel,
} from '@pikaboo/web-design-system';

export function CampaignWorkspace() {
  return (
    <CampaignSetupWorkspace
      sidebar={<CampaignListToolbar searchValue={query} onSearchChange={setQuery} />}
      reviewRail={reviewRail}
    >
      <CampaignCardGrid>
        {campaigns.map((campaign) => (
          <CampaignListCard key={campaign.id} {...campaign} onSelect={() => openCampaign(campaign.id)} />
        ))}
      </CampaignCardGrid>
      <CampaignScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} />
      <SiteInventoryPanel items={sites} selectedIds={selectedSiteIds} onSelectedIdsChange={setSelectedSiteIds} />
    </CampaignSetupWorkspace>
  );
}`,
		storyPath: 'Campaign Workflows',
		title: 'Campaign Workflow Components',
	},
	{
		category: 'Reports',
		components: [
			'ReportBlock',
			'ReportBlockGrid',
			'ReportMetricBlock',
			'ReportMetricTile',
			'ReportMetricRibbon',
			'ReportMetricRibbonLoading',
			'ReportTourCallout',
			'ReportEntityCard',
			'ReportEmptyPanel',
			'ReportChartLoadingBlock',
			'ReportSectionLoadingState',
			'ReportPageLoadingState',
			'ReportRankedListBlock',
			'ReportToggleGroup',
			'ReportActionCard',
			'ReportEvidenceList',
			'ReportComparisonBlock',
			'ReportShell',
			'ReportExportHeader',
			'ReportSection',
			'ReportSparkline',
			'ReportKpiTile',
			'ReportKpiStrip',
			'ReportTrendChart',
			'ReportBarList',
			'ReportDonut',
			'ReportEvidencePanel',
			'ReportInsightCallout',
			'ReportRecommendationCard',
			'ReportCommentary',
			'ReportPlacementTable',
			'ReportSourceFooter',
		],
		description:
			'Composable report blocks for KPI strips, chart cards, evidence panels, ranked lists, comparisons, commentary, placement tables, recommendations, sources, and loaders.',
		keyProps: [
			'title',
			'description',
			'metrics',
			'items',
			'rows',
			'selectedRowId',
			'onRowSelect',
			'tone',
			'motion',
		],
		reactPackage: '@pikaboo/web-design-system/report',
		reactSnippet: `import {
  ReportComparisonBlock,
  ReportEvidencePanel,
  ReportKpiStrip,
  ReportPlacementTable,
  ReportRecommendationCard,
  ReportShell,
  ReportTrendChart,
} from '@pikaboo/web-design-system/report';

export function PerformanceReport() {
  return (
    <ReportShell>
      <ReportKpiStrip items={kpis} />
      <ReportTrendChart title="Reach trend" data={trend} />
      <ReportEvidencePanel items={evidence} />
      <ReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
      <ReportPlacementTable rows={placements} selectedRowId={selectedId} onRowSelect={setSelectedPlacement} />
      <ReportRecommendationCard title="Recommended action" confidence="High" />
    </ReportShell>
  );
}`,
		storyPath: 'Reports/Component Playground',
		title: 'Report Blocks',
	},
	{
		category: 'Auth',
		components: [
			'AuthAccessScreen',
			'AuthSignUpScreen',
			'AuthLoginScreen',
			'HelpCenter',
			'PaymentForm',
		],
		description:
			'Tenant-aware access, login, sign-up, help center, and payment collection screens.',
		keyProps: [
			'variant',
			'brand',
			'values',
			'onSubmit',
			'categories',
			'methods',
			'amounts',
		],
		reactPackage: '@pikaboo/web-design-system/auth',
		reactSnippet: `import { AuthAccessScreen } from '@pikaboo/web-design-system/auth';
import { HelpCenter, PaymentForm } from '@pikaboo/web-design-system';

export function AccessAndSupport() {
  return (
    <>
      <AuthAccessScreen productName="Cortexx" onSubmit={handleAccessSubmit} />
      <HelpCenter categories={helpCategories} faqs={faqs} />
      <PaymentForm amounts={amounts} methods={methods} onSubmit={handlePayment} />
    </>
  );
}`,
		storyPath: 'Auth',
		title: 'Auth, Help, and Payment Screens',
	},
	{
		category: 'Page Blocks',
		components: [
			'PageTemplate',
			'PageHero',
			'LogoCloud',
			'FeatureGrid',
			'FeatureSplit',
			'StatsStrip',
			'TestimonialBand',
			'PricingSection',
			'FaqSection',
			'ContactStrip',
			'FinalCta',
			'SignupPanel',
			'DonationPanel',
			'ReliefImpactSection',
			'TransparencySection',
		],
		description:
			'Marketing, product, sign-up, donation, relief-impact, transparency, pricing, FAQ, and final CTA page sections.',
		keyProps: [
			'brand',
			'scheme',
			'tone',
			'eyebrow',
			'title',
			'actions',
			'items',
			'plans',
		],
		reactPackage: '@pikaboo/web-design-system',
		reactSnippet: `import {
  FeatureGrid,
  FinalCta,
  PageHero,
  PageTemplate,
  PricingSection,
  StatsStrip,
} from '@pikaboo/web-design-system';

export function MarketingPage() {
  return (
    <PageTemplate brand="pikaboo">
      <PageHero title="Unlock Africa's hidden markets" actions={heroActions} />
      <StatsStrip items={stats} />
      <FeatureGrid items={features} />
      <PricingSection plans={plans} />
      <FinalCta title="Start planning smarter campaigns" />
    </PageTemplate>
  );
}`,
		storyPath: 'Page Blocks',
		title: 'Page and Marketing Blocks',
	},
	{
		category: 'Raw JSX',
		components: ['RawAuthAccessScreen', 'renderRawJsxToHtml'],
		description:
			'Framework-neutral auth access screen for environments that can render the package raw JSX runtime without React.',
		keyProps: ['productName', 'headline', 'values', 'errors', 'onSubmit'],
		rawPackage: '@pikaboo/web-design-system/auth-jsx',
		rawSnippet: `/** @jsxImportSource @pikaboo/web-design-system/auth-jsx */
import {
  RawAuthAccessScreen,
  renderRawJsxToHtml,
} from '@pikaboo/web-design-system/auth-jsx';

const html = renderRawJsxToHtml(
  <RawAuthAccessScreen
    productName="Cortexx"
    headline="Unlock Africa's Hidden Markets"
    values={{ email: '' }}
  />,
);`,
		reactPackage: '@pikaboo/web-design-system/auth',
		reactSnippet: `import { AuthAccessScreen } from '@pikaboo/web-design-system/auth';

export function ReactAccessScreen() {
  return <AuthAccessScreen productName="Cortexx" onSubmit={handleSubmit} />;
}`,
		storyPath: 'Auth/Access Screen',
		title: 'Raw Auth JSX',
	},
	{
		category: 'Raw JSX',
		components: [
			'RawReportBlock',
			'RawReportMetricTile',
			'RawReportMetricRibbon',
			'RawReportMetricRibbonLoading',
			'RawReportEvidenceList',
			'RawReportComparisonBlock',
			'RawReportRankedListBlock',
			'RawReportTourCallout',
			'RawReportPlacementTable',
			'RawReportChartLoadingBlock',
			'RawReportSectionLoadingState',
			'RawReportPageLoadingState',
			'ReportMetricTile',
			'ReportMetricRibbon',
			'ReportEvidenceList',
			'ReportComparisonBlock',
			'ReportRankedListBlock',
			'ReportTourCallout',
			'ReportPlacementTable',
			'ReportChartLoadingBlock',
			'ReportSectionLoadingState',
			'ReportPageLoadingState',
		],
		description:
			'Framework-neutral report widgets that mirror the React report surface for export pipelines, static rendering, or non-React hosts.',
		keyProps: [
			'accent',
			'label',
			'value',
			'items',
			'metrics',
			'rows',
			'motion',
		],
		rawPackage: '@pikaboo/web-design-system/report-jsx',
		rawSnippet: `/** @jsxImportSource @pikaboo/web-design-system/report-jsx */
import {
  RawReportComparisonBlock,
  RawReportMetricRibbon,
  RawReportMetricTile,
  RawReportPlacementTable,
  RawReportPageLoadingState,
} from '@pikaboo/web-design-system/report-jsx';

export function StaticReport() {
  return (
    <RawReportMetricRibbon highlighted>
      <RawReportMetricTile accent="cyan" label="VAC" value="48.1M" />
      <RawReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
      <RawReportPlacementTable rows={rows} />
      <RawReportPageLoadingState motion="wave" />
    </RawReportMetricRibbon>
  );
}`,
		reactPackage: '@pikaboo/web-design-system/report',
		reactSnippet: `import {
  ReportComparisonBlock,
  ReportMetricRibbon,
  ReportMetricTile,
  ReportPlacementTable,
} from '@pikaboo/web-design-system/report';

export function ReactReport() {
  return (
    <ReportMetricRibbon highlighted>
      <ReportMetricTile accent="cyan" label="VAC" value="48.1M" />
      <ReportComparisonBlock left={scenarioA} right={scenarioB} metrics={metrics} />
      <ReportPlacementTable rows={rows} />
    </ReportMetricRibbon>
  );
}`,
		storyPath: 'Reports/Raw JSX',
		title: 'Raw Report JSX',
	},
];

export function getComponentUsageSummary() {
	return {
		rawSnippetCount: componentUsageDocs.filter((doc) => doc.rawSnippet).length,
		reactSnippetCount: componentUsageDocs.filter((doc) => doc.reactSnippet)
			.length,
		totalComponents: componentUsageDocs.reduce(
			(total, doc) => total + doc.components.length,
			0,
		),
	};
}
