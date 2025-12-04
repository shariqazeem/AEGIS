/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f3ff',
                'neon-green': '#0aff68',
                'neon-red': '#ff003c',
                'neon-purple': '#bc13fe',
                'void': '#050508',
                'obsidian': '#0a0a10',
            },
            fontFamily: {
                sans: ['Rajdhani', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s infinite',
                'scanline': 'scanline 4s linear infinite',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6)' },
                },
                'scanline': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
}
