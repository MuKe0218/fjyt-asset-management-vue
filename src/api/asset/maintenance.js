import request from '@/utils/request'

// 获取维修信息
export function listMaintenance (query) {
  return request({
    url: '/asset/maintenance',
    method: 'get',
    params: query
  })
}
// 根据id查询维修信息
export function listMaintenanceById (id) {
  return request({
    url: '/asset/maintenance/' + id,
    method: 'get'
  })
}
// 查询状态列表
export function maintenanceStatusList () {
  return request({
    url: '/asset/maintenance/status',
    method: 'get'
  })
}
// 新增维修信息
export function addMaintenance (data) {
  return request({
    url: '/asset/maintenance',
    method: 'post',
    data: data
  })
}
// 修改维修信息
export function updateMaintenance (data) {
  return request({
    url: '/asset/maintenance',
    method: 'put',
    data: data
  })
}
// 删除维修信息
export function delMaintenance (id) {
  return request({
    url: '/asset/maintenance/' + id,
    method: 'delete'
  })
}
