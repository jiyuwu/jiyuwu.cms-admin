<template>
    <div
        ref="multiTabRef"
        class="multi-tab">
        <a-tabs
            :active-key="cpCurrent"
            type="card"
            @change="handleSwitch">
            <a-tab-pane
                v-for="(item, index) in cpMultiTabList"
                :key="index">
                <template #tab>
                    <a-dropdown :trigger="['contextmenu']">
                        <div>
                            {{ item.meta.title }}
                            <span
                                v-if="cpCurrent === index"
                                class="multi-tab__icon"
                                @click.stop="handleReload(item)">
                                <reload-outlined
                                    :spin="spin"
                                    class="ma-0" />
                            </span>
                            <template v-if="cpShowCloseBtn">
                                <span
                                    class="multi-tab__icon"
                                    @click.stop="handleClose(item)">
                                    <close-outlined class="ma-0" />
                                </span>
                            </template>
                        </div>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    key="reload"
                                    @click="handleReload(item)">
                                    重新加载
                                </a-menu-item>
                                <template v-if="cpShowCloseBtn">
                                    <a-menu-item
                                        key="close"
                                        @click="handleClose(item)">
                                        关闭
                                    </a-menu-item>
                                </template>
                                <template v-if="cpShowCloseOtherBtn">
                                    <a-menu-item
                                        key="closeOther"
                                        @click="handleCloseOther(item)">
                                        关闭其他
                                    </a-menu-item>
                                </template>
                                <a-menu-item
                                    v-if="index > 0"
                                    key="closeLeft"
                                    @click="handleCloseLeft(item)">
                                    关闭左侧
                                </a-menu-item>
                                <a-menu-item
                                    v-if="index < cpMultiTabList.length - 1"
                                    key="closeRight"
                                    @click="handleCloseRight(item)">
                                    关闭右侧
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Sortable from 'sortablejs'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useAppStore, useMultiTabStore } from '@/store'
import { useMultiTab } from '@/hooks'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineOptions({
    name: 'MultiTab',
})

const multiTabStore = useMultiTabStore()
const appStore = useAppStore()
const router = useRouter()
const {
    close: handleClose,
    closeLeft: handleCloseLeft,
    closeRight: handleCloseRight,
    closeOther: handleCloseOther,
    reload,
} = useMultiTab()

const { config } = storeToRefs(appStore)
const spin = ref(false)
const multiTabRef = ref()

const cpMultiTabList = computed(() => {
    return multiTabStore.list.map((item) => {
        console.log(item)
        return {
            ...item,
            meta: {
                ...item.meta,
                title: t(item.meta?.title || item.title), // 使用 t 函数翻译标题
            },
        }
    })
})
const cpCurrent = computed(() => multiTabStore.current)
const cpShowCloseBtn = computed(() => cpMultiTabList.value.length > 1)
const cpShowCloseOtherBtn = computed(() => cpMultiTabList.value.length > 1)

onMounted(async () => {
    await nextTick()
    initDragSort()
})

/**
 * 重新加载
 * @param route
 */
function handleReload(route) {
    reload(route)
    spin.value = true
    setTimeout(() => {
        spin.value = false
    }, 1000)
}

/**
 * 切换标签页
 * @param index
 */
function handleSwitch(index) {
    router.push(cpMultiTabList.value[index])
}

/**
 * 初始化拖拽
 */
function initDragSort() {
    Sortable.create(multiTabRef.value.querySelector('.ant-tabs-nav-list'), {
        handle: '.ant-tabs-tab',
        draggable: '.ant-tabs-tab',
        animation: 200,
    })
}
</script>

<style lang="less" scoped>
.multi-tab {
    background: #fff;
    position: sticky;
    top: v-bind('config.headerHeight + "px"');
    z-index: 100;
    padding-block: 8px 0;

    &__icon {
        margin-left: 8px;
    }

    .ant-dropdown-trigger {
        display: flex;
        align-items: center;
    }

    :deep(.ant-tabs) {
        &.ant-tabs-top {
            .ant-tabs-nav {
                padding-inline: 16px;
                margin-block: 0;

                .ant-tabs-tab {
                    border-bottom-color: transparent;
                }
            }
        }
    }
}
</style>
