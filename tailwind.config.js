/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
    theme: {
        extend: {}
    },
    plugins: [require('@tailwindcss/forms')]
}
