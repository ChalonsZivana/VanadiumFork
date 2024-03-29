/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      borderWidth:{
        '1':'1px'
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

