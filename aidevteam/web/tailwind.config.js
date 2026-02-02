/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-blue': '#00D2FF',
                'neon-purple': '#9D50BB',
                'emerald-glow': '#00C9FF',
                'deep-space': '#0a0a0f',
                'carbon': '#1a1a2e',
                'glass': 'rgba(255, 255, 255, 0.05)',
            },
            backdropBlur: {
                'glass': '12px',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(0, 210, 255, 0.3)',
                'glow-purple': '0 0 20px rgba(157, 80, 187, 0.3)',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
