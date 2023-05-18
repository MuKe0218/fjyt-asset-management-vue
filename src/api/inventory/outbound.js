import request from '@/utils/request'

// 获取出库单列表
export function getOutboundList (query) {
  return request({
    url: '/asset/outbound',
    method: 'get',
    params: query
  })
}
// 根据id获取出库单详情
export function getOutboundDetail (id) {
  return request({
    url: '/asset/outbound/' + id,
    method: 'get'
  })
}
