import { createRouter, createWebHistory } from 'vue-router'

import ExamGeneralCondition from '@/views/ExamGeneralCondition.vue'

const routes = [
    {
        path: '/',
        name: 'ExamGeneralCondition',
        component: ExamGeneralCondition
    },
    {
        path: '/choose-patient/:page',
        name: 'ChoosePatient',
        component: () => import('@/views/ChoosePatient.vue')
    },
    {
        path: '/daily-round/:patientId',
        name: 'DailyRound',
        component: () => import('@/views/DailyRound.vue')
    },
    {
        path: '/choose-parameters/:patientId/',
        name: 'ChooseParameters',
        component: () => import('@/views/ContinuousMonitoring.vue')
    },
    {
        path: '/schedule-alert/:patientId/',
        name: 'ScheduleAlert',
        component: () => import('@/views/ScheduleAlert.vue')
    },
    {
        path: '/measurements/:patientId/',
        name: 'Measurements',
        component: () => import('@/views/PatientMeasurements.vue')
    },
    {
        path: '/new-hospitalization/',
        name: 'NewHospitalization',
        component: () => import('@/views/NewHospitalization.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
