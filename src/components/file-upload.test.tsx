import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FileDropzone } from './file-upload';

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

describe('FileDropzone', () => {
	it('renders initial state', () => {
		const container = render(
			<FileDropzone maxSizeMb={5} title="Upload Photo" />,
		);
		expect(container.textContent).toContain('Upload Photo');
		expect(container.textContent).toContain('Max 5MB');
	});

	it('renders with file', () => {
		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const container = render(<FileDropzone file={file} />);
		expect(container.textContent).toContain('test.png');
		expect(container.querySelector('button')?.textContent).toBe('Remove');
	});
});
