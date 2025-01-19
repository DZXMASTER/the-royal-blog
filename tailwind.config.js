module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      colors: {
        primary: '#6A4E23', // Dark gold for regal tones
        primaryDark: '#5C441F',
        secondary: '#3E2723', // Dark brown
        accent: '#C7B77B', // Lighter gold
      },
      backgroundImage: {
        'parchment': "url('https://img.freepik.com/free-photo/wooden-floor-background_53876-88628.jpg?semt=ais_hybrid')"
      },
    },
  },
  plugins: [],
}
