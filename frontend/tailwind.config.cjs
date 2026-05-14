/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        dm: ["'DM Sans'", "sans-serif"],
        poppins: ["'Poppins'", "sans-serif"],
      },
      colors: {
        ha: {
          bg: '#0d0a14',
          surface: '#16111f',
          surface2: '#1e1729',
          rose: '#e8617a',
          lavender: '#9b7fe8',
          teal: '#4ecdc4',
          amber: '#f4a261',
          text: '#f0eaf8',
        },
        auth: {
          pink: '#fde8f0',
          rose: '#e75480',
          roseLight: '#f06292',
          petal: '#f9a8c9',
          petalDark: '#f48fb1',
          border: '#f9b8d0',
          inputBg: '#fde8f0',
          inputFocus: '#fff0f5',
          textDark: '#5a2035',
          textMuted: '#c48fa0',
          linkColor: '#c2537a',
          heading: '#7d2248',
        },
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'bounce': 'bounce 1s infinite',
        'in': 'fadeIn 0.3s ease-out',
        'fadeIn': 'fadeIn 0.4s ease',
        'petalFall': 'authFall 8s linear infinite',
        'pulse-dot': 'pulseDot 2s infinite',
        'float': 'lnFloat 6s ease-in-out infinite',
        'pulse-glow': 'lnPulse 2.5s ease-in-out infinite',
        'bounce-arrow': 'lnBounce 1.6s ease-in-out infinite',
        'blink': 'lnBlink 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        authFall: {
          '0%': { transform: 'translateY(-50px) rotate(0deg)', opacity: '0' },
          '8%': { opacity: '0.65' },
          '90%': { opacity: '0.45' },
          '100%': { transform: 'translateY(700px) rotate(420deg)', opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        lnFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-22px) scale(1.04)' },
        },
        lnPulse: {
          '0%, 100%': { boxShadow: '0 10px 30px rgba(167,139,250,.5), 0 0 0 0 rgba(167,139,250,.3)' },
          '50%': { boxShadow: '0 14px 36px rgba(167,139,250,.6), 0 0 0 10px rgba(167,139,250,0)' },
        },
        lnBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        lnBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        lnUp: {
          'from': { opacity: '0', transform: 'translateY(28px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
