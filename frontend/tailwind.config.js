/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#282c35',
        shell: '#222730',
        surface: '#1a1c22',
        line: '#343943',
        text: '#ffffff',
        muted: '#9e9e9e',
        accent: {
          DEFAULT: '#1fcb4f',
          soft: 'rgba(31, 203, 79, 0.12)',
          strong: '#16a63d'
        },
        positive: '#1fcb4f',
        negative: '#ff6b57',
        warning: '#ffc01e'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        card: '8px',
        panel: '7px'
      },
      boxShadow: {
        card: '0 24px 60px rgba(0, 0, 0, 0.22)',
        soft: '0 12px 28px rgba(0, 0, 0, 0.2)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(15, 107, 75, 0.18)' },
          '50%': { boxShadow: '0 0 0 10px rgba(15, 107, 75, 0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 280ms ease-out',
        glow: 'glow 1.8s ease-out'
      }
    }
  },
  plugins: [],
}
