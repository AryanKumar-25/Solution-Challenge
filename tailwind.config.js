/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: '#E8F4FD',
        purple: {
          DEFAULT: '#6B4EFF',
          light: '#EDE9FF',
          dark: '#5538E0',
        },
        orange: {
          DEFAULT: '#FF6B35',
          light: '#FFF0EA',
        },
        green: {
          DEFAULT: '#2DCB73',
          light: '#E6F9EE',
        },
        pink: {
          DEFAULT: '#FF4D8D',
          light: '#FFE8F2',
        },
        yellow: {
          DEFAULT: '#FFD046',
        },
        dark: '#1A1A2E',
        muted: '#6B7280',
        // Keep old names mapped to new colors for compatibility
        primary: {
          DEFAULT: '#6B4EFF',
          light: '#EDE9FF',
          dark: '#5538E0',
          50: '#EDE9FF',
          100: '#D9D1FF',
        },
        accent: {
          DEFAULT: '#FF6B35',
          light: '#FFF0EA',
          50: '#FFF0EA',
          200: '#FFD5C0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#E8F4FD',
          100: '#F1F5F9',
        },
        urgency: {
          high: '#FF4D8D',
          medium: '#FFD046',
          low: '#2DCB73',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(107,78,255,0.10)',
        'card-hover': '0 8px 32px rgba(107,78,255,0.18)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'nav': '0 2px 12px rgba(107,78,255,0.08)',
        'nav-bottom': '0 -4px 20px rgba(107,78,255,0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        'full': '999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.35s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slower': 'float 9s ease-in-out infinite',
        'float-slowest': 'float 12s ease-in-out infinite',
        'spring-in': 'springIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'progress': 'progressBar 3s linear forwards',
        'pulse-dot': 'pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        springIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
