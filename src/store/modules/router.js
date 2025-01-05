import { defineStore } from 'pinia'
import { notFoundRoute } from '@/router/config'
import { formatRoutes, generateMenuList, generateRoutes, getFirstValidRoute } from '@/router/util'
import { findTree } from '@/utils'
import { config } from '@/config'
import router from '@/router'
import apis from '@/apis'
import routes from '@/router/routes'
import useAppStore from './app'
import useMultiTab from './multiTab'
// import useRouter from './router'
import storage from '@/utils/storage'

const useRouterStore = defineStore('router', {
    state: () => ({
        routeList: [],
        menuList: [],
        indexRoute: null,
    }),
    getters: {},
    actions: {
        /**
         * 获取路由列表
         * @returns {Promise}
         */
        getRouterList() {
            return new Promise((resolve, reject) => {
                ;(async () => {
                    try {
                        const { code, data } = await apis.user.getAuthList().catch(() => {
                            throw new Error()
                        })
                        if (config('http.code.success') === code) {
                            const validRoutes = formatRoutes(routes, data)
                            const menuList = generateMenuList(validRoutes)
                            const routeList = [...generateRoutes(validRoutes), notFoundRoute]
                            const indexRoute = getFirstValidRoute(menuList)
                            routeList.forEach((route) => {
                                router.addRoute(route)
                            })
                            this.routeList = routeList
                            this.menuList = menuList
                            this.indexRoute = indexRoute
                            resolve()
                        } else {
                            const appStore = useAppStore()
                            const multiTab = useMultiTab()
                            //const router = useRouter()
                            storage.local.removeItem(config('storage.token'))
                            storage.local.removeItem(config('storage.userInfo'))
                            this.$reset()
                            appStore.$reset()
                            multiTab.$reset()
                            // router.$reset()
                            // router.push({
                            //     name: 'login',
                            // }) // 进行页面跳转到登录页
                            //router.replace({ name: 'login' })
                            resolve({ shouldRedirect: true }) // 这里返回一个标识符表示需要路由跳转
                        }
                    } catch (error) {
                        reject()
                    }
                })()
            })
        },
        /**
         * 设置徽标
         * @param {string} name 名称
         * @param {number} count 数量
         */
        setBadge({ name, count } = {}) {
            findTree(
                this.menuList,
                name,
                (item) => {
                    item.meta.badge = count
                },
                { key: 'name', children: 'children' }
            )
        },
    },
})

export default useRouterStore
