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
}

export default new Http()
