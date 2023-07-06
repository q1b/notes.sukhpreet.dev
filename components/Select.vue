<template>
	<Listbox v-model="selectedWorkspace" v-slot="{ open }">
		<div class="relative mt-1">
			<ListboxButton
				class="w-40 text-left pl-2 py-1 pr-10 rounded-lg shadow-sm border transition-colors ease-in bg-white text-slate-600 border-slate-200/75 focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 focus-visible:bg-slate-100 focus-visible:text-slate-700 focus-visible:border-slate-300 focus-visible:ring-offset-white focus-visible:ring-slate-400/60 active:bg-slate-200 active:text-slate-700 active:border-slate-300 disabled:bg-white disabled:text-slate-400 disabled:border-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600/75 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-50 dark:focus-visible:bg-slate-600/80 dark:focus-visible:border-slate-600 dark:focus-visible:text-white dark:focus-visible:ring-offset-slate-800 dark:focus-visible:ring-slate-600 dark:active:bg-slate-600/80 dark:active:border-slate-600 dark:active:text-white dark:disabled:bg-slate-700 dark:disabled:border-slate-600 dark:disabled:text-slate-500 [-webkit-tap-highlight-color:transparent;] select-none outline-none"
			>
				<span class="block truncate">{{
					selectedWorkspace?.name
				}}</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
				>
					<ChevronUpDownIcon
						class="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</span>
			</ListboxButton>

			<TransitionRoot
				:show="open"
				enter="transition duration-100 ease-out"
				enter-from="transform scale-95 opacity-0"
				enter-to="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leave-from="transform scale-100 opacity-100"
				leave-to="transform scale-95 opacity-0"
			>
				<ListboxOptions
					static
					class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-0.5 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="person in props.workspaces"
						:key="person.name"
						:value="person"
						as="template"
					>
						<li
							:class="[
								active ? 'bg-slate-100' : 'text-gray-900',
								'relative px-2 py-1 m-1 border rounded-md cursor-default select-none',
							]"
						>
							<span
								:class="[
									selected ? 'font-bold' : 'font-normal',
									'block truncate',
								]"
								>{{ person.name }}</span
							>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</TransitionRoot>
		</div>
	</Listbox>
</template>

<script lang="ts" setup>
import {
	Listbox,
	ListboxLabel,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
	TransitionRoot,
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { Workspace } from "~/server/routes/workspaces";

const props = defineProps<{
	workspaces: Workspace[];
}>();

const selectedWorkspace = defineModel<Workspace>();
</script>
