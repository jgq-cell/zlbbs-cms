import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router.js'
import auth from '@/utils/auth.js'

const app = createApp(App)
// 支持Element-plus
app.use(ElementPlus)
// 支持Router路由
app.use(router)
// 定义全局变量，用于判断是否登录，项目中可用“this.auth”
app.config.globalProperties.$auth = auth
app.mount('#app')
