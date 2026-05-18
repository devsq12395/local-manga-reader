module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{html,js,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Ancizar Sans"', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        btnPrimary: '#CCCCCC', // Button background
        btnSecondary: '#FFFFFF', // Button background
        btnDanger: '#F2616B', // Coral Red
        btnGhost: '#F0F0F0', // Light gray for ghost button
        btnCircle: '#FFFFFF',

        btnPrimaryHover: '#FFA41B', // Button hover background
        btnDangerHover: '#F46467', // Button hover background
        btnGhostHover: '#E0E0E0', // Slightly darker gray for hover
        btnCircleHover: '#DDDDDD',

        btnText: '#3E2C08', // Button text
        btnTextGhost: '#3E2C08', // Button text
        btnTextLink: '#007BFF', // Button text

        buttonCatalogBg: '#FFFFFF',
        buttonCatalogHoverBg: '#FFA41B',
        buttonCatalogButtonText: '#3E2C08',
      }
    },
  },
  plugins: [],
};