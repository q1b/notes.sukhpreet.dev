import { createRouter, defineEventHandler, useBase } from "h3";
const router = createRouter();

const kv = useStorage();

/**
 * Types
 */
export type Workspace = { name: string; description: string };

(async () => {
	const keys = await kv.getKeys("workspace");
	console.log(`Keys:_${JSON.stringify(keys, null, 2)}_`);
	if (keys.length < 2) {
		await kv.setItem("workspace:alpha-1", {
			name: "alpha-1",
			description: "Some notes string",
		});
		await kv.setItem("workspace:alpha-2", {
			name: "alpha-2",
			description: "Some 2nd more string notes",
		});
	}
})();

router.get(
	"/",
	defineEventHandler(async () => {
		const keys = await kv.getKeys("workspace");
		const res = await Promise.all(
			keys.map((key) => {
				return kv.getItem(key) as Promise<Workspace>;
			}),
		);
		return res;
	}),
);

router.post(
	"/",
	defineEventHandler(async (event) => {
		const { name, description } = (await readBody(event)) as Workspace;
		await kv.setItem(`workspace:${name}`, { name, description });
		return { name, description };
	}),
);

router.delete(
	"/",
	defineEventHandler(async (event) => {
		const { name } = (await readBody(event)) as Workspace;
		await kv.removeItem(`workspace:${name}`);
		return { name };
	}),
);

export default useBase("/workspaces", router.handler);
