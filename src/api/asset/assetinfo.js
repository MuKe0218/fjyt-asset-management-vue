import request from '@/utils/request'

// 获取资产信息
export function listAsset (query) {
  return request({
    url: '/asset/assetInfo/list',
    method: 'get',
    params: query
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
export function delAsset (assetId) {
  return request({
    url: '/asset/assetInfo/' + assetId,
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
