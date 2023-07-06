<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton
				class="w-max py-1.5 px-1 rounded-md shadow-sm border transition-colors ease-in bg-white text-slate-600 border-slate-200/75 focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 focus-visible:bg-slate-100 focus-visible:text-slate-700 focus-visible:border-slate-300 focus-visible:ring-offset-white focus-visible:ring-slate-400/60 active:bg-slate-200 active:text-slate-700 active:border-slate-300 disabled:bg-white disabled:text-slate-400 disabled:border-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600/75 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-50 dark:focus-visible:bg-slate-600/80 dark:focus-visible:border-slate-600 dark:focus-visible:text-white dark:focus-visible:ring-offset-slate-800 dark:focus-visible:ring-slate-600 dark:active:bg-slate-600/80 dark:active:border-slate-600 dark:active:text-white dark:disabled:bg-slate-700 dark:disabled:border-slate-600 dark:disabled:text-slate-500 [-webkit-tap-highlight-color:transparent;] select-none outline-none"
			>
				<EllipsisVerticalIcon
					class="h-5 w-5 text-slate-800"
					aria-hidden="true"
				/>
			</MenuButton>
		</div>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<MenuItems
				class="absolute z-10 right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			>
				<div class="px-1 py-1">
					<MenuItem v-slot="{ active }">
						<button
							disabled
							:class="[
								active
									? 'bg-blue-500 text-white'
									: 'text-gray-900',
								'group cursor-default opacity-20 flex w-full items-center rounded-md px-2 py-2 text-sm',
							]"
						>
							<PencilIcon
								class="mr-2 h-5 w-5"
								aria-hidden="true"
							/>
							Edit Description
						</button>
					</MenuItem>
				</div>
				<div class="px-1 py-1">
					<MenuItem v-slot="{ active }">
						<button
							:class="[
								active
									? 'bg-rose-500 text-white'
									: 'text-gray-900',
								'group flex w-full items-center rounded-md px-2 py-2 text-sm',
							]"
							@click="props.onDelete"
						>
							<TrashIcon
								class="mr-2 h-5 w-5 h-5 w-5"
								aria-hidden="true"
							/>
							Delete
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
	EllipsisVerticalIcon,
	TrashIcon,
	PencilIcon,
} from "@heroicons/vue/20/solid";

const props = defineProps<{
	onDelete: () => void;
}>();
</script>
