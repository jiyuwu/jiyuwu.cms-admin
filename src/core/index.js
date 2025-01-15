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
import './permission'
import 'ant-design-vue/dist/reset.css'
import 'element-plus/dist/index.css'
import '@/styles/index.less'

useCheckUpdate()

// 创建 i18n 实例
const i18n = createI18n({
    legacy: false, // 使用 Composition API 模式
    globalInjection: true, // 全局模式，可以直接使用 $t
    locale: localStorage.getItem('lang') || 'zh', // 默认语言
    fallbackLocale: 'en', // 备用语言
    messages: {
        en,
        zh,
    },
})

export const useCore = (app) => {
    app.use(antd)
    app.use(ElementPlus)
    app.use(i18n)
    // app.use(components)
    setupException(app)
    setupStore(app)
    setupRouter(app)
    setupDirective(app)
}
