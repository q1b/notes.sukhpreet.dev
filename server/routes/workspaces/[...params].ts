import { nanoid } from "nanoid/non-secure";

const router = createRouter();

const kv = useStorage();

type Node = {
	id: string;
	name: string;
	data: string;
	parent: undefined | string;
};

router.get(
	"/:workspace",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const keys = await kv.getKeys(`workspace-${workspace_name}-node`);
		const res = await Promise.all(
			keys.map((key) => {
				return kv.getItem(key) as Promise<Node>;
			}),
		);
		return res;
	}),
);

router.post(
	"/:workspace",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const { name, data } = (await readBody(event)) as Node;
		const id = nanoid(6);
		await kv.setItem(`workspace-${workspace_name}-node:${id}`, {
			id,
			name,
			data,
			parent: undefined,
		});
		const res = (await kv.getItem(
			`workspace-${workspace_name}-node:${id}`,
		)) as Node;
		return res;
	}),
);

// workspace-${workspace_name}-node:${name} -> node-${node_k}:${node_g}

router.get(
	"/:workspace/:node",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const node_id = event.context.params?.node;
		const keys = await kv.getKeys(
			`workspace-${workspace_name}-node:${node_id}`,
		);
		const res = await Promise.all(
			keys.map((key) => {
				return kv.getItem(key) as Promise<Node>;
			}),
		);
		return res;
	}),
);

router.post(
	"/:workspace/:node",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const node_id = event.context.params?.node;
		const { name, data } = (await readBody(event)) as Node;
		const id = nanoid(6);
		await kv.setItem(`workspace-${workspace_name}-node:${node_id}:${id}`, {
			id,
			name,
			data,
			parent: node_id,
		});
		const res = (await kv.getItem(
			`workspace-${workspace_name}-node:${node_id}:${id}`,
		)) as Node;
		return res;
	}),
);

router.put(
	"/:workspace/:node",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const node_id = event.context.params?.node;
		const { name, data, parent, id } = (await readBody(event)) as Node;
		console.log("Recevied Data", data, "PARENT", parent);
		if (!!parent) {
			await kv.setItem(
				`workspace-${workspace_name}-node:${parent}:${node_id}`,
				{
					id,
					name,
					data,
					parent,
				},
			);
			const res = (await kv.getItem(
				`workspace-${workspace_name}-node:${node_id}:${id}`,
			)) as Node;
			return res;
		} else {
			await kv.setItem(`workspace-${workspace_name}-node:${id}`, {
				id,
				name,
				data,
				parent: undefined,
			});
			const res = (await kv.getItem(
				`workspace-${workspace_name}-node:${id}`,
			)) as Node;
			return res;
		}
	}),
);

router.delete(
	"/:workspace/:node",
	defineEventHandler(async (event) => {
		const workspace_name = event.context.params?.workspace;
		const node_id = event.context.params?.node;
		const { parent, id } = (await readBody(event)) as Node;
		if (!!parent) {
			await kv.removeItem(
				`workspace-${workspace_name}-node:${parent}:${node_id}`,
			);
			return { status: 200 };
		} else {
			await kv.removeItem(`workspace-${workspace_name}-node:${id}`);
			return { status: 200 };
		}
	}),
);

export default useBase("/workspaces", router.handler);
