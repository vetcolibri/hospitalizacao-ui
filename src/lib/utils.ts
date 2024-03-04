import type { RepeatEvery } from './models/repeat_every'

export function convertToSeconds(repeatEvery: RepeatEvery) {
    const { rate, unity } = repeatEvery
    switch (unity) {
        case 'minutes':
            return rate * 60
        case 'hours':
            return rate * 3600
        default:
            return rate
    }
}
