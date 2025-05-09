<template>
    <div
        ref="basicMenuRef"
        class="basic-menu">
        <a-menu
            v-model:selected-keys="selectedKeys"
            :collapsed="config.collapsed"
            :get-pop-container="() => basicMenuRef"
            :items="items"
            :mode="mode"
            :open-keys="cpOpenKeys"
            :theme="theme"
            @click="handleClick"
            @openChange="onOpenChange"></a-menu>
    </div>
</template>

<script setup>
import { computed, h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapping } from '@/utils'
import { Badge } from 'ant-design-vue'
import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineOptions({
    name: 'BasicMenu',
})

/**
 * @property {string} theme 主题，【dark=暗色，light=亮色】
 * @property {string} mode 菜单类型，【vertical=垂直，horizontal=水平，inline=内嵌】
 * @property {array} dataList 数据
 */
const props = defineProps({
    theme: {
        type: String,
        default: 'dark',
    },
    mode: {
        type: String,
        default: 'inline',
    },
    dataList: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['click'])

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const { config } = storeToRefs(appStore)
const openKeys = ref([])
const selectedKeys = ref([])
const items = ref([])
const basicMenuRef = ref()

const cpIsHorizontal = computed(() => props.mode === 'horizontal')
const rootSubmenuKeys = computed(() => props.dataList?.map((item) => item.name))
const cpOpenKeys = computed(() => {
    if (cpIsHorizontal.value) {
        return []
    }
    return openKeys.value
})

watch(route, () => setSelectedMenu())
watch(
    () => props.dataList,
    () => {
        items.value = mapping({
            data: props.dataList || [],
            fieldNames: {
                key: 'name',
                label: (item) =>
                    h('span', { class: 'basic-menu__title' }, [
                        h('span', { class: 'basic-menu__name' }, t(item?.meta?.title)),
                        h(Badge, { count: item?.meta?.badge || 0 }),
                    ]),
                icon: (item) => {
                    const icon = item?.meta?.icon
                    if (icon) {
                        return h(icon)
                    }
                    return ''
                },
                children: 'children',
            },
            treeFieldName: 'children',
            keepOtherFields: true,
        })
    },
    { immediate: true, deep: true }
)

onMounted(() => {
    setSelectedMenu()
})

/**
 * 设置选中菜单
 */
function setSelectedMenu() {
    const { meta } = route || {}
    openKeys.value = meta?.openKeys || []
    selectedKeys.value = meta?.breadcrumb?.map((item) => item?.meta?.active || item.name)
}

/**
 * 点击菜单
 * @param item
 */
function handleClick({ item }) {
    const { path, meta, name, props } = item?.originItemValue || {}

    if (props) {
        props?.click?.call(null, item?.originItemValue)
    }

    if (path) {
        const isBlank = meta?.target === '_blank'
        if (meta?.isLink) {
            if (isBlank) {
                window.open(path)
            } else {
                window.location.href = path
            }
        } else {
            const { href } = router.resolve({ name, query: meta?.query || {} })
            if (isBlank) {
                window.open(href)
            } else {
                router.push({
                    path,
                    query: meta?.query ?? {},
                })
            }
        }
    }

    emit('click', item?.originItemValue)
}

/**
 * SubMenu 展开/关闭的回调
 * @param value
 */
function onOpenChange(value) {
    if (cpIsHorizontal.value) return
    const latestOpenKey = value.find((key) => openKeys.value.indexOf(key) === -1)
    if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
        openKeys.value = value
    } else {
        openKeys.value = latestOpenKey ? [latestOpenKey] : []
    }
}
</script>

<style lang="less">
.basic-menu {
    &__title {
        flex: 1;
        display: inline-flex;
        align-items: center;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;

        .ant-badge {
            zoom: 0.8;
            margin: 0 1px 0 2px;
        }
    }
}
</style>

<style lang="less" scoped>
.basic-menu {
    .ant-menu:not(.ant-menu-horizontal) {
        :deep(.ant-menu-submenu-title) {
            display: flex;
        }

        :deep(.basic-menu) {
            &__title {
                display: flex;
            }

            &__name {
                flex: 1;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
}
</style>
