import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			exclude: [
				'src/**/*.stories.tsx',
				'src/**/*.test.ts',
				'src/**/*.test.tsx',
				'vite.config.ts',
				'vitest.config.ts',
			],
			insertTypesEntry: true,
		}),
	],
	build: {
		cssCodeSplit: false,
		lib: {
			entry: {
				auth: resolve(__dirname, 'src/auth.ts'),
				'auth-core': resolve(__dirname, 'src/auth-core.ts'),
				'auth-jsx': resolve(__dirname, 'src/auth-jsx.ts'),
				'auth-jsx/jsx-runtime': resolve(
					__dirname,
					'src/auth-jsx/jsx-runtime.ts',
				),
				charts: resolve(__dirname, 'src/charts.ts'),
				'charts-core': resolve(__dirname, 'src/charts-core.ts'),
				index: resolve(__dirname, 'src/index.ts'),
				'marketing-jsx': resolve(__dirname, 'src/marketing-jsx.ts'),
				'marketing-jsx/jsx-dev-runtime': resolve(
					__dirname,
					'src/marketing-jsx/jsx-dev-runtime.ts',
				),
				'marketing-jsx/jsx-runtime': resolve(
					__dirname,
					'src/marketing-jsx/jsx-runtime.ts',
				),
				'react/auth': resolve(__dirname, 'src/react/auth.ts'),
				'react/report': resolve(__dirname, 'src/react/report.ts'),
				report: resolve(__dirname, 'src/report.ts'),
				'report-core': resolve(__dirname, 'src/report-core.ts'),
				'report-jsx': resolve(__dirname, 'src/report-jsx.ts'),
				'report-jsx/jsx-runtime': resolve(
					__dirname,
					'src/report-jsx/jsx-runtime.ts',
				),
				tailwind: resolve(__dirname, 'src/tailwind.ts'),
				theme: resolve(__dirname, 'src/theme.ts'),
			},
			formats: ['es', 'cjs'],
			fileName: (format, entryName) =>
				format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
			cssFileName: 'styles',
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', 'recharts'],
			output: {
				exports: 'named',
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'reactJsxRuntime',
					recharts: 'Recharts',
				},
			},
		},
	},
});
