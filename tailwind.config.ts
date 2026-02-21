import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: '#0a0a0a',
				foreground: '#ffffff',
				card: {
					DEFAULT: '#121212',
					foreground: '#ffffff'
				},
				popover: {
					DEFAULT: '#121212',
					foreground: '#ffffff'
				},
				primary: {
					DEFAULT: '#ffffff',
					foreground: '#000000'
				},
				secondary: {
					DEFAULT: '#1e1e1e',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#1e1e1e',
					foreground: '#a1a1aa'
				},
				accent: {
					DEFAULT: '#1e1e1e',
					foreground: '#ffffff'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#fafafa'
				},
				border: '#27272a',
				input: '#27272a',
				ring: '#ffffff',
			},
			borderRadius: {
				lg: '1rem',
				md: '0.75rem',
				sm: '0.5rem'
			},
			animation: {
				'marquee': 'marquee 25s linear infinite',
				'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(15px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
