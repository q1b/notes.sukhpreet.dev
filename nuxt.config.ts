// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
	// Define storage used in API routes with useStorage()
	experimental: {
		typedPages: true,
	},
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
		}
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
