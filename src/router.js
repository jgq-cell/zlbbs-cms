import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Banner from '@/components/Banner.vue'
import User from '@/components/User.vue'
import Post from '@/components/Post.vue'
import Comment from '@/components/Comment.vue'
// 2. 定义一些路由
// 每个路由都需要映射到一个组件
const routes = [
  {
    path: '/',
    component: Home,
    name: 'home'
  },
  {
    path: '/banner',
    component: Banner,
    name: 'banner'
  },
  {
    path: '/user',
    component: User,
    name: 'user'
  },
  {
    path: '/post',
    component: Post,
    name: 'post'
  },
  {
    path: '/comment',
    component: Comment,
    name: 'comment'
  }
]

// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHashHistory(),
  routes // `routes: routes` 的缩写
})

export default router
