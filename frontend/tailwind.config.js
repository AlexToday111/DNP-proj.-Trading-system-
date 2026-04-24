/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4efe8',
        shell: '#fbf8f4',
        surface: '#ffffff',
        line: '#e9e2d8',
        text: '#1f2a20',
        muted: '#687166',
        accent: {
          DEFAULT: '#0f6b4b',
          soft: '#e7f5ed',
          strong: '#0a4f37'
        },
        positive: '#167c5a',
        negative: '#b85e49',
        warning: '#b98537'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        card: '28px',
        panel: '22px'
      },
      boxShadow: {
        card: '0 20px 60px rgba(28, 35, 26, 0.08)',
        soft: '0 12px 30px rgba(28, 35, 26, 0.06)'
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
