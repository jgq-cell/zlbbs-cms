import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router.js'

const app = createApp(App)
// 支持Element-plus
app.use(ElementPlus)
// 支持Router路由
app.use(router)
app.mount('#app')
