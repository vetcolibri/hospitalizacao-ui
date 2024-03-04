import users from '@/users.json' assert { type: 'json' }

export function useAuth() {
    const isAuthenticated = () => !!sessionStorage.getItem('user')

    const login = (username: string, password: string) => {
        if (users['username'] !== username || users['password'] !== password) return false
        sessionStorage.setItem('user', username)
        return true
    }

    const logout = () => sessionStorage.removeItem('user')

    return {
        login,
        logout,
        isAuthenticated
    }
}
