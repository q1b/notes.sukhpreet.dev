// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
	// Define storage used in API routes with useStorage()
	vite: {
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
	},
	nitro: {
		storage: {
			notes: {
				driver: "cloudflare-kv-binding",
				binding: "NOTES",
			},
		},
		// Overwrite notes storage in development using FS
		devStorage: {
			notes: {
				driver: "fs",
				base: "./.data/notes",
			},
		},
	},
	devtools: false,
	components: [
		{
			path: "~/components",
		},
		{
			path: "~/ui",
		},
	],
	// Password to edit the notes
	runtimeConfig: {
		password: process.env.NUXT_PASSWORD || "nuxt",
	},
});
