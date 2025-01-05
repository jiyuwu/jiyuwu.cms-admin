import request from '@/utils/request'

// 登录
export const login = (params) => request.basic.post('/Base_User/Login', params)
// 获取用户详情
export const getUserDetail = () => request.basic.get('/Base_User/Detail')
// 获取权限列表
export const getAuthList = () => request.basic.get('/Base_User/Auth')
