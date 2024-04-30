export function convert(seconds: number) {
    if (seconds >= 60 && seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    }

    const hours = Math.floor(seconds / 3600)
    return `${hours} hora${hours > 1 ? 's' : ''}`
}
