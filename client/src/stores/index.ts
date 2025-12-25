// src/stores/index.ts
import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()

// 添加持久化插件
pinia.use(piniaPluginPersistedstate)

// 添加路由到 store（可选）
export function setupStore(router: Router) {
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    })
    return pinia
}

export default pinia