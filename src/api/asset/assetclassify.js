import request from '@/utils/request'
/**
 * 获取分类列表
 */
export function listAssetClassify (query) {
  return request({
    url: '/asset/classify/list',
    method: 'get',
    params: query
  })
}
/**
 * 获取分类详情
 */
export function infoAssetClassify (classifyId) {
  return request({
    url: '/asset/classify/' + classifyId,
    method: 'get'
  })
}
/**
 * 新增分类
 */
export function addAssetClassify (data) {
  return request({
    url: '/asset/classify',
    method: 'post',
    data: data
  })
}
/**
 * 修改分类
 */
export function updateAssetClassify (data) {
  return request({
    url: '/asset/classify',
    method: 'put',
    data: data
  })
}
// 删除分类
export function delAssetClassify (classifyId) {
  return request({
    url: '/asset/classify/' + classifyId,
    method: 'delete'
  })
}
