import request from '@/utils/request'

// 获取入库单列表
export function getWarehousingList (query) {
  return request({
    url: '/asset/warehousing',
    method: 'get',
    params: query
  })
}
// 根据id获取入库单详情
export function getWarehousingDetail (id) {
  return request({
    url: '/asset/warehousing/' + id,
    method: 'get'
  })
}
