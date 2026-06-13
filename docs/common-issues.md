# Common Design Issues

## Accessibility Violations

### 1. Nested Interactive Elements (`nested-interactive`)
The `SiteNav` component in `navigation.tsx` uses a hamburger button that contains interactive link elements within the mobile menu sheet. This triggers the axe `nested-interactive` rule.

**Workaround**: Disabled globally in `.storybook/preview.tsx`:
```ts
config: { rules: [{ id: 'nested-interactive', enabled: false }] },
```
**Tracking**: Needs a refactor to separate the trigger button from the menu content.

---

## Contrast / Color Issues

These are design-token issues tracked in TODO comments across story files. Each fails WCAG AA (4.5:1 for normal text, 3:1 for large text).

### 2. Footer Copyright Text (`mega` variant)
`.pds-footer-mega__copyright` has insufficient contrast (dim grey on dim grey background).

**File**: `src/components/footer.stories.tsx:128`  
**Tracking**: Design-token issue — copyright text colour needs raising.

### 3. Brand Lockup Subtitle Text
`.pds-brand-lockup__meta` has ~1.8:1 contrast on slate/violet-ink surfaces (needs 4.5:1).

**File**: `src/components/brand.stories.tsx:92`  
**Tracking**: Design-token issue — darken meta text under dark surfaces.

### 4. Mobile Menu Description Text
`.pds-mobile-menu-sheet__row-description` has insufficient contrast under the dark sheet.

**File**: `src/components/navigation.stories.tsx:143`  
**Tracking**: Design-token issue.

### 5. Logo Cloud Text
Logo strip uses muted grey on cream (~2.5:1).

**File**: `src/components/page-blocks.stories.tsx:35`  
**Tracking**: Design-token issue.

### 6. Signup Panel Disclaimer
`.pds-signup-panel__disclaimer` has low contrast on the light scheme.

**File**: `src/components/page-blocks.stories.tsx:129`  
**Tracking**: Design-token issue.

### 7. Page Eyebrow Text (Dark Theme)
`.pds-page-eyebrow` has insufficient contrast under `pikaboo-dark`.

**File**: `src/components/page-blocks.stories.tsx:371`  
**Tracking**: Design-token issue.

### 8. Story Scroll Hint
"Scroll to see the sticky nav over content" caption is grey-on-cream (2.5:1). This is a story-only element, not a production component.

**File**: `src/components/navigation.stories.tsx:52`

---

## CSS Loading

### Border-radius Check
The `CssCheck` story in `badge.stories.tsx` verifies that `styles.css` loaded through the shared preview by asserting `.pds-badge` has `border-radius: 999px`. If styles fail to load, this test catches it.

**File**: `src/components/badge.stories.tsx:78`

---

## Story Conventions

### 9. Stories Without `play()` Functions
Every story should have a `play()` function to satisfy Storybook's interaction test recommendation. Missing play functions cause the test panel to show incomplete coverage.

**Fix**: Add a `play` async function with at least one assertion:
```tsx
play: async ({ canvas }) => {
  await expect(canvas.getByText('key content')).toBeVisible();
};
```

### 10. A11y `test: 'todo'` for Known Issues
Stories with known a11y violations use `parameters: { a11y: { test: 'todo' } }` to mark them as accepted technical debt. These are tracked for future resolution:

- `brand.stories.tsx` — `LockupSurfaces` (contrast)
- `navigation.stories.tsx` — `Playground`, `MobileMenu` (contrast + nested-interactive)
- `footer.stories.tsx` — `Mega`, `MegaDegradedStatus`, `MegaLightScheme`, `MegaPikabooDark` (contrast)
- `page-blocks.stories.tsx` — `LogoCloudBand`, `FaqAccordion`, `NewsletterSignupPikabooDark` (contrast)

---

## Testing Gaps

- No `@testing-library/react` or `@testing-library/jest-dom` — unit tests use raw `createRoot` + `act()`.
- No visual regression testing (Chromatic is not wired up).
- No dedicated integration test suite beyond story interaction tests.
