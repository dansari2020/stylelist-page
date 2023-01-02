module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.625rem"
      },
      border: {
        0.5: "0.5px",
      },
      width: {
        15: "3.75rem",
        17: "68px",
        25: "6.25rem",
        26: "6.5rem",
        27: "6.75rem",
        50: "200px",
      },
      height: {
        15: "3.75rem",
        17: "68px",
        18: "4.5rem",
        27: "6.75rem",
        50: "200px",
      },
      padding: {
        3.7: "0.938rem",
      },
    },
  },
  variants: {
    extend: {},
    display: ["responsive", "group-hover", "group-focus"],
  },
  plugins: [],
};
