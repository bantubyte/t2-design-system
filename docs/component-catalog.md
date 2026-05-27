# t2-design-system Component Catalog

## Package: `@pikaboo/t2-design-system`

Import from: `@pikaboo/t2-design-system`
Styles: `@pikaboo/t2-design-system/styles.css` (import once at app root)
Theme tokens: `@pikaboo/t2-design-system/theme`
Tailwind preset: `@pikaboo/t2-design-system/tailwind`

## Component Families

### Form Controls (`src/components/form.tsx`)

| Component | CSS Class | Description |
|---|---|---|
| `Field` | `.pds-field` | Label + children + optional hint/error |
| `Input` | `.pds-input` | Text input (min-height: 2.5rem, theme border, shadow-sm). Supports `prefix` (renders a label/symbol before the input) and `formatValue` (transforms the display value). |
| `Textarea` | `.pds-input.pds-textarea` | Multi-line textarea |
| `Select` | `.pds-input.pds-select` | Native `<select>` with CSS dropdown arrow |
| `Switch` | `.pds-switch` | Toggle switch |
| `Slider` | `.pds-slider` | Range slider with label/value display |
| `RadioCardGroup` | `.pds-radio-card-group` | Card-style radio group (1-4 columns) |

### Layout (`src/components/layout.tsx`)

| Component | Description |
|---|---|
| `PageHeader`, `PageHeaderTitle`, `PageHeaderDescription` | Page-level header block |

### Campaign (`src/components/campaign.tsx`)

| Component | Description |
|---|---|
| `CampaignSummaryCard` | Campaign summary card with budget, flight dates, metrics |
| `CampaignSetupWorkspace` | Main + sidebar + footer grid layout |
| `CampaignSelectField` | Searchable combobox dropdown (agency/brand selector) |
| `CampaignChoiceTiles` | Tile grid (multi-select buttons with optional icons) |
| `CampaignChoiceChips` | Chip-style buttons (multi-select, no icons) |
| `CampaignCollapsibleField` | Expand/collapse field (summary when collapsed, panel when expanded) |
| `CampaignRangeControl` | Dual-slider range (age, income) or single slider (proximity) |
| `CampaignControlCard` | Section card with icon header |
| `CampaignControlRow` | Row with label/description + control |
| `CampaignSetupReviewRail` | Sidebar rail showing completion status |
| `CampaignHierarchySelector` | Hierarchical tree with search, checkbox selection |
| `CampaignListCard` | Campaign list card with status bar, dates, progress |
| `CampaignCardGrid` | Grid container for campaign cards |
| `CampaignStatCard` | Toggleable stat card for KPIs |
| `CampaignPartialFlightsToggle` | Toggle for partial flight filter |
| `CampaignScheduleDialog` | Date range picker in a dialog |
| `SiteInventoryPanel` | Full tabbed site inventory panel |
| `SiteInventoryRow` | Single site row in inventory |
| `SupportRequestDialog` | Support ticket form dialog |

### Navigation (`src/components/navigation.tsx`)

| Component | Description |
|---|---|
| `Breadcrumbs` | Breadcrumb trail |
| `Sidebar`, `SidebarNav` | App sidebar |
| `UserMenu` | User avatar + menu |

### Data Display (`src/components/data-display.tsx`)

| Component | Description |
|---|---|
| `DataTable` | Sortable, searchable table |
| `KeyValueList` | Key-value grid list |

### Feedback (`src/components/feedback.tsx`)

| Component | Description |
|---|---|
| `Alert` | Info/success/warning/danger alert |
| `Progress` | Progress bar |
| `Skeleton` | Loading skeleton |
| `EmptyState` | Empty state with illustration |

### UI Primitives

| Component | Description |
|---|---|
| `Button` | Variants: primary/secondary/outline/ghost/danger |
| `Badge` | Sizes: sm/md, Tones: neutral/brand/accent/success/warning/danger/info |
| `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` | Card surface |
| `Tooltip` | Hover tooltip |
| `Dialog`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle` | Modal dialog |
| `Divider` | Horizontal rule |
| `Avatar`, `AvatarGroup` | User avatar |
| `Popover` | Popover panel |
| `CommandMenu` | Searchable command list (used inside CampaignSelectField) |
| `SelectorGroup`, `SelectorOption` | Radio-style selector |
| `SearchableSelector` | Searchable multi-select list |

### Theme (`src/theme/index.ts`)

Provides:
- `pikabooTheme`: Pikaboo-brand theme object
- `primediaTheme`: Primedia-brand theme object

### Tailwind Preset (`src/tailwind.ts`)

Exports `pikabooTailwindPreset` which adds these namespaces:
- `theme-*` — primary, foreground, surface, border, etc.
- `brand-*` — brand colors
- `chart-*` — chart palette
- `shadow-sm/md/lg/card/glow`
- `font-body/heading/ui`

### Charts (`src/charts.ts`, `src/charts-core.ts`)

| Export | Description |
|---|---|
| `BarChart`, `LineChart`, `Heatmap` | Recharts wrappers |
| `ChartProvider` | Theme provider for charts |
| `KpiStrip`, `KpiCard` | KPI display |
| `formatCompactNumber`, `formatPercent` | Number formatters |

## CSS Architecture

- Single `styles.css` (11,699 lines) with `.pds-*` classes
- All styling uses CSS custom properties (`var(--theme-*)`)
- Focus-visible outlines use `2px solid var(--theme-primary)`
- Transitions use 160ms ease as default duration
- Border radius uses `var(--radius)` (0.5rem default)
- Input focus: `box-shadow: 0 0 0 3px rgb(var(--theme-primary-rgb) / 0.14)`
