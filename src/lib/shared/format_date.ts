const TIME_ZONE = 'Africa/Luanda'

export function formatDate(value?: string) {
    if (!value) return 'N/D'

    return new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeZone: TIME_ZONE
    }).format(new Date(value))
}

export function formatTime(value?: string) {
    if (!value) return 'N/D'

    return new Intl.DateTimeFormat('pt-PT', {
        timeStyle: 'short',
        timeZone: TIME_ZONE
    }).format(new Date(value))
}
