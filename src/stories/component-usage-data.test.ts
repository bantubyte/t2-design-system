import { describe, expect, it } from 'vitest';
import {
	componentUsageCategories,
	componentUsageDocs,
	getComponentUsageSummary,
} from './component-usage-data';

describe('component usage Storybook inventory', () => {
	it('documents every exported component family with package-specific usage snippets', () => {
		const summary = getComponentUsageSummary();

		expect(componentUsageCategories).toEqual([
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
		]);
		expect(summary.totalComponents).toBeGreaterThanOrEqual(100);
		expect(summary.reactSnippetCount).toBe(componentUsageDocs.length);
		expect(summary.rawSnippetCount).toBeGreaterThanOrEqual(2);
	});

	it('keeps the most important export paths discoverable', () => {
		const byTitle = new Map(componentUsageDocs.map((doc) => [doc.title, doc]));

		expect(byTitle.get('FloatingButton')?.reactPackage).toBe(
			'@pikaboo/t2-design-system',
		);
		expect(byTitle.get('Report Blocks')?.reactPackage).toBe(
			'@pikaboo/t2-design-system/report',
		);
		expect(byTitle.get('Raw Report JSX')?.rawPackage).toBe(
			'@pikaboo/t2-design-system/report-jsx',
		);
		expect(byTitle.get('Raw Auth JSX')?.rawPackage).toBe(
			'@pikaboo/t2-design-system/auth-jsx',
		);
	});
});
