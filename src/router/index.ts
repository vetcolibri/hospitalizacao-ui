import { createRouter, createWebHistory } from 'vue-router'

import ExamGeneralCondition from '@/views/ExamGeneralCondition.vue'

const routes = [
    {
        path: "/", 
        name: "ExamGeneralCondition", 
        component: ExamGeneralCondition
    },
    {
        path: "/choose-patient/:examFormat", 
        name: "ChoosePatient", 
        component: () => import("@/views/ChoosePatient.vue")
    },
    {
        path: "/daily-round/:patientId", 
        name: "DailyRound", 
        component: () => import("@/views/DailyRound.vue")
    },
    {
        path: "/choose-parameters/:patientId",
        name: "ChooseParameters",
        component: () => import("@/views/ChooseParameters.vue")
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
