import { createWebHistory, createRouter } from 'vue-router'
import LoginView from '@/views/Login.vue'
import RegisterView from '@/views/Register.vue'
import NoFound from '@/views/404.vue'
const routes = [
    { path: '/', name: 'home', redirect: './productList' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/productList', name: 'productList', component: () => import('@/views/ProductList.vue') },
    { path: '/productDetail/:id', name: 'productDetail', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: NoFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to, _from, next) => {
    const { useAuthStore } = await import('@/stores/auth')
    const useAuth = useAuthStore()
    if (to.name !== 'login' && !useAuth.isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})


export default router