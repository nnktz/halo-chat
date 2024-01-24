import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      'heading1-bold': [
        '36px',
        {
          lineHeight: '100%',
          fontWeight: '700',
        },
      ],
      'heading2-bold': [
        '30px',
        {
          lineHeight: '140%',
          fontWeight: '700',
        },
      ],
      'heading3-bold': [
        '24px',
        {
          lineHeight: '140%',
          fontWeight: '700',
        },
      ],
      'heading4-bold': [
        '20px',
        {
          lineHeight: '140%',
          fontWeight: '700',
        },
      ],
      'body-bold': [
        '18px',
        {
          lineHeight: '140%',
          fontWeight: '700',
        },
      ],
      'medium-bold': [
        '18px',
        {
          lineHeight: '140%',
          fontWeight: '500',
        },
      ],
      'base-bold': [
        '16px',
        {
          lineHeight: '140%',
          fontWeight: '600',
        },
      ],
      'base-medium': [
        '16px',
        {
          lineHeight: '140%',
          fontWeight: '500',
        },
      ],
      'base-light': [
        '20px',
        {
          lineHeight: '140%',
          fontWeight: '400',
        },
      ],
      'small-bold': [
        '14px',
        {
          lineHeight: '140%',
          fontWeight: '600',
        },
      ],
      'small-medium': [
        '14px',
        {
          lineHeight: '140%',
          fontWeight: '500',
        },
      ],
      'subtle-medium': [
        '12px',
        {
          lineHeight: '16px',
          fontWeight: '500',
        },
      ],
      'tiny-medium': [
        '10px',
        {
          lineHeight: '140%',
          fontWeight: '500',
        },
      ],
      'x-small-bold': [
        '7px',
        {
          lineHeight: '9.318px',
          fontWeight: '600',
        },
      ],
    },
    extend: {
      colors: {
        'blue-1': '#0A065C',
        'blue-2': '#F5F7FB',
        'blue-3': '#04A1E3',
        'grey-1': '#737373',
        'grey-2': '#f0f0f0',
        'grey-3': '#8B8B8B',
        'red-1': '#FF5252',
        'purple-1': '#C6D4FF',
        'purple-2': '#4D426D',
        'green-1': '#13E0E0',
        'pink-1': '#FDDAD6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
