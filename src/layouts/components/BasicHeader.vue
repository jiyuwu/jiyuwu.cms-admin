<template>
    <a-layout-header
        :class="cpClassNames"
        :style="cpStyles"
        class="basic-header">
        <!-- 左侧 -->
        <div
            v-if="cpShowLeftSlot"
            class="basic-header__left">
            <slot name="left"></slot>
        </div>
        <!-- 中间 -->
        <div
            v-if="cpShowDefaultSlot"
            class="basic-header__center">
            <slot></slot>
        </div>
        <!-- 右侧 -->
        <div class="basic-header__right">
            <a-space :size="8">
                <!-- <a-tooltip title="使用文档">
                    <a
                        class="color-text"
                        href="http://xy-admin-docs.xuanyunet.com"
                        target="_blank">
                        <action-button>
                            <book-outlined></book-outlined>
                        </action-button>
                    </a>
                </a-tooltip> -->

                <a-dropdown>
                    <action-button>
                        <global-outlined></global-outlined>
                    </action-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a
                                    class="color-text"
                                    @click="switchLanguage('zh')"
                                    :class="{ 'selected-lang': locale === 'zh' }">
                                    <check-outlined v-show="locale === 'zh'" />
                                    中文
                                </a>
                            </a-menu-item>
                            <a-menu-item>
                                <a
                                    class="color-text"
                                    @click="switchLanguage('en')"
                                    :class="{ 'selected-lang': locale === 'en' }">
                                    <check-outlined v-show="locale === 'en'" />
                                    English
                                </a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>

                <a-tooltip title="设置">
                    <action-button @click="handleConfig">
                        <setting-outlined></setting-outlined>
                    </action-button>
                </a-tooltip>

                <a-dropdown :trigger="['click']">
                    <action-button :style="{ height: '44px' }">
                        <a-avatar
                            :size="24"
                            :src="userInfo?.avatar"
                            class="mr-8-1 display-inline-flex justify-content-center">
                        </a-avatar>
                        <span>{{ userInfo?.name }}</span>
                    </action-button>
                    <a-spin />
                    <template #overlay>
                        <a-menu>
                            <a-menu-item
                                key="logout"
                                @click="handleLogout">
                                <login-outlined></login-outlined>
                                退出登录
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </a-space>
        </div>
    </a-layout-header>
</template>

<script setup>
import { Modal, theme as antTheme } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { computed, useSlots, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { LoginOutlined, SettingOutlined, GlobalOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { useAppStore, useUserStore } from '@/store'
import ActionButton from './ActionButton.vue'
import { useI18n } from 'vue-i18n'
//import { i18n } from '@/core'

// 初始化多语言
const { locale } = useI18n()

// 设置组件名称
defineOptions({
    name: 'BasicHeader',
})

// 组件的 Props
const props = defineProps({
    theme: {
        type: String,
    },
})

// Emits
const emit = defineEmits(['config'])

// 获取 slots
const slots = useSlots(['default', 'left', 'right'])

// Pinia Stores
const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const { config } = storeToRefs(appStore)
const { userInfo } = storeToRefs(userStore)
const { token } = antTheme.useToken()

// 样式和类名计算
const cpClassNames = computed(() => ({
    [`basic-header--${props.theme}`]: true,
}))
const cpStyles = computed(() => {
    const styles = {
        zIndex: config.value.layout === 'topBottom' ? 120 : 110,
    }

    if (config.value.headerTheme === 'light') {
        styles.boxShadow = `0 0 0 1px ${token.value.colorSplit}`
    }

    return styles
})
const cpShowLeftSlot = computed(() => !!slots.left)
const cpShowDefaultSlot = computed(() => !!slots.default)

// 设置初始语言
onMounted(() => {
    const savedLocale = localStorage.getItem('lang')
    locale.value = savedLocale || 'zh' // 默认设置为 'zh'
    console.log('初始语言:', locale.value) // 确保初始值正确
})

// 监听语言变化
watch(locale, (newVal, oldVal) => {
    console.log('语言从', oldVal, '切换到', newVal)
    nextTick(() => {
        console.log('DOM 更新完成')
    })
})

// 退出登录方法
function handleLogout() {
    Modal.confirm({
        title: '注销登录？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            userStore.logout().then(() => {
                router.push({
                    name: 'login',
                })
            })
        },
    })
}

// 切换语言方法
function switchLanguage(language) {
    console.log('切换语言:', language)
    locale.value = language
    localStorage.setItem('lang', language)
    //i18n.global.locale.value = language
    location.reload() // 重新加载以应用语言变更
}

// 配置方法
function handleConfig() {
    emit('config')
}
</script>

<style lang="less" scoped>
.basic-header {
    height: v-bind('config.headerHeight + "px"');
    line-height: 1;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding-inline: 16px;

    &__left {
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    &__center {
        flex: auto;
        min-width: 0;
    }

    &__right {
        flex-shrink: 0;
        margin: 0 0 0 auto;
        display: flex;
        align-items: center;
    }

    :deep(.ant-menu-horizontal) {
        border: none;
        line-height: v-bind('config.headerHeight + "px"');
    }

    &--light {
        background: #fff;
    }

    &--dark {
        color: #fff;

        :deep(.action-btn) {
            &:hover {
                background: #252a3d;
            }
        }
    }

    .selected-lang {
        color: #1890ff !important;
        font-weight: bold !important;
    }

    :deep(.anticon-check) {
        color: #1890ff !important;
        margin-right: 4px !important;
    }
}
</style>
