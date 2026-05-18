import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
	Badge,
	Button,
	CampaignCardGrid,
	CampaignChoiceChips,
	CampaignControlCard,
	CampaignControlRow,
	CampaignHierarchySelector,
	CampaignListCard,
	CampaignListToolbar,
	CampaignRangeControl,
	CampaignScheduleDialog,
	CampaignSetupReviewRail,
	CampaignSetupWorkspace,
	CampaignStatCard,
	SectionHeader,
	SiteInventoryPanel,
	SupportRequestDialog,
} from '../index';

const meta: Meta = {
	title: 'Campaigns/Workflow Components',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

type Story = StoryObj;

const campaignCards = [
	{
		client: 'No Client',
		dateRange: '9 Jul - 22 Jul 2026',
		duration: '13 days',
		id: 'lario',
		progress: undefined,
		title: 'lario lario',
	},
	{
		client: 'Camissa Asset Management',
		dateRange: '15 Jun - 30 Jun 2026',
		duration: '15 days',
		id: 'camissa-a',
		progress: undefined,
		title: 'Camissa Asset Management - Awareness Flight',
	},
	{
		client: 'Teazy',
		dateRange: '1 Jun - 31 Aug 2026',
		duration: '91 days',
		id: 'teazy',
		progress: undefined,
		title: 'Teazy - Renewal May 2026',
	},
	{
		client: 'Easybet',
		dateRange: '15 May - 23 Aug 2026',
		duration: '100 days',
		id: 'easybet',
		progress: 1,
		title: 'Easybet - Renewal May 2026',
	},
	{
		client: 'SASOL SA',
		dateRange: '15 May - 23 Jun 2026',
		duration: '39 days',
		id: 'sasol',
		progress: 3,
		title: 'SASOL SA - Renewal May 2026',
	},
	{
		client: 'Acme Outdoor Media',
		dateRange: '12 May - 10 Jun 2026',
		duration: '29 days',
		id: 'final-test',
		progress: 14,
		title: 'Lario final test',
	},
];

const inventoryItems = [
	{
		dimensions: '1575mm x 1020mm',
		format: 'Illum ID Lite Sign',
		id: 'AC003',
		location: 'Acornhoek, Acornhoek, Limpopo',
		price: 'R1,500',
		recommended: true,
		title: 'AC003 - Illum ID Lite Sign - Acornhoek',
	},
	{
		dimensions: '1575mm x 1020mm',
		format: 'Illum ID Lite Sign',
		id: 'AC006',
		location: 'Acornhoek, Acornhoek, Limpopo',
		price: 'R1,500',
		recommended: true,
		title: 'AC006 - Illum ID Lite Sign - Acornhoek',
	},
	{
		dimensions: '1575mm x 1020mm',
		format: 'Illum ID Lite Sign',
		id: 'AC007',
		location: 'Acornhoek, Acornhoek, Limpopo',
		price: 'R1,500',
		title: 'AC007 - Illum ID Lite Sign - Acornhoek',
	},
	{
		dimensions: '1575mm x 1020mm',
		format: 'Illum ID Lite Sign',
		id: 'AC008',
		location: 'Acornhoek, Acornhoek, Limpopo',
		price: 'R1,500',
		title: 'AC008 - Illum ID Lite Sign - Acornhoek',
	},
	{
		dimensions: '12m x 3m',
		format: 'Victory Plaza',
		id: 'AD014',
		location: 'University precinct, Gauteng',
		price: 'R101,000.69',
		recommended: true,
		title: 'AD014 - Victory Plaza - University',
	},
];

const locationHierarchy = [
	{
		children: [
			{ id: 'buffalo-city', label: 'Buffalo City', type: 'Municipality' },
			{ id: 'emalahleni', label: 'Emalahleni', type: 'Municipality' },
			{ id: 'engcobo', label: 'Engcobo', type: 'Municipality' },
			{ id: 'enoch-mgijima', label: 'Enoch Mgijima', type: 'Municipality' },
			{
				id: 'nelson-mandela-bay',
				label: 'Nelson Mandela Bay',
				type: 'Municipality',
			},
		],
		defaultExpanded: true,
		id: 'eastern-cape',
		label: 'Eastern Cape',
		type: 'Province',
	},
	{
		children: [
			{ id: 'city-of-cape-town', label: 'City of Cape Town', type: 'Metro' },
			{ id: 'garden-route', label: 'Garden Route', type: 'District' },
			{ id: 'overberg', label: 'Overberg', type: 'District' },
		],
		id: 'western-cape',
		label: 'Western Cape',
		type: 'Province',
	},
] as const;

const proximityHierarchy = [
	{
		children: [
			{
				children: [
					{
						id: 'agriculture-business-location',
						label: 'Agriculture Business',
						type: 'Location',
					},
					{ id: 'preston-watts', label: 'Preston Watts', type: 'Location' },
				],
				defaultExpanded: true,
				id: 'agriculture-business-subcategory',
				label: 'Agriculture Business',
				type: 'Subcategory',
			},
			{ id: 'farm', label: 'Farm', type: 'Subcategory' },
			{ id: 'farm-supplies', label: 'Farm Supplies', type: 'Subcategory' },
			{ id: 'agri-coop', label: 'Agricultural Co-op', type: 'Subcategory' },
			{ id: 'feed-store', label: 'Feed Store', type: 'Subcategory' },
		],
		defaultExpanded: true,
		id: 'agriculture-business',
		label: 'Agriculture Business',
		type: 'Category',
	},
] as const;

export const CampaignListWorkbench: Story = {
	parameters: {
		docs: {
			source: {
				code: `import {
  CampaignCardGrid,
  CampaignListCard,
  CampaignListToolbar,
  CampaignStatCard,
} from '@pikaboo/t2-design-system';

<CampaignListToolbar value={query} onValueChange={setQuery} />
<CampaignStatCard icon="▣" label="Visible Campaigns" value={200} />
<CampaignCardGrid>
  <CampaignListCard
    canEditLabel="Can edit"
    client="No Client"
    dateRange="9 Jul - 22 Jul 2026"
    duration="13 days"
    onView={() => openCampaign(id)}
    title="lario lario"
  />
</CampaignCardGrid>`,
			},
		},
	},
	render: () => {
		const [query, setQuery] = useState('');
		const [selectedCard, setSelectedCard] = useState('lario');
		const filteredCampaigns = campaignCards.filter((campaign) =>
			[campaign.title, campaign.client]
				.join(' ')
				.toLowerCase()
				.includes(query.toLowerCase()),
		);

		return (
			<main className="pds-story-frame">
				<SectionHeader
					actions={<Button leftIcon="+">Create Campaign</Button>}
					description="Manage and monitor reusable campaign-card states."
					title="Campaigns"
				/>
				<CampaignListToolbar
					actions={
						<Button aria-label="Reverse sort" size="icon" variant="outline">
							↓
						</Button>
					}
					onValueChange={setQuery}
					value={query}
				/>
				<div className="pds-story-grid pds-story-grid--four">
					<CampaignStatCard icon="▣" label="Visible Campaigns" value="200" />
					<CampaignStatCard
						icon="↗"
						label="Active Now"
						tone="success"
						value="69"
					/>
					<CampaignStatCard
						icon="◎"
						label="Your Planning"
						tone="warning"
						value="0"
					/>
					<CampaignStatCard
						icon="✦"
						label="Your Booked"
						tone="brand"
						value="0"
					/>
				</div>
				<div className="pds-story-row">
					<span>
						Showing <strong>{filteredCampaigns.length}</strong> of{' '}
						{campaignCards.length} campaigns
					</span>
					<div>
						<Badge tone="brand">My Campaigns</Badge>
						<Badge>Shared</Badge>
					</div>
				</div>
				<CampaignCardGrid>
					{filteredCampaigns.map((campaign) => (
						<CampaignListCard
							canEditLabel="Can edit"
							client={campaign.client}
							dateRange={campaign.dateRange}
							duration={campaign.duration}
							key={campaign.id}
							onSelect={() => setSelectedCard(campaign.id)}
							progress={campaign.progress}
							progressLabel={
								campaign.progress === undefined ? undefined : 'In Progress'
							}
							selected={selectedCard === campaign.id}
							status="Planning"
							title={campaign.title}
						/>
					))}
				</CampaignCardGrid>
			</main>
		);
	},
};

export const SupportRequest: Story = {
	parameters: {
		docs: {
			source: {
				code: `import { SupportRequestDialog } from '@pikaboo/t2-design-system';

<SupportRequestDialog
  defaultValues={{ name: 'Lario Owner', page: 'Campaigns' }}
  onSubmit={(values) => sendSupportRequest(values)}
/>`,
			},
		},
	},
	render: () => (
		<div style={{ minHeight: '100vh' }}>
			<SupportRequestDialog
				defaultValues={{
					email: 'lario.borges+primedia-owner@example.com',
					name: 'Lario Owner',
					page: 'Campaigns',
				}}
			/>
		</div>
	),
};

export const AddSitesInventory: Story = {
	parameters: {
		docs: {
			source: {
				code: `import { SiteInventoryPanel } from '@pikaboo/t2-design-system';

<SiteInventoryPanel
  defaultSelectedIds={['AC003']}
  items={siteItems}
  onBulkAdd={(ids) => addSitesToCampaign(ids)}
  onSelectedIdsChange={setSelectedSiteIds}
/>`,
			},
		},
	},
	render: () => {
		const [selectedIds, setSelectedIds] = useState<string[]>(['AC003']);

		return (
			<main className="pds-story-frame">
				<SectionHeader
					description="Reusable add-sites panel with tabs, search, sort actions, selectable rows, and bulk-add callback."
					eyebrow="Location Intel"
					title="Add Sites"
				/>
				<div style={{ maxWidth: 760 }}>
					<SiteInventoryPanel
						items={inventoryItems}
						onSelectedIdsChange={setSelectedIds}
						selectedIds={selectedIds}
					/>
				</div>
			</main>
		);
	},
};

export const CampaignSetupControls: Story = {
	parameters: {
		docs: {
			source: {
				code: `import {
  CampaignControlCard,
  CampaignHierarchySelector,
  CampaignRangeControl,
  CampaignSetupReviewRail,
  CampaignSetupWorkspace,
} from '@pikaboo/t2-design-system';

<CampaignSetupWorkspace sidebar={<CampaignSetupReviewRail sections={sections} />}>
  <CampaignControlCard icon="map" title="Target Locations">
    <CampaignHierarchySelector nodes={locationHierarchy} />
  </CampaignControlCard>
</CampaignSetupWorkspace>`,
			},
		},
	},
	render: () => (
		<div className="pds-story-frame pds-story-frame--theme-aware">
			<SectionHeader
				description="Compact campaign setup cards for hierarchy trees, range controls, selection chips, and a useful review rail."
				eyebrow="Create Campaign"
				title="Campaign Setup Controls"
			/>
			<CampaignSetupWorkspace
				footer={
					<div className="pds-campaign-setup-story-alert">
						<Badge tone="warning">Missing</Badge>
						Name, Locations, Dates
					</div>
				}
				sidebar={
					<CampaignSetupReviewRail
						action={<Button rightIcon="→">Continue setup</Button>}
						completionValue={58}
						sections={[
							{
								items: [
									{ label: 'Campaign name', status: 'missing' },
									{ label: 'Client', status: 'missing' },
									{ label: 'Target locations', status: 'missing' },
									{ label: 'Campaign dates', status: 'missing' },
								],
								title: 'Required',
							},
							{
								items: [
									{ label: 'Budget', value: 'R1,000,000' },
									{ label: 'Age range', value: '15 - 84 years' },
									{ label: 'Gender', value: 'Female, Male' },
									{ label: 'Income range', value: 'ZAR 0 - 2.4M+' },
								],
								title: 'Audience',
							},
						]}
						title="Setup review"
					/>
				}
			>
				<CampaignControlCard
					description="Contained, searchable, branch-aware tree with a show-more preview."
					icon="map"
					meta="2 levels"
					title="Target locations"
				>
					<CampaignControlRow
						description="Province, municipality, district, or local area."
						title="Add location"
						value="Western Cape"
					>
						<CampaignHierarchySelector
							defaultSelectedIds={['city-of-cape-town']}
							nodes={locationHierarchy}
							searchPlaceholder="Search locations..."
						/>
					</CampaignControlRow>
				</CampaignControlCard>

				<CampaignControlCard
					description="Use proximity categories without dumping the whole tree."
					icon="search"
					meta="Preview 4"
					title="Proximity points"
				>
					<CampaignControlRow
						description="Category, subcategory, and specific point hierarchy."
						title="Add proximity point"
						value="5 km"
					>
						<CampaignHierarchySelector
							defaultSelectedIds={['preston-watts']}
							nodes={proximityHierarchy}
							searchPlaceholder="Search proximity points..."
						/>
					</CampaignControlRow>
					<CampaignRangeControl
						defaultValue={5}
						label="Proximity radius"
						max={50}
						min={1}
						unit="km"
					/>
				</CampaignControlCard>

				<CampaignControlCard
					description="Audience filters keep inputs, sliders, and summary badges in one rhythm."
					icon="users"
					meta="Demographics"
					title="Target audience"
				>
					<CampaignRangeControl
						defaultValue={[15, 84]}
						label="Age range"
						max={84}
						min={15}
						unit="years"
					/>
					<CampaignControlRow
						description="Select one or more audiences."
						title="Gender"
						value="2 selected"
					>
						<CampaignChoiceChips
							defaultSelectedValues={['female', 'male']}
							options={[
								{ label: 'Female', value: 'female' },
								{ label: 'Male', value: 'male' },
							]}
						/>
					</CampaignControlRow>
					<CampaignRangeControl
						defaultValue={[0, 2457600]}
						formatValue={(value) =>
							value === 2457600
								? 'ZAR 2,457,600+'
								: `ZAR ${new Intl.NumberFormat('en-ZA').format(value)}`
						}
						label="Income range"
						max={2457600}
						min={0}
						step={50000}
					/>
				</CampaignControlCard>

				<CampaignControlCard
					description="Keep the brief in a normal card, not a giant empty panel."
					icon="spark"
					title="Campaign brief"
				>
					<CampaignControlRow
						description="The host product can swap this for a textarea, AI brief helper, or uploaded brief."
						title="Write your brief"
						value="Optional"
					>
						<div className="pds-campaign-setup-story-brief">
							Launch awareness around commuter corridors with emphasis on high
							reach and measurable location intelligence.
						</div>
					</CampaignControlRow>
				</CampaignControlCard>
			</CampaignSetupWorkspace>
		</div>
	),
};

export const ScheduleDialog: Story = {
	parameters: {
		docs: {
			source: {
				code: `import { CampaignScheduleDialog } from '@pikaboo/t2-design-system';

<CampaignScheduleDialog
  defaultRange={{ from: new Date(2026, 6, 9), to: new Date(2026, 6, 22) }}
  minRangeDays={14}
  onApply={(range) => updateCampaignSchedule(range)}
/>`,
			},
		},
	},
	render: () => (
		<div style={{ minHeight: '100vh' }}>
			<CampaignScheduleDialog
				defaultRange={{
					from: new Date(2026, 6, 9),
					to: new Date(2026, 6, 22),
				}}
				minRangeDays={14}
			/>
		</div>
	),
};
