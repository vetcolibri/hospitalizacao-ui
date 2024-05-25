import { formatDate } from './shared/format_date'

export const vLatestMeasurement = {
    mounted: latestMeasurement
}

function latestMeasurement(el: HTMLSpanElement, binding: { value: string }) {
    el.innerHTML = `Ultima medição: ${formatDate(binding.value)}`
}
