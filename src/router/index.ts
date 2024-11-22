import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import { useAuth } from '@/composables/useAuth'

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
        path: '/owner-report',
        name: 'OwnerReport',
        component: () => import('@/views/OwnerReport.vue')
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
    const auth = useAuth()

    if (to.name === 'OwnerReport' && !auth.isAuthenticated()) {
        return true
    }

    if (to.name === 'OwnerReport' && auth.isAuthenticated()) {
        return { name: 'Dashboard' }
    }

    if (to.name != 'Login' && !auth.isAuthenticated()) {
        return { name: 'Login' }
    }

})

export default router
