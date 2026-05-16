import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthSignUpScreen, ThemeProvider } from '../index';

const meta = {
	title: 'Auth/Sign Up',
	component: AuthSignUpScreen,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		productName: {
			control: 'text',
		},
	},
} satisfies Meta<typeof AuthSignUpScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimediaCortexx: Story = {
	args: {
		productName: '-',
	},
	parameters: {
		docs: {
			source: {
				code: `import { AuthSignUpScreen, ThemeProvider } from '@pikaboo/web-design-system';

<ThemeProvider theme="primedia" applyToRoot>
  <AuthSignUpScreen
    productName="-"
    onSubmit={({ email }) => startStytchLogin(email)}
  />
</ThemeProvider>`,
			},
		},
	},
	render: (args) => (
		<ThemeProvider theme="primedia">
			<AuthSignUpScreen {...args} />
		</ThemeProvider>
	),
};

export const Pikaboo: Story = {
	parameters: {
		docs: {
			source: {
				code: `import { AuthSignUpScreen, ThemeProvider } from '@pikaboo/web-design-system';

<ThemeProvider theme="pikaboo" applyToRoot>
  <AuthSignUpScreen onSubmit={({ email }) => startStytchLogin(email)} />
</ThemeProvider>`,
			},
		},
	},
	render: () => (
		<ThemeProvider theme="pikaboo">
			<AuthSignUpScreen />
		</ThemeProvider>
	),
};
