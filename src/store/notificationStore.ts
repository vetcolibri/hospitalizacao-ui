import { defineStore } from 'pinia'

interface NotificationState {
    message: string
    type: string
    visible: boolean
}

export const useNotificationStore = defineStore('notification', {
    /**
     * Notificações de respostas das requisições.
     * Elas precisa ser limpas após serem exibidas.
     * O tempo de exibição é de 5 segundos.
     * */
    state: (): NotificationState => {
        return { message: '', type: '', visible: false }
    },
    actions: {
        notify(message: string, type: string) {
            this.message = message
            this.type = type
            this.visible = true
            setTimeout(() => {
                this.clear()
            }, 5000)
        },
        clear() {
            this.message = ''
            this.type = ''
            this.visible = false
        }
    }
})
