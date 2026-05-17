import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Button,
	Dialog,
	DialogBody,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	GuidedWizardShell,
	GuidedWizardStepper,
} from './index';

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

const click = (element: Element | null) => {
	if (!element) {
		throw new Error('Element not found for click');
	}
	act(() => {
		element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
};

const keyDownDocument = (key: string) => {
	act(() => {
		document.dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key }),
		);
	});
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	for (const container of mountedContainers.splice(0)) {
		container.remove();
	}
});

describe('gold-standard modal and widget contracts', () => {
	it('renders an accessible dismissible dialog with sizing and labelled copy', () => {
		const dismissed: boolean[] = [];
		const container = render(
			<Dialog
				descriptionId="campaign-dialog-description"
				onOpenChange={(open) => dismissed.push(open)}
				size="lg"
				titleId="campaign-dialog-title"
			>
				<DialogHeader actions={<Button variant="outline">Help</Button>}>
					<DialogTitle id="campaign-dialog-title">Approve campaign</DialogTitle>
					<DialogDescription id="campaign-dialog-description">
						Check the media mix before approving the plan.
					</DialogDescription>
				</DialogHeader>
				<DialogBody>Campaign approvals stay editable until launch.</DialogBody>
				<DialogFooter
					actions={
						<>
							<Button variant="outline">Cancel</Button>
							<Button>Approve</Button>
						</>
					}
				/>
			</Dialog>,
		);
		const dialog = container.querySelector('[role="dialog"]');

		expect(dialog?.classList.contains('pds-dialog--lg')).toBe(true);
		expect(dialog?.getAttribute('aria-labelledby')).toBe(
			'campaign-dialog-title',
		);
		expect(dialog?.getAttribute('aria-describedby')).toBe(
			'campaign-dialog-description',
		);
		expect(
			container.querySelector('button[aria-label="Close dialog"] .pds-icon'),
		).toBeTruthy();

		click(container.querySelector('button[aria-label="Close dialog"]'));
		keyDownDocument('Escape');

		expect(dismissed).toEqual([false, false]);
	});

	it('keeps non-dismissible dialogs locked against backdrop and Escape dismissal', () => {
		const dismissed: boolean[] = [];
		const container = render(
			<Dialog dismissible={false} onOpenChange={(open) => dismissed.push(open)}>
				<DialogHeader>
					<DialogTitle>Locked review</DialogTitle>
				</DialogHeader>
				<DialogBody>Use the footer action to continue.</DialogBody>
			</Dialog>,
		);

		click(container.querySelector('.pds-dialog-backdrop'));
		keyDownDocument('Escape');

		expect(
			container.querySelector('button[aria-label="Close dialog"]'),
		).toBeNull();
		expect(dismissed).toEqual([]);
	});

	it('marks wizard steps before the active step complete and supports shell dismissal', () => {
		const closed: boolean[] = [];
		const steps = [
			{ label: 'Brief', value: 'brief' },
			{ label: 'Dates', value: 'dates' },
			{ label: 'Inventory', value: 'inventory' },
		] as const;
		const container = render(
			<GuidedWizardShell
				descriptionId="wizard-description"
				onOpenChange={(open) => closed.push(open)}
				size="lg"
				title="Campaign setup"
				titleId="wizard-title"
			>
				<p id="wizard-description">Complete the setup sequence.</p>
				<GuidedWizardStepper activeStep="dates" steps={steps} />
			</GuidedWizardShell>,
		);
		const dialog = container.querySelector('[role="dialog"]');
		const stepButtons = container.querySelectorAll(
			'.pds-guided-wizard-stepper__step',
		);

		expect(dialog?.classList.contains('pds-guided-wizard--lg')).toBe(true);
		expect(dialog?.getAttribute('aria-labelledby')).toBe('wizard-title');
		expect(dialog?.getAttribute('aria-describedby')).toBe('wizard-description');
		expect(
			stepButtons[0]?.classList.contains(
				'pds-guided-wizard-stepper__step--complete',
			),
		).toBe(true);
		expect(
			stepButtons[1]?.classList.contains(
				'pds-guided-wizard-stepper__step--current',
			),
		).toBe(true);
		expect(
			stepButtons[2]?.classList.contains(
				'pds-guided-wizard-stepper__step--upcoming',
			),
		).toBe(true);

		click(container.querySelector('button[aria-label="Close wizard"]'));

		expect(closed).toEqual([false]);
	});
});
