import axios from 'axios'
import { useAuthStore } from '@/store'

export const request = axios.create(
  {
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 12000,
  },
)

request.interceptors.request.use(
  // 请求成功拦截
  (config) => {
    if (config.noNeedToken) {
      return config
    }

    const { accessToken } = useAuthStore()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  // 请求失败拦截
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  // 响应成功拦截
  (response) => {
    // 业务信息
    const responseData = response.data
    const { code, message } = responseData
    if (code !== 0) { // ! 与后端约定业务状态码
      window.$message.error(message)
      if (code === 1201) { // Token 存在问题
        const authStore = useAuthStore()
        authStore.toLogin()
        window.$message.error(message)
        return
      }
      if (code === 1203) { // 被强制退出
        const authStore = useAuthStore()
        authStore.forceOffline()
        return
      }
      return Promise.reject(responseData)
    }
    return Promise.resolve(responseData)
  },
  // 响应失败拦截
  (error) => {
    // 主要使用业务状态码决定状态, 一般不根据 HTTP 状态码进行操作
    // const { code } = error
    // if (code === 401) {
    //   removeToken()
    //   // window.$message.error(message)
    //   router.push('/')
    // }
    return Promise.reject(error)
  },
)
