import { createRouter, createWebHistory } from 'vue-router'

import ExamMenu from '@/views/ExamMenu.vue'

const routes = [
    {
        path: "/", 
        name: "ExamMenu", 
        component: ExamMenu
    },
    {
        path: "/patients/:examFormat", 
        name: "PatientList", 
        component: () => import("@/views/PatientList.vue")
    },
    {
        path: "/daily-round", 
        name: "DailyRound", 
        component: () => import("@/views/DailyRound.vue")
    },
    {
        path: "/parameters",
        name: "Parameters",
        component: () => import("@/views/Parameters.vue")
    },
    {
        path: "/schedule-alert", 
        name: "ScheduleAlert", 
        component: () => import("@/views/ScheduleAlert.vue")
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
