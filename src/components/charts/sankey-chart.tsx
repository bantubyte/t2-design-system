import type { HTMLAttributes } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import type {
	ChartA11yProps,
	ChartFormatter,
	ChartPaletteName,
	ChartStatusProps,
} from '../../charts-core';
import { cx } from '../../utils/class-names';
import { ChartContainer, ChartProvider, useChartPalette } from './_internal/chart-container';
import { ChartTooltip } from './_internal/chart-tooltip';

export interface SankeyNode {
	name: string;
}

export interface SankeyLink {
	source: number;
	target: number;
	value: number;
}

export interface SankeyData {
	links: readonly SankeyLink[];
	nodes: readonly SankeyNode[];
}

export interface SankeyChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		ChartA11yProps,
		ChartStatusProps {
	data: SankeyData;
	height?: number;
	palette?: ChartPaletteName;
	valueFormat?: ChartFormatter;
}

function SankeyChartContent({
	ariaDescription,
	ariaLabel,
	className,
	data,
	empty,
	emptyMessage,
	error,
	height = 320,
	loading,
	tableColumns: _tableColumns,
	tableVisible,
	valueFormat,
	...props
}: SankeyChartProps) {
	const palette = useChartPalette();
	const rows = data.links.map((link) => ({
		source: data.nodes[link.source]?.name ?? String(link.source),
		target: data.nodes[link.target]?.name ?? String(link.target),
		value: link.value,
	}));

	return (
		<ChartContainer
			ariaDescription={ariaDescription}
			ariaLabel={ariaLabel}
			className={cx('pds-chart--sankey', className)}
			data={rows}
			empty={empty ?? data.links.length === 0}
			emptyMessage={emptyMessage}
			error={error}
			height={height}
			loading={loading}
			tableColumns={[
				{ header: 'Source', key: 'source' },
				{ header: 'Target', key: 'target' },
				{ format: valueFormat, header: 'Value', key: 'value' },
			]}
			tableVisible={tableVisible}
			{...props}
		>
			<div className="pds-chart__plot">
				<ResponsiveContainer height="100%" width="100%">
					<Sankey
						data={data as { links: SankeyLink[]; nodes: SankeyNode[] }}
						link={{ stroke: palette.categorical[0], strokeOpacity: 0.28 }}
						margin={{ bottom: 12, left: 12, right: 12, top: 12 }}
						node={{ fill: palette.categorical[1], stroke: palette.categorical[1] }}
						nodePadding={24}
					>
						<Tooltip content={<ChartTooltip valueFormatter={valueFormat} />} />
					</Sankey>
				</ResponsiveContainer>
			</div>
		</ChartContainer>
	);
}

export function SankeyChart(props: SankeyChartProps) {
	return (
		<ChartProvider palette={props.palette}>
			<SankeyChartContent {...props} />
		</ChartProvider>
	);
}
