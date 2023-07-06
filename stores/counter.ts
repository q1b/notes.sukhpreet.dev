// stores/CountStore.ts
import { acceptHMRUpdate, defineStore } from "pinia";
// no need to import defineStore and acceptHMRUpdate
export const useCountStore = defineStore("counter", () => {
	const count = ref(0);

	async function init() {
		const { data } = await useFetch<number>("/counter");
		data?.value && (count.value = data.value);
	}

	(async () => {
		await init();
	})();

	async function increment() {
		const { data } = await useFetch<number>("/counter", {
			method: "PUT",
			body: {
				value: count.value + 1,
			},
		});
		data?.value && (count.value = data.value);
		return data.value;
	}
	return { count, increment, init };
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCountStore, import.meta.hot));
}
