# Page Block System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable page-block component layer for Pikaboo and Primedia, including hero, proof, pricing, FAQ/contact, sign-up, donation, and relief recipes.

**Architecture:** Add a React-first `page-blocks` module under `src/components/`, exported through the root component barrel. Keep page blocks as composable presentational components; `SignupPanel` reuses `AuthAccessScreen`, `DonationPanel` reuses `PaymentForm`, `FaqSection` reuses `Accordion`, and page recipes can include `Footer`. Style via `src/styles.css` using brand/tone/scheme classes so Primedia/Cortexx stays blue-led and Pikaboo can be expressive or serious.

**Tech Stack:** React 19, TypeScript, Storybook, Vitest/jsdom, Biome, Vite package build.

---

## File Structure

- Create `src/components/page-blocks.tsx`: all page-block React components, shared types, and page recipe components.
- Create `src/components/page-blocks.test.tsx`: rendering, callback, composition, and brand-isolation tests.
- Create `src/stories/page-blocks.stories.tsx`: Storybook coverage for expressive, serious, Primedia product, relief donation, sign-up/donation, and dark/light matrix.
- Modify `src/components/index.ts`: export the new module.
- Modify `src/package-entrypoints.test.ts`: assert root exports include the new blocks.
- Modify `src/styles.css`: add page-block layout, tone, scheme, relief palette, responsive behavior.
- Modify `README.md`: add page-block inventory and brand rules.
- Modify `.gitignore`: ignore `.superpowers/` visual brainstorming artifacts.

## Task 1: Ignore Visual Companion Artifacts

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

```gitignore
node_modules/
dist/
storybook-static/
.superpowers/
.DS_Store
```

- [ ] **Step 2: Verify visual mockups are ignored**

Run: `git status --short --ignored | rg "\.superpowers|\.gitignore"`

Expected: `.superpowers/` appears only as ignored output, and `.gitignore` is modified.

## Task 2: Write Page-Block Tests First

**Files:**
- Create: `src/components/page-blocks.test.tsx`

- [ ] **Step 1: Add failing tests for the public API**

