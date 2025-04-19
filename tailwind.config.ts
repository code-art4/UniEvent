import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                // --radius: 0.5rem (from theme.json radius: 0.5)
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
            colors: {
                // Light mode values for professional variant with primary color hsl(244, 100%, 50%)
                // --background: 0 0% 100% (white)
                background: "hsl(0 0% 100%)",
                // --foreground: 222.2 84% 4.9% (near black)
                foreground: "hsl(222.2 84% 4.9%)",
                card: {
                    // --card: 0 0% 100% (white)
                    DEFAULT: "hsl( 0 0% 100%)",
                    // --card-foreground: 222.2 84% 4.9% (near black)
                    foreground: "hsl(222.2 84% 4.9%)",
                },
                popover: {
                    // --popover: 0 0% 100% (white)
                    DEFAULT: "hsl(0 0% 100%)",
                    // --popover-foreground: 222.2 84% 4.9% (near black)
                    foreground: "hsl(222.2 84% 4.9%)",
                },
                primary: {
                    // --primary: 244 100% 50% (from theme.json primary color)
                    DEFAULT: "hsl(244 100% 50%)",
                    // --primary-foreground: 210 40% 98% (white with slight blue tint)
                    foreground: "hsl(210 40% 98%)",
                },
                secondary: {
                    // --secondary: 210 40% 96.1% (very light grayish blue)
                    DEFAULT: "hsl(210 40% 96.1%)",
                    // --secondary-foreground: 222.2 47.4% 11.2% (dark blue-gray)
                    foreground: "hsl(222.2 47.4% 11.2%)",
                },
                muted: {
                    // --muted: 210 40% 96.1% (very light grayish blue)
                    DEFAULT: "hsl(210 40% 96.1%)",
                    // --muted-foreground: 215.4 16.3% 46.9% (medium gray)
                    foreground: "hsl(215.4 16.3% 46.9%)",
                },
                accent: {
                    // --accent: 210 40% 96.1% (very light grayish blue)
                    DEFAULT: "hsl(210 40% 96.1%)",
                    // --accent-foreground: 222.2 47.4%, 11.2% (dark blue-gray)
                    foreground: "hsl(222.2 47.4%, 11.2%)",
                },
                destructive: {
                    // --destructive: 0 84.2% 60.2% (bright red)
                    DEFAULT: "hsl(0 84.2% 60.2%)",
                    // --destructive-foreground: 210 40% 98% (white with slight blue tint)
                    foreground: "hsl(210 40% 98%)",
                },
                // --border: 214.3 31.8% 91.4% (light gray)
                border: "hsl(214.3 31.8% 91.4%)",
                // --input: 214.3 31.8% 91.4% (light gray)
                input: "hsl(214.3 31.8% 91.4%)",
                // --ring: 244 100% 50% (from theme.json primary color)
                ring: "hsl(244 100% 50%)",
                chart: {
                    // Chart colors for data visualizations (graphs, charts, etc.)
                    // --chart-1: 244 100% 50% (primary blue, same as primary color)
                    "1": "hsl(244 100% 50%)",
                    // --chart-2: 280 100% 50% (purple)
                    "2": "hsl(280 100% 50%)",
                    // --chart-3: 320 100% 50% (pink)
                    "3": "hsl(320 100% 50%)",
                    // --chart-4: 180 100% 50% (cyan/teal)
                    "4": "hsl(180 100% 50%)",
                    // --chart-5: 42 100% 50% (yellow/orange)
                    "5": "hsl(42 100% 50%)",
                },
                sidebar: {
                    // Sidebar specific colors - these are only set when using a sidebar component
                    // --sidebar-background: 0 0% 100% (white in light mode, dark in dark mode)
                    DEFAULT: "hsl(0 0% 100%)",
                    // --sidebar-foreground: 222.2 84% 4.9% (dark text in light mode, light text in dark mode)
                    foreground: "hsl(222.2 84% 4.9%)",
                    // --sidebar-primary: 244 100% 50% (same as primary color)
                    primary: "hsl(244 100% 50%)",
                    // --sidebar-primary-foreground: 210 40% 98% (light text for primary buttons)
                    "primary-foreground": "hsl(210 40% 98%)",
                    // --sidebar-accent: 210 40% 96.1% (light accent color for hover states)
                    accent: "hsl(210 40% 96.1%)",
                    // --sidebar-accent-foreground: 222.2 47.4% 11.2% (dark text for accent backgrounds)
                    "accent-foreground": "hsl(222.2 47.4% 11.2%)",
                    // --sidebar-border: 214.3 31.8% 91.4% (light gray border color)
                    border: "hsl(214.3 31.8% 91.4%)",
                    // --sidebar-ring: 244 100% 50% (focus ring color, same as primary)
                    ring: "hsl(244 100% 50%)",
                },
            },
            // Animation keyframes definitions
            keyframes: {
                // Accordion open animation - starts at 0 height and expands to full content height
                // Uses Radix UI's dynamic variable --radix-accordion-content-height that automatically
                // calculates the appropriate height for the accordion content
                "accordion-down": {
                    from: {
                        height: "0", // Start collapsed (0 height)
                    },
                    to: {
                        // Expand to the calculated height of the accordion content
                        // --radix-accordion-content-height is set automatically by Radix UI
                        // height: "var(--radix-accordion-content-height)",
                        height: "max-height",
                    },
                },
                // Accordion close animation - reverses the open animation
                "accordion-up": {
                    from: {
                        // Start at full content height
                        // height: "var(--radix-accordion-content-height)",
                        height: "max-height",
                    },
                    to: {
                        height: "0", // Collapse to 0 height
                    },
                },
            },
            // Animation definitions that use the keyframes above
            animation: {
                // Smooth animation for accordion opening (expanding downward)
                // 0.2s duration with ease-out timing function for natural feel
                "accordion-down": "accordion-down 0.2s ease-out",
                // Smooth animation for accordion closing (collapsing upward)
                // 0.2s duration with ease-out timing function for natural feel
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
