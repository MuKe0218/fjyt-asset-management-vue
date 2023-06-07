import request from '@/utils/request'

// 获取借用信息
export function listBorrow (query) {
  return request({
    url: '/asset/assetBorrow',
    method: 'get',
    params: query
  })
}
// 根据id查询借用信息
export function listBorrowById (id) {
  return request({
    url: '/asset/assetBorrow/' + id,
    method: 'get'
  })
}
// 查询状态列表
export function borrowStatusList () {
  return request({
    url: '/asset/assetBorrow/status',
    method: 'get'
  })
}
// 新增借用信息
export function addBorrow (data) {
  return request({
    url: '/asset/assetBorrow',
    method: 'post',
    data: data
  })
}
// 归还
export function assetReturn (id) {
  return request({
    url: '/asset/assetBorrow/' + id,
    method: 'put'
  })
}
// 修改借用信息
export function updateBorrow (data) {
  return request({
    url: '/asset/assetBorrow',
    method: 'put',
    data: data
  })
}
// 删除借用信息
export function delBorrow (id) {
  return request({
    url: '/asset/assetBorrow/' + id,
    method: 'delete'
  })
}
