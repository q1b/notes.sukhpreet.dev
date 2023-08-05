const kv = useStorage();

const delay = async <T>(timeout: number, value?: T) => {
    return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
            resolve(value);
            clearTimeout(timeoutId);
        }, timeout);
    });
};
// in increading order 2020, 2021
function dateComparison(a: string, b: string) {
    const date1 = new Date(a)
    const date2 = new Date(b)

    return date1.getTime() - date2.getTime();
}

export default defineEventHandler(async () => {
    const res = (await kv.getItems((await kv.getKeys(`collection`)))).sort((a, b) => dateComparison(a.value.created_at, b.value.created_at))
        .map((v, i) => ({
            id: v.key,
            ...(v.value as { label: string; summary: string; created_at: string; content: string })
        }))
    await delay(100)
    return res
})