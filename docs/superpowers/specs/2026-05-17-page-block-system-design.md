# Page Block System Design

Date: 2026-05-17

## Purpose

Build a reusable page-block layer for the Pikaboo design system. The layer should
cover general web-template needs such as hero banners, feature sections, proof
blocks, pricing, FAQ, calls to action, sign-up screens, and donation/payment
flows.

The goal is not a generic Tailwind clone. The goal is a suite-aware block system
that can produce credible, polished pages for the real visible brands:
`pikaboo` and `primedia`.

## Brand Model

The public component API should expose customer-facing brand contexts only:

- `brand="pikaboo"`: the Pikaboo suite/product brand. It can be expressive,
  human, dark or light, and more visually memorable while staying serious.
- `brand="primedia"`: the Primedia/Cortexx client and tenant context. It should
  be blue-led, corporate, calm, and operational.

`timbuk2` is internal, legal, infrastructure, or publishing language. It should
not become a page-block visual preset or customer-facing component mode.

## Tone And Scheme

Blocks should separate brand, tone, and color scheme:

- `brand`: `pikaboo` or `primedia`.
- `tone`: `expressive`, `serious`, `product`, or `relief`.
- `scheme`: `light` or `dark`.

Recommended mapping:

- Pikaboo expressive: suite storytelling, website home pages, launches, public
  product reveals.
- Pikaboo serious: trust-heavy public pages, pricing, donation, support, or
  institutional content while retaining Pikaboo personality.
- Primedia product: Cortexx/Optima product-adjacent pages, app explainers,
  support, onboarding, workflow pages.
- Relief: emergency donation/fundraising pages. Default to Pikaboo hosting
  unless the product owner explicitly provides a campaign-specific public brand.

## Color Rules

Blue is the trust signal. Use it for credibility, safety, institutional trust,
and serious product surfaces.

Red is power and urgency. Use it sparingly for urgent donation CTAs, status
labels, and action moments. It should not dominate relief pages.

Green is recovery, progress, and proof. Use muted greens for aid delivered,
impact, positive outcomes, and reassurance. Avoid bright/neon or overly deep
greens.

Purple belongs to Pikaboo contexts. When the visible context is Primedia or
Cortexx and the Pikaboo name is absent, avoid significant purple in heroes,
buttons, glows, cards, or badges. Primedia/Cortexx should resolve shared
components to blue-family tokens.

Relief palette guidance:

- Trust blue: `#2647ed` / existing Primedia blue family.
- Navy text: `#0c2e63`.
- Muted recovery green: approximately `#5f846b`.
- Soft power red: approximately `#9f3a31`.
- Quiet page ground: approximately `#f5f8f6`.

These should become tokenized theme values rather than hard-coded one-offs.

## Block Families

The page-block layer should start with these blocks:

- `PageHero`: hero banner with eyebrow, title, copy, actions, media, trust notes,
  and layout variants.
- `LogoCloud`: client/partner/supporting organization strip.
- `FeatureGrid`: reusable feature cards for product and public pages.
- `FeatureSplit`: text/media feature section.
- `StatsStrip`: metrics and proof.
- `TestimonialBand`: quote/proof section.
- `PricingSection`: plans, comparison cards, highlighted plan.
- `FaqSection`: compact FAQ accordion, optionally using `HelpCenter` data.
- `ContactStrip`: WhatsApp, email, sales, support, and emergency contact actions.
- `FinalCta`: closing conversion section.
- `SignupPanel`: sign-up form wrapper that can use SSO actions where appropriate.
- `DonationPanel`: donation/payment wrapper that composes `PaymentForm`.
- `ReliefImpactSection`: impact cards for urgent fundraising pages.
- `TransparencySection`: how funds are used, receipts, partners, and FAQ proof.

Existing `HelpCenter` and `PaymentForm` work should be reused rather than
duplicated.

## Page Recipes

### Pikaboo Public Expressive

Use for brand-led public pages. This recipe can use dark Pikaboo, expressive
composition, larger media, stronger brand color, and memorable first-view
layouts.

Recommended order:

1. `PageHero`
2. `LogoCloud`
3. `FeatureSplit`
4. `FeatureGrid`
5. `StatsStrip`
6. `TestimonialBand`
7. `FinalCta`
8. `Footer`

