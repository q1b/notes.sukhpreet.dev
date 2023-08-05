<script lang="ts" setup>
import { nanoid } from "nanoid"
import { ArrowPathIcon } from "@heroicons/vue/20/solid"

const collections = useCollections();
const { data, refresh, pending } = await useFetch('/collections', {
	server: true
})

data?.value && (collections.value = data.value)

const isEmpty = computed(() => collections.value.length === 0);

const collection = useCollection();
if (!isEmpty.value)
	collection.value = { ...collections.value[0], index: 0 };

onMounted(() => {
	const activeIndex = +`${window.localStorage.getItem('active_collection_index')}` as number;
	if (activeIndex !== undefined && activeIndex !== null && !isEmpty.value) {
		collection.value = { ...collections.value[activeIndex], index: activeIndex }
	}
})

const newCollection = async () => {
	const id = nanoid(6);
	const label = `Unitiled - ${id}`
	const value = {
		id,
		label,
		summary: 'Summary ...',
		index: collections.value.length,
		content: `${label}`
	}
	collections.value?.push(value);
	collection.value = { ...collections.value[collections.value.length - 1], index: collections.value.length - 1 };
	const { data } = await useFetch(`/collections/${id}`, {
		method: 'PUT',
		body: value
	})
}

watch(() => collection.value?.index, (v) => {
	window.localStorage.setItem('active_collection_index', `${v}`)
})
</script>

<template>
	<main class="flex w-full gap-x-4 p-12 min-h-screen">
		<aside class="min-w-[196px]">
			<div class="flex items-center justify-between mb-4">
				<span>Collections</span>
				<div class="flex gap-x-1">
					<Button @click="newCollection" class="p-1">
						<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M10.07 6.00088H17.75C18.5783 6.00201 19.3749 6.31935 19.9771 6.88808C20.5793 7.45681 20.9416 8.234 20.99 9.06088L21 9.25088V16.7509C20.9987 17.5808 20.68 18.3788 20.1092 18.9812C19.5383 19.5837 18.7587 19.9449 17.93 19.9909H10.25C9.42172 19.9897 8.62511 19.6724 8.02293 19.1037C7.42074 18.5349 7.05843 17.7578 7.01001 16.9309L7.00001 16.7509V9.25088C6.99874 8.41922 7.31633 7.61872 7.88742 7.01415C8.45851 6.40957 9.23963 6.04694 10.07 6.00088ZM17.75 7.50088H10.25C9.33001 7.50088 8.58001 8.20088 8.51001 9.10088L8.50001 9.25088V16.7509C8.50001 17.6709 9.20001 18.4209 10.1 18.4909H17.75C18.67 18.4909 19.42 17.7909 19.49 16.8909L19.5 16.7509V9.25088C19.5 8.28088 18.72 7.50088 17.75 7.50088ZM14 9.00088C14.41 9.00088 14.75 9.34088 14.75 9.75088V12.2509H17.25C17.4489 12.2509 17.6397 12.3299 17.7803 12.4705C17.921 12.6112 18 12.802 18 13.0009C18 13.1998 17.921 13.3906 17.7803 13.5312C17.6397 13.6719 17.4489 13.7509 17.25 13.7509H14.75V16.2509C14.75 16.4498 14.671 16.6406 14.5303 16.7812C14.3897 16.9219 14.1989 17.0009 14 17.0009C13.8011 17.0009 13.6103 16.9219 13.4697 16.7812C13.329 16.6406 13.25 16.4498 13.25 16.2509V13.7509H10.75C10.5511 13.7509 10.3603 13.6719 10.2197 13.5312C10.079 13.3906 10 13.1998 10 13.0009C10 12.802 10.079 12.6112 10.2197 12.4705C10.3603 12.3299 10.5511 12.2509 10.75 12.2509H13.25V9.75088C13.25 9.34088 13.59 9.00088 14 9.00088ZM14.58 2.23088L14.63 2.41088L15.33 5.00088H13.77L13.19 2.80088C13.1308 2.57794 13.0282 2.36889 12.888 2.18576C12.7477 2.00263 12.5727 1.84903 12.3729 1.73379C12.1731 1.61855 11.9524 1.54395 11.7237 1.51428C11.495 1.4846 11.2626 1.50044 11.04 1.56088L3.80001 3.50088C3.37613 3.61432 3.01033 3.88286 2.77511 4.25329C2.53989 4.62371 2.45241 5.06899 2.53001 5.50088L2.56001 5.64088L4.50001 12.9009C4.70001 13.6209 5.30001 14.1109 6.00001 14.1909V15.6909C5.34864 15.6532 4.72368 15.4204 4.20646 15.0227C3.68923 14.6249 3.3037 14.0807 3.10001 13.4609L3.05001 13.2909L1.11001 6.04088C0.660012 4.37088 1.61001 2.65088 3.23001 2.12088L3.41001 2.06088L10.65 0.120876C12.33 -0.329124 14.05 0.620876 14.58 2.24088V2.23088Z"
								fill="#1E293B" />
						</svg>
					</Button>
					<Button @click="refresh()" class="p-1">
						<ArrowPathIcon :class="{ 'animate-spin': pending }" class="w-5 h-5" />
					</Button>
				</div>
			</div>
			<div class="flex flex-col gap-y-2 gap-x-2">
				<CollectionItem v-for="item, key in collections" :key="key" :collection="item" :index="key" />
			</div>
		</aside>
		<div class="grow w-full bg-slate-50 rounded-xl p-4">
			<template v-if="collection && !isEmpty">
				<div class="w-full p-8 text-4xl font-bold text-slate-800">
					<Editor v-model="collections[collection.index].content" />
				</div>
			</template>
			<template v-else-if="isEmpty">
				<Button @click="newCollection" class="w-full underline p-8 text-4xl font-bold text-slate-500">
					Create a Collection
				</Button>
			</template>
			<template v-else>
				<div class="w-full p-8 text-4xl font-bold text-slate-500">
					Select a Collection
				</div>
			</template>
		</div>
	</main>
</template>