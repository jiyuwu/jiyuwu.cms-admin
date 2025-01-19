import antd from 'ant-design-vue'
import ElementPlus from 'element-plus'
import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'
// import components from '@/components'
import { setupDirective } from '@/directives'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupException } from './exception'
import { useCheckUpdate } from '@/hooks'

// Element Plus 语言包
// import zhElement from 'element-plus/dist/locale/zh-cn.mjs'
// import enElement from 'element-plus/dist/locale/en.mjs'
import './permission'
import 'ant-design-vue/dist/reset.css'
import 'element-plus/dist/index.css'
import '@/styles/index.less'

useCheckUpdate()

// 国际化语言配置
const messages = {
    en,
    zh,
}

// const elementLocales = {
//     zh: zhElement,
//     en: enElement,
// }

// 创建 i18n 实例
export const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    globalInjection: true, // 全局模式，可以直接使用 $t
    locale: localStorage.getItem('lang') || 'zh', // 默认语言
    fallbackLocale: 'zh', // 备用语言
    messages,
})

export const useCore = (app) => {
    // // 获取当前语言
    // const lang = localStorage.getItem('lang') || 'zh'
    // // Element Plus 国际化
    // app.use(ElementPlus, {
    //     locale: elementLocales[lang], // 动态设置 Element Plus 的语言
    // })
    app.use(ElementPlus)
    app.use(antd)
    app.use(i18n)
    // app.use(components)
    setupException(app)
    setupStore(app)
    setupRouter(app)
    setupDirective(app)
}
