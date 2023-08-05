<script setup lang="ts">
import type { Collection } from '~/composables/store';
import { TrashIcon } from "@heroicons/vue/20/solid";
import { watchDebounced, watchThrottled } from '@vueuse/core'

const { collection, index } = defineProps<{
    collection: Collection,
    index: number
}>()

const activeCollection = useCollection();

watch(
    () => collection.content,
    () => {
        const regex = /<h1.*?>(.*?)<\/h1>/;
        let m;
        if ((m = regex.exec(collection.content)) !== null) {
            // The result can be accessed through the `m`-variable.
            collection.label = m[1]
        }
    }
)

watchDebounced(
    () => collection.label,
    () => {
        const { content, ...data } = collection;
        $fetch(`/collections/${collection.id}`, {
            method: 'PUT',
            body: data
        })
    },
    { debounce: 1000 },
)
const editing = ref(false);
const handleClick = () => {
    if (activeCollection.value?.id === collection.id) {
        editing.value = true;
    }
}
</script>

<template>
    <div class="inline-flex relative w-full items-center gap-x-2">
        <input :readonly="!editing" @blur="editing = false" @dblclick="handleClick" :class="cn('rounded-lg cursor-pointer border-none w-full border-transparent px-1.5 py-0.5 bg-slate-500/10 text-slate-900',
            {
                'text-blue-700 bg-blue-100': activeCollection?.id === collection.id,
                'bg-white text-blue-900': editing,
            })" @click="() => {
        activeCollection = { ...collection, index }
    }" v-model="collection.label" />
        <!-- <button class="p-2 scale-95 hover:scale-100 transition-colors bg-slate-100 rounded-lg group hover:bg-rose-100">
            <TrashIcon class="w-5 h-5 text-slate-500 group-hover:text-rose-500" />
        </button> -->
    </div>
</template>
