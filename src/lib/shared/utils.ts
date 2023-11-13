import type { Measurement } from '@/models/measurement'
import { PARAMETERS_NAME, PARAMETERS_UNITY } from '../data/parameters'

export function lastMeasurement(parameter: string, measurements: Measurement[]) {
    const measurement = measurements.find((measurement: any) => measurement.name === parameter)
    if (measurement) return measurement
}

export function makeDateFormat(date: Date) {
    let month = makeMonthFormat(date)
    const firstCharacter = month.charAt(0).toUpperCase()
    month = firstCharacter + month.slice(1)
    return `${makeDayFormat(date)} ${month} ${makeYearFormat(date)}`
}

export function makeHourFormat(date: Date) {
    return makeDateTimeFormat('pt-PT', { timeStyle: 'short' }).format(date)
}

export function timeFromString(time: string) {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    const parts = time.split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    return new Date(year, month, day, hours, minutes)
}

function makeDayFormat(date: Date) {
    return makeDateTimeFormat('pt-PT', { day: '2-digit' }).format(date)
}

function makeMonthFormat(date: Date) {
    return makeDateTimeFormat('pt-PT', { month: 'short' }).format(date)
}

function makeYearFormat(date: Date) {
    return makeDateTimeFormat('pt-PT', { year: 'numeric' }).format(date)
}

function makeDateTimeFormat(locals: string, options: Object) {
    return new Intl.DateTimeFormat(locals, options)
}

export const vLastMeasurement = {
    mounted: lastMeasurementFormat
}

function lastMeasurementFormat(el: HTMLSpanElement, binding: { value: string }) {
    const date = new Date(binding.value)
    const day = makeDateFormat(date)
    const hour = makeHourFormat(date)
    el.innerHTML = `Ultimas medições: ${day}, ${hour}`
}

export function findParameterName(name: string) {
    const result = Object.entries(PARAMETERS_NAME).find((item) => item[0] === name)
    if (!result) return
    return result[1]
}

export function findParameterUnity(name: string) {
    const result = Object.entries(PARAMETERS_UNITY).find((item) => item[0] === name)
    if (!result) return
    return result[1]
}

export function getLatestMeasurement(parameter: string, measurements: Measurement[]) {
    if (measurements.length === 0) {
        return
    }

    for (let measurement of measurements) {
        if (measurement.name === parameter) {
            return {
                value: measurement.value,
                issuedAt: measurement.issuedAt
            }
        }
    }
}
