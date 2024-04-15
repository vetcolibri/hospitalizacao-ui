export function convertInSeconds(rate: number, unit: string) {
    switch (unit) {
        case 'minutes':
            return rate * 60
        case 'hours':
            return rate * 3600
        default:
            return rate
    }
}
