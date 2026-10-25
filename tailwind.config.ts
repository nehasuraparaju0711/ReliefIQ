import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.72)',
          solid: '#FFFFFF',
          muted: '#F8FAFC',
          hover: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(226, 232, 240, 0.8)',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // brand primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#4F46E5',
        },
        pastel: {
          mint: {
            DEFAULT: '#D7F5E9',
            dark: '#107E54',
            border: '#9CE3C6',
            light: '#EEFAF4',
          },
          lavender: {
            DEFAULT: '#E6E0FF',
            dark: '#5843C4',
            border: '#C6BCFF',
            light: '#F4F1FF',
          },
          sky: {
            DEFAULT: '#DCEEFF',
            dark: '#1E6CB5',
            border: '#B3D9FF',
            light: '#F0F7FF',
          },
          peach: {
            DEFAULT: '#FFE5D6',
            dark: '#B85014',
            border: '#FFBF99',
            light: '#FFF4EE',
          },
          butter: {
            DEFAULT: '#FFF4CC',
            dark: '#946C00',
            border: '#FFE382',
            light: '#FFFAEB',
          },
          rose: {
            DEFAULT: '#FFDDE6',
            dark: '#BE123C',
            border: '#FFB3C6',
            light: '#FFF0F5',
          },
        },
        risk: {
          low: {
            bg: '#D7F5E9',
            text: '#0D6843',
            border: '#9CE3C6',
          },
          medium: {
            bg: '#FFF4CC',
            text: '#855E00',
            border: '#FFE382',
          },
          high: {
            bg: '#FFE5D6',
            text: '#A3430C',
            border: '#FFBF99',
          },
          critical: {
            bg: '#FFDDE6',
            text: '#9F1239',
            border: '#FFB3C6',
          },
        },
      },
      borderRadius: {
        card: '20px',
        pill: '9999px',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.12)',
        soft: '0 4px 20px -2px rgba(79, 70, 229, 0.12)',
        'soft-lg': '0 10px 25px -3px rgba(79, 70, 229, 0.2)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(1.02)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        blob: 'float 18s ease-in-out infinite',
        'blob-slow': 'float 26s ease-in-out infinite reverse',
        'pulse-gentle': 'pulse-gentle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
