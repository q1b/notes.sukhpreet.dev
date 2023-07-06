<script lang="ts" setup>
import { useWorkspacesStore } from "~/stores/workspaces";
import { PlusIcon } from "@heroicons/vue/24/outline";
// import { useCountStore } from "~/stores/counter";
// const counter = useCountStore();
// const { pending, execute } = await useAsyncData(
// 	"count",
// 	() => counter.increment(),
// 	{
// 		server: false,
// 	},
// );
// <div class="text-6xl">{{ counter.count }}</div>
// 	<div>{{ pending ? "PENDING" : "NOT PENDING" }}</div>
// 	<Button @click="execute()">+</Button>
const workspaces = useWorkspacesStore();

const data = computed({
	get() {
		return workspaces.active.workspace.active.node.value.data;
	},
	set(v) {
		workspaces.active.workspace.active.node.value.data = v;
	},
});

const { pending: saving, execute } = await useAsyncData("data", () =>
	workspaces.active.workspace.active.node.updateData(data.value),
);
const selectedWorkspace = computed({
	get() {
		return workspaces.active.workspace.value;
	},
	set(v) {
		workspaces.setActive(v);
	},
});
const editing = ref(false);
</script>

<template>
	<header class="w-full max-w-3xl flex items-center justify-between py-4">
		<Select :workspaces="workspaces.value" v-model="selectedWorkspace" />
		<div class="flex items-center gap-x-1">
			<div>
				<ClientOnly>
					{{ saving ? "SAVING" : editing ? "EDITING" : "IDEL" }}
				</ClientOnly>
			</div>
			<Dialog>
				<template v-slot:button> Add Workspace </template>
				<template v-slot="{ closeModal }">
					<WorkspaceForm
						@submit="
							async ({ name, description }) => {
								await workspaces.add({ name, description });
								closeModal();
							}
						"
					/>
				</template>
			</Dialog>
			<Dropdown @delete="workspaces.del(selectedWorkspace)" />
		</div>
	</header>
	<main class="flex gap-x-2 w-full max-w-3xl">
		<div class="w-64 p-4 border h-full min-h-[112px] rounded-xl">
			<div class="flex items-center mb-4 justify-between">
				<h2 class="text-xl">
					{{ workspaces.active.workspace.value?.name }}
				</h2>
				<Dialog>
					<template v-slot:button>
						<PlusIcon class="w-5 h-5" />
					</template>
					<template v-slot="{ closeModal }">
						<NodeForm
							@submit="
								async ({ name, data }) => {
									await workspaces.active.workspace.notes.addToWorkspace(
										{
											name,
											data,
										},
									);
									closeModal();
								}
							"
						>
						</NodeForm>
					</template>
				</Dialog>
			</div>
			<div class="-ml-2">
				<Sidebar
					:node="{
						onClick(node) {
							workspaces.active.workspace.setNodeActive(node);
						},
						getInsertNode(node) {
							return (newNode) => {
								workspaces.active.workspace.notes.addToNode(
									node,
									newNode,
								);
							};
						},
						onDelete(node) {
							workspaces.active.workspace.active.node.delNode(
								node,
							);
						},
					}"
					:active-node-id="
						workspaces.active.workspace.active.node.value?.id
					"
					:nodes="workspaces.active.workspace.tree ?? []"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-y-2">
			<Tiptap
				v-model="data"
				v-model:editing-value="editing"
				@click.stop="() => (editing = true)"
				@blur="
					() => {
						editing = false;
						execute();
					}
				"
			/>
		</div>
	</main>
</template>
