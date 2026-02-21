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
				background: 'white',
				foreground: '#09090b', // zinc-950
				card: {
					DEFAULT: 'white',
					foreground: '#09090b'
				},
				popover: {
					DEFAULT: 'white',
					foreground: '#09090b'
				},
				primary: {
					DEFAULT: '#09090b',
					foreground: 'white'
				},
				secondary: {
					DEFAULT: '#f4f4f5', // zinc-100
					foreground: '#18181b' // zinc-900
				},
				muted: {
					DEFAULT: '#f4f4f5',
					foreground: '#71717a' // zinc-500
				},
				accent: {
					DEFAULT: '#f4f4f5',
					foreground: '#09090b'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#fafafa'
				},
				border: '#e4e4e7', // zinc-200
				input: '#e4e4e7', // zinc-200
				ring: '#09090b',
			},
			borderRadius: {
				lg: '1rem',
				md: '0.75rem',
				sm: '0.5rem'
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
			},
			keyframes: {
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
