import axios from 'axios'
import store from '@/management/store/index'
import router from '@/management/router/index'
import { get as _get } from 'lodash-es'

export const CODE_MAP = {
  SUCCESS: 200,
  ERROR: 500,
  NO_AUTH: 403,
  ERR_AUTH: 1001
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      throw new Error('http请求出错')
    }
    const res = response.data
    if (res.code === CODE_MAP.NO_AUTH || res.code === CODE_MAP.ERR_AUTH) {
      router.replace({
        name: 'login'
      })
      return res
    } else {
      return res
    }
  },
  (err) => {
    throw new Error(err)
  }
)

instance.interceptors.request.use((config) => {
  const hasLogined = _get(store, 'state.user.hasLogined')
  const token = _get(store, 'state.user.userInfo.token')
  if (hasLogined && token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
