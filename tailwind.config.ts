import type { Config } from 'tailwindcss';
import type { DefaultColors } from 'tailwindcss/types/generated/colors';

const themeDark = (colors: DefaultColors) => ({
  50: '#0a0a0a',
  100: '#111111',
  200: '#1c1c1c',
});

const themeLight = (colors: DefaultColors) => ({
  50: '#ffffff',
  100: '#fafafa',
  200: '#f5f5f5',
});

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderColor: ({ colors }) => {
        return {
          light: themeLight(colors),
          dark: themeDark(colors),
        };
      },
      colors: ({ colors }) => {
        const colorsDark = themeDark(colors);
        const colorsLight = themeLight(colors);

        return {
          dark: {
            primary: colorsDark[50],
            secondary: colorsDark[100],
            ...colorsDark,
          },
          light: {
            primary: colorsLight[50],
            secondary: colorsLight[100],
            ...colorsLight,
          },
        };
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8) rotate(45deg)' },
          '100%': { transform: 'scale(1) rotate(45deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-delay-200': 'fadeIn 0.5s ease-out 0.2s forwards',
        'fade-in-delay-400': 'fadeIn 0.5s ease-out 0.4s forwards',
        'fade-in-delay-600': 'fadeIn 0.5s ease-out 0.6s forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
