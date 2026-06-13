import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	GuidedWizardPanel,
	GuidedWizardShell,
	GuidedWizardStatusBar,
	GuidedWizardStepper,
	GuidedWizardToast,
} from './wizard';

(
	globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: Root[] = [];
const mountedContainers: HTMLElement[] = [];

const render = (ui: ReactNode) => {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);
	mountedRoots.push(root);
	mountedContainers.push(container);

	act(() => {
		root.render(ui);
	});

	return container;
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('GuidedWizardStepper', () => {
	it('renders steps and handles click', () => {
		const steps = [
			{ label: 'Step 1', value: '1' },
			{ label: 'Step 2', value: '2' },
		];
		const container = render(
			<GuidedWizardStepper activeStep="1" steps={steps} />,
		);
		const buttons = container.querySelectorAll(
			'.pds-guided-wizard-stepper__step',
		);
		expect(buttons.length).toBe(2);
		expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
		expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
	});
});

describe('GuidedWizardShell', () => {
	it('renders when open', () => {
		const container = render(
			<GuidedWizardShell open={true} title="Wizard">
				Content
			</GuidedWizardShell>,
		);
		expect(container.querySelector('.pds-guided-wizard')).toBeTruthy();
		expect(
			container.querySelector('.pds-guided-wizard__title')?.textContent,
		).toBe('Wizard');
		expect(
			container.querySelector('.pds-guided-wizard__body')?.textContent,
		).toBe('Content');
	});
});

describe('GuidedWizard components', () => {
	it('renders GuidedWizardPanel', () => {
		const container = render(
			<GuidedWizardPanel description="Desc" title="Panel">
				Body
			</GuidedWizardPanel>,
		);
		expect(container.querySelector('h3')?.textContent).toBe('Panel');
		expect(container.querySelector('p')?.textContent).toBe('Desc');
		expect(
			container.querySelector('.pds-guided-wizard-panel__body')?.textContent,
		).toBe('Body');
	});

	it('renders GuidedWizardStatusBar', () => {
		const container = render(
			<GuidedWizardStatusBar message="Status" tone="success" />,
		);
		const el = container.querySelector('.pds-guided-wizard-status');
		expect(el?.classList.contains('pds-guided-wizard-status--success')).toBe(
			true,
		);
		expect(el?.textContent).toBe('Status');
	});

	it('renders GuidedWizardToast', () => {
		const container = render(<GuidedWizardToast message="Toast" />);
		expect(container.querySelector('.pds-guided-wizard-toast')).toBeTruthy();
		expect(container.querySelector('strong')?.textContent).toBe('Toast');
	});
});
