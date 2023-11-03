import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/exam-general-condition/',
        name: 'ExamGeneralCondition',
        component: () => import('@/views/ExamGeneralCondition.vue')
    },
    {
        path: '/choose-patient/:page',
        name: 'ChoosePatient',
        component: () => import('@/views/ChoosePatient.vue')
    },
    {
        path: '/daily-round/',
        name: 'DailyRound',
        component: () => import('@/views/DailyRound.vue')
    },
    {
        path: '/choose-parameters/',
        name: 'ChooseParameters',
        component: () => import('@/views/ContinuousMonitoring.vue')
    },
    {
        path: '/schedule-alert/',
        name: 'ScheduleAlert',
        component: () => import('@/views/ScheduleAlert.vue')
    },
    {
        path: '/measurements/',
        name: 'Measurements',
        component: () => import('@/views/PatientMeasurements.vue')
    },
    {
        path: '/hospitalization/',
        name: 'Hospitalization',
        component: () => import('@/views/Hospitalization.vue')
    },
    {
        path: '/recurring-patient/',
        name: 'RecurringPatient',
        component: () => import('@/views/RecurringPatientHospitalization.vue')
    },
    {
        path: '/register-patient/',
        name: 'RegisterPatient',
        component: () => import('@/views/NewPatientHospitalization.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
