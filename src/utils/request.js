import axios from 'axios'
import { message, notification } from 'ant-design-vue'
import { config } from '@/config'
import { useUserStore } from '@/store'
import jschardet from 'jschardet'

const MSG_ERROR_KEY = Symbol('GLOBAL_ERROR')

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: config('http.apiBasic'),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 请求拦截器
axiosInstance.interceptors.request.use(
    (request) => {
        const userStore = useUserStore()
        if (userStore.isLogin) {
            request.headers['AUTH-TOKEN'] = userStore.token
        }
        return request
    },
    (error) => Promise.reject(error)
)

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        const { code, msg = '请稍后重试' } = response.data || {}
        if (![config('http.code.success'), ...config('http.code.ignore')].includes(code)) {
            notification.error({
                key: MSG_ERROR_KEY,
                message: '请求异常',
                description: msg,
            })
        }
        return response.data
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            message.error({
                key: MSG_ERROR_KEY,
                content: `网络异常：${error.message}`,
            })
        } else if (error.code !== 'ERR_CANCELED') {
            return Promise.reject(error)
        }
    }
)

// 文件读取类
class ReadFile {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: '',
            responseType: 'blob',
        })
    }

    async read(data) {
        const encoding = await this._getEncoding(data)
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsText(data, encoding)
            reader.onload = () => resolve(reader.result)
        })
    }

    _getEncoding(data) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsBinaryString(data)
            reader.onload = () => {
                const detected = jschardet.detect(reader.result)
                resolve(detected.encoding || 'utf-8')
            }
        })
    }
}

export default {
    basic: axiosInstance,
    readFile: new ReadFile(),
}
