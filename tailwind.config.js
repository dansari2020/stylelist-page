module.exports = {
  purge: [
    './app/**/*.html',
    './app/**/*.erb',
    './app/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
    display: ['responsive', 'group-hover', 'group-focus'],
  },
  plugins: [],
}
