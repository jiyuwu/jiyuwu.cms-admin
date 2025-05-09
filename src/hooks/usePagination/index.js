import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default (options = {}) => {
    const { t } = useI18n()
    const loading = ref(false)
    const listData = ref([])
    const searchFormData = ref({})
    const paginationState = reactive({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => t('labels.totalitems', { count: total }), // 使用 t 函数进行翻译
        pageSizeOptions: ['10', '20', '30', '40'],
        ...(options ?? {}),
    })

    /**
     * 重置分页
     */
    function resetPagination() {
        paginationState.total = 0
        paginationState.current = 1
    }

    /**
     * 刷新分页
     * 场景：删除
     * @param {number} count 受影响数量
     */
    function refreshPagination(count = 1) {
        const { total, current, pageSize } = paginationState
        const totalPage = Math.ceil((total - count) / pageSize)
        paginationState.current = current > totalPage ? totalPage : current
    }

    /**
     * 显示 loading
     */
    function showLoading() {
        loading.value = true
    }

    /**
     * 隐藏 loading
     */
    function hideLoading() {
        loading.value = false
    }

    return {
        loading,
        listData,
        searchFormData,
        paginationState,
        resetPagination,
        refreshPagination,
        showLoading,
        hideLoading,
    }
}
