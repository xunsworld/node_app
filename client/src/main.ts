import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
import router from './router'
import ElementPlus from 'element-plus'
import XElement from "@xunsworld/element"
import 'element-plus/dist/index.css'
import '@xunsworld/element/dist/index.css'
import '@/styles/index.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(XElement)
app.mount('#app')
