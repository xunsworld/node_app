import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginApi } from '@/apis/users'
//  `defineStore()` 的返回值的命名是自由的
// 但最好含有 store 的名字，且以 `use` 开头，以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const isAuthenticated = computed(() => token.value !== '')
    const login = async (email: string, password: string) => {
        isLoading.value = true
        try {
            const data: any = await loginApi(email, password)
            if (data.success) {
                token.value = data.token
                return true
            }
        } catch (e: any) {
            error.value = e.response?.data?.msg || e.message || '登录失败'
        } finally {
            isLoading.value = false
        }
        return false
    }
    const logout = () => {
        token.value = '';
    }
    return { token, isLoading, error, isAuthenticated, login, logout }
}, {
    persist: {
        storage: localStorage,
        pick: ['token'],
    },
})