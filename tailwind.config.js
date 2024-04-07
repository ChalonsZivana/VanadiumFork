/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
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
        }
      },
      animation: {
        "fade-in": 'fade-in-out 10s forwards',
        "scale-up": 'scale-up 0.5s forwards',
        "shine":"shine 2s infinite"
      }
    },
  },
  plugins: [
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
				}
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
}

