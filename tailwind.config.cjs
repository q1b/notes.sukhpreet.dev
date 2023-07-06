const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: "class",
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
