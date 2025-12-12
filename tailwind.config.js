/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                vence: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                },
                perde: {
                    DEFAULT: '#ef4444',
                    dark: '#dc2626',
                },
                'bg-main': '#f3f4f6',
                'bg-card': '#ffffff',
                'text-main': '#111827',
                'text-sec': '#6b7280',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
