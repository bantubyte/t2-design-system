import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';
import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	SectionHeader,
} from '../index';
import {
	type ComponentUsageCategory,
	componentUsageCategories,
	componentUsageDocs,
	getComponentUsageSummary,
} from './component-usage-data';

type UsageCatalogCategory = 'All' | ComponentUsageCategory;
type SnippetMode = 'both' | 'raw-jsx' | 'react';

interface UsageCatalogArgs {
	category: UsageCatalogCategory;
	query: string;
	showComponentNames: boolean;
	snippetMode: SnippetMode;
}

const allCategories: readonly UsageCatalogCategory[] = [
	'All',
	...componentUsageCategories,
];

const meta = {
	title: 'Documentation/Component Usage',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Copyable package usage examples, raw JSX entrypoints, and a searchable map of the design-system surface.',
			},
		},
	},
	argTypes: {
		category: {
			control: 'select',
			options: allCategories,
		},
		query: {
			control: 'text',
		},
		showComponentNames: {
			control: 'boolean',
		},
		snippetMode: {
			control: 'inline-radio',
			options: ['both', 'react', 'raw-jsx'],
		},
	},
} satisfies Meta<UsageCatalogArgs>;

export default meta;

type Story = StoryObj<UsageCatalogArgs>;

function CodeBlock({ code, label }: { code: string; label: string }) {
	const [copied, setCopied] = useState(false);

	return (
		<div className="pds-docs-code">
			<div className="pds-docs-code__header">
				<span>{label}</span>
				<button
					className="pds-docs-code__copy"
					onClick={() => {
						void navigator.clipboard?.writeText(code);
						setCopied(true);
						window.setTimeout(() => setCopied(false), 1100);
					}}
					type="button"
				>
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
			{/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable code block needs keyboard access per axe scrollable-region-focusable. */}
			{/* biome-ignore lint/a11y/useSemanticElements: <pre role="group"> is intentional — a fieldset/legend pair would impose form semantics that don't fit a code snippet. */}
			<pre aria-label={`${label} code snippet`} role="group" tabIndex={0}>
				<code>{code}</code>
			</pre>
		</div>
	);
}

function UsageDocCard({
	showComponentNames,
	snippetMode,
	title,
}: {
	showComponentNames: boolean;
	snippetMode: SnippetMode;
	title: string;
}) {
	const doc = componentUsageDocs.find((candidate) => candidate.title === title);
	if (!doc) return null;
	const showReactSnippet = snippetMode === 'both' || snippetMode === 'react';
	const showRawSnippet =
		Boolean(doc.rawSnippet) &&
		(snippetMode === 'both' || snippetMode === 'raw-jsx');

	return (
		<Card className="pds-docs-card">
			<CardHeader>
				<div className="pds-docs-card__title-row">
					<div>
						<CardTitle>{doc.title}</CardTitle>
						<CardDescription>{doc.description}</CardDescription>
					</div>
					<Badge tone={doc.rawSnippet ? 'info' : 'brand'}>{doc.category}</Badge>
				</div>
			</CardHeader>
			<CardContent className="pds-docs-card__content">
				<div className="pds-docs-card__meta-grid">
					<div>
						<p className="pds-docs-card__label">React package</p>
						<code>{doc.reactPackage}</code>
					</div>
					{doc.rawPackage ? (
						<div>
							<p className="pds-docs-card__label">Raw JSX package</p>
							<code>{doc.rawPackage}</code>
						</div>
					) : null}
					{doc.storyPath ? (
						<div>
							<p className="pds-docs-card__label">Story path</p>
							<span>{doc.storyPath}</span>
						</div>
					) : null}
				</div>

				{showComponentNames ? (
					<div className="pds-docs-chip-list">
						{doc.components.map((component) => (
							<span className="pds-docs-chip" key={component}>
								{component}
							</span>
						))}
					</div>
				) : null}

				<div className="pds-docs-props">
					<p className="pds-docs-card__label">Common props</p>
					<div className="pds-docs-chip-list">
						{doc.keyProps.map((prop) => (
							<code className="pds-docs-prop" key={prop}>
								{prop}
							</code>
						))}
					</div>
				</div>

				{showReactSnippet ? (
					<CodeBlock code={doc.reactSnippet} label="React usage" />
				) : null}
				{showRawSnippet && doc.rawSnippet ? (
					<CodeBlock code={doc.rawSnippet} label="Plain JSX usage" />
				) : null}
				{snippetMode === 'raw-jsx' && !doc.rawSnippet ? (
					<p className="pds-docs-muted">
						No raw JSX adapter is exported for this component family yet. Use
						the React package above until a raw adapter is added.
					</p>
				) : null}
			</CardContent>
		</Card>
	);
}

