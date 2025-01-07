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
import storage from '@/utils/storage'
import { useUserStore } from '@/store'

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
                            storage.local.removeItem(config('storage.token'))
                            storage.local.removeItem(config('storage.userInfo'))
                            this.$reset()
                            appStore.$reset()
                            multiTab.$reset()
                            //router.$reset()

                            const userStore = useUserStore()
                            // 退出登录，isLogin 会自动变为 false
                            userStore.logout().then(() => {
                                router.push({
                                    name: 'login',
                                })
                            })
                            // 检查是否存在指定的路由
                            // if (router.hasRoute('login')) {
                            //     console.log('路由已经存在')
                            // } else {
                            //     console.log('路由不存在')
                            // }
                            // router.push({
                            //     name: 'login',
                            // }) // 进行页面跳转到登录页
                            // router.replace({
                            //     name: 'login', // 跳转到登录页
                            //     query: { redirect: encodeURIComponent(location.href) }, // 可选：携带当前地址，用于登录后跳转回原页面
                            // })
                            resolve() // 这里返回一个标识符表示需要路由跳转
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
