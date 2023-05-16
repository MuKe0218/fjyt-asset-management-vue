import request from '@/utils/request'

// 获取省份信息列表
export function getProvince (query) {
  return request({
    url: '/asset/address/province',
    method: 'get',
    params: query
  })
}
// 获取城市信息列表
export function getCity (query) {
  return request({
    url: '/asset/address/city',
    method: 'get',
    params: query
  })
}
// 获取区县信息列表
export function getCounty (query) {
  return request({
    url: '/asset/address/county',
    method: 'get',
    params: query
  })
}
