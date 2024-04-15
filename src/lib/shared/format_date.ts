export function formatDate(value?: string, timeStyle?: string) {
    const dateStyle = 'long'
    const timeZone = 'Africa/Luanda'

    if (!value) return 'N/D'

    if (!timeStyle) {
        return new Intl.DateTimeFormat('pt-PT', {
            dateStyle,
            timeZone
        }).format(new Date(value))
    }

    return new Intl.DateTimeFormat('pt-PT', {
        dateStyle,
        timeStyle: timeStyle as any,
        timeZone
    }).format(new Date(value))
}
