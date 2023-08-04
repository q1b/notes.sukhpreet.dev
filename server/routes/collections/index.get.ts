const kv = useStorage();

export default eventHandler(async (event) => {
    const collections = await kv.getItem('collections$')

    return collections
})