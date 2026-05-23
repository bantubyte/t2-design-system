import type { ChartFormatter } from '../../../charts-core';
import { formatPlainValue } from '../../../charts-core';

interface TooltipPayloadItem {
	color?: string;
	dataKey?: string;
	name?: string;
	payload?: Record<string, unknown>;
	value?: unknown;
}

export interface ChartTooltipProps {
	active?: boolean;
	label?: unknown;
	labelFormatter?: ChartFormatter;
	payload?: readonly TooltipPayloadItem[];
	valueFormatter?: ChartFormatter;
}

export function ChartTooltip({
	active,
	label,
	labelFormatter,
	payload,
	valueFormatter,
}: ChartTooltipProps) {
	if (!active || !payload?.length) return null;

	return (
		<div className="pds-chart-tooltip">
			{label != null ? (
				<p className="pds-chart-tooltip__label">
					{labelFormatter ? labelFormatter(label) : formatPlainValue(label)}
				</p>
			) : null}
			<ul>
				{payload.map((item, index) => (
					<li key={`${item.dataKey ?? item.name ?? 'series'}-${index}`}>
						<span
							className="pds-chart-tooltip__swatch"
							style={{ background: item.color }}
						/>
						<span>{item.name ?? item.dataKey}</span>
						<strong>
							{valueFormatter
								? valueFormatter(item.value, {
										dataKey: item.dataKey,
										datum: item.payload,
									})
								: formatPlainValue(item.value)}
						</strong>
					</li>
				))}
			</ul>
		</div>
	);
}
