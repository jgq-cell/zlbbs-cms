import axios from 'axios'
import auth from '@/utils/auth'
import qs from 'qs'

const SERVER_HOST = 'http://127.0.0.1:5000'

class Http {
  constructor() {
    this.server_host = SERVER_HOST
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
  getUserList(page) {
    const url = '/user/list?page=' + (page ? page : 1)
    return this.http.get(url)
  }
  // 激活/禁用用户
  activeUser(data) {
    const url = '/user/active'
    return this._post(url, data)
  }
}

export default new Http()
