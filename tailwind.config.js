/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Paleta de colores vibrantes
        primary: {
          blue: '#0066FF',
          yellow: '#FFD700',
          green: '#00C851',
        },
        accent: {
          blue: '#4A90E2',
          yellow: '#FFA500',
          green: '#32CD32',
        },
        // Gradientes
        gradient: {
          blue: 'linear-gradient(135deg, #0066FF 0%, #4A90E2 100%)',
          yellow: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          green: 'linear-gradient(135deg, #00C851 0%, #32CD32 100%)',
          rainbow: 'linear-gradient(135deg, #0066FF 0%, #FFD700 50%, #00C851 100%)',
        }
      },
      fontFamily: {
        'display': ['var(--font-atkinson)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #0066FF 0%, #4A90E2 100%)',
        'gradient-yellow': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-green': 'linear-gradient(135deg, #00C851 0%, #32CD32 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #0066FF 0%, #FFD700 50%, #00C851 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'slide-in': 'slideInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'glow-blue': '0 20px 40px rgba(0, 102, 255, 0.3)',
        'glow-yellow': '0 20px 40px rgba(255, 215, 0, 0.3)',
        'glow-green': '0 20px 40px rgba(0, 200, 81, 0.3)',
      },
    },
  },
  plugins: [],
}
