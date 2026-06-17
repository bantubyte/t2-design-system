import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';
import { Icon } from './icons';
import { Tooltip, type TooltipSide } from './tooltip';

export interface PoiBulkAddTipProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
	/** The bold callout text. Defaults to the standard "Top Tip: Bulk Add" copy. */
	text?: ReactNode;
	/** Help content revealed on hover/focus of the icon. Defaults to a worked example. */
	tooltip?: ReactNode;
	/** Which side the tooltip opens on. */
	tooltipSide?: TooltipSide;
}

const DEFAULT_TEXT: ReactNode = (
	<>
		<strong>Top Tip: Bulk Add</strong> — paste a list (one address per line) to
		add them all at once.
	</>
);

const DEFAULT_TOOLTIP: ReactNode = (
	<span className="pds-poi-tip__tooltip">
		<span>One address per line, with each part separated by commas:</span>
		<span className="pds-poi-tip__sample">12 Long St, Cape Town, 8001</span>
		<span className="pds-poi-tip__sample">
			200 Smit St, Braamfontein, Johannesburg, 2001
		</span>
		<span>We verify every line with Google and add a row for each match.</span>
	</span>
);

/**
 * A tinted, attention-drawing hint for bulk address entry. Purely
 * presentational: the host owns where it renders. The help icon shows a
 * (non-native) tooltip explaining the paste format, overridable via `tooltip`.
 */
export function PoiBulkAddTip({
	className,
	text = DEFAULT_TEXT,
	tooltip = DEFAULT_TOOLTIP,
	tooltipSide = 'top',
	...props
}: PoiBulkAddTipProps) {
	return (
		<div className={cx('pds-poi-tip', className)} {...props}>
			<p className="pds-poi-tip__text">{text}</p>
			<Tooltip
				className="pds-poi-tip__help"
				content={tooltip}
				side={tooltipSide}
			>
				<button
					aria-label="How bulk add works"
					className="pds-poi-tip__icon"
					type="button"
				>
					<Icon name="help" size={14} />
				</button>
			</Tooltip>
		</div>
	);
}
