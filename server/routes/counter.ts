import { createRouter, defineEventHandler, useBase } from "h3";

const router = createRouter();

const kv = useStorage();

router.get(
	"/",
	defineEventHandler(async (event) => await kv.getItem("count")),
);

router.put(
	"/",
	defineEventHandler(async (event) => {
		const count = (await readBody(event)) as { value: number };
		await kv.setItem("count", count?.value);
		return count?.value;
	}),
);

export default useBase("/counter", router.handler);
