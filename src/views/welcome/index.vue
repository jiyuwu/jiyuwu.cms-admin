<template>
    <a-card class="mb-8-2">
        <h2 class="text-xl font-medium">{{ userInfo?.name }} ，祝你开心每一天！</h2>
        <p class="mb-0">某某某公司－某某某部门－某某某岗位</p>
        <p>{{ $t('message.hello') }}</p>
        <button>{{ $t('buttons.login') }}</button>
        <el-date-picker
            v-model="selectedDate"
            @change="handleDateChange" />
        <a-date-picker
            v-model:value="selectedMomentDate"
            @change="handleMomentDateChange" />
        <!-- Ant Design Vue 分页组件 -->
        <a-pagination
            :total="50"
            :page-size="10"
            show-size-changer
            show-quick-jumper />

        <!-- Element Plus 分页组件 -->
        <el-pagination
            background
            layout="prev, pager, next, jumper, ->, total"
            :total="50" />
    </a-card>

    <a-row :gutter="16">
        <a-col :lg="18">
            <a-card>
                <a-row
                    class="align-center"
                    type="flex">
                    <a-col flex="1">
                        <a-statistic
                            title="我的待办"
                            value="8个任务" />
                    </a-col>
                    <a-col flex="1">
                        <a-statistic
                            title="本周任务平均处理时间"
                            value="32分钟" />
                    </a-col>
                    <a-col flex="1">
                        <a-statistic
                            title="本周完成任务数"
                            value="24个任务" />
                    </a-col>
                    <a-col flex="1">
                        <a-statistic
                            title="异常（个）"
                            value="1" />
                    </a-col>
                </a-row>
            </a-card>

            <a-card
                class="mt-8-2"
                title="动态">
                <a-list
                    :data-source="listData"
                    :loading="loading"
                    item-layout="horizontal">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta :description="item.datetime">
                                <template #avatar>
                                    <a-avatar :src="item.avatar" />
                                </template>
                                <template #title>
                                    {{ item.title }}
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
        <a-col :lg="6">
            <a-card title="关于">
                <div>高性能 / 精致 / 优雅。基于 vue3 + ant-design-vue 的中后台前端解决方案。</div>
            </a-card>
            <a-card
                class="mt-8-2"
                title="版本信息">
                <a-result
                    :sub-title="`最新版本 ${version}`"
                    :title="`${title} ${version}`">
                    <template #icon>
                        <img
                            :src="assets('upgrade.svg')"
                            alt="" />
                    </template>
                </a-result>
            </a-card>
        </a-col>
    </a-row>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { config } from '@/config'
import { useUserStore } from '@/store'
import { assets } from '@/utils'
import { storeToRefs } from 'pinia'
import apis from '@/apis'
import usePagination from '@/hooks/usePagination'

defineOptions({
    name: 'welcome',
})

const userStore = useUserStore()
const { loading, listData, showLoading, hideLoading } = usePagination()
const title = config('app.title')
const { version } = __APP_INFO__

const { userInfo } = storeToRefs(userStore)

// 初始化日期
const selectedDate = ref(dayjs().toDate())

const selectedMomentDate = ref(dayjs('2015-06', 'YYYY-MM'))
console.log('selectedMomentDate:', selectedMomentDate.value.format('YYYY-MM-DD'))

// 处理日期变化
const handleDateChange = (date) => {
    selectedDate.value = date
    console.log('选择的日期:', dayjs(date).format('YYYY-MM-DD'))
}

const handleMomentDateChange = (date) => {
    selectedMomentDate.value = date
    console.log('选择的日期:', date.format('YYYY-MM-DD'))
}

getDynamicList()

async function getDynamicList() {
    try {
        showLoading()
        const { code, data } = await apis.common.getDynamicList().catch(() => {
            throw new Error()
        })
        hideLoading()
        if (config('http.code.success') === code) {
            listData.value = data
        }
    } catch (error) {
        hideLoading()
    }
}
</script>

<style lang="less" scoped></style>
