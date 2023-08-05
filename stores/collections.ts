// stores/collections.ts
import { Collection } from "composables/store";
import { nanoid } from "nanoid";
import { acceptHMRUpdate, defineStore } from "pinia";

const collections = ref<Collection[]>([]);
const collection = ref<Collection & { index: number; }>();

// no need to import defineStore and acceptHMRUpdate
export const useCollectionsStore = defineStore("collections", () => {

    async function init() {
        const { data } = await useFetch("/collections");
        if (data?.value) {
            collections.value = data.value
            collection.value = {
                ...collections.value[0],
                index: 0
            }
        }
    }
    if (collection.value === undefined) {
        (async () => {
            await init();
        })();
    }
    async function newCollection() {
        const id = nanoid(6);
        const label = `Unitiled - ${id}`
        collection.value = {
            id,
            label,
            summary: 'Summary ...',
            index: collections.value.length - 1,
        }
        collections.value?.push(collection.value);
        const { data } = await useFetch(`/collections/${id}`, {
            method: 'PUT',
            body: collection.value
        })
        data?.value && console.log('Fetched')
        return collections.value;
    }
    return { collections, collection, newCollection, init };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCollectionsStore, import.meta.hot));
}
