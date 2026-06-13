import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Avatar, AvatarGroup } from './avatar';

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

describe('Avatar', () => {
	it('renders an image when src is provided', () => {
		const container = render(<Avatar alt="User" src="img.jpg" />);
		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		expect(img?.src).toContain('img.jpg');
		expect(img?.alt).toBe('User');
	});

	it('renders initials when src is missing', () => {
		const container = render(<Avatar initials="AB" />);
		const initials = container.querySelector('.pds-avatar__initials');
		expect(initials).toBeTruthy();
		expect(initials?.textContent).toBe('AB');
	});

	it('generates initials from alt text', () => {
		const container = render(<Avatar alt="Lario Borges" />);
		const initials = container.querySelector('.pds-avatar__initials');
		expect(initials?.textContent).toBe('LA');
	});
});

describe('AvatarGroup', () => {
	it('renders a list of avatars up to max', () => {
		const people = [{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }];
		const container = render(<AvatarGroup max={2} people={people} />);

		const avatars = container.querySelectorAll(
			'.pds-avatar:not(.pds-avatar--overflow)',
		);
		expect(avatars.length).toBe(2);

		const overflow = container.querySelector('.pds-avatar--overflow');
		expect(overflow).toBeTruthy();
		expect(overflow?.textContent).toContain('+1');
	});
});
