export function getCurrentDate(value?: string) {
    if (!value) return

    if (value === '') return ''

    return new Date(value).toISOString().slice(0, 10)
}
