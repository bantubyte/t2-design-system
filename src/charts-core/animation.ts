export const prefersReducedMotion = (): boolean => {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return true;
	}
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getChartAnimationProps = (
	enabled = true,
): {
	animationDuration: number;
	isAnimationActive: boolean;
} => {
	const isAnimationActive = enabled && !prefersReducedMotion();
	return {
		animationDuration: isAnimationActive ? 480 : 0,
		isAnimationActive,
	};
};
