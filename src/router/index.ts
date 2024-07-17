import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/resume',
        name: 'Resume',
        component: () => import('@/views/Resume.vue')
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
        path: '/register-patient/',
        name: 'RegisterPatient',
        component: () => import('@/views/NewPatient.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, _from) => {
    const user = sessionStorage.getItem('user')

    if (to.name === 'Resume' && !user) {
        return
    }

    if (to.name === 'Resume' && user) {
        return { name: 'Dashboard' }
    }

    if (to.name !== 'Login' && !user) return { name: 'Login' }
})

export default router
