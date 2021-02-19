import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router/index'
import {getCookie} from "@/utils/cookieUtils";
// 创建axios实例
const service = axios.create({
  baseURL: '', // api 的 base_url
  timeout: 20000 // 请求超时时间 10秒
})

service.defaults.headers.common['Authorization'] = getCookie("token")

// request拦截器
service.interceptors.request.use(
  config => {
    if (getCookie("token") != undefined) {
      config.headers.Authorization = getCookie("token") // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)


// response 拦截器
service.interceptors.response.use(
  response => {
    // return response.data
    const res = response.data
    // if (res.code === '500' || res.code === '300') {
    //   return res
    // } else if (res.code === '401' || res.code === 400) {
    //   console.log('返回错误内容', res)
    //   // router.push('404')
    //   return res
    // } else if (res.code === 502) {
    //   // router.push('502')
    //   return Promise.reject('error')
    // } else {
    //   return Promise.reject('error')
    // }
    // 500为请求正常
    if (res.code !== '500') {
      // 401表示token过期
      if (res.code === '401') {
        console.log('返回错误内容', res)
        return res
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    // 出现网络超时
    // router.push('500')
    return Promise.reject(error)
  }
)

export default service
