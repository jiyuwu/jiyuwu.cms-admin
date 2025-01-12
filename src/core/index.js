import antd from 'ant-design-vue'
import ElementPlus from 'element-plus'
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

export const useCore = (app) => {
    app.use(antd)
    app.use(ElementPlus)
    // app.use(components)
    setupException(app)
    setupStore(app)
    setupRouter(app)
    setupDirective(app)
}
