import type { Decorator, Preview } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { type ThemeId, ThemeProvider } from '../src';
import '../src/styles.css';

const withTheme: Decorator = (Story, context) => {
	const [, updateGlobals] = useGlobals();
	const selectedTheme =
		context.globals.theme === 'primedia'
			? 'primedia'
			: context.globals.theme === 'pikaboo-dark'
				? 'pikaboo-dark'
				: 'pikaboo';

	return (
		<ThemeProvider
			applyToRoot
			onThemeChange={(themeId) => updateGlobals({ theme: themeId })}
			theme={selectedTheme}
		>
			<Story />
		</ThemeProvider>
	);
};

const preview: Preview = {
	decorators: [withTheme],
	initialGlobals: {
		theme: 'pikaboo' satisfies ThemeId,
	},
	globalTypes: {
		theme: {
			description: 'Tenant theme',
			toolbar: {
				icon: 'paintbrush',
				items: [
					{ value: 'pikaboo', title: 'Pikaboo' },
					{ value: 'pikaboo-dark', title: 'Pikaboo Dark' },
					{ value: 'primedia', title: 'Primedia / Cortexx' },
				],
				dynamicTitle: true,
			},
		},
	},
	parameters: {
		layout: 'centered',
		a11y: {
			test: 'error',
			// axe doesn't model SVG text-over-fill contrast (the donut centre sits
			// inside a hole with its own surface-filled disc behind the text, but
			// axe samples a chart segment as background and false-positives).
			context: { exclude: [['.pds-report-donut__center']] },
			// nested-interactive is a known todo for CampaignListCard +
			// ReportMetricTile: the card-wide click target intentionally coexists
			// with inner action buttons. Documented in
			// src/components/{campaign,report}.test.tsx; revisit when we adopt
			// the stretched-link pattern.
			config: {
				rules: [{ id: 'nested-interactive', enabled: false }],
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				order: ['Foundations', 'Components', 'Patterns'],
			},
		},
	},
};

export default preview;
