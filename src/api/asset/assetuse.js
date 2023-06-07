import request from '@/utils/request'

// 获取领用信息
export function listUse (query) {
  return request({
    url: '/asset/assetUse',
    method: 'get',
    params: query
  })
}
// 根据id查询领用信息
export function listUseById (id) {
  return request({
    url: '/asset/assetUse/' + id,
    method: 'get'
  })
}
// 查询状态列表
export function useStatusList () {
  return request({
    url: '/asset/assetUse/status',
    method: 'get'
  })
}
// 新增领用信息
export function addUse (data) {
  return request({
    url: '/asset/assetUse',
    method: 'post',
    data: data
  })
}
// 退库
export function StockReturn (id) {
  return request({
    url: '/asset/assetUse/' + id,
    method: 'put'
  })
}
// 修改领用信息
export function updateUse (data) {
  return request({
    url: '/asset/assetUse',
    method: 'put',
    data: data
  })
}
// 删除领用信息
export function delUse (id) {
  return request({
    url: '/asset/assetUse/' + id,
    method: 'delete'
  })
}
