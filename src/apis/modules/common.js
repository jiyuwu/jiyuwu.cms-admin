import request from '@/utils/request'

// 获取动态列表
export const getDynamicList = () => request.basic.get('/Base_Db/Dynamic')

// 获取分页列表
export const getPageList = (params) => request.basic.get('/Base_User/Data', params, { enableAbortController: false })
// 删除
export const del = () => request.basic.delete(`/data`)
// 创建
export const create = (params) => request.basic.post('/data', params)
// 更新
export const update = (_, params) => request.basic.put(`/data`, params)

// 获取地区
export const getRegion = (params) => request.basic.get('/region', params)

// 获取选项列表
export const getOptions = (params) => request.basic.get('/common/options', params, { enableAbortController: false })