```tsx
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	ContactStrip,
	DonationPanel,
	FaqSection,
	FeatureGrid,
	FinalCta,
	PageHero,
	PageTemplate,
	PricingSection,
	ReliefImpactSection,
	SignupPanel,
	StatsStrip,
	TransparencySection,
} from './index';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: Root[] = [];
const mountedContainers: HTMLElement[] = [];

const render = (ui: ReactNode) => {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);
	mountedRoots.push(root);
	mountedContainers.push(container);
	act(() => root.render(ui));
	return container;
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) act(() => root.unmount());
	for (const container of mountedContainers.splice(0)) container.remove();
});

describe('page blocks', () => {
	it('renders a themed hero with semantic actions', () => {
		const container = render(
			<PageHero
				brand="pikaboo"
				tone="relief"
				scheme="light"
				eyebrow="Urgent relief appeal"
				title="Help families recover after flooding"
				description="Support shelter, food, and recovery work."
				actions={[
					{ href: '#donate', intent: 'urgent', label: 'Donate now' },
					{ href: '#impact', label: 'See impact', variant: 'secondary' },
				]}
				media={<div data-testid="relief-media">Relief image</div>}
			/>,
		);

		expect(container.querySelector('section')?.className).toContain('pds-page-blocks--brand-pikaboo');
		expect(container.querySelector('section')?.className).toContain('pds-page-blocks--tone-relief');
		expect(container.querySelector('h1')?.textContent).toBe('Help families recover after flooding');
		expect(container.querySelector('a[href="#donate"]')?.textContent).toContain('Donate now');
		expect(container.textContent).toContain('Relief image');
	});

	it('composes relief donation content from impact, donation, FAQ, and contact sections', () => {
		const submissions: unknown[] = [];
		const container = render(
			<PageTemplate brand="pikaboo" tone="relief" scheme="light">
				<ReliefImpactSection
					items={[
						{ description: 'Emergency meals and water', label: 'Food and water', value: '24h' },
						{ description: 'Temporary safe places to sleep', label: 'Shelter', value: 'R500' },
					]}
				/>
				<DonationPanel
					paymentFormProps={{
						amountOptions: [{ label: 'R250', value: 250 }],
						onSubmit: (values) => submissions.push(values),
						showMessage: false,
					}}
				/>
				<FaqSection
					faqs={[{ answer: 'Funds are allocated to verified relief partners.', id: 'funds', question: 'Where does the money go?' }]}
				/>
				<ContactStrip actions={[{ href: 'https://wa.me/27100000000', icon: 'whatsapp', label: 'Call us on WhatsApp' }]} />
			</PageTemplate>,
		);

		expect(container.textContent).toContain('Food and water');
		expect(container.textContent).toContain('R250');
		expect(container.textContent).toContain('Where does the money go?');
		expect(container.textContent).toContain('Call us on WhatsApp');
		act(() => (container.querySelector('button[type="submit"]') as HTMLButtonElement).click());
		expect(submissions).toHaveLength(1);
	});

	it('keeps Primedia/Cortexx blocks blue-led without Pikaboo brand classes', () => {
		const container = render(
			<PageHero
				brand="primedia"
				tone="product"
				scheme="light"
				title="Plan campaigns with Cortexx"
				description="Operational planning for serious media teams."
			/>,
		);

		const className = container.querySelector('section')?.className ?? '';
		expect(className).toContain('pds-page-blocks--brand-primedia');
		expect(className).not.toContain('brand-pikaboo');
		expect(container.textContent).toContain('Plan campaigns with Cortexx');
	});

	it('renders sign-up, pricing, proof, transparency, and CTA blocks', () => {
		const container = render(
			<PageTemplate brand="pikaboo" tone="serious" scheme="dark">
				<StatsStrip items={[{ label: 'Raised', value: 'R124k' }]} />
				<FeatureGrid items={[{ description: 'Trusted partner reporting', icon: 'check', title: 'Transparent' }]} />
				<PricingSection plans={[{ ctaLabel: 'Start', features: ['Receipts'], name: 'Supporter', price: 'R250' }]} />
				<TransparencySection items={[{ description: 'Allocation and receipts are published weekly.', title: 'Receipts' }]} />
				<SignupPanel authProps={{ showModeSwitch: false, title: undefined }} title="Create an account" />
				<FinalCta actions={[{ href: '#donate', intent: 'urgent', label: 'Donate now' }]} title="Ready to help?" />
			</PageTemplate>,
		);

		expect(container.textContent).toContain('R124k');
		expect(container.textContent).toContain('Transparent');
		expect(container.textContent).toContain('Supporter');
		expect(container.textContent).toContain('Receipts');
		expect(container.textContent).toContain('Create an account');
		expect(container.textContent).toContain('Ready to help?');
	});
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- src/components/page-blocks.test.tsx`

Expected: FAIL because `PageHero`, `PageTemplate`, and related exports do not exist.

## Task 3: Implement React Page Blocks

**Files:**
- Create: `src/components/page-blocks.tsx`

- [ ] **Step 1: Add types and class helpers**

```tsx
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/class-names';
import { AuthAccessScreen, type AuthAccessScreenProps } from './auth';
import { Badge } from './badge';
import { Button } from './button';
import { Accordion } from './disclosure';
import { Footer, type FooterProps } from './footer';
import { Icon, isPdsIconName, type PdsIconName } from './icons';
import { PaymentForm, type PaymentFormProps } from './payment';

export type PageBlockBrand = 'pikaboo' | 'primedia';
export type PageBlockTone = 'expressive' | 'product' | 'relief' | 'serious';
export type PageBlockScheme = 'dark' | 'light';

export interface PageBlockThemeProps {
	brand?: PageBlockBrand;
	scheme?: PageBlockScheme;
	tone?: PageBlockTone;
}

const themeClassNames = ({ brand = 'pikaboo', scheme = 'light', tone = 'serious' }: PageBlockThemeProps) => [
	'pds-page-blocks',
	`pds-page-blocks--brand-${brand}`,
	`pds-page-blocks--scheme-${scheme}`,
	`pds-page-blocks--tone-${tone}`,
];

const renderBlockIcon = (icon: PdsIconName | ReactNode | undefined) => {
	if (!icon) return null;
	return isPdsIconName(icon) ? <Icon name={icon} size={20} /> : icon;
};
```

