import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import router from '@/router'
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(async (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers.Authorization = authStore.token
    }
    return config
})

// 响应拦截器
api.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response?.status === 401) {
            // 处理未授权
            ElMessageBox.alert('登录已过期，请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                    const authStore = useAuthStore()
                    authStore.logout()
                    router.push({ name: 'login' })
                }
            })
        }
        return Promise.reject(error)
    }
)

export default api