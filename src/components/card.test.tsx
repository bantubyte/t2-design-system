import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './card';

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

describe('Card', () => {
	it('renders card and its children components', () => {
		const container = render(
			<Card interactive tone="brand">
				<CardHeader>
					<CardTitle>Title</CardTitle>
					<CardDescription>Description</CardDescription>
				</CardHeader>
				<CardContent>Content</CardContent>
				<CardFooter>Footer</CardFooter>
			</Card>,
		);

		const card = container.querySelector('.pds-card');
		expect(card).toBeTruthy();
		expect(card?.classList.contains('pds-card--interactive')).toBe(true);
		expect(card?.classList.contains('pds-card--brand')).toBe(true);

		expect(container.querySelector('.pds-card__header')).toBeTruthy();
		expect(container.querySelector('.pds-card__title')?.textContent).toBe(
			'Title',
		);
		expect(container.querySelector('.pds-card__description')?.textContent).toBe(
			'Description',
		);
		expect(container.querySelector('.pds-card__content')?.textContent).toBe(
			'Content',
		);
		expect(container.querySelector('.pds-card__footer')?.textContent).toBe(
			'Footer',
		);
	});
});
