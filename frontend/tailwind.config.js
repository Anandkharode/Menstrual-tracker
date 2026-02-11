/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#be185d', // rose-700
                secondary: '#fbcfe8', // rose-200
            },
            animation: {
                'slide-up': 'slide-up 0.3s ease-out',
                'fade-in': 'fade-in 0.3s ease-in',
                'bounce': 'bounce 1s infinite',
            },
            keyframes: {
                'slide-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
            },
        },
    },
    plugins: [],
}