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
        path: '/hospitalization/',
        name: 'Hospitalization',
        component: () => import('@/views/Hospitalization.vue')
    },
    {
        path: '/recurring-patient/',
        name: 'RecurringPatient',
        component: () => import('@/views/RecurringPatient.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
