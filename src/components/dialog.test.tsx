import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Dialog,
	DialogBody,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './dialog';

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

describe('Dialog', () => {
	it('renders nothing when not open', () => {
		const container = render(<Dialog open={false}>Hidden</Dialog>);
		expect(container.querySelector('.pds-dialog')).toBeFalsy();
	});

	it('renders when open', () => {
		const container = render(<Dialog open={true}>Visible</Dialog>);
		const dialog = container.querySelector('.pds-dialog');
		expect(dialog).toBeTruthy();
		expect(dialog?.getAttribute('role')).toBe('dialog');
		expect(dialog?.getAttribute('aria-modal')).toBe('true');
		expect(container.textContent).toContain('Visible');
	});

	it('calls onOpenChange on escape press when dismissible', () => {
		let openState = true;
		render(
			<Dialog
				dismissible
				onOpenChange={(v) => {
					openState = v;
				}}
				open={openState}
			>
				Visible
			</Dialog>,
		);

		act(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		});
		expect(openState).toBe(false);
	});

	it('renders subcomponents correctly', () => {
		const container = render(
			<Dialog open={true}>
				<DialogHeader>Header</DialogHeader>
				<DialogTitle>Title</DialogTitle>
				<DialogDescription>Description</DialogDescription>
				<DialogBody>Body</DialogBody>
				<DialogFooter>Footer</DialogFooter>
			</Dialog>,
		);
		expect(container.querySelector('.pds-dialog__header')).toBeTruthy();
		expect(container.querySelector('.pds-dialog__title')).toBeTruthy();
		expect(container.querySelector('.pds-dialog__description')).toBeTruthy();
		expect(container.querySelector('.pds-dialog__body')).toBeTruthy();
		expect(container.querySelector('.pds-dialog__footer')).toBeTruthy();
	});
});