### Pikaboo Public Serious

Use for pricing, trust, support, donation, enterprise, or public pages where
Pikaboo needs credibility more than launch energy.

Recommended order:

1. `PageHero`
2. `StatsStrip`
3. `FeatureGrid`
4. `PricingSection` or `ReliefImpactSection`
5. `FaqSection`
6. `ContactStrip`
7. `FinalCta`
8. `Footer`

### Primedia / Cortexx Product

Use for app-adjacent pages, Cortexx product explainers, onboarding, workflow
pages, and support. This should stay blue-led and avoid significant purple.

Recommended order:

1. `PageHero` with compact/product layout
2. `FeatureGrid`
3. `FeatureSplit` or workflow steps
4. `StatsStrip`
5. `FaqSection` or `HelpCenter`
6. `ContactStrip`
7. `Footer`

### Relief Donation

Use for fundraising around flooding or similar urgent public causes. The page
should feel serious, human, trustworthy, and urgent without becoming
exploitative.

Recommended order:

1. `PageHero` with blue trust base, muted green recovery, and small red CTA.
2. `ReliefImpactSection` showing what money funds.
3. `DonationPanel` composing `PaymentForm`.
4. `TransparencySection` for receipts, partners, allocation, and accountability.
5. `FaqSection`.
6. `ContactStrip` with WhatsApp support.
7. `Footer`.

## API Sketch

```tsx
<PageHero
  brand="pikaboo"
  tone="serious"
  scheme="light"
  eyebrow="Urgent relief appeal"
  title="Help families recover after flooding"
  description="Support emergency aid, shelter, food, and recovery work."
  actions={[
    { label: "Donate now", href: "#donate", intent: "urgent" },
    { label: "See impact", href: "#impact", variant: "secondary" },
  ]}
/>
```

```tsx
<DonationPanel
  brand="pikaboo"
  tone="relief"
  paymentFormProps={{
    defaultAmount: 250,
    recurringLabel: "Make this monthly relief support",
  }}
/>
```

```tsx
<ContactStrip
  brand="primedia"
  tone="product"
  actions={[
    { label: "Call us on WhatsApp", href: "https://wa.me/...", icon: "whatsapp" },
  ]}
/>
```

## Accessibility And Content Rules

- Heroes must have one clear heading, readable contrast, and real button/link
  semantics.
- Sign-up and donation panels must use semantic form labels and fieldsets.
- Red should not be the only signal for urgency or errors.
- WhatsApp/contact links need accessible labels and visible descriptions.
- Relief pages must avoid manipulative copy. Lead with practical impact and
  transparent use of funds.
- All blocks must collapse cleanly on mobile without horizontal overflow.

## Storybook Coverage

Add stories for:

- Page Blocks / Pikaboo Expressive
- Page Blocks / Pikaboo Serious
- Page Blocks / Primedia Product
- Page Blocks / Relief Donation
- Page Blocks / Sign Up And Donation Flow
- Page Blocks / Dark And Light Matrix

Stories should use realistic copy and should exercise both light and dark
schemes.

## Testing

Minimum tests:

- Root export test for all new blocks.
- Component tests for semantic rendering and click/submit callbacks.
- Brand token tests ensuring Primedia/Cortexx output does not use significant
  Pikaboo purple classes/tokens.
- Relief recipe test ensuring donation, FAQ, impact, and contact sections can be
  composed.
- Browser visual QA on desktop and mobile Storybook pages, including overflow
  checks.

## Non-Goals

- Do not build a CMS.
- Do not add a payment processor.
- Do not add a public Timbuk2 page style.
- Do not replace the existing app screens inside Optima/Cortexx yet.
- Do not create a full marketing site in the design-system package.

## Implementation Notes

The initial implementation should add a new `page-blocks` component module and
export it through the root entry. Keep the first pass React-only, matching the
current component library surface. After the React implementation is proven in
Storybook and tests, evaluate whether the page-block layer needs
framework-neutral `page-blocks-core` and raw JSX layers like auth/report.

The existing visual companion mockups are stored in `.superpowers/brainstorm/`
for reference only and should not be committed as package source.
