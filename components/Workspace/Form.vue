<template>
	<div class="flex flex-col gap-y-2">
		<input type="text" placeholder="Name of Workspace" v-model="name" />
		<textarea
			type="text"
			placeholder="Description of Workspace"
			v-model="description"
		></textarea>
		<Button
			class="w-full form-input bg-black text-white"
			@click="
				async () => {
					await props.onSubmit({ name, description });
				}
			"
		>
			Submit
		</Button>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	onSubmit: (params: { name: string; description: string }) => Promise<void>;
	defaults?: {
		name: string;
		description: string;
	};
}>();
const name = ref(props.defaults?.name ?? "");
const description = ref(props.defaults?.description ?? "");
</script>