- [ ] **Step 2: Implement layout, hero, and content blocks**

Use the code shape below in `src/components/page-blocks.tsx`. Keep prop names exactly as shown so tests and stories match.

```tsx
export interface PageTemplateProps extends HTMLAttributes<HTMLDivElement>, PageBlockThemeProps {
	footer?: FooterProps | ReactNode;
}

export function PageTemplate({ brand = 'pikaboo', children, className, footer, scheme = 'light', tone = 'serious', ...props }: PageTemplateProps) {
	const footerNode =
		footer === undefined ? null : footer && typeof footer === 'object' && !('type' in footer) ? <Footer {...(footer as FooterProps)} /> : footer;
	return (
		<div className={cx(...themeClassNames({ brand, scheme, tone }), 'pds-page-template', className)} {...props}>
			{children}
			{footerNode}
		</div>
	);
}

export interface PageBlockAction extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
	icon?: PdsIconName | ReactNode;
	intent?: 'default' | 'urgent';
	label: ReactNode;
	variant?: 'primary' | 'secondary' | 'text';
}

function PageAction({ action }: { action: PageBlockAction }) {
	const { className, icon, intent = 'default', label, variant = 'primary', ...props } = action;
	return (
		<a className={cx('pds-page-action', `pds-page-action--${variant}`, `pds-page-action--${intent}`, className)} {...props}>
			{renderBlockIcon(icon)}
			<span>{label}</span>
		</a>
	);
}

export interface PageHeroProps extends HTMLAttributes<HTMLElement>, PageBlockThemeProps {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	eyebrow?: ReactNode;
	media?: ReactNode;
	title: ReactNode;
	trustNote?: ReactNode;
}

export function PageHero({ actions = [], brand = 'pikaboo', className, description, eyebrow, media, scheme = 'light', title, tone = 'serious', trustNote, ...props }: PageHeroProps) {
	return (
		<section className={cx(...themeClassNames({ brand, scheme, tone }), 'pds-page-hero', className)} {...props}>
			<div className="pds-page-hero__copy">
				{eyebrow ? <p className="pds-page-hero__eyebrow">{eyebrow}</p> : null}
				<h1>{title}</h1>
				{description ? <p className="pds-page-hero__description">{description}</p> : null}
				{actions.length ? <div className="pds-page-hero__actions">{actions.map((action, index) => <PageAction action={action} key={index} />)}</div> : null}
				{trustNote ? <p className="pds-page-hero__trust">{trustNote}</p> : null}
			</div>
			{media ? <div className="pds-page-hero__media">{media}</div> : <div aria-hidden="true" className="pds-page-hero__media pds-page-hero__media--generated" />}
		</section>
	);
}
```

- [ ] **Step 3: Implement the remaining component contracts**

Implement these exact exports in `src/components/page-blocks.tsx`:

