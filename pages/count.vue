<script lang="ts" setup>
import { useCountStore } from "~/stores/counter";
const counter = useCountStore();
const { pending, execute } = await useAsyncData(
	"count",
	() => counter.increment(),
	{
		server: false,
	},
);
</script>

<template>
	<div class="text-6xl">{{ counter.count }}</div>
	<div>{{ pending ? "PENDING" : "NOT PENDING" }}</div>
	<Button @click="execute()">+</Button>
</template>