const TIME_ZONE = 'Africa/Luanda'

export function formatDate(value?: string) {
    if (!value) return 'N/D'

    return new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeZone: TIME_ZONE
    }).format(new Date(value))
}

// O input type=date só aceita YYYY-MM-DD; a API pode devolver a data completa.
export function toDateInputValue(value?: string) {
    if (!value) return ''

    return value.substring(0, 10)
}

export function formatTime(value?: string) {
    if (!value) return 'N/D'

    return new Intl.DateTimeFormat('pt-PT', {
        timeStyle: 'short',
        timeZone: TIME_ZONE
    }).format(new Date(value))
}
