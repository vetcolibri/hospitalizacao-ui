import type { UserModel } from "@/lib/models/user";
import { useRouter } from 'vue-router'

const USERNAME_KEY = "vetcolibri::username";
const TOKEN_KEY = "vetcolibri::token";

export function useAuth() {
    const router = useRouter()

    const isAuthenticated = () =>  {
        return !!localStorage.getItem(USERNAME_KEY) && !!localStorage.getItem(TOKEN_KEY)
    }

    const login = (user: UserModel) => {
        localStorage.setItem(USERNAME_KEY, user.username)
        localStorage.setItem(TOKEN_KEY, user.token)
        router.push({ name: 'Dashboard' })
    }

    const logout = () => {
        localStorage.removeItem(USERNAME_KEY)
        localStorage.removeItem(TOKEN_KEY)
        router.push({ name: 'Login' })
    }


    return {
        login,
        logout,
        isAuthenticated
    }
}

export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) return ""

    return token
}

export const getUser = () => {
    const username = localStorage.getItem(USERNAME_KEY)

    if (!username) return ""

    return username
}
