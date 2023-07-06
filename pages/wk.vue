<script lang="ts" setup>
import { useWorkspacesStore } from "~/stores/workspaces";
import { PencilIcon } from "@heroicons/vue/24/outline";
const router = useRouter();

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
</script>

<template>
	<header class="w-full max-w-3xl flex items-center justify-between p-4">
		<div>Workspaces</div>
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
	</header>
	<div class="w-full max-w-3xl p-4 mt-16 flex gap-4 flex-wrap">
		<template v-for="workspace in workspaces.value">
			<div
				class="p-4 flex gap-y-2 relative flex-col justify-between border rounded-xl w-64"
			>
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl text-slate-600 font-bold">
						{{ workspace?.name }}
					</h1>
					<p class="text-sm text-black/70">
						{{ workspace?.description }}
					</p>
				</div>
				<div class="flex w-full gap-x-4">
					<Dialog>
						<template v-slot:button>
							<PencilIcon class="w-5 h-5" />
						</template>
						<template v-slot="{ closeModal }">
							<WorkspaceForm
								:defaults="{
									name: workspace?.name,
									description: workspace.description,
								}"
								@submit="
									async ({ name, description }) => {
										await workspaces.add({
											name,
											description,
										});
										closeModal();
									}
								"
							/>
						</template>
					</Dialog>
					<button
						class="px-4 py-1 border hover:bg-black hover:text-white rounded-full"
						:class="{
							'border-black':
								workspace.name ===
								workspaces.active.workspace?.value?.name,
						}"
						@click="
							() => {
								workspaces.setActive(workspace);
								router.push({ path: `/${workspace.name}` });
							}
						"
					>
						Link
					</button>
				</div>
			</div>
		</template>
	</div>
</template>
