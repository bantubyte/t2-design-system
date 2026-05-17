import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	AuthAccessScreen,
	AuthLoginScreen,
	AuthSignUpScreen,
	ThemeProvider,
} from '../index';

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
		supportAction: {
			href: 'https://wa.me/27100000000',
			iconLabel: 'WA',
			label: 'Call us on WhatsApp',
		},
	},
	parameters: {
		docs: {
			source: {
				code: `import { AuthSignUpScreen, ThemeProvider } from '@pikaboo/web-design-system';

<ThemeProvider theme="primedia" applyToRoot>
  <AuthSignUpScreen
    productName="-"
    ssoProviders={[
      { id: 'google', label: 'Google' },
      { id: 'github', label: 'GitHub' },
    ]}
    onSubmit={({ email }) => startStytchLogin(email)}
    onSsoSelect={(provider) => startStytchSso(provider.id)}
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

export const Login: StoryObj<typeof AuthLoginScreen> = {
	parameters: {
		docs: {
			source: {
				code: `import { AuthLoginScreen, ThemeProvider } from '@pikaboo/web-design-system';

<ThemeProvider theme="pikaboo" applyToRoot>
  <AuthLoginScreen onSsoSelect={(provider) => startStytchSso(provider.id)} />
</ThemeProvider>`,
			},
		},
	},
	render: () => (
		<ThemeProvider theme="pikaboo">
			<AuthLoginScreen defaultEmail="owner@example.com" />
		</ThemeProvider>
	),
};

export const FullAccessPanel: StoryObj<typeof AuthAccessScreen> = {
	parameters: {
		docs: {
			source: {
				code: `import { AuthAccessScreen, ThemeProvider } from '@pikaboo/web-design-system';

<ThemeProvider theme="pikaboo-dark" applyToRoot>
  <AuthAccessScreen
    defaultMode="signup"
    supportAction={{ href: 'https://wa.me/27100000000', label: 'Call us on WhatsApp' }}
  />
</ThemeProvider>`,
			},
		},
	},
	render: () => (
		<ThemeProvider theme="pikaboo-dark">
			<AuthAccessScreen
				defaultMode="signup"
				supportAction={{
					href: 'https://wa.me/27100000000',
					iconLabel: 'WA',
					label: 'Call us on WhatsApp',
				}}
			/>
		</ThemeProvider>
	),
};
