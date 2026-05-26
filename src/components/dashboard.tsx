import type { HTMLAttributes } from 'react';
import { cx } from '../utils/class-names';
import { Card, CardContent } from './card';
import { Skeleton } from './feedback';

// ---------------------------------------------------------------------------
// Campaign dashboard skeleton / loading components
// ---------------------------------------------------------------------------

// -- Metric cards ------------------------------------------------------------

export interface DashboardMetricCardsSkeletonProps
	extends HTMLAttributes<HTMLDivElement> {
	showTotalPopulation?: boolean;
}

export function DashboardMetricCardsSkeleton({
	className,
	showTotalPopulation = false,
	...props
}: DashboardMetricCardsSkeletonProps) {
	const count = showTotalPopulation ? 7 : 6;
	return (
		<div
			className={cx(
				'grid grid-cols-2 gap-2 md:grid-cols-3',
				showTotalPopulation ? 'lg:grid-cols-7' : 'lg:grid-cols-6',
				className,
			)}
			{...props}
		>
			{Array.from({ length: count }, (_, i) => (
				<Card
					className="relative overflow-hidden rounded-2xl border border-pikaboo-purple/10"
					key={i}
				>
					{/* Shimmer top border */}
					<Skeleton
						className="absolute left-0 right-0 top-0"
						height={3}
						radius="sm"
						width="100%"
					/>
					<CardContent className="p-2.5 pt-3">
						<div className="flex flex-col space-y-2">
							<div className="flex items-center justify-between">
								<Skeleton height="0.625rem" width="3rem" />
								<Skeleton height="1.25rem" radius="sm" width="1.25rem" />
							</div>
							<Skeleton height="1.5rem" width="4rem" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

// -- Placements card ---------------------------------------------------------

export function DashboardPlacementsCardSkeleton({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx(
				'flex h-full flex-col overflow-hidden rounded-2xl bg-pikaboo-pearl shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
				className,
			)}
			{...props}
		>
			{/* Header */}
			<div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-[#121212]/[0.04] px-4 py-2.5">
				<div className="flex min-w-0 items-center gap-2">
					<Skeleton height="1rem" width="2.5rem" />
					<div className="rounded-md bg-slate-100 px-2 py-0.5">
						<Skeleton height="0.75rem" width="3rem" />
					</div>
					<div className="rounded-md bg-pikaboo-purple/10 px-2 py-0.5">
						<Skeleton height="0.75rem" width="4rem" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Skeleton
						height="2rem"
						radius="lg"
						style={{
							border: '1px solid rgba(94,80,228,0.2)',
							background: '#fff',
						}}
						width="6rem"
					/>
					<Skeleton
						className="bg-pikaboo-purple/20"
						height="2rem"
						radius="lg"
						width="7rem"
					/>
				</div>
			</div>

			{/* Grid */}
			<div className="min-h-0 flex-1 overflow-hidden p-4">
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }, (_, i) => (
						<div
							className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
							key={i}
						>
							<div className="relative">
								<Skeleton
									className="w-full"
									radius="sm"
									style={{ aspectRatio: '4/3' }}
								/>
								<Skeleton
									className="absolute left-2.5 top-2.5"
									height="1rem"
									radius="full"
									width="4rem"
								/>
								<Skeleton
									className="absolute bottom-2 right-2"
									height="1.5rem"
									radius="sm"
									width="3.5rem"
								/>
							</div>
							<div className="space-y-3 px-3.5 pb-2.5 pt-3">
								<div className="space-y-1.5">
									<Skeleton height="1rem" width="80%" />
									<Skeleton height="0.75rem" width="50%" />
								</div>
								<div className="flex items-center justify-between">
									<Skeleton
										className="bg-pikaboo-purple/15"
										height="1.75rem"
										width="3.5rem"
									/>
									<Skeleton height="1.5rem" radius="full" width="5rem" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// -- Insights panel ----------------------------------------------------------

export function DashboardInsightsPanelSkeleton({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx(
				'flex h-full flex-col overflow-hidden rounded-2xl border border-pikaboo-purple/10 bg-white',
				className,
			)}
			{...props}
		>
			{/* Tabs */}
			<div className="flex flex-shrink-0 items-center gap-1 border-b border-pikaboo-purple/10 px-4 py-3">
				{['Insights', 'Map', 'Add Sites', 'Brief'].map((tab, i) => (
					<div
						className={cx(
							'flex h-9 items-center rounded-lg px-4',
							i === 0 ? 'bg-pikaboo-purple/10' : 'bg-slate-100',
						)}
						key={tab}
					>
						<span
							className={cx(
								'text-sm font-medium',
								i === 0 ? 'text-pikaboo-purple/50' : 'text-slate-400',
							)}
						>
							{tab}
						</span>
					</div>
				))}
			</div>

			{/* Content */}
			<div className="flex-1 space-y-5 overflow-auto p-4">
				{/* AI card */}
				<div className="space-y-3 rounded-xl bg-gradient-to-br from-pikaboo-purple/5 to-pikaboo-purple/10 p-4">
					<div className="flex items-center gap-2">
						<Skeleton height="1.25rem" radius="sm" width="1.25rem" />
						<Skeleton height="1.25rem" width="6rem" />
					</div>
					<div className="space-y-2">
						<Skeleton height="0.75rem" width="100%" />
						<Skeleton height="0.75rem" width="80%" />
						<Skeleton height="0.75rem" width="75%" />
					</div>
				</div>

				{/* Demographics */}
				<div className="space-y-3">
					<Skeleton height="1.25rem" width="7rem" />
					<div className="grid grid-cols-3 gap-3">
						{['Gender', 'Age', 'Income'].map((label) => (
							<div className="space-y-2 rounded-xl bg-slate-50 p-3" key={label}>
								<Skeleton height="5rem" radius="sm" width="100%" />
								<Skeleton className="mx-auto" height="0.75rem" width="3rem" />
							</div>
						))}
					</div>
				</div>

				{/* Channel mix */}
				<div className="space-y-3">
					<Skeleton height="1.25rem" width="6rem" />
					<div className="rounded-xl bg-slate-50 p-4">
						<Skeleton height="7rem" radius="sm" width="100%" />
					</div>
				</div>

				{/* Map */}
				<div className="space-y-3">
					<Skeleton height="1.25rem" width="4rem" />
					<div className="relative overflow-hidden rounded-xl">
						<Skeleton height="10rem" radius="sm" width="100%" />
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex gap-8">
								{Array.from({ length: 3 }, (_, i) => (
									<Skeleton
										height="1.5rem"
										key={i}
										radius="full"
										width="1.5rem"
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// -- Company selector --------------------------------------------------------

export function DashboardCompanySelectorSkeleton({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx('relative h-10 w-56 overflow-hidden', className)}
			{...props}
		>
			<div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-slate-300" />
			<div className="flex items-center gap-2 rounded-r-lg bg-slate-100/80 py-1.5 pl-3">
				<Skeleton height="1.75rem" radius="full" width="1.75rem" />
				<div className="space-y-1.5">
					<Skeleton height="0.5rem" width="3.5rem" />
					<Skeleton height="1rem" width="7rem" />
				</div>
			</div>
		</div>
	);
}

// -- Top filter bar ----------------------------------------------------------

export function DashboardTopFilterBarSkeleton({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx('relative w-full', className)}
			style={{ backgroundColor: 'var(--theme-brand-surface)' }}
			{...props}
		>
			<div
				className="absolute inset-0"
				style={{
					background:
						'linear-gradient(180deg, var(--theme-brand-surface) 0%, rgb(var(--theme-primary-rgb) / 0.04) 50%, rgb(var(--theme-primary-rgb) / 0.06) 100%)',
					borderBottom: '1px solid rgb(var(--theme-primary-rgb) / 0.12)',
				}}
			/>
			<div
				className="absolute left-0 right-0 top-0 h-[3px]"
				style={{
					background:
						'linear-gradient(90deg, transparent 5%, rgb(var(--theme-primary-rgb) / 0.2) 25%, rgb(var(--theme-primary-rgb) / 0.3) 50%, rgb(var(--theme-primary-rgb) / 0.2) 75%, transparent 95%)',
				}}
			/>

			<div className="relative px-6 py-3">
				<div className="flex items-center gap-3">
					<div
						className="flex items-center gap-1.5 rounded-full border-2 border-pikaboo-purple/20 bg-white p-1.5"
						style={{
							boxShadow:
								'0 8px 30px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
						}}
					>
						{/* Campaign selector pill */}
						<div className="flex h-10 min-w-[160px] items-center gap-2 rounded-full border border-pikaboo-purple/15 bg-pikaboo-purple/5 px-4">
							<Skeleton height="1rem" radius="sm" width="1rem" />
							<span className="text-[13px] font-medium text-pikaboo-purple/40">
								Select Campaign
							</span>
						</div>

						<div className="h-6 w-px bg-slate-200/60" />

						{/* Status pill */}
						<div className="flex h-10 items-center gap-2 rounded-full border border-[#121212]/10 bg-[#121212]/5 px-4">
							<Skeleton height="0.5rem" radius="full" width="0.5rem" />
							<Skeleton height="0.75rem" width="2.5rem" />
						</div>

						<div className="h-6 w-px bg-slate-200/60" />

						{/* Budget pill */}
						<div className="flex h-10 items-center gap-2 rounded-full border border-pikaboo-purple/15 bg-pikaboo-purple/5 px-4">
							<Skeleton height="1rem" radius="sm" width="1rem" />
							<span className="text-[13px] font-medium text-pikaboo-purple/40">
								No Budget Limit
							</span>
						</div>

						<div className="h-6 w-px bg-slate-200/60" />

						{/* Location pill */}
						<div className="flex h-10 items-center gap-2 rounded-full border border-pikaboo-purple/15 bg-pikaboo-purple/5 px-4">
							<Skeleton height="1rem" radius="sm" width="1rem" />
							<span className="text-[13px] font-medium text-pikaboo-purple/40">
								Location
							</span>
						</div>

						<div className="h-6 w-px bg-slate-200/60" />

						{/* Date pill */}
						<div className="flex h-10 items-center gap-2 rounded-full border border-pikaboo-purple/15 bg-pikaboo-purple/5 px-4">
							<Skeleton height="1rem" radius="sm" width="1rem" />
							<span className="text-[13px] font-medium text-pikaboo-purple/40">
								Date
							</span>
						</div>

						<div className="h-6 w-px bg-slate-200/60" />

						{/* More filters pill */}
						<div className="flex h-10 cursor-not-allowed items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-4 opacity-55">
							<Skeleton height="1rem" radius="sm" width="1rem" />
							<span className="text-[13px] font-medium text-[#121212]/40">
								More Filters
							</span>
						</div>
					</div>

					<div className="ml-auto hidden items-center gap-2 xl:flex">
						<Skeleton
							height="2rem"
							radius="full"
							style={{
								border: '1px solid rgba(94,80,228,0.2)',
								background: '#fff',
							}}
							width="8rem"
						/>
						<Skeleton
							className="bg-pikaboo-purple/15"
							height="2.25rem"
							radius="full"
							width="6rem"
						/>
						<Skeleton
							className="bg-pikaboo-purple/20"
							height="2.25rem"
							radius="full"
							width="8rem"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// -- Full dashboard page loading ---------------------------------------------

export function DashboardPageLoading({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cx(
				'flex h-full min-h-screen flex-col overflow-hidden',
				className,
			)}
			style={{ backgroundColor: 'var(--theme-brand-surface)' }}
			{...props}
		>
			{/* Company selector hero */}
			<div
				className="flex-shrink-0 border-b border-pikaboo-purple/10 px-6 py-2.5"
				style={{ backgroundColor: 'var(--theme-brand-surface)' }}
			>
				<DashboardCompanySelectorSkeleton />
			</div>

			{/* Filter bar */}
			<div className="flex-shrink-0">
				<DashboardTopFilterBarSkeleton />
			</div>

			{/* Sub-nav + campaign card */}
			<div className="space-y-2 pb-4 pt-0.5">
				<div className="border-b border-pikaboo-purple/10 px-6 py-1.5">
					<div className="flex flex-wrap items-center gap-2">
						{(['w-24', 'w-28', 'w-20', 'w-32'] as const).map((w, i) => (
							<Skeleton
								className={cx('rounded-full', w)}
								height="1.75rem"
								key={i}
							/>
						))}
					</div>
				</div>

				<div className="mx-6 mb-2 mt-2 rounded-2xl border border-pikaboo-purple/20 bg-gradient-to-r from-pikaboo-purple/5 via-pikaboo-purple/10 to-pikaboo-purple/5 p-4 shadow-pikaboo-card">
					<div className="flex items-center gap-3">
						<Skeleton
							className="bg-pikaboo-purple/20"
							height="2.25rem"
							radius="full"
							width="2.25rem"
						/>
						<div className="space-y-1.5">
							<Skeleton
								className="bg-pikaboo-purple/25"
								height="1rem"
								width="9rem"
							/>
							<Skeleton
								className="bg-pikaboo-purple/20"
								height="0.75rem"
								width="14rem"
							/>
						</div>
						<div className="ml-auto flex items-center gap-1">
							{Array.from({ length: 3 }, (_, i) => (
								<Skeleton
									className="bg-pikaboo-purple/40"
									height="0.5rem"
									key={i}
									radius="full"
									width="0.5rem"
								/>
							))}
						</div>
					</div>
					<div className="mt-3 h-1 overflow-hidden rounded-full bg-pikaboo-purple/20">
						<Skeleton
							className="bg-pikaboo-purple/35"
							height="100%"
							width="50%"
						/>
					</div>
				</div>
			</div>

			{/* Main grid */}
			<div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[60%_40%]">
				{/* Left: metrics + placements */}
				<div className="flex h-full flex-col gap-3 overflow-hidden px-6">
					<div className="flex-shrink-0">
						<DashboardMetricCardsSkeleton showTotalPopulation />
					</div>
					<div className="min-h-0 flex-1 rounded-2xl border border-pikaboo-purple/10 bg-pikaboo-pearl shadow-pikaboo-card">
						<DashboardPlacementsCardSkeleton />
					</div>
				</div>

				{/* Right: insights panel */}
				<div className="hidden h-full min-h-0 flex-col pr-6 pt-1 lg:flex">
					<DashboardInsightsPanelSkeleton />
				</div>
			</div>
		</div>
	);
}

// -- Campaigns list page loading ---------------------------------------------

export function CampaignsListPageLoading({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cx('min-h-screen bg-pikaboo-pearl', className)} {...props}>
			<header className="border-b border-gray-100 bg-white">
				<div className="px-6 py-6 lg:px-8">
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-2">
							<Skeleton height="2rem" width="10rem" />
							<Skeleton height="1rem" width="18rem" />
						</div>
						<Skeleton
							className="bg-pikaboo-purple/20"
							height="3rem"
							radius="sm"
							width="13rem"
						/>
					</div>

					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex h-12 max-w-2xl flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4">
							<Skeleton height="1.25rem" radius="sm" width="1.25rem" />
							<Skeleton height="1rem" width="13rem" />
						</div>
						<div className="flex items-center gap-3">
							<Skeleton
								height="3rem"
								radius="sm"
								style={{ border: '1px solid #e5e7eb', background: '#fff' }}
								width="8rem"
							/>
							<Skeleton
								height="3rem"
								radius="sm"
								style={{ border: '1px solid #e5e7eb', background: '#fff' }}
								width="8.75rem"
							/>
							<Skeleton
								height="3rem"
								radius="sm"
								style={{ border: '1px solid #e5e7eb', background: '#fff' }}
								width="3rem"
							/>
						</div>
					</div>
				</div>
			</header>

			<main className="px-6 py-8 lg:px-8">
				{/* Stats row */}
				<div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
					{Array.from({ length: 4 }, (_, i) => (
						<div
							className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-pikaboo-sm"
							key={i}
						>
							<Skeleton height="3rem" radius="sm" width="3rem" />
							<div className="space-y-2">
								<Skeleton height="1.75rem" width="2.5rem" />
								<Skeleton height="1rem" width="6rem" />
							</div>
						</div>
					))}
				</div>

				<div className="mb-6 flex items-center justify-between">
					<Skeleton height="1rem" width="14rem" />
				</div>

				{/* Campaign cards */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 6 }, (_, i) => (
						<article
							className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-pikaboo-sm"
							key={i}
						>
							<Skeleton height={4} width="100%" />

							<div className="p-6">
								<div className="mb-4 flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1 space-y-2">
										<Skeleton height="1.5rem" width="75%" />
										<Skeleton height="1rem" width="50%" />
									</div>
									<Skeleton height="1.75rem" radius="full" width="5rem" />
								</div>

								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Skeleton height="1rem" radius="sm" width="1rem" />
										<Skeleton height="1rem" width="9rem" />
										<Skeleton height="1rem" width="3rem" />
									</div>

									{i % 2 === 0 && (
										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<Skeleton height="0.75rem" width="5rem" />
												<Skeleton height="0.75rem" width="4rem" />
											</div>
											<Skeleton height="0.375rem" radius="full" width="100%" />
										</div>
									)}
								</div>

								<div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
									<Skeleton
										className="bg-pikaboo-purple/20"
										height="2.25rem"
										radius="sm"
										width="8rem"
									/>
									<Skeleton height="2.25rem" radius="sm" width="2.25rem" />
								</div>
							</div>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}
