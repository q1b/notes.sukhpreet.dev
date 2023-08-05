const kv = useStorage();

export default defineEventHandler(async (event) => {
    const params = event.context.params;
    if (!params) return null
    const id = params['id']
    // Force being a string (CF workers always returns a Buffer)
    const body = await readBody(event)
    const res = await kv.setItem(`content:collection:${id}`, { content: body, updated_at: (new Date()).toISOString() });
    return res
})