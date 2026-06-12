import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname === 'undefined'
		? path.dirname(fileURLToPath(import.meta.url))
		: __dirname;

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					environment: 'jsdom',
					globals: true,
					include: ['src/**/*.test.{ts,tsx}'],
				},
			},
			{
				extends: true,
				plugins: [
					storybookTest({ configDir: path.join(dirname, '.storybook') }),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						fileParallelism: false,
						headless: true,
						isolate: false,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
});
