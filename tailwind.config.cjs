const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: "class",
	content: [
		'./pages/**/*.{vue,ts}',
		'./components/**/*.{ts,vue}',
		'./ui/**/*.{vue,ts}',
		'./app.vue',
	],
	extends: {
		theme: {
			fontFamily: {
				sans: ["InterVar", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
	],
};