function UsageCatalog({
	category,
	query,
	showComponentNames,
	snippetMode,
}: UsageCatalogArgs) {
	const summary = getComponentUsageSummary();
	const [activeCategory, setActiveCategory] =
		useState<UsageCatalogCategory>(category);
	const [localQuery, setLocalQuery] = useState(query);

	useEffect(() => {
		setActiveCategory(category);
	}, [category]);

	useEffect(() => {
		setLocalQuery(query);
	}, [query]);

	const filteredDocs = useMemo(() => {
		const normalizedQuery = localQuery.trim().toLowerCase();
		return componentUsageDocs.filter((doc) => {
			const categoryMatches =
				activeCategory === 'All' || doc.category === activeCategory;
			if (!categoryMatches) return false;
			if (!normalizedQuery) return true;
			return [
				doc.title,
				doc.description,
				doc.category,
				doc.reactPackage,
				doc.rawPackage ?? '',
				...doc.components,
				...doc.keyProps,
			]
				.join(' ')
				.toLowerCase()
				.includes(normalizedQuery);
		});
	}, [activeCategory, localQuery]);

	return (
		<main className="pds-docs-page">
			<section className="pds-docs-hero">
				<SectionHeader
					description="Search by component, package path, prop, or workflow. Each card shows where to import it from, which props matter first, and how to use it in React. Raw JSX cards show the framework-neutral entrypoints separately."
					eyebrow="Design system manual"
					title="Find it. Tune it. Ship it."
				/>
				<div className="pds-docs-stats">
					<div>
						<strong>{summary.totalComponents}</strong>
						<span>documented names</span>
					</div>
					<div>
						<strong>{componentUsageDocs.length}</strong>
						<span>usage cards</span>
					</div>
					<div>
						<strong>{summary.rawSnippetCount}</strong>
						<span>raw JSX examples</span>
					</div>
				</div>
			</section>

			<section aria-label="Catalog controls" className="pds-docs-controls">
				<div className="pds-docs-search">
					<label htmlFor="usage-search">Search catalog</label>
					<input
						id="usage-search"
						onChange={(event) => setLocalQuery(event.currentTarget.value)}
						placeholder="Search components, props, or package paths"
						value={localQuery}
					/>
				</div>
				<div className="pds-docs-category-strip">
					{allCategories.map((item) => (
						<button
							className="pds-docs-category-button"
							key={item}
							onClick={() => setActiveCategory(item)}
							type="button"
						>
							<Badge tone={item === activeCategory ? 'brand' : 'neutral'}>
								{item}
							</Badge>
						</button>
					))}
				</div>
			</section>

			<section className="pds-docs-card-grid">
				{filteredDocs.map((doc) => (
					<UsageDocCard
						key={doc.title}
						showComponentNames={showComponentNames}
						snippetMode={snippetMode}
						title={doc.title}
					/>
				))}
			</section>

			{filteredDocs.length === 0 ? (
				<Card className="pds-docs-empty">
					<CardHeader>
						<CardTitle>No matching component docs</CardTitle>
						<CardDescription>
							Clear the query or switch the category control back to All.
						</CardDescription>
					</CardHeader>
				</Card>
			) : null}
		</main>
	);
}

export const Catalog: Story = {
	args: {
		category: 'All',
		query: '',
		showComponentNames: true,
		snippetMode: 'both',
	},
	render: (args) => <UsageCatalog {...args} />,
};

export const ReactOnlyQuickStart: Story = {
	args: {
		category: 'Reports',
		query: '',
		showComponentNames: true,
		snippetMode: 'react',
	},
	render: (args) => <UsageCatalog {...args} />,
};

export const PlainJsxExports: Story = {
	args: {
		category: 'Raw JSX',
		query: '',
		showComponentNames: true,
		snippetMode: 'raw-jsx',
	},
	render: (args) => <UsageCatalog {...args} />,
};
