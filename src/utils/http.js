import axios from 'axios'
import auth from '@/utils/auth'
import qs from 'qs'

// const SERVER_HOST = 'http://127.0.0.1:5000'
// window.location.origin： 页面被渲染的服务器域名
// const SERVER_HOST = window.location.origin

// npm run server：用的是development模式
// npm run build：默认用的是production模式
// npm run build -- --mode [模式，比如：development]来指定具体的模式
// 不同的模式，会读取对应模式下的配置参数
// development模式：.env.development配置文件
// production模式：.env.production配置文件
// 在配置文件中，只能有三种类型的配置项：NODE_ENV，BASE_URL，VUE_APP_开头的
// 比如：VUE_APP_SERVER_HOST
// const SERVER_HOST = process.env.VUE_APP_SERVER_HOST

class Http {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.server_host = window.location.origin
    } else {
      this.server_host = process.env.VUE_APP_SERVER_HOST
    }
    this.http = axios.create({
      baseURL: this.server_host + '/cmsapi',
      timeout: 1000 * 60
    })

    // 请求之前的拦截器，用来设置JWT
    this.http.interceptors.request.use((config) => {
      const token = auth.token
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      return config
    })

    // 响应拦截
    this.http.interceptors.response.use((response) => {
      return response.data
    })
  }

  _post(url, data) {
    return this.http.post(url, qs.stringify(data))
  }

  // 添加轮播图
  addBanner(data) {
    const url = '/banner/add'
    return this._post(url, data)
  }
  // 轮播图列表
  getBannerList(page) {
    const url = '/banner/list?page=' + (page ? page : 1)
    return this.http.get(url)
  }
  // 轮播图删除
  deleteBanner(id) {
    const url = '/banner/delete?id=' + id
    return this.http.get(url)
  }
  // 轮播图编辑
  editBanner(data) {
    const url = '/banner/edit'
    return this._post(url, data)
  }

  // 帖子列表
  getPostList(page) {
    const url = '/post/list?page=' + (page ? page : 1)
    return this.http.get(url)
  }
  // 帖子删除
  deletePost(id) {
    const url = '/post/delete?id=' + id
    return this.http.get(url)
  }
  // 评论列表
  getCommentList(page) {
    const url = '/comment/list?page=' + (page ? page : 1)
    return this.http.get(url)
  }
  // 删除评论
  deleteComment(id) {
    const url = '/comment/delete?id=' + id
    return this.http.get(url)
  }
  // 用户列表
  getUserList(page, type) {
    const url =
      '/user/list?page=' + (page ? page : 1) + '&type=' + (type ? type : 1)
    return this.http.get(url)
  }
  // 激活/禁用用户
  activeUser(data) {
    const url = '/user/active'
    return this._post(url, data)
  }
  // 板块下帖子数量
  getBoardPostCount() {
    const url = '/board/post_count'
    return this.http.get(url)
  }
  // 7天前帖子数量
  get7dayPostCount() {
    const url = '/day7/post_count'
    return this.http.get(url)
  }
}

export default new Http()
