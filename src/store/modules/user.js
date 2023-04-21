// import { login } from '@/api/login'

import { login } from '../../api/login'

import { getToken, setToken, setExpiresIn } from '@/utils/auth'
const user = {
  state: { // 用于存储数据
    token: getToken(), // getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },
  mutations: {}, // 同步更改数据
  actions: { // 异步更数据
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default user
