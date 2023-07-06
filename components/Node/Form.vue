<template>
	<div class="flex flex-col gap-y-2">
		<input type="text" placeholder="Name of Node" v-model="name" />
		<textarea
			type="text"
			placeholder="Data for Node"
			v-model="data"
		></textarea>
		<Button
			class="w-full form-input bg-black text-white"
			@click="
				async () => {
					await props.onSubmit({ name, data });
				}
			"
		>
			Submit
		</Button>
	</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
	onSubmit: (params: { name: string; data: string }) => Promise<void>;
}>();
const name = ref("");
const data = ref("");
</script>
