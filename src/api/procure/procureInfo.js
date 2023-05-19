import request from '@/utils/request'

// 获取采购单列表
export function getProcureList (query) {
  return request({
    url: '/asset/procure',
    method: 'get'
  })
}
// 根据id获取入库单详情
export function getProcureDetail (id) {
  return request({
    url: '/asset/procure/' + id,
    method: 'get'
  })
}
// 获取状态列表
export function getStatusList () {
  return request({
    url: '/asset/procure/status',
    method: 'get'
  })
}