```tsx
export interface LogoCloudProps extends HTMLAttributes<HTMLElement> {
	items: readonly ReactNode[];
	title?: ReactNode;
}

export interface PageFeatureItem {
	description?: ReactNode;
	icon?: PdsIconName | ReactNode;
	title: ReactNode;
}

export interface FeatureGridProps extends HTMLAttributes<HTMLElement> {
	description?: ReactNode;
	items: readonly PageFeatureItem[];
	title?: ReactNode;
}

export interface FeatureSplitProps extends HTMLAttributes<HTMLElement> {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	eyebrow?: ReactNode;
	media?: ReactNode;
	reverse?: boolean;
	title: ReactNode;
}

export interface PageStatItem {
	label: ReactNode;
	value: ReactNode;
}

export interface StatsStripProps extends HTMLAttributes<HTMLElement> {
	items: readonly PageStatItem[];
}

export interface TestimonialBandProps extends HTMLAttributes<HTMLElement> {
	attribution?: ReactNode;
	quote: ReactNode;
}

export interface PricingPlan {
	ctaLabel?: ReactNode;
	features?: readonly ReactNode[];
	highlighted?: boolean;
	name: ReactNode;
	price: ReactNode;
}

export interface PricingSectionProps extends HTMLAttributes<HTMLElement> {
	plans: readonly PricingPlan[];
	title?: ReactNode;
}

export interface FaqSectionItem {
	answer: ReactNode;
	id: string;
	question: ReactNode;
}

export interface FaqSectionProps extends HTMLAttributes<HTMLElement> {
	faqs: readonly FaqSectionItem[];
	title?: ReactNode;
}

export interface ContactStripProps extends HTMLAttributes<HTMLElement> {
	actions: readonly PageBlockAction[];
	description?: ReactNode;
	title?: ReactNode;
}

export interface FinalCtaProps extends HTMLAttributes<HTMLElement> {
	actions?: readonly PageBlockAction[];
	description?: ReactNode;
	title: ReactNode;
}

export interface SignupPanelProps extends HTMLAttributes<HTMLElement> {
	authProps?: Partial<AuthAccessScreenProps>;
	description?: ReactNode;
	title?: ReactNode;
}

export interface DonationPanelProps extends HTMLAttributes<HTMLElement> {
	description?: ReactNode;
	paymentFormProps?: Partial<PaymentFormProps>;
	title?: ReactNode;
}

export interface ReliefImpactItem {
	description: ReactNode;
	label: ReactNode;
	value: ReactNode;
}

export interface ReliefImpactSectionProps extends HTMLAttributes<HTMLElement> {
	items: readonly ReliefImpactItem[];
	title?: ReactNode;
}

export interface TransparencyItem {
	description: ReactNode;
	title: ReactNode;
}

export interface TransparencySectionProps extends HTMLAttributes<HTMLElement> {
	items: readonly TransparencyItem[];
	title?: ReactNode;
}
```

Rendering rules:

- `LogoCloud` renders a `<section>` with optional heading and an unordered list.
- `FeatureGrid`, `ReliefImpactSection`, `TransparencySection`, and `PricingSection` render sections with list markup; repeated items are `<li>`.
- `FeatureSplit`, `ContactStrip`, and `FinalCta` use `PageAction` for links.
- `FaqSection` converts `faqs` into `Accordion` items and opens the first FAQ by default.
- `SignupPanel` renders a section with an optional title/description and an `AuthAccessScreen` configured with `defaultMode="signup"`.
- `DonationPanel` renders a section with an optional title/description and a `PaymentForm`, defaulting `showMessage` to `false` only when `paymentFormProps.showMessage` is explicitly `false`.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- src/components/page-blocks.test.tsx`

Expected: PASS.

## Task 4: Export And Document Page Blocks

**Files:**
- Modify: `src/components/index.ts`
- Modify: `src/package-entrypoints.test.ts`
- Modify: `README.md`

- [ ] **Step 1: Export page blocks**

Add to `src/components/index.ts`:

```ts
export * from './page-blocks';
```

- [ ] **Step 2: Add package entrypoint assertions**

Add root import in `src/package-entrypoints.test.ts`:

```ts
import { PageHero, PageTemplate, DonationPanel, SignupPanel } from '.';
```

Add test:

```ts
it('exports page block components through the root entry', () => {
	expect(PageTemplate).toBeTypeOf('function');
	expect(PageHero).toBeTypeOf('function');
	expect(DonationPanel).toBeTypeOf('function');
	expect(SignupPanel).toBeTypeOf('function');
});
```

- [ ] **Step 3: Document inventory and brand rules**

Add to README Component Inventory:

```md
- Page blocks: `PageTemplate`, `PageHero`, `LogoCloud`, `FeatureGrid`,
  `FeatureSplit`, `StatsStrip`, `TestimonialBand`, `PricingSection`,
  `FaqSection`, `ContactStrip`, `FinalCta`, `SignupPanel`, `DonationPanel`,
  `ReliefImpactSection`, `TransparencySection`.
