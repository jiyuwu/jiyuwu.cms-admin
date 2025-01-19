import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import { theme } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import zhElement from 'element-plus/dist/locale/zh-cn.mjs'
import enElement from 'element-plus/dist/locale/en.mjs'

export default () => {
    const { locale } = useI18n()
    const antLocales = {
        zh: zhCN,
        en: enUS,
    }
    const elementLocales = {
        zh: zhElement,
        en: enElement,
    }
    const configProviderAttrs = {
        locale: antLocales[locale.value] || zhCN,
        elementLocale: elementLocales[locale.value] || zhElement,
        theme: {
            algorithm: theme.defaultAlgorithm,
            token: {
                borderRadius: 4,
                borderRadiusSM: 2,
            },
            components: {
                List: {
                    paddingContentHorizontalLG: 0,
                },
                Table: {
                    paddingContentVerticalLG: 12,
                    padding: 12,
                },
                Card: {
                    paddingLG: 16,
                },
            },
        },
    }

    return {
        configProviderAttrs,
    }
}
