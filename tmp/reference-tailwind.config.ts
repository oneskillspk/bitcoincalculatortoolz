import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	future: {
		hoverOnlyWhenSupported: true,
	},
	prefix: "",
	theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			sans: [
    				'Roboto',
    				'ui-sans-serif',
    				'system-ui',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'Segoe UI',
    				'Helvetica Neue',
    				'Arial',
    				'Noto Sans',
    				'sans-serif'
    			],
    			display: [
    				'Inter',
    				'system-ui',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'sans-serif'
    			],
    			mono: [
    				'Roboto Mono',
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'Courier New',
    				'monospace'
    			],
    			serif: [
    				'Libre Caslon Text',
    				'ui-serif',
    				'Georgia',
    				'Cambria',
    				'Times New Roman',
    				'Times',
    				'serif'
    			]
    		},
    		fontSize: {
    			'display-2xl': [
    				'clamp(3rem, 5vw, 4.5rem)',
    				{
    					lineHeight: '1.1',
    					letterSpacing: '-0.02em',
    					fontWeight: '700'
    				}
    			],
    			'display-xl': [
    				'clamp(2.5rem, 4.5vw, 3.75rem)',
    				{
    					lineHeight: '1.1',
    					letterSpacing: '-0.02em',
    					fontWeight: '700'
    				}
    			],
    			'display-lg': [
    				'clamp(2rem, 4vw, 3rem)',
    				{
    					lineHeight: '1.15',
    					letterSpacing: '-0.02em',
    					fontWeight: '700'
    				}
    			],
    			'display-md': [
    				'clamp(1.75rem, 3.5vw, 2.25rem)',
    				{
    					lineHeight: '1.2',
    					letterSpacing: '-0.01em',
    					fontWeight: '600'
    				}
    			],
    			'display-sm': [
    				'clamp(1.5rem, 3vw, 1.875rem)',
    				{
    					lineHeight: '1.3',
    					letterSpacing: '-0.01em',
    					fontWeight: '600'
    				}
    			],
    			'body-lg': [
    				'clamp(1rem, 2vw, 1.125rem)',
    				{
    					lineHeight: '1.7',
    					letterSpacing: '0',
    					fontWeight: '400'
    				}
    			]
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))',
    				grid: 'hsl(var(--chart-grid))',
    				text: 'hsl(var(--chart-text))',
    				axis: 'hsl(var(--chart-axis))'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))',
    				glow: 'hsl(var(--primary-glow))',
    				bright: 'hsl(var(--primary-bright))',
    				subtle: 'hsl(var(--primary-subtle))',
    				muted: 'hsl(var(--primary-muted))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			blue: {
    				accent: 'hsl(var(--blue-accent))',
    				soft: 'hsl(var(--blue-soft))',
    				muted: 'hsl(var(--blue-muted))'
    			},
    			success: {
    				DEFAULT: 'hsl(var(--success))',
    				foreground: 'hsl(var(--success-foreground))',
    				soft: 'hsl(var(--success-soft))'
    			},
    			premium: {
    				DEFAULT: 'hsl(var(--premium))',
    				foreground: 'hsl(var(--premium-foreground))'
    			},
    			neutral: {
    				'50': 'hsl(var(--neutral-50))',
    				'100': 'hsl(var(--neutral-100))',
    				'200': 'hsl(var(--neutral-200))',
    				'300': 'hsl(var(--neutral-300))',
    				'400': 'hsl(var(--neutral-400))',
    				'500': 'hsl(var(--neutral-500))',
    				'600': 'hsl(var(--neutral-600))',
    				'700': 'hsl(var(--neutral-700))',
    				'800': 'hsl(var(--neutral-800))',
    				'900': 'hsl(var(--neutral-900))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			warning: {
    				DEFAULT: 'hsl(var(--warning))',
    				foreground: 'hsl(var(--warning-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-in': {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(10px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			'fade-in-up': {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(20px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			'scale-in': {
    				'0%': {
    					opacity: '0',
    					transform: 'scale(0.95)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'scale(1)'
    				}
			},
			'marquee-left': {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			'marquee-right': {
				'0%': { transform: 'translateX(-50%)' },
				'100%': { transform: 'translateX(0)' }
			},
			'nav-slide-in': {
				'0%': { opacity: '0', transform: 'translateY(-20px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out',
    			'fade-in-up': 'fade-in-up 0.4s ease-out',
    			'scale-in': 'scale-in 0.2s ease-out',
    			'marquee-left': 'marquee-left 25s linear infinite',
    			'marquee-right': 'marquee-right 28s linear infinite',
    			'nav-slide-in': 'nav-slide-in 0.6s cubic-bezier(0.16,1,0.3,1) both'
    		},
    		spacing: {
    			'18': '4.5rem',
    			'88': '22rem',
    			'112': '28rem',
    			'128': '32rem'
    		},
    		backdropBlur: {
    			xs: '2px'
    		},
    		boxShadow: {
    			'2xs': 'var(--shadow-2xs)',
    			xs: 'var(--shadow-xs)',
    			sm: 'var(--shadow-sm)',
    			md: 'var(--shadow-md)',
    			lg: 'var(--shadow-lg)',
    			xl: 'var(--shadow-xl)',
    			'2xl': 'var(--shadow-2xl)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
