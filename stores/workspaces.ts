// stores/WorkspaceStore.ts
import { acceptHMRUpdate, defineStore } from "pinia";
import type { Workspace } from "~/server/routes/workspaces";
import { toRaw } from "vue";

export type Node = {
	id: string;
	name: string;
	data: string;
	parent?: string;
	nodes?: Node[];
};
function toTree(arr: (Node & { expanded: boolean })[]) {
	arr = arr.map((item) => ({ ...item, expanded: false }));
	let arrMap = new Map(arr.map((item) => [item.id, item]));
	let tree = [];
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if (item.parent) {
			let parentItem = arrMap.get(item.parent);
			if (parentItem) {
				// let { children } = parentItem;
				if (parentItem?.nodes) {
					parentItem.nodes.push(item);
				} else {
					parentItem.nodes = [item];
				}
			}
		} else tree.push(item);
	}
	return tree;
}
// no need to import defineStore and acceptHMRUpdate
export const useWorkspacesStore = defineStore("workspaces", () => {
	const workspaces = ref<Workspace[]>([]);
	const workspace = reactive<
		{
			nodes: Node[];
		} & Workspace
	>({
		name: "",
		description: "",
		nodes: [],
	});
	const node = reactive<Node>({
		name: "",
		data: "",
		id: "",
	});
	const tree = ref<(Node & { expanded: boolean })[]>([]);

	watch(
		() => workspace.nodes,
		(nodes) =>
			(tree.value = toTree(JSON.parse(JSON.stringify(toRaw(nodes))))),
		{ deep: true },
	);

	async function init() {
		const { data } = await useFetch<Workspace[]>("/workspaces");
		if (data?.value) {
			workspaces.value = data.value;
			workspace.name = data.value[0].name;
			workspace.description = data.value[0].description;
			workspace.nodes = [];
		}
	}

	(async () => {
		await init();
		const item = localStorage.getItem("activeWorkspace");
		if (item !== null) {
			const res = JSON.parse(item) as Workspace;
			setActive(res);
			node.data = workspace.nodes[0]?.data ?? "";
			node.id = workspace.nodes[0]?.id ?? "";
			node.name = workspace.nodes[0]?.name ?? "";
			node.nodes = workspace.nodes[0]?.nodes ?? [];
			node.parent = workspace.nodes[0]?.parent ?? "";
		}
	})();

	async function add(workspace: Workspace) {
		const { data } = await useFetch<Workspace>("/workspaces", {
			method: "POST",
			body: workspace,
		});

		if (data?.value) {
			const s = workspaces.value.findIndex(
				(v) => v.name === data.value?.name,
			);
			if (s === -1) {
				workspaces.value.push(data.value);
				setActive(data.value);
			} else {
				workspaces.value[s].description = data.value.description;
			}
		}
	}

	async function del(workspace: Workspace) {
		const { data } = await useFetch<Workspace>("/workspaces", {
			method: "DELETE",
			body: {
				name: workspace.name,
			},
		});

		if (data?.value) {
			const index = workspaces.value.findIndex(
				(v) => v.name === data.value?.name,
			);
			if (index > -1) {
				if (workspaces.value[index - 1]) {
					setActive(workspaces.value[index - 1]);
				} else if (workspaces.value[index + 1]) {
					setActive(workspaces.value[index + 1]);
				} else {
					workspace.name = "None";
				}
				workspaces.value.splice(index, 1);
			}
		}
	}

	async function setActive({ name, description }: Workspace) {
		const { data } = await useFetch<Node[]>(`/workspaces/${name}`);
		localStorage.setItem(
			"activeWorkspace",
			JSON.stringify({
				nodes: data.value,
				name,
				description,
			}),
		);
		if (data?.value) {
			workspace.nodes = data.value;
			workspace.name = name;
			workspace.description = description;
			if (data.value.length !== 0) setActiveNode(data.value[0]);
		}
	}

	async function setActiveNode(n: Node) {
		// const { data } = await useFetch<Node[]>(
		// 	`/workspaces/${workspace?.name}/${node.id}`,
		// );
		// console.log(data.value);
		node.data = n?.data ?? "";
		node.id = n?.id ?? "";
		node.name = n?.name ?? "";
		node.nodes = n?.nodes ?? [];
		node.parent = n?.parent ?? "";
	}

	async function addNodeToWorkspace(
		node: Node | Omit<Node, "id" | "nodes" | "parent">,
	) {
		const { data } = await useFetch<Node>(
			`/workspaces/${workspace?.name}`,
			{
				method: "POST",
				body: node,
			},
		);
		if (data?.value) {
			workspace?.nodes.push(data.value);
		}
	}

	async function addNodeToNodes(refNode: Node, node: Node) {
		const { data } = await useFetch<Node>(
			`/workspaces/${workspace?.name}/${refNode.id}`,
			{
				method: "POST",
				body: {
					name: node.name,
					data: node.data,
				},
			},
		);
		if (data?.value) {
			workspace?.nodes.push(data.value);
		}
	}

	async function updateData(newData: string) {
		node.data = newData;
		const { data } = await useFetch<Node>(
			`/workspaces/${workspace?.name}/${node?.id}`,
			{
				method: "PUT",
				body: {
					name: node.name,
					parent: node.parent,
					data: node.data,
					id: node.id,
				},
			},
		);
		console.log(data.value, node);
	}

	async function delNode(refNode: Node) {
		const { data } = await useFetch<Node>(
			`/workspaces/${workspace?.name}/${refNode?.id}`,
			{
				method: "DELETE",
				body: {
					name: refNode.name,
					parent: refNode.parent,
					data: refNode.data,
					id: refNode.id,
				},
			},
		);
		const index = workspace.nodes.findIndex(
			(v) => v.name === refNode?.name,
		);
		if (index > -1) {
			if (workspace.nodes[index - 1]) {
				setActiveNode(workspace.nodes[index - 1]);
			} else if (workspace.nodes[index + 1]) {
				setActiveNode(workspace.nodes[index + 1]);
			} else {
				workspace.name = "None";
			}
			workspace.nodes.splice(index, 1);
		}
	}

	return {
		value: workspaces,
		active: {
			workspace: {
				value: workspace,
				tree,
				active: { node: { value: node, updateData, delNode } },
				notes: {
					addToWorkspace: addNodeToWorkspace,
					addToNode: addNodeToNodes,
				},
				setNodeActive: setActiveNode,
			},
		},
		setActive,
		add,
		del,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useWorkspacesStore, import.meta.hot),
	);
}
