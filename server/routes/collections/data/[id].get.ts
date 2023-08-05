const kv = useStorage();

export default defineEventHandler(async (event) => {
    const params = event.context.params;
    if (!params) return null
    const id = params['id']
    const res = await kv.getItem(`content:collection:${id}`) as { content: string; updated_at: string };
    return res
})