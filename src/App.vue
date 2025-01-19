<template>
    <a-config-provider v-bind="configProviderAttrs">
        <el-config-provider :locale="configProviderAttrs.elementLocale">
            <router-view />
        </el-config-provider>
    </a-config-provider>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useConfigProvider } from '@/hooks'

dayjs.locale('zh-cn')

const { configProviderAttrs } = useConfigProvider()
</script>

<style lang="less"></style>
