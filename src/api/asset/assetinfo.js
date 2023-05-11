import request from '@/utils/request'

// 获取资产信息
export function listAsset (query) {
  return request({
    url: '/asset/assetInfo',
    method: 'get',
    params: query
  })
}
// 获取资产信息 无分页
export function listAssetWithoutPage (query) {
  return request({
    url: '/asset/assetInfo/list',
    method: 'get',
    params: query
  })
}
// 根据id查询资产信息
export function listAssetById (id) {
  return request({
    url: '/asset/assetInfo/' + id,
    method: 'get'
  })
}
// 新增资产信息
export function addAsset (data) {
  return request({
    url: '/asset/assetInfo',
    method: 'post',
    data: data
  })
}
// 修改资产信息
export function updateAsset (data) {
  return request({
    url: '/asset/assetInfo',
    method: 'put',
    data: data
  })
}
// 删除资产信息
export function delAsset (id) {
  return request({
    url: '/asset/assetInfo/' + id,
    method: 'delete'
  })
}
// 查询资产状态列表
export function getStatusList () {
  return request({
    url: '/asset/assetInfo/status',
    method: 'get'
  })
}
// 查询创建方式列表
export function getCreateWayList () {
  return request({
    url: '/asset/assetInfo/createWay',
    method: 'get'
  })
}
