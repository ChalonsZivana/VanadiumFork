/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'main-bg': "url('/background.jpg')"
      },
      fontFamily: {
        'zagoth':["Zagoth"]
      },
      keyframes: {
        test: {
          '0%':{ transform: 'translateY(0vh)'},
          '100%':{ transform: 'translateY(50vh)'},
        }
      },
      animation: {
        wiggle: 'test 1s ease-in-out forwards',
      }
    },
  },
  plugins: [
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
		})
  ],
}

