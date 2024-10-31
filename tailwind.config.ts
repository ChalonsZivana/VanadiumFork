import { join } from 'path'
import type { Config } from 'tailwindcss'
import { skeleton } from '@skeletonlabs/tw-plugin'
import { myCustomTheme } from './src/theme'
import plugin from 'tailwindcss/plugin'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
    extend: {
      fontSize:{
        'xxs':'0.6rem'
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      borderWidth:{
        '1':'1px'
      },
      linearGradients: {
        // Name of your custom gradient
        'background-gradient': ['to bottom right', '#7E0200', '#000000'],
      },
      backgroundImage: {
        'main-bg': "url('/background.jpg')"
      },
      fontFamily: {
        'zagoth':["Zagoth"]
      },
      keyframes: {
        "background-shine": {
          '0%': { backgroundColor: 'white' }, // From white
          '50%': { backgroundColor: '#FFFF8F' }, // To yellow
          '100%': { backgroundColor: 'white' }, // Back to white
        },
        "fade-in-out": {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        "scale-up": {
          '0%': { scale: '0' },
          '100%': { scale: '1' },
        },
        "shine": {
          '0%': {
            textShadow: 'none',
          },
          '50%': {
            textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700, 0 0 50px #ffd700, 0 0 60px #ffd700, 0 0 70px #ffd700, 0 0 80px #ffd700',
          },
          '100%': {
            textShadow: 'none',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        "fade-in": 'fade-in-out 10s forwards',
        "scale-up": 'scale-up 0.5s forwards',
        "shine":"shine 2s infinite",
        "background-shine":"background-shine 1s",
        shake: 'shake 1s ease-in-out infinite',
      }
    },
  },
	plugins: [
		skeleton({
			themes: {
				custom: [
					myCustomTheme
				],
        preset: [
					{
						name: 'crimson',
						enhancements: true,
					},
					{
						name: 'hamlindigo',
						enhancements: true,
					},
				],
			},
		}),
    require('tailwindcss-3d'),
    require('tailwindcss-gradients'),
    function ({ addVariant }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
    },
    plugin(function ({ addUtilities }) {
			addUtilities({
				'.drag-none': {
					'-webkit-user-drag': 'none',
					'-khtml-user-drag': 'none',
					'-moz-user-drag': 'none',
					'-o-user-drag': 'none',
					'user-drag': 'none'
				},
			});
		}),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
	],
} satisfies Config;