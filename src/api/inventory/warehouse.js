import request from '@/utils/request'

// 获取仓库信息列表
export function listWarehouse (query) {
  return request({
    url: '/asset/warehouse',
    method: 'get',
    params: query
  })
}
// 获取仓库信息列表没哟分页
export function listWarehouseWithoutPage () {
  return request({
    url: '/asset/warehouse/list',
    method: 'get'
  })
}
// 根据id查询领用信息
export function warehouseById (id) {
  return request({
    url: '/asset/warehouse/' + id,
    method: 'get'
  })
}
// 新增仓库
export function addWarehouse (data) {
  return request({
    url: '/asset/warehouse',
    method: 'post',
    data: data
  })
}
// 修改仓库
export function updateWarehouse (data) {
  return request({
    url: '/asset/warehouse',
    method: 'put',
    data: data
  })
}
// 修改状态列表
export function changeStatus (id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/asset/warehouse/changeStatus',
    method: 'put',
    data: data
  })
}
// 删除仓库
export function delWarehouse (id) {
  return request({
    url: '/asset/warehouse/' + id,
    method: 'delete'
  })
}
