<template>
	<ul
		v-show="!props.show"
		v-for="node in props.nodes"
		class="flex flex-col gap-y-2 pl-2 my-2"
	>
		<li :key="node.id" class="">
			<div class="flex items-center gap-x-2 justify-between">
				<button
					@click="
						() => {
							if (node.id === props.activeNodeId) {
								node.expanded = !node.expanded;
							}
							props.node.onClick(node);
						}
					"
					:class="{
						'bg-blue-500 text-white border-blue-500':
							node.id === props.activeNodeId,
						'border-slate-300': node.id !== props.activeNodeId,
					}"
					class="px-2 flex justify-between items-center border py-1 rounded-lg w-full text-start"
				>
					<span>{{ node.name }}</span>
					<span>{{ node?.nodes?.length }}</span>
				</button>
				<div class="flex items-center gap-x-1">
					<Dialog button-type="icon">
						<template v-slot:button>
							<PlusIcon class="w-5 h-5" />
						</template>
						<template v-slot="{ closeModal }">
							<NodeForm
								@submit="
									async ({ name, data }) => {
										props.node.getInsertNode(node)({
											name,
											data,
										});
										closeModal();
									}
								"
							/>
						</template>
					</Dialog>

					<button
						type="button"
						class="w-max p-1 rounded-md shadow-sm border transition-colors ease-in bg-white text-slate-600 border-slate-200/75 focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 focus-visible:bg-slate-100 focus-visible:text-slate-700 focus-visible:border-slate-300 focus-visible:ring-offset-white focus-visible:ring-slate-400/60 active:bg-slate-200 active:text-slate-700 active:border-slate-300 disabled:bg-white disabled:text-slate-400 disabled:border-slate-200 dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600/75 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-50 dark:focus-visible:bg-slate-600/80 dark:focus-visible:border-slate-600 dark:focus-visible:text-white dark:focus-visible:ring-offset-slate-800 dark:focus-visible:ring-slate-600 dark:active:bg-slate-600/80 dark:active:border-slate-600 dark:active:text-white dark:disabled:bg-slate-700 dark:disabled:border-slate-600 dark:disabled:text-slate-500 [-webkit-tap-highlight-color:transparent;] select-none outline-none"
						@click="
							() => {
								props.node.onDelete(node);
							}
						"
					>
						<TrashIcon class="w-5 h-5" />
					</button>
				</div>
			</div>
			<Sidebar
				:show="node.expanded"
				:node="{
					onClick: props.node.onClick,
					getInsertNode: props.node.getInsertNode,
					onDelete: props.node.onDelete,
				}"
				:active-node-id="props.activeNodeId"
				:nodes="node.nodes ?? []"
			/>
		</li>
	</ul>
</template>
<script lang="ts" setup>
import { PlusIcon, TrashIcon } from "@heroicons/vue/20/solid";
type Node = {
	id: string;
	expanded: boolean;
	name: string;
	data: string;
	nodes?: Node[];
};

const props = defineProps<{
	nodes: Node[];
	show?: boolean;
	activeNodeId?: string;
	node: {
		onClick: (node: Node) => void;
		getInsertNode: (node: Node) => (newNode: Node) => void;
		onDelete: (node: Node) => void;
	};
}>();
</script>
