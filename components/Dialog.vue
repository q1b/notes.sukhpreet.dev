<template>
	<button
		type="button"
		@click="openModal"
		:class="{
			'p-1': props.buttonType === 'icon',
			'px-2.5 py-1': props?.buttonType === undefined,
		}"
		class="w-max rounded-md shadow-sm border transition-colors ease-in bg-white text-slate-600 border-slate-200/75 focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 focus-visible:bg-slate-100 focus-visible:text-slate-700 focus-visible:border-slate-300 focus-visible:ring-offset-white focus-visible:ring-slate-400/60 active:bg-slate-200 active:text-slate-700 active:border-slate-300 disabled:bg-white disabled:text-slate-400 disabled:border-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600/75 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-50 dark:focus-visible:bg-slate-600/80 dark:focus-visible:border-slate-600 dark:focus-visible:text-white dark:focus-visible:ring-offset-slate-800 dark:focus-visible:ring-slate-600 dark:active:bg-slate-600/80 dark:active:border-slate-600 dark:active:text-white dark:disabled:bg-slate-700 dark:disabled:border-slate-600 dark:disabled:text-slate-500 [-webkit-tap-highlight-color:transparent;] select-none outline-none"
	>
		<slot name="button"> Add Workspace </slot>
	</button>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center"
				>
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						>
							<slot :closeModal="closeModal" />
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
} from "@headlessui/vue";

const props = defineProps(["buttonType"]);

const isOpen = ref(false);

function closeModal() {
	isOpen.value = false;
}

function openModal() {
	isOpen.value = true;
}
</script>
