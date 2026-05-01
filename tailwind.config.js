export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'red-primary': '#C0272D',
        'red-dark': '#9B1B20',
        'red-light': '#E8474D',
        'gold-primary': '#C9A84C',
        'gold-dark': '#A8873A',
        'gold-light': '#E5C97A',
        'gold-pale': '#F7EFD8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