```

Add a short brand rule paragraph near Theme Model:

```md
Page-block presets are customer-facing only: `pikaboo` and `primedia`. `timbuk2`
is internal/corporate metadata and should not be used as a page-block visual
theme. Primedia/Cortexx page blocks are blue-led and avoid significant Pikaboo
purple.
```

- [ ] **Step 4: Run entrypoint tests**

Run: `npm test -- src/package-entrypoints.test.ts src/components/page-blocks.test.tsx`

Expected: PASS.

## Task 5: Add Styles

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add page-block base and brand/tone/scheme classes**

Create styles for these selectors:

- `.pds-page-template`
- `.pds-page-blocks--brand-pikaboo`
- `.pds-page-blocks--brand-primedia`
- `.pds-page-blocks--tone-expressive`
- `.pds-page-blocks--tone-serious`
- `.pds-page-blocks--tone-product`
- `.pds-page-blocks--tone-relief`
- `.pds-page-blocks--scheme-light`
- `.pds-page-blocks--scheme-dark`

Use tokenized CSS variables:

```css
.pds-page-blocks {
	--pds-page-accent: var(--theme-primary);
	--pds-page-accent-strong: var(--theme-primary-hover);
	--pds-page-trust: #2647ed;
	--pds-page-recovery: #5f846b;
	--pds-page-urgent: #9f3a31;
	--pds-page-ground: var(--theme-page-bg);
	color: var(--theme-foreground);
}
```

- [ ] **Step 2: Add component styles**

Add styles for hero, actions, grids, pricing, FAQ/contact, signup/donation panels, relief impact, transparency, and responsive mobile collapse. Ensure `.pds-page-blocks--brand-primedia` does not assign purple values to primary visible page-block variables.

- [ ] **Step 3: Run lint**

Run: `npm run check`

Expected: PASS.

## Task 6: Add Storybook Recipes

**Files:**
- Create: `src/stories/page-blocks.stories.tsx`

- [ ] **Step 1: Add six stories**

Stories:

- `PikabooExpressive`
- `PikabooSerious`
- `PrimediaProduct`
- `ReliefDonation`
- `SignupAndDonationFlow`
- `DarkAndLightMatrix`

Use realistic copy. Compose `DonationPanel` with `PaymentForm`; compose `FaqSection` and `ContactStrip` with WhatsApp support.

- [ ] **Step 2: Build Storybook**

Run: `npm run build-storybook`

Expected: Storybook build completes successfully.

## Task 7: Full Verification And Browser QA

**Files:**
- No new files unless fixes are required.

- [ ] **Step 1: Run package gate**

Run: `npm run build:package`

Expected: type-check, Biome, tests, and Vite build all pass.

- [ ] **Step 2: Run pack check**

Run: `npm run pack:check`

Expected: tarball includes `dist/src/components/page-blocks.d.ts` and updated CSS.

- [ ] **Step 3: Run browser QA**

Serve Storybook static:

```bash
python3 -m http.server 2052 --bind 127.0.0.1 --directory storybook-static
```

Open at least:

- `http://127.0.0.1:2052/iframe.html?id=page-blocks-page-blocks--relief-donation&viewMode=story`
- `http://127.0.0.1:2052/iframe.html?id=page-blocks-page-blocks--primedia-product&viewMode=story`

Use desktop and mobile widths. Check:

- required text is present;
- no non-hidden horizontal overflow;
- Primedia story reads blue-led;
- relief story uses blue base, muted green proof, restrained red CTA;
- browser console has no new runtime errors except missing favicon from static server.

## Task 8: Commit Implementation

**Files:**
- Stage all source, docs, tests, and README changes.
- Do not stage `.superpowers/`.

- [ ] **Step 1: Review status**

Run: `git status --short`

Expected: `.superpowers/` is ignored, source/doc/test changes are visible.

- [ ] **Step 2: Commit**

```bash
git add .gitignore README.md src/components/index.ts src/components/page-blocks.tsx src/components/page-blocks.test.tsx src/package-entrypoints.test.ts src/stories/page-blocks.stories.tsx src/styles.css
git commit -m "feat: add page block system"
```

Expected: commit succeeds.
