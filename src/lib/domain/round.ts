import { reactive } from 'vue'
import { Avdn } from './avdn'
import { BloodGlucose } from './blood_glucose'
import { BloodPressure } from './blood_pressure'
import { Hct } from './hct'
import { HeartRate } from './heart_rate'
import { Mucosas } from './mucosas'
import type { Parameter } from './parameter'
import { RespiratoryRate } from './respiratory_rate'
import { Temperature } from './temperature'
import { Trc } from './trc'
import type { MeasurementModel } from '../models/measurement'

export class Round {
    parameters: Parameter[]

    constructor() {
        this.parameters = []
    }

    static build(data: MeasurementModel[]) {
        const round = new Round()

        data.forEach((m) =>
            round
                .createHeartRate(m.name, m.value, m.issuedAt)
                .createRepiratoryRate(m.name, m.value, m.issuedAt)
                .createTrc(m.name, m.value, m.issuedAt)
                .createAvdn(m.name, m.value, m.issuedAt)
                .createMucosas(m.name, m.value, m.issuedAt)
                .createTemperature(m.name, m.value, m.issuedAt)
                .createBloodGlucose(m.name, m.value, m.issuedAt)
                .createHct(m.name, m.value, m.issuedAt)
                .createBloodPressure(m.name, m.value, m.issuedAt)
        )

        return round
    }

    createHeartRate(name?: string, value?: string, issuedAt?: string) {
        const heartRate = new HeartRate()

        if (!name) {
            this.parameters.push(heartRate)
            return this
        }

        if (heartRate.name !== name) return this

        if (value) heartRate.setValue(value)

        heartRate.setIssuedAt(issuedAt)

        this.parameters.push(heartRate)

        return this
    }

    createRepiratoryRate(name?: string, value?: string, issuedAt?: string) {
        const respiratoryRate = new RespiratoryRate()

        if (!name) {
            this.parameters.push(respiratoryRate)
            return this
        }

        if (respiratoryRate.name !== name) return this

        if (value) respiratoryRate.setValue(value)

        respiratoryRate.setIssuedAt(issuedAt)

        this.parameters.push(respiratoryRate)
        return this
    }

    createTrc(name?: string, value?: string, issuedAt?: string) {
        const trc = new Trc()

        if (!name) {
            this.parameters.push(trc)
            return this
        }

        if (trc.name !== name) return this

        if (value) trc.setValue(value)

        trc.setIssuedAt(issuedAt)

        this.parameters.push(trc)
        return this
    }

    createAvdn(name?: string, value?: string, issuedAt?: string) {
        const avdn = new Avdn()

        if (!name) {
            this.parameters.push(avdn)
            return this
        }

        if (avdn.name !== name) return this

        if (value) avdn.setValue(value)

        avdn.setIssuedAt(issuedAt)

        this.parameters.push(avdn)
        return this
    }

    createMucosas(name?: string, value?: string, issuedAt?: string) {
        const mucosas = new Mucosas()

        if (!name) {
            this.parameters.push(mucosas)
            return this
        }

        if (mucosas.name !== name) return this

        if (value) mucosas.setValue(value)

        mucosas.setIssuedAt(issuedAt)

        this.parameters.push(mucosas)
        return this
    }

    createTemperature(name?: string, value?: string, issuedAt?: string) {
        const temperature = new Temperature()

        if (!name) {
            this.parameters.push(temperature)
            return this
        }

        if (temperature.name !== name) return this

        if (value) temperature.setValue(value)

        temperature.setIssuedAt(issuedAt)

        this.parameters.push(temperature)
        return this
    }

    createBloodGlucose(name?: string, value?: string, issuedAt?: string) {
        const bloodGlucose = new BloodGlucose()

        if (!name) {
            this.parameters.push(bloodGlucose)
            return this
        }

        if (bloodGlucose.name !== name) return this

        if (value) bloodGlucose.setValue(value)

        bloodGlucose.setIssuedAt(issuedAt)

        this.parameters.push(bloodGlucose)
        return this
    }

    createHct(name?: string, value?: string, issuedAt?: string) {
        const hct = new Hct()

        if (!name) {
            this.parameters.push(hct)
            return this
        }

        if (hct.name !== name) return this

        if (value) hct.setValue(value)

        hct.setIssuedAt(issuedAt)

        this.parameters.push(hct)
        return this
    }

    createBloodPressure(name?: string, value?: string, issuedAt?: string) {
        const bloodPressure = new BloodPressure()

        if (!name) {
            this.parameters.push(bloodPressure)
            return this
        }

        if (bloodPressure.name !== name) return this

        if (value) bloodPressure.setValue(value)

        bloodPressure.setIssuedAt(issuedAt)

        this.parameters.push(bloodPressure)
        return this
    }

    reset() {
        this.parameters.forEach((p) => {
            p.value = ''
            p.required = true
            p.visibility = false
        })
    }

    get data() {
        return this.parameters
            .filter((parameter) => parameter.value)
            .map((parameter) => ({ [parameter.name]: { value: parameter.value } }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }
}

const dailyRound = reactive(
    new Round()
        .createHeartRate()
        .createRepiratoryRate()
        .createTrc()
        .createAvdn()
        .createMucosas()
        .createTemperature()
        .createBloodGlucose()
        .createHct()
        .createBloodPressure()
)

export default dailyRound
