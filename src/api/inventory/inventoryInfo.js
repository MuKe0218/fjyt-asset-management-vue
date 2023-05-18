import request from '@/utils/request'

// 已入库资产名称
export function receivedAssetList (query) {
  return request({
    url: '/asset/inventory/received',
    method: 'get',
    params: query
  })
}
// 未入库资产名称
export function notReceivedAssetList (query) {
  return request({
    url: '/asset/inventory/notReceived',
    method: 'get',
    params: query
  })
}
// 入库操作
export function assetWarehousing (data) {
  return request({
    url: '/asset/inventory',
    method: 'put',
    data: data
  })
}
