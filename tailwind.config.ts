import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        base: [
          '17px',
          {
            lineHeight: `${24 / 17}`,
            letterSpacing: '-0.021em',
          },
        ],
      },
    },
  },
  plugins: [],
}
export default config
