module.exports = {
  purge: [
    './app/**/*.html',
    './app/**/*.erb',
    './app/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '15': '3.75rem',
        '17': '68px',
        '50': '200px',
      },
      height: {
        '15': '3.75rem',
        '17': '68px',
        '50': '200px',
      },
      padding: {
        '3.7': '0.938rem',
      }
    },
  },
  variants: {
    extend: {},
    display: ['responsive', 'group-hover', 'group-focus'],
  },
  plugins: [],
}
